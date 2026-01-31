"use client";

import { useState, useEffect } from 'react';
import ArtworkForm from '@/components/ArtworkForm';
import { Artwork } from '@/lib/store';

export default function AdminPage() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const fetchArtworks = async () => {
        const res = await fetch('/api/artworks');
        const data = await res.json();
        setArtworks(data);
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this artwork?')) return;

        const res = await fetch(`/api/artworks/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchArtworks();
        } else {
            alert('Failed to delete artwork');
        }
    };

    return (
        <main className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Admin Dashboard</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: 'var(--spacing-md)'
            }}>
                <section>
                    <ArtworkForm onArtworkAdded={fetchArtworks} />
                </section>

                <section>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Existing Artworks ({artworks.length})</h2>
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {artworks.map((artwork) => (
                            <div key={artwork.id} style={{
                                background: 'var(--surface)',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{artwork.title}</h3>
                                    <p style={{ color: '#888', fontSize: '0.9rem' }}>{artwork.category}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(artwork.id)}
                                    className="btn btn-outline"
                                    style={{ color: '#ff4444', borderColor: '#ff4444' }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {artworks.length === 0 && (
                            <p style={{ color: '#888' }}>No artworks yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
