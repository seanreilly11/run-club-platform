import { db } from "@/lib/db";
import { eq, and, inArray, sql, ilike, or, desc, asc } from "drizzle-orm";
import {
  communities,
  communityStats,
  memberships,
  users,
  memberAttendanceStats,
  events,
  eventRsvps,
} from "@/lib/db/schema";
import type { Community, CommunityStats } from "@/lib/db/schema";
import type { SQL } from "drizzle-orm";

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

// ─── Explore clubs ────────────────────────────────────────────────────────────

export type ExploreFilters = {
  city?: string;
  vibe?: "competitive" | "social" | "casual";
  afters?: "pub" | "coffee" | "brunch";
  sort?: "members" | "soonest" | "newest";
  search?: string;
};

export type ExploreClubRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  city: string;
  vibe: "competitive" | "social" | "casual";
  postRunDefault: "pub" | "coffee" | "brunch" | "none";
  instagramHandle: string | null;
  memberCount: number;
  tier: "free" | "pro";
  locationLat: string | null;
  locationLng: string | null;
  streakRecord: number;
  nextEvent: {
    id: string;
    title: string;
    date: Date;
    distanceKm: string | null;
    distanceUnit: "km" | "mi";
    meetingPointName: string;
    meetingPointLat: string | null;
    meetingPointLng: string | null;
    postRunVenueName: string | null;
    goingCount: number;
  } | null;
};

type NextEventRow = {
  id: string;
  community_id: string;
  title: string;
  date: Date;
  distance_km: string | null;
  distance_unit: string;
  meeting_point_name: string;
  meeting_point_lat: string | null;
  meeting_point_lng: string | null;
  post_run_venue_name: string | null;
};

type GoingCountRow = {
  eventId: string;
  count: number;
};

export async function getExploreClubs(
  filters: ExploreFilters = {},
): Promise<ExploreClubRow[]> {
  // ── Step 1: Query communities with filters + sort ─────────────────────────
  const conditions: SQL[] = [
    eq(communities.isActive, true),
    eq(communities.type, "run_club"),
  ];

  if (filters.city) {
    conditions.push(ilike(communities.city, `%${filters.city}%`));
  }
  if (filters.vibe) {
    conditions.push(eq(communities.vibe, filters.vibe));
  }
  if (filters.afters) {
    conditions.push(eq(communities.postRunDefault, filters.afters));
  }
  if (filters.search) {
    conditions.push(
      or(
        ilike(communities.name, `%${filters.search}%`),
        ilike(communities.city, `%${filters.search}%`),
        ilike(communities.description, `%${filters.search}%`),
      ) as SQL,
    );
  }

  // Pro-first sort expression
  const proFirst = sql<number>`CASE WHEN ${communities.tier} = 'pro' THEN 0 ELSE 1 END`;

  let secondaryOrder;
  if (filters.sort === "newest") {
    secondaryOrder = desc(communities.createdAt);
  } else {
    // "members" (default) and "soonest" both sort by memberCount desc initially
    secondaryOrder = desc(communities.memberCount);
  }

  const clubRows = await db
    .select({
      id: communities.id,
      slug: communities.slug,
      name: communities.name,
      description: communities.description,
      city: communities.city,
      vibe: communities.vibe,
      postRunDefault: communities.postRunDefault,
      instagramHandle: communities.instagramHandle,
      memberCount: communities.memberCount,
      tier: communities.tier,
      locationLat: communities.locationLat,
      locationLng: communities.locationLng,
      streakRecord: sql<number>`COALESCE(${communityStats.streakRecord}, 0)`.mapWith(Number),
    })
    .from(communities)
    .leftJoin(communityStats, eq(communityStats.communityId, communities.id))
    .where(and(...conditions))
    .orderBy(proFirst, secondaryOrder);

  if (clubRows.length === 0) {
    return [];
  }

  const communityIds = clubRows.map((c) => c.id);

  // ── Step 2: Get next upcoming event per community via DISTINCT ON ─────────
  const idList = sql.join(
    communityIds.map((id) => sql`${id}::uuid`),
    sql`, `,
  );

  // postgres-js driver returns a RowList which is array-like directly
  const nextEventsResult = await db.execute<NextEventRow>(sql`
    SELECT DISTINCT ON (community_id)
      id::text, community_id::text, title, date,
      distance_km::text, distance_unit::text,
      meeting_point_name,
      meeting_point_lat::text, meeting_point_lng::text,
      post_run_venue_name
    FROM events
    WHERE community_id IN (${idList})
      AND status = 'upcoming'
      AND date >= NOW()
    ORDER BY community_id, date ASC
  `);

  const nextEventRows: NextEventRow[] = Array.from(nextEventsResult);

  // ── Step 3: Get going counts for those event IDs ──────────────────────────
  const eventIds = nextEventRows.map((e) => e.id);

  let goingCounts: GoingCountRow[] = [];
  if (eventIds.length > 0) {
    const goingRows = await db
      .select({
        eventId: eventRsvps.eventId,
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(eventRsvps)
      .where(
        and(
          inArray(eventRsvps.eventId, eventIds),
          eq(eventRsvps.status, "going"),
        ),
      )
      .groupBy(eventRsvps.eventId);

    goingCounts = goingRows.map((r) => ({
      eventId: r.eventId,
      count: r.count,
    }));
  }

  // ── Step 4: Merge ──────────────────────────────────────────────────────────
  const nextEventMap = new Map<string, NextEventRow>(
    nextEventRows.map((e) => [e.community_id, e]),
  );
  const goingCountMap = new Map<string, number>(
    goingCounts.map((g) => [g.eventId, g.count]),
  );

  const merged: ExploreClubRow[] = clubRows.map((club) => {
    const nextEventRow = nextEventMap.get(club.id);
    const nextEvent = nextEventRow
      ? {
          id: nextEventRow.id,
          title: nextEventRow.title,
          date: new Date(nextEventRow.date),
          distanceKm: nextEventRow.distance_km,
          distanceUnit: nextEventRow.distance_unit as "km" | "mi",
          meetingPointName: nextEventRow.meeting_point_name,
          meetingPointLat: nextEventRow.meeting_point_lat,
          meetingPointLng: nextEventRow.meeting_point_lng,
          postRunVenueName: nextEventRow.post_run_venue_name,
          goingCount: goingCountMap.get(nextEventRow.id) ?? 0,
        }
      : null;

    return {
      id: club.id,
      slug: club.slug,
      name: club.name,
      description: club.description,
      city: club.city,
      vibe: club.vibe,
      postRunDefault: club.postRunDefault,
      instagramHandle: club.instagramHandle,
      memberCount: club.memberCount,
      tier: club.tier,
      locationLat: club.locationLat ?? null,
      locationLng: club.locationLng ?? null,
      streakRecord: club.streakRecord,
      nextEvent,
    };
  });

  // ── Soonest sort: re-sort in JS after merging ─────────────────────────────
  if (filters.sort === "soonest") {
    merged.sort((a, b) => {
      // Pro first
      if (a.tier !== b.tier) {
        return a.tier === "pro" ? -1 : 1;
      }
      // Clubs with no next event go to end
      if (!a.nextEvent && !b.nextEvent) return 0;
      if (!a.nextEvent) return 1;
      if (!b.nextEvent) return -1;
      return a.nextEvent.date.getTime() - b.nextEvent.date.getTime();
    });
  }

  return merged;
}
