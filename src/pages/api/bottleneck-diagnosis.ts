import type { APIRoute } from 'astro';
import { calculateBottleneckDiagnosis } from '../../lib/bottleneck';
import Groq from 'groq-sdk';

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

    if (!nameStr || !empresaStr) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos (nombre o empresa).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const diagnosisBase = calculateBottleneckDiagnosis({
      proceso, frecuencia, tiempo, personas, impacto, esfuerzo,
      name: nameStr, email: emailStr, empresa: empresaStr,
      tamano, industria, pais, ciudad,
    });

    // Generate AI Diagnostic Report
    let aiReport = '';
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      const groq = new Groq({ apiKey: groqApiKey });
      
      const prompt = `
        Genera un informe de diagnóstico operativo B2B para la empresa ${empresaStr} sobre el proceso "${proceso}".
        
        Datos del formulario:
        - Frecuencia: ${frecuencia}
        - Tiempo por ejecución: ${tiempo}
        - Personas: ${personas}
        - Impacto principal: ${impacto}
        - Esfuerzo percibido: ${esfuerzo}
        
        Cálculos previos:
        - Horas estimadas/semana: ${diagnosisBase.weeklyHours}
        - Prioridad: ${diagnosisBase.prioridad}
        
        Estructura el informe en formato Markdown con las siguientes secciones:
        1. Resumen ejecutivo
        2. Hallazgos principales
        3. Carga operativa estimada
        4. Oportunidades priorizadas (máximo 3)
        5. Recomendaciones accionables
        6. Qué no automatizar todavía
        7. Plan de acción inicial
        8. Próximos pasos con LuciRMe (invitación contextual a revisar esto por WhatsApp)
        
        Mantén un tono profesional pero sencillo. Diferencia claramente hechos de hipótesis. No inventes datos que no se puedan deducir de lo anterior.
      `;

      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gemma2-9b-it',
        });
        aiReport = chatCompletion.choices[0]?.message?.content ?? '';
      } catch (err) {
        console.error('Groq error:', err);
        aiReport = 'No pudimos generar el informe personalizado en este momento, pero puedes revisar los cálculos básicos arriba.';
      }
    }

    const rawToken = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_TOKEN || '';
    const apiToken = rawToken.trim();
    const groupId = (process.env.MAILERLITE_BOTTLENECK_GROUP_ID || '200080858699269701').trim();

    let mailerliteSuccess = false;

    if (apiToken && apiToken.length > 15 && apiToken !== 'undefined') {
      const mailerliteBody: any = {
        email: emailStr,
        fields: {
          name: nameStr,
          company: empresaStr,
          city: ciudad || 'Bogotá',
          country: pais || 'Colombia',
          tamano_de_la_empresa: tamano || '11-50 personas',
          industria_sector: industria || 'Tecnología/SaaS',
          diagnostico_proceso: diagnosisBase.proceso,
          diagnostico_horas_estimadassemana: `${diagnosisBase.weeklyHours} hrs/semana`,
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
        if (mlResponse.ok) mailerliteSuccess = true;
      } catch (mlErr) {
        console.error('[MailerLite Exception]:', mlErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        diagnosis: diagnosisBase,
        aiReport,
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
