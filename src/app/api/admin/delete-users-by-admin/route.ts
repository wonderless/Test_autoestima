// app/api/admin/delete-users-by-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Reutilizamos la misma inicialización de Firebase Admin que ya tienes
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
    // Extraer el adminId de los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get('adminId');
    
    // Si no hay adminId en los parámetros, intentamos obtenerlo del body
    let userAdminId = adminId;
    if (!userAdminId) {
      const body = await req.json();
      userAdminId = body.adminId;
    }
    
    // Validar que se proporcionó un adminId
    if (!userAdminId) {
      return NextResponse.json(
        { error: "ID del administrador es requerido" },
        { status: 400 }
      );
    }
    
    // Obtenemos una referencia a Firestore
    const firestore = getFirestore();
    
    // 1. Obtenemos todos los usuarios asociados a este administrador
    const usersSnapshot = await firestore.collection('users')
      .where('adminId', '==', userAdminId)
      .get();
    
    if (usersSnapshot.empty) {
      return NextResponse.json({
        message: "No se encontraron usuarios asociados a este administrador",
        usersDeleted: 0
      }, { status: 200 });
    }
    
    // 2. Para cada usuario, conseguimos su email y buscamos su UID en Authentication
    const deletionResults = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        try {
          // Primero, eliminamos el usuario de Authentication si tiene email
          let authDeleted = false;
          if (userData.email) {
            try {
              const userRecord = await admin.auth().getUserByEmail(userData.email);
              await admin.auth().deleteUser(userRecord.uid);
              authDeleted = true;
            } catch (authError) {
              console.error(`Error al eliminar usuario ${userId} (${userData.email}) de Authentication:`, authError);
              // Continuamos con la eliminación de Firestore aunque falle la de Authentication
            }
          }
          
          // Luego, eliminamos el documento de Firestore
          await firestore.collection('users').doc(userId).delete();
          
          return { 
            id: userId, 
            email: userData.email || 'No disponible', 
            firestoreDeleted: true, 
            authDeleted,
            success: true
          };
        } catch (error) {
          console.error(`Error al eliminar usuario ${userId}:`, error);
          return { 
            id: userId, 
            email: userData.email || 'No disponible', 
            error: error instanceof Error ? error.message : String(error),
            success: false
          };
        }
      })
    );
    
    // Contamos cuántos usuarios se eliminaron correctamente
    const successfulDeletions = deletionResults.filter(result => result.success).length;
    
    // 3. Devolver respuesta con los resultados
    return NextResponse.json({
      message: `${successfulDeletions} de ${usersSnapshot.size} usuarios asociados al administrador eliminados exitosamente`,
      totalUsers: usersSnapshot.size,
      usersDeleted: successfulDeletions,
      results: deletionResults
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error al eliminar usuarios por adminId:", error);
    
    // Manejar el error y devolver una respuesta adecuada
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Error genérico
    return NextResponse.json(
      { error: "Error desconocido al eliminar usuarios" },
      { status: 500 }
    );
  }
}