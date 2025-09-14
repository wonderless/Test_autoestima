"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// Respuestas correctas según el archivo correctAnswers.ts
const correctAnswers: Record<number, boolean> = {
  1: true, //academico
  2: true, //social
  3: false, //personal
  4: false, //social
  5: false, //academico
  6: false, //
  7: true, // fisico
  8: false, //personal
  9: true, // fisico
  10: false, //personal
  11: false, //
  12: true, // fisico
  13: true, //personal
  14: true, //academico
  15: false, //academico
  16: true, //academico
  17: false, //social
  18: false, //fisico
  19: false, //
  20: false, //personal
  21: true, //fisico
  22: false, //
  23: true, //social
  24: false, //
  25: true, //academico
  26: true, //personal
  27: true, //social
  28: true, //fisico
  29: true, //social
  30: false, //
};

// División de categorías según ResultsDisplay.tsx
const categoryQuestions = {
  personal: [3, 8, 10, 13, 20, 26],
  social: [2, 4, 17, 23, 27, 29],
  academico: [1, 5, 14, 15, 16, 25],
  fisico: [7, 9, 12, 18, 21, 28],
};

interface UserData {
  email: string;
  invitationCode: string;
  personalInfo: {
    nombres: string;
    apellidos: string;
    sexo: string;
  };
  testResults?: {
    personal: { score: number; level: string };
    social: { score: number; level: string };
    academico: { score: number; level: string };
    fisico: { score: number; level: string };
  };
  testDuration?: number;
  answers?: Record<number, boolean>; // Agregar answers para poder calcular
}

export default function ListaUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [adminCode, setAdminCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Función para calcular puntajes basándose en las respuestas
  const calculateScore = (
    answers: Record<number, boolean>,
    category: keyof typeof categoryQuestions
  ): number => {
    const questionsInCategory = categoryQuestions[category];
    let correctCount = 0;

    questionsInCategory.forEach((questionNum) => {
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
  const getScore = (
    answers: Record<number, boolean> | undefined,
    storedScore: number | undefined,
    category: keyof typeof categoryQuestions
  ): number => {
    if (storedScore !== undefined) {
      return storedScore;
    }
    if (answers) {
      return calculateScore(answers, category);
    }
    return 0; // Si no hay ni puntaje almacenado ni respuestas
  };

  // Función para determinar el nivel basándose en el puntaje
  const getLevel = (score: number): string => {
    if (score >= 5) return "ALTO";
    if (score >= 3) return "MEDIO";
    return "BAJO";
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    let isMounted = true;

    const fetchData = async (user: any) => {
      if (!user) {
        if (isMounted) {
          router.push("/login");
        }
        return;
      }

      try {
        // Get current admin's email
        const currentAdminEmail = user.email;
        if (!currentAdminEmail) {
          throw new Error("No email found for admin");
        }

        // Get admin's invitation code
        const adminsSnapshot = await getDocs(collection(db, "admins"));
        let currentAdminCode = "";
        let adminFound = false;

        adminsSnapshot.forEach((doc) => {
          const adminData = doc.data();
          if (adminData.email === currentAdminEmail) {
            currentAdminCode = adminData.invitationCode;
            adminFound = true;
            if (isMounted) {
              setAdminCode(currentAdminCode);
              setIsAdmin(true);
            }
          }
        });

        if (!adminFound) {
          if (isMounted) {
            setIsAdmin(false);
            router.push("/");
          }
          return;
        }

        // Get all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData: UserData[] = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as UserData;
          // Solo incluir usuarios con el código de invitación correspondiente y que tengan resultados
          if (userData.invitationCode === currentAdminCode) {
            usersData.push(userData);
          }
        });

        if (isMounted) {
          setUsers(usersData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error al cargar los datos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Obtener estado de autenticación inicial
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchData(currentUser);
    } else {
      // Escuchar cambios en el estado de autenticación solo si no hay usuario actual
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        fetchData(user);
      });

      // Limpiar el listener cuando el componente se desmonte
      return () => {
        isMounted = false;
        unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Verificación de persistencia para evitar redirecciones no deseadas
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAdmin && !loading) {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const db = getFirestore();
          const adminsSnapshot = await getDocs(collection(db, "admins"));
          let isCurrentUserAdmin = false;

          adminsSnapshot.forEach((doc) => {
            const adminData = doc.data();
            if (adminData.email === currentUser.email) {
              isCurrentUserAdmin = true;
            }
          });

          if (!isCurrentUserAdmin) {
            router.push("/");
          }
        }
      }
    };

    checkAdminStatus();
  }, [isAdmin, loading, router]);

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
      {/* Invitation Code Display */}
      <div className="flex justify-end mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Código de Invitación:</h3>
          <p className="text-2xl font-bold text-blue-600">{adminCode}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-50 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-mi-color-rgb">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Sexo
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
            {users.map((user, index) => {
              // Calcular puntajes para cada categoría
              const personalScore = getScore(
                user.answers,
                user.testResults?.personal?.score,
                "personal"
              );
              const socialScore = getScore(
                user.answers,
                user.testResults?.social?.score,
                "social"
              );
              const academicoScore = getScore(
                user.answers,
                user.testResults?.academico?.score,
                "academico"
              );
              const fisicoScore = getScore(
                user.answers,
                user.testResults?.fisico?.score,
                "fisico"
              );

              // Determinar niveles
              const personalLevel =
                user.testResults?.personal?.level || getLevel(personalScore);
              const socialLevel =
                user.testResults?.social?.level || getLevel(socialScore);
              const academicoLevel =
                user.testResults?.academico?.level || getLevel(academicoScore);
              const fisicoLevel =
                user.testResults?.fisico?.level || getLevel(fisicoScore);

              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.personalInfo?.nombres && user.personalInfo?.apellidos
                      ? `${user.personalInfo?.nombres} ${user.personalInfo?.apellidos}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.personalInfo?.sexo || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{personalScore}/6</span>
                      <span
                        className={`text-sm ${
                          personalLevel === "ALTO"
                            ? "text-green-600"
                            : personalLevel === "MEDIO"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {personalLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{socialScore}/6</span>
                      <span
                        className={`text-sm ${
                          socialLevel === "ALTO"
                            ? "text-green-600"
                            : socialLevel === "MEDIO"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {socialLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{academicoScore}/6</span>
                      <span
                        className={`text-sm ${
                          academicoLevel === "ALTO"
                            ? "text-green-600"
                            : academicoLevel === "MEDIO"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {academicoLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{fisicoScore}/6</span>
                      <span
                        className={`text-sm ${
                          fisicoLevel === "ALTO"
                            ? "text-green-600"
                            : fisicoLevel === "MEDIO"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {fisicoLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(user.testDuration)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
