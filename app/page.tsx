import ImageCarousel from "@/components/ImageCarousel";

export default function LandingPage() {
    return (
        <main
            style={{
                position: 'fixed',
                top: 0,
                left: 250, // Start after sidebar
                right: 0,
                bottom: 0,
                zIndex: -1,
            }}
        >
            <ImageCarousel />
        </main>
    );
}
