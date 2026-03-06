import express from "express";
import Reservation from "../models/reservation.js";
import ProduitStand from "../models/ProduitStand.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendValidationEmail } from "../utils/sendEmail.js";
import ExcelJS from "exceljs";
import { sendRefusEmail } from "../utils/sendEmail.js";

const router = express.Router();


// 📌 PUBLIC — Création réservation
router.post("/", async (req, res) => {
  try {
    const { nom, numero, email, produit, nombreStands } = req.body;

    const produitChoisi = await ProduitStand.findById(produit);

    if (!produitChoisi) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    if (produitChoisi.totalDisponible < nombreStands) {
      return res.status(400).json({
        message: `Il ne reste que ${produitChoisi.totalDisponible} stand(s) pour ce produit`,
      });
    }

    const reservation = new Reservation({
      nom,
      numero,
      email,
      produit,
      nombreStands,
    });

    await reservation.save();

    await sendValidationEmail(reservation, produit);

    res.status(201).json({
      message: `Demande envoyée. Il reste ${produitChoisi.totalDisponible} stand(s) disponible(s).`,
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// 📥 ADMIN — Voir toutes les réservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("produit")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 📥 ADMIN — Exporter réservations en Excel
router.get("/export", async (req,res)=>{

 const reservations = await Reservation.find().populate("produit");

 const workbook = new ExcelJS.Workbook();
 const sheet = workbook.addWorksheet("Reservations");

 sheet.columns = [
 {header:"Nom", key:"nom"},
 {header:"Email", key:"email"},
 {header:"Produit", key:"produit"},
 {header:"Stands", key:"stands"},
 {header:"Statut", key:"statut"}
 ];

 reservations.forEach(r=>{
   sheet.addRow({
     nom:r.nom,
     email:r.email,
     produit:r.produit.nomProduit,
     stands:r.nombreStands,
     statut:r.statut
   });
 });

 res.setHeader(
  "Content-Type",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
 );

 await workbook.xlsx.write(res);
 res.end();
});

// 🔐 ADMIN — Valider réservation
router.put("/valider/:id", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("produit");

    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    if (reservation.statut === "valide")
      return res.status(400).json({ message: "Déjà validée" });

    const produit = await ProduitStand.findById(reservation.produit._id);

    if (produit.totalDisponible < reservation.nombreStands)
      return res.status(400).json({
        message: "Stock insuffisant pour valider",
      });
    
    // 🔹 Ici on met le code pour l’attribution automatique
    const lastReservation = await Reservation.findOne({
      emplacement: { $exists: true }
    }).sort({ emplacement: -1 });

    let newStand = 1;
    if (lastReservation && lastReservation.emplacement) {
      const lastNumber = parseInt(lastReservation.emplacement.split("-")[1]);
      newStand = lastNumber + 1;
    }

    reservation.emplacement = `Stand-${String(newStand).padStart(2,"0")}`;

    // 🔥 Décrémentation
    produit.totalDisponible -= reservation.nombreStands;
    await produit.save();

    reservation.statut = "valide";
    await reservation.save();

    res.json({ message: "Réservation validée et stock mis à jour" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

//ADMIN REFUS
router.put("/refuser/:id", protect, async (req, res) => {

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation)
    return res.status(404).json({ message: "Reservation introuvable" });

  reservation.statut = "refuse";
  await reservation.save();

  await sendRefusEmail(reservation);

  res.json({ message: "Reservation refusée" });

});

export default router;