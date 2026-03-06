export default function Footer() {
  return (
    <footer className="bg-[#0B1A3B] text-white py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        
        {/* Infos pratiques */}
        <div>
          <h3 className="font-bold text-xl mb-4">Infos Pratiques</h3>
          <p>📍 Adresse : Paroisse Saint-Pierre, Abidjan</p>
          <p>📅 Date : 25 Mars 2026</p>
          <p>⏰ Horaires : 10h00 - 20h00</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-xl mb-4">Contact</h3>
          <p>📧 Email : contact@buvonsducatho.ci</p>
          <p>📞 Téléphone : +225 01 23 45 67 89</p>
          <p>🌐 Site : www.buvonsducatho.ci</p>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="font-bold text-xl mb-4">Réseaux sociaux</h3>
          <p>👍 Facebook : /buvonsducatho</p>
          <p>🐦 Twitter : @buvonsducatho</p>
          <p>📸 Instagram : @buvonsducatho</p>
        </div>

      </div>

      <div className="text-center mt-8 text-sm text-gray-300">
        © 2026 Le Buvons du Catho. Tous droits réservés.
      </div>
    </footer>
  );
}