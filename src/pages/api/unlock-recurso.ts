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
    const apiKey = (process.env.MAILERLITE_API_KEY || '').trim();
    const groupId = (process.env.MAILERLITE_GROUP_RECURSOS_GRATIS || '').trim();

    if (!apiKey) {
      console.error('[unlock-recurso] MAILERLITE_API_KEY no está configurada en el servidor.');
      return new Response(
        JSON.stringify({ ok: false, error: 'Error de configuración del servidor. Intenta de nuevo más tarde.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
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
      const errorText = await mlResponse.text();
      // 409 / 422 = suscriptor ya existe en MailerLite → se considera ok
      if (mlResponse.status === 409 || mlResponse.status === 422) {
        console.info(`[unlock-recurso] MailerLite suscriptor ya existente (${mlResponse.status})`);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.error(`[unlock-recurso] Error MailerLite ${mlResponse.status}: ${errorText}`);
      return new Response(
        JSON.stringify({ ok: false, error: 'No se pudo registrar el correo. Por favor intenta de nuevo.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[unlock-recurso] Error inesperado:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Ocurrió un error inesperado. Por favor intenta de nuevo.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
