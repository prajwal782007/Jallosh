import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';
import { fetchEventById, fetchRouteForEvent } from '../services/dataService';
import NavigationImage from '../components/NavigationImage';
import DirectionArrow from '../components/DirectionArrow';
import ProgressIndicator from '../components/ProgressIndicator';
import InstructionCard from '../components/InstructionCard';
import './NavigationPage.css';

const STORAGE_KEY = 'jallosh_nav_state';

/** Persist navigation state to sessionStorage */
function saveNavState(eventId, step) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ eventId, step, ts: Date.now() }));
  } catch {
    // storage full or unavailable — silent fail
  }
}

/** Restore navigation state from sessionStorage */
function loadNavState(eventId) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // Only restore if same event and not stale (< 30 min)
    if (state.eventId === eventId && Date.now() - state.ts < 30 * 60 * 1000) {
      return state.step;
    }
  } catch {
    // corrupt data — ignore
  }
  return null;
}

function clearNavState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function NavigationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Async data loading
  const [event, setEvent] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [animDirection, setAnimDirection] = useState('forward'); // 'forward' | 'backward'

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
        // Restore saved step
        const savedStep = loadNavState(eventId);
        if (savedStep != null && rte && savedStep < rte.nodes.length) {
          setCurrentStep(savedStep);
        } else {
          setCurrentStep(0);
        }
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId]);

  const totalSteps = route?.nodes?.length ?? 0;
  const currentNode = route?.nodes?.[currentStep] ?? null;
  const isLastStep = currentStep >= totalSteps - 1;

  // Preload next images
  useEffect(() => {
    if (!route?.nodes) return;
    const nextNodes = route.nodes.slice(currentStep + 1, currentStep + 3);
    nextNodes.forEach(node => {
      if (node?.image) {
        const img = new Image();
        img.src = node.image;
      }
    });
  }, [currentStep, route]);

  // Persist step changes
  useEffect(() => {
    if (!loading && eventId && currentStep >= 0) {
      saveNavState(eventId, currentStep);
    }
  }, [eventId, currentStep, loading]);

  const goNext = useCallback(() => {
    if (isLastStep) {
      clearNavState();
      navigate(`/navigate/arrival/${eventId}`);
    } else {
      setAnimDirection('forward');
      setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    }
  }, [isLastStep, eventId, navigate, totalSteps]);

  const goPrev = useCallback(() => {
    setAnimDirection('backward');
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleExit = () => {
    clearNavState();
    navigate('/navigate/events');
  };

  // Keyboard navigation
  useEffect(() => {
    if (loading) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, loading]);

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="page page-enter nav-page">
        <div className="nav-loading">
          <Loader size={28} className="nav-spinner" />
          <p className="text-body">Preparing navigation…</p>
        </div>
      </div>
    );
  }

  // ── Error states ────────────────────────────────────────────
  if (!event) {
    return (
      <div className="page page-enter nav-page">
        <div className="nav-error">
          <p className="heading-md">Event not found</p>
          <p className="text-body">This event does not exist.</p>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/navigate/events')}>
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  if (!route || totalSteps === 0) {
    return (
      <div className="page page-enter nav-page">
        <div className="nav-error">
          <p className="heading-md">Route unavailable</p>
          <p className="text-body">Navigation route is currently unavailable for this event.</p>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/navigate/events')}>
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  // ── Main navigation UI ─────────────────────────────────────
  return (
    <div className="page page-enter nav-page">
      {/* Top bar */}
      <header className="nav-topbar">
        <button className="btn btn-ghost" onClick={() => setShowExitConfirm(true)} aria-label="Exit navigation">
          <X size={20} />
        </button>
        <div className="nav-topbar-location">
          {currentNode?.building && (
            <span className="nav-topbar-building">{currentNode.building}</span>
          )}
          {currentNode?.floor != null && (
            <span className="nav-topbar-floor">Floor {currentNode.floor}</span>
          )}
        </div>
        <div style={{ width: 40 }} />
      </header>

      {/* Progress */}
      <ProgressIndicator current={currentStep + 1} total={totalSteps} />

      {/* Photo + Arrow */}
      <div className="nav-photo-wrapper">
        <NavigationImage node={currentNode} animDirection={animDirection} />
        
        <div className="perspective-arrows-container">
          {!isLastStep && (
            <button 
              className="perspective-arrow arrow-forward" 
              onClick={goNext}
              aria-label="Next step"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          )}
          
          {currentStep > 0 && (
            <button 
              className="perspective-arrow arrow-backward" 
              onClick={goPrev}
              aria-label="Previous step"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          )}
        </div>

        {currentNode?.arrow && !isLastStep && (
          <DirectionArrow arrow={currentNode.arrow} onTap={goNext} />
        )}
      </div>

      {/* Instruction */}
      <InstructionCard node={currentNode} />

      {/* Controls */}
      <div className="nav-controls">
        <button
          className="btn btn-secondary nav-control-prev"
          onClick={goPrev}
          disabled={currentStep === 0}
          aria-label="Go to previous step"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <button
          className="btn btn-primary nav-control-next"
          onClick={goNext}
          aria-label={isLastStep ? `Arrive at ${event.name}` : 'Continue to next location'}
        >
          {isLastStep ? "I've Arrived" : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="nav-exit-overlay" onClick={() => setShowExitConfirm(false)} role="dialog" aria-modal="true" aria-label="Exit navigation confirmation">
          <div className="nav-exit-modal card" onClick={(e) => e.stopPropagation()}>
            <p className="heading-md">Exit Navigation?</p>
            <p className="text-body">Your progress will be saved for a short time.</p>
            <div className="nav-exit-actions">
              <button className="btn btn-secondary" onClick={() => setShowExitConfirm(false)}>
                Continue
              </button>
              <button className="btn btn-primary" onClick={handleExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
