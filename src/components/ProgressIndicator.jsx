import './ProgressIndicator.css';

/**
 * Horizontal progress indicator showing current step / total steps.
 */
export default function ProgressIndicator({ current, total }) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="progress-indicator" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${current} of ${total}`}>
      <div className="progress-indicator-header">
        <span className="text-label">Step {current} of {total}</span>
        <span className="text-caption">{Math.round(pct)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
