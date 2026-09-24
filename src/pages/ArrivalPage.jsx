import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, Layers, DoorOpen, RotateCcw, ListChecks, Loader } from 'lucide-react';
import { fetchEventById } from '../services/dataService';
import './ArrivalPage.css';

export default function ArrivalPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const evt = await fetchEventById(eventId);
      if (!cancelled) {
        setEvent(evt);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId]);

  if (loading) {
    return (
      <div className="page page-enter arrival-page">
        <div className="arrival-loading">
          <Loader size={24} className="arrival-spinner" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page page-enter arrival-page">
        <div className="arrival-error">
          <p className="heading-md">Event not found</p>
          <Link to="/navigate/events" className="btn btn-primary mt-lg">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-enter arrival-page">
      <div className="arrival-content">
        {/* Celebration */}
        <div className="arrival-celebration" aria-hidden="true">
          <span className="arrival-emoji">🎉</span>
        </div>

        <h1 className="heading-xl arrival-title">You've Arrived!</h1>

        <div className="arrival-event-card card">
          <h2 className="heading-lg">{event.name}</h2>
          <div className="arrival-meta">
            <span className="arrival-meta-item">
              <Building2 size={16} />
              {event.building}
            </span>
            <span className="arrival-meta-item">
              <Layers size={16} />
              Floor {event.floor}
            </span>
            <span className="arrival-meta-item">
              <DoorOpen size={16} />
              {event.room}
            </span>
          </div>
          {event.time && (
            <p className="arrival-time">🕐 {event.time}</p>
          )}
        </div>

        {/* Actions */}
        <div className="arrival-actions">
          <Link
            to="/navigate/events"
            className="btn btn-primary btn-lg btn-block"
            aria-label="Go back to event list"
          >
            <ListChecks size={20} />
            Back to Events
          </Link>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate(`/navigate/navigation/${eventId}`)}
            aria-label="Navigate to this event again"
          >
            <RotateCcw size={18} />
            Navigate Again
          </button>
        </div>
      </div>
    </div>
  );
}
