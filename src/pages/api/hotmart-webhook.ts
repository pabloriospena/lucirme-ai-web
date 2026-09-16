import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        console.log('Webhook recibido de Hotmart:', body);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Webhook recibido correctamente',
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error procesando webhook:', error);

        return new Response(
            JSON.stringify({
                success: false,
                message: 'Solicitud inválida',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};