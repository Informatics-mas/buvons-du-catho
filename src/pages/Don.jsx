import { useState } from "react";
import confetti from "canvas-confetti"; // L'effet magique

export default function Don() {
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Nouveaux paliers en FCFA
  const paliers = [1000, 5000, 10000, 15000];

  const lancerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFFFFF'] 
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const envoyerDon = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://buvons-du-catho.onrender.com/api/dons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, montant }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        lancerConfetti(); 
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0B1A3B] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-[#0B1A3B] mb-2">Grand merci, {nom} !</h2>
          <p className="text-gray-600 text-lg mb-6">
            Votre générosité de <span className="font-bold text-cathoGold">{Number(montant).toLocaleString()} FCFA</span> est bien reçue.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-[#0B1A3B] text-white px-8 py-3 rounded-full font-bold hover:bg-cathoGold hover:text-black transition-all"
          >
            Retour à la communauté
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1A3B] text-white flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <h1 className="text-5xl font-bold text-cathoGold mb-6 leading-tight">
            Un geste pour <br /> la Fraternité
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed">
            Votre soutien permet au festival de grandir et de rester accessible à tous.
          </p>
          <div className="mt-8 p-4 border-l-4 border-cathoGold bg-white/5 italic text-gray-400">
            "Donnez, et l'on vous donnera."
          </div>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
          <form onSubmit={envoyerDon} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-cathoGold">Prénom / Pseudo</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B1A3B] border border-white/20 text-white focus:border-cathoGold outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cathoGold">Montant du don (FCFA)</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {paliers.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setMontant(p)}
                    className={`p-3 rounded-lg border border-cathoGold/30 text-sm transition ${montant == p ? 'bg-cathoGold text-black font-bold' : 'hover:bg-cathoGold/10'}`}
                  >
                    {p.toLocaleString()} FCFA
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Autre montant"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#0B1A3B] border border-white/20 text-white focus:border-cathoGold outline-none"
                  required
                />
                <span className="absolute right-4 top-4 text-gray-500 font-bold">FCFA</span>
              </div>
            </div>

            <button
              disabled={loading || !montant}
              className="w-full bg-cathoGold text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Offrir avec joie ❤️"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}