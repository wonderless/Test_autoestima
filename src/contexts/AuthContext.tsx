"use client";
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserInfo } from "@/types/userInfo";

// En tu AuthContext.tsx, actualiza la interfaz:
interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserInfo>;
  signOut: () => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    invitationCode: string,
    personalInfo: UserInfo["personalInfo"]
  ) => Promise<UserInfo>; // Cambiado de Promise<void> a Promise<UserInfo>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Intentar obtener el usuario de cada colección
          const superadminDoc = await getDoc(
            doc(db, "superadmins", firebaseUser.uid)
          );
          const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          let userData: UserInfo | null = null;

          if (superadminDoc.exists()) {
            userData = {
              ...(superadminDoc.data() as UserInfo),
              uid: firebaseUser.uid,
              role: "superadmin",
            };
          } else if (adminDoc.exists()) {
            userData = {
              ...(adminDoc.data() as UserInfo),
              uid: firebaseUser.uid,
              role: "admin",
            };
          } else if (userDoc.exists()) {
            userData = {
              ...(userDoc.data() as UserInfo),
              uid: firebaseUser.uid,
              role: "user",
            };
          }

          if (userData) {
            setUser(userData);
          } else {
            console.error(
              "Usuario autenticado pero sin documento en ninguna colección"
            );
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<UserInfo> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Obtener el token
      const token = await result.user.getIdToken();

      // Llamar a la API para establecer la cookie
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Error al establecer la sesión");
      }

      // Verificar roles igual que antes...
      const superadminDoc = await getDoc(
        doc(db, "superadmins", result.user.uid)
      );
      const adminDoc = await getDoc(doc(db, "admins", result.user.uid));
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      let userData: UserInfo | null = null;

      if (superadminDoc.exists()) {
        userData = {
          ...(superadminDoc.data() as UserInfo),
          uid: result.user.uid,
          role: "superadmin",
        };
      } else if (adminDoc.exists()) {
        userData = {
          ...(adminDoc.data() as UserInfo),
          uid: result.user.uid,
          role: "admin",
        };
      } else if (userDoc.exists()) {
        userData = {
          ...(userDoc.data() as UserInfo),
          uid: result.user.uid,
          role: "user",
        };
      }

      if (!userData) {
        // Cerrar sesión
        await firebaseSignOut(auth);
        await fetch("/api/auth/session", { method: "DELETE" });
        throw new Error("Usuario no encontrado en ninguna colección");
      }

      setUser(userData);
      return userData;
    } catch (error: any) {
      const isInvalidCredential =
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential";
      if (!isInvalidCredential) {
        console.error("Error en el inicio de sesión:", error);
      }
      throw new Error(
        isInvalidCredential ? "Credenciales inválidas" : error.message
      );
    }
  };
  const validateInvitationCode = async (
    code: string
  ): Promise<string | null> => {
    try {
      const adminCollection = collection(db, "admins");
      const q = query(adminCollection, where("invitationCode", "==", code));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Código de invitación inválido");
      }

      // Retorna el ID del admin que creó el código
      return querySnapshot.docs[0].id;
    } catch (error) {
      console.error("Error validando código de invitación:", error);
      throw new Error("Error al validar el código de invitación");
    }
  };
  const registerUser = async (
    email: string,
    password: string,
    invitationCode: string,
    personalInfo: UserInfo["personalInfo"]
  ): Promise<UserInfo> => {
    try {
      // 1. Validar código de invitación
      const adminId = await validateInvitationCode(invitationCode);
      if (!adminId) {
        throw new Error("Código de invitación inválido");
      }

      // 2. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 3. Crear documento en Firestore
      const userData: UserInfo = {
        uid,
        email,
        role: "user",
        invitationCode,
        adminId,
        personalInfo,
      };

      await setDoc(doc(db, "users", uid), userData);

      // 4. Esperar sincronización (500ms es suficiente)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 5. Obtener token y establecer cookie de sesión
      const token = await userCredential.user.getIdToken();
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!sessionRes.ok) {
        throw new Error("Error al establecer la sesión");
      }

      return userData;
    } catch (error: unknown) {
      // Si es un error de correo duplicado, lanzamos mensaje amigable y no logueamos el stack
      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        console.warn("Registro duplicado detectado:", error.code);
        throw new Error("Ya existe un usuario con ese correo electrónico.");
      }
      // Para otros errores, mostrar en consola
      console.error("Error en el registro:", error);
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw new Error("Error al registrar usuario");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
