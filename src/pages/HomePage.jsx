import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, QrCode, ListChecks, Navigation2 } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter home-page">
      {/* Hero */}
      <header className="home-hero">
        <div className="home-hero-badge">
          <span>🎪</span>
          <span>College Tech Fest</span>
        </div>

        <h1 className="heading-xl home-title">
          JALLOSH<span className="home-title-year">2026</span>
        </h1>

        <p className="home-tagline heading-md">Find Your Event</p>

        <p className="text-body home-description">
          Navigate through the campus using visual directions.
          No maps needed — just follow the photos.
        </p>

        <button
          className="btn btn-primary btn-lg btn-block home-cta"
          onClick={() => navigate('/navigate/events')}
          aria-label="Start navigation to find events"
        >
          <Navigation2 size={20} />
          Start Navigation
          <ArrowRight size={18} />
        </button>
      </header>

      {/* How it works */}
      <section className="home-how" aria-labelledby="how-it-works">
        <h2 className="text-label mb-md" id="how-it-works">How it works</h2>

        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-icon">
              <QrCode size={22} />
            </div>
            <div className="home-step-content">
              <h3 className="heading-md">Scan</h3>
              <p className="text-caption">Scan any QR code on campus or open the website.</p>
            </div>
          </div>

          <div className="home-step-divider" aria-hidden="true" />

          <div className="home-step">
            <div className="home-step-icon">
              <ListChecks size={22} />
            </div>
            <div className="home-step-content">
              <h3 className="heading-md">Select</h3>
              <p className="text-caption">Choose the event you want to attend.</p>
            </div>
          </div>

          <div className="home-step-divider" aria-hidden="true" />

          <div className="home-step">
            <div className="home-step-icon">
              <MapPin size={22} />
            </div>
            <div className="home-step-content">
              <h3 className="heading-md">Navigate</h3>
              <p className="text-caption">Follow the photo-based directions step by step.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
