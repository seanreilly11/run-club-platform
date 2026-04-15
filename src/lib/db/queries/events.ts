import { db } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { events, eventRsvps } from "@/lib/db/schema";
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

export async function getUpcomingEvents(
  communityId: string,
  limit?: number,
): Promise<UpcomingEventRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM event_rsvps WHERE event_id = ${events.id} AND status = 'going')::int`;
  const aftersCount = sql<number>`(SELECT COUNT(*) FROM event_rsvps WHERE event_id = ${events.id} AND joining_social = true)::int`;

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
