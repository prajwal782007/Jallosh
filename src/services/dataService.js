// ============================================================
// JALLOSH 2026 — Data Service Layer
// ============================================================
// Abstraction over Supabase and local demo data.
// - When Supabase is configured: fetches from the database.
// - When not configured: falls back to local demo data.
//
// All functions are async so consumers don't need to care
// about the underlying data source.
// ============================================================

import supabase, { isSupabaseConfigured, getNavImageUrl } from '../lib/supabase';
import {
  events as demoEvents,
  buildings as demoBuildings,
  getRouteForEvent as demoGetRouteForEvent,
  getEventById as demoGetEventById,
  getUniqueBuildings as demoGetUniqueBuildings,
  getUniqueFloors as demoGetUniqueFloors,
} from '../data/demoData';

// ── Helper: transform a Supabase navigation_node row to the
//    shape expected by UI components ───────────────────────────
function transformNode(row) {
  return {
    id: row.id,
    name: row.name,
    building: row.building,
    floor: row.floor,
    nodeType: row.node_type,
    image: getNavImageUrl(row.image_path),
    description: row.description,
    instruction: row.instruction,
    arrow:
      row.arrow_x != null && row.arrow_y != null
        ? { x: row.arrow_x, y: row.arrow_y, direction: row.arrow_direction || 'right' }
        : null,
    floorChange:
      row.floor_change_from != null && row.floor_change_to != null
        ? { from: row.floor_change_from, to: row.floor_change_to }
        : undefined,
  };
}

// ── Helper: transform a Supabase event row ────────────────────
function transformEvent(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    building: row.building,
    floor: row.floor,
    room: row.room,
    destinationNodeId: row.destination_node_id,
    time: row.time_slot,
    description: row.description,
  };
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Fetch all active events.
 * @returns {Promise<Array>} events array
 */
export async function fetchEvents() {
  if (!isSupabaseConfigured()) {
    return demoEvents;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.warn('[dataService] fetchEvents error, falling back to demo:', error.message);
    return demoEvents;
  }

  return data.map(transformEvent);
}

/**
 * Fetch a single event by ID.
 * @param {string} eventId
 * @returns {Promise<Object|null>}
 */
export async function fetchEventById(eventId) {
  if (!isSupabaseConfigured()) {
    return demoGetEventById(eventId);
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.warn('[dataService] fetchEventById error, falling back to demo:', error.message);
    return demoGetEventById(eventId);
  }

  return data ? transformEvent(data) : null;
}

/**
 * Fetch the route for an event (including ordered navigation nodes).
 * Returns { id, eventId, estimatedMinutes, nodes: [...] } or null.
 * @param {string} eventId
 * @returns {Promise<Object|null>}
 */
export async function fetchRouteForEvent(eventId) {
  if (!isSupabaseConfigured()) {
    return demoGetRouteForEvent(eventId);
  }

  // 1. Get route
  const { data: route, error: routeError } = await supabase
    .from('routes')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (routeError || !route) {
    // Not necessarily an error — event may just not have a route
    if (routeError && routeError.code !== 'PGRST116') {
      console.warn('[dataService] fetchRouteForEvent route error:', routeError.message);
    }
    return demoGetRouteForEvent(eventId); // fallback
  }

  // 2. Get ordered route nodes with joined navigation_node data
  const { data: routeNodes, error: nodesError } = await supabase
    .from('route_nodes')
    .select('step_order, node_id, navigation_nodes(*)')
    .eq('route_id', route.id)
    .order('step_order');

  if (nodesError) {
    console.warn('[dataService] fetchRouteForEvent nodes error, falling back:', nodesError.message);
    return demoGetRouteForEvent(eventId);
  }

  const nodes = routeNodes
    .map((rn) => rn.navigation_nodes ? transformNode(rn.navigation_nodes) : null)
    .filter(Boolean);

  return {
    id: route.id,
    eventId: route.event_id,
    estimatedMinutes: route.estimated_minutes,
    nodeIds: routeNodes.map((rn) => rn.node_id),
    nodes,
  };
}

/**
 * Fetch unique building names from events.
 * @returns {Promise<string[]>}
 */
export async function fetchUniqueBuildings() {
  if (!isSupabaseConfigured()) {
    return demoGetUniqueBuildings();
  }

  const { data, error } = await supabase
    .from('events')
    .select('building')
    .eq('is_active', true);

  if (error) {
    console.warn('[dataService] fetchUniqueBuildings error:', error.message);
    return demoGetUniqueBuildings();
  }

  return [...new Set(data.map((d) => d.building))].sort();
}

/**
 * Fetch unique floor numbers from events.
 * @returns {Promise<number[]>}
 */
export async function fetchUniqueFloors() {
  if (!isSupabaseConfigured()) {
    return demoGetUniqueFloors();
  }

  const { data, error } = await supabase
    .from('events')
    .select('floor')
    .eq('is_active', true);

  if (error) {
    console.warn('[dataService] fetchUniqueFloors error:', error.message);
    return demoGetUniqueFloors();
  }

  return [...new Set(data.map((d) => d.floor))].sort((a, b) => a - b);
}
