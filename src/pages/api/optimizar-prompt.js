export const prerender = false;

export const POST = async (context) => {
  try {
    const data = await context.request.json();
    const { role, context: userContext, goal, format } = data;

    const apiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key faltante" }), { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2, // Temperatura baja para que sea un prompt estructurado
        messages: [
          {
            role: "system",
            content: `Eres una IA experta en Ingeniería de Prompts (Prompt Engineering) de nivel Staff. 
            Tu objetivo es tomar los datos de un formulario de usuario y construir un Prompt Maestro estructurado, profesional, optimizado para ser ejecutado en Claude, GPT-4 o Gemini.
            
            Usa técnicas de:
            1. Roleplaying ([ROL] explícito con mentalidad experta).
            2. Delimitadores de contexto claros ([CONTEXTO], [OBJETIVO], [FORMATO]).
            3. Instrucciones paso a paso de ejecución (Few-shot o Chain-of-Thought).
            4. Criterios de exclusión absoluta (qué debe evitar el modelo).

            Devuelve ÚNICAMENTE el prompt maestro final en texto plano, sin saludos, sin explicaciones tuyas, directo para copiar.`
          },
          {
            role: "user",
            content: `Optimiza este prompt con técnicas avanzadas:
            - ROL del sistema: Actúa como un ${role}
            - CONTEXTO: ${userContext}
            - OBJETIVO: ${goal}
            - FORMATO DE SALIDA: ${format}`
          }
        ]
      })
    });

    const json = await response.json();
    const promptOptimizado = json.choices[0].message.content.trim();

    return new Response(JSON.stringify({ prompt: promptOptimizado }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error en optimizar-prompt:", error);
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
};