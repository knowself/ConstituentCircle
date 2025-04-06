"use client";

import { ConvexProvider, ConvexReactClient, useConvexAuth } from 'convex/react';
import { AuthProvider } from '@/context/AuthContext';
import React, { useMemo } from 'react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Minimal component to check Convex context directly
function ConvexStatusCheck() {
    console.log("ConvexStatusCheck rendering...");
    try {
        const { isLoading, isAuthenticated } = useConvexAuth();
        console.log("ConvexStatusCheck: useConvexAuth SUCCESS", { isLoading, isAuthenticated });
        // Optional: Render something visual for confirmation
        return <div style={{ border: '1px solid green', padding: '2px', margin: '2px', fontSize: '10px' }}>Convex Auth Check: OK</div>;
    } catch (error) {
        console.error("ConvexStatusCheck: useConvexAuth FAILED", error);
        return <div style={{ border: '1px solid red', padding: '2px', margin: '2px', fontSize: '10px', color: 'red' }}>Convex Auth Check: FAILED</div>;
    }
}

export function CoreProviders({ children }: { children: React.ReactNode }) {
    console.log("CoreProviders rendering - Creating client inside useMemo");

    const convexClient = useMemo(() => {
        if (!convexUrl) {
            throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable inside CoreProviders.");
        }
        console.log("CoreProviders: Creating new ConvexReactClient instance");
        return new ConvexReactClient(convexUrl);
    }, []); 

    console.log("CoreProviders: convexClient instance:", convexClient); 

    return (
        <ConvexProvider client={convexClient}>
            <ConvexStatusCheck /> 
            <AuthProvider>
                {children}
            </AuthProvider>
        </ConvexProvider>
    );
}
