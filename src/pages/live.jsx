import React from "react";
import SafeIcon from "../components/Safeicon";

export default function Live() {
  // Remplace "YOUR_VIDEO_ID" par l'ID réel de ton stream YouTube ou Facebook Live
  const LIVE_VIDEO_ID = "YOUR_VIDEO_ID"; 

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Lien copié dans le presse-papier !");
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 bg-[#081229] text-white overflow-hidden">
      
      {/* Effet d'aura lumineuse derrière le lecteur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        
        {/* Badge LIVE Clignotant */}
        <div className="flex items-center gap-2 mb-6 bg-red-600/20 border border-red-600/50 px-4 py-1.5 rounded-full animate-pulse">
          <span className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]"></span>
          <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <SafeIcon name="Radio" size={14} />
            Direct
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-center text-yellow-500 drop-shadow-sm">
          Vivez l'Instant Présent
        </h2>
        
        <p className="text-lg md:text-xl mb-12 text-center text-gray-400 max-w-2xl font-light">
          Prières, louanges et moments forts : ne manquez rien du festival <span className="text-white font-medium">Buvons du Catho</span>, où que vous soyez.
        </p>

        {/* Conteneur Vidéo avec Ratio 16/9 */}
        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
          <div className="aspect-video relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${LIVE_VIDEO_ID}?autoplay=0&rel=0`}
              title="Live Buvons du Catho"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Interaction Sociale Rapide */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a 
            href={`https://www.youtube.com/watch?v=${LIVE_VIDEO_ID}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl transition-all text-sm font-semibold group"
          >
            <SafeIcon name="MessageCircle" size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span>Participer au chat YouTube</span>
          </a>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all text-sm font-bold shadow-lg active:scale-95"
          >
            <SafeIcon name="Share2" size={18} />
            <span>Partager le lien</span>
          </button>
        </div>
      </div>
    </section>
  );
}