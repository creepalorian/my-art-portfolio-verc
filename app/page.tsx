export default function LandingPage() {
    return (
        <main
            style={{
                position: 'fixed',
                top: 0,
                left: 250, // Start after sidebar
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/manga-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -1, // Behind everything content-wise in this pane
            }}
        >
            {/* 
        The landing page is purely visual ambiance.
        Navigation is handled by the persistent Sidebar.
      */}
        </main>
    );
}
