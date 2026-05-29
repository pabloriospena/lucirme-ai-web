export const prerender = false;

export const POST = async (context) => {
  try {
    const data = await context.request.json();
    const respuestas = data.respuestas;

    if (!respuestas || !respuestas.p1) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), { status: 400 });
    }

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
        temperature: 0.15, // Un toque de creatividad controlada
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Actúas como un consultor senior de la marca LuciRMe AI (Product Management y automatización). 
            Procesa las 4 respuestas de un diagnóstico y devuelve un JSON estricto con esta estructura:
            {
              "perfil": "individual" | "startup" | "empresa",
              "friccion": "Un análisis profundo de 2 líneas (máx 30 palabras) sobre su dolor real y el impacto en su tiempo.",
              "acciones": [
                "Acción 1: Táctica y concreta (máx 10 palabras)",
                "Acción 2: Táctica y concreta (máx 10 palabras)",
                "Acción 3: Táctica y concreta (máx 10 palabras)"
              ]
            }

            REGLAS:
            - "friccion": No repitas lo que el usuario escribió. Tradúcelo a su implicación de negocio o carrera (ej: 'La falta de automatización en tus reportes está limitando tu capacidad de proponer mejoras estratégicas').
            - "acciones": Deben ser 3 pasos ejecutables hoy mismo usando IA gratis (ChatGPT, NotebookLM, Sheets).`
          },
          {
            role: "user",
            content: `Respuestas del usuario:
            - Decisión: ${respuestas.p1}
            - Fricción de la semana: ${respuestas.p2}
            - Uso de IA hoy: ${respuestas.p3}
            - Foco si recupera tiempo: ${respuestas.p4}`
          }
        ]
      })
    });

    const json = await response.json();
    const resultadoIA = JSON.parse(json.choices[0].message.content);

    return new Response(JSON.stringify(resultadoIA), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error en API:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
};