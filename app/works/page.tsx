import GalleryGrid from '@/components/GalleryGrid';
import { getArtworks } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function WorksPage() {
  const artworks = await getArtworks();

  return (
    <main>
      <GalleryGrid artworks={artworks} />
    </main>
  );
}
