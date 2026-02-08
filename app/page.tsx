import ImageCarousel from "@/components/ImageCarousel";
import { getArtworks } from "@/lib/store";

export default async function LandingPage() {
    const artworks = await getArtworks({ revalidate: 3600 });
    const featuredArtworks = artworks
        .filter(a => a.featured)
        .map(a => ({ src: a.imageUrl, alt: a.title }));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Creepalorian',
        alternateName: 'AD',
        jobTitle: 'Artist',
        url: 'https://creepalorian.vercel.app',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Singapore',
            addressCountry: 'SG'
        },
        description: 'Young left-handed artist from Singapore specializing in digital art and sketches.',
        knowsAbout: ['Digital Art', 'Anime', 'Speedcubing']
    };

    return (
        <main className="landing-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ImageCarousel images={featuredArtworks} />
        </main>
    );
}
