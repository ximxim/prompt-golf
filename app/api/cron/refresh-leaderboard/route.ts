import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In production, this would refresh the materialized view:
    // await supabase.rpc('refresh_leaderboard')
    //
    // For now, this is a placeholder for when Supabase is connected.
    console.log("[Cron] Leaderboard refresh triggered at", new Date().toISOString());

    return Response.json({
      success: true,
      message: "Leaderboard refresh triggered",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Leaderboard refresh failed:", error);
    return Response.json(
      { error: "Refresh failed" },
      { status: 500 }
    );
  }
}
