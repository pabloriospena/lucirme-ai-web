// src/pages/api/unlock-guia.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, perfil, honeypot, website } = body;

    // 1. Anti-bot honeypot check
    if (honeypot || website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Email validation
    const emailStr = typeof email === 'string' ? email.trim() : '';
    const nameStr = typeof name === 'string' ? name.trim() : '';
    const perfilStr = typeof perfil === 'string' ? perfil.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr || !emailRegex.test(emailStr)) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa un correo electrónico válido.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_GUIA_NBLM;

    if (!apiKey) {
      console.warn('MAILERLITE_API_KEY variable is missing on server');
      // Return ok: true so user is not blocked
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Call MailerLite API
    const fieldsPayload: Record<string, string> = {};
    if (nameStr) fieldsPayload.name = nameStr;
    if (perfilStr) fieldsPayload.perfil = perfilStr;

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
      // 409 or 422 means subscriber already exists or validation alert in MailerLite - treat as success
      const errorText = await mlResponse.text();
      console.warn(`MailerLite responded with status ${mlResponse.status}: ${errorText}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in /api/unlock-guia:', error);
    // Prefer losing a lead over blocking a real user
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
