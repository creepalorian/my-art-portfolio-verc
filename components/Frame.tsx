"use client";

export default function Frame() {
    const thickness = 8;
    const color = "#ffffff";
    const backgroundColor = "#0a0a0a"; // Match the global background color

    // Using "overlay" technique: Draw the frame, then draw black shapes ON TOP to "cut" it.
    // This is more robust than masking for simple "gaps".

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                pointerEvents: "none",
            }}
        >
            <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100vw', height: '100vh' }}
            >
                {/* 1. The Full White Frame */}
                <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness * 2} // Stroke is centered, so *2 ensures it touches edge roughly 
                // Note: standard SVG rect stroke is centered on the line. 
                // To get an inner border effect perfectly, we'd need complex pathing.
                // For now, simpler is better.
                />

                {/* 2. The "Cuts" - Black polygons that hide parts of the frame */}

                {/* Top Edge Cuts */}
                <polygon points="20% -10, 22% 50, 24% 50, 22% -10" fill={backgroundColor} />
                <polygon points="60% -10, 58% 50, 62% 50, 64% -10" fill={backgroundColor} />
                <polygon points="85% -10, 87% 50, 89% 50, 86% -10" fill={backgroundColor} />

                {/* Bottom Edge Cuts */}
                <polygon points="10% 100%, 12% 90%, 14% 90%, 11% 110%" fill={backgroundColor} />
                <polygon points="45% 100%, 43% 90%, 47% 90%, 46% 110%" fill={backgroundColor} />
                <polygon points="75% 100%, 78% 90%, 80% 90%, 77% 110%" fill={backgroundColor} />

                {/* Left Edge Cuts */}
                <polygon points="-10 15%, 50 17%, 50 19%, -10 18%" fill={backgroundColor} />
                <polygon points="-10 40%, 50 42%, 50 44%, -10 41%" fill={backgroundColor} />
                <polygon points="-10 75%, 50 73%, 50 76%, -10 77%" fill={backgroundColor} />

                {/* Right Edge Cuts */}
                <polygon points="100% 25%, 90% 28%, 90% 30%, 110% 27%" fill={backgroundColor} />
                <polygon points="100% 60%, 90% 58%, 90% 62%, 110% 64%" fill={backgroundColor} />
                <polygon points="100% 85%, 90% 88%, 90% 89%, 110% 87%" fill={backgroundColor} />

            </svg>
        </div>
    );
}
