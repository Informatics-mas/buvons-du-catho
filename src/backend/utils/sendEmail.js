import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On remonte d'un niveau (de utils/ vers backend/) pour trouver le .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("DEBUG DANS SENDEMAIL - USER :", process.env.EMAIL_USER);

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Utilise SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Vérification de la connexion au démarrage (utile pour le débug sur Render)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Erreur de configuration Email :", error.message);
  } else {
    console.log("📧 Serveur d'emails prêt à envoyer !");
  }
});

export const sendValidationEmail = async (reservation, produit) => {
  try {
    const info = await transporter.sendMail({
      from: `"Buvons du Catho" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Confirmation : Votre stand est validé ! 🎉",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; bg-[#081229]; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2e7d32;">Félicitations ! Votre demande de stand a été validé.</h2>
          <p>Bonjour <strong>${reservation.nom}</strong>,</p>
          <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
          <ul>
            <li><strong>Produit :</strong> ${produit.nom}</li>
            <li><strong>Nombre de stands :</strong> ${reservation.nombreStands}</li>
            <li><strong>Emplacement assigné :</strong> <span style="color: #d32f2f; font-weight: bold;">${reservation.emplacement || "À confirmer sur place"}</span></li>
          </ul>
          <p> veuillez effectuer votre payement sur ce numero : <strong>0700000000</strong> et nous envoyer la preuve de payement par whatsapp sur ce numero ou par email : <strong>${process.env.EMAIL_USER}</strong></p>
          <p>Nous avons hâte de vous retrouver !</p>
          <p>Merci pour votre participation 🙏</p>
          <hr />
          <small>Ceci est un message automatique, merci de ne pas y répondre directement.</small>
        </div>
      `,
    });
    console.log("✅ Email de validation envoyé :", info.messageId);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de validation :", error);
  }
};

export const sendRefusEmail = async (reservation) => {
  try {
    const info = await transporter.sendMail({
      from: `"Buvons du Catho" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Information concernant votre demande de stand",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Mise à jour de votre demande</h2>
          <p>Bonjour ${reservation.nom},</p>
          <p>Nous avons bien reçu votre demande de stand pour l'événement <strong>Buvons du Catho</strong>.</p>
          <p>Après étude, nous sommes au regret de vous informer que votre demande n'a pas pu être acceptée pour cette édition (stock épuisé ou critères de sélection).</p>
          <p>Nous vous remercions pour votre compréhension et espérons vous voir parmi nous en tant que visiteur !</p>
          <p>Que Dieu vous bénisse 🙏</p>
        </div>
      `
    });
    console.log("✅ Email de refus envoyé :", info.messageId);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de refus :", error);
  }
};