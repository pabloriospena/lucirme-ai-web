import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const { name, email, whatsapp, score, nivel, perfil, respuestas } = data;

    // Email validation
    const emailStr = typeof email === 'string' ? email.trim() : '';
    const nameStr = typeof name === 'string' ? name.trim() : '';
    const whatsappStr = typeof whatsapp === 'string' ? whatsapp.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr || !emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa un correo electrónico válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_GUIA_NBLM;

    if (!apiKey) {
      console.warn('MAILERLITE_API_KEY missing on server');
      return new Response(JSON.stringify({ ok: true, message: 'Saved locally' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fieldsPayload: Record<string, string | number> = {
      name: nameStr,
      phone: whatsappStr,
      perfil: perfil || respuestas?.p1 || 'personal',
      diag_score: `${score}%`,
      diag_level: nivel || '',
      diag_pain: respuestas?.p2 || '',
      diag_hours_lost: respuestas?.p3 || '',
      diag_ai_usage: respuestas?.p5 || '',
      diag_decision: respuestas?.p9 || ''
    };

    const mailerliteBody: any = {
      email: emailStr,
      fields: fieldsPayload
    };

    if (groupId) {
      mailerliteBody.groups = [groupId];
    }

    const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(mailerliteBody)
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.warn(`MailerLite responded status ${mlResponse.status}: ${errorText}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in /api/termometro:', error);
    // Don't block user if MailerLite fails
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
