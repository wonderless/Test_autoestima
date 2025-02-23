import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  Timestamp,
  setDoc 
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from "firebase/auth";
import { db, auth } from '@/lib/firebase/config';

interface Admin {
  id: string;
  email: string;
  password: string;
  invitationCode: string;
}

const ListaAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState<Omit<Admin, 'id' | 'invitationCode'>>({
    email: "",
    password: "",
  });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Función para generar un código de invitación único
  const generateInvitationCode = (): string => {
    // Genera un código de 8 caracteres alfanuméricos
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Función para verificar si un código de invitación ya existe
  const isInvitationCodeUnique = async (code: string): Promise<boolean> => {
    const adminCollection = collection(db, "admins");
    const q = query(adminCollection, where("invitationCode", "==", code));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  // Función para generar un código único verificado
  const generateUniqueInvitationCode = async (): Promise<string> => {
    let code = generateInvitationCode();
    let isUnique = await isInvitationCodeUnique(code);
    
    // Si el código ya existe, genera uno nuevo hasta encontrar uno único
    while (!isUnique) {
      code = generateInvitationCode();
      isUnique = await isInvitationCodeUnique(code);
    }
    
    return code;
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const adminCollection = collection(db, "admins");
      const adminSnapshot = await getDocs(adminCollection);
      const adminList = adminSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Admin[];
      setAdmins(adminList);
    } catch (err) {
      setError("Error al cargar administradores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Generar código de invitación único
      const invitationCode = await generateUniqueInvitationCode();
      
      // 2. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newAdmin.email,
        newAdmin.password
      );
      
      const uid = userCredential.user.uid;

      // 3. Crear documento en la colección 'admins' con el código de invitación
      const adminData = {
        email: newAdmin.email,
        password: newAdmin.password,
        invitationCode: invitationCode
      };

      await setDoc(doc(db, "admins", uid), adminData);

      // 4. Actualizar el estado local
      setAdmins([...admins, { ...adminData, id: uid }]);
      setNewAdmin({ email: "", password: "" });
      setError(null);

    } catch (err: any) {
      setError(err.message || "Error al crear administrador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async (id: string, field: keyof Admin, value: string) => {
    const adminIndex = admins.findIndex(admin => admin.id === id);
    if (adminIndex === -1) return;

    try {
      if (field === 'password') {
        const admin = admins[adminIndex];
        await signInWithEmailAndPassword(auth, admin.email, admin.password);
      }

      // No permitir la edición del código de invitación
      if (field === 'invitationCode') {
        setError("No se puede modificar el código de invitación");
        return;
      }

      const updatedAdmins = [...admins];
      updatedAdmins[adminIndex] = {
        ...updatedAdmins[adminIndex],
        [field]: value,
      };
      setAdmins(updatedAdmins);
    } catch (err) {
      setError("Error al actualizar el administrador");
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editMode) return;

    try {
      setLoading(true);
      const adminToUpdate = admins.find(admin => admin.id === editMode);
      if (!adminToUpdate) return;

      const adminRef = doc(db, "admins", editMode);
      await updateDoc(adminRef, {
        ...adminToUpdate,
      });

      setEditMode(null);
      setError(null);
    } catch (err) {
      setError("Error al actualizar administrador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm("¿Está seguro de eliminar este administrador?")) return;

    try {
      setLoading(true);

      // Eliminar de Authentication
      const adminAuth = auth.currentUser;
      if (adminAuth) {
        await deleteUser(adminAuth);
      }

      // Eliminar de la colección admins
      await deleteDoc(doc(db, "admins", id));

      setAdmins(admins.filter(admin => admin.id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar administrador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Administradores</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          className="p-2 border rounded "
        />
        <button 
          onClick={handleAddAdmin} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          Agregar
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-mi-color-rgb text-white">
            <th className="border p-2">ID</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Contraseña</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="text-center hover:bg-gray-50">
              <td className="border p-2 border-black">{admin.id}</td>
              <td className="border p-2 border-black">
                {editMode === admin.id ? (
                  <input
                    type="email"
                    value={admin.email}
                    onChange={(e) => handleEditAdmin(admin.id, "email", e.target.value)}
                    className="p-1 border rounded w-full"
                  />
                ) : (
                  admin.email
                )}
              </td>
              <td className="border p-2 border-black">
                {editMode === admin.id ? (
                  <input
                    type="password"
                    value={admin.password}
                    onChange={(e) => handleEditAdmin(admin.id, "password", e.target.value)}
                    className="p-1 border rounded w-full"
                  />
                ) : (
                  "********"
                )}
              </td>

              <td className="border p-2 border-black">
                {editMode === admin.id ? (
                  <button 
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                ) : (
                  <button 
                    onClick={() => setEditMode(admin.id)}
                    disabled={loading}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAdmin;