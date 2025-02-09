"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  Film,
  Home,
  Info,
  Mail,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { checkUserRole } from "../../../firebase/firebase";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userRole, logoutUser } = useAuth();
  const userMenuRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    const checkAdminStatus = async () => {
      if (user) {
        const role = await checkUserRole(user.uid);
        setIsAdmin(role === "ADMIN");
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    checkAdminStatus();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { href: "/estrenos", label: "Estrenos", icon: Film },
    { href: "/about", label: "Nosotros", icon: Info },
    { href: "/merch", label: "Merch", icon: ShoppingBag },
    { href: "/contacto", label: "Contacto", icon: Mail },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserMenuOpen(false);
      router.push("/");
      toast.success("Sesión cerrada exitosamente", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
      });
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header className="fixed w-full top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-2 group">
            <Image src="/OscaredLogo.png" alt="Logo" width={40} height={40} />
            <span className="text-lg sm:text-xl font-bold">
              <span className="text-white">Oscar</span>
              <span className="text-yellow-500">ED</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1 text-gray-300 hover:text-yellow-500 transition-colors relative py-2 text-sm lg:text-base"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
              >
                <Settings size={18} />
                Administración
              </Link>
            )}
          </nav>

          {/* Botones de autenticación */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  <Image
                    src="/user.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-1 border border-zinc-700"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 transition-colors flex items-center gap-2 hover:bg-transparent group"
                      >
                        <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                        <span className="group-hover:text-red-500 transition-colors">
                          Cerrar Sesión
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-yellow-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-900 border-l border-zinc-800 p-6 z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-yellow-500 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
                  >
                    <Settings size={18} />
                    Administración
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
