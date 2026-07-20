import { renderWelcomeEmail } from '../src/emails/WelcomeEmail';

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  // Pass a mock email to render
  const html = renderWelcomeEmail('commander@vanguard.net');

  // Return the raw HTML to preview directly in the browser
  return res.status(200).send(html);
}
