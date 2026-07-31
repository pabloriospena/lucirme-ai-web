// src/pages/api/procesar-cartera.ts
import type { APIRoute } from 'astro';
import { processCarteraExcel } from '../../lib/carteraProcessor.js';

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
    const processedBuffer = processCarteraExcel(new Uint8Array(arrayBuffer));

    return new Response(processedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Resumen_Cartera_Completo.xlsx"`
      }
    });
  } catch (error: any) {
    console.error('Error procesando archivo de Cartera:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error procesando el archivo de Cartera.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
