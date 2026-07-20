import { handleUpload } from '@vercel/blob/client';

export default async function handler(req: any, res: any) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let parsedPayload = {};
        try {
          parsedPayload = JSON.parse(clientPayload || '{}');
        } catch (e) {
          // ignore
        }
        
        if ((parsedPayload as any).isAdmin !== true) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            uploader: 'admin',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    // Return 400 with the error message
    return res.status(400).json({ error: error.message || 'An error occurred' });
  }
}
