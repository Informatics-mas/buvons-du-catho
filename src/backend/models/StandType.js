import mongoose from "mongoose";

const standTypeSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom du type de stand est obligatoire"], 
    unique: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  prix: { 
    type: Number, 
    required: [true, "Le prix de location est obligatoire"],
    min: [0, "Le prix ne peut pas être inférieur à 0"] 
  },
  totalDisponible: { 
    type: Number, 
    required: [true, "Le nombre total de stands de ce type est requis"],
    min: [0, "Le stock ne peut pas être négatif"],
    default: 0 
  },
}, { timestamps: true });

// Sécurité pour l'exportation sur Render
const StandType = mongoose.models.StandType || mongoose.model("StandType", standTypeSchema);

export default StandType;