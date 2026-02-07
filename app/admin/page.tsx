"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ArtworkForm from '@/components/ArtworkForm';
import LoginWithGoogle from '@/components/LoginWithGoogle';
import { Artwork } from '@/lib/store';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Helper to extract unique mediums
const getMediums = (items: Artwork[]) => {
    const mediums = new Set(items.map(item => item.medium));
    return Array.from(mediums).sort();
};

// Sortable Artwork Item Component
interface SortableArtworkItemProps {
    artwork: Artwork;
    sortBy: string;
    onEdit: (artwork: Artwork) => void;
    onDelete: (id: string) => void;
    onFeaturedToggle: (artwork: Artwork, isFeatured: boolean) => void;
}

function SortableArtworkItem({ artwork, sortBy, onEdit, onDelete, onFeaturedToggle }: SortableArtworkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: artwork.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isDragEnabled = sortBy === 'manual';

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                display: 'flex',
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'var(--surface)',
                borderRadius: '8px',
                alignItems: 'center',
                border: '1px solid var(--border)'
            }}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                style={{
                    cursor: isDragEnabled ? 'grab' : 'default',
                    fontSize: '1.5rem',
                    color: 'var(--foreground)',
                    opacity: isDragEnabled ? 0.6 : 0.2,
                    padding: '0.5rem',
                    userSelect: 'none',
                    touchAction: 'none'
                }}
            >
                ☰
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={!!artwork.featured}
                        onChange={(e) => onFeaturedToggle(artwork, e.target.checked)}
                        style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Featured (Home)</span>
                </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={() => onEdit(artwork)}
                    className="btn btn-outline"
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                    }}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(artwork.id)}
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
    );
}

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
    }

    async function fetchArtworks() {
        // Add timestamp to prevent caching
        const response = await fetch(`/api/artworks?t=${Date.now()}`, {
            cache: 'no-store'
        });
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

    async function handleFeaturedToggle(artwork: Artwork, isFeatured: boolean) {
        if (isFeatured) {
            const currentFeaturedCount = artworks.filter(a => a.featured).length;
            if (currentFeaturedCount >= 5) {
                alert("You can only feature up to 5 artworks on the homepage.");
                return;
            }
        }

        // Optimistic update
        const updatedArtworks = artworks.map(a =>
            a.id === artwork.id ? { ...a, featured: isFeatured } : a
        );
        setArtworks(updatedArtworks);

        try {
            await fetch(`/api/artworks/${artwork.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: isFeatured })
            });
            // No need to refresh, optimistic update handles it
        } catch (error) {
            console.error('Failed to update featured status', error);
            // Revert
            fetchArtworks();
        }
    }

    // Reordering Logic
    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = artworks.findIndex(a => a.id === active.id);
        const newIndex = artworks.findIndex(a => a.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newArtworks = [...artworks];
        const [movedItem] = newArtworks.splice(oldIndex, 1);
        newArtworks.splice(newIndex, 0, movedItem);

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
            // Revert on error
            fetchArtworks();
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

    // Render Login helpers...
    if (isLoading) return <main style={{ padding: '2rem', textAlign: 'center' }}><p>Loading...</p></main>;

    console.log('Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

    if (!isAuthenticated) return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '400px',
                    width: '100%',
                    background: 'var(--surface)',
                    padding: '2rem',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-comfortaa)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Admin Login</h1>

                    {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                        <div style={{ padding: '1rem', background: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            ⚠️ Missing Google Client ID. Please configure .env.local
                        </div>
                    )}

                    <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                        Sign in with an authorized Google account to manage artworks.
                    </p>

                    <LoginWithGoogle
                        onSuccess={() => {
                            setIsAuthenticated(true);
                        }}
                        onError={(msg) => setError(msg)}
                    />

                    {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                </div>
            </main>
        </GoogleOAuthProvider>
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

                <DndContext
                    sensors={useSensors(useSensor(PointerSensor, {
                        activationConstraint: {
                            distance: 8, // 8px movement required before drag starts
                        },
                    }))}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredArtworks.map(a => a.id)}
                        strategy={verticalListSortingStrategy}
                        disabled={sortBy !== 'manual'}
                    >
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {filteredArtworks.map((artwork) => (
                                <SortableArtworkItem
                                    key={artwork.id}
                                    artwork={artwork}
                                    sortBy={sortBy}
                                    onEdit={startEditing}
                                    onDelete={handleDelete}
                                    onFeaturedToggle={handleFeaturedToggle}
                                />
                            ))}
                            {filteredArtworks.length === 0 && (
                                <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No artworks matching criteria.</p>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </section>
        </main>
    );
}
