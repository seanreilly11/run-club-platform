import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation before importing actions
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock the supabase server client factory
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
  createAdminClient: vi.fn(),
}));

// Mock drizzle db
vi.mock("@/lib/db", () => ({
  db: { insert: vi.fn() },
}));

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { checkEmail, signIn, signUp, sendMagicLink, signOut } from "./auth";

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithOtp = vi.fn();
const mockSignOut = vi.fn();
const mockGetUserByEmail = vi.fn();

function makeSupabaseClient() {
  return {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOtp: mockSignInWithOtp,
      signOut: mockSignOut,
    },
  };
}

function makeAdminClient() {
  return {
    auth: {
      admin: {
        getUserByEmail: mockGetUserByEmail,
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockResolvedValue(makeSupabaseClient() as never);
  vi.mocked(createAdminClient).mockReturnValue(makeAdminClient() as never);
});

// ─── checkEmail ────────────────────────────────────────────────────────────────

describe("checkEmail", () => {
  it("returns success false on invalid email", async () => {
    const result = await checkEmail({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("returns exists:true when admin API finds user", async () => {
    mockGetUserByEmail.mockResolvedValue({
      data: { user: { id: "user-1", email: "test@test.com" } },
      error: null,
    });
    const result = await checkEmail({ email: "test@test.com" });
    expect(result).toEqual({ success: true, data: { exists: true } });
  });

  it("returns exists:false when admin API finds no user", async () => {
    mockGetUserByEmail.mockResolvedValue({
      data: { user: null },
      error: { message: "User not found" },
    });
    const result = await checkEmail({ email: "new@test.com" });
    expect(result).toEqual({ success: true, data: { exists: false } });
  });
});

// ─── signIn ────────────────────────────────────────────────────────────────────

describe("signIn", () => {
  it("returns success false on invalid input", async () => {
    const result = await signIn({ email: "bad", password: "" });
    expect(result.success).toBe(false);
  });

  it("returns error on wrong credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });
    const result = await signIn({
      email: "test@test.com",
      password: "wrongpass",
    });
    expect(result).toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });

  it("redirects on successful sign in", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    await signIn({
      email: "test@test.com",
      password: "correct",
      redirectTo: "/my-clubs",
    });
    expect(redirect).toHaveBeenCalledWith("/my-clubs");
  });
});

// ─── signUp ────────────────────────────────────────────────────────────────────

describe("signUp", () => {
  it("returns success false on invalid input (short name)", async () => {
    const result = await signUp({
      email: "test@test.com",
      name: "A",
      password: "password123",
    });
    expect(result.success).toBe(false);
    expect(result).toMatchObject({ field: "name" });
  });

  it("returns success false on short password", async () => {
    const result = await signUp({
      email: "test@test.com",
      name: "Alice",
      password: "short",
    });
    expect(result.success).toBe(false);
    expect(result).toMatchObject({ field: "password" });
  });

  it("returns error when supabase signup fails", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    });
    const result = await signUp({
      email: "taken@test.com",
      name: "Alice",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

// ─── sendMagicLink ─────────────────────────────────────────────────────────────

describe("sendMagicLink", () => {
  it("returns success false on invalid email", async () => {
    const result = await sendMagicLink({ email: "not-valid" });
    expect(result.success).toBe(false);
  });

  it("returns success true on valid email", async () => {
    mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });
    const result = await sendMagicLink({ email: "user@test.com" });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("returns error when supabase fails", async () => {
    mockSignInWithOtp.mockResolvedValue({
      data: {},
      error: { message: "Rate limit exceeded" },
    });
    const result = await sendMagicLink({ email: "user@test.com" });
    expect(result.success).toBe(false);
  });
});
