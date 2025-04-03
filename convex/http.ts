import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/createAdminUser',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    console.log('Hit /createAdminUser with:', await req.json());
    const args = await req.json();
    const result = await ctx.runMutation(internal.scripts.createAdminUser, args);
    console.log('Result:', result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

// Action to check session validity
http.route({
  path: "/validateSession",
  method: "POST", // Use POST to potentially receive session ID in body
  handler: httpAction(async (ctx, request) => {
    // IMPORTANT: How you get the session ID depends on how Convex manages sessions.
    // This is a conceptual example. You might need to adjust based on 
    // Convex's specific session management or the ID you store in the cookie.
    // Let's assume the client sends the session ID in the request body for now.
    
    let sessionId = null;
    try {
      const body = await request.json();
      sessionId = body.sessionId;
    } catch (error) {
      // Ignore parsing errors if no body or invalid JSON
    }

    if (!sessionId) {
        console.warn("validateSession: No session ID provided in request body.");
        return new Response(JSON.stringify({ isValid: false }), { status: 400 });
    }

    console.log(`validateSession: Checking validity for session ID: ${sessionId}`);

    try {
        // Use Convex's context `ctx.auth.getUserIdentity()` which resolves if the 
        // request is authenticated based on Convex's internal mechanisms 
        // (which *might* use headers/tokens set by the client automatically, 
        // or we might need a more explicit lookup based on the sessionId).
        
        // Method 1: Rely on Convex context (if request headers are correctly passed)
        // const identity = await ctx.auth.getUserIdentity();
        // const isValid = !!identity;

        // Method 2: Explicit lookup (if needed) - Requires a way to map sessionId to user
        // This usually involves storing session data in a Convex table.
        // Example: const session = await ctx.runQuery(internal.sessions.getSession, { sessionId });
        // const isValid = !!session && session.expiresAt > Date.now(); 
        
        // *** Placeholder: Assume validation logic exists ***
        // Replace this with your actual Convex session validation logic
        // For now, let's simulate a check. In a real scenario, you'd verify 
        // the sessionId against Convex's auth state or a sessions table.
        const isValid = await performActualSessionValidation(ctx, sessionId); 

        console.log(`validateSession: Session ID ${sessionId} validity: ${isValid}`);
        
        return new Response(JSON.stringify({ isValid }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error during session validation:", error);
        return new Response(JSON.stringify({ isValid: false, error: "Validation failed" }), { status: 500 });
    }
  }),
});

// Placeholder for actual validation logic (replace with your implementation)
async function performActualSessionValidation(ctx: any, sessionId: string): Promise<boolean> {
    // TODO: Replace this with real Convex session validation.
    // This might involve:
    // 1. Using ctx.auth.getUserIdentity() if Convex automatically handles session headers.
    // 2. Querying a 'sessions' table using the sessionId.
    // 3. Calling a specific Convex function designed for this.
    console.warn(`performActualSessionValidation: Using placeholder validation for session ID ${sessionId}. Implement real logic!`);
    // Simulate checking if the sessionId looks like a valid format (highly insecure example)
    return typeof sessionId === 'string' && sessionId.length > 10; 
}

export default http;