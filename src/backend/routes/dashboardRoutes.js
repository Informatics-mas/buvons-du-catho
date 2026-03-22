import express from "express";
import Image from "../models/image.js";
import Reservation from "../models/reservation.js";
import Don from "../models/don.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard/stats - Récupère les statistiques et les détails pour l'export
router.get("/stats", protect, async (req, res) => {
  try {
    // 1. Exécution de toutes les requêtes en parallèle (Rapidité Render)
    const [
      totalImages, 
      totalReservations, 
      totalDons, 
      aggregation,
      detailsDons,
      detailsReservations
    ] = await Promise.all([
      Image.countDocuments(),
      Reservation.countDocuments(),
      Don.countDocuments(),
      Don.aggregate([{ $group: { _id: null, total: { $sum: "$montant" } } }]),
      // On récupère les listes complètes pour le bouton Excel du Frontend
      Don.find().sort({ createdAt: -1 }),
      Reservation.find().sort({ createdAt: -1 })
    ]);

    const totalMontant = aggregation[0]?.total || 0;

    // 2. Réponse structurée pour le Dashboard et l'Excel
    res.json({
      success: true,
      stats: {
        totalImages,
        totalReservations,
        totalDons,
        totalMontant,
        detailsDons,         // 👈 Envoyé au Front pour XLSX
        detailsReservations, // 👈 Envoyé au Front pour XLSX
        devise: "FCFA"
      }
    });

  } catch (error) {
    console.error("Erreur Dashboard Stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Impossible de charger les statistiques et les détails." 
    });
  }
});

export default router;