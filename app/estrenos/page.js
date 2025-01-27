"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/footer/footer";
import { StarIcon } from "lucide-react";
import { getEstrenos } from "../firebase/firebase";
import Loading from "../components/common/loading/loading";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Film, Heart } from "lucide-react";
import { Star } from "lucide-react";

export default function EstrenosPage() {
  const [estrenos, setEstrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peliculasInteres, setPeliculasInteres] = useState([]);

  useEffect(() => {
    const fetchEstrenos = async () => {
      try {
        const estrenosData = await getEstrenos();
        setEstrenos(estrenosData);
      } catch (error) {
        console.error("Error fetching estrenos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstrenos();
  }, []);

  const toggleInteres = (pelicula) => {
    const newState = !peliculasInteres.includes(pelicula.id);
    setPeliculasInteres((prev) =>
      newState
        ? [...prev, pelicula.id]
        : prev.filter((id) => id !== pelicula.id)
    );

    toast(
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {newState ? "❤️ Agregado a intereses" : "💔 Eliminado de intereses"}
        </span>
      </div>,
      {
        position: "bottom-right",
        duration: 2000,
        style: {
          background: "#18181b",
          color: "#fbbf24",
          borderRadius: "8px",
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#18181b",
            color: "#fbbf24",
            borderRadius: "8px",
          },
        }}
      />
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white main-container">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Próximos Estrenos
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Descubre las películas que están por llegar y marca las que te
              interesan
            </p>
          </motion.div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {estrenos.map((pelicula, index) => (
                <motion.div
                  key={pelicula.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 hover:border-yellow-500/50 transition-all duration-300 group"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    <Image
                      src={pelicula.image}
                      alt={pelicula.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority
                      className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-yellow-500 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                      {pelicula.titulo}
                    </h2>
                    <p className="text-gray-300 mt-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Estreno: {pelicula.anioEstreno}
                    </p>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                      <Film size={16} />
                      {pelicula.genero}
                    </p>

                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative">
                          {/* Estrella base (outlined) */}
                          <Star
                            className={`w-5 h-5 ${
                              i < Math.floor(pelicula.rating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-600"
                            }`}
                          />

                          {/* Estrella superpuesta para media estrella */}
                          {i === Math.floor(pelicula.rating) &&
                            pelicula.rating % 1 !== 0 && (
                              <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: "50%" }}
                              >
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              </div>
                            )}
                        </div>
                      ))}
                      <span className="ml-2 text-yellow-500 font-medium">
                        {pelicula.rating.toFixed(1)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleInteres(pelicula)}
                      className={`w-full mt-4 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                        peliculasInteres.includes(pelicula.id)
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-zinc-700 text-yellow-500 hover:bg-zinc-600"
                      }`}
                    >
                      {peliculasInteres.includes(pelicula.id) ? (
                        <>
                          <Heart size={20} fill="black" /> Me interesa
                        </>
                      ) : (
                        <>
                          <Heart size={20} /> Marcar Interés
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
