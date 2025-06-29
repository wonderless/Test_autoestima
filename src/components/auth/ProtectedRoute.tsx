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
    if (!loading) {
      if (!user) {
        router.push('/home');
        return;
      }

      // Verificar si el usuario tiene el rol requerido
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Definir jerarquía de roles (superadmin > admin > user)
      const roleHierarchy = {
        'superadmin': 3,
        'admin': 2,
        'user': 1
      };

      // Obtener el nivel del rol del usuario
      const userRoleLevel = roleHierarchy[user.role] || 0;

      // Verificar si el usuario tiene al menos el nivel de rol requerido
      let hasRequiredRole = false;

      for (const role of roles) {
        const requiredRoleLevel = roleHierarchy[role] || 0;
        if (userRoleLevel >= requiredRoleLevel) {
          hasRequiredRole = true;
          break;
        }
      }

      if (!hasRequiredRole) {
        router.push('/home');
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