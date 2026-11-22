// src/pages/api/ruta-evidencia-registro.ts
// Registra un correo en el grupo de MailerLite de la Ruta Evidencia.
// El cliente envía { email, ref? }. La API key, el group ID y REF_SECRET viven solo en el servidor.
//
// Referidos: cada inscrito recibe un enlace personal (campo ruta_enlace). Si alguien nuevo entra
// por ese enlace, se guarda quién lo trajo (ruta_referido_por) y se suma 1 a ruta_referidos de
// quien compartió. Solo cuenta si el correo es nuevo y distinto al de quien comparte.
// Si REF_SECRET no está configurada, el registro funciona igual, sin referidos.
import type { APIRoute } from 'astro';
import { crearCodigoRef, enlacePersonal, leerCodigoRef } from '../../lib/ruta-evidencia-ref';

const ML = 'https://connect.mailerlite.com/api/subscribers';

const json = (cuerpo: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, honeypot, ref } = body;

    // Anti-bot: si el campo oculto viene lleno, se responde ok sin registrar
    if (honeypot) return json({ ok: true });

    const emailStr = typeof email === 'string' ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr || !emailRegex.test(emailStr)) {
      return json({ ok: false, error: 'Por favor ingresa un correo electrónico válido.' }, 400);
    }

    const apiKey = (process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '').trim();
    const groupId = (process.env.MAILERLITE_GROUP_EVIDENCIA || '').trim();
    const secreto = (process.env.REF_SECRET || '').trim();

    if (!apiKey || !groupId) {
      console.error(
        `[ruta-evidencia-registro] Configuración faltante: apiKey=${Boolean(apiKey)}, groupId=${Boolean(groupId)}`
      );
      return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
    }

    const cabeceras = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const miCodigo = secreto ? crearCodigoRef(emailStr, secreto) : '';
    const fields: Record<string, string> = {};
    if (miCodigo) fields.ruta_enlace = enlacePersonal(miCodigo);

    const mlResponse = await fetch(ML, {
      method: 'POST',
      headers: cabeceras,
      body: JSON.stringify({ email: emailStr, groups: [groupId], fields }),
    });

    if (!mlResponse.ok && mlResponse.status !== 409) {
      const errorText = await mlResponse.text();
      console.error(`[ruta-evidencia-registro] Error MailerLite ${mlResponse.status}: ${errorText}`);
      return json({ ok: false, error: 'No pudimos registrar tu correo. Intenta de nuevo.' }, 502);
    }

    // Atribución. Un fallo aquí no debe tumbar el registro, que ya quedó hecho.
    const esNuevo = mlResponse.status === 201;
    if (esNuevo && secreto && typeof ref === 'string' && ref && ref.length < 300) {
      try {
        const quien = leerCodigoRef(ref, secreto);
        if (quien && quien.toLowerCase() !== emailStr.toLowerCase()) {
          const refResp = await fetch(`${ML}/${encodeURIComponent(quien)}`, { headers: cabeceras });
          if (refResp.ok) {
            const dato = await refResp.json();
            const actual = Number(dato?.data?.fields?.ruta_referidos) || 0;
            await fetch(ML, {
              method: 'POST',
              headers: cabeceras,
              body: JSON.stringify({ email: quien, fields: { ruta_referidos: actual + 1 } }),
            });
            await fetch(ML, {
              method: 'POST',
              headers: cabeceras,
              body: JSON.stringify({ email: emailStr, fields: { ruta_referido_por: quien } }),
            });
          }
        }
      } catch (e) {
        console.error('[ruta-evidencia-registro] No se pudo guardar el referido:', e);
      }
    }

    // El código vuelve al navegador para que sus botones de compartir usen su enlace personal.
    return json({ ok: true, ref: miCodigo || undefined });
  } catch (error: unknown) {
    console.error('[ruta-evidencia-registro] Error inesperado en el servidor:', error);
    return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
  }
};
