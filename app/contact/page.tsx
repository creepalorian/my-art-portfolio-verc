export default function ContactPage() {
    return (
        <main>
            <section style={{ maxWidth: '600px' }}>
                <h1>Contact</h1>
                <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.8 }}>
                    For inquiries, commissions, or collaborations, please reach out.
                </p>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <a href="mailto:hello@example.com" className="btn btn-primary">
                        Email Me
                    </a>
                </div>
            </section>
        </main>
    );
}
