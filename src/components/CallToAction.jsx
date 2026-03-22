import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 bg-[#0B1A3B] text-white overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fadeIn text-yellow-500 text-center">
        🌟 Participez à l'événement
      </h2>
      
      <p className="text-lg md:text-2xl mb-12 text-center max-w-3xl animate-fadeIn opacity-90" style={{ animationDelay: '0.3s' }}>
        Réservez un stand, soutenez l'initiative ou rejoignez-nous en live pour partager la foi et la convivialité.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        {/* Bouton Principal : Réservation */}
        <Link to="/reservation"
           className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg text-center">
          Réserver un stand
        </Link>
        
        {/* Bouton Secondaire : Don */}
        <Link to="/don"
           className="border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0B1A3B] transition-all text-center">
          Faire un don
        </Link>
        
        {/* Bouton Live : Accès direct */}
        <Link to="/live"
           className="bg-white text-[#0B1A3B] px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-md text-center">
          Voir le live 🎥
        </Link>
      </div>
    </section>
  );
}