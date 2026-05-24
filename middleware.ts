import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";

const protectedPrefixes = [
  "/dashboard",
  "/productos",
  "/inventario",
  "/escanear",
  "/reportes",
  "/caja",
  "/traslados",
  "/usuarios"
];

export async function middleware(request: NextRequest) {
  const protectedPath = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const isLoginPath = request.nextUrl.pathname === "/login";
  const supabaseEnv = getSupabaseBrowserEnv();

  if (!supabaseEnv) {
    if (protectedPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("config", "supabase");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    supabaseEnv.url,
    supabaseEnv.publishableKey,
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
  if (!user && protectedPath) return NextResponse.redirect(new URL("/login", request.url));
  if (user && isLoginPath) return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
