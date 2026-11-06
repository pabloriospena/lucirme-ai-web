// src/lib/taller-agrupar.ts
// Agrupa dolores parecidos con Groq (mismo patrón que /api/diagnosticar: llama-3.3-70b + JSON).
// La IA solo propone grupos; el código valida y la persona facilitadora corrige antes de proyectar.

import type { Dolor, GrupoGuardado } from './taller-matriz';

const MODELO = 'llama-3.3-70b-versatile';

const PROMPT_SISTEMA = `Eres un facilitador de talleres de IA aplicada. Recibes dolores de trabajo escritos por personas de un equipo y los agrupas por el problema de fondo que comparten.

Devuelve EXCLUSIVAMENTE un JSON con esta forma:
{"grupos":[{"nombre":"...","dolor_de_fondo":"...","ids":["..."]}]}

Reglas:
- Entre 3 y 8 grupos (menos si hay pocos dolores). Cada id aparece en exactamente un grupo.
- "nombre": máximo 5 palabras, concreto, sin adjetivos de marketing.
- "dolor_de_fondo": una sola frase de máximo 25 palabras que diga qué es lo que realmente duele, construida solo con lo que escribieron las personas.
- No inventes cifras, herramientas, nombres, procesos ni datos que no estén en los textos.
- No incluyas nombres de personas ni de clientes en ningún campo.
- Si un dolor no encaja con ningún otro, déjalo en su propio grupo.
- Escribe en español de Colombia, directo.`;

export function normalizarGrupos(crudos: unknown, dolores: Dolor[]): GrupoGuardado[] {
  const validos = new Set(dolores.map((d) => d.id));
  const usados = new Set<string>();
  const salida: GrupoGuardado[] = [];
  const lista = Array.isArray((crudos as any)?.grupos) ? (crudos as any).grupos : [];
  let n = 0;
  for (const g of lista) {
    const nombre = String(g?.nombre ?? '').trim().slice(0, 60);
    const fondo = String(g?.dolor_de_fondo ?? '').trim().slice(0, 240);
    const ids: string[] = [];
    for (const id of Array.isArray(g?.ids) ? g.ids : []) {
      const s = String(id);
      if (validos.has(s) && !usados.has(s)) {
        usados.add(s);
        ids.push(s);
      }
    }
    if (!nombre || !ids.length) continue;
    n += 1;
    salida.push({ id: `g${n}`, nombre, dolor_de_fondo: fondo, ids });
  }
  return salida;
}

export async function agruparConGroq(dolores: Dolor[]): Promise<GrupoGuardado[]> {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey) throw new Error('GROQ_API_KEY no está configurada en el servidor.');
  if (!dolores.length) return [];

  const entrada = dolores.map((d) => ({ id: d.id, rol: d.rol, dolor: d.tarea }));

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: PROMPT_SISTEMA },
        { role: 'user', content: `Dolores a agrupar (JSON):\n${JSON.stringify(entrada)}` },
      ],
    }),
  });

  if (!r.ok) {
    const detalle = await r.text().catch(() => '');
    throw new Error(`Groq respondió ${r.status}. ${detalle.slice(0, 200)}`);
  }
  const data = await r.json();
  const contenido = data?.choices?.[0]?.message?.content ?? '{}';
  let parsed: unknown;
  try {
    parsed = JSON.parse(contenido);
  } catch {
    throw new Error('Groq devolvió un JSON que no se pudo leer.');
  }
  return normalizarGrupos(parsed, dolores);
}
