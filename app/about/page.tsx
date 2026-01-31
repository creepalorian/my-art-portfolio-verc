export default function AboutPage() {
    return (
        <main>
            <section style={{ maxWidth: '800px' }}>
                <h1>About Me</h1>
                <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.8, lineHeight: '1.8' }}>
                    Hello! I am a digital artist focused on creating immersive visual experiences.
                    My work bridges the gap between traditional techniques and modern technology.
                </p>
                <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.8, lineHeight: '1.8' }}>
                    This portfolio serves as a catalog of my ongoing exploration into generative art,
                    3D sculpting, and oil painting.
                </p>
                <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.8, lineHeight: '1.8' }}>
                    For inquiries, please reach out via email.
                </p>

                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <a href="mailto:hello@example.com" className="btn btn-primary">
                        Contact Me
                    </a>
                </div>
            </section>
        </main>
    );
}
