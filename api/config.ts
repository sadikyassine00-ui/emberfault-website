import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const sql = neon(process.env.DATABASE_URL!);
  
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT value FROM config WHERE key = 'landing'`;
      if (result.length > 0) {
        return res.status(200).json(result[0].value);
      }
      return res.status(404).json({});
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (!body.isAdmin) {
        return res.status(401).send('Unauthorized');
      }
      
      await sql`
        INSERT INTO config (key, value)
        VALUES ('landing', ${JSON.stringify(body.config)})
        ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(body.config)}, updated_at = CURRENT_TIMESTAMP
      `;
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).send('Method Not Allowed');
}
