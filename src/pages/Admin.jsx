import ImageManager from "../components/admin/ImageManager";
import ReservationManager from "../components/admin/ReservationManager";
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
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("https://buvons-du-catho.onrender.com/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1A3B] text-white p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-cathoGold">
          🔐 Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      {stats && (
        <>
          {/* Statistiques résumées */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-black/40 p-6 rounded-lg">
              <h3 className="text-cathoGold text-lg">Images</h3>
              <p className="text-3xl font-bold">{stats.totalImages}</p>
            </div>
            <div className="bg-black/40 p-6 rounded-lg">
              <h3 className="text-cathoGold text-lg">Réservations</h3>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </div>
            <div className="bg-black/40 p-6 rounded-lg">
              <h3 className="text-cathoGold text-lg">Dons</h3>
              <p className="text-3xl font-bold">{stats.totalDons}</p>
            </div>
            <div className="bg-black/40 p-6 rounded-lg">
              <h3 className="text-cathoGold text-lg">Montant total</h3>
              <p className="text-3xl font-bold">{stats.totalMontant} FCFA</p>
            </div>
          </div>

          {/* 🔹 Graphique Chart.js */}
          <div className="bg-black/40 p-6 rounded-lg mb-16">
            <Bar
              data={{
                labels: ["Réservations", "Dons", "Images"],
                datasets: [
                  {
                    label: "Statistiques",
                    data: [
                      stats.totalReservations,
                      stats.totalDons,
                      stats.totalImages,
                    ],
                    backgroundColor: ["#FFD700", "#4ade80", "#60a5fa"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top", labels: { color: "white" } },
                  title: {
                    display: true,
                    text: "Résumé des activités",
                    color: "white",
                    font: { size: 20 },
                  },
                },
                scales: {
                  x: { ticks: { color: "white" } },
                  y: { ticks: { color: "white" } },
                },
              }}
            />
          </div>
        </>
      )}
      {/* MANAGERS */}
      <div className="space-y-16">
        <ImageManager />
        <ReservationManager />
        <DonManager />
      </div>

    </div>
  );
}