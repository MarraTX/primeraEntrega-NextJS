"use client";

import { motion } from "framer-motion";
import { Film, Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/footer/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white main-container">
        <div className="relative h-[60vh] mb-16">
          <Image
            src="/cinemaBanner.jpg"
            alt="Cine Banner"
            fill
            priority
            className="object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-bold text-center text-white drop-shadow-lg mb-4"
            >
              Descubre el Mundo del Cine
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1 bg-yellow-500 rounded-full mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl text-center px-4"
            >
              Tu destino definitivo para explorar el séptimo arte
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
              Nuestra Pasión por el Séptimo Arte
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              En OscarED, nos dedicamos a brindar información detallada y
              actualizada sobre el fascinante mundo del cine. Desde los clásicos
              atemporales hasta los últimos estrenos, estamos aquí para
              alimentar tu pasión por el séptimo arte.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Film,
                title: "Reseñas Detalladas",
                description:
                  "Análisis profundos de películas de todos los géneros y épocas.",
                color: "yellow",
              },
              {
                icon: Star,
                title: "Noticias del Cine",
                description:
                  "Las últimas novedades de la industria cinematográfica.",
                color: "yellow",
              },
              {
                icon: Users,
                title: "Comunidad Cinéfila",
                description:
                  "Un espacio para compartir y discutir sobre tus películas favoritas.",
                color: "yellow",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 border border-zinc-700/50"
              >
                <feature.icon
                  className={`w-16 h-16 mx-auto mb-6 text-${feature.color}-500`}
                />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-12 mb-20"
          >
            <h2 className="text-4xl font-bold mb-8 text-center">
              Nuestro Equipo
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Somos un grupo diverso de apasionados por el cine, desde
                  críticos experimentados hasta jóvenes talentos, todos unidos
                  por nuestro amor al séptimo arte y nuestro compromiso de
                  compartir ese entusiasmo contigo.
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-400 transition-all duration-300"
                >
                  Contáctanos
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="flex-1">
                <Image
                  src="/oscaredPlanet.jpg"
                  alt="Mundo del Cine"
                  width={500}
                  height={300}
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">
              Únete a Nuestra Comunidad
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              ¿Amas el cine tanto como nosotros? Únete a nuestra comunidad y sé
              parte de apasionantes discusiones, eventos exclusivos y mucho más.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-4 rounded-xl font-medium hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              Regístrate Ahora
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
