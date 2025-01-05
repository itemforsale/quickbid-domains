import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://thaaptbfszmhsmexjgpu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYWFwdGJmc3ptaHNtZXhqZ3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDIzODUsImV4cCI6MjA1MTY3ODM4NX0.MWCk36xcltPJhZVPMMm7jos7njtwyc5Nt8h_UHQvNoA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);