import { createClient } from "@supabase/supabase-js";
// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ⚠️ مهم

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export function createSupabaseServer() {
  const cookieStore = cookies(); // ✅ الآن داخل الدالة = داخل request scope

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      cookies: {
        get: async (name) => (await cookieStore).get(name)?.value,
      },
    }
  );

}

