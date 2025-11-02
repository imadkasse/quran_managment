import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.delete(name);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
  const userId = user?.id;
  const { data: userRole, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();
  if (error || !userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = userRole.role;
  const pathname = request.nextUrl.pathname;

  if (role === "TEACHER" && !pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  }
  if (role === "PARENT" && !pathname.startsWith("/parent")) {
    return NextResponse.redirect(new URL("/parent/dashboard", request.url));
  }
  if (role === "ADMIN" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/teacher/:path*", "/parent/:path*", "/admin/:path*"],
};
