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

// Enregistrement des composants Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear(); // Plus sûr pour nettoyer la session
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken"); // Cohérence avec ProtectedRoute

      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          handleLogout(); // Redirection si le token est expiré ou invalide
          return;
        }

        const data = await res.json();
        if (data.success) {
          setStats(data.stats); // 👈 On enregistre directement le contenu de "stats"
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
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-500">
            🔐 Dashboard Administrateur
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Gestion globale de l'événement Buvons du Catho</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600/20 text-red-400 border border-red-600/50 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all font-semibold"
        >
          Se déconnecter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
        </div>
      ) : stats && (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Images", value: stats.totalImages, color: "text-blue-400" },
              { label: "Réservations", value: stats.totalReservations, color: "text-yellow-500" },
              { label: "Dons", value: stats.totalDons, color: "text-green-400" },
              // On ajoute "(stats.totalMontant || 0)" pour éviter le undefined
{ label: "Total Récolté", 
  value: stats.totalMontant ? `${stats.totalMontant.toLocaleString()} FCFA` : "0 FCFA", 
  color: "text-emerald-400" 
}
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
                <p className={`text-2xl md:text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* GRAPHIQUE */}
          <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl mb-16 shadow-2xl overflow-hidden">
            <div className="h-[300px] md:h-[400px]">
              <Bar
                data={{
                  labels: ["Réservations", "Dons", "Images"],
                  datasets: [
                    {
                      label: "Volume d'activité",
                      data: [stats.totalReservations, stats.totalDons, stats.totalImages],
                      backgroundColor: ["#EAB308", "#22C55E", "#3B82F6"],
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: "RÉSUMÉ DES ACTIVITÉS",
                      color: "#94a3b8",
                      font: { size: 14, weight: 'bold' },
                      padding: 20
                    },
                  },
                  scales: {
                    x: { ticks: { color: "#94a3b8" }, grid: { display: false } },
                    y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
                  },
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* SECTIONS DE GESTION */}
      <div className="space-y-20 max-w-6xl mx-auto">
        <section id="images"><ImageManager /></section>
        <section id="reservations"><ReservationManager /></section>
        <section id="stand-types"><StandTypeManager /></section>
        <section id="dons"><DonManager /></section>
      </div>

    </div>
  );
}