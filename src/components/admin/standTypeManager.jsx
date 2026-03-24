import { useState, useEffect } from "react";
import { Trash2, PlusCircle, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function StandTypeManager() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    nom: "",
    prix: "",
    totalDisponible: "",
    description: "",
  });

  // URL du backend (ajuste si nécessaire pour la prod)
  const API_URL = `${import.meta.env.VITE_API_URL}/stand-types`;

  // 1. Charger les types de stands
  const fetchTypes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // 2. Ajouter un nouveau type
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("adminToken");

    // Conversion forcée en nombres pour éviter les erreurs Mongoose
    const payload = {
      ...form,
      prix: Number(form.prix),
      totalDisponible: Number(form.totalDisponible)
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Catégorie ajoutée avec succès !" });
        setForm({ nom: "", prix: "", totalDisponible: "", description: "" });
        fetchTypes(); // Rafraîchir la liste
      } else {
        // Capture l'erreur de nom unique ou validation
        setMessage({ type: "error", text: data.message || "Une erreur est survenue." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Impossible de contacter le serveur." });
    } finally {
      setBtnLoading(false);
    }
  };

  // 3. Supprimer un type
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ? Cela n'affectera pas les réservations existantes mais empêchera les nouvelles.")) return;

    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTypes(types.filter((t) => t._id !== id));
      }
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-500/20 rounded-2xl">
          <PlusCircle className="text-yellow-500" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Types de Stands</h2>
          <p className="text-gray-400 text-sm">Configurez les tarifs et les stocks par catégorie</p>
        </div>
      </div>

      {/* Message d'état */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slideIn ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nom de la catégorie</label>
          <input
            type="text" placeholder="ex: Restauration VIP"
            className="bg-black/20 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Prix de location (FCFA)</label>
          <input
            type="number" placeholder="ex: 50000"
            className="bg-black/20 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
            value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre de stands disponibles</label>
          <input
            type="number" placeholder="ex: 10"
            className="bg-black/20 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
            value={form.totalDisponible} onChange={e => setForm({ ...form, totalDisponible: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description courte</label>
          <textarea
            placeholder="Détails sur l'emplacement ou les avantages..."
            className="bg-black/20 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-500 outline-none transition-all h-24 resize-none"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button 
          disabled={btnLoading}
          className="md:col-span-2 bg-yellow-500 text-black font-black p-4 rounded-xl hover:bg-yellow-400 transition-all flex justify-center items-center gap-2"
        >
          {btnLoading ? <Loader2 className="animate-spin" /> : "ENREGISTRER LA CATÉGORIE"}
        </button>
      </form>

      {/* Liste des types existants */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Catégories actives</h3>
        
        {loading ? (
          <div className="text-center py-10"><Loader2 className="animate-spin text-yellow-500 mx-auto" /></div>
        ) : types.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">Aucune catégorie créée pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {types.map((type) => (
              <div key={type._id} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all group">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{type.nom}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-yellow-500 font-bold text-sm">
                      {type.prix.toLocaleString()} FCFA
                    </span>
                    <span className="text-gray-400 text-sm">
                      Stock: <span className="text-white">{type.totalDisponible}</span>
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(type._id)}
                  className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}