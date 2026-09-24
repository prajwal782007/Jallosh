import { useEffect, useState } from 'react';
import './NavigationImage.css';

/**
 * Displays a navigation photograph with a fallback placeholder.
 * Handles Street View style zoom transitions.
 */
export default function NavigationImage({ node, animDirection, className = '' }) {
  const [currentImage, setCurrentImage] = useState(node?.image);
  const [prevImage, setPrevImage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (node?.image && node.image !== currentImage) {
      setPrevImage(currentImage);
      setCurrentImage(node.image);
      setIsAnimating(true);
      setHasError(false);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevImage(null);
      }, 600); // matches CSS animation duration
      
      return () => clearTimeout(timer);
    }
  }, [node?.image, currentImage]);

  const nodeTypeLabels = {
    GATE: '🚪 Gate',
    ENTRANCE: '🏛️ Entrance',
    CORRIDOR: '🚶 Corridor',
    JUNCTION: '🔀 Junction',
    STAIRCASE: '🪜 Staircase',
    LANDING: '📍 Landing',
    ROOM: '📌 Room',
  };

  const nodeTypeIcons = {
    GATE: '🚪',
    ENTRANCE: '🏛️',
    CORRIDOR: '🚶',
    JUNCTION: '🔀',
    STAIRCASE: '🪜',
    LANDING: '📍',
    ROOM: '📌',
  };

  if (!currentImage || hasError) {
    return (
      <div className={`nav-image-container nav-image-fallback ${className}`} role="img" aria-label={node?.name || 'Navigation location'}>
        <div className="nav-image-fallback-content">
          <span className="nav-image-fallback-icon">{nodeTypeIcons[node?.nodeType] || '📍'}</span>
          <span className="nav-image-fallback-label">{hasError ? 'Image unavailable' : (node?.name || 'Unknown location')}</span>
          <span className="nav-image-fallback-type">{nodeTypeLabels[node?.nodeType] || node?.nodeType}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`nav-image-container ${className}`}>
      {/* New Image (Bottom) */}
      <img
        src={currentImage}
        alt={node?.name || 'Navigation photograph'}
        className="nav-image new-image"
        onError={() => setHasError(true)}
      />

      {/* Old Image (Top) fading out and zooming */}
      {isAnimating && prevImage && (
        <img
          key={prevImage}
          src={prevImage}
          alt="Previous photograph"
          className={`nav-image prev-image animate-${animDirection}`}
        />
      )}
    </div>
  );
}
