import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendValidationEmail = async (reservation, produit) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: reservation.email,
    subject: "Validation de votre stand 🎉",
    html: `
      <h2>Votre stand a été validé !</h2>
      <p>Produit : ${produit.nomProduit}</p>
      <p>Nombre de stands : ${reservation.nombreStands}</p>
      <p>Emplacement : ${reservation.emplacement || "À venir"}</p>
      <p>Merci pour votre participation 🙏</p>
    `,
  });
};

export const sendRefusEmail = async (reservation) => {

 await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: reservation.email,
    subject: "Réservation refusée",

    html: `
      <h2>Votre demande de stand</h2>

      <p>Bonjour ${reservation.nom}</p>

      <p>Nous sommes désolés mais votre demande de stand n'a pas pu être acceptée.</p>

      <p>Merci pour votre compréhension.</p>

      <p>Que Dieu vous bénisse 🙏</p>
    `
 });

};