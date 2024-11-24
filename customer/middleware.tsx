import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    //console.log(token)
    if (!token) {
        // If no token is found, redirect to the login page
        return NextResponse.redirect(new URL('/', request.url));
    }
    const response = await fetch('http://127.0.0.1:8080/api/user/get_auth', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok) {
        const redirectResponse = NextResponse.redirect(new URL('/', request.url));
        redirectResponse.cookies.set('token', '', {
            expires: new Date(0), // Set the expiry to the past
            path: '/',            // Ensure the path matches where the cookie was set
        });
        return redirectResponse;
    }
    // Allow the request to continue if the token exists
    return NextResponse.next();
}

// Specify which paths this middleware should be applied to
export const config = {
    matcher: ['/profile'],
};
