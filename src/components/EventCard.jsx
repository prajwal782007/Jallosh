import './EventCard.css';

const categoryBadgeClass = {
  Technical: 'badge-technical',
  Creative: 'badge-creative',
  Fun: 'badge-fun',
  Academic: 'badge-academic',
};

/**
 * Displays an event as a tappable card.
 */
export default function EventCard({ event, onClick }) {
  return (
    <button
      className="event-card card card-interactive"
      onClick={() => onClick(event.id)}
      aria-label={`Navigate to ${event.name} in ${event.room}, ${event.building}`}
    >
      <div className="event-card-header">
        <h3 className="event-card-title">{event.name}</h3>
        {event.category && (
          <span className={`badge ${categoryBadgeClass[event.category] || 'badge-technical'}`}>
            {event.category}
          </span>
        )}
      </div>

      <div className="event-card-meta">
        <span className="event-card-meta-item">
          🏛️ {event.building}
        </span>
        <span className="event-card-meta-item">
          📍 {event.room}
        </span>
        <span className="event-card-meta-item">
          🔼 Floor {event.floor}
        </span>
      </div>

      {event.time && (
        <p className="event-card-time">🕐 {event.time}</p>
      )}
    </button>
  );
}
