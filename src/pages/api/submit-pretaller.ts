import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();

    const payload = {
        email: data['q2-Correo'],
        fields: {
            name: data['q2-Nombre'],
            empresa_nombre: data.q1,
            participantes_count: parseInt(data.q3),
            nivel_ia_actual: data.nivel_ia_actual,
            tarea_principal: data.q9
        },
        groups: [import.meta.env.MAILERLITE_GROUP_TALLER
        ]
    };

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.MAILERLITE_API_KEY}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("MailerLite Error:", JSON.stringify(error, null, 2));
        return new Response(JSON.stringify({ error }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};