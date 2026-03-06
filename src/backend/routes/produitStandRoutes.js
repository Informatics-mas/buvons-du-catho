import express from "express";
import ProduitStand from "../models/ProduitStand.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔓 PUBLIC — Voir tous les produits
router.get("/", async (req, res) => {
  try {
    const produits = await ProduitStand.find().sort({ createdAt: -1 });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// 🔐 ADMIN — Ajouter produit
router.post("/", protect, async (req, res) => {
  try {
    const { nomProduit, prix, totalDisponible } = req.body;

    const produit = new ProduitStand({
      nomProduit,
      prix,
      totalDisponible,
    });

    await produit.save();
    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


export default router;