// src/pages/api/taller/estado.ts
// Estado público para las diapositivas: conteos, uso de herramientas y la matriz SOLO si fue publicada.
// Nunca expone el texto crudo de los dolores ni los nombres.
import type { APIRoute } from 'astro';
import { claves, json, leerLista, leerValor, sesionDe, usaRedis } from '../../../lib/taller-store';
import { calcularMatriz, type Agrupacion, type Dolor } from '../../../lib/taller-matriz';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const sesion = sesionDe(url.searchParams.get('sesion'));
  if (!sesion) return json({ ok: false, error: 'Sesión no válida.' }, 400);
  const k = claves(sesion);
  try {
    const [dolores, uso, agrupacion] = await Promise.all([
      leerLista<Dolor>(k.dolores),
      leerLista<any>(k.uso),
      leerValor<Agrupacion>(k.agrupacion),
    ]);

    const herramientas: Record<string, number> = {};
    for (const u of uso) for (const h of u.herramientas ?? []) herramientas[h] = (herramientas[h] ?? 0) + 1;
    const ranking = Object.entries(herramientas)
      .sort((a, b) => b[1] - a[1])
      .map(([nombre, n]) => ({ nombre, n }));
    const paraQue = uso
      .map((u) => String(u.para_que || '').trim())
      .filter(Boolean)
      .slice(-12)
      .reverse();

    const delTaller = dolores.filter((d) => d.origen !== 'formulario');
    const publicada = Boolean(agrupacion?.publicada);
    const matriz = publicada ? calcularMatriz(dolores, agrupacion) : null;

    return json({
      ok: true,
      almacenamiento: usaRedis() ? 'redis' : 'memoria',
      dolores_total: delTaller.length,
      uso_total: uso.length,
      uso: { herramientas: ranking, para_que: paraQue },
      publicada,
      matriz: matriz
        ? {
            umbral_impacto: matriz.umbral_impacto,
            umbral_viabilidad: matriz.umbral_viabilidad,
            grupos: matriz.grupos.map(({ textos, ...g }) => g),
          }
        : null,
    });
  } catch (e: any) {
    console.error('[taller/estado]', e?.message);
    return json({ ok: false, error: 'No se pudo leer el estado.' }, 502);
  }
};
