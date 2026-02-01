export default function AboutPage() {
    return (
        <main>
            <section style={{
                maxWidth: '1000px',
                display: 'flex',
                gap: '3rem',
                alignItems: 'flex-start',
                flexWrap: 'wrap'
            }}>
                {/* Profile Image - Left Column */}
                <div style={{ flex: '0 0 300px', width: '100%', maxWidth: '300px' }}>
                    <img
                        src="/about-profile.png"
                        alt="AD Portrait"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px'
                        }}
                    />
                </div>

                {/* Text Content - Right Column */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        AD is a left-handed artist. He is 11 years old and lives in Singapore. His artworks are inspired by the content he consumes and the visual narratives he gets to explore through books, games, films, and anime.
                    </p>
                    <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        P.S: He also enjoys speedcubing
                    </p>
                    <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        This portfolio serves as a live catalog of his ongoing exploration with art.
                    </p>
                    <p style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        For inquiries, please reach out via email.
                    </p>
                </div>
            </section>
        </main >
    );
}
