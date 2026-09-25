import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Mock DB
const events = [
    {
        id: "E-1",
        name: "Talvad Vadan",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "A classical music performance",
        locationPath: "building-a/floor-2/E-1"
    },
    {
        id: "E-2",
        name: "Swarvadh Vadan",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "Vocal performance showcase",
        locationPath: "building-a/floor-2/E-2"
    },
    {
        id: "E-3",
        name: "Natya Sangit",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "Dance and music fusion",
        locationPath: "building-a/floor-2/E-3"
    },
    {
        id: "E-4",
        name: "Shastriya Gayan",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "Classical vocal training demonstration",
        locationPath: "building-a/floor-2/E-4"
    },
    {
        id: "E-5",
        name: "Vadvivad",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "Debate and discussion forum",
        locationPath: "building-a/floor-2/E-5"
    },
    {
        id: "E-6",
        name: "Prashnamanjusha",
        buildingId: "A",
        buildingName: "Building A",
        floorNumber: 2,
        description: "Question and answer session",
        locationPath: "building-a/floor-2/E-6"
    }
];

const navigationImages = {
    'E-1': [
        { type: "building", step: 1, label: "Building A Entrance", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", imagePath: "public/navigation-optimized/building-a/floor-2/events/talvad-vadan/B-A.F-2.E-1.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", imagePath: "public/navigation-optimized/building-a/floor-2/events/talvad-vadan/B-A.F-2.E-1.img2.webp" }
    ],
    'E-2': [
        { type: "building", step: 1, label: "Building A Entrance", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", imagePath: "public/navigation-optimized/building-a/floor-2/events/swarvadya-vadan/B-A.F-2.E-2.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", imagePath: "public/navigation-optimized/building-a/floor-2/events/swarvadya-vadan/B-A.F-2.E-2.img2.webp" }
    ],
    'E-3': [
        { type: "building", step: 1, label: "Building A Entrance", instruction: "Enter through main gate", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", instruction: "Walk straight", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", instruction: "Go up stairs", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", instruction: "Enter left hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", instruction: "Event space ahead", imagePath: "public/navigation-optimized/building-a/floor-2/events/natya-sangeet/B-A.F-2.E-3.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", instruction: "Arrived!", imagePath: "public/navigation-optimized/building-a/floor-2/events/natya-sangeet/B-A.F-2.E-3.img2.webp" }
    ],
    'E-4': [
        { type: "building", step: 1, label: "Building A Entrance", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", imagePath: "public/navigation-optimized/building-a/floor-2/events/shastriya-sangeet/B-A.F-2.E-4.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", imagePath: "public/navigation-optimized/building-a/floor-2/events/shastriya-sangeet/B-A.F-2.E-4.img2.webp" }
    ],
    'E-5': [
        { type: "building", step: 1, label: "Building A Entrance", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", imagePath: "public/navigation-optimized/building-a/floor-2/events/vadvivad-debate/B-A.F-2.E-5.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", imagePath: "public/navigation-optimized/building-a/floor-2/events/vadvivad-debate/B-A.F-2.E-5.img2.webp" }
    ],
    'E-6': [
        { type: "building", step: 1, label: "Building A Entrance", imagePath: "public/navigation-optimized/building-a/common/B-A.img1.webp" },
        { type: "building", step: 2, label: "Building A Corridor", imagePath: "public/navigation-optimized/building-a/common/B-A.img2.webp" },
        { type: "floor", step: 3, label: "Floor 2 Staircase", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img1.webp" },
        { type: "floor", step: 4, label: "Floor 2 Main Hall", imagePath: "public/navigation-optimized/building-a/floor-2/common/B-A.F-2.img2.webp" },
        { type: "event", step: 5, label: "Event Area", imagePath: "public/navigation-optimized/building-a/floor-2/events/prashna-manjusha/B-A.F-2.E-6.img1.webp" },
        { type: "event", step: 6, label: "Event Entrance", imagePath: "public/navigation-optimized/building-a/floor-2/events/prashna-manjusha/B-A.F-2.E-6.img2.webp" }
    ]
};

// 1. GET_ALL_EVENTS
app.get('/api/events/all', (req, res) => {
    res.json({ events, totalEvents: events.length });
});

// 2. SEARCH_EVENTS
app.get('/api/events/search', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    const filtered = events.filter(e => e.name.toLowerCase().includes(q));
    res.json({ events: filtered, totalEvents: filtered.length });
});

// 3. GET_NAVIGATION_SEQUENCE
app.get('/api/navigation/:eventId', (req, res) => {
    const { eventId } = req.params;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    
    const sequence = navigationImages[eventId] || [];
    
    res.json({
        eventId: event.id,
        eventName: event.name,
        buildingId: event.buildingId,
        buildingName: event.buildingName,
        floorNumber: event.floorNumber,
        sequence,
        totalSteps: sequence.length
    });
});

// Static file serving for images (since the HTML uses relative paths, but we specified GET_IMAGE should serve them)
app.use('/public/navigation-optimized', express.static(path.join(__dirname, 'public', 'navigation-optimized'), {
    maxAge: '1y',
    setHeaders: (res, path) => {
        if (path.endsWith('.webp')) {
            res.setHeader('Content-Type', 'image/webp');
        }
    }
}));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'jallosh-events-first.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
