import { db } from "./firebaseConfig.js"; // Ajusta si tienes otro nombre para este archivo
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import productosMock from "../mock/productosMock.js";
import estrenosPeliculas from "../mock/estrenosMock.js";
import peliculasTop from "../mock/peliculasMock.js";
// Ajusta la ruta según tu ubicación del mock

const agregarDocumentosAFirestore = async () => {
  try {
    // Agregar productos
    const productosCollection = collection(db, "productos");
    for (const producto of productosMock) {
      // Verificar si el producto ya existe
      const q = query(
        productosCollection,
        where("nombre", "==", producto.nombre)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(productosCollection, {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.imagen,
          category: producto.category,
          stock: 90, // Agregamos un stock por defecto de 10 unidades
        });
        console.log(`Producto agregado: ${producto.nombre}`);
      } else {
        console.log(`Producto ya existe: ${producto.nombre}`);
      }
    }

    // Agregar estrenos
    const estrenosCollection = collection(db, "estrenos");
    for (const estreno of estrenosPeliculas) {
      // Verificar si el estreno ya existe
      const q = query(
        estrenosCollection,
        where("titulo", "==", estreno.titulo)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(estrenosCollection, {
          titulo: estreno.titulo,
          anioEstreno: estreno.anioEstreno,
          genero: estreno.genero,
          rating: estreno.rating,
          image: estreno.image,
        });
        console.log(`Estreno agregado: ${estreno.titulo}`);
      } else {
        console.log(`Estreno ya existe: ${estreno.titulo}`);
      }
    }

    // Agregar películas
    const peliculasCollection = collection(db, "peliculas");
    for (const pelicula of peliculasTop) {
      // Verificar si la película ya existe
      const q = query(peliculasCollection, where("id", "==", pelicula.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(peliculasCollection, {
          titulo: pelicula.titulo,
          imagen: pelicula.imagen,
          rating: pelicula.rating,
          id: pelicula.id,
        });
        console.log(`Película agregada: ${pelicula.titulo}`);
      } else {
        console.log(`Película ya existe: ${pelicula.titulo}`);
      }
    }

    console.log("Proceso completado correctamente.");
  } catch (error) {
    console.error("Error al procesar documentos:", error);
  }
};

// Ejecuta el script
agregarDocumentosAFirestore();
