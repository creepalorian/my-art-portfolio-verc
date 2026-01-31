import { NextResponse } from 'next/server';
import { deleteArtwork } from '@/lib/store';

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
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting artwork:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
