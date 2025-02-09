import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

const seedVentas = async () => {
  const ventasCollection = collection(db, "ventas");

  // Generar ventas para los últimos 7 días
  for (let i = 0; i < 7; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);

    await addDoc(ventasCollection, {
      fecha: fecha,
      producto: "Producto de prueba",
      cliente: "Cliente de prueba",
      monto: Math.floor(Math.random() * 1000) + 100,
    });
  }

  console.log("Datos de ventas de prueba agregados");
};

seedVentas();
