// src/pages/api/taller/facilitador.ts
// Panel de quien dirige el taller. Todas las llamadas exigen la cabecera x-facilitador-key
// (variable de entorno TALLER_FACILITADOR_KEY).
//   GET  ?sesion=...               -> dolores, uso, agrupación y matriz (?formato=texto exporta los dolores en texto plano)
//   POST { sesion, accion: "agrupar" }                                  -> agrupa con Groq y guarda
//   POST { sesion, accion: "guardar", grupos: [...], fuente? }          -> guarda grupos (edición manual o JSON traído de Claude)
//   POST { sesion, accion: "publicar", publicada: boolean }             -> muestra u oculta la matriz en la diapositiva
//   POST { sesion, accion: "precargar" }                                -> agrega los 6 ítems del formulario de Sasa
//   POST { sesion, accion: "reiniciar", confirmar: "REINICIAR" }        -> borra todo lo de la sesión
import type { APIRoute } from 'astro';
import {
  agregarALista,
  borrarClaves,
  claves,
  esFacilitador,
  guardarValor,
  json,
  leerLista,
  leerValor,
  sesionDe,
  usaRedis,
} from '../../../lib/taller-store';
import { calcularMatriz, exportarTexto, type Agrupacion, type Dolor } from '../../../lib/taller-matriz';
import { agruparConGroq, normalizarGrupos } from '../../../lib/taller-agrupar';

export const prerender = false;

const PRECARGA: string[] = [
  'Responder emails',
  'Documentación de proyectos',
  'Informes y actas',
  'Toma de requerimientos',
  'Triage de casos de soporte y, si es posible, diagnóstico inicial',
  'Proyección de facturación vinculada con oportunidades',
];

function noAutorizado() {
  if (!(process.env.TALLER_FACILITADOR_KEY || '').trim()) {
    return json({ ok: false, error: 'Falta configurar TALLER_FACILITADOR_KEY en el servidor.' }, 503);
  }
  return json({ ok: false, error: 'Clave del facilitador incorrecta.' }, 401);
}

async function estadoCompleto(sesion: string) {
  const k = claves(sesion);
  const [dolores, uso, agrupacion] = await Promise.all([
    leerLista<Dolor>(k.dolores),
    leerLista<any>(k.uso),
    leerValor<Agrupacion>(k.agrupacion),
  ]);
  return {
    ok: true,
    almacenamiento: usaRedis() ? 'redis' : 'memoria',
    groq: Boolean((process.env.GROQ_API_KEY || '').trim()),
    dolores,
    uso,
    agrupacion,
    matriz: calcularMatriz(dolores, agrupacion),
  };
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!esFacilitador(request)) return noAutorizado();
  const sesion = sesionDe(url.searchParams.get('sesion'));
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  try {
    if (url.searchParams.get('formato') === 'texto') {
      const dolores = await leerLista<Dolor>(claves(sesion).dolores);
      return new Response(exportarTexto(dolores), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    return json(await estadoCompleto(sesion));
  } catch (e: any) {
    console.error('[taller/facilitador GET]', e?.message);
    return json({ ok: false, error: 'No se pudo leer la sesión.' }, 502);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!esFacilitador(request)) return noAutorizado();
  const cuerpo: any = await request.json().catch(() => ({}));
  const sesion = sesionDe(cuerpo.sesion);
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  const k = claves(sesion);

  try {
    switch (cuerpo.accion) {
      case 'agrupar': {
        const dolores = await leerLista<Dolor>(k.dolores);
        if (!dolores.length) return json({ ok: false, error: 'Todavía no hay dolores para agrupar.' }, 400);
        const grupos = await agruparConGroq(dolores);
        if (!grupos.length) return json({ ok: false, error: 'La IA no devolvió grupos válidos. Intenta de nuevo o usa el modo manual.' }, 502);
        const previa = await leerValor<Agrupacion>(k.agrupacion);
        const agrupacion: Agrupacion = {
          grupos,
          publicada: Boolean(previa?.publicada),
          actualizada: new Date().toISOString(),
          fuente: 'groq',
        };
        await guardarValor(k.agrupacion, agrupacion);
        return json(await estadoCompleto(sesion));
      }

      case 'guardar': {
        const dolores = await leerLista<Dolor>(k.dolores);
        const grupos = normalizarGrupos({ grupos: cuerpo.grupos }, dolores);
        const previa = await leerValor<Agrupacion>(k.agrupacion);
        const fuente = cuerpo.fuente === 'claude' ? 'claude' : 'manual';
        await guardarValor(k.agrupacion, {
          grupos,
          publicada: Boolean(previa?.publicada),
          actualizada: new Date().toISOString(),
          fuente,
        } satisfies Agrupacion);
        return json(await estadoCompleto(sesion));
      }

      case 'publicar': {
        const previa = await leerValor<Agrupacion>(k.agrupacion);
        if (!previa?.grupos?.length) return json({ ok: false, error: 'Primero agrupa los dolores.' }, 400);
        await guardarValor(k.agrupacion, { ...previa, publicada: Boolean(cuerpo.publicada), actualizada: new Date().toISOString() });
        return json(await estadoCompleto(sesion));
      }

      case 'precargar': {
        const actuales = await leerLista<Dolor>(k.dolores);
        const yaEsta = new Set(actuales.filter((d) => d.origen === 'formulario').map((d) => d.tarea));
        for (const tarea of PRECARGA) {
          if (yaEsta.has(tarea)) continue;
          const d: Dolor = {
            id: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
            tarea,
            rol: 'Formulario',
            horas_semana: null,
            frecuencia: null,
            procedimiento: null,
            estructurado: null,
            origen: 'formulario',
            creado: new Date().toISOString(),
          };
          await agregarALista(k.dolores, d);
        }
        return json(await estadoCompleto(sesion));
      }

      case 'reiniciar': {
        if (cuerpo.confirmar !== 'REINICIAR') return json({ ok: false, error: 'Falta la confirmación.' }, 400);
        await borrarClaves([k.dolores, k.uso, k.agrupacion]);
        return json(await estadoCompleto(sesion));
      }

      default:
        return json({ ok: false, error: 'Acción no válida.' }, 400);
    }
  } catch (e: any) {
    console.error('[taller/facilitador POST]', e?.message);
    return json({ ok: false, error: e?.message || 'Error interno.' }, 502);
  }
};
