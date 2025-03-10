import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';

// Inicializar Firebase Admin con una configu          ración más simple
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Extraer el UID del usuario de los parámetros de la URL o del body
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    
    // Si no hay UID en los parámetros, intentamos obtenerlo del body
    let userUid = uid;
    if (!userUid) {
      const body = await req.json();
      userUid = body.uid;
    }
    
    // Validar que se proporcionó un UID
    if (!userUid) {
      return NextResponse.json(
        { error: "UID del usuario es requerido" }, 
        { status: 400 }
      );
    }
    
    // Eliminar usuario usando Firebase Admin SDK
    await admin.auth().deleteUser(userUid);
    
    // Devolver respuesta exitosa
    return NextResponse.json({ 
      message: "Administrador eliminado exitosamente de Authentication"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error al eliminar administrador:", error);
    
    // Manejar el error y devolver una respuesta adecuada
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      );
    }
    
    // Error genérico
    return NextResponse.json(
      { error: "Error desconocido al eliminar administrador" }, 
      { status: 500 }
    );
  }
}