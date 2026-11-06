// src/lib/taller-store.ts
// Almacén para las dinámicas en vivo de los talleres (usos de IA, dolores, agrupación).
// Producción: Upstash Redis por REST (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
// Desarrollo local sin variables: memoria del proceso (NO es fiable en Vercel; el estado lo avisa).

const TTL_SEGUNDOS = 60 * 60 * 24 * 14; // 14 días

const url = () => (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/$/, '');
const token = () => (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();

export const usaRedis = () => Boolean(url() && token());

// ---- Memoria (solo desarrollo) ----
type Mem = { listas: Map<string, string[]>; valores: Map<string, string> };
const g = globalThis as unknown as { __tallerMem?: Mem };
const mem: Mem = (g.__tallerMem ??= { listas: new Map(), valores: new Map() });

async function redis<T = unknown>(comando: (string | number)[]): Promise<T> {
  const r = await fetch(url(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(comando),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || (data as any).error) {
    throw new Error(`Upstash: ${(data as any).error || r.status}`);
  }
  return (data as any).result as T;
}

export async function agregarALista(clave: string, valor: unknown): Promise<number> {
  const texto = JSON.stringify(valor);
  if (usaRedis()) {
    const n = await redis<number>(['RPUSH', clave, texto]);
    await redis(['EXPIRE', clave, TTL_SEGUNDOS]);
    return n;
  }
  const lista = mem.listas.get(clave) ?? [];
  lista.push(texto);
  mem.listas.set(clave, lista);
  return lista.length;
}

export async function leerLista<T = any>(clave: string): Promise<T[]> {
  let crudos: string[];
  if (usaRedis()) {
    crudos = (await redis<string[]>(['LRANGE', clave, 0, -1])) ?? [];
  } else {
    crudos = mem.listas.get(clave) ?? [];
  }
  const salida: T[] = [];
  for (const c of crudos) {
    try {
      salida.push(JSON.parse(c));
    } catch {
      /* se ignora una entrada corrupta */
    }
  }
  return salida;
}

export async function largoLista(clave: string): Promise<number> {
  if (usaRedis()) return (await redis<number>(['LLEN', clave])) ?? 0;
  return (mem.listas.get(clave) ?? []).length;
}

export async function guardarValor(clave: string, valor: unknown): Promise<void> {
  const texto = JSON.stringify(valor);
  if (usaRedis()) {
    await redis(['SET', clave, texto, 'EX', TTL_SEGUNDOS]);
    return;
  }
  mem.valores.set(clave, texto);
}

export async function leerValor<T = any>(clave: string): Promise<T | null> {
  let crudo: string | null;
  if (usaRedis()) crudo = (await redis<string | null>(['GET', clave])) ?? null;
  else crudo = mem.valores.get(clave) ?? null;
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as T;
  } catch {
    return null;
  }
}

export async function borrarClaves(claves: string[]): Promise<void> {
  if (usaRedis()) {
    if (claves.length) await redis(['DEL', ...claves]);
    return;
  }
  for (const c of claves) {
    mem.listas.delete(c);
    mem.valores.delete(c);
  }
}

// ---- Claves y utilidades de la sesión ----
export const SESION_VALIDA = /^[a-z0-9-]{3,30}$/;

export const claves = (sesion: string) => ({
  dolores: `taller:${sesion}:dolores`,
  uso: `taller:${sesion}:uso`,
  agrupacion: `taller:${sesion}:agrupacion`,
});

export function sesionDe(valor: unknown): string | null {
  const s = typeof valor === 'string' ? valor.trim().toLowerCase() : '';
  return SESION_VALIDA.test(s) ? s : null;
}

// Comparación en tiempo constante para la clave del facilitador.
export function esFacilitador(request: Request): boolean {
  const esperada = (process.env.TALLER_FACILITADOR_KEY || '').trim();
  if (!esperada) return false;
  const dada = (request.headers.get('x-facilitador-key') || '').trim();
  if (dada.length !== esperada.length) return false;
  let diff = 0;
  for (let i = 0; i < esperada.length; i++) diff |= esperada.charCodeAt(i) ^ dada.charCodeAt(i);
  return diff === 0;
}

export const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
