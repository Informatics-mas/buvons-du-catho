import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react"; // Optionnel : npm install lucide-react

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://buvons-du-catho.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Identifiants invalides");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1A3B] bg-gradient-to-br from-[#0B1A3B] to-[#1a2e5a] p-4">
      <div className="w-full max-w-md">
        {/* Carte de Login */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Buvons du <span className="text-[#D4AF37]">Catho</span>
            </h2>
            <p className="text-gray-400 text-sm">Espace Administration</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  placeholder="admin@catho.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#b8962e] text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}