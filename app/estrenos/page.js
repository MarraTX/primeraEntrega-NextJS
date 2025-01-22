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
    <div className="min-h-screen bg-dark text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Próximos Estrenos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {estrenosPeliculas.map((pelicula) => (
            <div
              key={pelicula.id}
              className="bg-stone-900 rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <figure className="relative w-full h-72 lg:h-80">
                <Image
                  src={pelicula.image}
                  alt={pelicula.titulo}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </figure>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-yellow-400">
                  {pelicula.titulo}
                </h2>
                <p className="text-gray-300 text-sm">{pelicula.genero}</p>
                <p className="text-gray-400 text-sm mb-2">
                  Estreno: {pelicula.anioEstreno}
                </p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="relative">
                      <StarIcon
                        className={`w-5 h-5 ${
                          i < Math.floor(pelicula.rating)
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                      {i === Math.floor(pelicula.rating) &&
                        pelicula.rating % 1 !== 0 && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: "50%" }}
                          >
                            <StarIcon className="w-5 h-5 text-yellow-500" />
                          </div>
                        )}
                    </div>
                  ))}
                  <span className="ml-2">{pelicula.rating.toFixed(1)}</span>
                </div>
                <div className="flex-grow flex items-end justify-center">
                  <button
                    className={`mt-4 px-6 py-2 rounded-lg text-sm font-semibold shadow-md ${
                      peliculasInteres.includes(pelicula.id)
                        ? "bg-yellow-500 text-black hover:bg-yellow-600"
                        : "bg-stone-950 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    } transition-all duration-300`}
                    onClick={() => toggleInteres(pelicula.id)}
                  >
                    {peliculasInteres.includes(pelicula.id)
                      ? "Me interesa ❤️"
                      : "Marcar Interés 👍"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
