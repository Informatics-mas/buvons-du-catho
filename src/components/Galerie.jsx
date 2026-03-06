import { useEffect, useState } from "react";

export default function Galerie() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("https://buvons-du-catho.onrender.com/api/images");
      const data = await res.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <section className="py-20 px-6 bg-[#0B1A3B] text-white">
      <h2 className="text-4xl font-bold text-center text-cathoGold mb-16">
        📸 Galerie des éditions précédentes
      </h2>

      {images.length === 0 ? (
        <p className="text-center text-gray-300">
          Aucune image disponible pour le moment.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {images.map((image) => (
            <div
              key={image._id}
              className="overflow-hidden rounded-lg shadow-lg group"
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}