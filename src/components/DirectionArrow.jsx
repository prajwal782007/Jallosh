import './DirectionArrow.css';

/**
 * Renders a directional arrow overlay positioned with percentage-based coordinates.
 * The arrow is a tappable button that triggers navigation to the next node.
 */
export default function DirectionArrow({ arrow, onTap, disabled = false }) {
  if (!arrow) return null;

  const arrowSymbols = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    'up-right': '↗',
    'up-left': '↖',
    'down-right': '↘',
    'down-left': '↙',
  };

  const arrowRotations = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
    'up-right': -45,
    'up-left': -135,
    'down-right': 45,
    'down-left': 135,
  };

  const symbol = arrowSymbols[arrow.direction] || '→';
  const rotation = arrowRotations[arrow.direction] ?? 0;

  return (
    <button
      className={`direction-arrow ${disabled ? 'direction-arrow-disabled' : ''}`}
      style={{
        left: `${arrow.x}%`,
        top: `${arrow.y}%`,
      }}
      onClick={onTap}
      disabled={disabled}
      aria-label={`Navigate ${arrow.direction}. Tap to continue.`}
      title={`Go ${arrow.direction}`}
    >
      <span
        className="direction-arrow-icon"
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-hidden="true"
      >
        ➤
      </span>
      <span className="direction-arrow-pulse" aria-hidden="true" />
    </button>
  );
}
