import { useState, useEffect } from "react";
import { Trash2, PlusCircle, AlertCircle, CheckCircle2, Loader2, Edit3, X, Save } from "lucide-react";

export default function StandTypeManager() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // État pour l'édition
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    nom: "", prix: "", totalDisponible: "", description: "",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/stand-types`;

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

  useEffect(() => { fetchTypes(); }, []);

  // --- LOGIQUE DE MODIFICATION ---
  const startEditing = (type) => {
    setEditingId(type._id);
    setEditForm({ ...type }); // On pré-remplit avec les valeurs actuelles
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async (id) => {
    setBtnLoading(true);
    const token = localStorage.getItem("adminToken");
    
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...editForm,
            prix: Number(editForm.prix),
            totalDisponible: Number(editForm.totalDisponible)
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Catégorie mise à jour !" });
        setEditingId(null);
        fetchTypes();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Erreur lors de la mise à jour." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur de connexion." });
    } finally {
      setBtnLoading(false);
    }
  };

  // --- LOGIQUE D'AJOUT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const token = localStorage.getItem("adminToken");
    const payload = { ...form, prix: Number(form.prix), totalDisponible: Number(form.totalDisponible) };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Catégorie ajoutée !" });
        setForm({ nom: "", prix: "", totalDisponible: "", description: "" });
        fetchTypes();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Erreur." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur serveur." });
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTypes();
    } catch (error) { alert("Erreur."); }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
      {/* ... En-tête et Formulaire d'ajout identiques ... */}
      <h2 className="text-2xl font-bold text-white mb-2">Gestion des Stands</h2>
      
      {/* Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Formulaire d'ajout (Condensé pour l'exemple) */}
      {!editingId && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <input type="text" placeholder="Nom" className="bg-black/20 p-4 rounded-xl text-white outline-none border border-white/10 focus:border-yellow-500" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required />
            <input type="number" placeholder="Prix" className="bg-black/20 p-4 rounded-xl text-white outline-none border border-white/10 focus:border-yellow-500" value={form.prix} onChange={e => setForm({...form, prix: e.target.value})} required />
            <input type="number" placeholder="Stock" className="bg-black/20 p-4 rounded-xl text-white outline-none border border-white/10 focus:border-yellow-500" value={form.totalDisponible} onChange={e => setForm({...form, totalDisponible: e.target.value})} required />
            <button className="bg-yellow-500 text-black font-bold p-4 rounded-xl flex justify-center items-center">{btnLoading ? <Loader2 className="animate-spin"/> : "AJOUTER"}</button>
          </form>
      )}

      {/* Liste des Catégories */}
      <div className="space-y-4">
        {loading ? <Loader2 className="animate-spin text-yellow-500 mx-auto" /> : (
          <div className="grid grid-cols-1 gap-3">
            {types.map((type) => (
              <div key={type._id} className={`p-5 rounded-2xl border transition-all ${editingId === type._id ? "bg-yellow-500/10 border-yellow-500" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                
                {editingId === type._id ? (
                  /* --- VUE ÉDITION --- */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" className="bg-black/40 p-2 rounded-lg text-white border border-yellow-500/50" value={editForm.nom} onChange={e => setEditForm({...editForm, nom: e.target.value})} />
                    <input type="number" className="bg-black/40 p-2 rounded-lg text-white border border-yellow-500/50" value={editForm.prix} onChange={e => setEditForm({...editForm, prix: e.target.value})} />
                    <input type="number" className="bg-black/40 p-2 rounded-lg text-white border border-yellow-500/50" value={editForm.totalDisponible} onChange={e => setEditForm({...editForm, totalDisponible: e.target.value})} />
                    <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                        <button onClick={cancelEditing} className="p-2 text-gray-400 hover:text-white flex items-center gap-1"><X size={16}/> Annuler</button>
                        <button onClick={() => handleUpdate(type._id)} className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            {btnLoading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Enregistrer</>}
                        </button>
                    </div>
                  </div>
                ) : (
                  /* --- VUE NORMALE --- */
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-lg">{type.nom}</h4>
                      <p className="text-yellow-500 font-mono">{type.prix.toLocaleString()} FCFA <span className="text-gray-500 ml-2">Stock: {type.totalDisponible}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(type)} className="p-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-all"><Edit3 size={20} /></button>
                      <button onClick={() => handleDelete(type._id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}