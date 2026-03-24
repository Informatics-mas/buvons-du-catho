import { useEffect, useState, useCallback } from "react";

export default function ReservationManager() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_URL}/reservations`;
  const token = localStorage.getItem("adminToken"); // Assure-toi que c'est le même nom que dans Login.js

  // Utilisation de useCallback pour pouvoir rafraîchir la liste après une action
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
  }, [token]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleAction = async (id, action) => {
    const confirmMsg = action === "valider" 
      ? "Valider cette réservation et assigner un stand ?" 
      : "Refuser cette réservation ?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${API_URL}/${action}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert(`Réservation ${action === "valider" ? "validée" : "refusée"} avec succès !`);
        fetchReservations(); // Rafraîchir la liste
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (err) {
      alert("Une erreur technique est survenue.");
    }
  };

  if (loading) return <p className="text-white italic">Chargement des réservations...</p>;

  return (
    <div className="mb-16 p-4 bg-gray-900 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
        🧾 Suivi des Réservations
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-yellow-500 uppercase text-xs">
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Client / Contact</th>
              <th className="py-3 px-2">Produit</th>
              <th className="py-3 px-2">Qté</th>
              <th className="py-3 px-2">Statut / Emplacement</th>
              <th className="py-3 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="py-4 px-2 text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-2">
                  <div className="font-bold">{r.nom}</div>
                  <div className="text-xs text-gray-400">{r.numero}</div>
                </td>
                <td className="py-4 px-2 text-sm">
                  {r.produit?.nom || "Inconnu"}
                </td>
                <td className="py-4 px-2 font-bold">{r.nombreStands}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    r.statut === "valide" ? "bg-green-900 text-green-300" : 
                    r.statut === "refuse" ? "bg-red-900 text-red-300" : "bg-blue-900 text-blue-300"
                  }`}>
                    {r.statut}
                  </span>
                  {r.emplacement && (
                    <div className="text-xs mt-1 text-yellow-500 font-mono font-bold">
                      📍 {r.emplacement}
                    </div>
                  )}
                </td>
                <td className="py-4 px-2 text-center">
                  {r.statut === "en_attente" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleAction(r._id, "valider")}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-all"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleAction(r._id, "refuser")}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-all"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservations.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Aucune réservation pour le moment.</p>
      )}
    </div>
  );
}