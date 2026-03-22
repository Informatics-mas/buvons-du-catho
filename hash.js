import bcrypt from 'bcryptjs';

const passwordClair = "Arthur"; // Choisis ton mot de passe ici
const sel = await bcrypt.genSalt(10);
const motDePasseHache = await bcrypt.hash(passwordClair, sel);

console.log("Voici ton mot de passe haché à copier :");
console.log(motDePasseHache);