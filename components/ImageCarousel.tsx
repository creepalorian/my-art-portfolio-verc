"use client";

import { useState, useEffect } from "react";

const images = [
    "/manga-bg.png",
    "/manga-bg-2.png",
    "/manga-bg-3.png",
];

export default function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // Auto-scroll when playing
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const togglePlay = () => {
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
                {images.map((src, index) => (
                    <div
                        key={index}
                        style={{
                            minWidth: "100%",
                            height: "100%",
                            backgroundImage: `url(${src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                ))}
            </div>

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
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
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
