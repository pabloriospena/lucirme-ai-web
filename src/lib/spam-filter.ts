// Filtro sencillo para formularios de leads. Sin dependencias.
// Devuelve true cuando el envío parece un bot o basura.
// Los envíos marcados se responden con éxito pero no se guardan en MailerLite.

type SpamInput = {
  email: string;
  name?: string;
  empresa?: string;
  honeypot?: unknown; // campo trampa oculto: un humano nunca lo llena
};

const PRUEBAS = new Set(['a@a.com', 'tu@email.co', 'test@test.com', 'prueba@prueba.com']);

// Cadena larga sin espacios con mayúsculas y minúsculas mezcladas al azar.
function esCadenaRevuelta(texto: string): boolean {
  const t = texto.trim();
  if (t.length < 12 || /\s/.test(t) || !/^[A-Za-z]+$/.test(t)) return false;
  let cambios = 0;
  for (let i = 1; i < t.length; i++) {
    const a = t[i - 1], b = t[i];
    if ((a === a.toLowerCase()) !== (b === b.toLowerCase())) cambios++;
  }
  return cambios >= 3;
}

// Texto corto sin vocales, como "dfdgdgdfgd".
function esSinSentido(texto: string): boolean {
  const t = texto.trim().toLowerCase();
  if (t.length < 8 || /\s/.test(t) || !/^[a-záéíóúñ]+$/.test(t)) return false;
  const vocales = (t.match(/[aeiouáéíóú]/g) || []).length;
  return vocales / t.length < 0.2;
}

// Correos con puntos entre pedazos de 1 a 3 letras: "z.ed.ec.oxe2.8.0@..."
function esCorreoRevuelto(email: string): boolean {
  const local = email.split('@')[0] || '';
  const partes = local.split('.');
  if (partes.length < 4) return false;
  const cortas = partes.filter((p) => p.length <= 3).length;
  return cortas / partes.length >= 0.6;
}

export function isLikelySpam({ email, name = '', empresa = '', honeypot }: SpamInput): boolean {
  if (honeypot !== undefined && honeypot !== null && String(honeypot).trim() !== '') return true;
  const correo = email.trim().toLowerCase();
  if (PRUEBAS.has(correo) || correo.startsWith('asdasda')) return true;
  if (esCorreoRevuelto(correo)) return true;
  if (esCadenaRevuelta(name) || esCadenaRevuelta(empresa)) return true;
  if (esSinSentido(name) || esSinSentido(empresa)) return true;
  return false;
}
