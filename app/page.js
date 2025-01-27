"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/layouts/header/header";
import Footer from "./components/layouts/footer/footer";
import { getPeliculas } from "./firebase/firebase";
import { motion } from "framer-motion";
import { Play, Star, TrendingUp, ShoppingBag } from "lucide-react";
import Loading from "./components/common/loading/loading";

export default function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const peliculasData = await getPeliculas();
        setPeliculas(peliculasData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white main-container">
        {/* Hero Section */}
        <section className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/cinema-hero.webp"
              alt="Cinema background"
              fill
              priority
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJiEwST4oLTU5MTU4OU9aV0ZPYUY6TU9gaWxXWW9gd19uYnNqc2BtYWf/2wBDAR"
              className="object-cover opacity-40 transition-opacity duration-500 hover:opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          <div className="relative container-custom min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"
              >
                Tu destino para el mejor entretenimiento
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8"
              >
                Descubre las últimas películas, series y merchandising
                exclusivo.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/estrenos"
                  className="w-full sm:w-auto bg-yellow-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Ver Estrenos
                </Link>
                <Link
                  href="/merch"
                  className="w-full sm:w-auto bg-zinc-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Explorar Merch
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Movies Section */}
        <section className="py-12 sm:py-16 md:py-20 container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 mb-4 sm:mb-0">
              <TrendingUp className="text-yellow-500" />
              Películas Destacadas
            </h2>
            <Link
              href="/peliculas"
              className="text-yellow-500 hover:text-yellow-400 transition-all duration-300"
            >
              Ver todas →
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
            {peliculas.slice(0, 4).map((pelicula, index) => (
              <motion.div
                key={pelicula.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-800/50 rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={pelicula.imagen}
                    alt={pelicula.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-all duration-300"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {pelicula.titulo}
                      </h3>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-white">{pelicula.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Explora Nuestras Categorías
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Estrenos",
                  icon: Play,
                  href: "/estrenos",
                  color: "yellow",
                },
                {
                  title: "Merchandising",
                  icon: ShoppingBag,
                  href: "/merch",
                  color: "purple",
                },
                {
                  title: "Top Películas",
                  icon: Star,
                  href: "/peliculas",
                  color: "blue",
                },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={category.href}>
                    <div
                      className={`bg-zinc-800/50 rounded-xl p-8 hover:scale-105 transition-all duration-300 border border-zinc-700/50 hover:border-${category.color}-500/50`}
                    >
                      <category.icon
                        className={`w-12 h-12 text-${category.color}-500 mb-4`}
                      />
                      <h3 className="text-xl font-bold text-white mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-400">
                        Descubre todo nuestro contenido en{" "}
                        {category.title.toLowerCase()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
