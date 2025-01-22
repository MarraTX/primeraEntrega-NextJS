"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "../components/layouts/footer/footer";
import Header from "../components/layouts/header/header";
import productosMock from "../mock/productosMock";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";

export default function ProductosPage() {
  const [cantidades, setCantidades] = useState(
    productosMock.reduce((acc, producto) => ({ ...acc, [producto.id]: 0 }), {})
  );

  const incrementarCantidad = (id) => {
    setCantidades((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementarCantidad = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const agregarAlCarrito = (id) => {
    console.log(
      `Agregado al carrito: Producto ID ${id}, Cantidad: ${cantidades[id]}`
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Nuestros Productos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosMock.map((producto) => (
            <div
              key={producto.id}
              className="bg-stone-400 rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <div className="h-40">
                <Image
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black mb-2">
                    {producto.nombre}
                  </h2>
                  <p className="text-black text-sm mb-4">
                    {producto.descripcion}
                  </p>
                  <p className="text-black font-bold mb-4">
                    ${producto.precio.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => decrementarCantidad(producto.id)}
                      className="p-2 rounded-full bg-black hover:bg-stone-800 transition"
                      disabled={cantidades[producto.id] === 0}
                    >
                      <MinusCircle className="h-5 w-5 text-yellow-500" />
                    </button>
                    <span className="text-lg font-semibold text-black text-4xl">
                      {cantidades[producto.id] || 0}
                    </span>
                    <button
                      onClick={() => incrementarCantidad(producto.id)}
                      className="p-2 rounded-full bg-black hover:bg-stone-400 transition"
                    >
                      <PlusCircle className="h-5 w-5 text-yellow-500" />
                    </button>
                  </div>
                  <button
                    onClick={() => agregarAlCarrito(producto.id)}
                    className="w-full py-2 px-4 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition disabled:bg-gray-700 disabled:text-gray-400"
                    disabled={cantidades[producto.id] === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 inline" /> Agregar al
                    Carrito
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
