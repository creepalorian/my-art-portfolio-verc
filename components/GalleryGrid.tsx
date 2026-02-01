"use client";

import { Artwork } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function GalleryGrid({ artworks }: { artworks: Artwork[] }) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtwork) return;
      if (e.key === 'Escape') setSelectedArtwork(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtwork, artworks]);

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork.id);
    const nextIndex = (currentIndex + 1) % artworks.length;
    setSelectedArtwork(artworks[nextIndex]);
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedArtwork) return;
    const currentIndex = artworks.findIndex(a => a.id === selectedArtwork.id);
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    setSelectedArtwork(artworks[prevIndex]);
  };

  if (artworks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
        No artworks found.
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="masonry-item"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <img src={artwork.imageUrl} alt={artwork.title} loading="lazy" />
            <div className="artwork-overlay">
              <h3>{artwork.title}</h3>
              <p>{new Date(artwork.date).getFullYear()}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <div
          className="lightbox"
          onClick={() => setSelectedArtwork(null)}
        >
          <button className="nav-btn prev" onClick={showPrev}>‹</button>

          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedArtwork(null)}>×</button>
            <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title} />
            <div className="info">
              <h2>{selectedArtwork.title}</h2>
              <p className="meta">{selectedArtwork.medium} • {new Date(selectedArtwork.date).getFullYear()} • {selectedArtwork.dimensions}</p>
              <p className="desc">{selectedArtwork.description}</p>
            </div>
          </div>

          <button className="nav-btn next" onClick={showNext}>›</button>
        </div>
      )}

      <style jsx>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
        @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          position: relative;
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
        }

        .masonry-item img {
          width: 100%;
          display: block;
          transition: transform 0.3s ease;
        }

        .masonry-item:hover img {
          transform: scale(1.02);
        }

        .artwork-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
        }
        
        .artwork-overlay h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
            font-weight: 500;
        }
        
        .artwork-overlay p {
            margin: 0;
            opacity: 0.9;
            font-size: 1rem;
        }

        .masonry-item:hover .artwork-overlay {
          opacity: 1;
        }

        .lightbox {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }
        
        .lightbox-content {
          background: var(--surface);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 4px;
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          margin: 0 3rem; /* Space for arrows */
        }
        
        @media(min-width: 768px) {
          .lightbox-content {
             grid-template-columns: 1.5fr 1fr;
          }
        }
        
        .lightbox-content img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: black;
          max-height: 60vh;
        }
        
        @media(min-width: 768px) {
          .lightbox-content img {
            max-height: 80vh;
          }
        }
        
        .info {
          padding: 2rem;
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10;
          line-height: 1;
        }

        .nav-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          font-size: 4rem;
          cursor: pointer;
          padding: 1rem;
          transition: color 0.2s;
          user-select: none;
          z-index: 1001;
        }
        
        .nav-btn:hover {
          color: white;
        }

        /* Mobile adjustments for nav */
        @media (max-width: 768px) {
            .lightbox { padding: 0.5rem; }
            .lightbox-content { margin: 0; grid-template-columns: 1fr; }
            .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); font-size: 3rem; background: rgba(0,0,0,0.3); border-radius: 50%; width: 50px; height: 50px; display: flex; alignItems: center; justifyContent: center; padding: 0; }
            .nav-btn.prev { left: 10px; }
            .nav-btn.next { right: 10px; }
        }
        
        .meta {
          color: #888;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .desc {
          line-height: 1.6;
          white-space: pre-wrap;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
