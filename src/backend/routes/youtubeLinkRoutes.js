import express from "express";
import Youtube from "../models/YoutubeLink.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Récupérer le lien (Public)
router.get("/live", async (req, res) => {
  try {
    let youtubeLink = await Youtube.findOne({ key: "live_settings" });
    if (!youtubeLink) youtubeLink = await Youtube.create({ key: "live_settings" });
    res.json(youtubeLink);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modifier le lien (Privé - Admin uniquement)
router.put("/live", protect, async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    const youtubeLink = await Youtube.findOneAndUpdate(
      { key: "live_settings" },
      { youtubeUrl, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ message: "Lien mis à jour", youtubeLink });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

export default router;