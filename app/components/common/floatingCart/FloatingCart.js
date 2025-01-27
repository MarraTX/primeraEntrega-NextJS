"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FloatingCart() {
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const itemCount = getCartCount();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      // Pequeño delay para la animación
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <Link href="/cart">
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
        animate-bounce-subtle`}
      >
        <button
          className="bg-yellow-500 text-black w-14 h-14 rounded-full shadow-lg hover:bg-yellow-600 
          transition-all duration-300 transform hover:scale-105 group flex items-center justify-center relative
          animate-fade-in"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart
              size={24}
              className="transform transition-transform group-hover:animate-cart-wiggle duration-150"
            />
            <div
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
              flex items-center justify-center text-xs font-bold shadow-md border-2 border-yellow-500
              group-hover:animate-cart-wiggle"
            >
              {itemCount}
            </div>
          </div>

          <div
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-800 text-white 
            px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 
            transition-all duration-300 transform group-hover:translate-x-0 translate-x-4"
          >
            Ver carrito
          </div>
        </button>
      </div>
    </Link>
  );
}
