// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cyargjrjscpxmgkakzfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YXJnanJqc2NweG1na2FremZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTI1MjIsImV4cCI6MjA1ODQyODUyMn0.RuLXGFWqYFg6DNc2jAzwawkqCKKxOHUa8DaC3jTjW1g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);