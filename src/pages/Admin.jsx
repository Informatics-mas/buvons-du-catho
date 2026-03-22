import ImageManager from "../components/admin/ImageManager";
import ReservationManager from "../components/admin/ReservationManager";
import StandTypeManager from "../components/admin/standTypeManager";
import DonManager from "../components/admin/DonsManager";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import * as XLSX from 'xlsx';

// Enregistrement des composants Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- FONCTION EXPORT EXCEL ---
  const exporterDonnees = () => {
    if (!stats) return alert("Aucune donnée à exporter.");

    // Note : On utilise ici les données brutes que ton backend doit renvoyer dans l'objet stats
    const feuilleDons = (stats.detailsDons || []).map(d => ({
      Nom: d.nom,
      Email: d.email,
      Montant: d.montant,
      Devise: "FCFA",
      Date: new Date(d.createdAt).toLocaleDateString('fr-FR')
    }));

    const feuilleReservations = (stats.detailsReservations || []).map(r => ({
      Exposant: r.nomResponsable,
      Structure: r.nomStructure,
      Telephone: r.telephone,
      Type_Stand: r.typeStand,
      Statut: r.paye ? "Payé" : "En attente"
    }));

    const wb = XLSX.utils.book_new();
    const wsDons = XLSX.utils.json_to_sheet(feuilleDons);
    const wsResa = XLSX.utils.json_to_sheet(feuilleReservations);

    XLSX.utils.book_append_sheet(wb, wsDons, "Dons");
    XLSX.utils.book_append_sheet(wb, wsResa, "Reservations");

    XLSX.writeFile(wb, `BuvonsDuCatho_Bilan_${new Date().getFullYear()}.xlsx`);
  };

  // --- FONCTION RESET ---
  const handleReset = async () => {
    const confirmReset = window.confirm(
      "⚠️ ATTENTION : Voulez-vous vraiment TOUT effacer (Dons et Réservations) pour la nouvelle édition ?"
    );

    if (confirmReset) {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch("https://buvons-du-catho.onrender.com/api/admin/reset-edition", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          alert("Base de données réinitialisée ! ✨");
          window.location.reload();
        }
      } catch (error) {
        alert("Erreur lors de la réinitialisation.");
      }
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await fetch("https://buvons-du-catho.onrender.com/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          handleLogout();
          return;
        }

        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1A3B] text-white p-6 md:p-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-500">🔐 Dashboard</h1>
          <p className="text-gray-400 mt-1">Informatics Admin System v1.0</p>
        </div>
        <button onClick={handleLogout} className="bg-red-600/20 text-red-400 border border-red-600/50 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
          Déconnexion
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div></div>
      ) : stats && (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Images", value: stats.totalImages, color: "text-blue-400" },
              { label: "Réservations", value: stats.totalReservations, color: "text-yellow-500" },
              { label: "Dons", value: stats.totalDons, color: "text-green-400" },
              { label: "Total Récolté", value: `${(stats.totalMontant || 0).toLocaleString()} FCFA`, color: "text-emerald-400" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
                <h3 className="text-gray-400 text-sm uppercase">{stat.label}</h3>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* GRAPH */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-16 h-[400px]">
            <Bar
              data={{
                labels: ["Réservations", "Dons", "Images"],
                datasets: [{
                  label: "Activité",
                  data: [stats.totalReservations, stats.totalDons, stats.totalImages],
                  backgroundColor: ["#EAB308", "#22C55E", "#3B82F6"],
                }]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </>
      )}

      {/* MANAGERS */}
      <div className="space-y-20 max-w-6xl mx-auto mb-20">
        <ImageManager />
        <ReservationManager />
        <StandTypeManager />
        <DonManager />
      </div>
      
      {/* ZONE DANGER / EXPORT */}
      <div className="bg-white/5 p-8 rounded-3xl border border-red-500/20 mt-12 mb-10">
        <h3 className="text-2xl font-bold text-yellow-500 mb-4">Fin d'Édition</h3>
        <p className="text-gray-400 mb-6">Action irréversible. Téléchargez toujours le bilan avant de réinitialiser.</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={exporterDonnees} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
            📥 Exporter le Bilan (Excel)
          </button>
          <button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
            🗑️ Réinitialiser l'Édition
          </button>
        </div>
      </div>
    </div>
  );
}