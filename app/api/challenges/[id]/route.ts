import { challengeRegistry } from "@/lib/challenges/registry";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await challengeRegistry.initialize();
    const { id } = await params;

    const challenge = challengeRegistry.get(id);
    if (!challenge) {
      return Response.json({ error: "Challenge not found" }, { status: 404 });
    }

    return Response.json({ challenge });
  } catch (error) {
    console.error("Failed to load challenge:", error);
    return Response.json(
      { error: "Failed to load challenge" },
      { status: 500 }
    );
  }
}
