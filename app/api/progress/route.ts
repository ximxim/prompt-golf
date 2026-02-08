import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // In production, this would query user_progress from Supabase
    // For now, progress is managed client-side via localStorage

    return Response.json({
      progress: null,
      message: "Connect Supabase to enable server-side progress tracking",
    });
  } catch (error) {
    console.error("Progress error:", error);
    return Response.json(
      { error: "Failed to load progress" },
      { status: 500 }
    );
  }
}
