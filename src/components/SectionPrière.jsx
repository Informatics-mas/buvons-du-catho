export default function MomentSpirituel() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative bg-[#0B1A3B] text-white">
  {/* Overlay sombre */}
  <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

  <div className="relative z-10 max-w-4xl w-full flex flex-col md:flex-row gap-8">
    <div className="spirit-card">
      <h3 className="font-semibold text-xl mb-2 text-cathoGold">📖 Verset du Jour</h3>
      <p className="italic">
        "Cherchez d’abord le Royaume de Dieu et sa justice, et tout cela vous sera donné par-dessus." – Matthieu 6:33
      </p>
    </div>
    <div className="spirit-card">
      <h3 className="font-semibold text-xl mb-2 text-cathoGold">💡 Exhortation</h3>
      <p>
        Prenons un moment pour nous rappeler que notre partage ici est aussi un acte de fraternité et d'amour. Soyons reconnaissants et ouverts à la parole.
      </p>
    </div>
  </div>
</section>
  );
}