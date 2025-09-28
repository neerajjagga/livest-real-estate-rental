import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth/server";
import { headers } from "next/headers";

const protectedRoutes = ['/dashboard', '/managers', '/tenants'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isLoggedIn = !!session;
    const isOnProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isOnAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

    if (isOnProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isOnAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};