# Jallosh 2026 - Events-First Architecture Summary

## What Changed

### ❌ Old Flow (Building-First)
```
Home
  ↓
Select Building
  ↓
Select Floor
  ↓
Search Events
  ↓
Route Preview
  ↓
Navigation
  ↓
Arrival
```

**Problem:** Visitors don't know which building their event is in. They have to navigate through building → floor → event selection. Too many steps before finding their event.

---

### ✅ New Flow (Events-First)
```
Home
  ↓
All Events (Searchable) ← User searches for event name
  ↓
Route Preview (building/floor shown automatically)
  ↓
Navigation
  ↓
Arrival
```

**Benefit:** User searches for event name directly. They don't need to know the building or floor upfront. Much faster discovery.

---

## What You Get Now

### 1. **Frontend Files**

**`jallosh-events-first.html`** ← **USE THIS ONE** (New events-first implementation)
- Home screen
- All events list with real-time search
- Route preview (shows building & floor)
- Visual navigation
- Arrival confirmation
- No building/floor selection screens

**`jallosh-premium.html`** (Old building-first version)
- Can ignore, included for reference

### 2. **Backend Specification**

**`EVENTS_FIRST_DETAILED_PROMPT.md`** ← **GIVE THIS TO YOUR AGENT** (Complete technical spec)
- 4 API functions (not 6)
- Exact request/response formats
- Database structure
- Implementation examples
- Current data (6 events on Building A Floor 2)

### 3. **Documentation**

- `README.md` - Overview of deliverables
- `AGENT_INTEGRATION_GUIDE.md` - Old building-first guide (reference)
- `DESIGN_PHILOSOPHY.md` - Design decisions

---

## Quick Comparison

| Aspect | Building-First | Events-First |
|--------|-----------------|--------------|
| First screen | Select building | Search events |
| User knows | Building location | Event name |
| Steps to event | 3-4 screens | 2-3 screens |
| Scalability | Hard (too many options) | Easy (search scales) |
| API functions | 6 | 4 |
| Building/floor info | Primary | Secondary (in route preview) |
| Search placement | Late in flow | Immediate (screen 2) |

---

## New Backend API (4 Functions)

Your agent needs to implement:

### 1. GET_ALL_EVENTS()
Returns every event across all buildings.

```json
{
  "events": [
    {
      "id": "E-1",
      "name": "Talvad Vadan",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "locationPath": "building-a/floor-2/E-1"
    },
    ... 5 more
  ],
  "totalEvents": 6
}
```

### 2. SEARCH_EVENTS(query)
Filter events by name as user types.

```json
{
  "events": [
    {
      "id": "E-3",
      "name": "Natya Sangit",
      "buildingId": "A",
      "buildingName": "Building A",
      "floorNumber": 2,
      "locationPath": "building-a/floor-2/E-3"
    }
  ],
  "totalEvents": 1
}
```

### 3. GET_NAVIGATION_SEQUENCE(eventId, buildingId, floorNumber)
Return image sequence for the event.

```json
{
  "sequence": [
    { type: "building", label: "Building A Entrance", imagePath: "..." },
    { type: "building", label: "Building A Corridor", imagePath: "..." },
    { type: "floor", label: "Floor 2 Staircase", imagePath: "..." },
    { type: "floor", label: "Floor 2 Main Hall", imagePath: "..." },
    { type: "event", label: "Event Area", imagePath: "..." },
    { type: "event", label: "Event Entrance", imagePath: "..." }
  ],
  "totalSteps": 6
}
```

### 4. GET_IMAGE(imagePath)
Serve image file (WebP).

---

## How It Works

### User Journey (Events-First)

1. **Home Screen**
   ```
   ✨ Jallosh 2026
   
   Find your event
   
   [Find an Event]
   ```
   User taps button.

2. **Events List with Search**
   ```
   [← ] [6 Events]
   
   [🔍 Search... ]
   
   Talvad Vadan
   📍 Building A • Floor 2
   
   Swarvadh Vadan
   📍 Building A • Floor 2
   
   Natya Sangit ← User searches "natya"
   📍 Building A • Floor 2
   
   ...
   ```
   User types "natya" to find their event.

3. **Route Preview (Auto-discovered)**
   ```
   Natya Sangit
   
   📍 Building A • Floor 2  ← Building/floor shown here
   
   Your route:
   1 → Building A
   2 → Floor 2
   3 → Natya Sangit
   
   [Start Navigation]
   ```
   User sees where event is WITHOUT selecting building/floor first.

4. **Visual Navigation**
   ```
   [←] Building A [3/6]
   
   [Image: Building corridor]
            ↓
   
   [Back] [Continue]
   ```
   Step-by-step photos guide user to event.

5. **Arrival**
   ```
   ✓
   
   You've arrived
   
   Natya Sangit
   
   📍 Building A • Floor 2
   
   [Find Another Event]
   ```

---

## What to Do Now

### Step 1: Test the Frontend
1. Open `jallosh-events-first.html` in browser
2. Tap "Find an Event"
3. See all 6 events listed
4. Try searching (type "natya")
5. Tap Natya Sangit
6. See route preview with building info
7. Start navigation
8. Click Continue 6 times
9. See arrival

### Step 2: Give Backend Spec to Agent
1. Send `EVENTS_FIRST_DETAILED_PROMPT.md` to your backend agent
2. They implement 4 API functions
3. They organize images in correct folder structure

### Step 3: Integrate Frontend + Backend
1. Open `jallosh-events-first.html`
2. Find mock data section
3. Replace with real API calls to 4 functions
4. Test each endpoint
5. Deploy

---

## File Structure (No Changes)

Images organized exactly the same way:

```
public/navigation/
└── building-a/
    ├── common/                    (Shared by all events)
    │   ├── entrance.webp
    │   ├── corridor.webp
    │   └── exit.webp
    └── floor-2/
        ├── common/                (Shared by all events on floor 2)
        │   ├── stairs.webp
        │   ├── hall.webp
        │   └── corridor.webp
        └── events/
            ├── E-1/ (2 images)
            ├── E-2/ (2 images)
            ├── E-3/ (2 images)
            ├── E-4/ (2 images)
            ├── E-5/ (2 images)
            └── E-6/ (2 images)
```

Total: 21 unique images (not 36, common images are reused)

---

## Why This is Better

✅ **Faster Discovery**
- User searches for event name they know
- No navigation through building/floor hierarchy
- 1-2 taps to navigation vs 4-5 taps

✅ **Scalable**
- Works with 6 events or 600 events
- Search scales infinitely
- Building/floor lists get overwhelming

✅ **Intuitive**
- Visitors know event name
- They don't know building/floor
- Makes sense to search first

✅ **Mobile-Friendly**
- Fewer screens to navigate
- Search works great on phone
- Less UI complexity

✅ **Accessibility**
- No confusion about buildings
- Clear visual hierarchy
- Event info always visible

---

## What to Tell Your Agent

"Implement these 4 API functions with exact response formats shown in EVENTS_FIRST_DETAILED_PROMPT.md:

1. GET_ALL_EVENTS() - Return all 6 events with building/floor info
2. SEARCH_EVENTS(query) - Filter events by name
3. GET_NAVIGATION_SEQUENCE(eventId, buildingId, floor) - Return 6 images
4. GET_IMAGE(imagePath) - Serve image file

Frontend will call these functions. Implement them exactly as specified."

---

## Testing Flow

### Manual Testing
1. Open app in browser
2. Tap "Find an Event"
3. Verify all 6 events appear
4. Search "natya" - only Natya Sangit should appear
5. Search "vad" - both Talvad Vadan and Vadvivad appear
6. Select event
7. Route preview shows correct building & floor
8. Start navigation
9. All 6 images load and display
10. Arrival screen confirms location

### API Testing
```javascript
// Test each endpoint
GET /api/events/all → Returns array of 6 events
GET /api/events/search?q=natya → Returns 1 event
GET /api/navigation/E-3?building=A&floor=2 → Returns sequence of 6 images
GET /public/navigation/building-a/common/entrance.webp → Returns image
```

---

## Deployment Checklist

- [ ] Backend implements 4 API functions
- [ ] Images organized in correct folders (21 total)
- [ ] Images are WebP format (<100KB each)
- [ ] Frontend HTML updated with real API calls
- [ ] Search works (real-time filtering)
- [ ] Navigation loads images correctly
- [ ] All buttons and links work
- [ ] Mobile responsive (test on phone)
- [ ] Arrival screen works
- [ ] "Find Another Event" returns to search
- [ ] QR code points to app URL
- [ ] Caching headers set on images

---

## Summary

| What | File |
|------|------|
| **Frontend to Use** | `jallosh-events-first.html` |
| **Backend Spec** | `EVENTS_FIRST_DETAILED_PROMPT.md` |
| **Design Reference** | `DESIGN_PHILOSOPHY.md` |
| **General FAQ** | `README.md` |

**Everything is ready.** Your agent just needs to implement 4 functions with events-first data structure.

---

**Last Updated:** September 2026  
**Status:** Ready for Backend Implementation  
**Architecture:** Events-First (Recommended)
