"use client";

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';


interface UserTestData {
  email: string;
  testDuration?: number;
  personalInfo: {
    edad: number;
    departamento: string;
    universidad: string;
    nombres: string;
    sexo: string;
    apellidos: string;
    carrera: string;
    ciclo: string;
  };
  answers: Record<number, boolean>;
  invitationCode: string;
  testResults?: {
    academico?: { score: number; level: string };
    fisico?: { score: number; level: string };
    personal?: { score: number; level: string };
    social?: { score: number; level: string };
  };
  veracityScore?: number;
}

export default function OtherData() {
  const [users, setUsers] = useState<UserTestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Get admin's invitation code
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        let currentAdminCode = '';
        let isAdmin = false;
        
        adminsSnapshot.forEach((doc) => {
          const adminData = doc.data();
          if (adminData.email === user.email) {
            currentAdminCode = adminData.invitationCode;
            isAdmin = true;
          }
        });

        if (!isAdmin) {
          router.push('/');
          return;
        }

        // Get users data
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData: UserTestData[] = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as UserTestData;
          if (userData.answers && userData.invitationCode === currentAdminCode) {
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

    return () => unsubscribe();
  }, [router]);

  const handleExportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = users.map((user, index) => {
        const answersArray = Array.from({ length: 30 }, (_, i) => {
          const answer = user.answers[i + 1];
          return answer ? 'Sí' : 'No';
        });

        const autoestima =
          (user.testResults?.academico?.score || 0) +
          (user.testResults?.fisico?.score || 0) +
          (user.testResults?.personal?.score || 0) +
          (user.testResults?.social?.score || 0);

        return {
          'N°': index + 1,
          'Email': user.email || 'N/A',
          'Nombre y Apellido': user.personalInfo?.nombres && user.personalInfo?.apellidos
            ? `${user.personalInfo.nombres} ${user.personalInfo.apellidos}`
            : 'N/A',
          'Edad': user.personalInfo?.edad || 'N/A',
          'Sexo': user.personalInfo?.sexo || 'N/A',
          'Región': user.personalInfo?.departamento || 'N/A',
          'Universidad': user.personalInfo?.universidad || 'N/A',
          'Carrera': user.personalInfo?.carrera || 'N/A',
          'Ciclo': user.personalInfo?.ciclo || 'N/A',
          'Tiempo': formatTime(user.testDuration)|| 'N/A',
          ...answersArray.reduce((acc, curr, i) => ({
            ...acc,
            [`P${i + 1}`]: curr
          }), {}),
          // Nuevas columnas añadidas
          'Personal': user.testResults?.personal?.score ?? 'N/A',
          'Social': user.testResults?.social?.score ?? 'N/A',
          'Académico': user.testResults?.academico?.score ?? 'N/A',
          'Físico': user.testResults?.fisico?.score ?? 'N/A',
          'Veracidad': user.veracityScore ?? 'N/A',
          'Autoestima': autoestima
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = {
        'N°': 5,
        'Email': 25,
        'Nombre y Apellido': 30,
        'Edad': 8,
        'Sexo': 15,
        'Región': 15,
        'Universidad': 25,
        'Carrera': 25,
        'Ciclo': 10,
        'Tiempo': 15,
        ...Array.from({ length: 30 }, (_, i) => ({ [`P${i + 1}`]: 6 })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        // Anchos para las nuevas columnas
        'Personal': 10,
        'Social': 10,
        'Académico': 12,
        'Físico': 10,
        'Veracidad': 10,
        'Autoestima': 12
      };

      ws['!cols'] = Object.values(colWidths).map(width => ({ width }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos Test');

      // Save file
      XLSX.writeFile(wb, 'datos_test_autoestima.xlsx');
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      alert('Error al exportar a Excel');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-black text-xl">Cargando...</div>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Datos Adicionales de Participantes</h1>
        <button
          onClick={handleExportToExcel}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                   transition-colors font-medium flex items-center gap-2"
        >
          <span>Exportar a Excel</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-mi-color-rgb">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">N°</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Nombre y Apellido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Edad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Sexo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Región</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Universidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Carrera</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Ciclo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Tiempo</th>
              {Array.from({ length: 30 }, (_, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                  P{i + 1}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Personal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Social</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Académico</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Físico</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Veracidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Autoestima</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.email || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.personalInfo?.nombres && user.personalInfo?.apellidos
                    ? `${user.personalInfo.nombres} ${user.personalInfo.apellidos}`
                    : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.edad || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.sexo || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.departamento || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.universidad || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.carrera || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.ciclo || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatTime(user.testDuration) || 'N/A'}</td>
                {Array.from({ length: 30 }, (_, i) => (
                  <td key={i} className="px-4 py-3 whitespace-nowrap">
                    {user.answers[i + 1] ? 'Sí' : 'No'}
                  </td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap">{user.testResults?.personal?.score ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.testResults?.social?.score ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.testResults?.academico?.score ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.testResults?.fisico?.score ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.veracityScore ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {( (user.testResults?.academico?.score || 0) +
                     (user.testResults?.fisico?.score || 0) +
                     (user.testResults?.personal?.score || 0) +
                     (user.testResults?.social?.score || 0) )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}