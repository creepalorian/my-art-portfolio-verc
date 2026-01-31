import GalleryGrid from '@/components/GalleryGrid';
import { getArtworks } from '@/lib/store';

export const revalidate = 0; // Disable cache to ensure fresh data for now

export default async function Home() {
  const artworks = await getArtworks();

  return (
    <main className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
      <section style={{
        padding: 'var(--spacing-lg) 0',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: 'var(--spacing-sm)',
          letterSpacing: '-0.03em'
        }}>
          Selected Works
        </h1>
        <p style={{
          color: '#888',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.1rem'
        }}>
          A collection of digital and physical mediums exploring form, texture, and emotion.
        </p>
      </section>

      <GalleryGrid artworks={artworks} />
    </main>
  );
}
