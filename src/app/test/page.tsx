"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {TestForm} from "@/components/TestForm/TestForm"; // Ajusta la ruta según tu estructura

const TestPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null);

  useEffect(() => {
    const checkTestAccess = async () => {
      try {
        // Verificar si el usuario está autenticado
        const auth = getAuth();
        if (!auth.currentUser) {
          console.log('Usuario no autenticado, redirigiendo a login');
          router.push('/');
          return;
        }
        
        // Verificar si tiene el testStartTime en localStorage
        const testStartTime = localStorage.getItem('testStartTime');
        if (!testStartTime) {
          router.push('/dashboard/user');
          return;
        }
        
        // Verificar si puede hacer el test según los criterios de tiempo
        const db = getFirestore();
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          console.log('Documento de usuario no encontrado, permitiendo acceso al test');
          setCanAccess(true);
          setLoading(false);
          return;
        }
        
        const userData = userDoc.data();
        
        // Verificar si el usuario tiene un veracityScore alto (respuestas inconsistentes)
        const hasInconsistentResponses = userData && userData.veracityScore >= 3;
        
        // Si tuvo respuestas inconsistentes, siempre debe poder hacer el test nuevamente
        if (hasInconsistentResponses) {
          console.log('Usuario con respuestas inconsistentes, permitiendo acceso al test');
          setCanAccess(true);
          setLoading(false);
          return;
        }
        
        // Verificar si ya hizo el test y cuándo
        if (userData && userData.lastTestDate) {
          const lastTestDate = userData.lastTestDate.toDate();
          const currentDate = new Date();
          
          // Calcular cuándo puede hacer el test nuevamente (1 mes desde el último)
          const nextAvailableDate = new Date(lastTestDate);
          nextAvailableDate.setMonth(nextAvailableDate.getMonth() + 1);
          
          // Formatear la fecha para mostrarla
          const formattedDate = nextAvailableDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          
          setNextAvailableDate(formattedDate);
          
          // Verificar si ha pasado un mes
          if (currentDate < nextAvailableDate) {
            console.log('No ha pasado suficiente tiempo desde el último test');
            setCanAccess(false);
            setLoading(false);
            return;
          }
        }
        

        setCanAccess(true);
        setLoading(false);
      } catch (error) {
        console.error("Error verificando acceso al test:", error);
        router.push('/dashboard/user');
      }
    };
    
    checkTestAccess();
  }, [router]);
  
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

    );
  }
  
  if (!canAccess) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-lg bg-celeste rounded-xl shadow-md flex flex-col items-center">
        <div className="mb-4 text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Ya has realizado el test recientemente
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Para asegurar resultados precisos, podrás realizar el test nuevamente a partir del <strong>{nextAvailableDate}</strong>.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push('/results')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver mis resultados anteriores
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/dashboard/user')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }
  
  // Si puede acceder, mostrar el formulario del test
  return <TestForm />;
};

export default TestPage;