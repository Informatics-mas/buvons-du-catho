import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages Publiques
import Home from "../pages/Home";
import Reservation from "../pages/Reservation";
import Don from "../pages/Don";
import Live from "../pages/live";
import Galerie from "../components/Galerie";
import Login from "../pages/Login";

// Espace Admin
import Admin from "../pages/Admin";
import ProtectedRoute from "../components/ProtectedRoute"; // Assure-toi du bon chemin

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/don" element={<Don />} />
        <Route path="/live" element={<Live />} />
        <Route path="/galerie" element={<Galerie />} />
        
        {/* Route de connexion Admin */}
        <Route path="/espace-reserve-secret-admin" element={<Login />} />

        {/* --- ROUTES PROTÉGÉES (ADMIN) --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Optionnel : Redirection 404 vers l'accueil */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;