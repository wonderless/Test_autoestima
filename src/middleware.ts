// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Esta función verifica y extrae información del token de la cookie
const getUserFromCookie = (request: NextRequest) => {
  const session = request.cookies.get('__session')?.value;
  
  if (!session) {
    return null;
  }
  
  try {
    // Aquí podrías decodificar el JWT si estás usando uno
    // o simplemente verificar que la cookie existe
    return { authenticated: true };
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return null;
  }
};

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta protegida
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  // Obtener el usuario de la cookie
  const user = getUserFromCookie(request);
  
  // Si es una ruta protegida y no hay usuario autenticado, redirigir al inicio
  if (isProtectedRoute && !user) {
    console.log('Usuario no autenticado. Redirigiendo a la página de inicio.');
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configurar para que solo se ejecute en las rutas especificadas
export const config = {
  matcher: ['/dashboard/:path*'],
};