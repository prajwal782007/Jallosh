# Jallosh 2026 - Events-First Backend Implementation

## New User Flow (Events-First Discovery)

```
User scans QR code
        ↓
Home screen: "Find your event"
        ↓
Tap "Find an Event"
        ↓
ALL EVENTS list with search bar
(Shows: Event Name, Building, Floor)
        ↓
Search for event by name
(e.g., type "natya" → Natya Sangit appears)
        ↓
Tap event → Route Preview
(Shows: This event is in Building A, Floor 2)
        ↓
"Start Navigation"
        ↓
Visual image-by-image guide to the event
        ↓
"You've arrived at Natya Sangit"
```

**Key difference:** Users never select a building or floor. They only search for and select events. The building/floor information is discovered automatically.

---

## Why This Works Better

✅ Most visitors know the **event name** they want  
✅ Fewer clicks to reach event (direct search)  
✅ No confusion about which building  
✅ Scalable (works when you add more buildings/events)  
✅ Mobile-friendly (search is faster than navigation)  

---

## Backend API Requirements

Your agent must implement **4 core functions** (simplified from 6):

### 1. GET_ALL_EVENTS()

**Purpose:** Get every event across all buildings/floors in one list.

**Call:**
```javascript
const response = await GET_ALL_EVENTS();
```

**Returns:**
```json
{
  "events": [
    {
      "id": "E-1",
      "name": "Talvad Vadan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "A classical music performance",
      "locationPath": "building-a/floor-2/E-1"
    },
    {
      "id": "E-2",
      "name": "Swarvadh Vadan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Vocal performance showcase",
      "locationPath": "building-a/floor-2/E-2"
    },
    {
      "id": "E-3",
      "name": "Natya Sangit",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Dance and music fusion",
      "locationPath": "building-a/floor-2/E-3"
    },
    {
      "id": "E-4",
      "name": "Shastriya Gayan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Classical vocal training demonstration",
      "locationPath": "building-a/floor-2/E-4"
    },
    {
      "id": "E-5",
      "name": "Vadvivad",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Debate and discussion forum",
      "locationPath": "building-a/floor-2/E-5"
    },
    {
      "id": "E-6",
      "name": "Prashnamanjusha",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Question and answer session",
      "locationPath": "building-a/floor-2/E-6"
    }
  ],
  "totalEvents": 6
}
```

**Important:**
- Include ALL events from all buildings/floors
- Must include `buildingId`, `buildingName`, `floorNumber`
- User doesn't need to know building/floor upfront - they discover it via event search
- Return empty array if no events available yet
- Add optional `description` field (nice to have, not required)

---

### 2. SEARCH_EVENTS(query)

**Purpose:** Filter all events by name (case-insensitive substring match).

**Call:**
```javascript
const response = await SEARCH_EVENTS('natya');
```

**Returns:**
```json
{
  "events": [
    {
      "id": "E-3",
      "name": "Natya Sangit",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Dance and music fusion",
      "locationPath": "building-a/floor-2/E-3"
    }
  ],
  "totalEvents": 1
}
```

**Important:**
- Called as user types (real-time filtering)
- Search across event NAMES only
- Case-insensitive
- Return all matching events (even if from different buildings)
- Empty array if no matches

---

### 3. GET_NAVIGATION_SEQUENCE(eventId, buildingId, floorNumber)

**Purpose:** Get the image sequence to navigate from venue entrance to specific event.

**Call:**
```javascript
const response = await GET_NAVIGATION_SEQUENCE('E-3', 'A', 2);
```

**Returns:**
```json
{
  "eventId": "E-3",
  "eventName": "Natya Sangit",
  "buildingId": "A",
  "buildingName": "Building A",
  "floorNumber": 2,
  "sequence": [
    {
      "type": "building",
      "step": 1,
      "label": "Building A Entrance",
      "instruction": "Enter through the main gate",
      "imagePath": "public/navigation/building-a/common/entrance.webp"
    },
    {
      "type": "building",
      "step": 2,
      "label": "Building A Corridor",
      "instruction": "Walk straight through the corridor",
      "imagePath": "public/navigation/building-a/common/corridor.webp"
    },
    {
      "type": "floor",
      "step": 3,
      "label": "Floor 2 Staircase",
      "instruction": "Take the stairs to Floor 2",
      "imagePath": "public/navigation/building-a/floor-2/common/stairs.webp"
    },
    {
      "type": "floor",
      "step": 4,
      "label": "Floor 2 Main Hall",
      "instruction": "Enter the main hall on your left",
      "imagePath": "public/navigation/building-a/floor-2/common/hall.webp"
    },
    {
      "type": "event",
      "step": 5,
      "label": "Event Area",
      "instruction": "Event area is ahead",
      "imagePath": "public/navigation/building-a/floor-2/events/E-3/area.webp"
    },
    {
      "type": "event",
      "step": 6,
      "label": "Event Entrance",
      "instruction": "You've arrived! Enter here",
      "imagePath": "public/navigation/building-a/floor-2/events/E-3/entrance.webp"
    }
  ],
  "totalSteps": 6
}
```

**Important:**
- `type` must be "building", "floor", or "event"
- Return images in **walking order** (building common → floor common → event specific)
- `label`: Human-readable description of the photo
- `instruction`: Optional walking guidance (nice to have)
- `imagePath`: Relative path to image file (WebP format)
- Common images stored in:
  - `building-X/common/` (all events in this building use these)
  - `building-X/floor-Y/common/` (all events on this floor use these)
- Event-specific images in:
  - `building-X/floor-Y/events/EVENT-ID/`

---

### 4. GET_IMAGE(imagePath)

**Purpose:** Serve the actual image file during navigation.

**Call:**
```javascript
const imageUrl = await GET_IMAGE('public/navigation/building-a/common/entrance.webp');
```

**Returns:**
```
URL to WebP image or base64 encoded data
```

**Implementation Options:**

**Option A - Static file serving:**
```
GET /public/navigation/building-a/common/entrance.webp
Response: image/webp binary data
```

**Option B - Base64 response:**
```json
{
  "imageData": "data:image/webp;base64,UklGRiYAAABXRUJQ..."
}
```

**Requirements:**
- Use WebP format (smaller file size, faster loading)
- Implement HTTP caching headers (images rarely change)
- Lazy load images (preload next image while current displays)
- Fallback to JPEG if WebP not supported (but WebP is supported on all modern browsers)
- Images should be < 100KB each

---

## Current Data Structure

### Building A, Floor 2 (6 Events)

```
Talvad Vadan (E-1)
├── Images: building-a/floor-2/events/E-1/
└── Also uses: building-a/common/*, building-a/floor-2/common/*

Swarvadh Vadan (E-2)
├── Images: building-a/floor-2/events/E-2/
└── Also uses: building-a/common/*, building-a/floor-2/common/*

Natya Sangit (E-3)
├── Images: building-a/floor-2/events/E-3/
└── Also uses: building-a/common/*, building-a/floor-2/common/*

Shastriya Gayan (E-4)
├── Images: building-a/floor-2/events/E-4/
└── Also uses: building-a/common/*, building-a/floor-2/common/*

Vadvivad (E-5)
├── Images: building-a/floor-2/events/E-5/
└── Also uses: building-a/common/*, building-a/floor-2/common/*

Prashnamanjusha (E-6)
├── Images: building-a/floor-2/events/E-6/
└── Also uses: building-a/common/*, building-a/floor-2/common/*
```

### Other Buildings/Floors (No Data Yet)
- Building B → Mark as unavailable
- Building C → Mark as unavailable
- Building A Floor 0 → No events
- Building A Floor 1 → No events
- Building A Floor 3 → No events

---

## File Organization

```
public/
└── navigation/
    └── building-a/
        ├── common/                    [Shared by ALL events in Building A]
        │   ├── entrance.webp          (~50KB)
        │   ├── corridor.webp          (~60KB)
        │   └── exit.webp              (~55KB)
        │
        └── floor-2/
            ├── common/                [Shared by ALL events on Floor 2]
            │   ├── stairs.webp        (~70KB)
            │   ├── hall.webp          (~75KB)
            │   └── corridor.webp      (~65KB)
            │
            └── events/
                ├── E-1/               [Talvad Vadan - specific images]
                │   ├── area.webp      (~80KB)
                │   └── entrance.webp  (~85KB)
                │
                ├── E-2/               [Swarvadh Vadan - specific images]
                │   ├── area.webp      (~80KB)
                │   └── entrance.webp  (~85KB)
                │
                ├── E-3/               [Natya Sangit - specific images]
                │   ├── area.webp      (~80KB)
                │   └── entrance.webp  (~85KB)
                │
                ├── E-4/               [Shastriya Gayan - specific images]
                │   ├── area.webp      (~80KB)
                │   └── entrance.webp  (~85KB)
                │
                ├── E-5/               [Vadvivad - specific images]
                │   ├── area.webp      (~80KB)
                │   └── entrance.webp  (~85KB)
                │
                └── E-6/               [Prashnamanjusha - specific images]
                    ├── area.webp      (~80KB)
                    └── entrance.webp  (~85KB)
```

**CRITICAL RULE:** Do NOT duplicate common images. Each common image is referenced, not copied.

Total unique images needed:
- `building-a/common/`: 3 images
- `building-a/floor-2/common/`: 3 images
- `building-a/floor-2/events/E-1/`: 2 images
- `building-a/floor-2/events/E-2/`: 2 images
- `building-a/floor-2/events/E-3/`: 2 images
- `building-a/floor-2/events/E-4/`: 2 images
- `building-a/floor-2/events/E-5/`: 2 images
- `building-a/floor-2/events/E-6/`: 2 images

**Total: 21 unique images** (not 36, because common images are shared)

---

## Frontend Flow (What Your Agent Enables)

### Screen 1: Home
```
[Jallosh 2026 Header]
✨

Find your event

[Find an Event Button]
```

### Screen 2: Events List + Search (NEW FLOW)
```
[← Back]
[Search... 🔍] ← User searches for event

Results:
┌─────────────────────────┐
│ Talvad Vadan            │
│ 📍 Building A • Floor 2 │
└─────────────────────────┘

┌─────────────────────────┐
│ Natya Sangit            │ ← User can find by typing "natya"
│ 📍 Building A • Floor 2 │
└─────────────────────────┘

(... more events)
```

### Screen 3: Route Preview
```
Natya Sangit

📍 Building A • Floor 2

Your route:
  1 → Building A
  2 → Floor 2
  3 → Natya Sangit

[Start Navigation]
```

### Screen 4: Visual Navigation
```
[← Back] Floor 2 [3/6]

[Photo Area - building corridor image]
            ↓

[Back] [Continue]
```

### Screen 5: Arrival
```
✓

You've arrived

Natya Sangit

📍 Building A • Floor 2

[Back to Events]
```

---

## Implementation Guide

### Step 1: Database Structure

Your data needs to support:
```
EVENTS table:
  id (E-1, E-2, etc.)
  name (Talvad Vadan, etc.)
  building_id (A, B, C)
  floor_number (0, 1, 2, 3)
  description (optional)
  
NAVIGATION_IMAGES table:
  event_id (E-1, E-2, etc.)
  sequence_order (1, 2, 3, ...)
  image_type (building, floor, event)
  image_path (public/navigation/...)
  label (Building A Entrance, etc.)
  instruction (optional)
```

### Step 2: Implement Functions

**Example Node.js/Express:**

```javascript
// 1. GET_ALL_EVENTS
app.get('/api/events/all', async (req, res) => {
  const events = await db.query(`
    SELECT 
      id, 
      name, 
      building_id as buildingId,
      building_name as buildingName,
      floor_number as floorNumber,
      description,
      location_path as locationPath
    FROM events
    WHERE available = true
    ORDER BY building_id, floor_number, name
  `);
  
  res.json({ events, totalEvents: events.length });
});

// 2. SEARCH_EVENTS
app.get('/api/events/search', async (req, res) => {
  const { q } = req.query;
  const events = await db.query(`
    SELECT 
      id, 
      name, 
      building_id as buildingId,
      building_name as buildingName,
      floor_number as floorNumber,
      description,
      location_path as locationPath
    FROM events
    WHERE available = true 
    AND LOWER(name) LIKE LOWER(?)
    ORDER BY building_id, floor_number, name
  `, [`%${q}%`]);
  
  res.json({ events, totalEvents: events.length });
});

// 3. GET_NAVIGATION_SEQUENCE
app.get('/api/navigation/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const event = await db.query(`
    SELECT id, name, building_id, building_name, floor_number
    FROM events
    WHERE id = ?
  `, [eventId]);
  
  const sequence = await db.query(`
    SELECT 
      type, 
      step,
      label,
      instruction,
      image_path as imagePath
    FROM navigation_images
    WHERE event_id = ?
    ORDER BY step ASC
  `, [eventId]);
  
  res.json({
    eventId: event.id,
    eventName: event.name,
    buildingId: event.building_id,
    buildingName: event.building_name,
    floorNumber: event.floor_number,
    sequence,
    totalSteps: sequence.length
  });
});

// 4. GET_IMAGE
app.get('/public/navigation/*', (req, res) => {
  const filePath = req.params[0];
  res.sendFile(path.join(__dirname, 'public', 'navigation', filePath), {
    headers: {
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Content-Type': 'image/webp'
    }
  });
});
```

### Step 3: Connect Frontend

In `jallosh-premium.html`, replace mock functions:

**Before (Mock):**
```javascript
this.mockData = {
    buildings: [...],
    floors: {...},
    events: {...}
};
```

**After (Real API):**
```javascript
async init() {
    try {
        const response = await fetch('/api/events/all');
        const data = await response.json();
        this.state.events = data.events;
        this.render();
    } catch (error) {
        console.error('Failed to load events:', error);
    }
}

async searchEvents(query) {
    try {
        const response = await fetch(`/api/events/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        this.setState({ events: data.events, searchQuery: query });
    } catch (error) {
        console.error('Search failed:', error);
    }
}

async loadNavigationSequence(eventId) {
    try {
        const response = await fetch(`/api/navigation/${eventId}`);
        const data = await response.json();
        this.setState({ navigationSequence: data.sequence });
    } catch (error) {
        console.error('Failed to load navigation:', error);
    }
}
```

---

## Testing Checklist

### API Testing
- [ ] GET_ALL_EVENTS returns 6 events
- [ ] All events have buildingId, buildingName, floorNumber
- [ ] SEARCH_EVENTS('natya') returns only Natya Sangit
- [ ] SEARCH_EVENTS('sangit') also returns Natya Sangit
- [ ] SEARCH_EVENTS('xyz') returns empty array
- [ ] GET_NAVIGATION_SEQUENCE('E-3', 'A', 2) returns 6 images
- [ ] Images are in correct walking order
- [ ] GET_IMAGE returns actual image file

### Frontend Integration
- [ ] Open app → tap "Find an Event"
- [ ] See all 6 events listed
- [ ] Search bar works (type "natya" → shows only Natya Sangit)
- [ ] Tap event → shows route preview
- [ ] Tap "Start Navigation" → shows first image
- [ ] Click "Continue" advances through all images
- [ ] Last image shows arrival screen
- [ ] "Back to Events" returns to event list

### Performance
- [ ] Events load in < 1 second
- [ ] Search results appear instantly
- [ ] Images load as user advances (no pre-load of all 6)
- [ ] Caching headers set (images cached locally)

### Edge Cases
- [ ] Empty search returns empty results
- [ ] Search is case-insensitive
- [ ] Non-existent event shows error
- [ ] Images missing shows placeholder
- [ ] Back button works from every screen

---

## Common Mistakes to Avoid

❌ **Don't:** Show building/floor selection screens  
✅ **Do:** Let users search for events directly

❌ **Don't:** Filter events by building first  
✅ **Do:** Show all events, searchable by name

❌ **Don't:** Duplicate common images in event folders  
✅ **Do:** Reference shared images from `building-X/common/`

❌ **Don't:** Load all 6 images at startup  
✅ **Do:** Lazy load as user advances through navigation

❌ **Don't:** Show internal event IDs (E-1, E-2)  
✅ **Do:** Show human-readable event names only

❌ **Don't:** Support multiple search fields  
✅ **Do:** Simple text search on event name

---

## Response Format Examples

### GET_ALL_EVENTS Response

```json
{
  "events": [
    {
      "id": "E-1",
      "name": "Talvad Vadan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Classical music performance",
      "locationPath": "building-a/floor-2/E-1"
    },
    {
      "id": "E-2",
      "name": "Swarvadh Vadan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Vocal showcase",
      "locationPath": "building-a/floor-2/E-2"
    },
    ... 4 more events
  ],
  "totalEvents": 6
}
```

### SEARCH_EVENTS('natya') Response

```json
{
  "events": [
    {
      "id": "E-3",
      "name": "Natya Sangit",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "description": "Dance and music fusion",
      "locationPath": "building-a/floor-2/E-3"
    }
  ],
  "totalEvents": 1
}
```

### GET_NAVIGATION_SEQUENCE('E-3', 'A', 2) Response

```json
{
  "eventId": "E-3",
  "eventName": "Natya Sangit",
  "buildingId": "A",
  "buildingName": "Building A",
  "floorNumber": 2,
  "sequence": [
    {
      "type": "building",
      "step": 1,
      "label": "Building A Entrance",
      "instruction": "Enter through main gate",
      "imagePath": "public/navigation/building-a/common/entrance.webp"
    },
    {
      "type": "building",
      "step": 2,
      "label": "Building A Corridor",
      "instruction": "Walk straight",
      "imagePath": "public/navigation/building-a/common/corridor.webp"
    },
    {
      "type": "floor",
      "step": 3,
      "label": "Floor 2 Staircase",
      "instruction": "Go up stairs",
      "imagePath": "public/navigation/building-a/floor-2/common/stairs.webp"
    },
    {
      "type": "floor",
      "step": 4,
      "label": "Floor 2 Main Hall",
      "instruction": "Enter left hall",
      "imagePath": "public/navigation/building-a/floor-2/common/hall.webp"
    },
    {
      "type": "event",
      "step": 5,
      "label": "Event Area",
      "instruction": "Event space ahead",
      "imagePath": "public/navigation/building-a/floor-2/events/E-3/area.webp"
    },
    {
      "type": "event",
      "step": 6,
      "label": "Event Entrance",
      "instruction": "Arrived!",
      "imagePath": "public/navigation/building-a/floor-2/events/E-3/entrance.webp"
    }
  ],
  "totalSteps": 6
}
```

---

## Summary

### Your Task
Implement 4 API functions that return event data + navigation sequences in the exact format shown above.

### Current Data
- 6 events on Building A Floor 2
- All event names provided (Talvad Vadan, Swarvadh Vadan, etc.)
- No building/floor selection needed from user

### Key Difference from Building-First Flow
- Users search for **events**, not buildings
- Building/floor auto-discovered from event data
- Simpler, faster UX
- Scales better as more buildings are added

### Start Here
1. Read this entire prompt
2. Set up database with events table
3. Implement GET_ALL_EVENTS() first
4. Test it returns correct format
5. Implement SEARCH_EVENTS()
6. Implement GET_NAVIGATION_SEQUENCE()
7. Implement GET_IMAGE()
8. Connect to frontend

**Frontend is ready. This prompt tells you exactly what it needs. Go build it!**
