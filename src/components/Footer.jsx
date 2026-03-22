export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1A3B] text-white py-16 px-6 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Infos pratiques */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-yellow-500 mb-2">📍 Infos Pratiques</h3>
          <p className="text-gray-300">
            Paroisse Saint-Louis-orione, Anyama,Abidjan<br />
            Côte d'Ivoire
          </p>
          <div className="text-gray-300">
            <p>📅 <span className="font-semibold text-white">Date :</span> 07 août 2026</p>
            <p>⏰ <span className="font-semibold text-white">Horaires :</span> a partir de 14h</p>
          </div>
        </div>

        {/* Contact direct */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-yellow-500 mb-2">📞 Contact</h3>
          <p>
            <a href="mailto:contact@buvonsducatho.ci" className="hover:text-yellow-500 transition-colors block">
              📧 contact@buvonsducatho.ci
            </a>
          </p>
          <p>
            <a href="tel:+2250123456789" className="hover:text-yellow-500 transition-colors block text-lg font-medium">
              📱 +225 01 23 45 67 89
            </a>
          </p>
          <p className="text-gray-400 text-sm italic">Service disponible du Lundi au Vendredi</p>
        </div>

        {/* Réseaux sociaux */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-yellow-500 mb-2">📱 Suivez-nous</h3>
          <div className="flex flex-col space-y-2">
            <a href="https://facebook.com/buvonsducatho" target="_blank" rel="noopener noreferrer" className="hover:translate-x-2 transition-transform inline-block">
              🔵 Facebook
            </a>
            <a href="https://instagram.com/buvonsducatho" target="_blank" rel="noopener noreferrer" className="hover:translate-x-2 transition-transform inline-block">
              📸 Instagram
            </a>
            <a href="https://twitter.com/buvonsducatho" target="_blank" rel="noopener noreferrer" className="hover:translate-x-2 transition-transform inline-block">
              🐦 Twitter (X)
            </a>
          </div>
        </div>

      </div>

      {/* Barre de copyright */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <p>© {currentYear} Le Buvons du Catho. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
          <a href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</a>
        </div>
      </div>
    </footer>
  );
}