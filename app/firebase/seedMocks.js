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
          stock: 90, // Agregamos un stock por defecto de 90 unidades
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
      try {
        // Convertir y validar cada campo explícitamente
        const peliculaData = {
          titulo: String(pelicula.titulo),
          imagen: String(pelicula.imagen),
          rating: parseFloat(pelicula.rating) || 0,
          anio: parseInt(pelicula.anio) || 0,
          generos: pelicula.generos ? pelicula.generos.map(String) : [],
        };

        // Verificar que no haya valores undefined o null
        Object.entries(peliculaData).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            throw new Error(`Campo ${key} no puede ser null o undefined`);
          }
        });

        await addDoc(peliculasCollection, peliculaData);
        console.log(`Película agregada: ${peliculaData.titulo}`);
      } catch (error) {
        console.error(`Error al agregar película:`, error);
      }
    }

    console.log("Proceso completado correctamente.");
  } catch (error) {
    console.error("Error al procesar documentos:", error);
  }
};

// Ejecutar la función
agregarDocumentosAFirestore()
  .then(() => {
    console.log("Script finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error en el script:", error);
    process.exit(1);
  });
