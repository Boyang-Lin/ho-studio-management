// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://axogrfruqxnddnrrgzua.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4b2dyZnJ1cXhuZGRucnJnenVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MTgzMzYsImV4cCI6MjA1MDA5NDMzNn0.ZqYY7fOUhUjgBXKVZrikUb-9LRrQ-Q86Er4owiJ_NVE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);