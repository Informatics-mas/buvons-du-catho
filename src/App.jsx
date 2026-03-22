import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Don from "./pages/Don";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Galerie from "./components/Galerie";
import Reservation from "./pages/Reservation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/don" element={<Don />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />

        {/* --- ROUTE ADMIN PROTÉGÉE --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* --- SÉCURITÉ : REDIRECTION 404 --- */}
        {/* Si l'utilisateur tape une adresse inconnue, on le ramène à l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;