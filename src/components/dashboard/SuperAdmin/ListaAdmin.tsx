import React, { useState, useEffect } from "react";
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  setDoc, 
  getDoc
} from "firebase/firestore";
import { db } from '@/lib/firebase/config';

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
      
      // 2. Usar la API de Firebase Admin en el servidor en lugar de hacerlo en el cliente
      // Llamamos a nuestra API para crear el usuario
      const response = await fetch('/api/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdmin.email,
          password: newAdmin.password,
          invitationCode: invitationCode,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear administrador');
      }
  
      const data = await response.json();
      const uid = data.user.uid;
      
      // 3. Crear documento en la colección 'admins'
      const adminData = {
        email: newAdmin.email,
        invitationCode: invitationCode,
        role: 'admin',
        uid: uid,
        password: newAdmin.password,
      };
      
      // No almacenamos la contraseña en Firestore por seguridad
      await setDoc(doc(db, "admins", uid), adminData);
      
      // 4. Actualizar el estado local
      setAdmins([...admins, { ...adminData, id: uid, password: newAdmin.password }]);
      setNewAdmin({ email: "", password: "" });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear administrador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm("¿Está seguro de eliminar este administrador? Esta acción también eliminará a todos los estudiantes asociados a este administrador.")) return;
    
    try {
      setLoading(true);
      
      // 1. Primero obtenemos el authUID desde el documento del admin
      const adminDoc = await getDoc(doc(db, "admins", id));
      const authUID = adminDoc.data()?.uid;
      
      if (!authUID) {
        setError("No se encontró el UID de autenticación para este administrador");
        return;
      }
      
      // 2. Eliminar a todos los usuarios asociados a este administrador
      const deleteUsersResponse = await fetch(`/api/admin/delete-users-by-admin?adminId=${authUID}`, {
        method: 'DELETE',
      });
      
      let usersDeletedCount = 0;
      if (deleteUsersResponse.ok) {
        const usersDeletedResult = await deleteUsersResponse.json();
        usersDeletedCount = usersDeletedResult.usersDeleted || 0;
      } else {
        console.error("Error al eliminar usuarios asociados:", await deleteUsersResponse.json());
      }
      
      // 3. Llamar al API route de Next.js para eliminar el administrador de Authentication
      const authResponse = await fetch(`/api/admin/delete-admin?uid=${authUID}`, {
        method: 'DELETE',
      });
      
      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || "Error al eliminar de Authentication");
      }
      
      // 4. Si la eliminación de Authentication fue exitosa, eliminar de Firestore
      await deleteDoc(doc(db, "admins", id));
      
      // 5. Actualizar el estado
      setAdmins(admins.filter(admin => admin.id !== id));
      setError(null);
      
      // 6. Mostrar mensaje de éxito
      alert(`Administrador eliminado exitosamente. También se eliminaron ${usersDeletedCount} estudiantes asociados.`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar administrador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-black">Cargando...</div>;
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
          <td className="border p-2 border-black">{admin.email}</td>
          <td className="border p-2 border-black">
            {showPassword[admin.id] ? admin.password : "********"}
          </td>
          <td className="border p-2 border-black">
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => togglePasswordVisibility(admin.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
              >
                {showPassword[admin.id] ? "Ocultar" : "Mostrar"}
              </button>
              <button
                onClick={() => handleDeleteAdmin(admin.id)}
                disabled={loading}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
    </div>
  );
};

export default ListaAdmin;