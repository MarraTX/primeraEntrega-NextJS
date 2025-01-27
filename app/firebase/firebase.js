import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getEstrenos = async () => {
  const querySnapshot = await getDocs(collection(db, "estrenos"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getPeliculas = async () => {
  const querySnapshot = await getDocs(collection(db, "peliculas"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
