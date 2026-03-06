import express from "express";
import Image from "../models/image.js";
import Reservation from "../models/reservation.js";
import Don from "../models/don.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
  const totalImages = await Image.countDocuments();
  const totalReservations = await Reservation.countDocuments();
  const totalDons = await Don.countDocuments();

  const totalMontant = await Don.aggregate([
    { $group: { _id: null, total: { $sum: "$montant" } } }
  ]);

  res.json({
    totalImages,
    totalReservations,
    totalDons,
    totalMontant: totalMontant[0]?.total || 0
  });
});

export default router;