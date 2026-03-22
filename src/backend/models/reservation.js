import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    numero: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StandType", // 👈 Changé de "ProduitStand" à "StandType"
      required: [true, "Vous devez sélectionner un produit"]
    },
    nombreStands: { type: Number, required: true, min: 1 },
    montantTotal: { type: Number, default: 0 }, // 👈 AJOUTÉ pour stocker le prix calculé
    statut: {
      type: String,
      enum: ["en_attente", "valide", "refuse"],
      default: "en_attente"
    },
    emplacement: { type: String, default: "Non assigné" }
  },
  { timestamps: true }
);

const Reservation = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
export default Reservation;