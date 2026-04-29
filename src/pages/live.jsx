import React, { useEffect, useState } from "react";
import SafeIcon from "../components/Safeicon";

export default function Live() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveLink = async () => {
      try {
        // On récupère toujours le lien via ta route API existante[cite: 4, 5]
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Youtube/live`); 
        const data = await response.json();
        
        if (data && data.youtubeUrl) {
          setVideoUrl(data.youtubeUrl);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du live Facebook:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveLink();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Lien copié !");
  };

  // Génération de l'URL d'intégration Facebook
  const getFacebookEmbedUrl = (url) => {
    if (!url) return "";
    // Facebook utilise l'URL complète encodée pour son plugin vidéo
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&t=0`;
  };

  const embedUrl = getFacebookEmbedUrl(videoUrl);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 bg-[#081229] text-white overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        
        <div className="flex items-center gap-2 mb-6 bg-blue-600/20 border border-blue-600/50 px-4 py-1.5 rounded-full animate-pulse">
          <span className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_#2563eb]"></span>
          <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <SafeIcon name="Radio" size={14} />
            Direct Facebook
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-center text-yellow-500">
          Vivez l'Instant Présent
        </h2>

        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="aspect-video relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
              </div>
            ) : videoUrl ? (
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                <SafeIcon name="VideoOff" size={48} className="mb-4" />
                <p>Aucun direct Facebook prévu.</p>
              </div>
            )}
          </div>
        </div>

        {!loading && videoUrl && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] px-6 py-3 rounded-xl transition-all text-sm font-bold shadow-lg"
            >
              <SafeIcon name="Facebook" size={18} />
              <span>Voir sur Facebook</span>
            </a>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all text-sm font-bold shadow-lg"
            >
              <SafeIcon name="Share2" size={18} />
              <span>Partager le lien</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}