"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Footer from "../../components/layouts/footer/footer";
import Header from "../../components/layouts/header/header";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProducts } from "../../firebase/firebase";
import Loading from "../../components/common/loading/loading";
import toast, { Toaster } from "react-hot-toast";

export default function CategoriaPage({ params }) {
  const { category } = params;
  const router = useRouter();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        const productosFiltrados = productsData.filter(
          (producto) =>
            producto.category.toLowerCase() === category.toLowerCase()
        );
        setProductos(productosFiltrados);
        setCantidades(
          productosFiltrados.reduce(
            (acc, producto) => ({ ...acc, [producto.id]: 0 }),
            {}
          )
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const decrementarCantidad = useCallback(
    (id) => {
      const currentAmount = cantidades[id] || 0;
      if (currentAmount <= 0) {
        toast.error("La cantidad no puede ser menor a 0");
        return;
      }
      setCantidades((prev) => ({
        ...prev,
        [id]: currentAmount - 1,
      }));
    },
    [cantidades]
  );

  const incrementarCantidad = useCallback(
    (id) => {
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;

      const currentAmount = cantidades[id] || 0;
      if (currentAmount >= producto.stock) {
        toast.error(
          `Has alcanzado el límite de stock disponible (${producto.stock})`
        );
        return;
      }
      setCantidades((prev) => ({
        ...prev,
        [id]: currentAmount + 1,
      }));
    },
    [productos, cantidades]
  );

  const agregarAlCarrito = useCallback(
    (id) => {
      const producto = productos.find((p) => p.id === id);
      if (producto) {
        toast.success(`${producto.nombre} agregado al carrito`);
      }
    },
    [productos]
  );

  return (
    <div className="min-h-screen bg-black">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
        gutter={8}
        toasterId="unique-toaster"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in"
              >
                <div className="p-4">
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {producto.nombre}
                  </h2>
                  <p className="text-gray-300 mb-4">{producto.descripcion}</p>
                  <p className="text-yellow-500 font-bold text-lg mb-2">
                    ${producto.precio}
                  </p>
                  <div className="text-gray-300 text-sm mb-2">
                    Stock disponible: {producto.stock}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => decrementarCantidad(producto.id)}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <MinusCircle size={24} />
                    </button>
                    <span className="text-white font-medium text-lg">
                      {cantidades[producto.id] || 0}
                    </span>
                    <button
                      onClick={() => incrementarCantidad(producto.id)}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                  <button
                    onClick={() => agregarAlCarrito(producto.id)}
                    disabled={!cantidades[producto.id]}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                      cantidades[producto.id]
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart size={20} />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getProducts();
  const categories = [...new Set(products.map((product) => product.category))];

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }) {
  const { category } = params;

  return {
    title: `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } | Tu Tienda`,
    description: `Explora nuestra colección de ${category.toLowerCase()}`,
  };
}
