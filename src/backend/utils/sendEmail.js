import SibApiV3Sdk from "@getbrevo/brevo"; // Import direct
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement du .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- CONFIGURATION BREVO (Nouvelle méthode compatible Node 22) ---
const apiInstanceTransactional = new SibApiV3Sdk.TransactionalEmailsApi();

// On configure la clé API directement sur l'instance
apiInstanceTransactional.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

console.log("DEBUG BREVO - SENDER :", process.env.EMAIL_USER);

// --- 1. EMAIL DE VALIDATION ---
export const sendValidationEmail = async (reservation, produit) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Confirmation : Votre stand est validé ! 🎉";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": reservation.email, "name": reservation.nomResponsable }];
  
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2 style="color: #2e7d32;">Félicitations ! Votre demande de stand a été validée.</h2>
      <p>Bonjour <strong>${reservation.nomResponsable}</strong>,</p>
      <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
      <ul>
        <li><strong>Produit :</strong> ${produit.nom}</li>
        <li><strong>Nombre de stands :</strong> ${reservation.nombreStands}</li>
        <li><strong>Emplacement :</strong> ${reservation.emplacement || "À confirmer"}</li>
      </ul>
      <p>Merci pour votre participation 🙏</p>
    </div>
  `;

  try {
    await apiInstanceTransactional.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email de VALIDATION envoyé via Brevo");
  } catch (error) {
    console.error("❌ Erreur Brevo Validation :", error.message);
  }
};

// --- 2. EMAIL DE REFUS ---
export const sendRefusEmail = async (reservation) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Information concernant votre demande de stand";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": reservation.email, "name": reservation.nomResponsable }];

  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2>Mise à jour de votre demande</h2>
      <p>Bonjour ${reservation.nomResponsable}, votre demande n'a pas pu être acceptée pour cette édition.</p>
    </div>
  `;

  try {
    await apiInstanceTransactional.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email de REFUS envoyé via Brevo");
  } catch (error) {
    console.error("❌ Erreur Brevo Refus :", error.message);
  }
};

// --- 3. EMAIL DE CONFIRMATION (RECEPTION) ---
export const sendConfirmationEmail = async (destinataire, nomExposant, typeStand) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Confirmation de votre demande - Buvons du Catho";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": destinataire, "name": nomExposant }];

  sendSmtpEmail.htmlContent = `
    <div style="background-color: #0B1A3B; padding: 40px; font-family: sans-serif; text-align: center; color: white;">
      <h1 style="color: #EAB308;">DEMANDE REÇUE !</h1>
      <p>Bonjour <strong>${nomExposant}</strong>, votre demande pour un stand <strong>${typeStand}</strong> est en cours de traitement.</p>
    </div>
  `;

  try {
    await apiInstanceTransactional.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email de CONFIRMATION envoyé via Brevo");
  } catch (error) {
    console.error("❌ Erreur Brevo Confirmation :", error.message);
  }
};