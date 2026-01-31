import { NextResponse } from 'next/server';
import { getArtworks, getDebugInfo } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const artworks = await getArtworks();
    const debug = await getDebugInfo();
    return NextResponse.json({ artworks, debug });
}
