import express from "express";
import StandType from "../models/StandType.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 PUBLIC — Voir les types disponibles (Pour que les gens sachent quoi réserver)
router.get("/", async (req, res) => {
  try {
    const stands = await StandType.find().sort({ prix: 1 }); // Trié du moins cher au plus cher
    res.json(stands);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des types de stands" });
  }
});

// 🔐 ADMIN — Créer un nouveau type de stand
router.post("/", protect, async (req, res) => {
  try {
    const { nom, description, prix, totalDisponible } = req.body;

    if (!nom || prix === undefined || totalDisponible === undefined) {
      return res.status(400).json({ message: "Le nom, le prix et la quantité sont obligatoires." });
    }

    const stand = new StandType({
      nom,
      description,
      prix,
      totalDisponible,
    });

    const savedStand = await stand.save();
    res.status(201).json({ message: "Type de stand créé !", stand: savedStand });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ce nom de stand existe déjà." });
    }
    res.status(500).json({ message: "Erreur serveur lors de la création", error: error.message });
  }
});

// 🔐 ADMIN — Modifier un type de stand
router.put("/:id", protect, async (req, res) => {
  try {
    const standModifie = await StandType.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // "new" renvoie l'objet après modif, "runValidators" vérifie les types
    );

    if (!standModifie) {
      return res.status(404).json({ message: "Type de stand introuvable" });
    }

    res.json({ message: "Type de stand mis à jour ✅", stand: standModifie });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
  }
});

// 🔐 ADMIN — Supprimer un type de stand
router.delete("/:id", protect, async (req, res) => {
  try {
    const standSupprime = await StandType.findByIdAndDelete(req.params.id);
    
    if (!standSupprime) {
      return res.status(404).json({ message: "Type de stand introuvable" });
    }

    res.json({ message: "Type de stand supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
});

// admin modifier un stand
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedType = await StandType.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.json(updatedType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;