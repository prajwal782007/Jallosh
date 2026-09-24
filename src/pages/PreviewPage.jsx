import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Building2, Layers, DoorOpen, Navigation2, Loader } from 'lucide-react';
import { fetchEventById, fetchRouteForEvent } from '../services/dataService';
import './PreviewPage.css';

export default function PreviewPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [evt, rte] = await Promise.all([
        fetchEventById(eventId),
        fetchRouteForEvent(eventId),
      ]);
      if (!cancelled) {
        setEvent(evt);
        setRoute(rte);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId]);

  // Loading
  if (loading) {
    return (
      <div className="page page-enter preview-page">
        <header className="preview-header">
          <button className="btn btn-ghost" onClick={() => navigate('/navigate/events')} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading-lg">Route Preview</h1>
          <div style={{ width: 40 }} />
        </header>
        <div className="preview-loading">
          <Loader size={24} className="preview-spinner" />
          <p className="text-body">Loading route…</p>
        </div>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="page page-enter preview-page">
        <header className="preview-header">
          <button className="btn btn-ghost" onClick={() => navigate('/navigate/events')} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading-lg">Not Found</h1>
          <div style={{ width: 40 }} />
        </header>
        <div className="preview-error">
          <p className="heading-md">Event not found</p>
          <p className="text-body">The event you are looking for does not exist.</p>
          <Link to="/navigate/events" className="btn btn-primary mt-lg">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  // Route unavailable
  if (!route) {
    return (
      <div className="page page-enter preview-page">
        <header className="preview-header">
          <button className="btn btn-ghost" onClick={() => navigate('/navigate/events')} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading-lg">Route Preview</h1>
          <div style={{ width: 40 }} />
        </header>

        <div className="preview-event-info card">
          <h2 className="heading-lg">{event.name}</h2>
          <div className="preview-meta">
            <span className="preview-meta-item"><Building2 size={16} /> {event.building}</span>
            <span className="preview-meta-item"><Layers size={16} /> Floor {event.floor}</span>
            <span className="preview-meta-item"><DoorOpen size={16} /> {event.room}</span>
          </div>
        </div>

        <div className="preview-error">
          <p className="heading-md">🚧 Route Unavailable</p>
          <p className="text-body">Navigation route is currently unavailable for this event. Please check back later or ask a volunteer for directions.</p>
          <button className="btn btn-secondary mt-lg" onClick={() => navigate('/navigate/events')}>
            Browse Other Events
          </button>
        </div>
      </div>
    );
  }

  // Build condensed route preview (show key waypoints)
  const routePreviewSteps = route.previewSteps || route.nodes.map((node) => ({
    name: node.name,
    type: node.nodeType,
    isFloorChange: node.nodeType === 'STAIRCASE',
  }));

  return (
    <div className="page page-enter preview-page">
      {/* Header */}
      <header className="preview-header">
        <button className="btn btn-ghost" onClick={() => navigate('/navigate/events')} aria-label="Go back to events">
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading-lg">Route Preview</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Event info */}
      <div className="preview-event-info card">
        <h2 className="heading-lg">{event.name}</h2>
        <div className="preview-meta">
          <span className="preview-meta-item"><Building2 size={16} /> {event.building}</span>
          <span className="preview-meta-item"><Layers size={16} /> Floor {event.floor}</span>
          <span className="preview-meta-item"><DoorOpen size={16} /> {event.room}</span>
          <span className="preview-meta-item"><Clock size={16} /> ~{route.estimatedMinutes} min walk</span>
        </div>
        {event.description && (
          <p className="text-body mt-sm">{event.description}</p>
        )}
      </div>

      {/* Route steps */}
      <div className="preview-route">
        <h3 className="text-label mb-md">Route Overview</h3>
        <ol className="preview-route-list">
          {routePreviewSteps.map((step, i) => (
            <li key={i} className={`preview-route-step ${step.isFloorChange ? 'preview-route-step-floor' : ''}`}>
              <div className="preview-route-dot" aria-hidden="true">
                {i === 0 && <span className="preview-route-dot-start" />}
                {i === routePreviewSteps.length - 1 && <span className="preview-route-dot-end" />}
                {i > 0 && i < routePreviewSteps.length - 1 && <span className="preview-route-dot-mid" />}
              </div>
              {i < routePreviewSteps.length - 1 && (
                <div className="preview-route-line" aria-hidden="true" />
              )}
              <span className="preview-route-name">
                {step.isFloorChange && '🪜 '}
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-lg btn-block preview-start-btn"
        onClick={() => navigate(`/navigate/navigation/${eventId}`)}
        aria-label={`Start navigation to ${event.name}`}
      >
        <Navigation2 size={20} />
        Start Navigation
      </button>
    </div>
  );
}
