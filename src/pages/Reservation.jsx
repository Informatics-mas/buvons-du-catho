import { useState, useEffect } from "react";
import { CheckCircle2, Store, AlertCircle, Loader2 } from "lucide-react";
// 1. Importation de la Navbar
import Navbar from "../components/Navbar"; 

export default function Reservation() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    numero: "",
    email: "",
    produit: "", 
    nombreStands: 1,
  });

  const API_BASE_URL = "http://localhost:5000/api"; 

  useEffect(() => {
    fetch("http://localhost:5000/api/stand-types")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des produits");
        return res.json();
      })
      .then((data) => setProduits(data))
      .catch((err) => setError(err.message));
  }, []);

  const produitSelectionne = produits.find((p) => p._id === form.produit);
  const totalAPayer = produitSelectionne ? produitSelectionne.prix * form.nombreStands : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (produitSelectionne && form.nombreStands > produitSelectionne.totalDisponible) {
      alert(`Désolé, il ne reste que ${produitSelectionne.totalDisponible} stand(s) disponible(s).`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setForm({ nom: "", numero: "", email: "", produit: "", nombreStands: 1 });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erreur lors de la réservation.");
      }
    } catch (err) {
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        {/* Ajout de la Navbar même sur l'écran de succès */}
        <Navbar />
        <div className="min-h-screen bg-[#0B1A3B] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-black mb-4">Demande Envoyée !</h2>
            <p className="text-gray-400 mb-8">
              Votre réservation est en attente de validation. Vous recevrez un email de confirmation très bientôt.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all"
            >
              Faire une autre réservation
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 2. Insertion de la Navbar en haut du rendu */}
      <Navbar />
      
      <div className="min-h-screen bg-[#0B1A3B] py-24 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-yellow-500 mb-4 italic uppercase">
              Réserver un Stand
            </h1>
            <p className="text-gray-400 text-lg">Rejoignez l'aventure Buvons du Catho et exposez vos produits.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl">
            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3"><AlertCircle /> {error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Nom complet / Structure</label>
                  <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full p-4 rounded-xl bg-black/20 border border-white/10 focus:border-yellow-500 outline-none transition-all" placeholder="Ex: Jean Bosco" />
                </div>
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Numéro WhatsApp</label>
                  <input type="tel" name="numero" value={form.numero} onChange={handleChange} required className="w-full p-4 rounded-xl bg-black/20 border border-white/10 focus:border-yellow-500 outline-none transition-all" placeholder="0700000000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-4 rounded-xl bg-black/20 border border-white/10 focus:border-yellow-500 outline-none transition-all" placeholder="votre@email.com" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Type de produit / Stand</label>
                  <select name="produit" value={form.produit} onChange={handleChange} required className="w-full p-4 rounded-xl bg-black/20 border border-white/10 focus:border-yellow-500 outline-none transition-all text-white">
                    <option value="">Sélectionnez un produit</option>
                    {produits.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nom} ({p.prix.toLocaleString()} FCFA)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Nombre de stands</label>
                  <input type="number" name="nombreStands" min="1" value={form.nombreStands} onChange={handleChange} required className="w-full p-4 rounded-xl bg-black/20 border border-white/10 focus:border-yellow-500 outline-none transition-all" />
                </div>

                {produitSelectionne && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-bold text-yellow-500 uppercase">Total à payer :</span>
                    <span className="text-2xl font-black text-white">{totalAPayer.toLocaleString()} FCFA</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || produits.length === 0} className="md:col-span-2 w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 hover:scale-[1.01] transition-all shadow-xl disabled:opacity-30 flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : "CONFIRMER MA RÉSERVATION"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}