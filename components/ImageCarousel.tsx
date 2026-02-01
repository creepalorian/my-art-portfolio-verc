"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";


interface CarouselImage {
    src: string;
    alt: string;
}

export default function ImageCarousel({ images = [] }: { images?: CarouselImage[] }) {
    // Fallback if no images provided
    const displayImages = images.length > 0 ? images : [
        { src: "/manga-bg.png", alt: "Background 1" },
        { src: "/manga-bg-2.png", alt: "Background 2" },
        { src: "/manga-bg-3.png", alt: "Background 3" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll and progress when playing
    useEffect(() => {
        if (!isPlaying) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return;
        }

        // Progress bar update (60fps for smooth animation)
        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + (100 / (5000 / 16.67)); // 5 seconds total
            });
        }, 16.67);

        // Image transition
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
            setProgress(0);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [isPlaying, currentIndex, displayImages.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
        setProgress(0);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        setProgress(0);
    };

    const togglePlay = () => {
        setProgress(0);
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Image Container */}
            <div
                style={{
                    display: "flex",
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(-${currentIndex * 100}%)`,
                    height: "100%",
                }}
            >
                {displayImages.map((img, index) => (
                    <div
                        key={index}
                        style={{
                            minWidth: "100%",
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={index === 0}
                            sizes="100vw"
                        />
                        {/* Caption Overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: '120px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                            textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            zIndex: 10
                        }}>
                            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 500, letterSpacing: '0.05em' }}>{img.alt}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            {isPlaying && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "80px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "200px",
                        height: "2px",
                        background: "rgba(255, 255, 255, 0.3)",
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: "white",
                            transition: "width 0.016s linear",
                        }}
                    />
                </div>
            )}

            {/* Bottom Controls Container */}
            <div
                style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    zIndex: 100,
                }}
            >
                {/* Left Arrow */}
                <button
                    onClick={goToPrevious}
                    style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }}
                >
                    ←
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }}
                >
                    {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Dots Indicator */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setProgress(0);
                            }}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                border: "1px solid white",
                                background: currentIndex === index ? "white" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={goToNext}
                    style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }}
                >
                    →
                </button>
            </div>
        </div>
    );
}
