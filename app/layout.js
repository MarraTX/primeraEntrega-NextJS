import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/context/CartContext";
import FloatingCart from "./components/common/floatingCart/FloatingCart";
import { Suspense } from "react";
import Loading from "./components/common/loading/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OscarED | Solo para ganadores",
  description: "Foro informativo de peliculas",
  keywords: "ecommerce, peliculas, tienda, tienda online, movies, comprar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
