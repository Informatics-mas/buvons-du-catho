import mongoose from "mongoose" ; 
const donSchema = new mongoose.Schema ({   
    nom: String , email   : String , montant   : Number ,   createdAt: { 
        type: Date , default: Date.now } , }); 
export default mongoose.model ( "Don" , donSchema );