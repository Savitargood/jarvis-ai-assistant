import { createClient } from '@supabase/supabase-js';
import { createVerdentAuth } from '@verdent/auth-js';

const FALLBACK_SUPABASE_URL = 'https://supabase-api-prod.verdent.ai/p/pd913e5ed597a04d9ffaa';
const FALLBACK_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMTA1MjQzNzk1LCJpYXQiOjE3ODk2MjQ1OTUsImlzcyI6InN1cGFiYXNlIiwicHJvamVjdF9yZWYiOiJwZDkxM2U1ZWQ1OTdhMDRkOWZmYWEiLCJyb2xlIjoiYW5vbiJ9.6GOt8-qFpjYjOSTzwm45bzbtZ4HHoaaJ2rpJHFVV3_U';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const auth = createVerdentAuth({
  supabase,
  oauth: {
    authorizeUrl: import.meta.env.VITE_VERDENT_OAUTH_INITIATE_URL || 'https://cloud-oauth.verdent.ai/app/initiate',
  },
});
