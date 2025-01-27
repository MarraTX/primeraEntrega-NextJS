"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Footer from "../components/layouts/footer/footer";
import Header from "../components/layouts/header/header";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { getProducts } from "../firebase/firebase";
import Loading from "../components/common/loading/loading";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../components/context/CartContext";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const { addToCart } = useCart();

  const colors = [
    {
      name: "Negro",
      value: "brightness(1) saturate(100%)",
      bgColor: "#000000",
      borderColor: "#ffffff30",
    },
    {
      name: "Blanco",
      value: "brightness(0) invert(1)",
      bgColor: "#FFFFFF",
      borderColor: "#ffffff30",
    },
    {
      name: "Celeste",
      value:
        "invert(89%) sepia(11%) saturate(1000%) hue-rotate(180deg) brightness(103%) contrast(96%)",
      bgColor: "#B0E0E6",
      borderColor: "#ffffff30",
    },
    {
      name: "Lila",
      value:
        "invert(80%) sepia(16%) saturate(1000%) hue-rotate(200deg) brightness(99%) contrast(96%)",
      bgColor: "#E6E6FA",
      borderColor: "#ffffff30",
    },
    {
      name: "Naranja pastel",
      value:
        "invert(85%) sepia(18%) saturate(444%) hue-rotate(314deg) brightness(101%) contrast(98%)",
      bgColor: "#FFD4B8",
      borderColor: "#ffffff30",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          next: {
            revalidate: 3600, // Revalidar cada hora
          },
        });

        if (!response.ok) throw new Error("Error al cargar productos");
        const productsData = await response.json();

        setProductos(productsData);
        setCantidades(
          productsData.reduce(
            (acc, producto) => ({ ...acc, [producto.id]: 0 }),
            {}
          )
        );
        setSelectedColors(
          productsData.reduce(
            (acc, producto) => ({
              ...acc,
              [producto.id]: "brightness(1) saturate(100%)",
            }),
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
  }, []);

  // este es el filtro de productos por categoria
  const productosFiltrados =
    categoriaSeleccionada === null
      ? productos
      : productos.filter(
          (producto) => producto.category === categoriaSeleccionada
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

  const agregarAlCarrito = (id) => {
    const producto = productos.find((p) => p.id === id);
    const cantidad = cantidades[id];
    const filterValue = selectedColors[id] || "brightness(1) saturate(100%)";
    const colorName = getSelectedColorName(id);

    if (producto && cantidad > 0) {
      addToCart(producto, cantidad, filterValue, colorName);
      // Resetear la cantidad después de agregar al carrito
      setCantidades((prev) => ({
        ...prev,
        [id]: 0,
      }));
    }
  };

  const handleColorChange = (productId, filterValue) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: filterValue,
    }));
  };

  // selecciona el color del producto
  const getSelectedColorName = (productId) => {
    const selectedFilter = selectedColors[productId];
    const selectedColor = colors.find(
      (color) => color.value === selectedFilter
    );
    return selectedColor ? selectedColor.name : "Negro"; // el negro es el color por defecto
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
        gutter={8}
        toasterId="unique-toaster"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Nuestros Productos
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre nuestra colección exclusiva de merchandising
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              categoriaSeleccionada === null
                ? "bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setCategoriaSeleccionada("Ropa")}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              categoriaSeleccionada === "Ropa"
                ? "bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Ropa
          </button>
          <button
            onClick={() => setCategoriaSeleccionada("Accesorios")}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              categoriaSeleccionada === "Accesorios"
                ? "bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            Accesorios
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 opacity-0 animate-fade-in transform hover:-translate-y-1 border border-zinc-700/50"
              >
                <div className="p-6">
                  <div className="aspect-square relative mb-6 group bg-white/5 rounded-xl">
                    <Image
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      fill
                      className="object-contain rounded-lg transition-all duration-500"
                      style={{
                        filter: selectedColors[producto.id],
                        WebkitFilter: selectedColors[producto.id],
                      }}
                    />
                  </div>
                  <div className="flex gap-3 mb-4 justify-center">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() =>
                          handleColorChange(producto.id, color.value)
                        }
                        className={`w-8 h-8 rounded-full transition-all duration-300 relative
                          before:content-[''] before:absolute before:inset-0 
                          before:rounded-full before:transition-all before:duration-300
                          hover:scale-105`}
                        style={{
                          backgroundColor: color.bgColor,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          border:
                            selectedColors[producto.id] === color.value
                              ? "2px solid #F59E0B"
                              : `2px solid ${color.borderColor}`,
                          transform:
                            selectedColors[producto.id] === color.value
                              ? "scale(1.1)"
                              : "scale(1)",
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>{producto.nombre}</span>
                    <span className="text-gray-400 text-lg font-normal transition-colors duration-300">
                      {getSelectedColorName(producto.id)}
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-4 text-sm line-clamp-2">
                    {producto.descripcion}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-yellow-500 font-bold text-2xl">
                      ${producto.precio}
                    </p>
                    <span className="text-gray-400 text-sm">
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-6 bg-zinc-900/50 rounded-lg p-2">
                    <button
                      onClick={() => decrementarCantidad(producto.id)}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors p-1"
                    >
                      <MinusCircle size={24} />
                    </button>
                    <span className="text-white font-medium text-lg">
                      {cantidades[producto.id] || 0}
                    </span>
                    <button
                      onClick={() => incrementarCantidad(producto.id)}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors p-1"
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                  <button
                    onClick={() => agregarAlCarrito(producto.id)}
                    disabled={!cantidades[producto.id]}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      cantidades[producto.id]
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg shadow-yellow-500/20"
                        : "bg-zinc-700/50 text-gray-400 cursor-not-allowed"
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
