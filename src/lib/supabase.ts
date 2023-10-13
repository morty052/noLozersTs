import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://okatbfysknpgaxdfyxti.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
