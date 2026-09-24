import './InstructionCard.css';

/**
 * Displays a navigation instruction with optional floor-change callout.
 */
export default function InstructionCard({ node }) {
  const isFloorChange = node?.nodeType === 'STAIRCASE' || node?.floorChange;

  if (!isFloorChange && !node?.instruction && !node?.description) {
    return null;
  }

  return (
    <div className={`instruction-card ${isFloorChange ? 'instruction-card-floor-change' : ''}`}>
      {isFloorChange && node.floorChange && (
        <div className="instruction-floor-badge">
          <span className="instruction-floor-badge-icon">🪜</span>
          <span className="instruction-floor-badge-text">
            Floor Change — Go to Floor {node.floorChange.to}
          </span>
        </div>
      )}

      {node?.instruction && (
        <p className="instruction-text">{node.instruction}</p>
      )}

      {node?.description && (
        <p className="instruction-description">{node.description}</p>
      )}
    </div>
  );
}
