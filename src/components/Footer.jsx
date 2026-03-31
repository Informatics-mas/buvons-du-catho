import React from 'react';
import SafeIcon from './Safeicon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1A3B] text-white py-16 px-6 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Infos pratiques */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon name="MapPin" className="text-yellow-500" size={20} />
            <h3 className="font-bold text-xl text-yellow-500">Infos Pratiques</h3>
          </div>
          <p className="text-gray-300">
            Paroisse Saint Louis orione, Anyama Belleville, Abidjan,<br />
            Côte d'Ivoire
          </p>
          <div className="text-gray-300 space-y-2">
            <p className="flex items-center gap-2">
              <SafeIcon name="Calendar" size={16} className="text-gray-400" />
              <span className="font-semibold text-white">Date :</span> 07 août 2026
            </p>
            <p className="flex items-center gap-2">
              <SafeIcon name="Clock" size={16} className="text-gray-400" />
              <span className="font-semibold text-white">Horaires :</span> À partir de 14h
            </p>
          </div>
        </div>

        {/* Contact direct */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon name="Phone" className="text-yellow-500" size={20} />
            <h3 className="font-bold text-xl text-yellow-500">Contact</h3>
          </div>
          <p>
            <a href="mailto:oppjsaintlouisorione@gmail.com" className="flex items-center gap-2 hover:text-yellow-500 transition-colors group">
              <SafeIcon name="Mail" size={18} className="text-gray-400 group-hover:text-yellow-500" />
              <span>oppjsaintlouisorione@gmail.com</span>
            </a>
          </p>
          <p>
            <a href="tel:+2250123456789" className="flex items-center gap-2 hover:text-yellow-500 transition-colors text-lg font-medium group">
              <SafeIcon name="Smartphone" size={20} className="text-gray-400 group-hover:text-yellow-500" />
              <span>+225 01 23 45 67 89</span>
            </a>
          </p>
          <p className="text-gray-400 text-sm italic flex items-center gap-2">
            <SafeIcon name="Info" size={14} />
            Service disponible du Lundi au Vendredi
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon name="Share2" className="text-yellow-500" size={20} />
            <h3 className="font-bold text-xl text-yellow-500">Suivez-nous</h3>
          </div>
          <div className="flex flex-col space-y-2">
            <a 
              href="https://facebook.com/groups/oppje.anyama/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:translate-x-2 transition-transform hover:text-blue-400"
            >
              <SafeIcon name="Facebook" size={18} />
              <span>Facebook</span>
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