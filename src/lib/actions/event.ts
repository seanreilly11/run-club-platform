"use server";

import { revalidatePath } from "next/cache";
import { eq, and, isNull } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { events, memberships, communities } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";
import {
  createEventSchema,
  postEventCaptureSchema,
  updateEventSchema,
  cancelEventSchema,
  duplicateEventSchema,
} from "@/lib/validations/event";

export async function createEvent(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Validate
  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const {
    communitySlug,
    date,
    time,
    distanceKm,
    routeUrl,
    postRunVenueName,
    postRunVenueUrl,
    postRunVenueNotes,
    description,
    recurrenceRule,
    paceGroups,
    ...rest
  } = parsed.data;

  // 3. Authorise — verify community exists and user is owner/admin
  const communityRows = await db
    .select({ id: communities.id })
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .limit(1);
  if (!communityRows.length) return { success: false, error: "Club not found" };
  const communityId = communityRows[0].id;

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, user.id),
        eq(memberships.communityId, communityId),
      ),
    )
    .limit(1);
  const membership = membershipRows[0];
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { success: false, error: "Not authorised" };
  }

  // 4. Combine date + time into a timestamp
  const eventDate = new Date(`${date}T${time}`);

  // 5. Insert
  const [event] = await db
    .insert(events)
    .values({
      communityId,
      title: rest.title,
      description: description || null,
      date: eventDate,
      meetingPointName: rest.meetingPointName,
      distanceKm: distanceKm || null,
      distanceUnit: rest.distanceUnit,
      routeUrl: routeUrl || null,
      paceGroups: paceGroups?.length ? paceGroups : null,
      postRunVenueName: postRunVenueName || null,
      postRunVenueUrl: postRunVenueUrl || null,
      postRunVenueNotes: postRunVenueNotes || null,
      isRecurring: rest.isRecurring,
      recurrenceRule: recurrenceRule || null,
    })
    .returning({ id: events.id });

  revalidatePath(`/dashboard/${communitySlug}/events`);
  revalidatePath(`/${communitySlug}`);

  return { success: true, data: { id: event.id } };
}

export async function savePostEventCapture(
  input: unknown,
): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Validate
  const parsed = postEventCaptureSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { eventId, communitySlug, actualAttendance, actualSocialAttendance } =
    parsed.data;

  // 3. Authorise — verify user is owner/admin of the event's community
  const eventRows = await db
    .select({ communityId: events.communityId })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!eventRows.length) return { success: false, error: "Event not found" };

  const { communityId } = eventRows[0];

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, user.id),
        eq(memberships.communityId, communityId),
      ),
    )
    .limit(1);

  const membership = membershipRows[0];
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { success: false, error: "Not authorised" };
  }

  // 4. Update — only applies when event is completed and not yet captured
  // Guard in WHERE prevents overwriting existing data or capturing upcoming events
  const result = await db
    .update(events)
    .set({ actualAttendance, actualSocialAttendance })
    .where(
      and(
        eq(events.id, eventId),
        eq(events.status, "completed"),
        isNull(events.actualAttendance),
      ),
    )
    .returning({ id: events.id });

  if (!result.length) {
    return {
      success: false,
      error: "Event is not in a capturable state (already captured or not completed)",
    };
  }

  // TODO: trigger community_stats recompute for communityId
  // The cron job that runs after event completion handles this. Once the stats
  // recompute pipeline is wired to Server Actions, call it here.

  revalidatePath(`/dashboard/${communitySlug}`);
  revalidatePath(`/dashboard/${communitySlug}/events`);
  revalidatePath(`/dashboard/${communitySlug}/analytics`);
  revalidatePath(`/${communitySlug}`);
  return { success: true, data: undefined };
}

export async function updateEvent(
  input: unknown,
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = updateEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const {
    eventId, communitySlug, date, time, paceGroups, routeUrl,
    postRunVenueName, postRunVenueUrl, postRunVenueNotes,
    description, distanceKm, ...rest
  } = parsed.data;

  const eventRows = await db
    .select({ communityId: events.communityId })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);
  if (!eventRows.length) return { success: false, error: "Event not found" };
  const { communityId } = eventRows[0];

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, communityId)))
    .limit(1);
  if (!membershipRows[0] || !["owner", "admin"].includes(membershipRows[0].role))
    return { success: false, error: "Not authorised" };

  const eventDate = new Date(`${date}T${time}`);
  await db.update(events).set({
    title: rest.title,
    date: eventDate,
    meetingPointName: rest.meetingPointName,
    distanceKm: distanceKm || null,
    distanceUnit: rest.distanceUnit,
    routeUrl: routeUrl || null,
    paceGroups: paceGroups?.length ? paceGroups : null,
    postRunVenueName: postRunVenueName || null,
    postRunVenueUrl: postRunVenueUrl || null,
    postRunVenueNotes: postRunVenueNotes || null,
    description: description || null,
  }).where(eq(events.id, eventId));

  revalidatePath(`/dashboard/${communitySlug}/events`);
  revalidatePath(`/${communitySlug}`);
  return { success: true, data: undefined };
}

export async function cancelEvent(
  input: unknown,
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = cancelEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { eventId, communitySlug } = parsed.data;

  const eventRows = await db
    .select({ communityId: events.communityId, status: events.status })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);
  if (!eventRows.length) return { success: false, error: "Event not found" };
  if (eventRows[0].status !== "upcoming")
    return { success: false, error: "Only upcoming events can be cancelled" };

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, eventRows[0].communityId)))
    .limit(1);
  if (!membershipRows[0] || !["owner", "admin"].includes(membershipRows[0].role))
    return { success: false, error: "Not authorised" };

  await db.update(events).set({ status: "cancelled" }).where(eq(events.id, eventId));
  revalidatePath(`/dashboard/${communitySlug}/events`);
  revalidatePath(`/dashboard/${communitySlug}`);
  revalidatePath(`/${communitySlug}`);
  return { success: true, data: undefined };
}

export async function duplicateEvent(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = duplicateEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { eventId, communitySlug } = parsed.data;

  const sourceRows = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!sourceRows.length) return { success: false, error: "Event not found" };
  const source = sourceRows[0];

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, source.communityId)))
    .limit(1);
  if (!membershipRows[0] || !["owner", "admin"].includes(membershipRows[0].role))
    return { success: false, error: "Not authorised" };

  const newDate = new Date(source.date);
  newDate.setDate(newDate.getDate() + 7);

  const [newEvent] = await db.insert(events).values({
    communityId: source.communityId,
    title: source.title,
    description: source.description,
    date: newDate,
    meetingPointName: source.meetingPointName,
    distanceKm: source.distanceKm,
    distanceUnit: source.distanceUnit,
    routeUrl: source.routeUrl,
    paceGroups: source.paceGroups as { name: string; pace: string }[] | null,
    postRunVenueName: source.postRunVenueName,
    postRunVenueUrl: source.postRunVenueUrl,
    postRunVenueNotes: source.postRunVenueNotes,
    isRecurring: false,
    status: "upcoming",
  }).returning({ id: events.id });

  revalidatePath(`/dashboard/${communitySlug}/events`);
  return { success: true, data: { id: newEvent.id } };
}
