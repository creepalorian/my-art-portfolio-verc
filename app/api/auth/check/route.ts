import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        return NextResponse.json({ authenticated: false });
    }

    const isValid = await verifySession(session.value);
    return NextResponse.json({ authenticated: isValid });
}
