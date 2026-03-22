import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();

// --- IMPORTS DES ROUTES ---
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import imageroutes from "./routes/imageroutes.js";
import reservatioroute from "./routes/reservatioroute.js";
import donroutes from "./routes/donroutes.js";
import standTypeRoutes from "./routes/standTypeRoutes.js";

// --- MIDDLEWARES ---

// Liste des origines autorisées
const allowedOrigins = [
  'https://buvons-du-catho.vercel.app', // Ton site en ligne
  'http://localhost:5173'               // Ton environnement local (Vite)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permet les requêtes sans origine (comme Postman ou mobiles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par la politique CORS de Informatics'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre le dossier des images public
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// --- CONNEXION MONGODB ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté avec succès ✅");
  } catch (err) {
    console.error("Erreur de connexion MongoDB ❌ :", err.message);
    process.exit(1); // Arrête le serveur si la DB n'est pas connectée
  }
};
connectDB();

// --- BRANCHEMENT DES ROUTES API ---
app.use("/api/auth", authRoutes);
app.use("/api/images", imageroutes);
app.use("/api/reservations", reservatioroute);
app.use("/api/dons", donroutes);
app.use("/api/stand-types", standTypeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --- ROUTES ADMINISTRATIVES SPÉCIALES ---
// On utilise 'app' ici au lieu de 'router' et on importe les modèles nécessaires
import Don from "./models/don.js";
import Reservation from "./models/reservation.js";
import StandType from "./models/standType.js";
import { protect } from "./middleware/authMiddleware.js"; // Utilise ton middleware de protection

app.post("/api/admin/reset-edition", protect, async (req, res) => {
  try {
    // 1. Supprimer toutes les réservations et les dons
    await Promise.all([
      Reservation.deleteMany({}),
      Don.deleteMany({})
    ]);

    // 2. Remettre les compteurs de stands à leur capacité initiale
    const stands = await StandType.find({});
    for (let stand of stands) {
      // Si tu n'as pas de champ capaciteTotale, on peut mettre une valeur par défaut (ex: 10)
      stand.quantite = stand.capaciteTotale || 10; 
      await stand.save();
    }

    res.json({ success: true, message: "L'édition a été réinitialisée avec succès ! 🚀" });
  } catch (error) {
    console.error("Erreur Reset:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la réinitialisation." });
  }
});

// --- ROUTE DE TEST & ACCUEIL ---
app.get("/", (req, res) => {
  res.send("🚀 API Buvons du Catho est en ligne et fonctionnelle !");
});

// --- GESTION DES ERREURS 404 ---
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable sur le serveur." });
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});
