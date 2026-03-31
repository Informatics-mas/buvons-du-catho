import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import React from "react";
import SafeIcon from "./Safeicon";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Nettoyage au cas où le composant re-render
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
      className="relative min-h-screen flex items-center justify-center text-center text-white bg-[#0B1A3B] overflow-hidden"
    >
      {/* Background avec overlay */}
      <div className="absolute inset-0 bg-[url('/church-bg.jpg')] bg-cover bg-center opacity-45"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0B1A3B]"></div>

      {/* Contenu Principal */}
      <div className="relative z-10 px-6 max-w-4xl">
        <h1 className=" flex items-center justify-center gap-2 text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <SafeIcon name="Cross" size={80} /> Le Buvons du Catho
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 text-gray-200 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Un festival de foi, de fraternité et de partage.<br className="hidden md:block" />
          <span className="text-yellow-200/80 flex items-center justify-center gap-2"><SafeIcon name="Church" size={40} /> Prière • <SafeIcon name="Beer" size={40} /> Convivialité • <SafeIcon name="Heart" size={40} /> Communion</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          
          <Link to="/reservation"
            className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg text-center group">
            <SafeIcon name="Store" size={20} className="transition-transform group-hover:-rotate-12" />
            Réserver un stand
          </Link>
          <Link to="/don"
            className="flex items-center justify-center gap-2 border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0B1A3B] transition-all text-center group">
            <SafeIcon name="Heart" size={20} className="text-red-400 group-hover:fill-current" />
            Faire un don
          </Link>
        </div>
      </div>

      {/* Styles inline pour l'animation des étincelles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-20px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}