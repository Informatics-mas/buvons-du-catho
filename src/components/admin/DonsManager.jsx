import { useEffect, useState } from "react";

export default function DonManager() {
  const [dons, setDons] = useState([]);

  useEffect(() => {
    fetch("https://buvons-du-catho.onrender.com/api/dons")
      .then((res) => res.json())
      .then((data) => setDons(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-cathoGold">
        💰 Dons
      </h2>

      <ul>
        {dons.map((d) => (
          <li key={d._id} className="mb-2">
            {d.nom} - {d.email} - {d.montant} FCFA
          </li>
        ))}
      </ul>
    </div>
  );
}