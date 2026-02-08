"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ImageCarousel.module.css";

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

    // Auto-scroll and progress when playing
    useEffect(() => {
        if (!isPlaying) return;

        let animationFrameId: number;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const duration = 5000;

            if (elapsed >= duration) {
                setCurrentIndex((prev) => (prev + 1) % displayImages.length);
                setProgress(0);
            } else {
                setProgress((elapsed / duration) * 100);
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
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
        <div className={styles.carouselContainer}>
            {/* Image Container */}
            <div
                className={styles.slidesContainer}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {displayImages.map((img, index) => (
                    <div
                        key={index}
                        className={styles.slide}
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
                        <div className={styles.caption}>
                            <h2 className={styles.captionText}>{img.alt}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            {isPlaying && (
                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            )}

            {/* Bottom Controls Container */}
            <div className={styles.controlsContainer}>
                {/* Left Arrow */}
                <button
                    onClick={goToPrevious}
                    className={`${styles.controlButton} ${styles.controlButtonArrow}`}
                >
                    ←
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="carousel-control-btn"
                    style={{
                        width: "40px",
                        height: "40px",
                        // fontSize removed since we are using SVGs
                    }}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        /* Pause Icon */
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M4 14H2V0H4V14ZM12 14H10V0H12V14Z" />
                        </svg>
                    ) : (
                        /* Play Icon */
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M0 0V14L11 7L0 0Z" />
                        </svg>
                    )}
                </button>

                {/* Dots Indicator */}
                <div className={styles.indicatorsContainer}>
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setProgress(0);
                            }}
                            className={`${styles.indicatorDot} ${currentIndex === index ? styles.indicatorDotActive : ''}`}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={goToNext}
                    className={`${styles.controlButton} ${styles.controlButtonArrow}`}
                >
                    →
                </button>
            </div>
        </div>
    );
}
