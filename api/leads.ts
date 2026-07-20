import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
      }
      
      const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      return res.status(200).json(leads);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, source, platform } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      await sql`
        INSERT INTO leads (email, source, platform)
        VALUES (${email}, ${source || ''}, ${platform || ''})
        ON CONFLICT (email) DO NOTHING
      `;
      
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).send('Method Not Allowed');
}
