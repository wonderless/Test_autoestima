import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';

// Inicializar Firebase Admin con una configuración más simple
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // Quita cualquier otra configuración que puedas tener aquí
    });
    console.log("Firebase Admin inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { email, password, invitationCode } = await req.json();
    
    // Validar datos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" }, 
        { status: 400 }
      );
    }
    
    // Crear usuario con Firebase Admin SDK
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });
    
    // Devolver respuesta exitosa con los datos del usuario
    return NextResponse.json({ 
      message: "Administrador creado exitosamente", 
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        role: 'admin'
      } 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error al crear administrador:", error);
    
    // Manejar el error y devolver una respuesta adecuada
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      );
    }
    
    // Error genérico
    return NextResponse.json(
      { error: "Error desconocido al crear administrador" }, 
      { status: 500 }
    );
  }
}