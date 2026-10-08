import type { APIRoute } from 'astro';
import Groq from 'groq-sdk';

export const GET: APIRoute = async () => {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const groq = new Groq({ apiKey: groqApiKey });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Ping' }],
      model: 'openai/gpt-oss-120b',
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Groq connection successful.',
        response: chatCompletion.choices[0]?.message?.content 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Groq test connection error:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Groq connection failed.', 
        details: err.message || JSON.stringify(err) 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
