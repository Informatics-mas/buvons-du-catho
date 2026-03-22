import express from "express";
import multer from "multer";
import path from "path";
import Image from "../models/image.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configuration du stockage sur ton disque dur
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Les images iront ici
  },
  filename: (req, file, cb) => {
    // On donne un nom unique : date + extension d'origine
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ➕ AJOUTER IMAGE
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier manquant" });

    // On utilise une URL relative pour que ça marche en local et sur Render
    const nouvelleImage = new Image({
      title: req.body.title,
      url: `/uploads/${req.file.filename}` 
    });

    const savedImage = await nouvelleImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📥 RÉCUPÉRER TOUTES LES IMAGES
router.get("/", async (req, res) => {
  const images = await Image.find().sort({ createdAt: -1 });
  res.json(images);
});

// ❌ SUPPRIMER IMAGE
router.delete("/:id", protect, async (req, res) => {
  await Image.findByIdAndDelete(req.params.id);
  res.json({ message: "Image supprimée" });
});

export default router;