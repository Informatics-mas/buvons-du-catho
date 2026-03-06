import express from "express";
import Don from "../models/don.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Ajouter don
router.post("/", protect, async (req, res) => {
  try {
    const don = new Don(req.body);
    const saved = await don.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📥 Voir tous les dons (Admin)
router.get("/", async (req, res) => {
  const dons = await Don.find().sort({ createdAt: -1 });
  res.json(dons);
});

export default router;