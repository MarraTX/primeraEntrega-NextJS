import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db, auth } from "./firebaseConfig";

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

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    return {
      user: userCredential.user,
      role: userDoc.data()?.role || "USER",
    };
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        errorMessage = "Email o contraseña incorrectos";
        break;
      case "auth/invalid-email":
        errorMessage = "El formato del email no es válido";
        break;
      case "auth/too-many-requests":
        errorMessage = "Demasiados intentos. Intenta más tarde";
        break;
      default:
        errorMessage = "Error al iniciar sesión";
    }
    const customError = new Error(errorMessage);
    customError.code = error.code;
    throw customError;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Crear documento de usuario en la colección users
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "USER",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      password: password,
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  return signOut(auth);
};

export const checkUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data()?.role || "USER";
  } catch (error) {
    throw error;
  }
};

export const getSalesData = async () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

  const querySnapshot = await getDocs(
    query(
      collection(db, "ventas"),
      where("fecha", ">=", sevenDaysAgo),
      orderBy("fecha", "asc")
    )
  );

  // Agrupar ventas por día
  const salesByDay = {};
  querySnapshot.docs.forEach((doc) => {
    const date = doc.data().fecha.toDate().toLocaleDateString();
    salesByDay[date] = (salesByDay[date] || 0) + doc.data().monto;
  });

  return Object.entries(salesByDay).map(([date, sales]) => ({
    date,
    sales,
  }));
};

export const getMonthlySales = async () => {
  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

  const querySnapshot = await getDocs(
    query(
      collection(db, "ventas"),
      where("fecha", ">=", sixMonthsAgo),
      orderBy("fecha", "asc")
    )
  );

  const monthlyData = {};
  querySnapshot.docs.forEach((doc) => {
    const date = doc.data().fecha.toDate();
    const month = date.toLocaleString("es-ES", { month: "short" });
    monthlyData[month] = (monthlyData[month] || 0) + doc.data().monto;
  });

  return Object.entries(monthlyData).map(([month, sales]) => ({
    month,
    sales,
  }));
};

export const getSalesHistory = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, "ventas"), orderBy("fecha", "desc"), limit(10))
  );

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    date: doc.data().fecha.toDate().toLocaleDateString(),
    product: doc.data().producto,
    quantity: doc.data().quantity || 1,
    customer: doc.data().cliente,
    amount: doc.data().monto,
  }));
};
