import { db } from "@/lib/db";
import { eq, and, gte, sql, desc, isNull } from "drizzle-orm";
import { events, eventRsvps, users, communities, memberships } from "@/lib/db/schema";
import type { EventRsvp } from "@/lib/db/schema";

export type UpcomingEventRow = {
  id: string;
  title: string;
  date: Date;
  distanceKm: string | null;
  distanceUnit: "km" | "mi";
  meetingPointName: string;
  meetingPointLat: string | null;
  meetingPointLng: string | null;
  postRunVenueName: string | null;
  postRunVenueUrl: string | null;
  postRunVenueNotes: string | null;
  paceGroups: Array<{ name: string; pace: string }> | null;
  isRecurring: boolean;
  goingCount: number;
  aftersCount: number;
};

export type DashboardEventRow = {
  id: string;
  title: string;
  date: Date;
  status: "upcoming" | "completed" | "cancelled";
  goingCount: number;
  actualAttendance: number | null;
  actualSocialAttendance: number | null;
  distanceKm: string | null;
  distanceUnit: "km" | "mi";
  postRunVenueName: string | null;
};

export type UncapturedEventRow = {
  id: string;
  title: string;
  date: Date;
};

export type AttendanceHistoryRow = {
  id: string;
  title: string;
  date: Date;
  goingCount: number;
  actualAttendance: number | null;
  actualSocialAttendance: number | null;
};

export async function getUpcomingEvents(
  communityId: string,
  limit?: number,
): Promise<UpcomingEventRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;
  const aftersCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.joiningSocial} = true AND ${eventRsvps.status} = 'going')::int`;

  const results = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      distanceKm: events.distanceKm,
      distanceUnit: events.distanceUnit,
      meetingPointName: events.meetingPointName,
      meetingPointLat: events.meetingPointLat,
      meetingPointLng: events.meetingPointLng,
      postRunVenueName: events.postRunVenueName,
      postRunVenueUrl: events.postRunVenueUrl,
      postRunVenueNotes: events.postRunVenueNotes,
      paceGroups: events.paceGroups,
      isRecurring: events.isRecurring,
      goingCount,
      aftersCount,
    })
    .from(events)
    .where(
      and(
        eq(events.communityId, communityId),
        eq(events.status, "upcoming"),
        gte(events.date, new Date()),
      ),
    )
    .orderBy(events.date)
    .limit(limit ?? 10);

  return results;
}

export async function getNextEvent(
  communityId: string,
): Promise<UpcomingEventRow | null> {
  const results = await getUpcomingEvents(communityId, 1);
  return results[0] ?? null;
}

export type EventDetailRow = {
  id: string;
  communityId: string;
  title: string;
  description: string | null;
  date: Date;
  meetingPointName: string;
  meetingPointLat: string | null;
  meetingPointLng: string | null;
  distanceKm: string | null;
  distanceUnit: "km" | "mi";
  routeUrl: string | null;
  paceGroups: Array<{ name: string; pace: string }> | null;
  postRunVenueName: string | null;
  postRunVenueUrl: string | null;
  postRunVenueNotes: string | null;
  isRecurring: boolean;
  status: "upcoming" | "completed" | "cancelled";
  goingCount: number;
  aftersCount: number;
};

export type EventAttendeeRow = {
  userId: string;
  name: string;
  paceGroup: string | null;
  joiningSocial: boolean;
};

export async function getEventById(
  eventId: string,
): Promise<EventDetailRow | null> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;
  const aftersCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.joiningSocial} = true AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      communityId: events.communityId,
      title: events.title,
      description: events.description,
      date: events.date,
      meetingPointName: events.meetingPointName,
      meetingPointLat: events.meetingPointLat,
      meetingPointLng: events.meetingPointLng,
      distanceKm: events.distanceKm,
      distanceUnit: events.distanceUnit,
      routeUrl: events.routeUrl,
      paceGroups: events.paceGroups,
      postRunVenueName: events.postRunVenueName,
      postRunVenueUrl: events.postRunVenueUrl,
      postRunVenueNotes: events.postRunVenueNotes,
      isRecurring: events.isRecurring,
      status: events.status,
      goingCount,
      aftersCount,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  return rows[0] ?? null;
}

export async function getEventAttendees(
  eventId: string,
  limit = 20,
): Promise<EventAttendeeRow[]> {
  const rows = await db
    .select({
      userId: eventRsvps.userId,
      name: users.name,
      paceGroup: eventRsvps.paceGroup,
      joiningSocial: eventRsvps.joiningSocial,
    })
    .from(eventRsvps)
    .innerJoin(users, eq(eventRsvps.userId, users.id))
    .where(eq(eventRsvps.eventId, eventId))
    .orderBy(eventRsvps.createdAt)
    .limit(limit);

  return rows;
}

export async function getUserRsvpForEvent(
  eventId: string,
  userId: string,
): Promise<EventRsvp | null> {
  const results = await db
    .select()
    .from(eventRsvps)
    .where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.userId, userId)))
    .limit(1);

  return results[0] ?? null;
}

export async function getDashboardEvents(
  communityId: string,
): Promise<DashboardEventRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      status: events.status,
      goingCount,
      actualAttendance: events.actualAttendance,
      actualSocialAttendance: events.actualSocialAttendance,
      distanceKm: events.distanceKm,
      distanceUnit: events.distanceUnit,
      postRunVenueName: events.postRunVenueName,
    })
    .from(events)
    .where(eq(events.communityId, communityId))
    .orderBy(desc(events.date));

  return rows;
}

export async function getLastUncapturedEvent(
  communityId: string,
): Promise<UncapturedEventRow | null> {
  const rows = await db
    .select({ id: events.id, title: events.title, date: events.date })
    .from(events)
    .where(
      and(
        eq(events.communityId, communityId),
        eq(events.status, "completed"),
        isNull(events.actualAttendance),
      ),
    )
    .orderBy(desc(events.date))
    .limit(1);

  return rows[0] ?? null;
}

export async function getAttendanceHistory(
  communityId: string,
  limit = 12,
): Promise<AttendanceHistoryRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      goingCount,
      actualAttendance: events.actualAttendance,
      actualSocialAttendance: events.actualSocialAttendance,
    })
    .from(events)
    .where(
      and(eq(events.communityId, communityId), eq(events.status, "completed")),
    )
    .orderBy(events.date)
    .limit(limit);

  return rows;
}

export type UpcomingMemberEventRow = {
  id: string;
  title: string;
  date: Date;
  distanceKm: string | null;
  distanceUnit: "km" | "mi";
  postRunVenueName: string | null;
  communityName: string;
  communitySlug: string;
  communityPostRunDefault: "pub" | "coffee" | "brunch" | "none";
  communityTimezone: string;
  rsvpStatus: "going" | "maybe" | null;
  rsvpJoiningSocial: boolean;
  goingCount: number;
  aftersCount: number;
};

export async function getUpcomingEventsForMember(
  userId: string,
  limit = 10,
): Promise<UpcomingMemberEventRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;
  const aftersCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.joiningSocial} = true AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      distanceKm: events.distanceKm,
      distanceUnit: events.distanceUnit,
      postRunVenueName: events.postRunVenueName,
      communityName: communities.name,
      communitySlug: communities.slug,
      communityPostRunDefault: communities.postRunDefault,
      communityTimezone: communities.timezone,
      rsvpStatus: eventRsvps.status,
      rsvpJoiningSocial: eventRsvps.joiningSocial,
      goingCount,
      aftersCount,
    })
    .from(memberships)
    .innerJoin(communities, eq(memberships.communityId, communities.id))
    .innerJoin(
      events,
      and(
        eq(events.communityId, communities.id),
        eq(events.status, "upcoming"),
        gte(events.date, new Date()),
      ),
    )
    .leftJoin(
      eventRsvps,
      and(eq(eventRsvps.eventId, events.id), eq(eventRsvps.userId, userId)),
    )
    .where(eq(memberships.userId, userId))
    .orderBy(events.date)
    .limit(limit);

  return rows.map((r) => ({
    ...r,
    rsvpJoiningSocial: r.rsvpJoiningSocial ?? false,
  }));
}
