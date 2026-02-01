import ImageCarousel from "@/components/ImageCarousel";
import { getArtworks } from "@/lib/store";

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
    const artworks = await getArtworks();
    const featuredArtworks = artworks
        .filter(a => a.featured)
        .map(a => ({ src: a.imageUrl, alt: a.title }));

    return (
        <main className="landing-page">
            <ImageCarousel images={featuredArtworks} />
        </main>
    );
}
