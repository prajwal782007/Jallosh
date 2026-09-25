# JALLOSH 2026 — VISUAL INDOOR NAVIGATION SYSTEM

## 1. PROJECT OVERVIEW

Build a mobile-first web application for Jallosh 2026, a college event expected to have approximately 1,000–2,000 visitors.

The college contains:

- 3 buildings
- Approximately 4 floors per building
- Approximately 5–7 events/classes per floor
- Many classrooms and event locations

Visitors will scan a QR code placed at the college entrance/gate.

The QR code opens the Jallosh navigation website.

The visitor:

1. Scans QR code
2. Opens Jallosh website
3. Selects the event they want to attend
4. System identifies the destination
5. System generates/selects the appropriate route
6. Navigation starts
7. User sees real photographs of the college
8. Direction arrows are displayed over the photographs
9. User clicks/taps the arrow to move to the next navigation point
10. At turns/intersections, the interface gives the appropriate direction
11. User eventually reaches the destination
12. Show an arrival screen

This is NOT GPS navigation.

This is a PHOTO-BASED INDOOR VISUAL NAVIGATION SYSTEM.

The system should use predefined navigation nodes and routes.

---

# 2. CORE CONCEPT

The college will be represented as a navigation graph.

A navigation node represents a physical point/location.

Examples:

- Main Gate
- Building A Entrance
- Building A Corridor 1
- Building A Junction 1
- Building A Staircase 1
- Building A Floor 2 Landing
- Building A Floor 2 Corridor
- Classroom A204

Connections between nodes represent possible movement.

Example:

Main Gate
    ↓
Building A Entrance
    ↓
Main Corridor
    ↓
Junction 1
    ↓
Staircase
    ↓
Floor 2
    ↓
Floor 2 Corridor
    ↓
Room A204

Each node can have:

- Photograph
- Building
- Floor
- Location name
- Instruction
- Available outgoing directions

The frontend displays the photograph and overlays navigation controls on it.

---

# 3. IMPORTANT DEVELOPMENT RULE

Do NOT attempt to build the entire system in one step.

Implement the project in phases.

After completing each phase:

1. Run the application
2. Test the feature
3. Fix errors
4. Only then continue to the next phase

Do not create fake functionality that appears to work but is not connected to the backend.

Do not hardcode event-specific logic into React components.

Keep the system data-driven.

---

# 4. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change it.

## Frontend

- React
- Vite
- JavaScript or TypeScript
- React Router
- CSS / modern responsive CSS
- Lucide React or another lightweight icon library

## Backend

Use Supabase.

Supabase should provide:

- PostgreSQL database
- Authentication for admin users
- Storage for navigation images
- Row Level Security
- API access

## Hosting

Frontend should be deployable to:

- Netlify
OR
- Vercel

The application must work properly on mobile browsers.

---

# 5. PROJECT STRUCTURE

Use a clean structure similar to:

src/
│
├── components/
│   ├── common/
│   ├── navigation/
│   ├── events/
│   └── admin/
│
├── pages/
│   ├── Home.jsx
│   ├── EventSelection.jsx
│   ├── RoutePreview.jsx
│   ├── Navigation.jsx
│   ├── Arrival.jsx
│   ├── admin/
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Events.jsx
│   │   ├── Nodes.jsx
│   │   ├── Routes.jsx
│   │   └── Settings.jsx
│
├── services/
│   ├── supabase.js
│   ├── events.js
│   ├── navigation.js
│   ├── nodes.js
│   └── storage.js
│
├── hooks/
│
├── utils/
│   ├── routeUtils.js
│   └── navigationUtils.js
│
├── styles/
│
├── App.jsx
└── main.jsx

public/
└── assets/

.env    