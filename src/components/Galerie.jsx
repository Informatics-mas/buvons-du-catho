import { useEffect, useState } from "react";
// 1. Importation de la Navbar
import Navbar from "../components/Navbar"; 

export default function Galerie() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/images");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error("Erreur galerie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      {/* 2. Ajout de la Navbar */}
      <Navbar />

      {/* 3. Ajustement du padding (pt-32) pour laisser la place à la Navbar */}
      <section className="pt-32 pb-20 px-6 bg-[#0B1A3B] text-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-yellow-500 mb-6 italic uppercase tracking-tighter">
            📸 Souvenirs des éditions
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
            Revivez les moments forts de fraternité et de partage de "Buvons du Catho". ✨
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 text-lg">La galerie est en cours de préparation... ⏳</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer bg-black border border-white/5"
                >
                  {/* Overlay de titre au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
                    <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {image.title}
                    </p>
                  </div>

                  <img
                    src={image.url} 
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}