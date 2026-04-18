"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { updateProfileSchema } from "@/lib/validations/user";
import type { ActionResult } from "@/types/actions";

export async function updateProfile(
  input: unknown,
): Promise<ActionResult<void>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await db.update(users).set({
    name: parsed.data.name,
    pacePreference: parsed.data.pacePreference ?? null,
  }).where(eq(users.id, user.id));

  revalidatePath("/profile");
  return { success: true, data: undefined };
}
