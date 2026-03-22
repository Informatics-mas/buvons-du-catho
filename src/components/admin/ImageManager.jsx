import { useState, useEffect, useRef } from "react";
import { Trash2, PlusCircle, ImageIcon, UploadCloud, Loader2, AlertCircle } from "lucide-react";

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // 👈 État pour l'aperçu
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null); // Pour vider l'input fichier après upload

  // URL de ton backend sur Render (Pense à centraliser cette URL plus tard)
  const API_URL = "https://buvons-du-catho.onrender.com/api/images";

  // 1. Charger la galerie
  const fetchImages = async () => {
    setFetching(true);
    try {
      const res = await fetch(API_URL);
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

  // 2. Gérer la sélection de fichier et l'aperçu
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (selectedFile) {
      // Vérification simple du type (optionnel mais recommandé)
      if (!selectedFile.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide (jpg, png...).");
        setFile(null);
        setPreview(null);
        return;
      }
      
      setFile(selectedFile);
      // Création d'une URL temporaire pour l'aperçu
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 3. Uploader l'image
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError("Le titre et l'image sont obligatoires.");
      return;
    }
    
    setLoading(true);
    setError("");
    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file); // 'image' doit correspondre au nom dans Multer backend

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Ne PAS mettre Content-Type, le navigateur le fait pour FormData
        },
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setFile(null);
        setPreview(null); // Vider l'aperçu
        if (fileInputRef.current) fileInputRef.current.value = ""; // Vider l'input fichier
        fetchImages(); // Rafraîchir la galerie
      } else {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'upload.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Supprimer une image 👈 NOUVELLE FONCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette image définitivement ?")) return;

    const token = localStorage.getItem("adminToken");
    
    // Optimistic UI update: on retire l'image de l'état avant la réponse du serveur
    const previousImages = [...images];
    setImages(images.filter((img) => img._id !== id));

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Si erreur serveur, on remet les images précédentes
        setImages(previousImages);
        const data = await res.json();
        alert(data.message || "Erreur lors de la suppression.");
      }
    } catch (err) {
      setImages(previousImages);
      alert("Erreur de connexion lors de la suppression.");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-2xl">
          <ImageIcon className="text-blue-400" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Médiathèque / Galerie</h2>
          <p className="text-gray-400 text-sm">Ajoutez et gérez les photos de l'événement</p>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-3 animate-slideIn">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-12">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <PlusCircle size={16} /> Ajouter une nouvelle photo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Titre */}
          <input
            type="text" placeholder="Titre de la photo (ex: Arrivée de l'Évêque)"
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-400 outline-none transition-all"
            required
          />

          {/* Bouton Upload (Zone cliquable personnalisée) */}
          <div className="relative group">
            <input
              type="file" accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              required={!preview}
            />
            <div className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-all ${
              preview ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 bg-white/5 group-hover:border-blue-400/50 group-hover:bg-blue-400/5'
            }`}>
              {preview ? (
                <>
                  <UploadCloud className="text-green-400" size={20} />
                  <span className="text-green-300 text-sm font-medium truncate">Fichier prêt</span>
                </>
              ) : (
                <>
                  <UploadCloud className="text-gray-400 group-hover:text-blue-400" size={20} />
                  <span className="text-gray-400 group-hover:text-blue-300 text-sm font-medium">Choisir image</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Zone d'aperçu de l'image sélectionnée 👈 NOUVEAU */}
        {preview && (
          <div className="mt-5 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 animate-fadeIn">
            <img src={preview} alt="Aperçu avant upload" className="w-20 h-20 object-cover rounded-xl border border-white/20" />
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-500 uppercase">Aperçu</p>
              <p className="text-white text-sm font-medium truncate">{file?.name}</p>
              <p className="text-gray-400 text-xs">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              type="button" 
              onClick={() => { setFile(null); setPreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
              className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        <button
          type="submit" disabled={loading || !file || !title}
          className="mt-6 w-full md:w-auto px-8 py-4 rounded-xl bg-blue-500 text-white font-black hover:bg-blue-400 transition-all flex items-center justify-center gap-3 disabled:opacity-40 shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
          {loading ? "TRANSFERT EN COURS..." : "AJOUTER À LA GALERIE"}
        </button>
      </form>

      {/* Galerie / Grille d'images */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <ImageIcon size={16} /> Photos en ligne ({images.length})
        </h3>

        {fetching ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-400" size={32} />
            Chargement de la médiathèque...
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 flex flex-col items-center gap-3">
            <ImageIcon size={40} className="opacity-30" />
            La galerie est vide. Utilisez le formulaire ci-dessus pour ajouter des photos.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image._id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20 animate-fadeIn">
                <img
                  src={`http://localhost:5000${image.url}`} // 👈 URL complète pour Render
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay d'info au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-bold truncate">{image.title}</p>
                  <p className="text-gray-400 text-[10px]">{new Date(image.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Bouton de suppression 👈 NOUVEAU */}
                <button
                  onClick={() => handleDelete(image._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400"
                  title="Supprimer définitivement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}