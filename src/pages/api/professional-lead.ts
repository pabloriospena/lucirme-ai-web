import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const {
      name = '',
      email = '',
      whatsapp = '',
      problema_principal = '',
      frecuencia = '',
      tiempo_estimado = '',
      herramientas_actuales = [],
      objetivo = '',
      recomendacion = '',
      ciudad = 'Bogotá',
      pais = 'Colombia',
      fuente = 'Landing /servicios/producto',
      tipo_de_pagina = 'producto',
    } = data;

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

    if (!nameStr) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa tu nombre.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!whatsappStr) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa tu número de WhatsApp.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawToken = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '';
    const apiToken = rawToken.trim();
    const groupId = (
      process.env.MAILERLITE_SESSIONS_GROUP_ID ||
      process.env.MAILERLITE_PROFESSIONAL_GROUP_ID ||
      '200155974539937533'
    ).trim();

    let mailerliteSuccess = false;

    if (apiToken && apiToken.length > 15 && apiToken !== 'undefined') {
      const toolsFormatted = Array.isArray(herramientas_actuales)
        ? herramientas_actuales.join(', ')
        : String(herramientas_actuales || '');

      const problemsFormatted = Array.isArray(problema_principal)
        ? problema_principal.join(', ')
        : String(problema_principal || '');

      const goalsFormatted = Array.isArray(objetivo)
        ? objetivo.join(', ')
        : String(objetivo || '');

      const mailerliteBody: any = {
        email: emailStr,
        fields: {
          name: nameStr,
          company: 'Product Management',
          phone: whatsappStr,
          whatsapp: whatsappStr,
          city: ciudad || 'Bogotá',
          country: pais || 'Colombia',
          industria_sector: 'Product Management & Ops',
          sesion_1_1_problema_principal: problemsFormatted || 'Optimización PM',
          sesion_1_1_frecuencia: frecuencia || 'Semanal',
          sesion_1_1_tiempo_estimado: tiempo_estimado || '3-5 horas',
          sesion_1_1_herramientas_actuales: toolsFormatted || 'Herramientas PM',
          sesion_1_1_objetivo: goalsFormatted || 'Ahorrar tiempo',
          sesion_1_1_resultado_recomendacion: recomendacion || 'Sesión 1-1 PM',
          que_quiere_mejorar: problemsFormatted || 'Optimización PM',
          objetivo_de_la_pagina: goalsFormatted || 'Ahorrar tiempo',
          que_tiene_listo: toolsFormatted || 'Herramientas PM',
          fuente: fuente || 'Landing /servicios/producto',
          tipo_de_pagina: tipo_de_pagina || 'producto',
          tipo_de_empresa: 'profesionales',
        },
      };

      if (groupId) {
        mailerliteBody.groups = [groupId];
      }

      try {
        const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(mailerliteBody),
        });

        if (mlResponse.ok) {
          mailerliteSuccess = true;
        } else {
          const errText = await mlResponse.text();
          console.warn(`[MailerLite Professional Lead ${mlResponse.status}]: ${errText}`);
        }
      } catch (mlErr) {
        console.error('[MailerLite Professional Lead Exception]:', mlErr);
      }
    } else {
      console.warn('[MailerLite Notice]: MAILERLITE_API_KEY missing or invalid. Lead processed locally.');
    }

    return new Response(
      JSON.stringify({
        success: true,
        mailerliteSaved: mailerliteSuccess,
        dataProcessed: {
          name: nameStr,
          email: emailStr,
          whatsapp: whatsappStr,
          problema_principal,
          frecuencia,
          tiempo_estimado,
          herramientas_actuales,
          objetivo,
          recomendacion,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in /api/professional-lead:', error);
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error inesperado al enviar la solicitud.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
