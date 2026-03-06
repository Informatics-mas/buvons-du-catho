export default function CallToAction() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 bg-[#0B1A3B] text-white">
      <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fadeIn text-cathoGold">
        🌟 Participez à l'événement
      </h2>
      <p className="text-lg md:text-2xl mb-12 text-center max-w-3xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        Réservez un stand, soutenez l'initiative ou rejoignez-nous en live pour partager la foi et la convivialité.
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        <a href="/reservation"
           className="bg-cathoGold text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
          Réserver un stand
        </a>
        <a href="/don"
           className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
          Faire un don
        </a>
        <a href="/live"
           className="bg-white text-[#0B1A3B] px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
          Voir le live
        </a>
      </div>
    </section>
  );
}