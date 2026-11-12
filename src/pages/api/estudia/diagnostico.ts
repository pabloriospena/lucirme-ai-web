// src/pages/api/estudia/diagnostico.ts
// Diagnóstico anónimo de entrada de Estud-IA (nivel intermedio, clase 1).
//   POST { sesion, website?, niveles: [1|2|3 por concepto] } -> guarda una respuesta
//   GET  ?sesion=...&k=<TALLER_FACILITADOR_KEY>  (o cabecera x-facilitador-key) -> resumen por concepto
// Usa el mismo almacén que los talleres (Upstash Redis; vence a los 14 días).
import type { APIRoute } from 'astro';
import { agregarALista, esFacilitador, json, largoLista, leerLista, sesionDe } from '../../../lib/taller-store';
import { CONCEPTOS, claveDiagnostico } from '../../../lib/estudia-diagnostico';

export const prerender = false;

const MAX_POR_SESION = 400;

const llaveValida = (request: Request, url: URL) => {
  if (esFacilitador(request)) return true;
  const esperada = (process.env.TALLER_FACILITADOR_KEY || '').trim();
  const dada = (url.searchParams.get('k') || '').trim();
  if (!esperada || dada.length !== esperada.length) return false;
  let diff = 0;
  for (let i = 0; i < esperada.length; i++) diff |= esperada.charCodeAt(i) ^ dada.charCodeAt(i);
  return diff === 0;
};

export const POST: APIRoute = async ({ request }) => {
  const cuerpo: any = await request.json().catch(() => ({}));
  const sesion = sesionDe(cuerpo.sesion);
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  if (cuerpo.website) return json({ ok: true }); // honeypot

  const niveles = Array.isArray(cuerpo.niveles) ? cuerpo.niveles.map((n: unknown) => Number(n)) : [];
  if (niveles.length !== CONCEPTOS.length || niveles.some((n: number) => ![1, 2, 3].includes(n))) {
    return json({ ok: false, error: 'Responde los seis conceptos.' }, 400);
  }

  try {
    if ((await largoLista(claveDiagnostico(sesion))) >= MAX_POR_SESION) {
      return json({ ok: false, error: 'La sesión alcanzó su límite.' }, 429);
    }
    await agregarALista(claveDiagnostico(sesion), {
      id: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
      niveles,
      creado: new Date().toISOString(),
    });
    return json({ ok: true });
  } catch (e: any) {
    console.error('[estudia/diagnostico]', e?.message);
    return json({ ok: false, error: 'No se pudo guardar. Intenta de nuevo.' }, 502);
  }
};

export const GET: APIRoute = async ({ request, url }) => {
  if (!llaveValida(request, url)) return json({ ok: false, error: 'No autorizado.' }, 401);
  const sesion = sesionDe(url.searchParams.get('sesion'));
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  try {
    const respuestas = await leerLista<{ niveles: number[] }>(claveDiagnostico(sesion));
    const resumen = CONCEPTOS.map((concepto, i) => ({
      concepto,
      conteo: [1, 2, 3].map((n) => respuestas.filter((r) => r.niveles?.[i] === n).length),
    }));
    return json({ ok: true, sesion, total: respuestas.length, resumen });
  } catch (e: any) {
    console.error('[estudia/diagnostico]', e?.message);
    return json({ ok: false, error: 'No se pudo leer.' }, 502);
  }
};
