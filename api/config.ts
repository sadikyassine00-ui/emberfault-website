import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT value FROM config WHERE key = 'landing'`;
      if (result.length > 0) {
        return new Response(JSON.stringify(result[0].value), { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      return new Response(JSON.stringify({}), { status: 404 });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (!body.isAdmin) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      await sql`
        INSERT INTO config (key, value)
        VALUES ('landing', ${JSON.stringify(body.config)})
        ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(body.config)}, updated_at = CURRENT_TIMESTAMP
      `;
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
