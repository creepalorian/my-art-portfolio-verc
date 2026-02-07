"use client";

import { useState, useEffect } from 'react';
import { Artwork } from '@/lib/store';

const MEDIUM_OPTIONS = [
    "Oil on Canvas",
    "Acrylic on Canvas",
    "Oil on Linen",
    "Mixed Media",
    "Charcoal on Paper",
    "Pen/Marker on Paper",
    "Pencil Sketch",
    "Watercolor",
    "iPad Drawing",
    "Digital Archival Print",
    "Sculpture",
    "Installation",
    "Other"
];

interface ArtworkFormProps {
    onSuccess: () => void;
    editArtwork?: Artwork | null;
    onCancelEdit?: () => void;
}

export default function ArtworkForm({ onSuccess, editArtwork, onCancelEdit }: ArtworkFormProps) {
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
    const [fileError, setFileError] = useState('');

    // Populate form when editing
    useEffect(() => {
        if (editArtwork) {
            setFormData({
                title: editArtwork.title,
                description: editArtwork.description,
                medium: editArtwork.medium,
                date: editArtwork.date,
            });

            // Parse dimensions "24 x 36 inches"
            const dimMatch = editArtwork.dimensions?.match(/([\d.]+)\s*x\s*([\d.]+)/);
            if (dimMatch) {
                setDimensions({ height: dimMatch[1], width: dimMatch[2] });
            } else {
                setDimensions({ height: '', width: '' });
            }
        } else {
            // Reset form if editArtwork is cleared
            setFormData({ title: '', description: '', medium: '', date: '' });
            setDimensions({ height: '', width: '' });
        }
    }, [editArtwork]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress('Processing...');
        setSuccessMessage('');

        try {
            let imageUrl = editArtwork?.imageUrl || '';

            // Upload new image if selected
            if (imageFile) {
                setUploadProgress('Uploading new image...');
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) throw new Error('Image upload failed');
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            setUploadProgress('Saving details...');
            const dimensionString = `${dimensions.height} x ${dimensions.width} inches`;

            const payload = {
                ...formData,
                dimensions: dimensionString,
                category: 'Artwork',
                imageUrl,
            };

            const url = editArtwork
                ? `/api/artworks/${editArtwork.id}`
                : '/api/artworks';

            const method = editArtwork ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // If adding new, clear form. If editing, keep as is or user can cancel.
                if (!editArtwork) {
                    setFormData({ title: '', description: '', medium: '', date: '' });
                    setDimensions({ height: '', width: '' });
                }

                setImageFile(null);
                setUploadProgress('');
                setSuccessMessage(editArtwork ? '✨ Artwork updated!' : '✨ Artwork added!');

                onSuccess(); // Refresh parent list

                if (editArtwork && onCancelEdit) {
                    setTimeout(() => {
                        setSuccessMessage('');
                        onCancelEdit(); // Exit edit mode
                    }, 1000);
                } else {
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            } else {
                alert('Failed to save artwork');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving artwork');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setDimensions({ ...dimensions, [e.target.name]: value });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 4 * 1024 * 1024; // 4MB in bytes (Vercel limit is 4.5MB)

            if (file.size > maxSize) {
                setFileError('File size must be less than 4MB. Please compress your image and try again.');
                setImageFile(null);
                e.target.value = ''; // Clear the input
                return;
            }

            setFileError('');
            setImageFile(file);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        background: 'var(--background)',
        color: 'var(--foreground)',
        marginBottom: '1rem',
        fontSize: '1rem',
        fontFamily: 'var(--font-comfortaa)',
        minHeight: '44px',
        WebkitAppearance: 'none' as any,
        boxSizing: 'border-box' as any
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-comfortaa)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    {editArtwork ? 'Edit Artwork' : 'Add New Artwork'}
                </h2>
                {editArtwork && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="btn btn-outline"
                        style={{ fontSize: '0.9rem' }}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Image {editArtwork ? '(Keep current or upload new)' : '*'}
                </label>
                {editArtwork && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        <img src={editArtwork.imageUrl} alt="Current" style={{ height: '60px', borderRadius: '4px' }} />
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    onChange={handleFileChange}
                    required={!editArtwork}
                    style={inputStyle}
                />
                {imageFile && (
                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        Selected: {imageFile.name}
                    </p>
                )}
                {fileError && (
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '0.8rem',
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6b6b',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>⚠️</span>
                        <span>{fileError}</span>
                    </div>
                )}
            </div>

            <input name="title" placeholder="Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />

            <div style={{ marginBottom: '1rem' }}>
                <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    required
                    style={{
                        ...inputStyle,
                        appearance: 'none',
                        WebkitAppearance: 'none' as any,
                        cursor: 'pointer',
                        paddingRight: '2.5rem',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23888\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '12px'
                    }}
                >
                    <option value="" disabled>Select Medium *</option>
                    {MEDIUM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
                        position: 'relative' as any,
                        paddingRight: '2.5rem'
                    }}
                    className="date-input-mobile"
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Height (in)</label>
                    <input name="height" placeholder="0" value={dimensions.height} onChange={handleDimensionChange} required style={{ ...inputStyle, marginBottom: 0 }} inputMode="decimal" />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '24px' }}><span style={{ fontSize: '1.2rem', opacity: 0.5 }}>×</span></div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Width (in)</label>
                    <input name="width" placeholder="0" value={dimensions.width} onChange={handleDimensionChange} required style={{ ...inputStyle, marginBottom: 0 }} inputMode="decimal" />
                </div>
            </div>

            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />

            {uploadProgress && <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>{uploadProgress}</p>}
            {successMessage && <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgba(0, 255, 0, 0.2)', borderRadius: '4px', color: '#4ade80', fontSize: '0.9rem' }}>{successMessage}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                {loading ? 'Saving...' : (editArtwork ? 'Update Artwork' : 'Add Artwork')}
            </button>
        </form>
    );
}
