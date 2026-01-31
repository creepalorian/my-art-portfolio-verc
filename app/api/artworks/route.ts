import { NextResponse } from 'next/server';
import { getArtworks, addArtwork } from '@/lib/store';

export async function GET() {
    const artworks = await getArtworks();
    return NextResponse.json(artworks);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrl, category } = body;

        if (!title || !imageUrl) {
            return NextResponse.json(
                { error: 'Title and Image URL are required' },
                { status: 400 }
            );
        }

        const newArtwork = await addArtwork({
            id: crypto.randomUUID(),
            title,
            description: description || '',
            imageUrl,
            category: category || 'Uncategorized',
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
