import mongoose from "mongoose";

const donSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom du donateur est requis"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "L'email est requis pour le reçu"],
    lowercase: true,
    trim: true
  },
  montant: { 
    type: Number, 
    required: [true, "Le montant du don est obligatoire"],
    min: [1, "Le montant doit être au moins de 1"] // Empêche les dons de 0 ou négatifs
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