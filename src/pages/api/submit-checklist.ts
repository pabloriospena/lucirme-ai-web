import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // El ID de tu grupo debe venir de tus variables de entorno por seguridad
        const GROUP_ID = import.meta.env.MAILERLITE_GROUP_ID;

        const payload = {
            email: data.email,
            fields: {
                name: data.nombres,
                tarea_principal: data.tarea,
                horas_semanales: data.horas,
                ejemplo_listo: data.ejemplo
            },
            groups: [GROUP_ID] // Aquí le indicamos a qué grupo asignar el suscriptor
        };

        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.MAILERLITE_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de MailerLite:', errorData);
            return new Response(JSON.stringify({ message: 'Error al registrarte' }), { status: 502 });
        }

        return new Response(JSON.stringify({ message: '¡Éxito!' }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error interno' }), { status: 500 });
    }
};