import express from "express";
import StandType from "../models/StandType.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔓 PUBLIC — voir les types disponibles
router.get("/", async (req, res) => {
  const stands = await StandType.find();
  res.json(stands);
});


// 🔐 ADMIN — créer type
router.post("/", protect, async (req, res) => {
  const { nom, description, prix, totalDisponible } = req.body;

  const stand = new StandType({
    nom,
    description,
    prix,
    totalDisponible,
  });

  await stand.save();
  res.status(201).json(stand);
});


// 🔐 ADMIN — modifier
router.put("/:id", protect, async (req, res) => {
  const stand = await StandType.findById(req.params.id);

  if (!stand) return res.status(404).json({ message: "Stand introuvable" });

  stand.nom = req.body.nom || stand.nom;
  stand.description = req.body.description || stand.description;
  stand.prix = req.body.prix || stand.prix;
  stand.totalDisponible = req.body.totalDisponible || stand.totalDisponible;

  await stand.save();
  res.json(stand);
});


// 🔐 ADMIN — supprimer
router.delete("/:id", protect, async (req, res) => {
  await StandType.findByIdAndDelete(req.params.id);
  res.json({ message: "Stand supprimé" });
});

export default router;