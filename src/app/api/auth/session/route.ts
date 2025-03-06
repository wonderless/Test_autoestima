// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 400 }
    );
  }
  
  // Configurar la cookie de sesión
  const cookieStore = await cookies();
  cookieStore.set({
    name: '__session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 14, // 2 semanas
    path: '/',
    sameSite: 'strict'
  });
  
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  // Eliminar la cookie de sesión
  const cookieStore = await cookies();
  cookieStore.delete('__session');
  
  return NextResponse.json({ success: true });
}