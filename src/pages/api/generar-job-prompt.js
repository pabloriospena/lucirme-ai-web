export const prerender = false;

export const POST = async (context) => {
  try {
    const data = await context.request.json();
    const {
      role,
      seniority,
      salary,
      contract,
      timezone,
      english,
      modality,
      secondary
    } = data;

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
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `Eres una IA experta en Empleabilidad Tech/Global, Reclutamiento Internacional e Ingeniería de Prompts (Prompt Engineering) de nivel Staff. 
Tu objetivo es tomar las preferencias de búsqueda laboral de un profesional y redactar un PROMPT MAESTRO DE ÉLITE altamente estructurado, pensado para ejecutarse en modelos de IA con búsqueda web o razonamiento profundo (como Gemini Deep Research, Perplexity, ChatGPT Plus o Claude).

EL PROMPT RESULTANTE DEBE INCLUIR:
1. [ROL]: Asignar a la IA un rol de Reclutador Headhunter Senior especializado en el área del usuario.
2. [PERFIL DEL CANDIDATO]: Detallar ordenadamente rol, seniority, aspiración salarial, modalidad, tipo de contrato, zona horaria y nivel de inglés.
3. [INSTRUCCIONES Y REGLAS DE BÚSQUEDA]:
   - Filtrado estricto por fecha (vacantes publicadas en los últimos 7 a 14 días).
   - Indicar si se permiten fuentes secundarias (agregadores/job boards) marcándolas con ⚠️, o únicamente sitios de carrera de empresas (fuentes primarias).
   - Requisito de coincidencia (Match Score ≥ 70%).
4. [FORMATO DE SALIDA DE TABLA MARKDOWN]: Especificar columnas claras como:
   | Puesto | Empresa | Modalidad | Salario | MatchScore | Link Directo | Fuente | Publicado | Nota Estratégica / Tip de Aplicación |
5. [CRITERIOS DE EXCLUSIÓN]: Excluir puestos no relacionados, agencias fantasma, ofertas vencidas o empleos que no cumplan los criterios obligatorios.

REGLA FUNDAMENTAL: Devuelve ÚNICAMENTE el prompt maestro estructurado final en texto plano/Markdown, sin ningún saludo tuyo, sin introducciones ni comentarios del tipo 'Aquí tienes tu prompt'. Directo para copiar.`
          },
          {
            role: "user",
            content: `Genera el Prompt Maestro de Élite para búsqueda laboral con estos parámetros:
- Rol buscado: ${role || 'Cualquier rol tech/producto'}
- Nivel de experiencia / Seniority: ${seniority || 'Sin especificar'}
- Salario mínimo esperado: ${salary || 'Abierto a negociar'}
- Tipo de contrato: ${contract || 'Flexible'}
- Zona horaria compatible: ${timezone || 'Flexible'}
- Nivel de inglés: ${english || 'No requerido'}
- Modalidad: ${modality || 'Flexible'}
- Incluir fuentes secundarias con advertencia ⚠️: ${secondary ? 'SÍ (incluir agregadores y job boards marcados)' : 'NO (solo fuentes primarias/sitios de carrera directos)'}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error en Groq API response:", errText);
      return new Response(JSON.stringify({ error: "Error en la API de Groq" }), { status: 500 });
    }

    const json = await response.json();
    const promptGenerado = json.choices[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ prompt: promptGenerado }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error en generar-job-prompt:", error);
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
};
