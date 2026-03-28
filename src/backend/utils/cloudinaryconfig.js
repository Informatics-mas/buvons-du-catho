import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configuration des identifiants (récupérés depuis le .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuration du stockage Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'buvons_du_catho_galerie', // Nom du dossier sur Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formats autorisés
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Optionnel : redimensionne auto
  },
});

export const uploadCloudinary = multer({ storage: storage });

export { cloudinary };