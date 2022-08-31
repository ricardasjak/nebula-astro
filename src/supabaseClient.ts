import { createClient } from '@supabase/supabase-js'
import { ENV } from './utils/env.util';

console.log('init supabase client');
// Create a single supabase client for interacting with your database
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE);