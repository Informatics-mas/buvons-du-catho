import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// LOGIN - Connexion sécurisée
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérification de l'existence de l'admin (insensible à la casse)
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 2. Comparaison du mot de passe avec le hash en base
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 3. Vérification de la clé secrète JWT
    if (!process.env.JWT_SECRET) {
      console.error("ERREUR : JWT_SECRET manquant sur Render !");
      return res.status(500).json({ message: "Erreur de configuration serveur" });
    }

    // 4. Génération du Token (Valide 24h)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Réponse au Frontend
    res.json({ 
      token, 
      admin: { id: admin._id, email: admin.email },
      message: "Connexion réussie ! 🎉" 
    });

  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ message: "Erreur technique lors de la connexion" });
  }
});

export default router;