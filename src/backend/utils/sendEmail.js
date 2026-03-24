import apiInstance from "@getbrevo/brevo";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement du .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration du client Brevo
const defaultClient = apiInstance.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

const apiInstanceTransactional = new apiInstance.TransactionalEmailsApi();

console.log("DEBUG BREVO - SENDER :", process.env.EMAIL_USER);

// --- 1. EMAIL DE VALIDATION ---
export const sendValidationEmail = async (reservation, produit) => {
  const sendSmtpEmail = new apiInstance.SendSmtpEmail();

  sendSmtpEmail.subject = "Confirmation : Votre stand est validé ! 🎉";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": reservation.email, "name": reservation.nomResponsable }];
  
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px; border-radius: 10px;">
      <h2 style="color: #2e7d32;">Félicitations ! Votre demande de stand a été validée.</h2>
      <p>Bonjour <strong>${reservation.nomResponsable}</strong>,</p>
      <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
      <ul>
        <li><strong>Produit :</strong> ${produit.nom}</li>
        <li><strong>Nombre de stands :</strong> ${reservation.nombreStands}</li>
        <li><strong>Emplacement assigné :</strong> <span style="color: #d32f2f; font-weight: bold;">${reservation.emplacement || "À confirmer sur place"}</span></li>
      </ul>
      <p>Veuillez effectuer votre paiement sur ce numéro : <strong>0700000000</strong> et nous envoyer la preuve de paiement par WhatsApp ou par email : <strong>${process.env.EMAIL_USER}</strong></p>
      <p>Merci pour votre participation 🙏</p>
      <hr />
      <small>Ceci est un message automatique de Informatics System.</small>
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
  const sendSmtpEmail = new apiInstance.SendSmtpEmail();

  sendSmtpEmail.subject = "Information concernant votre demande de stand";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": reservation.email, "name": reservation.nomResponsable }];

  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2>Mise à jour de votre demande</h2>
      <p>Bonjour ${reservation.nomResponsable},</p>
      <p>Nous avons bien reçu votre demande de stand pour l'événement <strong>Buvons du Catho</strong>.</p>
      <p>Après étude, nous sommes au regret de vous informer que votre demande n'a pas pu être acceptée pour cette édition.</p>
      <p>Nous vous remercions pour votre compréhension. Que Dieu vous bénisse 🙏</p>
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
  const sendSmtpEmail = new apiInstance.SendSmtpEmail();

  sendSmtpEmail.subject = "Confirmation de votre demande de stand - Buvons du Catho";
  sendSmtpEmail.sender = { "name": "Buvons du Catho", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": destinataire, "name": nomExposant }];

  sendSmtpEmail.htmlContent = `
    <div style="background-color: #0B1A3B; padding: 40px; font-family: sans-serif; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #EAB308; padding: 30px;">
          <h1 style="color: #0B1A3B; margin: 0; font-size: 28px;">DEMANDE REÇUE !</h1>
        </div>
        <div style="padding: 40px; text-align: left; color: #333333;">
          <p style="font-size: 18px;">Bonjour <strong>${nomExposant}</strong>,</p>
          <p>Nous avons bien reçu votre demande de réservation pour un stand <strong>${typeStand}</strong>.</p>
          <p>Notre équipe examine votre dossier. Nous reviendrons vers vous très rapidement.</p>
          <p style="margin-top: 30px;">Merci de participer à cette aventure !</p>
        </div>
        <div style="background-color: #0B1A3B; padding: 20px; color: #ffffff; font-size: 12px; text-align: center;">
          <p>© 2026 Buvons du Catho - Informatics Project</p>
        </div>
      </div>
    </div>
  `;

  try {
    await apiInstanceTransactional.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email de CONFIRMATION envoyé via Brevo");
  } catch (error) {
    console.error("❌ Erreur Brevo Confirmation :", error.message);
  }
};