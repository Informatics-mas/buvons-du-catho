import React from "react";
import SafeIcon from "./Safeicon";

export default function MomentSpirituel() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 bg-[#0B1A3B] overflow-hidden">
      
      {/* Background décoratif : Un éclat de lumière doux au centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-16 animate-fadeIn">
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Dimension Spirituelle</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">Nourrir l'âme et l'esprit</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Carte Verset du Jour */}
          <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              {/* Utilisation de SafeIcon au lieu de l'emoji livre */}
              <SafeIcon name="BookOpen" className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
              <h3 className="font-bold text-xl text-yellow-500 uppercase tracking-tight">Verset du Jour</h3>
            </div>
            <p className="text-xl md:text-2xl italic leading-relaxed text-gray-100 font-serif">
              "Cherchez d’abord le Royaume de Dieu et sa justice, et tout cela vous sera donné par-dessus."
            </p>
            <p className="mt-4 text-yellow-500/80 font-semibold">— Matthieu 6:33</p>
          </div>

          {/* Carte Exhortation */}
          <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              {/* Utilisation de SafeIcon au lieu de l'emoji ampoule */}
              <SafeIcon name="Lightbulb" className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
              <h3 className="font-bold text-xl text-yellow-500 uppercase tracking-tight">Exhortation</h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-300">
              Prenons un moment pour nous rappeler que notre partage ici est aussi un acte de <span className="text-white font-medium">fraternité et d'amour</span>. 
              Chaque rencontre à ce festival est une occasion de semer la joie et la bienveillance. Soyons reconnaissants et ouverts à la parole.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}