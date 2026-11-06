// src/lib/taller-matriz.ts
// Cálculo determinista de la matriz de dolores. La IA solo agrupa y nombra;
// todas las cifras (horas, viabilidad, cuadrante) salen de aquí.

export type Frecuencia = 'diaria' | 'semanal' | 'mensual';
export type Nivel = 'si' | 'parcial' | 'no';

export interface Dolor {
  id: string;
  tarea: string;
  rol: string;
  nombre?: string;
  horas_semana: number | null; // horas por semana que le dedica (estimación propia)
  frecuencia: Frecuencia | null;
  procedimiento: Nivel | null; // ¿hay un procedimiento escrito?
  estructurado: 'si' | 'no' | null; // ¿el resultado es tabla, documento o listado?
  origen?: 'formulario' | 'taller';
  creado: string;
}

export interface GrupoGuardado {
  id: string;
  nombre: string;
  dolor_de_fondo: string;
  ids: string[];
}

export interface Agrupacion {
  grupos: GrupoGuardado[];
  publicada: boolean;
  actualizada: string;
  fuente: 'groq' | 'claude' | 'manual';
}

export type Cuadrante = 'empezar-ya' | 'preparar-datos' | 'ganancia-pequena' | 'dejar-por-ahora' | 'sin-datos';

export interface GrupoCalculado {
  id: string;
  nombre: string;
  dolor_de_fondo: string;
  n: number; // dolores en el grupo
  personas: number; // roles+nombres distintos aproximados (ver abajo)
  roles: string[];
  impacto: number; // suma de horas/semana declaradas
  con_horas: number; // cuántos dolores traen horas
  viabilidad: number | null; // 0-100, solo con lo declarado
  cuadrante: Cuadrante;
  frecuencia_predominante: Frecuencia | null;
  textos: string[]; // las palabras de las personas, tal cual
}

export const UMBRAL_VIABILIDAD = 60;

const valorNivel = (n: Nivel | null): number | null => (n === 'si' ? 1 : n === 'parcial' ? 0.5 : n === 'no' ? 0 : null);
const valorEstructurado = (e: 'si' | 'no' | null): number | null => (e === 'si' ? 1 : e === 'no' ? 0 : null);

function viabilidadDe(items: Dolor[]): number | null {
  const parciales: number[] = [];
  for (const d of items) {
    const v = [valorNivel(d.procedimiento), valorEstructurado(d.estructurado)].filter((x): x is number => x !== null);
    if (v.length) parciales.push(v.reduce((a, b) => a + b, 0) / v.length);
  }
  if (!parciales.length) return null;
  return Math.round((parciales.reduce((a, b) => a + b, 0) / parciales.length) * 100);
}

function predominante(items: Dolor[]): Frecuencia | null {
  const cuenta: Record<string, number> = {};
  for (const d of items) if (d.frecuencia) cuenta[d.frecuencia] = (cuenta[d.frecuencia] ?? 0) + 1;
  const orden = Object.entries(cuenta).sort((a, b) => b[1] - a[1]);
  return (orden[0]?.[0] as Frecuencia) ?? null;
}

export function calcularMatriz(dolores: Dolor[], agrupacion: Agrupacion | null) {
  const porId = new Map(dolores.map((d) => [d.id, d]));
  const asignados = new Set<string>();
  const grupos: GrupoCalculado[] = [];

  for (const g of agrupacion?.grupos ?? []) {
    const items = g.ids.map((id) => porId.get(id)).filter((d): d is Dolor => Boolean(d));
    items.forEach((d) => asignados.add(d.id));
    if (!items.length) continue;
    const conHoras = items.filter((d) => typeof d.horas_semana === 'number' && !Number.isNaN(d.horas_semana));
    const impacto = Math.round(conHoras.reduce((a, d) => a + (d.horas_semana as number), 0) * 10) / 10;
    const viabilidad = viabilidadDe(items);
    const delTaller = items.filter((d) => d.origen !== 'formulario');
    const quienes = new Set(delTaller.map((d) => (d.nombre?.trim() ? d.nombre.trim().toLowerCase() : `${d.rol}#${d.id}`)));
    grupos.push({
      id: g.id,
      nombre: g.nombre,
      dolor_de_fondo: g.dolor_de_fondo,
      n: items.length,
      personas: quienes.size,
      roles: [...new Set(delTaller.map((d) => d.rol))],
      impacto,
      con_horas: conHoras.length,
      viabilidad,
      cuadrante: 'sin-datos',
      frecuencia_predominante: predominante(items),
      textos: items.map((d) => d.tarea),
    });
  }

  // Umbral de impacto: promedio de los grupos que tienen horas declaradas.
  const conImpacto = grupos.filter((g) => g.con_horas > 0);
  const umbralImpacto = conImpacto.length ? conImpacto.reduce((a, g) => a + g.impacto, 0) / conImpacto.length : 0;

  for (const g of grupos) {
    if (g.viabilidad === null || g.con_horas === 0) {
      g.cuadrante = 'sin-datos';
      continue;
    }
    const alto = g.impacto >= umbralImpacto;
    const viable = g.viabilidad >= UMBRAL_VIABILIDAD;
    g.cuadrante = alto && viable ? 'empezar-ya' : alto ? 'preparar-datos' : viable ? 'ganancia-pequena' : 'dejar-por-ahora';
  }

  const sinGrupo = dolores.filter((d) => !asignados.has(d.id));
  return { grupos, umbral_impacto: Math.round(umbralImpacto * 10) / 10, umbral_viabilidad: UMBRAL_VIABILIDAD, sin_grupo: sinGrupo };
}

// Texto plano para pegarlo en Claude (modo manual) o para exportar.
export function exportarTexto(dolores: Dolor[]): string {
  const filas = dolores.map((d) =>
    [
      `id=${d.id}`,
      `rol=${d.rol}`,
      d.nombre ? `nombre=${d.nombre}` : null,
      `horas_semana=${d.horas_semana ?? 'sin dato'}`,
      `frecuencia=${d.frecuencia ?? 'sin dato'}`,
      `procedimiento_escrito=${d.procedimiento ?? 'sin dato'}`,
      `resultado_estructurado=${d.estructurado ?? 'sin dato'}`,
      `dolor="${d.tarea.replace(/"/g, "'")}"`,
    ]
      .filter(Boolean)
      .join(' | ')
  );
  return filas.join('\n');
}
