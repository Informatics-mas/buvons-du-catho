import mongoose from "mongoose";

const produitStandSchema = new mongoose.Schema(
  {
    nomProduit: { type: String, required: true }, // Garba, Tchep...
    prix: { type: Number, required: true },
    totalDisponible: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ProduitStand", produitStandSchema);