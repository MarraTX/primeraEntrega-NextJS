import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Film } from "lucide-react";
import peliculasTop from "../../../mock/peliculasMock";
const HeroSection = () => {
  return (
    <>
      <div>
        <main className="min-h-screen bg- text-white">
          <section className="relative h-[70vh] flex items-center justify-center">
            <div className="z-10 text-center">
              <h1 className="text-5xl font-bold mb-4">Bienvenido a OscarED</h1>
              <p className="text-xl mb-8">
                Tu destino para todo lo relacionado con el cine
              </p>
              <Link
                href="/estrenos"
                className="btn btn-primary bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Explorar Películas
              </Link>
            </div>
          </section>
          <section className="py-16 px-4 bg-stone-950">
            <h2 className="text-3xl font-bold text-center mb-12">
              Explora por Categorías
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Play, title: "Últimos Estrenos" },
                { icon: Star, title: "Mejor Valoradas" },
                { icon: Calendar, title: "Próximamente" },
                { icon: Film, title: "Clásicos" },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-stone-900 p-6 rounded-lg text-center hover:bg-black transition duration-300"
                >
                  <category.icon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
              ))}
            </div>
          </section>
          <section className="py-16 px-4 bg-stone-900">
            <h2 className="text-3xl font-bold text-center mb-12">
              Películas Destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {peliculasTop.map((pelicula) => (
                <div
                  key={pelicula.id}
                  className="bg-stone-950 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                >
                  <Image
                    src={pelicula.imagen || "/placeholder.svg"}
                    alt={pelicula.titulo}
                    width={200}
                    height={300}
                    className="w-full h-100 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{pelicula.titulo}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(pelicula.rating)
                              ? "text-yellow-500 fill-current"
                              : i === Math.floor(pelicula.rating) &&
                                pelicula.rating % 1 !== 0
                              ? "text-yellow-500 fill-current"
                              : "text-gray-400"
                          }`}
                          style={
                            i === Math.floor(pelicula.rating) &&
                            pelicula.rating % 1 !== 0
                              ? { clipPath: "inset(0 50% 0 0)" }
                              : {}
                          }
                        />
                      ))}
                      <span className="ml-1">{pelicula.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 px-4 text-center bg-black">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para sumergirte en el mundo del cine?
            </h2>
            <p className="mb-8">
              Únete a nuestra comunidad y descubre las mejores películas,
              reseñas y más.
            </p>
            <Link
              href="/registro"
              className="btn btn-primary bg-yellow-500 text-black hover:bg-yellow-600"
            >
              Regístrate Ahora
            </Link>
          </section>
        </main>
      </div>
    </>
  );
};

export default HeroSection;
