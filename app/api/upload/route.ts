import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Check if Cloudinary is configured
        const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                            process.env.CLOUDINARY_API_KEY &&
                            process.env.CLOUDINARY_API_SECRET;

        if (hasCloudinary) {
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'art-portfolio',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            return NextResponse.json({
                url: (result as any).secure_url,
                publicId: (result as any).public_id,
            });
        } else {
            // Fallback: Local filesystem upload
            // Ensure uploads directory exists
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            try {
                await writeFile(path.join(uploadsDir, 'test.txt'), 'test');
            } catch {
                // Directory might not exist
                const fs = require('fs');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
            }

            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filepath = path.join(uploadsDir, filename);

            await writeFile(filepath, buffer);

            return NextResponse.json({
                url: `/uploads/${filename}`,
                publicId: `local-${uniqueSuffix}`,
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
