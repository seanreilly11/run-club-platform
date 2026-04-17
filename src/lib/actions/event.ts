"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { events, memberships } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

export async function savePostEventCapture(input: {
  eventId: string;
  communitySlug: string;
  actualAttendance: number;
  actualSocialAttendance: number;
}): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Verify user is owner/admin of the event's community
  const eventRows = await db
    .select({ communityId: events.communityId })
    .from(events)
    .where(eq(events.id, input.eventId))
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

  // 3. Validate
  if (
    typeof input.actualAttendance !== "number" ||
    input.actualAttendance < 0 ||
    typeof input.actualSocialAttendance !== "number" ||
    input.actualSocialAttendance < 0 ||
    input.actualSocialAttendance > input.actualAttendance
  ) {
    return { success: false, error: "Invalid attendance numbers" };
  }

  // 4. Update
  await db
    .update(events)
    .set({
      actualAttendance: input.actualAttendance,
      actualSocialAttendance: input.actualSocialAttendance,
      status: "completed",
    })
    .where(eq(events.id, input.eventId));

  revalidatePath(`/dashboard/${input.communitySlug}`);
  return { success: true, data: undefined };
}
