import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-cathoBlue text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-cathoGold text-2xl">✝</span>
          <h1 className="font-bold text-lg tracking-wide">
            Le Buvons du Catho
          </h1>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 font-medium">
          <Link to="/" className="hover:text-cathoGold transition">Accueil</Link>
          <Link to="/reservation" className="hover:text-cathoGold transition">Réserver</Link>
          <Link to="/don" className="hover:text-cathoGold transition">Don</Link>
          <Link to="/live" className="hover:text-cathoGold transition">Live</Link>
          <Link to="/galerie" className="hover:text-cathoGold transition">Galerie</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;