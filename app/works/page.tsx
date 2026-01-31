import GalleryGrid from '@/components/GalleryGrid';
import { getArtworks } from '@/lib/store';

export const revalidate = 0; // Disable cache to ensure fresh data for now

export default async function WorksPage() {
  const artworks = await getArtworks();

  return (
    <main>
      <section style={{ maxWidth: '1400px' }}>
        <h1>Selected Works</h1>
        <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.8, marginBottom: 'var(--spacing-lg)' }}>
          A collection of digital and physical mediums exploring form, texture, and emotion.
        </p>
      </section>

      <GalleryGrid artworks={artworks} />
    </main>
  );
}
