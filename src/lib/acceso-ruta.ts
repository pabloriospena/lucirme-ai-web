// src/lib/acceso-ruta.ts
// Gestión de cookie firmada con HMAC-SHA256 para acceso a contenidos de la ruta.
import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE_NAME = 'ruta_acceso';
export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 días en segundos

/**
 * Obtiene la clave secreta desde las variables de entorno.
 * Si no existe, lanza un error para evitar emitir cookies inseguras.
 */
function getSecret(): string {
  const secret = (process.env.ACCESS_COOKIE_SECRET || '').trim();
  if (!secret) {
    throw new Error('ACCESS_COOKIE_SECRET no está configurada.');
  }
  return secret;
}

/**
 * Genera un token HMAC-SHA256 firmado para el email dado.
 * Formato: <payload_base64url>.<signature_base64url>
 * Guarda un identificador seguro con timestamp, nunca el correo en texto plano.
 */
export function firmar(email: string): string {
  const secret = getSecret();
  const normalizedEmail = email.trim().toLowerCase();

  // Generamos un hash unidireccional del email con salt del secreto como identificador anónimo
  const idHash = createHmac('sha256', secret)
    .update(`identity:${normalizedEmail}`)
    .digest('hex');

  const payload = JSON.stringify({
    id: idHash,
    iat: Math.floor(Date.now() / 1000),
  });

  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifica la validez y firma de la cookie "ruta_acceso".
 * Retorna true si la firma es válida y no ha expirado; false de lo contrario.
 */
export function verificar(cookieValue: string | undefined | null): boolean {
  if (!cookieValue || typeof cookieValue !== 'string') {
    return false;
  }

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }

  const parts = cookieValue.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) {
    return false;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return false;
  }

  // Verificar estructura del payload
  try {
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const data = JSON.parse(payloadStr);

    if (!data || typeof data.id !== 'string' || typeof data.iat !== 'number') {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    // Verificar que no sea del futuro y que esté dentro de los 30 días
    if (now - data.iat > COOKIE_MAX_AGE || data.iat > now + 300) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
