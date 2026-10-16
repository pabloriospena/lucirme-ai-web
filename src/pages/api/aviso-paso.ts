// src/pages/api/aviso-paso.ts
// Registra un correo en el grupo de MailerLite correspondiente al paso 3 o 4.
// El cliente solo envía { email, paso }. La API key y los group IDs viven únicamente en el servidor.
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, paso } = body;

    // 1. Validar paso permitido: solo "3" o "4"
    const pasoStr = String(paso ?? '').trim();
    if (pasoStr !== '3' && pasoStr !== '4') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Paso no válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validar formato de correo antes de llamar a MailerLite
    const emailStr = typeof email === 'string' ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailStr || !emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Por favor ingresa un correo electrónico válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Determinar el grupo exclusivamente desde las variables de entorno del servidor
    const groupId = pasoStr === '3'
      ? (process.env.MAILERLITE_GROUP_AVISO_PASO_3 || '').trim()
      : (process.env.MAILERLITE_GROUP_AVISO_PASO_4 || '').trim();

    const apiKey = (process.env.MAILERLITE_API_KEY || '').trim();

    if (!apiKey || !groupId) {
      console.error(`[aviso-paso] Configuración faltante: apiKey=${Boolean(apiKey)}, groupId=${Boolean(groupId)} para paso ${pasoStr}`);
      return new Response(
        JSON.stringify({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Llamar a MailerLite
    const mailerliteBody = {
      email: emailStr,
      groups: [groupId],
    };

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
      if (mlResponse.status === 409) {
        console.info(`[aviso-paso] MailerLite suscriptor ya existente (409)`);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.error(`[aviso-paso] Error MailerLite ${mlResponse.status}: ${errorText}`);
      return new Response(
        JSON.stringify({ ok: false, error: 'No pudimos registrar tu correo. Intenta de nuevo.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('[aviso-paso] Error inesperado en el servidor:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
