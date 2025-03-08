import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function UserLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // 1. Intentar autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Verificar si el usuario existe en la colección 'users'
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await auth.signOut();
        throw new Error('No tienes permiso para acceder como usuario');
      }
  
      const userData = userDoc.data();
      
      // 3. Verificar que el rol sea 'user'
      if (userData.role !== 'user') {
        await auth.signOut();
        throw new Error('No tienes permiso para acceder como usuario');
      }
      
      // 4. Establecer la sesión mediante la API
      const token = await userCredential.user.getIdToken();
      // Incluir el rol en el token para que el middleware pueda verificarlo
      const sessionData = {
        token,
        role: 'user'
      };  
      
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
      
      if (!response.ok) {
        throw new Error('Error al establecer la sesión');
      }
  
      // 5. Si todo está bien, redirigir al dashboard de usuario
      router.push('/dashboard/user');
  
    } catch (err: any) {
      console.error('Error durante el login:', err);
  
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
  
      // Manejar errores específicos de Firebase Auth
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'El usuario no existe. Verifica el correo ingresado.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta. Inténtalo de nuevo.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Ya existe una cuenta con este correo electrónico.';
      }else if(err.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas. Inténtalo de nuevo';
      } 
      else if (err.message) {
        errorMessage = err.message; 
      }
      //Sss
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-celeste p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión como Estudiante</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}