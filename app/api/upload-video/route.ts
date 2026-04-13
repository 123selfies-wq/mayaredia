import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'casting',
            chunk_size: 20_000_000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );

        // Write buffer in small pieces to avoid backpressure issues
        const PIECE = 10 * 1024 * 1024; // 10 MB
        let offset = 0;
        while (offset < buffer.length) {
          stream.write(buffer.subarray(offset, Math.min(offset + PIECE, buffer.length)));
          offset += PIECE;
        }
        stream.end();
      }
    );

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Video upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
