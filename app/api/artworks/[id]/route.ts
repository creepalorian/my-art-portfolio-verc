import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteArtwork, updateArtwork } from '@/lib/store';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updates = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedArtworks = await updateArtwork(id, updates);

        // Invalidate cache
        revalidatePath('/works');
        revalidatePath('/');

        return NextResponse.json({ success: true, artworks: updatedArtworks });
    } catch (error) {
        console.error('Error updating artwork:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await deleteArtwork(id);

        // Invalidate cache
        revalidatePath('/works');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting artwork:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
