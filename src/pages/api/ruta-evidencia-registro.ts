// src/pages/api/ruta-evidencia-registro.ts
// Registra un correo en el grupo de MailerLite de la Ruta Evidencia.
// El cliente solo envía { email }. La API key y el group ID viven únicamente en el servidor.
import type { APIRoute } from 'astro';

const json = (cuerpo: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, honeypot } = body;

    // Anti-bot: si el campo oculto viene lleno, se responde ok sin registrar
    if (honeypot) return json({ ok: true });

    const emailStr = typeof email === 'string' ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr || !emailRegex.test(emailStr)) {
      return json({ ok: false, error: 'Por favor ingresa un correo electrónico válido.' }, 400);
    }

    const apiKey = (process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '').trim();
    const groupId = (process.env.MAILERLITE_GROUP_EVIDENCIA || '').trim();

    if (!apiKey || !groupId) {
      console.error(
        `[ruta-evidencia-registro] Configuración faltante: apiKey=${Boolean(apiKey)}, groupId=${Boolean(groupId)}`
      );
      return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
    }

    const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: emailStr, groups: [groupId] }),
    });

    if (!mlResponse.ok && mlResponse.status !== 409) {
      const errorText = await mlResponse.text();
      console.error(`[ruta-evidencia-registro] Error MailerLite ${mlResponse.status}: ${errorText}`);
      return json({ ok: false, error: 'No pudimos registrar tu correo. Intenta de nuevo.' }, 502);
    }

    return json({ ok: true });
  } catch (error: unknown) {
    console.error('[ruta-evidencia-registro] Error inesperado en el servidor:', error);
    return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
  }
};
