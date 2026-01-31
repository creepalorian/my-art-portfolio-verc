"use client";

import { useState, useEffect } from "react";

const images = [
    "/manga-bg.png",
    "/manga-bg-2.png",
    "/manga-bg-3.png",
];

export default function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
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

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    pointerEvents: "auto",
                    zIndex: 10,
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

            <button
                onClick={goToNext}
                style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    pointerEvents: "auto",
                    zIndex: 10,
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

            {/* Dots Indicator */}
            <div
                style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px",
                    zIndex: 10,
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
                            pointerEvents: "auto",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
