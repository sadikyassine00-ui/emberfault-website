import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { renderWelcomeEmail } from '../src/emails/WelcomeEmail.js';

let resend: any = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

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

      // Trigger Welcome Email async
      if (process.env.RESEND_API_KEY) {
        try {
          // You must verify your domain in Resend and change this from address
          await resend.emails.send({
            from: 'Emberfault Vanguard <hq@emberfault.com>',
            to: email,
            subject: 'EMBERFAULT // Alpha Registration Confirmed',
            html: renderWelcomeEmail(email),
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // We don't fail the whole request if the email fails
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
      }
      
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      
      await sql`DELETE FROM leads WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).send('Method Not Allowed');
}
