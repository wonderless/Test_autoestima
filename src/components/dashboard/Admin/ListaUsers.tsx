"use client";

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface UserData {
  email: string;
  invitationCode: string;
  testResults?: {
    personal: { score: number; level: string };
    social: { score: number; level: string };
    academico: { score: number; level: string };
    fisico: { score: number; level: string };
  };
  testDuration?: number;
}

export default function ListaUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [adminCode, setAdminCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login'); // Redirigir al login si no hay usuario
        return;
      }

      try {
        // Get current admin's email
        const currentAdminEmail = user.email;
        if (!currentAdminEmail) {
          throw new Error('No email found for admin');
        }

        // Get admin's invitation code
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        let currentAdminCode = '';
        let isAdmin = false;
        
        adminsSnapshot.forEach((doc) => {
          const adminData = doc.data();
          if (adminData.email === currentAdminEmail) {
            currentAdminCode = adminData.invitationCode;
            isAdmin = true;
            setAdminCode(currentAdminCode);
          }
        });

        if (!isAdmin) {
          router.push('/'); // Redirigir si no es admin
          return;
        }

        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData: UserData[] = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as UserData;
          // Solo incluir usuarios con el código de invitación correspondiente y que tengan resultados
          if (userData.invitationCode === currentAdminCode && userData.testResults) {
            usersData.push(userData);
          }
        });

        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, [router]);

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Invitation Code Display */}
      <div className="flex justify-end mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Código de Invitación:</h3>
          <p className="text-2xl font-bold text-blue-600">{adminCode}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-50  rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-mi-color-rgb">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Personal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Académico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Físico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tiempo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{user.testResults?.personal.score}/6</span>
                    <span className={`text-sm ${
                      user.testResults?.personal.level === 'ALTO' ? 'text-green-600' :
                      user.testResults?.personal.level === 'MEDIO' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {user.testResults?.personal.level}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{user.testResults?.social.score}/6</span>
                    <span className={`text-sm ${
                      user.testResults?.social.level === 'ALTO' ? 'text-green-600' :
                      user.testResults?.social.level === 'MEDIO' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {user.testResults?.social.level}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{user.testResults?.academico.score}/6</span>
                    <span className={`text-sm ${
                      user.testResults?.academico.level === 'ALTO' ? 'text-green-600' :
                      user.testResults?.academico.level === 'MEDIO' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {user.testResults?.academico.level}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{user.testResults?.fisico.score}/6</span>
                    <span className={`text-sm ${
                      user.testResults?.fisico.level === 'ALTO' ? 'text-green-600' :
                      user.testResults?.fisico.level === 'MEDIO' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {user.testResults?.fisico.level}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatTime(user.testDuration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}