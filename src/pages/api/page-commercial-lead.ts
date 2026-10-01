import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const {
      name = '',
      email = '',
      whatsapp = '',
      empresa = '',
      dedicacion = '',
      ciudad = '',
      pais = '',
      tieneWeb = '',
      queQuiereMejorar = '',
      tieneDominio = '',
      queTieneListo = [],
      objetivos = [],
      accionPrincipal = '',
      tipo_de_pagina = 'veterinaria',
      tipo_de_empresa = 'veterinaria',
      fuente = 'Landing /soluciones/web-veterinarios',
    } = data;

    const emailStr = typeof email === 'string' ? email.trim() : '';
    const nameStr = typeof name === 'string' ? name.trim() : '';
    const empresaStr = typeof empresa === 'string' ? empresa.trim() : '';
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
    const groupId = (process.env.MAILERLITE_PAGE_COMMERCIAL_GROUP_ID || '200085259962811937').trim();

    let mailerliteSuccess = false;

    if (apiToken && apiToken.length > 15 && apiToken !== 'undefined') {
      const listoFormatted = Array.isArray(queTieneListo) ? queTieneListo.join(', ') : String(queTieneListo || '');
      const objetivosFormatted = Array.isArray(objetivos) ? objetivos.join(', ') : String(objetivos || '');

      const mailerliteBody: any = {
        email: emailStr,
        fields: {
          name: nameStr,
          company: empresaStr || 'Veterinaria',
          phone: whatsappStr,
          city: ciudad || 'Bogotá',
          country: pais || 'Colombia',
          industria_sector: 'Veterinaria / Salud Animal',
          tiene_pagina_web: tieneWeb || 'No',
          que_quiere_mejorar: queQuiereMejorar || '-',
          tiene_dominio: tieneDominio || 'No',
          que_tiene_listo: listoFormatted || 'En proceso',
          objetivo_de_la_pagina: objetivosFormatted || 'Conseguir clientes',
          accion_principal: accionPrincipal || 'WhatsApp',
          tipo_de_pagina: tipo_de_pagina || 'veterinaria',
          tipo_de_empresa: tipo_de_empresa || 'veterinaria',
          fuente: fuente || 'Landing /soluciones/web-veterinarios',
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
          console.warn(`[MailerLite Lead ${mlResponse.status}]: ${errText}`);
        }
      } catch (mlErr) {
        console.error('[MailerLite Lead Exception]:', mlErr);
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
          empresa: empresaStr,
          tipo_de_pagina,
          tipo_de_empresa,
          fuente,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in /api/page-commercial-lead:', error);
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error inesperado al enviar la solicitud.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
