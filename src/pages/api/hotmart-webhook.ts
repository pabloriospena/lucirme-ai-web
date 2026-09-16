import type { APIRoute } from 'astro';

export const prerender = false;

const HOTMART_PRODUCT_ID = '8528495';

function getHeader(request: Request, name: string): string | null {
    return request.headers.get(name);
}

function safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    let result = 0;

    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        // 1. Verificar HOTTOK de Hotmart
        const hottok = getHeader(request, 'X-HOTMART-HOTTOK');
        const expectedHottok = import.meta.env.HOTMART_HOTTOK;

        if (!hottok || !expectedHottok || !safeCompare(hottok, expectedHottok)) {
            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'Unauthorized',
                }),
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 2. Leer payload
        const payload = await request.json();

        // 3. Solo procesar compras aprobadas
        if (payload?.event !== 'PURCHASE_APPROVED') {
            return new Response(
                JSON.stringify({
                    status: 'ignored',
                    message: 'Evento no procesado',
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 4. Verificar que sea nuestro producto
        const productId = String(payload?.data?.product?.id ?? '');

        if (productId !== HOTMART_PRODUCT_ID) {
            return new Response(
                JSON.stringify({
                    status: 'ignored',
                    message: 'Producto no configurado',
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 5. Obtener datos del comprador
        const email = payload?.data?.buyer?.email;
        const name = payload?.data?.buyer?.name ?? '';

        if (!email) {
            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'El webhook no contiene email del comprador',
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 6. Variables de MailerLite
        const mailerliteToken = import.meta.env.MAILERLITE_API_TOKEN;
        const groupId = import.meta.env.MAILERLITE_GROUP_ID;

        if (!mailerliteToken || !groupId) {
            console.error('Faltan variables de entorno de MailerLite');

            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'Configuración de MailerLite incompleta',
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 7. Crear/actualizar comprador en MailerLite
        const mailerliteResponse = await fetch(
            'https://connect.mailerlite.com/api/subscribers',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mailerliteToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email,
                    fields: {
                        name,
                    },
                    groups: [groupId],
                }),
            }
        );

        const mailerliteData = await mailerliteResponse.json();

        if (!mailerliteResponse.ok) {
            console.error('MailerLite error:', mailerliteData);

            return new Response(
                JSON.stringify({
                    status: 'error',
                    message: 'Error agregando comprador a MailerLite',
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // 8. Éxito
        console.log('Comprador agregado a MailerLite:', email);

        return new Response(
            JSON.stringify({
                status: 'success',
                message: 'Comprador agregado correctamente a MailerLite',
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Hotmart webhook error:', error);

        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'Error procesando webhook',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};