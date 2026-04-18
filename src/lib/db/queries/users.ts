import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string | null;
  pacePreference: string | null;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const rows = await db
    .select({
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      pacePreference: users.pacePreference,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}
