"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import {
  emailSchema,
  signInSchema,
  signUpSchema,
  magicLinkSchema,
} from "@/lib/validations/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

// ─── checkEmail ───────────────────────────────────────────────────────────────

export async function checkEmail(
  input: unknown,
): Promise<ActionResult<{ exists: boolean }>> {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  return { success: true, data: { exists: existing.length > 0 } };
}

// ─── signIn ───────────────────────────────────────────────────────────────────

export async function signIn(input: unknown): Promise<ActionResult<void>> {
  const parsed = signInSchema.safeParse(
    typeof input === "object" && input !== null ? input : {},
  );
  if (!parsed.success) {
    const err = parsed.error.issues[0];
    return { success: false, error: err.message, field: err.path[0] as string };
  }

  const { email, password } = parsed.data;
  const redirectTo =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Invalid email or password" };
  }

  redirect(redirectTo);
}

// ─── signUp ───────────────────────────────────────────────────────────────────

export async function signUp(input: unknown): Promise<ActionResult<void>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const err = parsed.error.issues[0];
    return { success: false, error: err.message, field: err.path[0] as string };
  }

  const { email, password, name } = parsed.data;
  const redirectTo =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Could not create account",
    };
  }

  // Insert profile row — id matches Supabase auth user id
  await db.insert(users).values({
    id: data.user.id,
    email,
    name,
  });

  redirect(redirectTo);
}

// ─── sendMagicLink ────────────────────────────────────────────────────────────

export async function sendMagicLink(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = magicLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;
  const next =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { success: false, error: "Could not send magic link. Try again." };
  }

  return { success: true, data: undefined };
}

// ─── signOut ──────────────────────────────────────────────────────────────────

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
