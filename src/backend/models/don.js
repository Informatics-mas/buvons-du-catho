import mongoose from "mongoose";

const donSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom du donateur est requis"],
    trim: true 
  },
  numero: { 
    type: Number, 
    required: [true, "le numeros est obligatoire"],
    min: [1, "Le numeros doit être au moins de 1"] // Empêche les dons de 0 ou négatifs
  },
  montant: { 
    type: Number, 
    required: true,
    min: [1000, "Le don minimum est de 1000 FCFA"], // Optionnel : limite basse
    max: [1000000, "Le don ne peut pas dépasser 1 000 000 FCFA"] // Limite haute
  },
  status: {
    type: String,
    enum: ['en_attente', 'confirmé', 'échoué'],
    default: 'confirmé' // Tu pourras changer cela si tu intègres un paiement (ex: PayStack, Cinatpay)
  }
}, { 
  timestamps: true // Utilise timestamps au lieu de createdAt manuel, c'est plus complet
});

const Don = mongoose.models.Don || mongoose.model("Don", donSchema);

export default Don;