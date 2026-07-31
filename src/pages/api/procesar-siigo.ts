// src/pages/api/procesar-siigo.ts
import type { APIRoute } from 'astro';
import { processSiigoExcel } from '../../lib/siigoProcessor.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No se subió ningún archivo válido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const processedBuffer = processSiigoExcel(new Uint8Array(arrayBuffer));

    return new Response(processedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Informe_Gerencial_Ventas_Final.xlsx"`
      }
    });
  } catch (error: any) {
    console.error('Error procesando archivo Siigo:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error procesando el archivo de Siigo.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
