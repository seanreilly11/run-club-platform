import { db } from "@/lib/db";
import { memberships, communities } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

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
