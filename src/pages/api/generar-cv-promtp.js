export const prerender = false;

export const POST = async (context) => {
  try {
    const data = await context.request.json();
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
        temperature: 0.15, // Muy bajo para máxima veracidad de datos
        messages: [
          {
            role: "system",
            content: `Eres un redactor de CVs profesionales de nivel Staff y experto en sistemas ATS (Applicant Tracking Systems). 
            Tu objetivo es tomar los datos de un candidato y redactar un CV profesional e indestructible para pasar filtros de reclutamiento.

            REGLAS DE REDACCIÓN:
            1. Formato: Usa Markdown limpio. Sin tablas, sin columnas, sin iconos decorativos (esto confunde a los parsers de ATS).
            2. Verbos de acción: Abre cada logro laboral con un verbo de acción potente en primera persona (Lideré, Optimicé, Diseñé, Reduje).
            3. No inventes información. Si falta un dato o fecha, pon un marcador como [PENDIENTE] para que el candidato lo complete.
            4. Tono: Pragmático, enfocado en resultados cuantificables (mencionando métricas si están disponibles).
            
            Devuelve ÚNICAMENTE el texto redactado del CV en formato Markdown, listo para copiar.`
          },
          {
            role: "user",
            content: `Redacta mi CV profesional con estos datos reales:
            - Nombre: ${data.nombre}
            - Email: ${data.email}
            - Teléfono: ${data.telefono}
            - Ubicación: ${data.ubicacion}
            - LinkedIn: ${data.linkedin}
            - Perfil: ${data.perfil}
            - Habilidades: ${data.skills}
            - Objetivo: ${data.objetivo}
            - Educación: ${data.titulo} en ${data.institucion} (${data.fecha_edu})
            - Experiencia Laboral: ${JSON.stringify(data.experiencia)}`
          }
        ]
      })
    });

    const json = await response.json();
    const cvRedactado = json.choices[0].message.content.trim();

    return new Response(JSON.stringify({ prompt: cvRedactado }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error en generar-cv-prompt:", error);
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
};