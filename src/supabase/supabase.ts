import { Database } from "@/types/supabase.types";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kqubjuwqasdspzumvbts.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
