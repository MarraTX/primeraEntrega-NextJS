import Image from "next/image";
import Link from "next/link";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/footer/footer";
import { Film, Star, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-darktext-white">
      <Header />
      <main>
        <div className="relative h-96 mb-12">
          <Image
            src="/cinemaBanner.jpg"
            alt="Cine Banner"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-center text-white drop-shadow-lg">
              Descubre el Mundo del Cine con Nosotros
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-semibold mb-6">
              Nuestra Pasión por el Séptimo Arte
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              En OscarED, nos dedicamos a brindar información detallada y
              actualizada sobre el fascinante mundo del cine. Desde los clásicos
              atemporales hasta los últimos estrenos, estamos aquí para
              alimentar tu pasión por el séptimo arte con reseñas, noticias,
              entrevistas y análisis en profundidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: Film,
                title: "Reseñas Detalladas",
                description:
                  "Análisis profundos de películas de todos los géneros y épocas.",
              },
              {
                icon: Star,
                title: "Noticias del Cine",
                description:
                  "Las últimas novedades de la industria cinematográfica.",
              },
              {
                icon: Users,
                title: "Comunidad Cinéfila",
                description:
                  "Un espacio para compartir y discutir sobre tus películas favoritas.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-stone-900 rounded-lg p-6 text-center hover:bg-gray-700 transition"
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-darker rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-300 text-center mb-8">
              Somos un grupo diverso de apasionados por el cine, desde críticos
              experimentados hasta jóvenes talentos, todos unidos por nuestro
              amor al séptimo arte y nuestro compromiso de compartir ese
              entusiasmo contigo.
            </p>
            <div className="flex justify-center">
              <Image
                src="/oscaredPlanet.jpg"
                alt="Mundo del Cine"
                title="Mundo del Cine"
                width={600}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">
              Únete a Nuestra Comunidad
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              ¿Amas el cine tanto como nosotros? Únete a nuestra comunidad y sé
              parte de apasionantes discusiones, eventos exclusivos y mucho más.
            </p>
            <Link
              href="/register"
              className="btn btn-primary bg-yellow-500 text-black hover:bg-yellow-600 transition"
            >
              Regístrate Ahora
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
