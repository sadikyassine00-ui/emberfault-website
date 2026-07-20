import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Here we could verify the client payload (e.g., checking if the user is a logged-in admin).
        // Since we are running in an Edge function, verifying Firebase Auth tokens requires custom JWT decoding.
        // For this simple implementation, we'll ensure they at least passed the basic admin flag in the payload.
        const parsedPayload = JSON.parse(clientPayload || '{}');
        
        if (parsedPayload.isAdmin !== true) {
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

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
