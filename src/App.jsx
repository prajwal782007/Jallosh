import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import PreviewPage from './pages/PreviewPage';
import NavigationPage from './pages/NavigationPage';
import ArrivalPage from './pages/ArrivalPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navigate/events" element={<EventsPage />} />
          <Route path="/navigate/preview/:eventId" element={<PreviewPage />} />
          <Route path="/navigate/navigation/:eventId" element={<NavigationPage />} />
          <Route path="/navigate/arrival/:eventId" element={<ArrivalPage />} />
          {/* Catch-all: redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
