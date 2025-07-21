import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    // In a real app, you'd have logic to authenticate the user first.
    // For this prototype, we'll generate credentials for any request.

    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
        console.error("ImageKit keys are not configured in environment variables.");
        return new Response(
            JSON.stringify({ error: "ImageKit keys are not configured." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    try {
        const authParams = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
        });

        return Response.json(authParams);

    } catch (error) {
        console.error("Error generating ImageKit auth params:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate authentication parameters." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
