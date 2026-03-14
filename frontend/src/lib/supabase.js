import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
        lock: async (name, acquireTimeout, fn) => {
            // Bypass Web Locks API to avoid AbortError conflicts
            return await fn();
        },
    },
});
