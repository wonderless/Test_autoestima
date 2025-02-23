"use client";

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface UserTestData {
  email: string;
  personalInfo: {
    edad: number;
    departamento: string;
    universidad: string;
    nombres: string;
    apellidos: string;
    carrera: string;
    ciclo: string;
  };
  answers: Record<number, boolean>;
  invitationCode: string;
}

export default function OtherData() {
  const [users, setUsers] = useState<UserTestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

        return {
          'N°': index + 1,
          'Edad': user.personalInfo?.edad || 'N/A',
          'Región': user.personalInfo?.departamento || 'N/A',
          'Universidad': user.personalInfo?.universidad || 'N/A',
          ...answersArray.reduce((acc, curr, i) => ({
            ...acc,
            [`P${i + 1}`]: curr
          }), {})
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = {
        'N°': 5,
        'Edad': 8,
        'Región': 15,
        'Universidad': 30,
        ...Array.from({ length: 30 }, (_, i) => ({ [`P${i + 1}`]: 6 })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
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
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Edad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Región</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Universidad</th>
              {Array.from({ length: 30 }, (_, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                  P{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.edad || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.departamento || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.personalInfo?.universidad || 'N/A'}</td>
                {Array.from({ length: 30 }, (_, i) => (
                  <td key={i} className="px-4 py-3 whitespace-nowrap">
                    {user.answers[i + 1] ? 'Sí' : 'No'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}