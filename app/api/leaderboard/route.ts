import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // In production, this would query the leaderboard materialized view from Supabase
    // For now, return a placeholder response
    // The client-side leaderboard uses localStorage data

    return Response.json({
      leaderboard: [],
      message: "Connect Supabase to enable server-side leaderboard",
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return Response.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
