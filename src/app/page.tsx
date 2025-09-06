'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleConsent = () => {
    if (isChecked) {
      router.push('/home');
    } else {
      // Mostrar un mensaje si intentan continuar sin marcar la casilla
      alert("Debe aceptar los términos y condiciones para continuar.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full px-4 text-center space-y-6">
      <h1 className="text-2xl font-bold text-white">Programa de evaluación y orientación de la autoestima</h1>
      
      <div className="flex flex-col items-center w-full">
        <div className="inline-flex items-start justify-center text-left max-w-xs mx-auto">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="consent"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mr-2 mt-2 h-4 w-4 flex-shrink-0"
            />
            <span className="text-sm text-white font-bold mt-2">ACEPTO</span>
          </div>
          <div className="ml-2">
            <label htmlFor="consent" className="text-sm text-white">
              El presente es un programa experimental que busca medir y orientar la autoestima. En el caso que algún dominio de la autoestima se encuentre bajo, te orientará para que realices actividades que mejoren el déficit y evitar problemas psicologicos mayores. Tu participación es voluntaria. En el momento que desees puedes abandonar el programa. Si estás de acuerdo haz click en la casilla.
            </label>
            {!isChecked && (
              <p className="text-yellow-300 text-xs mt-1">
                * Es necesario marcar esta casilla para continuar
              </p>
            )}
          </div>
        </div>
      </div>
      
      <button
        disabled={!isChecked}
        className={`px-4 py-2 text-white rounded ${isChecked ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
        onClick={handleConsent}
      >
        {isChecked ? "Iniciar sesión / Registrarse" : "Marque la casilla para continuar"}
      </button>
      
    </div>
  );
}