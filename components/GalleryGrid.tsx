"use client";

import { Artwork } from '@/lib/store';
import { useState, useEffect } from 'react';
import Image from 'next/image';

function parseDimensions(dimensionsStr: string | undefined): { width: number; height: number } {
  // Default fallback if parsing fails (landscape 4:3)
  const defaultDims = { width: 800, height: 600 };

  if (!dimensionsStr) return defaultDims;

  // Expected format: "H x W inches" e.g. "24 x 36 inches"
  const match = dimensionsStr.match(/([\d.]+)\s*x\s*([\d.]+)/);
  if (match) {
    const h = parseFloat(match[1]);
    const w = parseFloat(match[2]);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      // Scale up to provide good resolution
      // This preserves aspect ratio perfectly.
      return { width: Math.round(w * 100), height: Math.round(h * 100) };
    }
  }
  return defaultDims;
}

export default function GalleryGrid({ artworks }: { artworks: Artwork[] }) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  // Extract unique mediums and years
  const uniqueMediums = Array.from(new Set(artworks.map(a => a.medium))).sort();
  const uniqueYears = Array.from(
    new Set(artworks.map(a => new Date(a.date).getFullYear().toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a)); // Newest first

  // Filter artworks
  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMedium = selectedMedium === 'all' || artwork.medium === selectedMedium;
    const matchesYear = selectedYear === 'all' ||
      new Date(artwork.date).getFullYear().toString() === selectedYear;

    return matchesSearch && matchesMedium && matchesYear;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMedium('all');
    setSelectedYear('all');
    setShowMobileFilters(false); // Auto-collapse on mobile
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || selectedMedium !== 'all' || selectedYear !== 'all';


  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mobile-filter-toggle">
        <button
          onClick={() => {
            setShowMobileFilters(!showMobileFilters);
            // Scroll to top when opening filters so user can see them
            if (!showMobileFilters) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label="Toggle filters"
          style={{
            position: 'relative'
          }}
        >
          {/* SVG Magnifying Glass Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          {hasActiveFilters && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--foreground)',
              color: 'var(--background)',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 'bold'
            }}>
              {(searchQuery ? 1 : 0) + (selectedMedium !== 'all' ? 1 : 0) + (selectedYear !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        marginBottom: 'var(--spacing-md)',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}
        className={`filter-bar ${showMobileFilters ? 'show-mobile' : ''}`}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search artworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1 1 200px',
            padding: '0.75rem',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--foreground)',
            fontSize: '0.9rem',
            fontFamily: 'inherit'
          }}
        />

        {/* Medium Filter */}
        <select
          value={selectedMedium}
          onChange={(e) => setSelectedMedium(e.target.value)}
          style={{
            padding: '0.75rem',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--foreground)',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            minHeight: '44px',
            WebkitAppearance: 'none' as any,
            appearance: 'none',
            paddingRight: '2.5rem',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23888\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '12px',
            boxSizing: 'border-box' as any
          }}
        >
          <option value="all">All Mediums</option>
          {uniqueMediums.map(medium => (
            <option key={medium} value={medium}>{medium}</option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: '0.75rem',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            color: 'var(--foreground)',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            minHeight: '44px',
            WebkitAppearance: 'none' as any,
            appearance: 'none',
            paddingRight: '2.5rem',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23888\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '12px',
            boxSizing: 'border-box' as any
          }}
        >
          <option value="all">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-outline"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            Clear
          </button>
        )}

        {/* Result Count */}
        <div style={{
          marginLeft: 'auto',
          fontSize: '0.9rem',
          opacity: 0.7,
          whiteSpace: 'nowrap'
        }}>
          Showing {filteredArtworks.length} of {artworks.length}
        </div>
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
          {hasActiveFilters ? 'No artworks match your filters.' : 'No artworks found.'}
        </div>
      )}
      <div className="masonry-grid">
        {filteredArtworks.map((artwork) => (
          <div
            key={artwork.id}
            className="masonry-item"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              {...parseDimensions(artwork.dimensions)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
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
          <button className="nav-btn prev" onClick={showPrev} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedArtwork(null)}>×</button>
            <div className="lightbox-image-container">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                loading="eager"
              />
            </div>
            <div className="info">
              <h2>{selectedArtwork.title}</h2>
              <p className="meta">{selectedArtwork.medium} • {new Date(selectedArtwork.date).getFullYear()} • {selectedArtwork.dimensions}</p>
              <p className="desc">{selectedArtwork.description}</p>
            </div>
          </div>

          <button className="nav-btn next" onClick={showNext} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
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
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 4px;
          position: relative;
          display: flex;
          flex-direction: column;
          margin: 0 3rem; /* Space for arrows */
        }
        
        @media(min-width: 768px) {
          .lightbox-content {
             flex-direction: row;
          }
        }
        
        .lightbox-image-container {
          flex: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
          overflow: hidden;
          min-height: 0;
          min-width: 0;
          padding: 1rem;
        }
        
        .lightbox-content img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }
        
        .info {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          min-width: 0;
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
          cursor: pointer;
          padding: 1rem;
          transition: all 0.2s;
          user-select: none;
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-btn svg {
          width: 40px;
          height: 40px;
        }
        
        .nav-btn:hover {
          color: white;
          transform: scale(1.1);
        }

        /* Mobile adjustments for nav */
        @media (max-width: 768px) {
            .lightbox { padding: 0.5rem; }
            .lightbox-content { margin: 0; flex-direction: column; }
            
            .nav-btn { 
                position: absolute; 
                top: 50%; 
                transform: translateY(-50%); 
                background: rgba(0,0,0,0.5); 
                border-radius: 50%; 
                width: 44px; 
                height: 44px; 
                padding: 0;
                backdrop-filter: blur(4px);
            }
            .nav-btn svg {
                width: 24px;
                height: 24px;
            }
            .nav-btn:hover {
                background: rgba(0,0,0,0.7);
                transform: translateY(-50%) scale(1.05);
            }
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
