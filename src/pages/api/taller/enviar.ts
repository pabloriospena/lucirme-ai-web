// src/pages/api/taller/enviar.ts
// Recibe lo que escriben las personas durante el taller (sin login).
//   { sesion, tipo: "dolores", website?, items: [{ tarea, rol, nombre?, horas_semana?, frecuencia?, procedimiento?, estructurado? }] }
//   { sesion, tipo: "uso", website?, herramientas: string[], para_que, frecuencia, rol }
import type { APIRoute } from 'astro';
import { agregarALista, claves, json, largoLista, sesionDe } from '../../../lib/taller-store';
import type { Dolor } from '../../../lib/taller-matriz';

export const prerender = false;

const MAX_POR_SESION = 400;
const ROLES = [
  'Gerencia',
  'Comercial',
  'Soporte',
  'Servicios administrados',
  'Proyectos y consultoría',
  'Procesos',
  'Tecnología y desarrollo',
  'Administración',
  'Otro',
];
const HERRAMIENTAS = ['ChatGPT', 'Gemini', 'Claude', 'Cursor', 'NotebookLM', 'Grok', 'DeepSeek', 'Copilot', 'Otra', 'Ninguna'];

const texto = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
const elegir = <T extends string>(v: unknown, permitidos: readonly T[]): T | null =>
  permitidos.includes(String(v) as T) ? (String(v) as T) : null;
const id8 = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8);

export const POST: APIRoute = async ({ request }) => {
  const cuerpo = await request.json().catch(() => ({}));
  const sesion = sesionDe((cuerpo as any).sesion);
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);

  // Honeypot: un bot rellena este campo, una persona no.
  if ((cuerpo as any).website) return json({ ok: true });

  const tipo = (cuerpo as any).tipo;
  const k = claves(sesion);

  try {
    if (tipo === 'dolores') {
      const items: any[] = Array.isArray((cuerpo as any).items) ? (cuerpo as any).items.slice(0, 3) : [];
      const actual = await largoLista(k.dolores);
      if (actual + items.length > MAX_POR_SESION) return json({ ok: false, error: 'La sesión alcanzó su límite.' }, 429);

      let guardados = 0;
      for (const it of items) {
        const tarea = texto(it?.tarea, 300);
        const rol = elegir(it?.rol, ROLES);
        if (tarea.length < 5 || !rol) continue;
        const horasNum = Number(String(it?.horas_semana ?? '').replace(',', '.'));
        const dolor: Dolor = {
          id: id8(),
          tarea,
          rol,
          nombre: texto(it?.nombre, 60) || undefined,
          horas_semana: Number.isFinite(horasNum) && horasNum >= 0 && horasNum <= 80 && String(it?.horas_semana ?? '') !== '' ? horasNum : null,
          frecuencia: elegir(it?.frecuencia, ['diaria', 'semanal', 'mensual'] as const),
          procedimiento: elegir(it?.procedimiento, ['si', 'parcial', 'no'] as const),
          estructurado: elegir(it?.estructurado, ['si', 'no'] as const),
          origen: 'taller',
          creado: new Date().toISOString(),
        };
        await agregarALista(k.dolores, dolor);
        guardados += 1;
      }
      if (!guardados) return json({ ok: false, error: 'Escribe al menos un dolor con su rol.' }, 400);
      return json({ ok: true, guardados });
    }

    if (tipo === 'uso') {
      const actual = await largoLista(k.uso);
      if (actual >= MAX_POR_SESION) return json({ ok: false, error: 'La sesión alcanzó su límite.' }, 429);
      const herramientas = (Array.isArray((cuerpo as any).herramientas) ? (cuerpo as any).herramientas : [])
        .map((h: unknown) => elegir(h, HERRAMIENTAS))
        .filter((h: string | null): h is string => Boolean(h));
      const paraQue = texto((cuerpo as any).para_que, 300);
      if (!herramientas.length && paraQue.length < 5) return json({ ok: false, error: 'Cuéntanos qué usas o para qué.' }, 400);
      await agregarALista(k.uso, {
        id: id8(),
        herramientas: [...new Set(herramientas)],
        para_que: paraQue,
        frecuencia: elegir((cuerpo as any).frecuencia, ['diaria', 'semanal', 'mensual', 'casi-nunca'] as const),
        rol: elegir((cuerpo as any).rol, ROLES),
        creado: new Date().toISOString(),
      });
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Tipo no válido.' }, 400);
  } catch (e: any) {
    console.error('[taller/enviar]', e?.message);
    return json({ ok: false, error: 'No se pudo guardar. Intenta de nuevo.' }, 502);
  }
};
