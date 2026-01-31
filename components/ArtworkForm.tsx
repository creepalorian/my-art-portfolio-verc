"use client";

import { useState } from 'react';

export default function ArtworkForm({ onArtworkAdded }: { onArtworkAdded: () => void }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/artworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ title: '', description: '', imageUrl: '', category: '' });
                onArtworkAdded();
            } else {
                alert('Failed to add artwork');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--foreground)',
        marginBottom: '1rem',
        fontSize: '1rem',
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)',
            padding: 'var(--spacing-md)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
        }}>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Add New Artwork</h2>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    name="imageUrl"
                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    name="category"
                    placeholder="Category (e.g., Oil, Digital)"
                    value={formData.category}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
            >
                {loading ? 'Adding...' : 'Add Artwork'}
            </button>
        </form>
    );
}
