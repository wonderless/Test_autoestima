'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleConsent = () => {
    if (isChecked) {
      router.push('/home');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-2xl font-bold text-white">Bienvenido al Proyecto</h1>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="consent"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="consent" className="text-sm text-white">
          Acepto los términos y condiciones para participar en el proyecto
        </label>
      </div>
      <button
        disabled={!isChecked}
        className={`px-4 py-2 text-white rounded ${isChecked ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
        onClick={handleConsent}
      >
        Iniciar sesión / Registrarse
      </button>
    </div>
  );
}