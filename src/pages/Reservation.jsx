import { useEffect, useState } from "react";

export default function Reservation() {
  const [produits, setProduits] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    nom: "",
    numero: "",
    email: "",
    produit: "",
    nombreStands: 1,
  });

  useEffect(() => {
    const fetchProduits = async () => {
      const res = await fetch("https://buvons-du-catho.onrender.com/api/produits");
      const data = await res.json();
      setProduits(data);
    };

    fetchProduits();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://buvons-du-catho.onrender.com/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const produitSelectionne = produits.find(
    (p) => p._id === form.produit
  );

  return (
    <section className="min-h-screen bg-[#0B1A3B] text-white flex items-center justify-center px-6 py-20">
      <div className="bg-black/40 p-10 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-bold text-cathoGold mb-8 text-center">
          🏪 Réservation de Stand
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="nom"
            placeholder="Votre nom"
            required
            value={form.nom}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/10 border border-gray-600"
          />

          <input
            type="text"
            name="numero"
            placeholder="Votre numéro"
            required
            value={form.numero}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/10 border border-gray-600"
          />

          <input
            type="email"
            name="email"
            placeholder="Votre email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/10 border border-gray-600"
          />

          {/* PRODUITS */}
          <select
            name="produit"
            required
            value={form.produit}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/10 border border-gray-600"
          >
            <option value="">Choisir un produit</option>

            {produits.map((produit) => (
              <option
                key={produit._id}
                value={produit._id}
                disabled={produit.totalDisponible === 0}
              >
                {produit.nomProduit} 
                ({produit.totalDisponible} disponible)
              </option>
            ))}
          </select>

          {produitSelectionne && (
            <p className="text-sm text-cathoGold">
              Il reste {produitSelectionne.totalDisponible} stand(s) pour ce produit.
            </p>
          )}

          <input
            type="number"
            name="nombreStands"
            min="1"
            required
            value={form.nombreStands}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/10 border border-gray-600"
          />

          <button
            type="submit"
            className="w-full bg-cathoGold text-black font-bold py-3 rounded hover:opacity-90 transition"
          >
            Envoyer la demande
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-400">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}