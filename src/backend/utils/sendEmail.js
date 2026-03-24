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
  service: "gmail", // Utiliser 'service' simplifie la configuration pour Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // On retire host/port/secure pour laisser le mode 'service' gérer les meilleurs paramètres
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

export const sendConfirmationEmail = async (destinataire, nomExposant, typeStand) => {
  try {
    const info = await transporter.sendMail({
      from: `"Buvons du Catho" <${process.env.EMAIL_USER}>`,
      to: destinataire,
      subject: "Confirmation de votre demande de stand - Buvons du Catho",
      html: `
        <div style="background-color: #0B1A3B; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            
            <div style="background-color: #EAB308; padding: 30px;">
              <h1 style="color: #0B1A3B; margin: 0; font-size: 28px; text-transform: uppercase;">Demande Reçue !</h1>
            </div>
    
            <div style="padding: 40px; text-align: left; color: #333333; line-height: 1.6;">
              <p style="font-size: 18px;">Bonjour <strong>${nomExposant}</strong>,</p>
              
              <p>Nous avons bien reçu votre demande de réservation pour un stand lors de la prochaine édition de <strong>Buvons du Catho</strong>.</p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #EAB308; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; font-weight: bold; color: #0B1A3B;">Récapitulatif de votre demande :</p>
                <p style="margin: 5px 0 0 0;">Type de Stand : <span style="color: #EAB308; font-weight: bold;">${typeStand}</span></p>
              </div>
    
              <p>Notre équipe administrative examine actuellement votre demande (ainsi que vos motivations). Nous reviendrons vers vous très rapidement par téléphone ou par email pour valider les prochaines étapes.</p>
              
              <p style="margin-top: 30px;">Merci de participer à cette belle aventure évangélique !</p>
            </div>
    
            <div style="background-color: #0B1A3B; padding: 20px; color: #ffffff; font-size: 12px; text-align: center;">
              <p style="margin: 0;">© 2026 Buvons du Catho - Informatics Project</p>
              <p style="margin: 5px 0 0 0;">Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
        </div>
      `,
    });
    console.log("✅ Email de confirmation envoyé :", info.messageId);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de confirmation :", error);
  }
};