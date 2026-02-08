import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveArtworks, getArtworks } from '@/lib/store';

export async function POST(request: Request) {
    try {
        const { artworkIds } = await request.json();

        if (!Array.isArray(artworkIds)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        const currentArtworks = await getArtworks();

        // Rebuild the array based on the new ID order
        // This ensures we don't lose data if the client sent partial list, 
        // though typically we expect full list.
        // Strategy: Map IDs to items.

        const artworkMap = new Map(currentArtworks.map(a => [a.id, a]));
        const newOrder: any[] = [];

        // Add items in the requested order
        artworkIds.forEach(id => {
            if (artworkMap.has(id)) {
                newOrder.push(artworkMap.get(id));
                artworkMap.delete(id);
            }
        });

        // Append any remaining items (if any were missing from request) to the end
        // to prevent accidental deletion
        artworkMap.forEach(artwork => {
            newOrder.push(artwork);
        });

        await saveArtworks(newOrder);

        // Invalidate cache for works page and landing page
        revalidatePath('/works');
        revalidatePath('/');

        return NextResponse.json({ success: true, artworks: newOrder });
    } catch (error) {
        console.error('Error reordering artworks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
