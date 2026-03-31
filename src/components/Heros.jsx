import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import React from "react";
import SafeIcon from "./Safeicon";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.querySelectorAll(".sparkle").forEach(s => s.remove());

    for (let i = 0; i < 35; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle absolute bg-white rounded-full pointer-events-none opacity-0";
      
      const size = 2 + Math.random() * 4;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`;
      
      container.appendChild(sparkle);
    }
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100svh] flex items-center justify-center text-center text-white bg-[#0B1A3B] overflow-hidden py-20"
    >
      {/* Background avec overlay */}
      <div className="absolute inset-0 bg-[url('/church-bg.jpg')] bg-cover bg-center opacity-45"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0B1A3B]"></div>

      {/* Contenu Principal */}
      <div className="relative z-10 px-4 w-full max-w-4xl mx-auto">
        
        {/* Titre : Ajustement des tailles d'icônes et de texte */}
        <h1 className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <SafeIcon name="Cross" className="w-12 h-12 md:w-20 md:h-20" /> 
          <span>Le Buvons du Catho</span>
        </h1>
        
        {/* Description : Utilisation de flex-wrap pour les icônes du bas */}
        <div className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="mb-4">
            Un festival de foi, de fraternité et de partage.
          </p>
          <div className="text-yellow-200/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base md:text-xl uppercase tracking-wide">
            <span className="flex items-center gap-1"><SafeIcon name="Church" size={24} className="md:w-10 md:h-10" /> Prière</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><SafeIcon name="Beer" size={24} className="md:w-10 md:h-10" /> Convivialité</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><SafeIcon name="Heart" size={24} className="md:w-10 md:h-10" /> Communion</span>
          </div>
        </div>

        {/* Boutons : Largeur totale sur mobile très petit */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Link to="/reservation"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg group">
            <SafeIcon name="Store" size={20} className="transition-transform group-hover:-rotate-12" />
            Réserver un stand
          </Link>
          <Link to="/don"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0B1A3B] transition-all group">
            <SafeIcon name="Heart" size={20} className="text-red-400 group-hover:fill-current" />
            Faire un don
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-20px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}