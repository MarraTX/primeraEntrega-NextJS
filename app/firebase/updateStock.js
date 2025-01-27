import { db } from "./firebaseConfig.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const updateProductsStock = async () => {
  try {
    const productosCollection = collection(db, "productos");
    const querySnapshot = await getDocs(productosCollection);

    const updatePromises = querySnapshot.docs.map(async (doc) => {
      await updateDoc(doc.ref, {
        stock: 90,
      });
      console.log(`Stock actualizado para: ${doc.data().nombre}`);
    });

    await Promise.all(updatePromises);
    console.log("Stock actualizado en todos los productos");
    process.exit(0);
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    process.exit(1);
  }
};

updateProductsStock();
