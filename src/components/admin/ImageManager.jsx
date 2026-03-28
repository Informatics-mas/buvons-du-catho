import { useState, useEffect, useRef } from "react";
import { Trash2, PlusCircle, ImageIcon, UploadCloud, Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react";

export default function ImageManager() {
  const [images, setImages] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  // URL dynamique selon l'environnement
  const API_URL = `${import.meta.env.VITE_API_URL}/images`;

  // 1. Charger la galerie
  const fetchImages = async () => {
    setFetching(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Sécurité anti-crash : on s'assure que c'est un tableau
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetch:", err);
      setError("Impossible de charger la médiathèque.");
      setImages([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 2. Sélection Multiple
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError("");
    setSuccess("");

    const validFiles = files.filter(f => f.type.startsWith("image/"));
    
    if (validFiles.length !== files.length) {
      setError("Certains fichiers ne sont pas des images et ont été ignorés.");
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => ({
      id: Math.random(),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (id, index) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Upload vers Cloudinary via Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    setError("");
    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("images", file); 
    });

    try {
      const res = await fetch(`${API_URL}/upload-multiple`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setSuccess(`${selectedFiles.length} image(s) ajoutée(s) avec succès !`);
        setSelectedFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchImages(); 
      } else {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors du transfert.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Suppression
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette image de Cloudinary ?")) return;
    
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchImages();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-2xl">
          <ImageIcon className="text-blue-400" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Médiathèque Cloudinary</h2>
          <p className="text-gray-400 text-sm">Stockage permanent et optimisé</p>
        </div>
      </div>

      {/* Messages d'état */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-3 animate-shake">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Formulaire d'Upload */}
      <form onSubmit={handleSubmit} className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-10">
        <div className="flex flex-col gap-6">
          <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer">
            <input
              type="file" multiple accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <UploadCloud size={48} className="text-gray-600 group-hover:text-blue-400 transition-colors mb-3" />
            <p className="text-gray-300 font-medium">Glissez vos photos ou cliquez ici</p>
            <p className="text-gray-500 text-xs mt-1">Multi-sélection autorisée (JPG, PNG, WEBP)</p>
          </div>

          {/* Aperçus temporaires */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              {previews.map((p, index) => (
                <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-white/20">
                  <img src={p.url} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    type="button" onClick={() => removePreview(p.id, index)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit" disabled={loading || selectedFiles.length === 0}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
            {loading ? "TRANSFERT VERS CLOUDINARY..." : `PUBLIER ${selectedFiles.length > 0 ? selectedFiles.length : ''} PHOTO(S)`}
          </button>
        </div>
      </form>

      {/* Galerie */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <ImageIcon size={14} /> Galerie Publique ({images.length})
        </h3>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="animate-pulse">Synchronisation avec Cloudinary...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-gray-600">
            Aucune image dans la galerie.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                <img 
                  src={img.url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Gallerie"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button 
                    onClick={() => handleDelete(img._id)}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> SUPPRIMER
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}