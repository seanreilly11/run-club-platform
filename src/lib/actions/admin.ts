"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { communities, memberships, users } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

const inviteAdminSchema = z.object({
  communitySlug: z.string(),
  email: z.string().email("Invalid email address"),
});

const removeAdminSchema = z.object({
  communitySlug: z.string(),
  userId: z.string().uuid(),
});

export async function inviteAdmin(
  input: unknown,
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = inviteAdminSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { communitySlug, email } = parsed.data;

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
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, communityId)))
    .limit(1);
  if (!membershipRows[0] || membershipRows[0].role !== "owner")
    return { success: false, error: "Only the owner can invite admins" };

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length) {
    const targetUserId = existingUser[0].id;
    const existingMembership = await db
      .select({ role: memberships.role })
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.communityId, communityId)))
      .limit(1);

    if (existingMembership.length) {
      if (["owner", "admin"].includes(existingMembership[0].role))
        return { success: false, error: "This person is already an admin" };
      await db
        .update(memberships)
        .set({ role: "admin" })
        .where(and(eq(memberships.userId, targetUserId), eq(memberships.communityId, communityId)));
    } else {
      await db.insert(memberships).values({
        userId: targetUserId,
        communityId,
        role: "admin",
      });
    }
  }
  // TODO: send invite email via Resend for users not yet registered

  revalidatePath(`/dashboard/${communitySlug}/settings/team`);
  return { success: true, data: undefined };
}

export async function removeAdmin(
  input: unknown,
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = removeAdminSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { communitySlug, userId: targetUserId } = parsed.data;

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
    .where(and(eq(memberships.userId, user.id), eq(memberships.communityId, communityId)))
    .limit(1);
  if (!membershipRows[0] || membershipRows[0].role !== "owner")
    return { success: false, error: "Only the owner can remove admins" };

  await db
    .update(memberships)
    .set({ role: "member" })
    .where(and(eq(memberships.userId, targetUserId), eq(memberships.communityId, communityId)));

  revalidatePath(`/dashboard/${communitySlug}/settings/team`);
  return { success: true, data: undefined };
}
