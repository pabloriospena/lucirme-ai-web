export const prerender = false;

function buildLocalPrompt({ role, context: userContext, goal, format }) {
  return `[ROL]
Actúa como un especialista senior en ${role || 'la materia'}.

[CONTEXTO]
${userContext || 'Sin contexto adicional proporcionado.'}

[OBJETIVO]
${goal || 'Cumplir la tarea asignada con alto estándar de calidad.'}

[FORMATO DE SALIDA]
${format || 'Texto estructurado en Markdown con encabezados claros.'}

[INSTRUCCIONES DE EJECUCIÓN]
1. Analiza cuidadosamente la información dada en el contexto.
2. Desarrolla la solución paso a paso asegurando rigurosidad técnica.
3. Mantén una comunicación clara, directa y profesional.

[CRITERIOS DE EXCLUSIÓN]
- No agregues introducciones genéricas ni comentarios irrelevantes.
- Evita asumir información que no esté fundamentada en el contexto.`;
}

export const POST = async (context) => {
  try {
    let data = {};
    try {
      data = await context.request.json();
    } catch (e) {
      data = {};
    }

    const { role, context: userContext, goal, format } = data;

    const groqApiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;
    const geminiApiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (groqApiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            messages: [
              {
                role: "system",
                content: `Eres una IA experta en Ingeniería de Prompts (Prompt Engineering) de nivel Staff. 
Tu objetivo es tomar los datos de un formulario de usuario y construir un Prompt Maestro estructurado, profesional, optimizado para ser ejecutado en Claude, GPT-4 o Gemini.

Usa técnicas de:
1. Roleplaying ([ROL] explícito con mentalidad experta).
2. Delimitadores de contexto claros ([CONTEXTO], [OBJETIVO], [FORMATO]).
3. Instrucciones paso a paso de ejecución.
4. Criterios de exclusión absoluta.

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

        if (response.ok) {
          const json = await response.json();
          const promptOptimizado = json.choices?.[0]?.message?.content?.trim();
          if (promptOptimizado) {
            return new Response(JSON.stringify({ prompt: promptOptimizado }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (errGroq) {
        console.warn("Groq error en optimizar-prompt:", errGroq);
      }
    }

    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Eres una IA experta en Prompt Engineering Staff. Construye un Prompt Maestro optimizado para ser ejecutado en Claude/GPT-4/Gemini con los siguientes datos:
- ROL: Actúa como ${role}
- CONTEXTO: ${userContext}
- OBJETIVO: ${goal}
- FORMATO: ${format}

Devuelve ÚNICAMENTE el prompt estructurado listo para copiar.`
                  }
                ]
              }
            ]
          })
        });

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          const textGemini = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (textGemini) {
            return new Response(JSON.stringify({ prompt: textGemini }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (errGemini) {
        console.warn("Gemini error en optimizar-prompt:", errGemini);
      }
    }

    const fallback = buildLocalPrompt({ role, context: userContext, goal, format });
    return new Response(JSON.stringify({ prompt: fallback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error en optimizar-prompt:", error);
    const fallback = buildLocalPrompt({});
    return new Response(JSON.stringify({ prompt: fallback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
