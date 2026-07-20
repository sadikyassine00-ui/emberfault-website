import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const email = req.query?.email;

  if (!email) {
    return res.status(400).send('Email is required to unsubscribe.');
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // We simply delete the email from the leads table
    await sql`DELETE FROM leads WHERE email = ${email}`;

    // Return a simple HTML page acknowledging the unsubscription
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed // EMBERFAULT</title>
        <style>
          body {
            margin: 0;
            padding: 40px 20px;
            background-color: #050505;
            color: #d4d4d8;
            font-family: monospace;
            text-align: center;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            border: 1px solid #27272a;
            background-color: #0d0d10;
            padding: 40px;
          }
          h1 {
            color: #eab308;
            text-transform: uppercase;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Comm Link Severed</h1>
          <p>You have successfully unsubscribed.</p>
          <p>Your email address <strong>${email}</strong> has been completely removed from our records.</p>
          <br/>
          <a href="/" style="color: #a855f7; text-decoration: none;">&lt; Return to Base</a>
        </div>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (error: any) {
    console.error("Unsubscribe Error:", error);
    return res.status(500).send('An error occurred while unsubscribing.');
  }
}
