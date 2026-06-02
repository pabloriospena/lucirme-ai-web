export const prerender = false;

export const POST = async (context) => {
  try {
    const data = await context.request.json();
    const textoCV = data.texto;

    const apiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "API Key faltante" }), { status: 500 });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, // Al mínimo para evitar divagaciones
        response_format: { type: "json_object" }, // Forzamos JSON
        messages: [
          {
            role: "system",
            content: `Analiza el CV antiguo y extrae la información. Devuelve EXCLUSIVAMENTE este JSON (sin textos extras ni markdown):
            {
              "nombre": "Nombre completo",
              "email": "Email",
              "telefono": "Teléfono",
              "ubicacion": "Ciudad, País",
              "linkedin": "URL LinkedIn",
              "perfil": "Perfil resumen",
              "skills": "Habilidades separadas por comas",
              "titulo": "Último título",
              "institucion": "Institución",
              "fecha_edu": "Año graduación",
              "portafolio": "Web",
              "idiomas": "Español: Nativo, Inglés: C1",
              "certificaciones": "Certificaciones",
              "experiencia": [
                {
                  "empresa": "Nombre empresa",
                  "cargo": "Cargo",
                  "fecha": "Fechas",
                  "logros": "Logros redactados"
                }
              ]
            }`
          },
          { role: "user", content: textoCV }
        ]
      })
    });

    const json = await response.json();
    
    if (json.error) {
      console.error(">>> ERROR EN GROQ:", json.error);
      return new Response(JSON.stringify({ error: json.error.message }), { status: 400 });
    }

    return new Response(json.choices[0].message.content, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error crítico en extraer-cv:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};