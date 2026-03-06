import mongoose from "mongoose";

const standTypeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  prix: Number,
  totalDisponible: { type: Number, required: true },
}, {timestamps: true});

export default mongoose.model("StandType", standTypeSchema);