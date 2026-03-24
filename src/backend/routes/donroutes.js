import express from "express";
import Don from "../models/don.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Ajouter un don (Public)
router.post("/", async (req, res) => {
  try {
    const { nom, numero, montant } = req.body;

    // 1. Validation de sécurité
    if (!nom || !numero || !montant) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    // 2. Création et sauvegarde en base de données
    const nouveauDon = new Don({
      nom,
      numero,
      montant: Number(montant) // On s'assure que c'est un nombre
    });

    const savedDon = await nouveauDon.save();

    // 3. 📣 SIGNAL EN DIRECT (Seulement après la sauvegarde réussie)
    const io = req.app.get("socketio");
    if (io) {
      io.emit("nouveauDon", savedDon); 
    }

    // 4. RÉPONSE UNIQUE AU CLIENT
    res.status(201).json({
      success: true,
      message: "Merci pour votre générosité ! ❤️",
      don: savedDon
    });

  } catch (error) {
    console.error("Erreur Don:", error);
    res.status(500).json({ message: "Erreur lors du traitement du don." });
  }
});

// 📥 Voir tous les dons (Protégé - Admin uniquement)
router.get("/", protect, async (req, res) => {
  try {
    const dons = await Don.find().sort({ createdAt: -1 });
    res.json(dons);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des dons." });
  }
});

export default router;