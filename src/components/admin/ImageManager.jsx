import { useState, useEffect, useRef } from "react";
import { Trash2, PlusCircle, ImageIcon, UploadCloud, Loader2, AlertCircle, X } from "lucide-react";

export default function ImageManager() {
  const [images, setImages] = useState([]); // Galerie en ligne
  const [selectedFiles, setSelectedFiles] = useState([]); // Fichiers choisis localement
  const [previews, setPreviews] = useState([]); // Aperçus locaux
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  // ⚠️ UTILISE L'URL DE TON BACKEND RENDER ICI
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ton-api-render.com";
  const IMAGES_API_URL = `${API_BASE_URL}/images`;

  // 1. Charger la galerie
  const fetchImages = async () => {
    setFetching(true);
    try {
      const res = await fetch(IMAGES_API_URL);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      setError("Impossible de charger la galerie.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 2. Gérer la sélection MULTIPLE
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    const validFiles = files.filter(f => f.type.startsWith("image/"));
    
    if (validFiles.length !== files.length) {
      setError("Certains fichiers ont été ignorés car ce ne sont pas des images.");
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Générer les aperçus
    const newPreviews = validFiles.map(file => ({
      id: Math.random(), // id temporaire pour la suppression locale
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // 3. Supprimer un aperçu avant l'envoi
  const removePreview = (id, index) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 4. Uploader TOUTES les images d'un coup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError("Veuillez choisir au moins une image.");
      return;
    }
    
    setLoading(true);
    setError("");
    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    // 💡 IMPORTANT : 'images' (au pluriel) doit correspondre à ton backend
    selectedFiles.forEach(file => {
      formData.append("images", file); 
    });

    try {
      const res = await fetch(`${IMAGES_API_URL}/upload-multiple`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setSelectedFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchImages(); 
      } else {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'upload.");
      }
    } catch (err) {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Suppression (Idem qu'avant)
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`${IMAGES_API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchImages();
    } catch (err) { alert("Erreur suppression"); }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
      {/* ... Titre identique ... */}

      <form onSubmit={handleSubmit} className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-12">
        <div className="flex flex-col gap-6">
          {/* Zone de Drop / Sélection */}
          <div className="relative group border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-blue-500/50 transition-all cursor-pointer">
            <input
              type="file" multiple accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <UploadCloud size={40} className="text-gray-500 mb-2" />
            <p className="text-white font-medium">Cliquez ou glissez plusieurs images ici</p>
            <p className="text-gray-500 text-xs mt-1">PNG, JPG ou WEBP acceptés</p>
          </div>

          {/* Liste des aperçus avant upload */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              {previews.map((p, index) => (
                <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/20">
                  <img src={p.url} className="w-full h-full object-cover" alt="aperçu" />
                  <button 
                    type="button" onClick={() => removePreview(p.id, index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit" disabled={loading || selectedFiles.length === 0}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
            UPLOADER {selectedFiles.length > 0 && `${selectedFiles.length} IMAGE(S)`}
          </button>
        </div>
      </form>

      {/* Grille d'affichage */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.isArray(images) && images.map((image) => (
          <div key={image._id} className="relative group aspect-video rounded-xl overflow-hidden bg-black/40">
            {/* 💡 ICI ON RECONSTRUIT L'URL VERS LE BACKEND */}
            <img 
              src={image.url} 
              className="w-full h-full object-cover" 
              alt={image.title} 
            />
            <button 
              onClick={() => handleDelete(image._id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}