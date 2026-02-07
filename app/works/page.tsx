import GalleryGrid from '@/components/GalleryGrid';
import { getArtworks } from '@/lib/store';

export default async function WorksPage() {
  const artworks = await getArtworks({ revalidate: 3600 });

  return (
    <main>
      <GalleryGrid artworks={artworks} />
    </main>
  );
}
