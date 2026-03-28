import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

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
  const nomClient = reservation.nom || "Exposant"; 

  await callBrevoAPI({
    to: [{ email: reservation.email, name: nomClient }],
    subject: "Confirmation : Votre stand est validé ! 🎉",
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2 style="color: #2e7d32;">Félicitations ! Votre demande de stand a été validée.</h2>
        <p>Bonjour <strong>${nomClient}</strong>,</p>
        <p>Nous avons le plaisir de vous confirmer votre réservation :</p>
        <ul>
          <li><strong>Produit :</strong> ${produit?.nom || "Stand"}</li>
          <li><strong>Nombre de stands :</strong> ${reservation.nombreStands}</li>
          <li><strong>Emplacement :</strong> ${reservation.emplacement || "À confirmer"}</li>
        </ul>
        <p>Veuillez effectuer votre paiement sur ce numéro : <strong>0769458746</strong></p>
        <p>Merci pour votre participation 🙏</p>
      </div>
    `
  });
};

// --- 2. EMAIL DE REFUS ---
export const sendRefusEmail = async (reservation) => {
  const nomClient = reservation.nom || "Exposant";
  await callBrevoAPI({
    to: [{ email: reservation.email, name: nomClient }],
    subject: "Information concernant votre demande de stand",
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2>Mise à jour de votre demande</h2>
        <p>Bonjour ${nomClient}, votre demande n'a pas pu être acceptée pour cette édition.</p>
        <p>Merci pour votre compréhension.</p>
      </div>
    `
  });
};

// --- 3. EMAIL DE CONFIRMATION (AVEC BOUTON WHATSAPP) ---
export const sendConfirmationEmail = async (destinataire, reservation, typeStand) => {
  const nomClient = reservation?.nom || "Exposant"; 
  const typeSelectionne = typeStand || "Stand";
  
  // Préparation du lien WhatsApp
  const numeroWhatsApp = "2250769458746";
  const messageWA = `Bonjour ! Je suis ${nomClient}. J'ai effectué une demande de stand (${typeSelectionne}) pour "Buvons du Catho" 🙏.`;
  const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(messageWA)}`;

  await callBrevoAPI({
    to: [{ email: destinataire, name: nomClient }],
    subject: "Demande reçue - Buvons du Catho",
    htmlContent: `
      <div style="background-color: #0B1A3B; padding: 40px; font-family: sans-serif; text-align: center; color: white; border-radius: 10px;">
        <h1 style="color: #EAB308;">DEMANDE REÇUE !</h1>
        <p style="font-size: 16px;">Bonjour <strong>${nomClient}</strong>,</p>
        <p>Votre demande pour un stand <strong>${typeStand}</strong> est en cours de traitement.</p>
        
        <div style="margin-top: 30px;">
          <p style="font-size: 14px; color: #cbd5e1;">Pour accélérer le traitement, vous pouvez nous contacter sur WhatsApp :</p>
          <p>cliquez sur ce <a href="${whatsappUrl}" 
             style="background-color: #25D366; color: white; padding: 2px 5px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; margin-top: 10px;">
            LIEN WHATSAPP
          </a> pour lancer la discussion WhatsApp</p>
        </div>
        
        <p style="margin-top: 40px; font-size: 12px; color: #94a3b8;">L'équipe Buvons du Catho</p>
      </div>
    `
  });
  console.log(`✅ Email de CONFIRMATION envoyé à ${nomClient}`);
};