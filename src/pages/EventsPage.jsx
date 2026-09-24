import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Loader } from 'lucide-react';
import { fetchEvents, fetchUniqueBuildings, fetchUniqueFloors } from '../services/dataService';
import EventCard from '../components/EventCard';
import './EventsPage.css';

export default function EventsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState(null);
  const [floorFilter, setFloorFilter] = useState(null);

  // Async data
  const [events, setEvents] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floorNumbers, setFloorNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [evts, bldgs, flrs] = await Promise.all([
        fetchEvents(),
        fetchUniqueBuildings(),
        fetchUniqueFloors(),
      ]);
      if (!cancelled) {
        setEvents(evts);
        setBuildings(bldgs);
        setFloorNumbers(flrs);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        (event.category && event.category.toLowerCase().includes(search.toLowerCase())) ||
        event.room.toLowerCase().includes(search.toLowerCase());

      const matchesBuilding = !buildingFilter || event.building === buildingFilter;
      const matchesFloor = floorFilter === null || event.floor === floorFilter;

      return matchesSearch && matchesBuilding && matchesFloor;
    });
  }, [events, search, buildingFilter, floorFilter]);

  const clearFilters = () => {
    setSearch('');
    setBuildingFilter(null);
    setFloorFilter(null);
  };

  const hasActiveFilters = search || buildingFilter || floorFilter !== null;

  return (
    <div className="page page-enter events-page">
      {/* Header */}
      <header className="events-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')} aria-label="Go back to home">
          <ArrowLeft size={20} />
        </button>
        <h1 className="heading-lg">Select Event</h1>
        <div style={{ width: 40 }} /> {/* Spacer for alignment */}
      </header>

      {/* Search */}
      <div className="events-search-wrapper">
        <Search size={18} className="events-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="input events-search-input"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search events"
        />
        {search && (
          <button
            className="events-search-clear"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="events-filters">
        <div className="events-filter-row">
          <span className="text-label">Building</span>
          <div className="events-chip-group">
            {buildings.map((b) => (
              <button
                key={b}
                className={`chip ${buildingFilter === b ? 'chip-active' : ''}`}
                onClick={() => setBuildingFilter(buildingFilter === b ? null : b)}
                aria-pressed={buildingFilter === b}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="events-filter-row">
          <span className="text-label">Floor</span>
          <div className="events-chip-group">
            {floorNumbers.map((f) => (
              <button
                key={f}
                className={`chip ${floorFilter === f ? 'chip-active' : ''}`}
                onClick={() => setFloorFilter(floorFilter === f ? null : f)}
                aria-pressed={floorFilter === f}
              >
                Floor {f}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-ghost events-clear-filters" onClick={clearFilters}>
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="events-loading">
          <Loader size={24} className="events-spinner" />
          <p className="text-body">Loading events…</p>
        </div>
      ) : (
        <>
          <div className="events-list" role="list" aria-label="Events list">
            {filteredEvents.length === 0 ? (
              <div className="events-empty">
                <p className="heading-md">{hasActiveFilters && !search ? "Data unavailable" : "No events found"}</p>
                <p className="text-body">{hasActiveFilters && !search ? "Navigation data for this location has not been added yet." : "Try adjusting your search or filters."}</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} role="listitem">
                  <EventCard
                    event={event}
                    onClick={(id) => navigate(`/navigate/preview/${id}`)}
                  />
                </div>
              ))
            )}
          </div>

          <p className="events-count text-caption text-center mt-md">
            {filteredEvents.length} of {events.length} events
          </p>
        </>
      )}
    </div>
  );
}
