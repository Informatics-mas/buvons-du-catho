import express from "express";
import Reservation from "../models/reservation.js";
import StandType from "../models/StandType.js"; // 👈 On utilise StandType
import { protect } from "../middleware/authMiddleware.js";
import { sendValidationEmail, sendRefusEmail, sendConfirmationEmail } from "../utils/sendEmail.js";
import ExcelJS from "exceljs";

const router = express.Router();

//  PUBLIC — Création réservation
router.post("/", async (req, res) => {
  try {
    const { nom, numero, email, produit, nombreStands, nomStructure, nomResponsable, motivation } = req.body;

    // 1. Vérifier si le type de stand existe
    const standChoisi = await StandType.findById(produit);
    if (!standChoisi) {
      return res.status(404).json({ message: "Catégorie de stand introuvable" });
    }

    // 2. Vérifier le stock disponible
    if (standChoisi.totalDisponible < nombreStands) {
      return res.status(400).json({
        message: `Stock insuffisant. Il ne reste que ${standChoisi.totalDisponible} stand(s).`,
      });
    }

    // 3. Calculer le montant automatique
    const montantTotal = standChoisi.prix * (Number(nombreStands) || 1);

    // 4. Créer l'unique réservation avec toutes les données
    const reservation = new Reservation({
      nomResponsable: nomResponsable || nom, // Sécurité si l'un ou l'autre est envoyé
      nomStructure,
      numero,
      email,
      produit, // ID du StandType pour le populate
      typeStand: standChoisi.nom, // On garde le nom en texte pour l'affichage rapide
      nombreStands,
      montantTotal,
      motivation,
      statut: "en_attente"
    });

    const savedReservation = await reservation.save();

    // 5. Envoi de l'email (en arrière-plan)
    sendConfirmationEmail(
      savedReservation.email, 
      savedReservation.nomResponsable, 
      standChoisi.nom
    ).catch(err => console.error("📧 Erreur mail:", err.message));

    res.status(201).json({
      success: true,
      message: `Demande envoyée ! Montant total estimé : ${montantTotal.toLocaleString()} FCFA`,
      reservation: savedReservation
    });

  } catch (error) {
    console.error("❌ Erreur Réservation:", error);
    res.status(500).json({ message: "Erreur lors de la réservation", error: error.message });
  }
});

// ... reste des routes (pense à changer ProduitStand par StandType dans le PUT /valider)

// ADMIN — Voir toutes les réservations (Protégé)
router.get("/", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("produit")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📥 ADMIN — Exporter en Excel (Protégé)
router.get("/export", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("produit");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reservations");

    sheet.columns = [
      { header: "Nom", key: "nom", width: 20 },
      { header: "Numéro", key: "numero", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Produit", key: "produit", width: 20 },
      { header: "Stands", key: "stands", width: 10 },
      { header: "Montant Total (FCFA)", key: "montant", width: 20 }, // Nouvelle colonne
      { header: "Statut", key: "statut", width: 12 },
      { header: "Emplacement", key: "emplacement", width: 15 }
    ];

    reservations.forEach(r => {
      sheet.addRow({
        nom: r.nom,
        numero: r.numero,
        email: r.email,
        produit: r.produit?.nom || "N/A",
        stands: r.nombreStands,
        montant: r.montantTotal || 0, // Ajout de la valeur
        statut: r.statut,
        emplacement: r.emplacement || "Non assigné"
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reservations.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'export Excel" });
  }
});

// 🔐 ADMIN — Valider et Assigner Emplacement
router.put("/valider/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("produit");
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    if (reservation.statut === "valide") return res.status(400).json({ message: "Déjà validée" });

    const produit = await StandType.findById(reservation.produit._id);
    if (produit.totalDisponible < reservation.nombreStands) {
      return res.status(400).json({ message: "Stock insuffisant pour valider cette commande." });
    }

    // Attribution automatique de l'emplacement
    const lastReservation = await Reservation.findOne({ emplacement: { $exists: true, $ne: "Non assigné" } }).sort({ emplacement: -1 });
    let newNumber = 1;
    if (lastReservation && lastReservation.emplacement) {
      const parts = lastReservation.emplacement.split("-");
      newNumber = parseInt(parts[1]) + 1;
    }
    reservation.emplacement = `Stand-${String(newNumber).padStart(2, "0")}`;

    // Mise à jour du stock et du statut
    produit.totalDisponible -= reservation.nombreStands;
    reservation.statut = "valide";

    await produit.save();
    await reservation.save();

    // Envoi de l'email
    try {
        await sendValidationEmail(reservation, produit);
    } catch (mailErr) {
        console.error("Email non envoyé.");
    }

    res.json({ message: "Réservation validée.", reservation });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la validation", error: error.message });
  }
});

// 🔐 ADMIN — Refuser
router.put("/refuser/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    reservation.statut = "refuse";
    await reservation.save();

    await sendRefusEmail(reservation);

    res.json({ message: "Réservation refusée et email envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du refus" });
  }
});

export default router;