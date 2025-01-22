"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/footer/footer";
import { StarIcon } from "lucide-react";
import estrenosPeliculas from "../mock/estrenosMock";

export default function EstrenosPage() {
  const [peliculasInteres, setPeliculasInteres] = useState([]);

  const toggleInteres = (id) => {
    setPeliculasInteres((prev) =>
      prev.includes(id)
        ? prev.filter((peliculaId) => peliculaId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Próximos Estrenos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estrenosPeliculas.map((pelicula) => (
            <div
              key={pelicula.id}
              className="bg-stone-900 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={pelicula.image}
                  alt={pelicula.titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-yellow-400 line-clamp-1">
                  {pelicula.titulo}
                </h2>
                <p className="text-gray-300 text-sm mt-1">{pelicula.genero}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Estreno: {pelicula.anioEstreno}
                </p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < pelicula.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm">
                    {pelicula.rating.toFixed(1)}
                  </span>
                </div>
                <button
                  className={`w-full mt-4 px-4 py-2 rounded-md text-sm font-semibold ${
                    peliculasInteres.includes(pelicula.id)
                      ? "bg-yellow-500 text-black hover:bg-yellow-600"
                      : "bg-stone-800 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                  } transition-all duration-300`}
                  onClick={() => toggleInteres(pelicula.id)}
                >
                  {peliculasInteres.includes(pelicula.id)
                    ? "Me interesa ❤️"
                    : "Marcar Interés 👍"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
