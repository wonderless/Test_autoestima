"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserInfo } from "@/types/userInfo";

interface RedirectProps {
  children?: React.ReactNode;
  fallbackPath?: string;
}

const isAllowedRoute: Record<UserInfo["role"], string[]> = {
  superadmin: ["/dashboard/superadmin"],
  admin: ["/dashboard/admin"],
  user: ["/dashboard/user", "/results", "/test"],
};

export default function Redirect({
  children,
  fallbackPath = "/",
}: RedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Esperar a que termine de cargar

    if (!user) {
      // Usuario no autenticado, redirigir al login solo si no está ya en páginas de auth
      if (
        !pathname.startsWith("/auth") &&
        !pathname.startsWith("/home") &&
        pathname !== "/"
      ) {
        router.replace(fallbackPath);
        return;
      }
      return;
    }

    console.log("Usuario autenticado con rol:", user.role);

    // Usuario autenticado, verificar si está en la ruta correcta según su rol
    const shouldRedirect = () => {
      switch (user.role) {
        case "superadmin":
          return (
            !pathname.startsWith("/dashboard/superadmin") &&
            !pathname.startsWith("/auth")
          );
        case "admin":
          return (
            !pathname.startsWith("/dashboard/admin") &&
            !pathname.startsWith("/auth")
          );
        case "user":
          return (
            !pathname.startsWith("/dashboard/user") &&
            !pathname.startsWith("/results") &&
            !pathname.startsWith("/test") &&
            !pathname.startsWith("/auth")
          );
        default:
          return true;
      }
    };

    if (shouldRedirect()) {
      // Redirigir según el rol del usuario
      switch (user.role) {
        case "superadmin":
          router.push("/dashboard/superadmin");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "user":
          router.push("/dashboard/user");
          break;
        default:
          router.push("/");
          break;
      }
    }
  }, [user, loading, router, fallbackPath, pathname]);

  // Mostrar loading mientras se determina la redirección
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mi-color-rgb">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  // Si hay children y el usuario está autenticado, mostrar el contenido
  if (
    children &&
    ((user && isAllowedRoute[user.role].includes(pathname)) ||
      (!user &&
        (pathname === "/" ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/home"))))
  ) {
    return <>{children}</>;
  }

  // Por defecto, mostrar loading mientras se redirige
  return (
    <div className="flex items-center justify-center min-h-screen bg-mi-color-rgb">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-100 mx-auto mb-4"></div>
        <p className="text-gray-100">Redirigiendo...</p>
      </div>
    </div>
  );
}
