import { useEffect, useState } from "react";

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const fetchImages = async () => {
    const res = await fetch("https://buvons-du-catho.onrender.com/api/images");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("https://buvons-du-catho.onrender.com/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });

    setTitle("");
    setUrl("");
    fetchImages();
  };

  const deleteImage = async (id) => {
    await fetch(`https://buvons-du-catho.onrender.com/api/images/${id}`, {
      method: "DELETE",
    });
    fetchImages();
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-4 text-cathoGold">
        📸 Gestion des Images
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded text-black"
          required
        />
        <input
          type="text"
          placeholder="URL Image"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 rounded text-black"
          required
        />
        <button className="bg-cathoGold text-black px-4 rounded">
          Ajouter
        </button>
      </form>

      <ul>
        {images.map((img) => (
          <li key={img._id} className="flex justify-between mb-2">
            {img.title}
            <button
              onClick={() => deleteImage(img._id)}
              className="text-red-400"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}