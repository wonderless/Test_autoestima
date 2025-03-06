// src/components/auth/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type AllowedRoles = 'superadmin' | 'admin' | 'user' | Array<'superadmin' | 'admin' | 'user'>;

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AllowedRoles;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    console.log('ProtectedRoute - Current user:', user);
    console.log('ProtectedRoute - Allowed roles:', allowedRoles);
    
    // Esperar a que el estado de autenticación se cargue
    if (!loading) {
      // Si no hay usuario autenticado, redirigir a la página de inicio
      if (!user) {
        console.log('ProtectedRoute - No user, redirecting to home');
        router.push('/');
        return;
      }
      
      // Verificar si el usuario tiene el rol requerido
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      const hasRequiredRole = roles.includes(user.role);
      
      console.log('ProtectedRoute - User role:', user.role);
      console.log('ProtectedRoute - Has required role:', hasRequiredRole);
      
      if (!hasRequiredRole) {
        // Si el usuario no tiene el rol requerido, redirigir a la página de inicio
        console.log('ProtectedRoute - Access denied, redirecting to home');
        router.push('/');
        return;
      }
      
      setIsAuthorized(true);
    }
  }, [user, loading, router, allowedRoles]);
  
  // Mostrar estado de carga mientras se verifica la autenticación
  if (loading || !isAuthorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Renderizar los hijos si el usuario está autorizado
  return <>{children}</>;
}