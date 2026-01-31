"use client";

import { useState, useEffect } from 'react';
import ArtworkForm from '@/components/ArtworkForm';
import { Artwork } from '@/lib/store';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            fetchArtworks();
        }
    }, [isAuthenticated]);

    async function checkAuth() {
        try {
            const response = await fetch('/api/auth/check');
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                setIsAuthenticated(true);
                setPassword('');
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('Login failed');
        }
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
    }

    async function fetchArtworks() {
        const response = await fetch('/api/artworks');
        const data = await response.json();
        setArtworks(data);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this artwork?')) return;

        await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
        fetchArtworks();
    }

    if (isLoading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <form onSubmit={handleLogin} style={{
                    maxWidth: '400px',
                    width: '100%',
                    background: 'var(--surface)',
                    padding: '2rem',
                    borderRadius: '8px'
                }}>
                    <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Admin Login</h1>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'var(--foreground)',
                            fontSize: '1rem'
                        }}
                        autoFocus
                    />

                    {error && (
                        <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h1>Admin Panel</h1>
                <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                </button>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Add New Artwork</h2>
                <ArtworkForm onSuccess={fetchArtworks} />
            </section>

            <section>
                <h2 style={{ marginBottom: '1rem' }}>Manage Artworks ({artworks.length})</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {artworks.map((artwork) => (
                        <div
                            key={artwork.id}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'var(--surface)',
                                borderRadius: '4px',
                                alignItems: 'center'
                            }}
                        >
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3>{artwork.title}</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                    {artwork.medium} • {artwork.date} • {artwork.dimensions}
                                </p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{artwork.category}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(artwork.id)}
                                className="btn btn-outline"
                                style={{ color: '#ff6b6b', borderColor: '#ff6b6b' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
