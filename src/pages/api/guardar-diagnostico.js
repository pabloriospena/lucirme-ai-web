export const prerender = false;

import { createClerkClient } from '@clerk/astro/server';

export const POST = async (context) => {
  // 1. Obtenemos la sesión actual de forma robusta para Astro 6
  const auth = context.locals.auth(); 
  const userId = auth?.userId;
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  // 2. Leemos los datos enviados por el Selector
  const data = await context.request.json();
  
  // 3. Inicializamos el cliente de Clerk para poder actualizar el usuario
  const clerkClient = createClerkClient({ 
    secretKey: import.meta.env.CLERK_SECRET_KEY,
    publishableKey: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY
  });
  
  try {
    // 4. Guardamos el diagnóstico en el perfil privado del usuario
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { 
        ultimoDiagnostico: data,
        fechaDiagnostico: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error al guardar en Clerk:", error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};