import type { APIRoute } from 'astro';
import { isLikelySpam } from '../../lib/spam-filter';

// Leads de las landings /empresas/claude-m y /empresas/claude-l.
// Se guardan en MailerLite en el grupo MAILERLITE_EMPRESAS_LANDING_GROUP_ID. Mientras esa variable
// no exista, caen en el grupo del diagnóstico de cuello de botella (MAILERLITE_BOTTLENECK_GROUP_ID).
// `fuente` distingue la página y, si llegó con ?ref=, quién refirió ("... · ref: diego").

const LANDINGS: Record<string, string> = {
  'claude-m': 'Landing /empresas/claude-m',
  'claude-l': 'Landing /empresas/claude-l',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const texto = (v: unknown, max = 600) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));

    const name = texto(data.name, 120);
    const email = texto(data.email, 160);
    const empresa = texto(data.empresa, 160);
    const rol = texto(data.rol, 120);
    const tamano = texto(data.tamano, 60);
    const proceso = texto(data.proceso, 800);
    const whatsapp = texto(data.whatsapp, 40);
    const ref = texto(data.ref, 60).replace(/[^a-zA-Z0-9_-]/g, '');
    const landing = typeof data.landing === 'string' ? data.landing : '';

    if (!LANDINGS[landing]) {
      return json({ error: 'No pudimos identificar la página de origen.' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Escribe un correo electrónico válido.' }, 400);
    }
    if (!name) {
      return json({ error: 'Escribe tu nombre.' }, 400);
    }
    if (!empresa) {
      return json({ error: 'Escribe el nombre de tu empresa.' }, 400);
    }
    if (!proceso) {
      return json({ error: 'Cuéntame brevemente qué proceso o tarea les pesa más.' }, 400);
    }

    // Los envíos que parecen bot responden con éxito pero no se guardan.
    if (isLikelySpam({ email, name, empresa, honeypot: data.website })) {
      return json({ success: true, mailerliteSaved: false });
    }

    const apiToken = (process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '').trim();
    const groupId = (
      process.env.MAILERLITE_EMPRESAS_LANDING_GROUP_ID ||
      process.env.MAILERLITE_BOTTLENECK_GROUP_ID ||
      '200080858699269701'
    ).trim();

    let mailerliteSaved = false;

    if (apiToken && apiToken.length > 15 && apiToken !== 'undefined') {
      const fuente = ref ? `${LANDINGS[landing]} · ref: ${ref}` : LANDINGS[landing];
      const contexto = [
        proceso,
        rol ? `Rol: ${rol}` : '',
        tamano ? `Tamaño del equipo: ${tamano}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const fields = Object.fromEntries(
        Object.entries({
          name,
          company: empresa,
          phone: whatsapp,
          que_quiere_mejorar: contexto,
          fuente,
        }).filter(([, v]) => v !== '')
      );

      try {
        const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ email, fields, groups: [groupId] }),
        });
        if (res.ok) {
          mailerliteSaved = true;
        } else {
          console.warn(`[MailerLite empresas-lead ${res.status}]: ${await res.text()}`);
        }
      } catch (err) {
        console.error('[MailerLite empresas-lead Exception]:', err);
      }
    } else {
      console.warn('[MailerLite Notice]: MAILERLITE_API_KEY missing or invalid. empresas-lead processed locally.');
    }

    return json({ success: true, mailerliteSaved });
  } catch (error) {
    console.error('Error in /api/empresas-lead:', error);
    return json({ error: 'Ocurrió un error inesperado al enviar. Intenta de nuevo.' }, 500);
  }
};
