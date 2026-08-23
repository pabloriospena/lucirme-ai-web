export const prerender = false;

function buildFallbackPrompt({ role, seniority, salary, contract, timezone, english, modality, secondary }) {
  const secondaryInstruction = secondary
    ? "- Incluir fuentes secundarias (agregadores y job boards como LinkedIn, Indeed, Glassdoor) marcándolas con el icono ⚠️ en la columna 'Fuente'."
    : "- Excluir fuentes secundarias. Enfocarse exclusivamente en portales de carrera directos de empresas (fuentes primarias).";

  return `[ROL]
Actúa como un Reclutador Headhunter Senior y Especialista en Talent Acquisition Global. Tu objetivo es buscar, filtrar e identificar vacantes laborales reales publicadas recientemente que se ajusten con alta precisión al perfil del candidato.

[PERFIL DEL CANDIDATO]
- Rol buscado: ${role || 'Profesional / Especialista'}
- Nivel de experiencia / Seniority: ${seniority || 'Sin especificar'}
- Aspiración salarial mínima: ${salary || 'Abierto a negociación'}
- Tipo de contrato preferido: ${contract || 'Flexible'}
- Zona horaria compatible: ${timezone || 'Flexible'}
- Nivel de inglés: ${english || 'No especificado'}
- Modalidad laboral: ${modality || 'Flexible'}

[INSTRUCCIONES Y REGLAS DE BÚSQUEDA]
1. Realiza una búsqueda exhaustiva de ofertas de empleo activas publicadas en los últimos 7 a 14 días.
2. ${secondaryInstruction}
3. Evalúa la afinidad de cada vacante con el perfil y asigna un Match Score (porcentaje de 0% a 100%). Filtra únicamente las oportunidades con Match Score ≥ 70%.
4. Proporciona el enlace web directo e individual para postularse a cada vacante.

[FORMATO DE SALIDA]
Presenta la información consolidada en una tabla Markdown profesional con las siguientes columnas:
| Puesto / Título | Empresa | Modalidad | Salario | Match Score | Link Directo | Fuente | Publicado | Recomendación de Postulación |

[CRITERIOS DE EXCLUSIÓN]
- Excluir puestos no relacionados con ${role || 'el área especificada'}.
- Excluir publicaciones de más de 14 días de antigüedad o enlaces rotos.
- Excluir ofertas que no cumplan con la modalidad (${modality}) o el nivel salarial solicitado.

[ACCIONES FINALES]
Presenta la tabla ordenada por fecha de publicación (más recientes primero) y añade 3 recomendaciones tácticas para adaptar el CV antes de enviar la solicitud.`;
}

export const POST = async (context) => {
  try {
    let data = {};
    try {
      data = await context.request.json();
    } catch (e) {
      data = {};
    }

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

    const groqApiKey = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;
    const geminiApiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // 1. Intentar con Groq
    if (groqApiKey) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

        if (groqResponse.ok) {
          const json = await groqResponse.json();
          const promptGenerado = json.choices?.[0]?.message?.content?.trim();
          if (promptGenerado) {
            return new Response(JSON.stringify({ prompt: promptGenerado }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else {
          console.warn("Groq API error status:", groqResponse.status, await groqResponse.text().catch(() => ''));
        }
      } catch (errGroq) {
        console.warn("Error consultando Groq API:", errGroq);
      }
    }

    // 2. Intentar con Gemini como fallback
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
                    text: `Eres una IA experta en Empleabilidad Tech/Global y Prompt Engineering Staff. 
Genera un PROMPT MAESTRO DE ÉLITE para búsqueda de empleo con estos parámetros:
- Rol buscado: ${role || 'Cualquier rol tech/producto'}
- Nivel de experiencia: ${seniority || 'Sin especificar'}
- Salario mínimo: ${salary || 'Abierto a negociar'}
- Tipo de contrato: ${contract || 'Flexible'}
- Zona horaria: ${timezone || 'Flexible'}
- Nivel de inglés: ${english || 'No requerido'}
- Modalidad: ${modality || 'Flexible'}
- Fuentes secundarias con ⚠️: ${secondary ? 'SÍ' : 'NO'}

El prompt resultante debe tener secciones [ROL], [PERFIL DEL CANDIDATO], [INSTRUCCIONES Y REGLAS DE BÚSQUEDA], [FORMATO DE SALIDA TABLA MARKDOWN] y [CRITERIOS DE EXCLUSIÓN].
Devuelve ÚNICAMENTE el prompt maestro listo para copiar, sin introducciones ni comentarios.`
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
        console.warn("Error consultando Gemini API:", errGemini);
      }
    }

    // 3. Fallback garantizado local si no hay API keys o fallan las peticiones
    const fallbackPrompt = buildFallbackPrompt({
      role,
      seniority,
      salary,
      contract,
      timezone,
      english,
      modality,
      secondary
    });

    return new Response(JSON.stringify({ prompt: fallbackPrompt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error inesperado en generar-job-prompt:", error);
    // Incluso ante cualquier fallo inesperado, devolver un prompt usable en lugar de 500
    const fallbackPrompt = buildFallbackPrompt({});
    return new Response(JSON.stringify({ prompt: fallbackPrompt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
