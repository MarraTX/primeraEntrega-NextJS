"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../../../firebase/firebase";
import { toast } from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";
import Header from "../../layouts/header/header";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validación de email
    if (!email) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido";
      isValid = false;
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    // Validación de confirmación de contraseña
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrige los errores del formulario", {
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
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);
      toast.success("¡Registro exitoso! Redirigiendo al login...", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
        icon: "🎉",
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este email ya está registrado", {
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
      } else if (error.code === "auth/invalid-email") {
        toast.error("El formato del email no es válido", {
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
      } else {
        toast.error("Error al registrar usuario", {
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 p-8 rounded-xl max-w-md w-full border border-zinc-700/50"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Registro</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Email"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Contraseña"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Confirmar Contraseña"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <p className="text-gray-400 mt-4 text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-yellow-500 hover:text-yellow-400"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
