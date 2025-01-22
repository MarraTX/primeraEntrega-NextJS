"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function NotFound() {
  const [matrixElements, setMatrixElements] = useState([]);

  useEffect(() => {
    // Generate matrix elements only on the client side
    const elements = Array(20)
      .fill(null)
      .map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5,
        char: Math.random().toString(36).charAt(2),
      }));
    setMatrixElements(elements);
  }, []);

  const handleSupportClick = () => {
    toast("¡Esta función estará disponible próximamente!", {
      position: "top-center",
      duration: 3000,
      style: {
        background: "#333",
        color: "#fff",
        border: "1px solid #fbbf24",
        textAlign: "center",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-10">
          {matrixElements.map((element, i) => (
            <div
              key={i}
              className="absolute animate-matrix-fall"
              style={{
                left: `${element.left}%`,
                top: `-${element.top}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`,
              }}
            >
              {element.char}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <FileQuestion className="w-32 h-32 text-yellow-500 mb-8 animate-pulse" />
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300"
          role="heading"
          aria-label="Página no encontrada"
        >
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center animate-fade-in">
          ¡Error en la Matrix!
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-center text-gray-300 animate-fade-in-delay max-w-2xl">
          Oops! Parece que esta escena no está en nuestro guión. No te
          preocupes, podemos ayudarte a encontrar el camino correcto.
        </p>
        <div className="space-x-6 animate-fade-in-delay">
          <Link
            href="/"
            className="inline-block btn btn-primary bg-yellow-500 text-black hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-yellow-500/30"
          >
            Volver al inicio
          </Link>
          <button
            onClick={handleSupportClick}
            className="inline-block btn btn-secondary bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-yellow-500/20"
          >
            Contactar soporte
          </button>
        </div>
      </div>

      {/* Updated Toaster component */}
      <Toaster />
    </div>
  );
}
