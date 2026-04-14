import { z } from "zod";

const envSchema = z.object({
  // ─── Public (safe to expose to browser) ───
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.url(),

  // ─── Server-only (NEVER use in Client Components) ───
  DATABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  RESEND_API_KEY: z.string().startsWith("re_"),
  CRON_SECRET: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

/**
 * Parsed + validated environment variables.
 * Import this — never access process.env directly in application code.
 * This throws at startup if any required variable is missing or invalid.
 */
export const env = envSchema.parse(process.env);
