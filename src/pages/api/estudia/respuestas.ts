// src/pages/api/estudia/respuestas.ts
// Respuestas anónimas de las clases de Estud-IA (sin login).
//   POST { sesion, website?, herramientas?, hecho_con_ia?, quiere_lograr?, preocupa? }  -> guarda una respuesta
//   GET  ?sesion=...&k=<TALLER_FACILITADOR_KEY>   (o cabecera x-facilitador-key)         -> lista las respuestas
// Usa el mismo almacén que los talleres (Upstash Redis; vence a los 14 días).
import type { APIRoute } from 'astro';
import { agregarALista, esFacilitador, json, largoLista, leerLista, sesionDe } from '../../../lib/taller-store';

export const prerender = false;

const MAX_POR_SESION = 400;
const clave = (sesion: string) => `estudia:${sesion}:conversemos`;

const texto = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);

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

  const respuesta = {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
    herramientas: texto(cuerpo.herramientas, 600),
    hecho_con_ia: texto(cuerpo.hecho_con_ia, 600),
    quiere_lograr: texto(cuerpo.quiere_lograr, 600),
    preocupa: texto(cuerpo.preocupa, 600),
    creado: new Date().toISOString(),
  };
  if (!respuesta.herramientas && !respuesta.hecho_con_ia && !respuesta.quiere_lograr && !respuesta.preocupa) {
    return json({ ok: false, error: 'Escribe al menos una respuesta.' }, 400);
  }

  try {
    if ((await largoLista(clave(sesion))) >= MAX_POR_SESION) {
      return json({ ok: false, error: 'La sesión alcanzó su límite.' }, 429);
    }
    await agregarALista(clave(sesion), respuesta);
    return json({ ok: true });
  } catch (e: any) {
    console.error('[estudia/respuestas]', e?.message);
    return json({ ok: false, error: 'No se pudo guardar. Intenta de nuevo.' }, 502);
  }
};

export const GET: APIRoute = async ({ request, url }) => {
  if (!llaveValida(request, url)) return json({ ok: false, error: 'No autorizado.' }, 401);
  const sesion = sesionDe(url.searchParams.get('sesion'));
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  try {
    const respuestas = await leerLista(clave(sesion));
    return json({ ok: true, sesion, total: respuestas.length, respuestas });
  } catch (e: any) {
    console.error('[estudia/respuestas]', e?.message);
    return json({ ok: false, error: 'No se pudo leer.' }, 502);
  }
};
