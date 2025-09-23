"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const UserDashboard = () => {
  const router = useRouter();
  const [canTakeTest, setCanTakeTest] = useState(true);
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const {user, loading: authLoading, signOut} = useAuth();

  useEffect(() => {
    const checkTestAvailability = async () => {
      try {
        if (authLoading) {
          return; // Esperar a que la autenticación termine de cargar
        }

        if (!user) {
          router.push("/login");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        // Verificar si el usuario tiene un veracityScore alto (respuestas inconsistentes)
        const hasInconsistentResponses =
          userData && userData.veracityScore >= 3;

        // Si tuvo respuestas inconsistentes, siempre debe poder hacer el test nuevamente
        if (hasInconsistentResponses) {
          setCanTakeTest(true);
          setLoading(false);
          return;
        }

        // Sigue el flujo normal para verificar el tiempo si las respuestas fueron consistentes
        if (userData && userData.lastTestDate) {
          const lastTestDate = userData.lastTestDate.toDate();
          const currentDate = new Date();

          // Calcular cuándo puede hacer el test nuevamente (1 mes desde el último)
          const nextAvailableDate = new Date(lastTestDate);
          nextAvailableDate.setMonth(nextAvailableDate.getMonth() + 1);

          // Formatear la fecha para mostrarla
          const formattedDate = nextAvailableDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          setNextAvailableDate(formattedDate);

          // Verificar si ha pasado un mes
          if (currentDate < nextAvailableDate) {
            setCanTakeTest(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking test availability:", error);
        setLoading(false);
      }
    };

    checkTestAvailability();
  }, [router, user, authLoading]);

  const handleStartTest = () => {
    // Store start time in localStorage
    localStorage.setItem("testStartTime", Date.now().toString());
    router.push("/test");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-lg bg-celeste rounded-xl shadow-md flex flex-col items-center">
        <p className=" text-black">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-celeste p-8 rounded-lg shadow-md w-full max-w-md">
      
      {/* Sign Out Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>

      <h1 className="text-center text-2xl font-bold mb-4">
        Programa de evaluación y orientación de la autoestima
      </h1>

      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold">AUTOR:</h2>
        <p>Alex Grajeda Montalvo</p>
        <p>Ashley Yazbel Arteaga Torres</p>
        <p>Eliane Ruth Aynaya Camayo</p>
        <p>Joao Sebastian Salvador Vega </p>
        <p>Carlos Manuel Sosa Lupuche</p>
        <p>Aragon Josue Tafur Arzapalo</p>
        
      </div>

      {canTakeTest ? (
        <>
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold">INSTRUCCIONES:</h2>
            <p>
              Lee cada una de las siguientes oraciones y haz click en el
              recuadro correspondiente (SI o NO) de acuerdo a cómo te has
              sentido en este último mes.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStartTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Iniciar Test
            </button>
          </div>
        </>
      ) : (
        <div className="mb-4 text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Para realizar otra vez el test debe terminar todas las
                  actividades
                </h3>
                <div className="mt-4">
                  <button
                    onClick={() => router.push("/results")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver mis resultados anteriores
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
