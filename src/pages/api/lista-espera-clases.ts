// src/pages/api/lista-espera-clases.ts
// Registra un correo en el grupo de MailerLite de la lista de espera de Clases en vivo.
// El cliente solo envía { email, tema }. La API key y el group ID viven únicamente en el servidor.
// El grupo (MAILERLITE_GROUP_CLASES) y el campo tema_clase los crea Productos y funnel. Este código no crea nada en MailerLite.
import type { APIRoute } from 'astro';

const TEMAS = [
  'Presentar y comunicar',
  'Estudiar e investigar',
  'Imágenes y contenido visual',
  'Carrera y empleo',
  'Producto y decisiones',
];

const json = (cuerpo: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const tema = typeof body.tema === 'string' ? body.tema.trim() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, campo: 'email', error: 'Escribe un correo válido.' }, 400);
    }

    const apiKey = (process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '').trim();
    const groupId = (process.env.MAILERLITE_GROUP_CLASES || '').trim();
    if (!apiKey || !groupId) {
      console.error(`[lista-espera-clases] Configuración faltante: apiKey=${Boolean(apiKey)}, groupId=${Boolean(groupId)}`);
      return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
    }

    const cuerpo: Record<string, unknown> = { email, groups: [groupId] };
    if (TEMAS.includes(tema)) cuerpo.fields = { tema_clase: tema };

    const enviar = (c: Record<string, unknown>) =>
      fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(c),
      });

    let res = await enviar(cuerpo);
    // Si el campo tema_clase aún no existe, registra el correo igual y sin el campo.
    if (res.status === 422 && cuerpo.fields) {
      const { fields: _omitido, ...sinCampos } = cuerpo;
      res = await enviar(sinCampos);
    }
    if (!res.ok && res.status !== 409) {
      console.error(`[lista-espera-clases] Error MailerLite ${res.status}: ${await res.text()}`);
      return json({ ok: false, error: 'No pudimos registrar tu correo. Intenta de nuevo.' }, 502);
    }
    return json({ ok: true }, 200);
  } catch (error: unknown) {
    console.error('[lista-espera-clases] Error inesperado en el servidor:', error);
    return json({ ok: false, error: 'Servicio no disponible. Intenta más tarde.' }, 500);
  }
};
