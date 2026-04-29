import { useState, useEffect } from "react";
import { Save, Loader2, Facebook } from "lucide-react";

export default function LiveManager() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    // Récupération initiale du lien actuel[cite: 5]
    fetch(`${import.meta.env.VITE_API_URL}/Youtube/live`)
      .then(res => res.json())
      .then(data => setUrl(data.youtubeUrl || ""));
  }, []);

  const handleSave = async () => {
    if (!url.trim()) return alert("Veuillez entrer une URL valide");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Youtube/live`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ youtubeUrl: url }) // Utilisation de la clé définie dans le modèle[cite: 3, 4]
      });

      if (res.ok) {
        alert("Lien du direct Facebook enregistré ! ✨");
        setUrl(""); // <--- ICI : Nettoyage de l'input après succès
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Facebook className="text-blue-500" /> Configuration du Direct Facebook
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez le nouveau lien Facebook ici..."
          className="flex-1 bg-black/20 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
        />
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
          Mettre à jour
        </button>
      </div>
      
      
    </div>
  );
}