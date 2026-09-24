# JALLOSH 2026 — Visual Navigation Image Structure

This document outlines the folder structure and naming conventions for the visual indoor navigation system.

## Folder Structure

All navigation and event images are stored within the `public/navigation/` directory.

The hierarchy follows:
`Building -> Floor -> Category`

```text
public/navigation/
├── building-a/
│   ├── floor-0/
│   │   ├── navigation/
│   │   ├── events/
│   │   └── special/
│   ├── floor-1/
│   │   ├── navigation/
│   │   ├── events/
│   │   └── special/
│   ├── floor-2/
│   │   ├── navigation/
│   │   ├── events/
│   │   └── special/
│   └── floor-3/
│       ├── navigation/
│       ├── events/
│       └── special/
├── building-b/
│   └── ... (same floor structure)
└── building-c/
    └── ... (same floor structure)
```

### Folder Categories
- **`navigation/`**: Sequential photos taken along the physical walking routes.
- **`events/`**: Photos of specific event destinations (rooms, labs, etc.).
- **`special/`**: Photos of significant structural landmarks (entrances, stairs, lifts, junctions).

## File Naming Conventions

All images MUST be in lowercase `.jpg` format.

The naming follows a strict pattern using identifiers for Building (`B`), Floor (`F`), and Image Type (`N`, `E`, `S`).

### 1. Navigation Images (`N`)
Format: `B-{BUILDING}-F-{FLOOR}-N-{SEQUENCE}.jpg`

These are sequential photos of the route. Ideally, one photo is taken approximately every 6 feet of forward movement (the "6-foot rule").
*Note: Do not force the 6-foot rule at turns, stairs, or intersections; capture where the direction is visually clear.*

**Examples:**
- `B-A-F-0-N-001.jpg` (Building A, Floor 0, Route Photo 1)
- `B-A-F-0-N-002.jpg` (Building A, Floor 0, Route Photo 2)
- `B-B-F-1-N-001.jpg` (Building B, Floor 1, Route Photo 1)

### 2. Event Images (`E`)
Format: `B-{BUILDING}-F-{FLOOR}-E-{EVENT_NUMBER}.jpg`

These are photos of the final event destination rooms.

**Examples:**
- `B-A-F-0-E-1.jpg` (Building A, Floor 0, Event 1)
- `B-A-F-1-E-2.jpg` (Building A, Floor 1, Event 2)
- `B-C-F-3-E-6.jpg` (Building C, Floor 3, Event 6)

### 3. Special Images (`S`)
Format: `B-{BUILDING}-F-{FLOOR}-S-{SEQUENCE}.jpg`

These are photos of major landmarks (entrances, junctions, staircases, lifts).

**Examples:**
- `B-A-F-0-S-001.jpg` (Building A Floor 0 main entrance)
- `B-A-F-0-S-002.jpg` (Building A Floor 0 staircase)
- `B-A-F-0-S-003.jpg` (Building A Floor 0 junction)
