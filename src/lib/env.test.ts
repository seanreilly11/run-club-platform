import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("env validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws when a required server env var is missing", async () => {
    delete process.env.SUPABASE_SECRET_KEY;
    await expect(import("./env")).rejects.toThrow();
  });

  it("throws when STRIPE_SECRET_KEY does not start with sk_", async () => {
    process.env.SUPABASE_SECRET_KEY = "test-service-key";
    process.env.STRIPE_SECRET_KEY = "not-a-stripe-key";
    await expect(import("./env")).rejects.toThrow();
  });
});
