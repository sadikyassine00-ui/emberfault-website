import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      // Basic auth check for admin dashboard
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      return new Response(JSON.stringify(leads), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, source, platform } = await req.json();
      
      if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
      }
      
      await sql`
        INSERT INTO leads (email, source, platform)
        VALUES (${email}, ${source || ''}, ${platform || ''})
        ON CONFLICT (email) DO NOTHING
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
