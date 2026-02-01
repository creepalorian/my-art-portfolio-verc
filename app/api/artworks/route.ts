import { NextResponse } from 'next/server';
import { getArtworks, addArtwork } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const artworks = await getArtworks();
    return NextResponse.json(artworks);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrl, category, medium, date, dimensions } = body;

        if (!title || !imageUrl || !medium || !date || !dimensions) {
            return NextResponse.json(
                { error: 'Missing required fields: title, imageUrl, medium, date, dimensions' },
                { status: 400 }
            );
        }

        const newArtwork = await addArtwork({
            id: crypto.randomUUID(),
            title,
            description: description || '',
            imageUrl,
            category: category || 'Uncategorized',
            medium,
            date,
            dimensions,
        });

        return NextResponse.json(newArtwork, { status: 201 });
    } catch (error) {
        console.error('Error creating artwork:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
