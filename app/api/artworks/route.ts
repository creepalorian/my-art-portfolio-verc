import { NextResponse } from 'next/server';
import { getArtworks, addArtwork } from '@/lib/store';

export async function GET() {
    // Add cache busting headers to the response itself
    const artworks = await getArtworks();
    return NextResponse.json(artworks, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
        }
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrl, category, medium, date, dimensions } = body;

        if (!title || !imageUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // addArtwork now returns the full list of artworks!
        const updatedArtworks = await addArtwork({
            id: crypto.randomUUID(),
            title,
            description: description || '',
            imageUrl,
            category: category || 'Artwork',
            medium: medium || 'Unknown',
            date: date || new Date().toISOString().split('T')[0],
            dimensions: dimensions || 'Unknown',
        });

        return NextResponse.json(updatedArtworks, { status: 201 });
    } catch (error) {
        console.error('Error creating artwork:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
