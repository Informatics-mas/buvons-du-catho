import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import SafeIcon from "./Safeicon";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Effet de scroll pour changer l'apparence
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => setIsOpen(false), [location]);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${
      scrolled ? "bg-[#0B1A3B]/95 backdrop-blur-md py-3 shadow-xl" : "bg-transparent py-5"
    } text-white`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo avec SafeIcon */}
        <Link to="/" className="flex items-center gap-3 group">
          <SafeIcon 
            name="Cross" 
            className="text-yellow-500 w-7 h-7 group-hover:scale-110 transition-transform" 
            strokeWidth={2.5}
          />
          <h1 className="font-bold text-xl tracking-tighter uppercase italic">
            Buvons du <span className="text-yellow-500">Catho</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 font-semibold items-center">
          {["Accueil", "Reservation", "Don", "Live", "Galerie"].map((item) => (
            <Link 
              key={item}
              to={item === "Accueil" ? "/" : `/${item.toLowerCase()}`}
              className="relative hover:text-yellow-500 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-500 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button avec SafeIcon */}
        <button 
          className="md:hidden p-2 text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <SafeIcon name={isOpen ? "X" : "Menu"} className="w-8 h-8 transition-all" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`absolute top-full left-0 w-full bg-[#0B1A3B]/98 backdrop-blur-lg border-t border-white/10 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
      } md:hidden`}>
        <div className="flex flex-col p-8 gap-6 font-medium text-center">
          <Link to="/" className="hover:text-yellow-500 text-lg transition-colors">Accueil</Link>
          <Link to="/reservation" className="hover:text-yellow-500 text-lg transition-colors">Réserver un stand</Link>
          <Link to="/don" className="hover:text-yellow-500 text-lg transition-colors">Faire un don</Link>
          <Link to="/live" className="hover:text-yellow-500 text-lg transition-colors">Le Live</Link>
          <Link to="/galerie" className="hover:text-yellow-500 text-lg transition-colors">Galerie</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;