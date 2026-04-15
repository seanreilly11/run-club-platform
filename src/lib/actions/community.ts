"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { communities, memberships } from "@/lib/db/schema";
import { getAuthUser } from "@/lib/supabase/server";
import {
  slugSchema,
  createCommunitySchema,
} from "@/lib/validations/community";
import type { ActionResult } from "@/types/actions";

// ─── checkSlugAvailability ────────────────────────────────────────────────────

export async function checkSlugAvailability(
  slug: string,
): Promise<ActionResult<{ available: boolean }>> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await db
    .select({ id: communities.id })
    .from(communities)
    .where(eq(communities.slug, parsed.data))
    .limit(1);

  return { success: true, data: { available: existing.length === 0 } };
}

// ─── createCommunity ──────────────────────────────────────────────────────────

export async function createCommunity(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Validate
  const parsed = createCommunitySchema.safeParse(input);
  if (!parsed.success) {
    const err = parsed.error.issues[0];
    return { success: false, error: err.message, field: err.path[0] as string };
  }

  const {
    name,
    slug,
    city,
    locationLat,
    locationLng,
    vibe,
    postRunDefault,
    instagramHandle,
    timezone,
  } = parsed.data;

  // 3. Server-side slug uniqueness check (race condition guard)
  const existing = await db
    .select({ id: communities.id })
    .from(communities)
    .where(eq(communities.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      error: "This URL is already taken. Please choose another.",
      field: "slug",
    };
  }

  // 4. Create community + owner membership in one transaction
  const community = await db.transaction(async (tx) => {
    const [newCommunity] = await tx
      .insert(communities)
      .values({
        name,
        slug,
        city,
        locationLat: locationLat?.toString(),
        locationLng: locationLng?.toString(),
        vibe,
        postRunDefault,
        instagramHandle: instagramHandle || null,
        timezone,
        ownerId: user.id,
        tier: "free",
        type: "run_club",
        isActive: true,
        memberCount: 1,
      })
      .returning({ id: communities.id, slug: communities.slug });

    await tx.insert(memberships).values({
      userId: user.id,
      communityId: newCommunity.id,
      role: "owner",
    });

    return newCommunity;
  });

  revalidatePath("/my-clubs");
  return { success: true, data: { id: community.id, slug: community.slug } };
}

// ─── updateCoverPhoto ─────────────────────────────────────────────────────────

export async function updateCoverPhoto(
  communityId: string,
  imageUrl: string,
): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Verify ownership
  const community = await db
    .select({ ownerId: communities.ownerId, slug: communities.slug })
    .from(communities)
    .where(eq(communities.id, communityId))
    .limit(1);

  if (!community.length || community[0].ownerId !== user.id) {
    return { success: false, error: "Not authorised" };
  }

  // 3. Update
  await db
    .update(communities)
    .set({ coverImageUrl: imageUrl })
    .where(eq(communities.id, communityId));

  revalidatePath("/my-clubs");
  revalidatePath(`/${community[0].slug}`);
  return { success: true, data: undefined };
}
