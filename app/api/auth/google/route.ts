import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createSession } from '@/lib/auth';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
    try {
        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json(
                { error: 'No credential provided' },
                { status: 400 }
            );
        }

        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        const email = payload.email;
        const allowedEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());

        if (!allowedEmails.includes(email)) {
            console.warn(`[Auth] Unauthorized login attempt: ${email}`);
            return NextResponse.json(
                { error: 'Unauthorized email' },
                { status: 403 }
            );
        }

        // Create session
        const token = await createSession(email); // Use email as userId
        const response = NextResponse.json({ success: true });

        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('[Auth] Google login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
