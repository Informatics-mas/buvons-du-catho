import { useEffect, useState } from "react";

export default function DonManager() {
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Récupérer le token stocké lors du login (souvent dans localStorage)
    const token = localStorage.getItem("adminToken");

    fetch(`${import.meta.env.VITE_API_URL}/dons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Crucial pour passer le middleware 'protect'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des dons (vérifiez votre connexion admin).");
        return res.json();
      })
      .then((data) => {
        setDons(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white italic">Chargement des dons en cours...</p>;
  if (error) return <p className="text-red-500 font-bold">⚠️ Erreur : {error}</p>;

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
        💰 Liste des Dons reçus
      </h2>

      {dons.length === 0 ? (
        <p className="text-gray-400">Aucun don enregistré pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-yellow-500 uppercase text-sm">
                <th className="py-3 px-4">Donateur</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {dons.map((d) => (
                <tr key={d._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-3 px-4 font-semibold">{d.nom}</td>
                  <td className="py-3 px-4 text-gray-300">{d.email}</td>
                  <td className="py-3 px-4 text-green-400 font-bold">{d.montant.toLocaleString()} FCFA</td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800 rounded text-right">
        <span className="text-gray-400 mr-2">Total récolté :</span>
        <span className="text-2xl font-bold text-yellow-500">
          {dons.reduce((acc, cur) => acc + cur.montant, 0).toLocaleString()} FCFA
        </span>
      </div>
    </div>
  );
}