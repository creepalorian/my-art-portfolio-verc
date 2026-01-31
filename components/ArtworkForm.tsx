"use client";

import { useState } from 'react';

export default function ArtworkForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        medium: '',
        date: '',
        dimensions: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress('Uploading image...');

        try {
            // Upload image first
            let imageUrl = '';
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Image upload failed');
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            setUploadProgress('Saving artwork...');

            // Create artwork
            const res = await fetch('/api/artworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    imageUrl,
                    id: Date.now().toString(),
                }),
            });

            if (res.ok) {
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    medium: '',
                    date: '',
                    dimensions: '',
                });
                setImageFile(null);
                onSuccess();
                setUploadProgress('');
            } else {
                alert('Failed to add artwork');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding artwork');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        background: 'var(--background)',
        color: 'var(--foreground)',
        marginBottom: '1rem',
        fontSize: '1rem',
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Image *
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    style={inputStyle}
                />
                {imageFile && (
                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        Selected: {imageFile.name}
                    </p>
                )}
            </div>

            <input
                name="title"
                placeholder="Title *"
                value={formData.title}
                onChange={handleChange}
                required
                style={inputStyle}
            />

            <input
                name="medium"
                placeholder="Medium (e.g., Oil on Canvas, Digital) *"
                value={formData.medium}
                onChange={handleChange}
                required
                style={inputStyle}
            />

            <input
                name="date"
                type="date"
                placeholder="Date *"
                value={formData.date}
                onChange={handleChange}
                required
                style={inputStyle}
            />

            <input
                name="dimensions"
                placeholder="Dimensions (e.g., 24 x 36 inches) *"
                value={formData.dimensions}
                onChange={handleChange}
                required
                style={inputStyle}
            />

            <input
                name="category"
                placeholder="Category (e.g., Painting, Sculpture)"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
            />

            {uploadProgress && (
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    {uploadProgress}
                </p>
            )}

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
