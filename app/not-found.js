import Link from "next/link";
import Footer from "./components/layouts/footer/footer";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-center items-center px-4">
        <FileQuestion className="w-24 h-24 text-yellow-500 mb-8" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          404 - Error en la Matrix!
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center text-gray-400">
          Oops! Parece que esta escena no está en nuestro guión.
        </p>
        <Link
          href="/"
          className="btn btn-primary bg-yellow-500 text-black hover:bg-yellow-600 transition-colors duration-300"
        >
          Volver al Inicio
        </Link>
      </div>
    </>
  );
}
