import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Define protected and public routes
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isPublicAuthRoute = pathname === '/login' || pathname === '/register';

    if (isProtectedRoute) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await decrypt(session);
            return NextResponse.next();
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (isPublicAuthRoute && session) {
        try {
            await decrypt(session);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (e) {
            // Invalid session, let them stay on login/register
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
