// src/pages/api/aviso-paso.ts
// Registra un correo en el grupo de MailerLite correspondiente al paso 1, 3 o 4, o a la lista de espera de la comunidad.
// El cliente solo envía { email, paso }. La API key y los group IDs viven únicamente en el servidor.
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, paso, interes } = body;

    // 1. Validar paso permitido: "1", "3", "4" o "comunidad" (el paso 2 ya tiene contenido y no usa aviso)
    const pasoStr = String(paso ?? '').trim();
    if (pasoStr !== '1' && pasoStr !== '3' && pasoStr !== '4' && pasoStr !== 'comunidad') {
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
    const groupEnvByPaso: Record<string, string | undefined> = {
      '1': process.env.MAILERLITE_GROUP_AVISO_PASO_1,
      '3': process.env.MAILERLITE_GROUP_AVISO_PASO_3,
      '4': process.env.MAILERLITE_GROUP_AVISO_PASO_4,
      'comunidad': process.env.MAILERLITE_GROUP_COMUNIDAD,
    };
    const groupId = (groupEnvByPaso[pasoStr] || '').trim();

    const apiKey = (process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '').trim();

    if (!apiKey || !groupId) {
      console.error(`[aviso-paso] Configuración faltante: apiKey=${Boolean(apiKey)}, groupId=${Boolean(groupId)} para paso ${pasoStr}`);
      return new Response(
        JSON.stringify({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Llamar a MailerLite
    const mailerliteBody: Record<string, unknown> = {
      email: emailStr,
      groups: [groupId],
    };

    // Solo la comunidad guarda el interés elegido, con una lista cerrada de valores
    const INTERESES = ['discovery', 'priorizacion', 'metricas', 'documentar'];
    const interesStr = typeof interes === 'string' ? interes.trim() : '';
    if (pasoStr === 'comunidad' && INTERESES.includes(interesStr)) {
      mailerliteBody.fields = { interes_comunidad: interesStr };
    }

    const enviar = (cuerpo: Record<string, unknown>) =>
      fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(cuerpo),
      });

    let mlResponse = await enviar(mailerliteBody);

    // Si el campo personalizado aún no existe en MailerLite, registra el correo igual y sin el campo
    if (mlResponse.status === 422 && mailerliteBody.fields) {
      console.warn('[aviso-paso] Campo interes_comunidad no aceptado, se reintenta sin campos');
      const { fields: _omitido, ...sinCampos } = mailerliteBody;
      mlResponse = await enviar(sinCampos);
    }

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
