import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'default-secret-change-in-production'
);

export async function createSession(userId: string): Promise<string> {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);

    return token;
}

export async function verifySession(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, SECRET);
        return true;
    } catch {
        return false;
    }
}

export function verifyPassword(password: string): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    return password === adminPassword;
}
