// ============================================================
// JALLOSH 2026 — Supabase Client
// ============================================================
// Initializes the Supabase client using Vite environment variables.
// Returns null if credentials are not configured (demo-only mode).
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client instance.
 * null when env vars are missing (falls back to demo data).
 */
let supabase = null;

if (
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://YOUR_PROJECT_ID.supabase.co' &&
  supabaseAnonKey !== 'YOUR_ANON_KEY_HERE'
) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;

/**
 * Check if Supabase is configured and available.
 */
export function isSupabaseConfigured() {
  return supabase !== null;
}

/**
 * Get a public URL for an image stored in the nav-images bucket.
 * Returns null if supabase is not configured or path is empty.
 */
export function getNavImageUrl(imagePath) {
  if (!supabase || !imagePath) return null;
  const { data } = supabase.storage.from('nav-images').getPublicUrl(imagePath);
  return data?.publicUrl || null;
}
