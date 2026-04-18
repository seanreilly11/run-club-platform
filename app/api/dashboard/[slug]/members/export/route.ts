import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type FilterParam = "all" | "active" | "at_risk" | "lapsed" | "new";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const user = await getAuthUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const community = await getClubBySlug(slug);
  if (!community) return new NextResponse("Not found", { status: 404 });

  if (community.tier === "free")
    return new NextResponse("Pro feature", { status: 403 });

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, community.id)))
    .limit(1);
  if (!membershipRows[0] || !["owner", "admin"].includes(membershipRows[0].role))
    return new NextResponse("Forbidden", { status: 403 });

  const filter = (request.nextUrl.searchParams.get("filter") ?? "all") as FilterParam;
  const allMembers = await getDashboardMembers(community.id);

  const active = allMembers.filter((m) => m.role !== "waitlisted");
  const filtered = filter === "all"
    ? active
    : active.filter((m) => m.status === filter);

  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headers = ["Name", "Email", "Role", "Status", "Events Attended", "Show Rate", "Current Streak", "Pace Group", "Joined"];
  const rows = filtered.map((m) => [
    m.name,
    m.email,
    m.role,
    m.status ?? "",
    m.eventsAttended,
    m.showRate !== null ? `${Math.round(parseFloat(m.showRate) * 100)}%` : "",
    m.currentStreak,
    m.preferredPaceGroup ?? "",
    m.joinedAt.toISOString().split("T")[0],
  ].map(escape).join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${slug}-members.csv"`,
    },
  });
}
