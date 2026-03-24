import express from "express";
import Image from "../models/image.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCloudinary } from '../utils/cloudinaryConfig.js';
import { v2 as cloudinary } from 'cloudinary'; // Import pour la suppression

const router = express.Router();

// ➕ AJOUTER IMAGE (Via Cloudinary)
router.post("/", protect, uploadCloudinary.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fichier manquant ou format non supporté" });
    }

    const nouvelleImage = new Image({
      title: req.body.title,
      description: req.body.description || "",
      url: req.file.path, // URL sécurisée Cloudinary
      cloudinary_id: req.file.filename // ID pour la suppression future
    });

    const savedImage = await nouvelleImage.save();
    
    res.status(201).json({
      success: true,
      image: savedImage
    });

  } catch (error) {
    console.error("Erreur Upload Cloudinary:", error);
    res.status(400).json({ 
      success: false, 
      error: "Erreur lors de l'enregistrement sur Cloudinary" 
    });
  }
});

// 📥 RÉCUPÉRER TOUTES LES IMAGES
router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des images" });
  }
});

// ❌ SUPPRIMER IMAGE (DB + Cloudinary)
router.delete("/:id", protect, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: "Image introuvable" });
    }

    // 1. Supprimer l'image physiquement sur Cloudinary
    if (image.cloudinary_id) {
      await cloudinary.uploader.destroy(image.cloudinary_id);
    }

    // 2. Supprimer l'entrée dans la base de données
    await Image.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Image supprimée de la base et de Cloudinary" });
  } catch (error) {
    console.error("Erreur Suppression:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});

export default router;