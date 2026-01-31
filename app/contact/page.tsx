export default function ContactPage() {
    return (
        <main>
            <section style={{ maxWidth: '600px' }}>
                <p style={{ opacity: 0.8 }}>
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
