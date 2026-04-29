import { useEffect, useState, useCallback } from "react";

export default function ReservationManager() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modification
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const API_URL = `${import.meta.env.VITE_API_URL}/reservations`;
  const token = localStorage.getItem("adminToken");

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // --- LOGIQUE DE MODIFICATION ---

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditData({ ...r }); // On copie les données actuelles dans l'état d'édition
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(editData)
      });

      if (res.ok) {
        alert("Réservation mise à jour !");
        setEditingId(null);
        fetchReservations();
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (err) {
      alert("Erreur technique lors de la mise à jour.");
    }
  };

  // --- LOGIQUE ACTIONS (VALIDER/REFUSER) ---
  const handleAction = async (id, action) => {
    const confirmMsg = action === "valider" ? "Valider ?" : "Refuser ?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${API_URL}/${action}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchReservations();
      }
    } catch (err) {
      alert("Erreur technique.");
    }
  };

  if (loading) return <p className="text-white italic">Chargement...</p>;

  return (
    <div className="mb-16 p-4 bg-gray-900 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
        🧾 Gestion des Réservations
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-yellow-500 uppercase text-xs">
              <th className="py-3 px-2">Client / Contact</th>
              <th className="py-3 px-2">Produit</th>
              <th className="py-3 px-2 text-center">Qté</th>
              <th className="py-3 px-2">Statut / Emplacement</th>
              <th className="py-3 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                
                {editingId === r._id ? (
                  // --- MODE ÉDITION (FORMULAIRE INLINE) ---
                  <>
                    <td className="py-4 px-2">
                      <input 
                        type="text" 
                        className="bg-gray-700 p-1 rounded text-sm w-full"
                        value={editData.nom}
                        onChange={(e) => setEditData({...editData, nom: e.target.value})}
                      />
                      <input 
                        type="text" 
                        className="bg-gray-700 p-1 rounded text-xs w-full mt-1"
                        value={editData.numero}
                        onChange={(e) => setEditData({...editData, numero: e.target.value})}
                      />
                    </td>
                    <td className="py-4 px-2 text-sm">{r.produit?.nom}</td>
                    <td className="py-4 px-2">
                      <input 
                        type="number" 
                        className="bg-gray-700 p-1 rounded text-sm w-16 text-center"
                        value={editData.nombreStands}
                        onChange={(e) => setEditData({...editData, nombreStands: e.target.value})}
                      />
                    </td>
                    <td className="py-4 px-2">
                       <input 
                        type="text" 
                        placeholder="Emplacement (ex: A12)"
                        className="bg-gray-700 p-1 rounded text-sm w-full text-yellow-500 font-bold"
                        value={editData.emplacement || ""}
                        onChange={(e) => setEditData({...editData, emplacement: e.target.value})}
                      />
                    </td>
                    <td className="py-4 px-2 flex gap-2 justify-center">
                      <button onClick={() => handleUpdate(r._id)} className="bg-blue-600 px-2 py-1 rounded text-xs">Enregistrer</button>
                      <button onClick={cancelEdit} className="bg-gray-600 px-2 py-1 rounded text-xs">Annuler</button>
                    </td>
                  </>
                ) : (
                  // --- MODE AFFICHAGE NORMAL ---
                  <>
                    <td className="py-4 px-2">
                      <div className="font-bold">{r.nom}</div>
                      <div className="text-xs text-gray-400">{r.numero}</div>
                    </td>
                    <td className="py-4 px-2 text-sm">{r.produit?.nom || "Inconnu"}</td>
                    <td className="py-4 px-2 text-center font-bold">{r.nombreStands}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        r.statut === "valide" ? "bg-green-900 text-green-300" : 
                        r.statut === "refuse" ? "bg-red-900 text-red-300" : "bg-blue-900 text-blue-300"
                      }`}>
                        {r.statut}
                      </span>
                      {r.emplacement && <div className="text-xs mt-1 text-yellow-500 font-bold">📍 {r.emplacement}</div>}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2 justify-center">
                        {r.statut === "en_attente" && (
                          <>
                            <button onClick={() => handleAction(r._id, "valider")} className="bg-green-600 hover:bg-green-700 text-white font-bold p-1 rounded-xl text-xs">Valider</button>
                            <button onClick={() => handleAction(r._id, "refuser")} className="bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold p-1 rounded-xl text-xs">Refuser</button>
                          </>
                        )}
                        <button 
                          onClick={() => startEdit(r)} 
                          className="text-gray-400 hover:text-white text-xs border border-gray-600 px-2 py-1 rounded-xl transition-all"
                        >
                          Modifier
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}