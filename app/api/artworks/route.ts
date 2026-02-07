import { NextResponse } from 'next/server';
import { getArtworks, addArtwork } from '@/lib/store';

export const dynamic = 'force-dynamic';

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

        // addArtwork returns the new artwork object
        const newArtwork = await addArtwork({
            id: crypto.randomUUID(),
            title,
            description: description || '',
            imageUrl,
            category: category || 'Artwork',
            medium: medium || 'Unknown',
            date: date || new Date().toISOString().split('T')[0],
            dimensions: dimensions || 'Unknown',
        });

        return NextResponse.json(newArtwork, { status: 201 });
    } catch (error: any) {
        console.error('Error creating artwork:', error);
        const errorMessage = error?.message || 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
