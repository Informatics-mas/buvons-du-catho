import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Fonction coeur qui utilise le fetch natif de Node 22
const callBrevoAPI = async (payload) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Buvons du Catho", email: process.env.EMAIL_USER },
        ...payload
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur API Brevo");
    }
    
    return await response.json();
  } catch (error) {
    console.error("❌ Erreur d'envoi via API HTTP :", error.message);
  }
};

// --- 1. EMAIL DE VALIDATION ---
export const sendValidationEmail = async (reservation, produit) => {
  await callBrevoAPI({
    to: [{ email: reservation.email, name: reservation.nomResponsable }],
    subject: "Confirmation : Votre stand est validé ! 🎉",
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2 style="color: #2e7d32;">Félicitations ! Votre demande de stand a été validée.</h2>
        <p>Bonjour <strong>${reservation.nomResponsable}</strong>,</p>
        <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
        <ul>
          <li><strong>Produit :</strong> ${produit.nom}</li>
          <li><strong>Nombre de stands :</strong> ${reservation.nombreStands}</li>
          <li><strong>Emplacement :</strong> ${reservation.emplacement || "À confirmer"}</li>
        </ul>
        <p>Veuillez effectuer votre paiement sur ce numéro : <strong>0700000000</strong></p>
        <p>Merci pour votre participation 🙏</p>
      </div>
    `
  });
  console.log("✅ Email de VALIDATION envoyé via API HTTP");
};

// --- 2. EMAIL DE REFUS ---
export const sendRefusEmail = async (reservation) => {
  await callBrevoAPI({
    to: [{ email: reservation.email, name: reservation.nomResponsable }],
    subject: "Information concernant votre demande de stand",
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2>Mise à jour de votre demande</h2>
        <p>Bonjour ${reservation.nomResponsable},</p>
        <p>Nous avons bien reçu votre demande pour <strong>Buvons du Catho</strong>.</p>
        <p>Malheureusement, nous ne pouvons pas l'accepter pour cette édition (stock épuisé ou critères).</p>
        <p>Merci pour votre compréhension et que Dieu vous bénisse 🙏</p>
      </div>
    `
  });
  console.log("✅ Email de REFUS envoyé via API HTTP");
};

// --- 3. EMAIL DE CONFIRMATION (RÉCEPTION) ---
export const sendConfirmationEmail = async (destinataire, nomExposant, typeStand) => {
  await callBrevoAPI({
    to: [{ email: destinataire, name: nomExposant }],
    subject: "Confirmation de votre demande - Buvons du Catho",
    htmlContent: `
      <div style="background-color: #0B1A3B; padding: 40px; font-family: sans-serif; text-align: center; color: white;">
        <h1 style="color: #EAB308;">DEMANDE REÇUE !</h1>
        <p>Bonjour <strong>${nomExposant}</strong>, votre demande pour un stand <strong>${typeStand}</strong> est en cours de traitement.</p>
        <p>Nous reviendrons vers vous très prochainement.</p>
      </div>
    `
  });
  console.log("✅ Email de CONFIRMATION envoyé via API HTTP");
};