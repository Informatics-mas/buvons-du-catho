import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Imports des fichiers de routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import imageroutes from "./routes/imageroutes.js";
import reservatioroute from "./routes/reservatioroute.js";
import donroutes from "./routes/donroutes.js";
import standTypeRoutes from "./routes/standTypeRoutes.js";
import produitStandRoutes from "./routes/produitStandRoutes.js";

// 1. Configurer les variables d'environnement
dotenv.config();

// 2. Créer l'application Express (INDISPENSABLE avant les app.use)
const app = express();

// 3. Middlewares (Configuration)
app.use(cors());
app.use(express.json());

// 4. Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté ✅"))
  .catch((err) => console.log("Erreur MongoDB ❌ :", err));

// 5. BRANCHEMENT DES ROUTES EXTERNES
// On les branche APRES avoir créé 'app'
app.use("/api/auth", authRoutes);
app.use("/api/images", imageroutes);
app.use("/api/reservations", reservatioroute);
app.use("/api/dons", donroutes);
app.use("/api/stand-types", standTypeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/produits", produitStandRoutes);

// Note : Comme tu utilises des fichiers de routes externes (imageroutes, donroutes, etc.), 
// tu n'as normalement plus besoin d'écrire les app.get("/api/images") ici, 
// car ils sont déjà définis à l'intérieur de tes fichiers dans le dossier ./routes/

// 6. DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
