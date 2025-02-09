"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../../firebase/firebase";
import { toast, Toaster } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import Header from "../../layouts/header/header";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Por favor, completa todos los campos", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
        icon: "⚠️",
      });
      setLoading(false);
      return;
    }

    try {
      const { user, role } = await loginUser(email, password);

      if (role === "ADMIN") {
        toast.success("¡Bienvenido Administrador!", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
            borderRadius: "10px",
            marginTop: "70px",
          },
          icon: "👋",
        });
        router.push("/admin");
      } else {
        toast.success("¡Bienvenido!", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
            borderRadius: "10px",
            marginTop: "70px",
          },
          icon: "👋",
        });
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <Toaster />
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 p-8 rounded-xl max-w-md w-full border border-zinc-700/50"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 mb-2 block">Email</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
          <p className="text-gray-400 mt-4 text-center">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-yellow-500 hover:text-yellow-400"
            >
              Regístrate
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
