import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            status: 'ok',
            message: 'Hotmart webhook endpoint funcionando',
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
};

export const POST: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            status: 'ok',
            message: 'POST recibido correctamente',
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
};