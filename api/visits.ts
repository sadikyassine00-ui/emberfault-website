import { neon } from '@neondatabase/serverless';



export default async function handler(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      const visits = await sql`SELECT COUNT(*) as count FROM visits`;
      return new Response(JSON.stringify({ count: visits[0].count }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const { path, userAgent } = await req.json();
      
      await sql`
        INSERT INTO visits (path, user_agent)
        VALUES (${path || '/'}, ${userAgent || ''})
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
