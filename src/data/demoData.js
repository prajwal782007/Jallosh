// ============================================================
// JALLOSH 2026 — Real Event Data (Demo Layer)
// ============================================================

export const buildings = [
  { id: 'building-a', name: 'Building A', code: 'A', description: 'Main academic block' },
  { id: 'building-b', name: 'Building B', code: 'B', description: 'Science & technology block' },
  { id: 'building-c', name: 'Building C', code: 'C', description: 'Arts & culture block' },
];

export const floors = [
  { id: 'a-0', buildingId: 'building-a', level: 0, name: 'Ground Floor' },
  { id: 'a-1', buildingId: 'building-a', level: 1, name: 'Floor 1' },
  { id: 'a-2', buildingId: 'building-a', level: 2, name: 'Floor 2' },
  { id: 'a-3', buildingId: 'building-a', level: 3, name: 'Floor 3' },
  
  { id: 'b-0', buildingId: 'building-b', level: 0, name: 'Ground Floor' },
  { id: 'b-1', buildingId: 'building-b', level: 1, name: 'Floor 1' },
  { id: 'b-2', buildingId: 'building-b', level: 2, name: 'Floor 2' },
  { id: 'b-3', buildingId: 'building-b', level: 3, name: 'Floor 3' },

  { id: 'c-0', buildingId: 'building-c', level: 0, name: 'Ground Floor' },
  { id: 'c-1', buildingId: 'building-c', level: 1, name: 'Floor 1' },
  { id: 'c-2', buildingId: 'building-c', level: 2, name: 'Floor 2' },
  { id: 'c-3', buildingId: 'building-c', level: 3, name: 'Floor 3' },
];

export const events = [
  {
    id: 'E-1',
    name: 'Talvad Vadan',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-1',
    description: 'Talvad Vadan Event',
  },
  {
    id: 'E-2',
    name: 'Swarvadh Vadan',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-2',
    description: 'Swarvadh Vadan Event',
  },
  {
    id: 'E-3',
    name: 'Natya Sangit',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-3',
    description: 'Natya Sangit Event',
  },
  {
    id: 'E-4',
    name: 'Shastriya Gayan',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-4',
    description: 'Shastriya Gayan Event',
  },
  {
    id: 'E-5',
    name: 'Vadvivad',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-5',
    description: 'Vadvivad / Debate Event',
  },
  {
    id: 'E-6',
    name: 'Prashnamanjusha',
    category: 'Cultural',
    building: 'Building A',
    buildingId: 'building-a',
    floor: 2,
    room: 'E-6',
    description: 'Prashnamanjusha Event',
  }
];

export function getEventById(eventId) {
  return events.find((e) => e.id === eventId) || null;
}

export function getUniqueBuildings() {
  return buildings.map(b => b.name).sort();
}

export function getUniqueFloors() {
  return [...new Set(floors.map((f) => f.level))].sort((a, b) => a - b);
}

export function getRouteForEvent(eventId) {
  const event = getEventById(eventId);
  if (!event) return null;

  // We only have genuine data for Building A, Floor 2 right now.
  if (event.buildingId !== 'building-a' || event.floor !== 2) {
    return null;
  }

  const nodes = [];

  // 1. Building A common images (14 images)
  for (let i = 1; i <= 14; i++) {
    nodes.push({
      id: `b-a-common-${i}`,
      name: i === 1 ? 'Building A Entrance' : 'Building Route',
      image: `/navigation/building-a/common/B-A.img${i}.jpeg`,
      direction: null,
      instruction: null
    });
  }

  // 2. Building A Floor 2 common images (10 images)
  for (let i = 1; i <= 10; i++) {
    nodes.push({
      id: `b-a-f-2-common-${i}`,
      name: i === 1 ? 'Floor 2' : 'Floor 2 Route',
      image: `/navigation/building-a/floor-2/common/B-A.F-2.img${i}.jpeg`,
      direction: null,
      instruction: null
    });
  }

  // 3. Event-specific images
  let eventImageCount = 0;
  let eventFolder = '';
  if (eventId === 'E-1') { eventImageCount = 10; eventFolder = 'talvad-vadan'; }
  else if (eventId === 'E-2') { eventImageCount = 11; eventFolder = 'swarvadya-vadan'; }
  else if (eventId === 'E-3') { eventImageCount = 11; eventFolder = 'natya-sangeet'; }
  else if (eventId === 'E-4') { eventImageCount = 9; eventFolder = 'shastriya-sangeet'; }
  else if (eventId === 'E-5') { eventImageCount = 9; eventFolder = 'vadvivad-debate'; }
  else if (eventId === 'E-6') { eventImageCount = 6; eventFolder = 'prashna-manjusha'; }

  for (let i = 1; i <= eventImageCount; i++) {
    nodes.push({
      id: `b-a-f-2-${eventId}-${i}`,
      name: i === eventImageCount ? `Arrive at ${event.name}` : `${event.name} Route`,
      image: `/navigation/building-a/floor-2/events/${eventFolder}/B-A.F-2.${eventId}.img${i}.jpeg`,
      direction: null,
      instruction: null
    });
  }

  // Create condensed steps for preview page
  // Only use the first step of each section and the last step of the last section
  const previewSteps = [];
  if (nodes.length > 0) {
    previewSteps.push({ name: 'Building A Entrance', nodeType: 'ENTRANCE' });
    previewSteps.push({ name: 'Floor 2', nodeType: 'STAIRCASE', isFloorChange: true });
    previewSteps.push({ name: `Arrive at ${event.name}`, nodeType: 'ROOM' });
  }

  return {
    id: `route-${eventId}`,
    eventId: eventId,
    estimatedMinutes: Math.ceil(nodes.length / 5),
    nodeIds: nodes.map(n => n.id),
    nodes: nodes,
    previewSteps: previewSteps
  };
}
