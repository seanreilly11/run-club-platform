"use server";

import { revalidatePath } from "next/cache";
import { eq, and, sql } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { communities, memberships, events, eventRsvps } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

// ─── createRsvp ───────────────────────────────────────────────────────────────

export async function createRsvp(input: {
  eventId: string;
  status: "going" | "maybe";
  paceGroup?: string;
  communitySlug: string;
}): Promise<ActionResult<{ rsvpId: string; autoJoined: boolean }>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Validate
  if (!input.eventId || typeof input.eventId !== "string") {
    return { success: false, error: "Invalid input" };
  }
  if (input.status !== "going" && input.status !== "maybe") {
    return { success: false, error: "Invalid input" };
  }

  // 3. Fetch event
  const eventRows = await db
    .select()
    .from(events)
    .where(eq(events.id, input.eventId))
    .limit(1);

  const event = eventRows[0];
  if (!event || event.status !== "upcoming") {
    return {
      success: false,
      error: "Event not found or no longer accepting RSVPs",
    };
  }

  // 4. Fetch community
  const communityRows = await db
    .select()
    .from(communities)
    .where(eq(communities.id, event.communityId))
    .limit(1);

  const community = communityRows[0];

  // 5. Free tier cap check
  if (community && community.tier === "free" && community.memberCount >= 30) {
    const existingMembership = await db
      .select({ role: memberships.role })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, user.id),
          eq(memberships.communityId, event.communityId),
        ),
      )
      .limit(1);

    if (!existingMembership.length) {
      return {
        success: false,
        error:
          "This club is at capacity. Join the waitlist to get notified when a spot opens.",
      };
    }
  }

  // 6. Duplicate RSVP check
  const existingRsvp = await db
    .select({ id: eventRsvps.id })
    .from(eventRsvps)
    .where(
      and(
        eq(eventRsvps.eventId, input.eventId),
        eq(eventRsvps.userId, user.id),
      ),
    )
    .limit(1);

  if (existingRsvp.length > 0) {
    return { success: false, error: "Already RSVP'd to this event" };
  }

  // 7. Check membership
  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, user.id),
        eq(memberships.communityId, event.communityId),
      ),
    )
    .limit(1);

  const membership = membershipRows[0];

  // 8. Transaction
  let rsvpId = "";
  let autoJoined = false;

  await db.transaction(async (tx) => {
    if (!membership) {
      await tx.insert(memberships).values({
        userId: user.id,
        communityId: event.communityId,
        role: "member",
      });
      await tx
        .update(communities)
        .set({ memberCount: sql`member_count + 1` })
        .where(eq(communities.id, event.communityId));
      autoJoined = true;
    }

    const [rsvp] = await tx
      .insert(eventRsvps)
      .values({
        eventId: input.eventId,
        userId: user.id,
        status: input.status,
        paceGroup: input.paceGroup ?? null,
      })
      .returning({ id: eventRsvps.id });

    rsvpId = rsvp.id;
  });

  // 9. Revalidate
  revalidatePath(`/${input.communitySlug}`);

  // 10. Return
  return { success: true, data: { rsvpId, autoJoined } };
}

// ─── updateRsvpAfters ─────────────────────────────────────────────────────────

export async function updateRsvpAfters(input: {
  eventId: string;
  joiningSocial: boolean;
  communitySlug: string;
}): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Update
  await db
    .update(eventRsvps)
    .set({ joiningSocial: input.joiningSocial })
    .where(
      and(
        eq(eventRsvps.eventId, input.eventId),
        eq(eventRsvps.userId, user.id),
      ),
    );

  // 3. Revalidate
  revalidatePath(`/${input.communitySlug}`);

  return { success: true, data: undefined };
}

// ─── updateRsvpPaceGroup ──────────────────────────────────────────────────────

export async function updateRsvpPaceGroup(input: {
  eventId: string;
  paceGroup: string | null;
  communitySlug: string;
}): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Update
  await db
    .update(eventRsvps)
    .set({ paceGroup: input.paceGroup })
    .where(
      and(
        eq(eventRsvps.eventId, input.eventId),
        eq(eventRsvps.userId, user.id),
      ),
    );

  // 3. Revalidate
  revalidatePath(`/${input.communitySlug}`);

  return { success: true, data: undefined };
}

// ─── updateRsvpStatus ────────────────────────────────────────────────────────

export async function updateRsvpStatus(input: {
  eventId: string;
  status: "going" | "maybe";
  communitySlug: string;
}): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  await db
    .update(eventRsvps)
    .set({ status: input.status })
    .where(
      and(
        eq(eventRsvps.eventId, input.eventId),
        eq(eventRsvps.userId, user.id),
      ),
    );

  revalidatePath(`/${input.communitySlug}`);
  return { success: true, data: undefined };
}

// ─── withdrawRsvp ─────────────────────────────────────────────────────────────

export async function withdrawRsvp(input: {
  eventId: string;
  communitySlug: string;
}): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Delete
  await db
    .delete(eventRsvps)
    .where(
      and(
        eq(eventRsvps.eventId, input.eventId),
        eq(eventRsvps.userId, user.id),
      ),
    );

  // 3. Revalidate
  revalidatePath(`/${input.communitySlug}`);

  return { success: true, data: undefined };
}

// ─── joinClub ─────────────────────────────────────────────────────────────────

export async function joinClub(input: {
  communityId: string;
  communitySlug: string;
}): Promise<ActionResult<{ waitlisted: boolean }>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Fetch community — verify isActive
  const communityRows = await db
    .select()
    .from(communities)
    .where(eq(communities.id, input.communityId))
    .limit(1);

  const community = communityRows[0];
  if (!community || !community.isActive) {
    return { success: false, error: "Club not found or no longer active" };
  }

  // 3. Check if already a member (any role including waitlisted)
  const existingMembership = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, user.id),
        eq(memberships.communityId, input.communityId),
      ),
    )
    .limit(1);

  if (existingMembership.length > 0) {
    return { success: false, error: "Already a member of this club" };
  }

  // 4. Cap check
  const atCap = community.tier === "free" && community.memberCount >= 30;

  if (atCap) {
    // 5. Insert waitlisted
    await db.insert(memberships).values({
      userId: user.id,
      communityId: input.communityId,
      role: "waitlisted",
    });

    revalidatePath(`/${input.communitySlug}`);
    return { success: true, data: { waitlisted: true } };
  }

  // 6. Insert member + increment count
  await db.transaction(async (tx) => {
    await tx.insert(memberships).values({
      userId: user.id,
      communityId: input.communityId,
      role: "member",
    });
    await tx
      .update(communities)
      .set({ memberCount: sql`member_count + 1` })
      .where(eq(communities.id, input.communityId));
  });

  // 7. Revalidate
  revalidatePath(`/${input.communitySlug}`);

  return { success: true, data: { waitlisted: false } };
}
