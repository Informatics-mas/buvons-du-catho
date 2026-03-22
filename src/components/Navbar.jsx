import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-yellow-500 text-3xl group-hover:scale-110 transition-transform">✝</span>
          <h1 className="font-bold text-xl tracking-tighter uppercase italic">
            Buvons du <span className="text-yellow-500">Catho</span>
          </h1>
        </Link>

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
  {/* ❌ IL NE DOIT PLUS RIEN Y AVOIR ICI ❌ */}
</div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Overlay - Uniquement les liens publics */}
      <div className={`absolute top-full left-0 w-full bg-[#0B1A3B] border-t border-white/10 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } md:hidden`}>
        <div className="flex flex-col p-6 gap-6 font-medium text-center">
          <Link to="/" className="hover:text-yellow-500">Accueil</Link>
          <Link to="/reservation" className="hover:text-yellow-500">Réserver un stand</Link>
          <Link to="/don" className="hover:text-yellow-500">Faire un don</Link>
          <Link to="/live" className="hover:text-yellow-500">Le Live</Link>
          <Link to="/galerie" className="hover:text-yellow-500">Galerie</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;