import supabase from "../../../../../services/supabase";

export async function GET(request) {
  const authorization = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("subjects")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Supabase keep-alive failed:", error.message);
    return Response.json(
      { success: false, error: "Database ping failed" },
      { status: 500 },
    );
  }

  return Response.json({ success: true, checkedAt: new Date().toISOString() });
}
