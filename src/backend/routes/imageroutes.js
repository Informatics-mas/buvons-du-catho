import express from "express";
import Image from "../models/image.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Ajouter image
router.post("/", protect, async (req, res) => {
  try {
    const image = new Image(req.body);
    const savedImage = await image.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📥 Récupérer toutes les images
router.get("/", async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 });
  res.json(images);
});

// ❌ Supprimer image
router.delete("/:id", async (req, res) => {
  await Image.findByIdAndDelete(req.params.id);
  res.json({ message: "Image supprimée" });
});

export default router;