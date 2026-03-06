export default function Live() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 bg-[#0B1A3B] text-white">
      
      {/* Overlay léger pour effet divin */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fadeIn text-cathoGold">
          🎥 Live de l'événement
        </h2>
        <p className="text-lg md:text-2xl mb-12 text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          Rejoignez-nous en direct pour partager la foi et la convivialité.
        </p>

        {/* Intégration YouTube */}
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Live Buvons du Catho"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}