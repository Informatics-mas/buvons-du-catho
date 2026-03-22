import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // 1. On récupère le token (nommé adminToken pour la cohérence)
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  // 2. Si pas de token, on redirige vers /login
  // On utilise 'state' pour que l'admin revienne sur la page demandée après connexion
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optionnel : Tu pourrais ajouter ici une vérification de l'expiration du JWT 
  // avec une bibliothèque comme jwt-decode si tu veux être très strict.

  return children;
}