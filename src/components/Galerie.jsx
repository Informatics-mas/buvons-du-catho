import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; 
import SafeIcon from "./Safeicon";

export default function Galerie() {
  const [images, setImages] = useState([]); // Initialisé à un tableau vide
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/images`);
        
        // Sécurité : si la réponse n'est pas OK (ex: 404), on lance une erreur
        if (!res.ok) throw new Error("Serveur indisponible");

        const data = await res.json();
        
        // Sécurité : on s'assure que data est bien un tableau avant de le stocker
        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur galerie:", error);
        setImages([]); // Force le tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-20 px-6 bg-[#0B1A3B] text-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-yellow-500 mb-6 italic uppercase tracking-tighter flex items-center justify-center gap-2">
            <SafeIcon name="Camera" size={60} />  Souvenirs des éditions
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto flex items-center justify-center gap-2">
            Revivez les moments forts de fraternité et de partage de "Buvons du Catho". <SafeIcon name="Sparkles" size={22} className="text-yellow-400" />
          </p>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-40 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
              <p className="text-gray-400 animate-pulse">Chargement des souvenirs...</p>
            </div>
          ) : !Array.isArray(images) || images.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-gray-400 text-lg flex items-center justify-center gap-2">La galerie est en cours de préparation... <SafeIcon name="Hourglass" size={22} className="text-yellow-400" /></p>
              <p className="text-gray-600 text-sm mt-2">Revenez très bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer bg-black/40 border border-white/5 aspect-[4/5] sm:aspect-square"
                >
                  {/* Overlay de titre au survol optimisé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A3B] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end p-8">
                    <div>
                        <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            Événement
                        </p>
                        <p className="text-white font-black text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                            {image.title || "Souvenir"}
                        </p>
                    </div>
                  </div>

                  <img
                    src={image.url} 
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-1000 ease-out opacity-80 group-hover:opacity-100"
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