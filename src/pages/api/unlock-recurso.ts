// src/pages/api/unlock-recurso.ts
// Registra un correo en el grupo MAILERLITE_GROUP_RECURSOS_GRATIS.
// El cliente solo envía { email }. La API key y el group ID viven únicamente en el servidor.
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    // 1. Validar formato de correo antes de llamar a MailerLite
    const emailStr = typeof email === 'string' ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailStr || !emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa un correo electrónico válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Leer credenciales exclusivamente del servidor
    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_RECURSOS_GRATIS;

    if (!apiKey) {
      // Sin API key no bloqueamos al usuario, solo registramos el fallo
      console.warn('[unlock-recurso] MAILERLITE_API_KEY no está configurada en el servidor.');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Llamar a la API de MailerLite
    const mailerliteBody: Record<string, unknown> = { email: emailStr };
    if (groupId) {
      mailerliteBody.groups = [groupId];
    } else {
      console.warn('[unlock-recurso] MAILERLITE_GROUP_RECURSOS_GRATIS no está configurada.');
    }

    const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(mailerliteBody),
    });

    if (!mlResponse.ok) {
      // 409/422 = suscriptor ya existe o alerta de validación → se trata como éxito
      const errorText = await mlResponse.text();
      console.warn(`[unlock-recurso] MailerLite respondió ${mlResponse.status}: ${errorText}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    // Preferimos perder un lead antes que bloquear a un usuario real
    console.error('[unlock-recurso] Error inesperado:', error);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
