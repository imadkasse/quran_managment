import { Database } from "@/types/supabase.types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kqubjuwqasdspzumvbts.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);


