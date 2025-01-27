"use client";

import React, { useState } from "react";
import Footer from "../components/layouts/footer/footer";
import Header from "../components/layouts/header/header";
import Image from "next/image";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, AlertCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function Contacto() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "El nombre es requerido";
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 50)
          return "El nombre no puede exceder los 50 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          return "El nombre solo puede contener letras";
        return "";

      case "email":
        if (!value.trim()) return "El email es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
        return "";

      case "message":
        if (!value.trim()) return "El mensaje es requerido";
        if (value.length < 10)
          return "El mensaje debe tener al menos 10 caracteres";
        if (value.length > 500)
          return "El mensaje no puede exceder los 500 caracteres";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Por favor, corrige los errores del formulario", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("¡Mensaje enviado con éxito!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
        icon: "✉️",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #27272a",
          borderRadius: "10px",
          marginTop: "70px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#18181b",
            color: "#fff",
            marginTop: "70px",
          },
        }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white main-container">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
          {/* Columna izquierda - Información */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <Image
              src="/OscaredLogo.png"
              alt="OscarED Logo"
              width={150}
              height={150}
              className="mb-6 sm:mb-8"
            />
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
              Contacta con Nosotros
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
              ¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="text-yellow-500" />
                <span>info@oscared.com</span>
              </div>
            </div>
          </motion.div>

          {/* Columna derecha - Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-zinc-700/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                >
                  <User size={16} className="text-yellow-500" />
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                    errors.name ? "border-red-500" : "border-zinc-700"
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                >
                  <Mail size={16} className="text-yellow-500" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? "border-red-500" : "border-zinc-700"
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                >
                  <MessageSquare size={16} className="text-yellow-500" />
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none ${
                    errors.message ? "border-red-500" : "border-zinc-700"
                  }`}
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  isSubmitting || Object.values(errors).some((error) => error)
                }
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Mensaje
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
