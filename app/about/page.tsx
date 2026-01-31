export default function AboutPage() {
    return (
        <main className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
            <section style={{ maxWidth: '800px', margin: 'var(--spacing-lg) auto 0' }}>
                <h1 style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--spacing-md)',
                    letterSpacing: '-0.03em'
                }}>
                    About the Artist
                </h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#ccc' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Hello! I am a digital artist focused on creating immersive visual experiences.
                        My work bridges the gap between traditional techniques and modern technology.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        This portfolio serves as a catalog of my ongoing exploration into generative art,
                        3D sculpting, and oil painting.
                    </p>
                    <p>
                        For inquiries, please reach out via email.
                    </p>
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <a href="mailto:hello@example.com" className="btn btn-primary">
                        Contact Me
                    </a>
                </div>
            </section>
        </main>
    );
}
