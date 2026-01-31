"use client";

import { useState } from 'react';

const MEDIUM_OPTIONS = [
    "Oil on Canvas",
    "Acrylic on Canvas",
    "Oil on Linen",
    "Mixed Media",
    "Charcoal on Paper",
    "Watercolor",
    "Digital Archival Print",
    "Sculpture",
    "Installation",
    "Other"
];

export default function ArtworkForm({ onSuccess }: { onSuccess: () => void }) {
    // Dimensions state separated
    const [dimensions, setDimensions] = useState({ height: '', width: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        medium: '',
        date: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress('Uploading image...');
        setSuccessMessage('');

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

            // Combine dimensions
            const dimensionString = `${dimensions.height} x ${dimensions.width} inches`;

            // Create artwork
            const res = await fetch('/api/artworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    dimensions: dimensionString,
                    category: 'Artwork', // Default category since field is removed
                    imageUrl,
                    id: Date.now().toString(),
                }),
            });

            if (res.ok) {
                setFormData({
                    title: '',
                    description: '',
                    medium: '',
                    date: '',
                });
                setDimensions({ height: '', width: '' });
                setImageFile(null);
                onSuccess();
                setUploadProgress('');
                setSuccessMessage('✨ Artwork added successfully!');
                setTimeout(() => setSuccessMessage(''), 5000);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and decimals
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setDimensions({
                ...dimensions,
                [e.target.name]: value
            });
        }
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
        fontFamily: 'var(--font-comfortaa)', // Consistent font
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-comfortaa)'
        }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Add New Artwork</h2>

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

            <div style={{ marginBottom: '1rem' }}>
                <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                    <option value="" disabled>Select Medium *</option>
                    {MEDIUM_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    name="date"
                    type="date"
                    placeholder="Date *"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{
                        ...inputStyle,
                        colorScheme: 'dark' // Forces calendar icon to be white in dark mode
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Height (in)</label>
                    <input
                        name="height"
                        placeholder="0"
                        value={dimensions.height}
                        onChange={handleDimensionChange}
                        required
                        style={{ ...inputStyle, marginBottom: 0 }}
                        inputMode="decimal"
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                    <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>×</span>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Width (in)</label>
                    <input
                        name="width"
                        placeholder="0"
                        value={dimensions.width}
                        onChange={handleDimensionChange}
                        required
                        style={{ ...inputStyle, marginBottom: 0 }}
                        inputMode="decimal"
                    />
                </div>
            </div>

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

            {successMessage && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.8rem',
                    background: 'rgba(0, 255, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 0, 0.2)',
                    borderRadius: '4px',
                    color: '#4ade80',
                    fontSize: '0.9rem'
                }}>
                    {successMessage}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '1rem' }}
            >
                {loading ? 'Adding...' : 'Add Artwork'}
            </button>
        </form>
    );
}
