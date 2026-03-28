import express from "express";
const router = express.Router();
import { uploadCloudinary, cloudinary } from "../utils/cloudinaryconfig.js";
import Image from "../models/image.js"; 
import { protect } from "../middleware/authMiddleware.js";

// --- UPLOAD MULTIPLE ---
router.post("/upload-multiple", protect, uploadCloudinary.array("images", 10), async (req, res) => {
  try {
    // req.files contient maintenant les URLs Cloudinary générées par le middleware
    const imagePromises = req.files.map(file => {
      const newImage = new Image({
        title: file.originalname,
        url: file.path, // C'est l'URL sécurisée HTTPS de Cloudinary
        publicId: file.filename // Important pour la suppression plus tard
      });
      return newImage.save();
    });

    const savedImages = await Promise.all(imagePromises);
    res.status(201).json(savedImages);
  } catch (error) {
    res.status(500).json({ message: "Erreur Cloudinary", error: error.message });
  }
});

// --- SUPPRESSION ---
router.delete("/:id", protect, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image introuvable" });

    // 1. Supprimer de Cloudinary via le publicId
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // 2. Supprimer de MongoDB
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Image supprimée de Cloudinary et de la base !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error: error.message });
  }
});

export default router;