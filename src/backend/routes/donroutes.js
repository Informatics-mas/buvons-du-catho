import express from "express";
import Don from "../models/don.js"; // Attention à la majuscule si ton fichier s'appelle Don.js
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Ajouter un don (Public)
// On enlève "protect" ici pour que les visiteurs puissent faire un don !
router.post("/", async (req, res) => {
  try {
    const { nom, email, montant } = req.body;

    // Validation simple pour éviter les dons vides
    if (!nom || !email || !montant) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    const nouveauDon = new Don({
      nom,
      email,
      montant
    });

    const saved = await nouveauDon.save();
    res.status(201).json({
      success: true,
      message: "Merci pour votre générosité ! ❤️",
      don: saved
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du don:", error);
    res.status(400).json({ message: "Erreur lors de l'envoi du don.", error: error.message });
  }
});

// 📥 Voir tous les dons (Protégé - Admin uniquement)
// On ajoute "protect" ici pour que personne d'autre ne voie tes revenus
router.get("/", protect, async (req, res) => {
  try {
    const dons = await Don.find().sort({ createdAt: -1 });
    res.json(dons);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des dons." });
  }
});

export default router;