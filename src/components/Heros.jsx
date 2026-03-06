import { useEffect } from "react";

export default function Hero() {
  useEffect(() => {
    const container = document.getElementById("hero-container");
    // Sécurité : on vérifie que le container existe avant de boucler
    if (container) {
      for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparkle.style.width = `${2 + Math.random() * 4}px`;
        sparkle.style.height = sparkle.style.width;
        container.appendChild(sparkle);
      }
    }
  }, []);

  return (
    // AJOUT DE id="hero-container" ICI 👇
    <section id="hero-container" className="relative min-h-screen flex items-center justify-center text-center text-white bg-[#0B1A3B] overflow-hidden">
      {/* ... tout le reste de ton code reste identique ... */}
      <div className="absolute inset-0 bg-[url('/church-bg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-[#0B1A3B]/20 to-black/40 pointer-events-none"></div>

      <div className="relative z-10 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fadeInUp animate-glow text-cathoGold">
          ✝️ Le Buvons du Catho
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto animate-fadeInUp">
          Un festival de foi, de fraternité et de partage.<br />
          🙏 Prière • 🍹 Convivialité • ❤️ Communion
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center animate-fadeInUp">
          <a href="/reservation"
             className="bg-cathoGold text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Réserver un stand
          </a>
          <a href="/don"
             className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
            Faire un don
          </a>
        </div>
      </div>
    </section>
  );
}