import express from "express";
import Reservation from "../models/reservation.js";
import StandType from "../models/standType.js"; // Attention à la casse pour Render
import { protect } from "../middleware/authMiddleware.js";
import { sendValidationEmail, sendRefusEmail, sendConfirmationEmail } from "../utils/sendEmail.js";
import ExcelJS from "exceljs";

const router = express.Router();

// --- PUBLIC — Création réservation ---
router.post("/", async (req, res) => {
  try {
    const { nom, numero, email, produit, nombreStands, nomStructure, nomResponsable, motivation } = req.body;

    // 1. Vérifier le type de stand
    const standChoisi = await StandType.findById(produit);
    if (!standChoisi) {
      return res.status(404).json({ message: "Catégorie de stand introuvable" });
    }

    // 2. Vérifier le stock
    if (standChoisi.totalDisponible < nombreStands) {
      return res.status(400).json({
        message: `Stock insuffisant. Il ne reste que ${standChoisi.totalDisponible} stand(s).`,
      });
    }

    // 3. Calcul du montant
    const montantTotal = standChoisi.prix * (Number(nombreStands) || 1);

    // 4. Création de la réservation unique
    const reservation = new Reservation({
      nomResponsable: nomResponsable || nom,
      nomStructure,
      numero,
      email,
      produit,
      typeStand: standChoisi.nom,
      nombreStands,
      montantTotal,
      motivation,
      statut: "en_attente"
    });

    const savedReservation = await reservation.save();

    // 5. 📣 SIGNAL EN DIRECT (Avant la réponse HTTP)
    const io = req.app.get("socketio");
    if (io) {
      // On envoie la réservation sauvegardée pour l'admin
      io.emit("nouvelleReservation", savedReservation);
    }

    // 6. Envoi de l'email en tâche de fond
    sendConfirmationEmail(
      savedReservation.email, 
      savedReservation.nomResponsable, 
      standChoisi.nom
    ).catch(err => console.error("📧 Erreur mail:", err.message));

    // 7. UNE SEULE RÉPONSE HTTP ICI
    res.status(201).json({
      success: true,
      message: `Demande envoyée ! Montant total estimé : ${montantTotal.toLocaleString()} FCFA`,
      reservation: savedReservation
    });

  } catch (error) {
    console.error("❌ Erreur Réservation:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Erreur lors de la réservation", error: error.message });
    }
  }
});

// --- ADMIN — Voir toutes les réservations ---
router.get("/", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("produit")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- 📥 ADMIN — Exporter en Excel ---
router.get("/export", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("produit");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reservations");

    sheet.columns = [
      { header: "Responsable", key: "nom", width: 25 },
      { header: "Structure", key: "structure", width: 25 },
      { header: "Numéro", key: "numero", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Type Stand", key: "type", width: 20 },
      { header: "Stands", key: "nb", width: 10 },
      { header: "Montant (FCFA)", key: "montant", width: 20 },
      { header: "Motivation", key: "motivation", width: 40 },
      { header: "Statut", key: "statut", width: 12 },
      { header: "Emplacement", key: "emplacement", width: 15 }
    ];

    reservations.forEach(r => {
      sheet.addRow({
        nom: r.nomResponsable,
        structure: r.nomStructure,
        numero: r.numero,
        email: r.email,
        type: r.produit?.nom || r.typeStand,
        nb: r.nombreStands,
        montant: r.montantTotal || 0,
        motivation: r.motivation || "N/A",
        statut: r.statut,
        emplacement: r.emplacement || "Non assigné"
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=reservations-festival.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'export" });
  }
});

// --- 🔐 ADMIN — Valider et Assigner Emplacement ---
router.put("/valider/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("produit");
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    if (reservation.statut === "valide") return res.status(400).json({ message: "Déjà validée" });

    const produit = await StandType.findById(reservation.produit._id);
    if (!produit || produit.totalDisponible < reservation.nombreStands) {
      return res.status(400).json({ message: "Stock insuffisant." });
    }

    // Auto-incrémentation de l'emplacement
    const lastRes = await Reservation.findOne({ emplacement: { $regex: /^Stand-/ } }).sort({ emplacement: -1 });
    let nextNum = 1;
    if (lastRes && lastRes.emplacement) {
      nextNum = parseInt(lastRes.emplacement.split("-")[1]) + 1;
    }
    
    reservation.emplacement = `Stand-${String(nextNum).padStart(2, "0")}`;
    reservation.statut = "valide";
    produit.totalDisponible -= reservation.nombreStands;

    await produit.save();
    await reservation.save();

    await sendValidationEmail(reservation, produit).catch(() => {});

    res.json({ success: true, message: "Validé !", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur validation" });
  }
});

// --- 🔐 ADMIN — Refuser ---
router.put("/refuser/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Introuvable" });

    reservation.statut = "refuse";
    await reservation.save();
    await sendRefusEmail(reservation).catch(() => {});

    res.json({ message: "Refusé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur refus" });
  }
});

export default router;