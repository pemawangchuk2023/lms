import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryConfig } from '@/lib/cloudinary';

export async function POST(request: Request) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine resource type based on MIME type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: resourceType, timeout: 300000 },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error },
      { status: 500 }
    );
  }
}
