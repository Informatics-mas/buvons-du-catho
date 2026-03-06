import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    numero: { type: String, required: true }, // nouveau
    email: { type: String, required: true },
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProduitStand",
      required: true,
    },
    nombreStands: { type: Number, required: true },
    statut: {
      type: String,
      enum: ["en_attente", "valide", "refuse"],
      default: "en_attente",
    },
    emplacement: String,
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);