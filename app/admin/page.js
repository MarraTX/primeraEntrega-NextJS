"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import Header from "../components/layouts/header/header";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash,
  Save,
  X,
  Upload,
  Trash2,
  Download,
} from "lucide-react";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  getSalesData,
  getMonthlySales,
  getSalesHistory,
} from "../firebase/firebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagen: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [salesData, setSalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    loadProducts();
    const loadSalesData = async () => {
      try {
        const [daily, monthly, history] = await Promise.all([
          getSalesData(),
          getMonthlySales(),
          getSalesHistory(),
        ]);

        setSalesData(daily);
        setMonthlySalesData(monthly);
        setSalesHistory(history);
      } catch (error) {
        console.error("Error al cargar datos de ventas:", error);
        toast.error("Error al cargar datos de ventas");
      }
    };

    loadSalesData();
  }, []);

  async function loadProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Normalizar la categoría al cargar los productos
        const categoriaNormalizada = data.categoria
          ? data.categoria.trim().charAt(0).toUpperCase() +
            data.categoria.trim().slice(1).toLowerCase()
          : "";

        return {
          id: doc.id,
          ...data,
          categoria: categoriaNormalizada,
        };
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const data = await response.json();
        if (data.url) {
          setNewProduct((prev) => ({ ...prev, imagen: data.url }));
          toast.success("Imagen subida exitosamente");
        } else {
          throw new Error("No se recibió la URL de la imagen");
        }
      } catch (error) {
        console.error("Error detallado:", error);
        toast.error("Error al subir la imagen");
        setImageFile(null);
        setImagePreview("");
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.imagen) {
      toast.error("Debes subir una imagen para el producto");
      return;
    }

    try {
      // Normalizar la categoría (primera letra mayúscula, resto minúsculas)
      const categoriaNormalizada =
        newProduct.categoria.trim().charAt(0).toUpperCase() +
        newProduct.categoria.trim().slice(1).toLowerCase();

      await addDoc(collection(db, "productos"), {
        ...newProduct,
        categoria: categoriaNormalizada,
        precio: Number(newProduct.precio),
        stock: Number(newProduct.stock),
      });

      toast.success("Producto agregado exitosamente");
      setShowAddModal(false);
      setNewProduct({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagen: "",
      });
      setImageFile(null);
      setImagePreview("");
      loadProducts();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast.error("Error al agregar el producto");
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "productos", productToDelete));
      toast.success("Producto eliminado exitosamente");
      loadProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar el producto");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      // Normalizar también la categoría al editar
      const categoriaNormalizada =
        editingProduct.categoria.trim().charAt(0).toUpperCase() +
        editingProduct.categoria.trim().slice(1).toLowerCase();

      await updateDoc(doc(db, "productos", editingProduct.id), {
        ...editingProduct,
        categoria: categoriaNormalizada,
        precio: Number(editingProduct.precio),
        stock: Number(editingProduct.stock),
      });

      toast.success("Producto actualizado exitosamente");
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("Error al actualizar el producto");
    }
  };

  const generateSalesReport = async () => {
    try {
      // Cargar datos de ventas desde Firestore
      const ventasSnapshot = await getDocs(collection(db, "ventas"));
      const salesHistory = ventasSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Procesar datos para el reporte diario
      const salesByDate = salesHistory.reduce((acc, sale) => {
        const date = new Date(sale.fecha.seconds * 1000).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            sales: 0,
            transactions: 0,
          };
        }
        acc[date].sales += sale.monto;
        acc[date].transactions += 1;
        return acc;
      }, {});

      const salesData = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        sales: data.sales,
        transactions: data.transactions,
      }));

      const doc = new jsPDF();

      // Agregar logo desde public
      doc.addImage("/OscaredLogo.png", "PNG", 14, 10, 40, 40);

      // Configuración de la marca
      const companyName = "OSCARED CINEMA";
      const companyAddress = "Av. Siempreviva 742";
      const companyContact = "Tel: (011) 4444-5555 | Email: info@oscared.com";
      const companyWeb = "www.oscared.com";

      // Encabezado
      doc.setFontSize(24);
      doc.setTextColor(44, 62, 80);
      doc.text(companyName, 60, 25);

      // Información de la empresa
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(companyAddress, 60, 33);
      doc.text(companyContact, 60, 39);
      doc.text(companyWeb, 60, 45);

      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 55, 196, 55);

      // Título del reporte
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("REPORTE DE VENTAS", 14, 70);

      // Información del reporte
      const currentDate = new Date();
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Fecha de generación: ${currentDate.toLocaleDateString()}`,
        14,
        78
      );
      doc.text(`Hora: ${currentDate.toLocaleTimeString()}`, 14, 84);

      // Resumen financiero
      const totalVentas = salesHistory.reduce(
        (sum, sale) => sum + sale.monto,
        0
      );
      const promedioVentas = totalVentas / salesHistory.length || 0;

      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("Resumen Financiero", 14, 100);

      // Tabla de resumen
      autoTable(doc, {
        startY: 105,
        head: [["Métrica", "Valor"]],
        body: [
          ["Total de Ventas", `$${totalVentas.toLocaleString()}`],
          ["Promedio por Venta", `$${promedioVentas.toLocaleString()}`],
          ["Total de Transacciones", salesHistory.length.toString()],
        ],
        theme: "grid",
        styles: {
          fontSize: 11,
          textColor: [50, 50, 50],
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255],
        },
      });

      // Ventas por día
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("Detalle de Ventas Diarias", 14, doc.lastAutoTable.finalY + 20);

      const dailySalesData = salesData.map((item) => [
        item.date,
        `$${item.sales.toLocaleString()}`,
        item.transactions,
        `$${(item.sales / item.transactions).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [
          ["Fecha", "Ventas Totales", "N° Transacciones", "Promedio por Venta"],
        ],
        body: dailySalesData,
        theme: "grid",
        styles: {
          fontSize: 10,
        },
        headStyles: {
          fillColor: [44, 62, 80],
        },
      });

      // Nueva página para el detalle de transacciones
      doc.addPage();

      // Título de la segunda página
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Detalle de Transacciones", 14, 20);

      const salesHistoryData = salesHistory.map((sale) => [
        new Date(sale.fecha.seconds * 1000).toLocaleDateString(),
        sale.producto,
        sale.cliente,
        sale.quantity || 1,
        `$${sale.monto.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 30,
        head: [["Fecha", "Producto", "Cliente", "Cantidad", "Monto"]],
        body: salesHistoryData,
        theme: "grid",
        styles: {
          fontSize: 9,
        },
        headStyles: {
          fillColor: [44, 62, 80],
        },
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount} | Generado por Sistema de Gestión OSCARED CINEMA`,
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
      }

      // Guardar el PDF
      doc.save(`reporte-ventas-${currentDate.toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Error al generar el reporte");
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <Toaster />
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white"
            >
              Panel de Administración
            </motion.h1>
            <div className="flex gap-4">
              <button
                onClick={() => generateSalesReport().catch(console.error)}
                className="flex items-center gap-2 bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                <Download size={20} />
                Generar Reporte
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Plus size={20} />
                Agregar Producto
              </button>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-700/50">
                    <td className="p-4">{product.nombre}</td>
                    <td className="p-4">{product.categoria}</td>
                    <td className="p-4">${product.precio}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowEditModal(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-800 p-6 rounded-xl w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Agregar Producto</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={newProduct.nombre}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, nombre: e.target.value })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={newProduct.descripcion}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={newProduct.precio}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, precio: e.target.value })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Categoría"
                    value={newProduct.categoria}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Imagen del producto
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                      />
                      <label
                        htmlFor="imageInput"
                        className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Upload size={20} />
                        Subir imagen
                      </label>
                      {imagePreview && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Agregar Producto
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-800 p-6 rounded-xl w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Editar Producto</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProduct(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleEditProduct} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={editingProduct.nombre}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        nombre: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={editingProduct.descripcion}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={editingProduct.precio}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        precio: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Categoría"
                    value={editingProduct.categoria}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded bg-zinc-700"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Actualizar Producto
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Modal de confirmación para eliminar producto */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4 border border-zinc-700"
              >
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Eliminar Producto
                  </h3>
                  <p className="text-gray-400">
                    ¿Estás seguro de que deseas eliminar este producto? Esta
                    acción no se puede deshacer.
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
                      setProductToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Gráfico de Ventas Diarias */}
            <div className="bg-zinc-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Ventas Diarias</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <XAxis dataKey="date" stroke="#e4e4e7" />
                  <YAxis stroke="#e4e4e7" />
                  <Tooltip
                    cursor={{ stroke: "#EAB308", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#27272a",
                      border: "1px solid #52525b",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      color: "#EAB308",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                    }}
                    itemStyle={{ color: "#e4e4e7", padding: "0.25rem 0" }}
                    formatter={(value) => [`$${value}`, "Ventas"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#EAB308"
                    fill="#EAB308"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Ventas Mensuales */}
            <div className="bg-zinc-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Ventas Mensuales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySalesData}>
                  <XAxis dataKey="month" stroke="#e4e4e7" />
                  <YAxis stroke="#e4e4e7" />
                  <Tooltip
                    cursor={{ fill: "#EAB308", opacity: 0.1 }}
                    contentStyle={{
                      backgroundColor: "#27272a",
                      border: "1px solid #52525b",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      color: "#EAB308",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                    }}
                    itemStyle={{ color: "#e4e4e7", padding: "0.25rem 0" }}
                    formatter={(value) => [`$${value}`, "Ventas"]}
                  />
                  <Bar dataKey="sales" fill="#EAB308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Historial de Ventas */}
            <div className="lg:col-span-2 bg-zinc-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Historial de Ventas</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left p-4">Fecha</th>
                      <th className="text-left p-4">Producto</th>
                      <th className="text-left p-4">Cliente</th>
                      <th className="text-right p-4">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesHistory.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-zinc-700/50 hover:bg-zinc-700/20"
                      >
                        <td className="p-4">{sale.date}</td>
                        <td className="p-4">
                          {sale.product}
                          <span className="text-yellow-500 ml-2">
                            (x{sale.quantity || 1})
                          </span>
                        </td>
                        <td className="p-4">{sale.customer}</td>
                        <td className="p-4 text-right">${sale.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
