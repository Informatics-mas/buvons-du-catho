import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import http from "http";

// --- CONFIGURATION DES CHEMINS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialisation de Express
const app = express();

// 2. Chargement du .env (Doit être fait très tôt)
dotenv.config({ path: path.join(__dirname, '.env') });

// 3. Création du serveur HTTP avec l'app Express
const server = http.createServer(app);

// 4. Initialisation de Socket.io avec le serveur HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Rendre 'io' accessible dans toutes les routes via req.app.get("socketio")
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Admin connecté au flux direct ⚡ ID:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Un admin s'est déconnecté 🔌");
  });
});

// --- IMPORTS DES ROUTES ---
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import imageroutes from "./routes/imageroutes.js";
import reservatioroute from "./routes/reservatioroute.js";
import donroutes from "./routes/donroutes.js";
import standTypeRoutes from "./routes/standTypeRoutes.js";

// --- MIDDLEWARES ---
const allowedOrigins = process.env.FRONTEND_URL;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === allowedOrigins || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par la politique CORS de Informatics'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// --- CONNEXION MONGODB ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté avec succès ✅");
  } catch (err) {
    console.error("Erreur de connexion MongoDB ❌ :", err.message);
    process.exit(1);
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
import Don from "./models/don.js";
import Reservation from "./models/reservation.js";
import StandType from "./models/StandType.js"; // Attention à la casse
import { protect } from "./middleware/authMiddleware.js";

app.post("/api/admin/reset-edition", protect, async (req, res) => {
  try {
    await Promise.all([
      Reservation.deleteMany({}),
      Don.deleteMany({})
    ]);

    const stands = await StandType.find({});
    for (let stand of stands) {
      stand.totalDisponible = stand.capaciteTotale || 10; 
      await stand.save();
    }

    res.json({ success: true, message: "L'édition a été réinitialisée ! 🚀" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors du reset." });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 API Buvons du Catho en DIRECT est opérationnelle !");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable." });
});

// --- DÉMARRAGE DU SERVEUR (Utiliser 'server.listen' et non 'app.listen') ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur Informatics en direct sur le port ${PORT} 🚀`);
});