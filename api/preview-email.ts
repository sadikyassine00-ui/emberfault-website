import { renderWelcomeEmail } from './_lib/WelcomeEmail.js';

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  // Allow the user to specify an email to preview, defaulting to a mock email if none is provided
  const targetEmail = req.query?.email || 'commander@vanguard.net';
  const html = renderWelcomeEmail(targetEmail);

  // Return the raw HTML to preview directly in the browser
  return res.status(200).send(html);
}
