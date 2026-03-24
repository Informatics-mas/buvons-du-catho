import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Rediriger si déjà connecté
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // IMPORTANT : Utilisation de 'adminToken' pour la cohérence globale
        localStorage.setItem("adminToken", data.token);
        
        // Redirige vers la page demandée initialement ou vers /admin
        const origin = location.state?.from?.pathname || "/admin";
        navigate(origin);
      } else {
        setError(data.message || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Le serveur est injoignable. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1A3B] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1a2e5a] via-[#0B1A3B] to-black p-4">
      <div className="w-full max-w-md animate-fadeIn">
        
        {/* Logo / Icône de protection */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <ShieldCheck className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">
              ADMIN<span className="text-yellow-500">ISTRATION</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-medium">
              Buvons du Catho
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-4 rounded-xl mb-8 flex items-center gap-3 animate-shake">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Identifiant Email</label>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 pl-12 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-4 top-4.5 h-5 w-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mot de passe</label>
              <div className="relative group">
                <input
                  type="password"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 pl-12 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-4 top-4.5 h-5 w-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/10 active:scale-95 flex items-center justify-center disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : "ACCÉDER AU DASHBOARD"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-500 text-xs italic">
          Accès restreint aux organisateurs de l'événement.
        </p>
      </div>
    </div>
  );
}