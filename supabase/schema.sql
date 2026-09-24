-- ============================================================
-- JALLOSH 2026 — Supabase Database Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- This creates all tables, relationships, RLS policies, storage
-- bucket, and seed data for the navigation system.
-- ============================================================

-- ── Enable UUID extension ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- ── Buildings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buildings (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  code      TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Floors ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS floors (
  id          TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  level       INTEGER NOT NULL,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (building_id, level)
);

-- ── Navigation Nodes ──────────────────────────────────────────
-- node_type: GATE | ENTRANCE | CORRIDOR | JUNCTION | STAIRCASE | LANDING | ROOM
CREATE TABLE IF NOT EXISTS navigation_nodes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  building      TEXT,           -- denormalized for query convenience
  floor         INTEGER,
  node_type     TEXT NOT NULL CHECK (node_type IN ('GATE','ENTRANCE','CORRIDOR','JUNCTION','STAIRCASE','LANDING','ROOM')),
  image_path    TEXT,           -- path in Supabase Storage (bucket: nav-images)
  description   TEXT,
  instruction   TEXT,
  arrow_x       REAL,           -- percentage from left (0-100)
  arrow_y       REAL,           -- percentage from top (0-100)
  arrow_direction TEXT,         -- up | down | left | right | up-right | up-left | down-right | down-left
  floor_change_from INTEGER,   -- for staircase/lift nodes
  floor_change_to   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── Events ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  category           TEXT,
  building           TEXT NOT NULL,
  floor              INTEGER NOT NULL,
  room               TEXT NOT NULL,
  destination_node_id TEXT REFERENCES navigation_nodes(id),
  time_slot          TEXT,       -- display string e.g. "10:00 AM – 1:00 PM"
  description        TEXT,
  is_active          BOOLEAN DEFAULT true,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- ── Routes ────────────────────────────────────────────────────
-- A route connects an event to an ordered sequence of navigation nodes
CREATE TABLE IF NOT EXISTS routes (
  id                TEXT PRIMARY KEY,
  event_id          TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  estimated_minutes INTEGER DEFAULT 5,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ── Route Nodes (ordered junction table) ──────────────────────
CREATE TABLE IF NOT EXISTS route_nodes (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_id   TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  node_id    TEXT NOT NULL REFERENCES navigation_nodes(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (route_id, step_order)
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_floors_building ON floors(building_id);
CREATE INDEX IF NOT EXISTS idx_events_building ON events(building);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_route_nodes_route ON route_nodes(route_id, step_order);
CREATE INDEX IF NOT EXISTS idx_navigation_nodes_type ON navigation_nodes(node_type);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Public read access for all navigation data.
-- Only authenticated service-role or admin can write.

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_nodes ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read buildings" ON buildings FOR SELECT USING (true);
CREATE POLICY "Public read floors" ON floors FOR SELECT USING (true);
CREATE POLICY "Public read navigation_nodes" ON navigation_nodes FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Public read route_nodes" ON route_nodes FOR SELECT USING (true);

-- Service-role write policies (admin panel in future phase)
CREATE POLICY "Service write buildings" ON buildings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write floors" ON floors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write navigation_nodes" ON navigation_nodes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write events" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write routes" ON routes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write route_nodes" ON route_nodes FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Creates a public bucket for navigation images.
-- Run this separately in the Supabase SQL Editor or use the
-- Dashboard → Storage → New Bucket UI.

INSERT INTO storage.buckets (id, name, public)
VALUES ('nav-images', 'nav-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can read images
CREATE POLICY "Public read nav-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'nav-images');

-- Storage policy: only service role can upload/modify
CREATE POLICY "Service write nav-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'nav-images' AND auth.role() = 'service_role');

CREATE POLICY "Service update nav-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'nav-images' AND auth.role() = 'service_role');

CREATE POLICY "Service delete nav-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'nav-images' AND auth.role() = 'service_role');


-- ============================================================
-- SEED DATA
-- ============================================================

-- Buildings
INSERT INTO buildings (id, name, code, description) VALUES
  ('building-a', 'Building A', 'A', 'Main academic block'),
  ('building-b', 'Building B', 'B', 'Science & technology block'),
  ('building-c', 'Building C', 'C', 'Arts & culture block')
ON CONFLICT (id) DO NOTHING;

-- Floors
INSERT INTO floors (id, building_id, level, name) VALUES
  ('a-g', 'building-a', 0, 'Ground Floor'),
  ('a-1', 'building-a', 1, 'Floor 1'),
  ('b-g', 'building-b', 0, 'Ground Floor'),
  ('b-1', 'building-b', 1, 'Floor 1'),
  ('b-2', 'building-b', 2, 'Floor 2'),
  ('c-g', 'building-c', 0, 'Ground Floor'),
  ('c-1', 'building-c', 1, 'Floor 1')
ON CONFLICT (id) DO NOTHING;

-- Navigation Nodes
INSERT INTO navigation_nodes (id, name, building, floor, node_type, image_path, description, instruction, arrow_x, arrow_y, arrow_direction, floor_change_from, floor_change_to) VALUES
  ('main-gate',          'Main Gate',             NULL,         NULL, 'GATE',      NULL, 'Main campus entrance gate',                          'Enter through the main gate and walk straight ahead.', 50, 40, 'up',    NULL, NULL),
  ('building-b-entrance','Building B Entrance',   'Building B', 0,    'ENTRANCE',  NULL, 'Front entrance of Building B',                       'Enter Building B through the main door.',               50, 45, 'up',    NULL, NULL),
  ('b-ground-corridor',  'Ground Floor Corridor', 'Building B', 0,    'CORRIDOR',  NULL, 'Main corridor on the ground floor of Building B',    'Walk straight along the corridor.',                     75, 50, 'right', NULL, NULL),
  ('b-junction-01',      'Corridor Junction',     'Building B', 0,    'JUNCTION',  NULL, 'Junction where corridors meet near the staircase',   'Turn right towards the staircase.',                     80, 50, 'right', NULL, NULL),
  ('b-staircase-01',     'Staircase',             'Building B', 0,    'STAIRCASE', NULL, 'Staircase connecting ground floor to upper floors',  'Go up the staircase to Floor 2.',                       50, 30, 'up',    0,    2),
  ('b-floor2-landing',   'Floor 2 Landing',       'Building B', 2,    'LANDING',   NULL, 'Landing area on Floor 2 near the staircase',         'Exit the staircase and turn left.',                     20, 50, 'left',  NULL, NULL),
  ('b-floor2-corridor',  'Floor 2 Corridor',      'Building B', 2,    'CORRIDOR',  NULL, 'Main corridor on Floor 2 of Building B',             'Walk along the corridor. Room B204 is ahead on the right.', 75, 50, 'right', NULL, NULL),
  ('room-b204',          'Room B204',             'Building B', 2,    'ROOM',      NULL, 'Room B204 — Robotics Workshop venue',                'You have arrived at Room B204.',                        NULL, NULL, NULL,  NULL, NULL),
  ('room-b102',          'Room B102',             'Building B', 1,    'ROOM',      NULL, 'Room B102 — Coding Competition venue',               'You have arrived at Room B102.',                        NULL, NULL, NULL,  NULL, NULL),
  ('room-a101',          'Room A101',             'Building A', 1,    'ROOM',      NULL, 'Room A101 — Poster Making venue',                    'You have arrived at Room A101.',                        NULL, NULL, NULL,  NULL, NULL),
  ('room-c002',          'Room C002',             'Building C', 0,    'ROOM',      NULL, 'Room C002 — Photography event venue',                'You have arrived at Room C002.',                        NULL, NULL, NULL,  NULL, NULL),
  ('room-a003',          'Room A003',             'Building A', 0,    'ROOM',      NULL, 'Room A003 — Gaming Arena',                           'You have arrived at Room A003.',                        NULL, NULL, NULL,  NULL, NULL),
  ('room-c101',          'Room C101',             'Building C', 1,    'ROOM',      NULL, 'Room C101 — Quiz Competition venue',                 'You have arrived at Room C101.',                        NULL, NULL, NULL,  NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO events (id, name, category, building, floor, room, destination_node_id, time_slot, description) VALUES
  ('robotics-workshop', 'Robotics Workshop',  'Technical', 'Building B', 2, 'B204', 'room-b204', '10:00 AM – 1:00 PM', 'Hands-on robotics workshop with Arduino & sensors.'),
  ('coding-competition','Coding Competition', 'Technical', 'Building B', 1, 'B102', 'room-b102', '2:00 PM – 5:00 PM',  'Competitive programming challenge for all skill levels.'),
  ('poster-making',     'Poster Making',      'Creative',  'Building A', 1, 'A101', 'room-a101', '11:00 AM – 2:00 PM', 'Express your creativity through poster art.'),
  ('photography',       'Photography',        'Creative',  'Building C', 0, 'C002', 'room-c002', '9:00 AM – 12:00 PM', 'Campus photography competition with themed rounds.'),
  ('gaming',            'Gaming Arena',       'Fun',       'Building A', 0, 'A003', 'room-a003', '10:00 AM – 6:00 PM', 'eSports tournaments and casual gaming all day.'),
  ('quiz-competition',  'Quiz Competition',   'Academic',  'Building C', 1, 'C101', 'room-c101', '3:00 PM – 5:00 PM',  'General knowledge and science quiz for teams of 3.')
ON CONFLICT (id) DO NOTHING;

-- Routes
INSERT INTO routes (id, event_id, estimated_minutes) VALUES
  ('route-robotics-workshop', 'robotics-workshop', 6)
ON CONFLICT (id) DO NOTHING;

-- Route Nodes (ordered)
INSERT INTO route_nodes (route_id, node_id, step_order) VALUES
  ('route-robotics-workshop', 'main-gate',           1),
  ('route-robotics-workshop', 'building-b-entrance',  2),
  ('route-robotics-workshop', 'b-ground-corridor',    3),
  ('route-robotics-workshop', 'b-junction-01',        4),
  ('route-robotics-workshop', 'b-staircase-01',       5),
  ('route-robotics-workshop', 'b-floor2-landing',     6),
  ('route-robotics-workshop', 'b-floor2-corridor',    7),
  ('route-robotics-workshop', 'room-b204',            8)
ON CONFLICT DO NOTHING;
