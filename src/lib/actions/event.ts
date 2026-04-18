"use server";

import { revalidatePath } from "next/cache";
import { eq, and, isNull } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { events, memberships } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";
import { postEventCaptureSchema } from "@/lib/validations/event";

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
