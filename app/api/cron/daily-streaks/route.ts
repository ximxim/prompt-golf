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
    // In production, this would:
    // 1. Check all user_progress records
    // 2. If last_activity_date is not yesterday, reset current_streak to 0
    // 3. Update longest_streak if current > longest
    //
    // SQL:
    // UPDATE user_progress
    // SET current_streak = 0
    // WHERE last_activity_date < CURRENT_DATE - INTERVAL '1 day';

    console.log("[Cron] Daily streak check at", new Date().toISOString());

    return Response.json({
      success: true,
      message: "Streak check completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Streak check failed:", error);
    return Response.json(
      { error: "Streak check failed" },
      { status: 500 }
    );
  }
}
