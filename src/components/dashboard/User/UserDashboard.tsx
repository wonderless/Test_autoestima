"use client";
import React from "react";
import { useRouter } from "next/navigation";

const UserDashboard = () => {
  const router = useRouter();

  const handleStartTest = () => {
    // Store start time in localStorage
    localStorage.setItem('testStartTime', Date.now().toString());
    router.push("/test");
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-lg bg-celeste rounded-xl shadow-md flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold mb-4">Test de Autoestima General (TAG)</h1>

      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold">AUTOR:</h2>
        <p>Dr. Alex Grajeda Montalvo</p>
      </div>

      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold">INSTRUCCIONES:</h2>
        <p>
          Lee cada una de las siguientes oraciones y haz click en el recuadro correspondiente 
          (SI o NO) de acuerdo a cómo te has sentido en este último mes.
        </p>
      </div>

      <button
        onClick={handleStartTest}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Iniciar Test
      </button>
    </div>
  );
};

export default UserDashboard;