"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Efecto para mostrar el toast cuando se agrega un item
  useEffect(() => {
    if (lastAddedItem) {
      toast.success(
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image
              src={lastAddedItem.imagen}
              alt={lastAddedItem.nombre}
              fill
              className="object-contain rounded"
              style={{
                filter: lastAddedItem.filterValue,
                WebkitFilter: lastAddedItem.filterValue,
              }}
            />
          </div>
          <span>Producto agregado al carrito</span>
        </div>,
        {
          position: "top-center",
          duration: 2000,
          style: {
            background: "#18181b",
            color: "#fbbf24",
            border: "1px solid #3f3f46",
            padding: "16px",
            borderRadius: "12px",
          },
          iconTheme: {
            primary: "#fbbf24",
            secondary: "#18181b",
          },
        }
      );
      setLastAddedItem(null);
    }
  }, [lastAddedItem]);

  const addToCart = (product, quantity, filterValue, colorName) => {
    setCartItems((prev) => {
      // Buscar si existe el mismo producto con el mismo color
      const existingItem = prev.find(
        (item) => item.id === product.id && item.colorName === colorName
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.colorName === colorName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Si no existe, agregar como nuevo item
      const newItem = {
        ...product,
        quantity,
        filterValue,
        colorName: colorName,
      };

      setLastAddedItem(newItem);
      return [...prev, newItem];
    });
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
