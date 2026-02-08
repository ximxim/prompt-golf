import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would save to Supabase
    // For now, attempts are managed client-side via localStorage
    return Response.json({
      success: true,
      message: "Attempt recorded (server-side storage requires Supabase)",
      attempt: body,
    });
  } catch (error) {
    console.error("Attempt save error:", error);
    return Response.json(
      { error: "Failed to save attempt" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, this would query attempts from Supabase
    return Response.json({
      attempts: [],
      message: "Connect Supabase to enable server-side attempt history",
    });
  } catch (error) {
    console.error("Attempts fetch error:", error);
    return Response.json(
      { error: "Failed to load attempts" },
      { status: 500 }
    );
  }
}
