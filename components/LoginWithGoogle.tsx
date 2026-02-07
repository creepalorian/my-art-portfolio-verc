"use client";

import { GoogleLogin } from '@react-oauth/google';

interface LoginWithGoogleProps {
    onSuccess: () => void;
    onError: (message: string) => void;
}

export default function LoginWithGoogle({ onSuccess, onError }: LoginWithGoogleProps) {
    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onSuccess();
            } else {
                onError(data.error || 'Login failed');
            }
        } catch (error) {
            onError('An error occurred during login');
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => onError('Google Login Failed')}
                theme="filled_black"
                shape="pill"
            />
        </div>
    );
}
