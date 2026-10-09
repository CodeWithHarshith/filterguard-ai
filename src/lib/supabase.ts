import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'oqjujyxzmlxntdujmwam';
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KNuRjpMdbPLM-qsjuZ0y1w_e2A7Os0F';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
