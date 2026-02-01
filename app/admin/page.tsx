"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArtworkForm from '@/components/ArtworkForm';
import { Artwork } from '@/lib/store';

// Helper to extract unique mediums
const getMediums = (items: Artwork[]) => {
    const mediums = new Set(items.map(i => i.medium).filter(Boolean));
    return Array.from(mediums).sort();
};

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    // Filtering & Sorting State
    const [filterTitle, setFilterTitle] = useState('');
    const [filterMedium, setFilterMedium] = useState('');
    const [sortBy, setSortBy] = useState('manual'); // 'manual', 'date-new', 'date-old', 'title'

    const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

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
        router.refresh();
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this artwork?')) return;
        await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
        fetchArtworks();
    }

    function startEditing(artwork: Artwork) {
        setEditingArtwork(artwork);
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEditing() {
        setEditingArtwork(null);
    }

    // Reordering Logic
    async function moveItem(index: number, direction: 'up' | 'down') {
        const newArtworks = [...artworks];
        if (direction === 'up' && index > 0) {
            [newArtworks[index], newArtworks[index - 1]] = [newArtworks[index - 1], newArtworks[index]];
        } else if (direction === 'down' && index < newArtworks.length - 1) {
            [newArtworks[index], newArtworks[index + 1]] = [newArtworks[index + 1], newArtworks[index]];
        } else {
            return;
        }

        // Optimistic update
        setArtworks(newArtworks);

        // API Call
        try {
            await fetch('/api/artworks/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ artworkIds: newArtworks.map(a => a.id) })
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to save order', error);
            // Revert on error could be implemented here
        }
    }

    // Derived State for Display
    const filteredArtworks = artworks.filter(artwork => {
        const matchesTitle = artwork.title.toLowerCase().includes(filterTitle.toLowerCase());
        const matchesMedium = filterMedium ? artwork.medium === filterMedium : true;
        return matchesTitle && matchesMedium;
    }).sort((a, b) => {
        if (sortBy === 'date-new') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-old') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0; // 'manual' relies on array order
    });

    const mediums = getMediums(artworks);

    // Render Login helpers... (omitted for brevity, using same logic as before)
    if (isLoading) return <main style={{ padding: '2rem', textAlign: 'center' }}><p>Loading...</p></main>;
    if (!isAuthenticated) return (
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
                borderRadius: '8px',
                fontFamily: 'var(--font-comfortaa)'
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
                        fontSize: '1rem',
                        fontFamily: 'var(--font-comfortaa)'
                    }}
                    autoFocus
                />
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
        </main>
    );

    return (
        <main style={{ fontFamily: 'var(--font-comfortaa)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginBottom: '2rem' }}>
                <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>Logout</button>
            </div>

            <section style={{ marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
                <ArtworkForm
                    onSuccess={fetchArtworks}
                    editArtwork={editingArtwork}
                    onCancelEdit={cancelEditing}
                />
            </section>

            <section style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Existing Artworks ({filteredArtworks.length})</h2>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                            placeholder="Search title..."
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                                fontFamily: 'inherit'
                            }}
                        />
                        <select
                            value={filterMedium}
                            onChange={(e) => setFilterMedium(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value="">All Mediums</option>
                            {mediums.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value="manual">Manual Order</option>
                            <option value="date-new">Date (Newest)</option>
                            <option value="date-old">Date (Oldest)</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredArtworks.map((artwork, index) => (
                        <div
                            key={artwork.id}
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                padding: '1.5rem',
                                background: 'var(--surface)',
                                borderRadius: '8px',
                                alignItems: 'center',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0 || sortBy !== 'manual'}
                                    style={{
                                        opacity: (index === 0 || sortBy !== 'manual') ? 0.3 : 1,
                                        cursor: (index === 0 || sortBy !== 'manual') ? 'default' : 'pointer',
                                        background: 'none', border: 'none', color: 'var(--foreground)', fontSize: '1.2rem'
                                    }}
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === artworks.length - 1 || sortBy !== 'manual'}
                                    style={{
                                        opacity: (index === artworks.length - 1 || sortBy !== 'manual') ? 0.3 : 1,
                                        cursor: (index === artworks.length - 1 || sortBy !== 'manual') ? 'default' : 'pointer',
                                        background: 'none', border: 'none', color: 'var(--foreground)', fontSize: '1.2rem'
                                    }}
                                >
                                    ↓
                                </button>
                            </div>

                            <Image
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                width={100}
                                height={100}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{artwork.title}</h3>
                                <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                                    {artwork.medium}
                                </p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                                    {artwork.date} • {artwork.dimensions}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    onClick={() => startEditing(artwork)}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(artwork.id)}
                                    className="btn btn-outline"
                                    style={{
                                        color: '#ff6b6b',
                                        borderColor: '#ff6b6b',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredArtworks.length === 0 && (
                        <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No artworks matching criteria.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
