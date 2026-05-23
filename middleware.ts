import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const protectedPath = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/productos") || request.nextUrl.pathname.startsWith("/inventario") || request.nextUrl.pathname.startsWith("/escanear") || request.nextUrl.pathname.startsWith("/reportes") || request.nextUrl.pathname.startsWith("/caja");
  if (!user && protectedPath) return NextResponse.redirect(new URL("/login", request.url));
  if (user && request.nextUrl.pathname === "/login") return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
