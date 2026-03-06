import { useEffect, useState } from "react";

export default function ReservationManager() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch("https://buvons-du-catho.onrender.com/api/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data));
  }, []);

  const handleValidation = async (id) => {
  const token = localStorage.getItem("token");

  await fetch(`https://buvons-du-catho.onrender.com/api/reservations/valider/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchReservations(); // refresh
  
 };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-4 text-cathoGold">
        🧾 Réservations
      </h2>

      <ul>
        {reservations.map((r) => (
          <li key={r._id} className="mb-2">
            {r.nom} - {r.email} - Stand: {r.stand}
          </li>
        ))}
      </ul>
      <button
        onClick={() => handleValidation(reservation._id)}
        className="bg-green-500 px-3 py-1 rounded">
    Valider
  </button>
    </div>
  );
}