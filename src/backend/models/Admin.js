import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Transforme "Admin@Test.com" en "admin@test.com"
    trim: true       // Enlève les espaces inutiles avant ou après
  },
  password: { 
    type: String, 
    required: true 
  },
}, { 
  timestamps: true // Ajoute automatiquement "createdAt" et "updatedAt" (utile pour savoir quand un admin a été créé)
});

// Sécurité pour éviter les erreurs de re-déclaration du modèle par Mongoose
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;