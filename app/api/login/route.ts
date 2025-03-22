import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api"; // Adjust path based on your structure
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const loginResult = await convex.mutation(api.auth.login, { email, password });

    return NextResponse.json(loginResult);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Login failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}