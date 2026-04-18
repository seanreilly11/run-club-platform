import { db } from "@/lib/db";
import {
  memberships,
  communities,
  memberAttendanceStats,
  users,
} from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

export type MemberRole = "owner" | "admin" | "member" | "waitlisted";

export type UserMembership = {
  role: MemberRole;
  community: {
    id: string;
    slug: string;
    name: string;
    tier: "free" | "pro";
  };
};

export type DashboardMemberRow = {
  userId: string;
  name: string;
  role: "owner" | "admin" | "member" | "waitlisted";
  joinedAt: Date;
  eventsAttended: number;
  showRate: string | null;
  currentStreak: number;
  status: "new" | "active" | "at_risk" | "lapsed" | null;
  preferredPaceGroup: string | null;
};

/**
 * Get the authenticated user's membership for a community identified by slug.
 * Returns null if the user has no membership for that community.
 */
export async function getUserMembership(
  userId: string,
  communitySlug: string,
): Promise<UserMembership | null> {
  const results = await db
    .select({
      role: memberships.role,
      communityId: communities.id,
      communitySlug: communities.slug,
      communityName: communities.name,
      communityTier: communities.tier,
    })
    .from(memberships)
    .innerJoin(communities, eq(memberships.communityId, communities.id))
    .where(
      and(eq(memberships.userId, userId), eq(communities.slug, communitySlug)),
    )
    .limit(1);

  if (!results.length) return null;

  const row = results[0];
  return {
    role: row.role,
    community: {
      id: row.communityId,
      slug: row.communitySlug,
      name: row.communityName,
      tier: row.communityTier,
    },
  };
}

export async function getUserMemberships(
  userId: string,
): Promise<UserMembership[]> {
  const results = await db
    .select({
      role: memberships.role,
      communityId: communities.id,
      communitySlug: communities.slug,
      communityName: communities.name,
      communityTier: communities.tier,
      memberCount: communities.memberCount,
    })
    .from(memberships)
    .innerJoin(communities, eq(memberships.communityId, communities.id))
    .where(eq(memberships.userId, userId));

  return results.map((row) => ({
    role: row.role,
    community: {
      id: row.communityId,
      slug: row.communitySlug,
      name: row.communityName,
      tier: row.communityTier,
      memberCount: row.memberCount,
    },
  }));
}

export async function isUserAnOwnerOrAdminOfAnyCommunity(
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) return false;
  const results = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        inArray(memberships.role, ["owner", "admin"]),
      ),
    )
    .limit(1);
  return !!results.length;
}

export async function getDashboardMembers(
  communityId: string,
): Promise<DashboardMemberRow[]> {
  const rows = await db
    .select({
      userId: memberships.userId,
      name: users.name,
      role: memberships.role,
      joinedAt: memberships.joinedAt,
      eventsAttended: memberAttendanceStats.eventsAttended,
      showRate: memberAttendanceStats.showRate,
      currentStreak: memberAttendanceStats.currentStreak,
      status: memberAttendanceStats.status,
      preferredPaceGroup: memberAttendanceStats.preferredPaceGroup,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .leftJoin(
      memberAttendanceStats,
      and(
        eq(memberAttendanceStats.userId, memberships.userId),
        eq(memberAttendanceStats.communityId, communityId),
      ),
    )
    .where(eq(memberships.communityId, communityId))
    .orderBy(memberships.joinedAt);

  return rows.map((r) => ({
    userId: r.userId,
    name: r.name,
    role: r.role,
    joinedAt: r.joinedAt,
    eventsAttended: r.eventsAttended ?? 0,
    showRate: r.showRate,
    currentStreak: r.currentStreak ?? 0,
    status: r.status ?? null,
    preferredPaceGroup: r.preferredPaceGroup ?? null,
  }));
}

export async function getWaitlistedCount(communityId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(memberships)
    .where(
      and(
        eq(memberships.communityId, communityId),
        eq(memberships.role, "waitlisted"),
      ),
    );
  return rows[0]?.count ?? 0;
}
