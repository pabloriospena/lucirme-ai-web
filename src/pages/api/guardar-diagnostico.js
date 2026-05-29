export const prerender = false;

import { createClerkClient } from '@clerk/astro/server';

export const POST = async (context) => {
  try {
    const auth = context.locals.auth(); 
    const userId = auth?.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const { respuestas } = await context.request.json();
    const apiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;

    // 1. Llamamos a Groq para procesar el diagnóstico en tiempo real
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.15,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Procesa las respuestas de un diagnóstico y devuelve un JSON estricto con esta estructura:
            {
              "perfil": "individual" | "startup" | "empresa",
              "friccion": "Un análisis profundo de 2 líneas (máx 30 palabras) sobre su dolor real.",
              "acciones": [
                "Acción 1 (máx 10 palabras)",
                "Acción 2 (máx 10 palabras)",
                "Acción 3 (máx 10 palabras)"
              ]
            }`
          },
          {
            role: "user",
            content: `Respuestas:
            - Perfil: ${respuestas.p1}
            - Fricción: ${respuestas.p2}
            - Uso de IA: ${respuestas.p3}
            - Foco: ${respuestas.p4}`
          }
        ]
      })
    });

    const json = await groqResponse.json();
    const resultadoIA = JSON.parse(json.choices[0].message.content);

    // 2. Guardamos el resultado en la metadata de Clerk
    const clerkClient = createClerkClient({ 
      secretKey: import.meta.env.CLERK_SECRET_KEY,
      publishableKey: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY
    });

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { 
        ultimoDiagnostico: {
          perfil: resultadoIA.perfil,
          dolor: resultadoIA.friccion,
          act1: resultadoIA.acciones[0],
          act2: resultadoIA.acciones[1],
          act3: resultadoIA.acciones[2]
        },
        fechaDiagnostico: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({ success: true, resultado: resultadoIA }), { status: 200 });

  } catch (error) {
    console.error("Error en guardar-diagnostico:", error);
    return new Response(JSON.stringify({ error: "Error en el guardado" }), { status: 500 });
  }
};