import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://areehownnoqwhzunofay.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZWVob3dubm9xd2h6dW5vZmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjQwMTUsImV4cCI6MjA3NzQ0MDAxNX0.9AbV2MmDJfKJ_rIoI23kdFKQoIPInA29Z2yDdVcgvsA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
