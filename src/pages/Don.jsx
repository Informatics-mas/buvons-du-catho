import { useState } from "react";
import confetti from "canvas-confetti";
import Navbar from "../components/Navbar"; 

export default function Don() {
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [montant, setMontant] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const paliers = [1000, 5000, 10000, 25000]; 
  const MONTANT_MAX = 1000000; // Limite fixée à 1 Million FCFA

  const lancerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#EAB308', '#FFFFFF', '#0B1A3B'] 
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#EAB308', '#FFFFFF', '#0B1A3B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const redirigerWhatsApp = (nomDonneur, montantDon) => {
    const numeroBrut = "2250769458746"; 
    const message = `Bonjour ! Je suis ${nomDonneur}. Je souhaite faire un don de ${Number(montantDon).toLocaleString()} FCFA pour soutenir votre activité "Buvons du Catho" 🙏.`;
    const whatsappUrl = `https://wa.me/${numeroBrut}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 2500);
  };

  const envoyerDon = async (e) => {
    e.preventDefault();
    
    // Vérifications de sécurité
    if (Number(montant) <= 0) {
        return alert("Le montant doit être supérieur à 0 FCFA.");
    }

    if (Number(montant) > MONTANT_MAX) {
        alert(`Désolé, le montant maximum par don est de ${MONTANT_MAX.toLocaleString()} FCFA. Pour un don plus important, contactez-nous !`);
        return;
    }
    
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("https://buvons-du-catho.onrender.com/api/dons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, numero, montant: Number(montant) }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        lancerConfetti(); 
        redirigerWhatsApp(nom, montant);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Impossible d'enregistrer le don.");
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0B1A3B] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg animate-fadeIn">
            <div className="text-7xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-[#0B1A3B] mb-2">Presque fini, {nom} !</h2>
            <p className="text-gray-600 text-lg mb-8">
              Votre intention de don de <span className="font-bold text-yellow-600 text-2xl">{Number(montant).toLocaleString()} FCFA</span> a été enregistrée.
            </p>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl mb-8 flex items-center justify-center gap-3">
              <span className="animate-pulse text-lg">🚀</span> 
              <span>Redirection vers WhatsApp pour finaliser le paiement...</span>
            </div>
            <button 
              onClick={() => window.location.href = "/"}
              className="text-gray-400 hover:text-[#0B1A3B] transition-colors"
            >
              Retourner à l'accueil
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B1A3B] text-white flex flex-col items-center py-24 px-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 leading-tight">
              Soutenez la <br /> Mission ❤️
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed max-w-md">
              Chaque contribution nous aide à faire de ce festival un moment inoubliable. 🎉
            </p>
            <div className="p-6 border-l-4 border-yellow-500 bg-white/5 rounded-r-2xl italic text-gray-200 text-lg">
              "Chacun doit donner comme il a décidé dans son cœur."
              <p className="not-italic font-bold text-yellow-500 text-sm mt-2">— 2 Corinthiens 9:7</p>
            </div>
          </div>

          <div className="bg-white/5 p-8 md:p-10 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl relative">
            {errorMessage && (
              <div className="absolute -top-12 left-0 right-0 bg-red-500 text-white text-sm p-3 rounded-xl text-center shadow-lg">
                ❌ {errorMessage}
              </div>
            )}

            <form onSubmit={envoyerDon} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold mb-3 text-yellow-500 uppercase">Votre Nom ou Pseudo</label>
                <input
                  type="text"
                  placeholder="Ex: Frère Jean-Baptiste"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#0B1A3B]/50 border border-white/10 text-white focus:border-yellow-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-yellow-500 uppercase">Votre Numero de Telephone</label>
                <input
                  type="tel" // 👈 Type tel pour le clavier numérique sur mobile
                  placeholder="Ex: 0769458746"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-yellow-500 uppercase">Montant du don (Max 1M)</label>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {paliers.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMontant(p)}
                      className={`py-3 rounded-xl border transition-all ${montant == p ? 'bg-yellow-500 border-yellow-500 text-black font-bold' : 'border-white/10 hover:border-yellow-500/50'}`}
                    >
                      {p.toLocaleString()} FCFA
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="Montant libre"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    className="w-full p-5 rounded-xl bg-[#0B1A3B]/50 border border-white/10 text-white focus:border-yellow-500 outline-none text-xl font-bold"
                    required
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">FCFA</span>
                </div>
              </div>

              <button
                disabled={loading || !montant || Number(montant) <= 0}
                className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 active:scale-95 transition-all shadow-xl disabled:opacity-30"
              >
                {loading ? "Traitement... ⏳" : "Confirmer mon Don ✨"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}