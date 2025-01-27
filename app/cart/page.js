"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  MinusCircle,
  PlusCircle,
  ShoppingBag,
  Plus,
  Minus,
  X,
  ChevronDown,
  ClipboardList,
  CheckCircle,
  Check,
} from "lucide-react";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/footer/footer";
import { useCart } from "../components/context/CartContext";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import Loading from "../components/common/loading/loading";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, setCartItems, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableProducts(products);
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, colorName, newQuantity) => {
    if (newQuantity >= 1) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId && item.colorName === colorName
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      handleRemoveFromCart(productId, colorName);
    }
  };

  const handleRemoveFromCart = (productId, colorName) => {
    setItemToDelete({ id: productId, colorName });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const itemToRemove = cartItems.find(
        (item) =>
          item.id === itemToDelete.id &&
          item.colorName === itemToDelete.colorName
      );

      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.id === itemToDelete.id &&
              item.colorName === itemToDelete.colorName
            )
        )
      );

      toast.success(
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image
              src={itemToRemove.imagen}
              alt={itemToRemove.nombre}
              fill
              className="object-contain rounded"
              style={{
                filter: itemToRemove.filterValue,
                WebkitFilter: itemToRemove.filterValue,
              }}
            />
          </div>
          <span>Producto eliminado</span>
        </div>,
        {
          position: "bottom-right",
          duration: 2000,
          style: {
            background: "#18181b",
            color: "#fbbf24",
          },
        }
      );

      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    setShowCheckoutModal(true);
  };

  const processCheckout = async () => {
    setLoading(true);
    try {
      const finalTotal = cartItems.reduce(
        (sum, item) => sum + item.precio * item.quantity,
        0
      );

      // Actualizar stock en Firebase
      for (const item of cartItems) {
        const productRef = doc(db, "productos", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock;
          const newStock = currentStock - item.quantity;

          if (newStock < 0) {
            toast.error(`No hay suficiente stock de ${item.nombre}`);
            setLoading(false);
            return;
          }

          await updateDoc(productRef, {
            stock: newStock,
          });
        }
      }

      // Simular proceso de pago
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowCheckoutModal(false);

      // Modal de éxito con el total guardado
      setShowSuccessModal(true);
      localStorage.setItem("lastOrderTotal", finalTotal.toString());
      setCartItems([]);
    } catch (error) {
      console.error("Error en el checkout:", error);
      toast.error("Error al procesar la compra");
    } finally {
      setLoading(false);
    }
  };

  const total =
    cartItems?.reduce((sum, item) => sum + item.precio * item.quantity, 0) || 0;

  const handleColorChange = (productId, filterValue) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: filterValue,
    }));
  };

  const getSelectedColorName = (productId) => {
    const selectedFilter = selectedColors[productId];
    const selectedColor = colors.find(
      (color) => color.value === selectedFilter
    );
    return selectedColor ? selectedColor.name : "Negro";
  };

  // Función para obtener el texto de colores para un producto
  const getColorText = (productId) => {
    const productVariants = cartItems.filter((item) => item.id === productId);

    if (productVariants.length === 1) {
      return productVariants[0].color;
    } else if (productVariants.length === 2) {
      return `${productVariants[0].color} y ${productVariants[1].color}`;
    } else if (productVariants.length > 2) {
      return `${productVariants.length} colores`;
    }
    return "";
  };

  // Función para agrupar productos por ID (para mostrar cantidad de variantes)
  const getProductVariants = (productId) => {
    return cartItems.filter((item) => item.id === productId);
  };

  // Función para agregar producto rápido con color
  const handleQuickAdd = (product, color) => {
    const newItem = {
      ...product,
      colorName: color.name,
      filterValue: color.value,
      quantity: 1,
    };

    setCartItems((prev) => {
      // Buscar si existe el mismo producto con el mismo color
      const existingItem = prev.find(
        (item) => item.id === product.id && item.colorName === color.name
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.colorName === color.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, newItem];
    });

    toast.success(
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 relative">
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            className="object-contain rounded"
            style={{
              filter: color.value,
              WebkitFilter: color.value,
            }}
          />
        </div>
        <span>Producto agregado</span>
      </div>,
      {
        position: "bottom-right",
        duration: 2000,
        style: {
          background: "#18181b",
          color: "#fbbf24",
        },
      }
    );

    setShowQuickAddMenu(false);
    setSelectedProduct(null);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setShowClearCartModal(false);
    toast.success("Carrito vaciado correctamente", {
      style: {
        background: "#18181b",
        color: "#fff",
        borderRadius: "10px",
      },
    });
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fbbf24",
            border: "1px solid #3f3f46",
          },
        }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white main-container">
        <div className="container-custom section-padding">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2">
                <ShoppingBag className="text-yellow-500" />
                Tu Carrito
              </h1>
              {cartItems?.length > 0 && (
                <button
                  onClick={() => setShowClearCartModal(true)}
                  className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  <span className="hidden sm:inline">Vaciar carrito</span>
                </button>
              )}
            </div>

            {cartItems?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="w-16 h-16 text-yellow-500/50" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Tu carrito está vacío
                  </h2>
                  <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                    Parece que aún no has agregado ningún producto a tu carrito.
                    ¡Explora nuestra colección y encuentra algo que te guste!
                  </p>
                  <Link
                    href="/merch"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-black rounded-xl font-medium hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Ir a la tienda</span>
                  </Link>
                </motion.div>
              </div>
            )}

            {cartItems?.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                  {Array.from(new Set(cartItems.map((item) => item.id))).map(
                    (productId) => {
                      const variants = getProductVariants(productId);

                      return variants.map((item) => (
                        <motion.div
                          key={`${item.id}-${item.colorName}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-zinc-800/50 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                        >
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                            <Image
                              src={item.imagen}
                              alt={item.nombre}
                              fill
                              className="object-cover rounded-lg"
                              sizes="(max-width: 640px) 96px, 128px"
                              style={{
                                filter: item.filterValue,
                                WebkitFilter: item.filterValue,
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                              <h3 className="text-lg sm:text-xl font-semibold">
                                {item.nombre}
                              </h3>
                              <span className="text-sm text-gray-400">
                                Color: {item.colorName}
                              </span>
                            </div>
                            <p className="text-yellow-500 font-medium mt-2">
                              ${item.precio.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2 bg-zinc-700 rounded-lg p-1">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.colorName,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-1 hover:text-yellow-500 transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.colorName,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-1 hover:text-yellow-500 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveFromCart(item.id, item.colorName)
                                }
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    }
                  )}
                </div>

                {/* Resumen del carrito */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-800/50 rounded-xl p-6 h-fit"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Resumen del Pedido
                  </h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Envío</span>
                      <span>Gratis</span>
                    </div>
                    <div className="border-t border-zinc-700 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-yellow-500">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-yellow-500 text-black py-3 rounded-lg font-medium hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Proceder al Pago"
                    )}
                  </button>
                </motion.div>
              </div>
            )}

            {cartItems?.length > 0 && (
              <div className="mt-8 bg-zinc-800/30 rounded-xl p-4">
                <button
                  onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Plus size={20} />
                    Agregar más productos
                  </span>
                  <ChevronDown
                    className={`transform transition-transform ${
                      showQuickAddMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showQuickAddMenu && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={product.imagen}
                              alt={product.nombre}
                              fill
                              className="object-contain"
                              sizes="(max-width: 640px) 64px, 64px"
                              style={{
                                filter:
                                  selectedColors[product.id] ||
                                  "brightness(1) saturate(100%)",
                                WebkitFilter:
                                  selectedColors[product.id] ||
                                  "brightness(1) saturate(100%)",
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">
                              {product.nombre}
                            </h3>
                            <p className="text-yellow-500">${product.precio}</p>
                            {selectedColors[product.id] && (
                              <p className="text-sm text-gray-400">
                                Color: {getSelectedColorName(product.id)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-2">
                            Seleccionar color:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                              <button
                                key={color.name}
                                onClick={() =>
                                  handleColorChange(product.id, color.value)
                                }
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                  selectedColors[product.id] === color.value
                                    ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-zinc-800"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: color.bgColor,
                                  borderColor: color.borderColor,
                                }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          {selectedColors[product.id] && (
                            <button
                              onClick={() =>
                                handleQuickAdd(
                                  product,
                                  colors.find(
                                    (c) =>
                                      c.value === selectedColors[product.id]
                                  )
                                )
                              }
                              className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-yellow-500 py-2 rounded-lg transition-colors"
                            >
                              <Plus size={20} />
                              <span>Agregar al carrito</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal para vaciar carrito */}
      {showClearCartModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-zinc-700"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Vaciar Carrito
              </h3>
              <p className="text-gray-400 text-lg">
                ¿Estás seguro de que deseas eliminar todos los productos del
                carrito?
              </p>
            </div>

            <div className="bg-zinc-900/50 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de productos:</span>
                <span className="text-white font-medium text-lg">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Productos diferentes:</span>
                <span className="text-white font-medium text-lg">
                  {cartItems.length}
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor total:</span>
                  <span className="text-yellow-500 font-bold text-xl">
                    $
                    {cartItems
                      .reduce(
                        (sum, item) => sum + item.precio * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleClearCart}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Sí, vaciar
              </button>
              <button
                onClick={() => setShowClearCartModal(false)}
                className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-600 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmación de compra */}
      {showCheckoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-zinc-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <ShoppingBag className="text-yellow-500" />
              Confirmar Compra
            </h3>

            <div className="space-y-6 mb-8">
              <div className="bg-zinc-700/30 p-6 rounded-xl">
                <h4 className="text-xl text-white font-medium mb-6 flex items-center gap-2">
                  <ClipboardList className="text-yellow-500" />
                  Resumen de la compra:
                </h4>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from(
                    cartItems.reduce((acc, item) => {
                      const baseProductId = item.id;
                      if (!acc.has(baseProductId)) {
                        acc.set(baseProductId, []);
                      }
                      acc.get(baseProductId).push(item);
                      return acc;
                    }, new Map())
                  ).map(([productId, variants]) => {
                    const firstVariant = variants[0];
                    return (
                      <div
                        key={productId}
                        className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-lg"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          {variants.map((variant, index) => (
                            <div
                              key={`${variant.id}-${variant.colorName}`}
                              className="absolute w-full h-full"
                              style={{
                                transform: `translate(${index * 4}px, ${
                                  index * -4
                                }px)`,
                                zIndex: variants.length - index,
                              }}
                            >
                              <Image
                                src={variant.imagen}
                                alt={variant.nombre}
                                fill
                                className="object-contain rounded-lg"
                                style={{
                                  filter: variant.filterValue,
                                  WebkitFilter: variant.filterValue,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-medium">
                            {firstVariant.nombre}
                          </h5>
                          {variants.length > 1 ? (
                            <p className="text-gray-400 text-sm">
                              {variants.length === 2
                                ? `${variants[0].colorName} y ${variants[1].colorName}`
                                : `${variants.length} colores diferentes`}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm">
                              Color: {variants[0].colorName}
                            </p>
                          )}
                          <div className="flex flex-col mt-1">
                            {variants.map((variant) => (
                              <div
                                key={`${variant.id}-${variant.colorName}-details`}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-400">
                                  {variant.colorName} x{variant.quantity}
                                </span>
                                <span className="text-yellow-500">
                                  $
                                  {(variant.precio * variant.quantity).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-zinc-700/30 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-lg">Subtotal:</span>
                  <span className="text-white font-medium text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-600">
                  <span className="text-white text-xl font-medium">
                    Total a pagar:
                  </span>
                  <span className="text-yellow-500 text-2xl font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-600 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={processCheckout}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-yellow-500 text-black rounded-xl font-medium hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  "Confirmar Compra"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de compra exitosa */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-zinc-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ¡Pedido Confirmado!
              </h3>
              <p className="text-gray-400 text-lg mb-6">
                Tu pedido ha sido procesado correctamente.
              </p>

              <div className="bg-zinc-700/30 w-full p-6 rounded-xl mb-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ID de Pedido:</span>
                    <span className="text-yellow-500 font-mono font-medium">
                      #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">
                      ${localStorage.getItem("lastOrderTotal") || "0"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCartItems([]);
                }}
                className="w-full px-6 py-3 bg-yellow-500 text-black rounded-xl font-medium 
                hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Aceptar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal para eliminar producto */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-zinc-700">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Eliminar Producto
              </h3>
              <p className="text-gray-400">
                ¿Estás seguro de que deseas eliminar este producto del carrito?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
