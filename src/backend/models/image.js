import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Le titre de l'image est requis"],
    trim: true 
  },
  url: { 
    type: String, 
    required: [true, "L'URL de l'image est obligatoire"],
    trim: true
  },
  public_id: { 
    type: String // Très utile si tu utilises Cloudinary plus tard pour supprimer l'image
  }
}, { 
  timestamps: true // Remplace createdAt manuel pour avoir aussi la date de modification
});

// Sécurité pour éviter les erreurs de re-déclaration
const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;