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
app.use(cors({
  origin: "http://localhost:5173", // L'adresse de ton frontend React
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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
app.use("/api/stand-types", standTypeRoutes); // 👈 Route unique pour les catégories de stands
app.use("/api/dashboard", dashboardRoutes);

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