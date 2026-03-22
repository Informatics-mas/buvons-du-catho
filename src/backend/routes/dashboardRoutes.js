import express from "express";
import Image from "../models/image.js";
import Reservation from "../models/reservation.js";
import Don from "../models/don.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard/stats - Récupère les statistiques globales
router.get("/stats", protect, async (req, res) => {
  try {
    // 1. Exécution des comptages en parallèle pour plus de rapidité sur Render
    const [totalImages, totalReservations, totalDons, reservationsEnAttente] = await Promise.all([
      Image.countDocuments(),
      Reservation.countDocuments(),
      Don.countDocuments(),
      Reservation.countDocuments({ statut: "en_attente" }) // Bonus : voir le travail restant
    ]);

    // 2. Calcul du montant total des dons
    const aggregation = await Don.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const totalMontant = aggregation[0]?.total || 0;

    // 3. Réponse structurée pour le Frontend
    res.json({
      success: true,
      stats: {
        totalImages,
        totalReservations,
        reservationsEnAttente,
        totalDons,
        totalMontant,
        devise: "FCFA" // Pratique pour l'affichage auto sur le site
      }
    });

  } catch (error) {
    console.error("Erreur Dashboard Stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Impossible de charger les statistiques du tableau de bord." 
    });
  }
});

export default router;