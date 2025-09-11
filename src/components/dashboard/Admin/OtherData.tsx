"use client";

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

// Respuestas correctas según el archivo correctAnswers.ts
const correctAnswers: Record<number, boolean> = {
1: true, //academico
2: true,//social
3: false,//personal
4: false,//social
5: false,//academico
6: false,//
7: true,// fisico
8: false,//personal
9: true,// fisico
10: false, //personal
11: false,//
12: true,// fisico
13: true, //personal
14: true,//academico
15: false,//academico
16: true,//academico
17: false,//social
18: false,//fisico
19: false,//
20: false,//personal
21: true,//fisico
22: false,//
23: true,//social
24: false,//
25: true,//academico
26: true,//personal
27: true,//social
28: true,//fisico
29: true,//social
30: false,//

};

// División de categorías según ResultsDisplay.tsx
const categoryQuestions = {
  personal: [3, 8, 10, 13, 20, 26],
  social: [2, 4, 17, 23, 27, 29],
  academico: [1, 4, 14, 15, 16, 25],
  fisico: [7, 9, 12, 18, 21, 28]
};

interface UserTestData {
  email: string;
  testDuration?: number;
  testDuration2?: number;
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
  answers2?: Record<number, boolean>;
  invitationCode: string;
  testResults?: {
    academico?: { score: number; level: string };
    fisico?: { score: number; level: string };
    personal?: { score: number; level: string };
    social?: { score: number; level: string };
  };
  testResults2?: {
    academico?: { score: number; level: string };
    fisico?: { score: number; level: string };
    personal?: { score: number; level: string };
    social?: { score: number; level: string };
  };
  veracityScore?: number;
  veracityScore2?: number;
  hasRetakenTest?: boolean;
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

  // Función para calcular puntajes basándose en las respuestas
  const calculateScore = (answers: Record<number, boolean>, category: keyof typeof categoryQuestions): number => {
    const questionsInCategory = categoryQuestions[category];
    let correctCount = 0;
    
    questionsInCategory.forEach(questionNum => {
      const userAnswer = answers[questionNum];
      const correctAnswer = correctAnswers[questionNum];
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    
    // Retornar directamente el número de respuestas correctas (0-6)
    return correctCount;
  };

  // Función para obtener el puntaje (calculado o almacenado)
  const getScore = (answers: Record<number, boolean>, storedScore: number | undefined, category: keyof typeof categoryQuestions): number => {
    return storedScore !== undefined ? storedScore : calculateScore(answers, category);
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
          // Incluir usuarios que tengan al menos el primer intento
          if (userData.answers && userData.invitationCode === currentAdminCode) {
            usersData.push(userData);
          }
        });

        setUsers(usersData);
        setError(null);
      } catch (err) {
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

        const answers2Array = Array.from({ length: 30 }, (_, i) => {
          const answer = user.answers2?.[i + 1];
          return answer !== undefined ? (answer ? 'Sí' : 'No') : 'N/A';
        });

        // Calcular puntajes para el primer intento
        const personalScore = getScore(user.answers, user.testResults?.personal?.score, 'personal');
        const socialScore = getScore(user.answers, user.testResults?.social?.score, 'social');
        const academicoScore = getScore(user.answers, user.testResults?.academico?.score, 'academico');
        const fisicoScore = getScore(user.answers, user.testResults?.fisico?.score, 'fisico');

        // Calcular puntajes para el segundo intento
        const personalScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.personal?.score, 'personal') : 'N/A';
        const socialScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.social?.score, 'social') : 'N/A';
        const academicoScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.academico?.score, 'academico') : 'N/A';
        const fisicoScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.fisico?.score, 'fisico') : 'N/A';

        const autoestima = personalScore + socialScore + academicoScore + fisicoScore;
        const autoestima2 = user.answers2 ? 
          (typeof personalScore2 === 'number' ? personalScore2 : 0) +
          (typeof socialScore2 === 'number' ? socialScore2 : 0) +
          (typeof academicoScore2 === 'number' ? academicoScore2 : 0) +
          (typeof fisicoScore2 === 'number' ? fisicoScore2 : 0) : 'N/A';

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
          // Columnas del primer intento
          'Personal': personalScore,
          'Social': socialScore,
          'Académico': academicoScore,
          'Físico': fisicoScore,
          'Veracidad': user.veracityScore ?? 'N/A',
          'Autoestima': autoestima,
          // Columnas del segundo intento
          ...answers2Array.reduce((acc, curr, i) => ({
            ...acc,
            [`P${i + 1} S`]: curr
          }), {}),
          'Personal S': personalScore2,
          'Social S': socialScore2,
          'Académico S': academicoScore2,
          'Físico S': fisicoScore2,
          'Veracidad S': user.veracityScore2 ?? 'N/A',
          'Autoestima S': autoestima2
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
        // Anchos para las columnas del primer intento
        'Personal': 10,
        'Social': 10,
        'Académico': 12,
        'Físico': 10,
        'Veracidad': 10,
        'Autoestima': 12,
        // Anchos para las columnas del segundo intento
        ...Array.from({ length: 30 }, (_, i) => ({ [`P${i + 1} S`]: 6 })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        'Personal S': 10,
        'Social S': 10,
        'Académico S': 12,
        'Físico S': 10,
        'Veracidad S': 10,
        'Autoestima S': 12
      };

      ws['!cols'] = Object.values(colWidths).map(width => ({ width }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos Test');

      // Save file
      XLSX.writeFile(wb, 'datos_test_autoestima.xlsx');
    } catch (err) {
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
              {/* Columnas del segundo intento */}
              {Array.from({ length: 30 }, (_, i) => (
                <th key={`2-${i}`} className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                  P{i + 1} S
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Personal S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Social S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Académico S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Físico S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Veracidad S</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Autoestima S</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => {
              // Calcular puntajes para el primer intento
              const personalScore = getScore(user.answers, user.testResults?.personal?.score, 'personal');
              const socialScore = getScore(user.answers, user.testResults?.social?.score, 'social');
              const academicoScore = getScore(user.answers, user.testResults?.academico?.score, 'academico');
              const fisicoScore = getScore(user.answers, user.testResults?.fisico?.score, 'fisico');

              // Calcular puntajes para el segundo intento
              const personalScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.personal?.score, 'personal') : 'N/A';
              const socialScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.social?.score, 'social') : 'N/A';
              const academicoScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.academico?.score, 'academico') : 'N/A';
              const fisicoScore2 = user.answers2 ? getScore(user.answers2, user.testResults2?.fisico?.score, 'fisico') : 'N/A';

              const autoestima = personalScore + socialScore + academicoScore + fisicoScore;
              const autoestima2 = user.answers2 ? 
                (typeof personalScore2 === 'number' ? personalScore2 : 0) +
                (typeof socialScore2 === 'number' ? socialScore2 : 0) +
                (typeof academicoScore2 === 'number' ? academicoScore2 : 0) +
                (typeof fisicoScore2 === 'number' ? fisicoScore2 : 0) : 'N/A';

              return (
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
                  <td className="px-4 py-3 whitespace-nowrap">{personalScore}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{socialScore}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{academicoScore}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fisicoScore}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.veracityScore ?? 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{autoestima}</td>
                  {/* Datos del segundo intento */}
                  {Array.from({ length: 30 }, (_, i) => (
                    <td key={`2-${i}`} className="px-4 py-3 whitespace-nowrap">
                      {user.answers2 ? (user.answers2[i + 1] ? 'Sí' : 'No') : 'N/A'}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap">{personalScore2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{socialScore2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{academicoScore2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fisicoScore2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.veracityScore2 ?? 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{autoestima2}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


