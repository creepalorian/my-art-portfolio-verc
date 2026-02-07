"use client";

import { useState, FormEvent } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: 'general', message: '' });
            } else {
                const data = await response.json();
                setStatus('error');
                setErrorMessage(data.error || 'Failed to send message');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: '600px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: 'var(--spacing-md)'
            }}
        >
            {/* Form Group - Name */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label
                    htmlFor="name"
                    style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: 0.8
                    }}
                >
                    Name *
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--foreground)',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Form Group - Email */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label
                    htmlFor="email"
                    style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: 0.8
                    }}
                >
                    Email *
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--foreground)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        minHeight: '44px',
                        WebkitAppearance: 'none' as any,
                        boxSizing: 'border-box' as any
                    }}
                />
            </div>

            {/* Form Group - Subject */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label
                    htmlFor="subject"
                    style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: 0.8
                    }}
                >
                    Subject *
                </label>
                <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--foreground)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        minHeight: '44px',
                        WebkitAppearance: 'none' as any,
                        appearance: 'none',
                        paddingRight: '2.5rem',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23888\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '12px',
                        boxSizing: 'border-box' as any
                    }}
                >
                    <option value="general">General Inquiry</option>
                    <option value="commission">Commission Request</option>
                    <option value="collaboration">Collaboration</option>
                </select>
            </div>

            {/* Form Group - Message */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label
                    htmlFor="message"
                    style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        opacity: 0.8
                    }}
                >
                    Message *
                </label>
                <textarea
                    id="message"
                    required
                    rows={6}
                    minLength={10}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--foreground)',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: '1.6'
                    }}
                />
            </div>

            {/* Success Message */}
            {status === 'success' && (
                <div
                    style={{
                        padding: '1rem',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '4px',
                        marginBottom: '1.5rem',
                        color: '#22c55e'
                    }}
                >
                    ✓ Message sent successfully! I'll get back to you soon.
                </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
                <div
                    style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '4px',
                        marginBottom: '1.5rem',
                        color: '#ef4444'
                    }}
                >
                    ✗ {errorMessage}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary"
                style={{
                    opacity: status === 'loading' ? 0.6 : 1,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit'
                }}
            >
                {status === 'loading' ? 'Sending...' : 'Go Time'}
            </button>
        </form>
    );
}
