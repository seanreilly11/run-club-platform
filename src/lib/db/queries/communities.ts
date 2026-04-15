import { db } from "@/lib/db";
import { eq, and, inArray, sql } from "drizzle-orm";
import {
  communities,
  communityStats,
  memberships,
  users,
  memberAttendanceStats,
} from "@/lib/db/schema";
import type { Community, CommunityStats } from "@/lib/db/schema";

export async function getClubBySlug(slug: string): Promise<Community | null> {
  const results = await db
    .select()
    .from(communities)
    .where(and(eq(communities.slug, slug), eq(communities.isActive, true)))
    .limit(1);

  return results[0] ?? null;
}

export async function getCommunityStats(
  communityId: string,
): Promise<CommunityStats | null> {
  const results = await db
    .select()
    .from(communityStats)
    .where(eq(communityStats.communityId, communityId))
    .limit(1);

  return results[0] ?? null;
}

export type ActiveMemberRow = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  eventsAttended: number;
  totalDistanceKm: string; // numeric comes back as string from Drizzle
  currentStreak: number;
  preferredPaceGroup: string | null;
};

export async function getActiveMembers(
  communityId: string,
): Promise<ActiveMemberRow[]> {
  const results = await db
    .select({
      userId: memberships.userId,
      name: users.name,
      avatarUrl: users.avatarUrl,
      eventsAttended: sql<number>`COALESCE(${memberAttendanceStats.eventsAttended}, 0)`.mapWith(
        Number,
      ),
      totalDistanceKm: sql<string>`COALESCE(${memberAttendanceStats.totalDistanceKm}, '0')`,
      currentStreak: sql<number>`COALESCE(${memberAttendanceStats.currentStreak}, 0)`.mapWith(
        Number,
      ),
      preferredPaceGroup: memberAttendanceStats.preferredPaceGroup,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .leftJoin(
      memberAttendanceStats,
      and(
        eq(memberAttendanceStats.userId, memberships.userId),
        eq(memberAttendanceStats.communityId, memberships.communityId),
      ),
    )
    .where(
      and(
        eq(memberships.communityId, communityId),
        inArray(memberships.role, ["owner", "admin", "member"]),
      ),
    )
    .orderBy(
      sql`COALESCE(${memberAttendanceStats.eventsAttended}, 0) DESC`,
    )
    .limit(20);

  return results;
}
