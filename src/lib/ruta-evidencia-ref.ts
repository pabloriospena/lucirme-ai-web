// Código de referido de la Ruta Evidencia.
// El código es el correo de quien comparte, cifrado con REF_SECRET. No se puede leer ni
// inventar sin la clave, y permite saber quién compartió sin buscar en MailerLite
// (que no deja buscar suscriptores por un campo personalizado).
import { createCipheriv, createDecipheriv, createHash, createHmac } from 'node:crypto';

const BASE_ENLACE = 'https://lucirme.com/ruta-evidencia';

const clave = (secreto: string) => createHash('sha256').update(secreto).digest();

/** Mismo correo, mismo código. El nonce sale del propio correo, que es lo único que se cifra con él. */
export function crearCodigoRef(email: string, secreto: string): string {
  const limpio = email.trim().toLowerCase();
  const nonce = createHmac('sha256', secreto).update(`nonce:${limpio}`).digest().subarray(0, 12);
  const cifrador = createCipheriv('aes-256-gcm', clave(secreto), nonce);
  const cifrado = Buffer.concat([cifrador.update(limpio, 'utf8'), cifrador.final()]);
  const etiqueta = cifrador.getAuthTag();
  return Buffer.concat([nonce, etiqueta, cifrado]).toString('base64url');
}

/** Devuelve el correo de quien compartió, o null si el código no es válido. */
export function leerCodigoRef(codigo: string, secreto: string): string | null {
  try {
    const bytes = Buffer.from(codigo, 'base64url');
    if (bytes.length < 12 + 16 + 3) return null;
    const nonce = bytes.subarray(0, 12);
    const etiqueta = bytes.subarray(12, 28);
    const cifrado = bytes.subarray(28);
    const descifrador = createDecipheriv('aes-256-gcm', clave(secreto), nonce);
    descifrador.setAuthTag(etiqueta);
    const texto = Buffer.concat([descifrador.update(cifrado), descifrador.final()]).toString('utf8');
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto) ? texto : null;
  } catch {
    return null;
  }
}

export function enlacePersonal(codigo: string): string {
  const p = new URLSearchParams({
    utm_source: 'compartido',
    utm_medium: 'enlace-personal',
    utm_campaign: 'ruta-evidencia',
    ref: codigo,
  });
  return `${BASE_ENLACE}?${p.toString()}`;
}
