'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-mi-color-rgb flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-center mb-12 text-white">Test de Autoestima General</h1>
      <div className="bg-celeste p-8 rounded-lg shadow-md w-full max-w-md mb-8">
        <h2 className="text-xl font-bold text-center mb-4">Acceso de Usuarios</h2>
        
        <div className="space-y-4">
          <Link
            href="/auth/loginUser"
            className="w-full block text-center bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión como Usuario
          </Link>
          
          <p className="text-sm text-gray-600 text-center">
            ¿No tienes cuenta?
            <Link
              href="/auth/registerUser"
              className="text-blue-500 hover:text-blue-700 transition duration-200"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
      
      <div className="bg-celeste p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Acceso de Administradores</h2>
        
        <Link
          href="/auth/loginAdmin"
          className="w-full block text-center bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Iniciar Sesión como Administrador
        </Link>
      </div>
    </div>
  );
}