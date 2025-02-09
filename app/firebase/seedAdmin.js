import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDabBo_qam8YGuMA3nzcn6xsLkmcSgaRh0",
  authDomain: "oscared-db.firebaseapp.com",
  projectId: "oscared-db",
  storageBucket: "oscared-db.firebasestorage.app",
  messagingSenderId: "624093681916",
  appId: "1:624093681916:web:125fc8f9cce4abcf119f79",
  measurementId: "G-3F9D83G2RS",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const createAdminUser = async () => {
  const adminEmail = "admin@admin.com";
  const adminPassword = "admin123";

  try {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        adminPassword
      );
      console.log("Usuario administrador creado exitosamente");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          adminEmail,
          adminPassword
        );
        console.log("Usuario administrador ya existe, iniciando sesión");
      } else {
        throw error;
      }
    }

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: adminEmail,
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      password: "admin123",
    });

    console.log("Documento de usuario administrador actualizado exitosamente");
    console.log("Credenciales del administrador:");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    process.exit(0);
  } catch (error) {
    console.error("Error en el proceso:", error);
    process.exit(1);
  }
};

createAdminUser();
