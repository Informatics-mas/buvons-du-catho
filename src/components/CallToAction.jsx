import { Link } from "react-router-dom";
import SafeIcon from "../components/Safeicon";

export default function CallToAction() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 bg-[#0B1A3B] text-white overflow-hidden relative">
      
      {/* Décoration de fond subtile */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fadeIn text-yellow-500 text-center flex items-center justify-center gap-3">
        <SafeIcon name="Sparkles" size={32} className="text-yellow-400" />
        <span>Participez à l'événement</span>
      </h2>
      
      <p className="text-lg md:text-2xl mb-12 text-center max-w-3xl animate-fadeIn opacity-90 font-light leading-relaxed" style={{ animationDelay: '0.3s' }}>
        Réservez un stand, soutenez l'initiative ou rejoignez-nous en live pour partager la foi et la convivialité.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        
        {/* Bouton Principal : Réservation */}
        <Link to="/reservation"
           className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg text-center group">
          <SafeIcon name="Store" size={20} className="transition-transform group-hover:-rotate-12" />
          Réserver un stand
        </Link>
        
        {/* Bouton Secondaire : Don */}
        <Link to="/don"
           className="flex items-center justify-center gap-2 border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0B1A3B] transition-all text-center group">
          <SafeIcon name="Heart" size={20} className="text-red-400 group-hover:fill-current" />
          Faire un don
        </Link>
        
        {/* Bouton Live : Accès direct */}
        <Link to="/live"
           className="flex items-center justify-center gap-2 bg-white text-[#0B1A3B] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-md text-center group">
          <SafeIcon name="Tv" size={20} className="text-red-600 animate-pulse" />
          Voir le live
        </Link>

      </div>
    </section>
  );
}