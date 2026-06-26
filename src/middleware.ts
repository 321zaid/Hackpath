import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ipCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  ipCounts.set(ip, entry);
  return entry.count > maxRequests;
}

const STATIC_EXTENSIONS = new Set([
  ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".woff", ".woff2", ".ttf", ".eot", ".webp",
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  if (!STATIC_EXTENSIONS.has(path.substring(path.lastIndexOf(".")))) {
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";

    if (path.startsWith("/api/auth") || path.startsWith("/login")) {
      if (isRateLimited(`auth:${ip}`, 10, 60000)) {
        return new NextResponse("Too many requests. Please wait before trying again.", {
          status: 429,
          headers: { "Retry-After": "60" },
        });
      }
    } else if (path.startsWith("/api/")) {
      if (isRateLimited(`api:${ip}`, 60, 60000)) {
        return new NextResponse("Too many requests. Please wait before trying again.", {
          status: 429,
          headers: { "Retry-After": "60" },
        });
      }
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; font-src 'self' data:; frame-ancestors 'none';",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
