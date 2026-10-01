import type { APIRoute } from 'astro';
import { calculateBottleneckDiagnosis } from '../../lib/bottleneck';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const {
      name = '',
      email = '',
      empresa = '',
      tamano = '',
      industria = '',
      pais = '',
      ciudad = '',
      proceso = '',
      frecuencia = '',
      tiempo = '',
      personas = '',
      impacto = '',
      esfuerzo = '',
    } = data;

    const emailStr = typeof email === 'string' ? email.trim() : '';
    const nameStr = typeof name === 'string' ? name.trim() : '';
    const empresaStr = typeof empresa === 'string' ? empresa.trim() : '';

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

    if (!empresaStr) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa el nombre de tu empresa.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Single source of truth calculation
    const diagnosis = calculateBottleneckDiagnosis({
      proceso,
      frecuencia,
      tiempo,
      personas,
      impacto,
      esfuerzo,
      name: nameStr,
      email: emailStr,
      empresa: empresaStr,
      tamano,
      industria,
      pais,
      ciudad,
    });

    const apiToken = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN;
    const groupId = process.env.MAILERLITE_BOTTLENECK_GROUP_ID || '200080858699269701';

    let mailerliteSuccess = false;

    if (apiToken) {
      const mailerliteBody: any = {
        email: emailStr,
        fields: {
          name: nameStr,
          company: empresaStr,
          city: ciudad || 'Bogotá',
          country: pais || 'Colombia',
          tamano_de_la_empresa: tamano || '11-50 personas',
          industria_sector: industria || 'Tecnología/SaaS',
          diagnostico_proceso: diagnosis.proceso,
          diagnostico_frecuencia: diagnosis.frecuencia,
          diagnostico_tiempo_por_ejecucion: diagnosis.tiempo,
          diagnostico_personas: diagnosis.personas,
          diagnostico_impacto: diagnosis.impacto,
          diagnostico_viabilidad: diagnosis.esfuerzo,
          diagnostico_prioridad: diagnosis.prioridad,
          diagnostico_horas_estimadassemana: `${diagnosis.weeklyHours} hrs/semana`,
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
          console.warn(`[MailerLite Error ${mlResponse.status}]:`, errText);
        }
      } catch (mlErr) {
        console.error('[MailerLite Exception]:', mlErr);
      }
    } else {
      console.warn('[MailerLite]: MAILERLITE_API_TOKEN missing in environment');
    }

    return new Response(
      JSON.stringify({
        success: true,
        diagnosis,
        mailerliteSaved: mailerliteSuccess,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in /api/bottleneck-diagnosis:', error);
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error inesperado al procesar el diagnóstico.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
