export const prerender = false;

import { createClerkClient } from '@clerk/astro/server';

export const POST = async (context) => {
  try {
    const auth = context.locals.auth(); 
    const userId = auth?.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const data = await context.request.json();
    const { horasPerdidas, metodoDocumentacion, scoreTotal, email } = data;

    // 1. Diagnóstico de claves
    const mailerliteApiKey = import.meta.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_KEY;
    
    console.log(">>> DIAGNÓSTICO PREVENTIVA:");
    console.log("- Correo a enviar:", email);
    console.log("- API Key MailerLite cargada:", mailerliteApiKey ? "SÍ (gloria)" : "NO (vacía)");

    if (!mailerliteApiKey) {
      return new Response(JSON.stringify({ error: "MailerLite API Key faltante en .env" }), { status: 500 });
    }

    // 2. GUARDAR EN CLERK
    const clerkClient = createClerkClient({ 
      secretKey: import.meta.env.CLERK_SECRET_KEY,
      publishableKey: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY
    });

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { 
        preventaVol2: { horasPerdidas, metodoDocumentacion, scoreTotal, fecha: new Date().toISOString() }
      }
    });

    // 3. ENVIAR A MAILERLITE (Llamada limpia)
    // Reemplaza por tu ID de grupo real de MailerLite (asegúrate de que no tenga comillas ni espacios raros)
    const groupId = "189379795293832225"; 

    const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${mailerliteApiKey}`
      },
      body: JSON.stringify({
        email: email,
        groups: [groupId],
        fields: {
          score_preventa: scoreTotal.toString(),
          horas_perdidas: horasPerdidas.toString()
        }
      })
    });

    const mlJson = await mlResponse.json();

    if (!mlResponse.ok) {
      console.error(">>> ERROR REAL DE MAILERLITE:", mlJson);
      return new Response(JSON.stringify({ error: "Mailerlite rechazó la petición" }), { status: 502 });
    }

    console.log(">>> ÉXITO: Sincronizado con MailerLite:", mlJson);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(">>> ERROR CRÍTICO EN API PREVENTA:", error);
    return new Response(JSON.stringify({ error: "Error en sincronización" }), { status: 500 });
  }
};