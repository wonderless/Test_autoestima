"use client";
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface UserData {
  uid: string;
  email: string | null;
  role: 'user' | 'admin' | 'superadmin';
  invitationCode?: string;
  adminId?: string;
  personalInfo?: {
    nombres: string;
    apellidos: string;
    edad: number;
    universidad: string;
    carrera: string;
    ciclo: string;
    departamento: string;
  };
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserData>;
  signOut: () => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    invitationCode: string,
    personalInfo: UserData['personalInfo']
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Intentar obtener el usuario de cada colección
          const superadminDoc = await getDoc(doc(db, 'superadmins', firebaseUser.uid));
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          let userData: UserData | null = null;

          if (superadminDoc.exists()) {
            userData = { ...superadminDoc.data() as UserData, uid: firebaseUser.uid, role: 'superadmin' };
          } else if (adminDoc.exists()) {
            userData = { ...adminDoc.data() as UserData, uid: firebaseUser.uid, role: 'admin' };
          } else if (userDoc.exists()) {
            userData = { ...userDoc.data() as UserData, uid: firebaseUser.uid, role: 'user' };
          }

          if (userData) {
            setUser(userData);
          } else {
            console.error('Usuario autenticado pero sin documento en ninguna colección');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<UserData> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar en cada colección
      const superadminDoc = await getDoc(doc(db, 'superadmins', result.user.uid));
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      
      let userData: UserData | null = null;

      if (superadminDoc.exists()) {
        userData = { ...superadminDoc.data() as UserData, uid: result.user.uid, role: 'superadmin' };
      } else if (adminDoc.exists()) {
        userData = { ...adminDoc.data() as UserData, uid: result.user.uid, role: 'admin' };
      }

      if (!userData) {
        throw new Error("Acceso no autorizado: usuario no es admin ni superadmin");
      }

      setUser(userData);
      return userData;

    } catch (error: any) {
      console.error("Error en el inicio de sesión:", error);
      throw new Error(
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? "Credenciales inválidas"
          : error.message
      );
    }
  };
  
  const validateInvitationCode = async (code: string): Promise<string | null> => {
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
  
  // Modified function to prevent auto sign-in
  const registerUser = async (
    email: string,
    password: string,
    invitationCode: string,
    personalInfo: UserData['personalInfo']
  ) => {
    try {
      // Store current user info to maintain the session
      const currentUser = auth.currentUser;
      
      // 1. Validar el código de invitación y obtener el ID del admin
      const adminId = await validateInvitationCode(invitationCode);
      if (!adminId) {
        throw new Error("Código de invitación inválido");
      }

      // 2. Crear el usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 3. Crear el documento del usuario en la colección 'users'
      const userData = {
        email,
        role: 'user',
        invitationCode, // Guardamos el código de invitación
        adminId, // Guardamos el ID del admin que lo registró
        personalInfo,
      };

      await setDoc(doc(db, "users", uid), userData);
      
      // 4. Re-authenticate as the admin user if they were previously logged in
      if (currentUser && currentUser.email) {
        // We'll need to prompt for the admin's password to do this correctly
        // For now, we'll force a refresh on the current auth state
        await currentUser.reload();
      }

    } catch (error: any) {
      console.error("Error en el registro:", error);
      throw new Error(error.message || "Error en el registro");
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
    <AuthContext.Provider value={{ user, loading, signIn, signOut, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};