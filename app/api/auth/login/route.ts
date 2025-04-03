// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser'; // Use ConvexHttpClient for server-side calls
import { api } from '../../../../convex/_generated/api'; // Use relative path

// Removed 'cookies' import as we set it on the response now

// Initialize Convex client for server-side usage
// IMPORTANT: Ensure NEXT_PUBLIC_CONVEX_URL is correctly set in your environment
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define a secure cookie name
const COOKIE_NAME = 'app_session'; 

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log(`API Route /api/auth/login: Attempting login for ${email}`);

    // --- Call Convex Action/Mutation for Authentication ---
    // IMPORTANT: Replace 'auth.signIn' with your actual Convex function for email/password sign-in.
    // This function should return some form of session identifier or user object upon success.
    let sessionIdentifier: string | null = null;
    let userId: string | null = null; 
    
    try {
        // Example: Assume signIn returns { sessionId: '...', userId: '...' }
        const result = await convex.mutation(api.auth.signIn, { // REPLACE api.auth.signIn
            email: email,
            password: password, // Ensure your Convex function accepts password securely
        });
        
        // --- Extract Session Identifier ---
        // Adjust based on the actual return value of your Convex signIn function
        sessionIdentifier = result?.sessionId; // MODIFY based on actual return structure
        userId = result?.userId; // MODIFY based on actual return structure

        if (!sessionIdentifier) {
            throw new Error("Convex sign-in did not return a session identifier.");
        }
        console.log(`API Route /api/auth/login: Convex sign-in successful for user ${userId}. Session ID obtained.`);

    } catch (convexError: any) {
      console.error('API Route /api/auth/login: Convex authentication failed:', convexError);
      // Handle specific Convex errors if needed (e.g., invalid credentials)
      return NextResponse.json({ error: 'Invalid credentials or server error' }, { status: 401 });
    }

    // Return success response (potentially include basic user info if needed by frontend)
    const response = NextResponse.json({ success: true, userId: userId }, { status: 200 });

    // --- Set Secure Cookie on the Response --- 
    console.log(`API Route /api/auth/login: Setting session cookie (${COOKIE_NAME}) on the response`);
    response.cookies.set(COOKIE_NAME, sessionIdentifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // Example: 7 days
    });

    return response;

  } catch (error: any) {
    console.error('API Route /api/auth/login: Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
