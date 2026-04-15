import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  getAuthUser: vi.fn(),
}));

const mockDbSelect = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbTransaction = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    get select() {
      return mockDbSelect;
    },
    get update() {
      return mockDbUpdate;
    },
    transaction: (...args: unknown[]) => mockDbTransaction(...args),
  },
}));

import { getAuthUser } from "@/lib/supabase/server";
import {
  checkSlugAvailability,
  createCommunity,
  updateCoverPhoto,
} from "./community";

function makeSelectChain(rows: unknown[]) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(rows),
  };
  return chain;
}

function makeUpdateChain() {
  return {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── checkSlugAvailability ─────────────────────────────────────────────────────

describe("checkSlugAvailability", () => {
  it("returns error for invalid slug format", async () => {
    const result = await checkSlugAvailability("AB");
    expect(result.success).toBe(false);
  });

  it("returns available:true for unused slug", async () => {
    mockDbSelect.mockReturnValue(makeSelectChain([]));
    const result = await checkSlugAvailability("my-cool-club");
    expect(result).toEqual({ success: true, data: { available: true } });
  });

  it("returns available:false for taken slug", async () => {
    mockDbSelect.mockReturnValue(makeSelectChain([{ id: "existing-id" }]));
    const result = await checkSlugAvailability("taken-slug");
    expect(result).toEqual({ success: true, data: { available: false } });
  });

  it("returns error for reserved slug", async () => {
    const result = await checkSlugAvailability("explore");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/reserved/i);
  });
});

// ─── createCommunity ──────────────────────────────────────────────────────────

const validInput = {
  name: "London City Runners",
  slug: "london-city-runners",
  city: "London",
  vibe: "social" as const,
  postRunDefault: "pub" as const,
  timezone: "Europe/London",
};

describe("createCommunity", () => {
  it("returns error if unauthenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    const result = await createCommunity(validInput);
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("returns error on invalid input", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1" } as never);
    const result = await createCommunity({ name: "", slug: "x", city: "" });
    expect(result.success).toBe(false);
  });

  it("returns error if slug already taken", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1" } as never);
    // slug availability check returns existing record
    mockDbSelect.mockReturnValue(makeSelectChain([{ id: "existing" }]));
    const result = await createCommunity(validInput);
    expect(result.success).toBe(false);
    expect(result).toMatchObject({ field: "slug" });
  });

  it("creates community and membership, returns id and slug", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1" } as never);
    // slug check: not taken
    mockDbSelect.mockReturnValue(makeSelectChain([]));
    // transaction resolves with the new community
    mockDbTransaction.mockImplementation(
      async (fn: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi
                .fn()
                .mockResolvedValue([
                  { id: "comm-1", slug: "london-city-runners" },
                ]),
            }),
          }),
        };
        return fn(tx);
      },
    );

    const result = await createCommunity(validInput);
    expect(result).toEqual({
      success: true,
      data: { id: "comm-1", slug: "london-city-runners" },
    });
  });
});

// ─── updateCoverPhoto ─────────────────────────────────────────────────────────

describe("updateCoverPhoto", () => {
  it("returns error if unauthenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    const result = await updateCoverPhoto("comm-1", "https://example.com/img.jpg");
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("returns error if user does not own the community", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1" } as never);
    mockDbSelect.mockReturnValue(
      makeSelectChain([{ ownerId: "other-user", slug: "test-club" }]),
    );
    const result = await updateCoverPhoto("comm-1", "https://example.com/img.jpg");
    expect(result).toEqual({ success: false, error: "Not authorised" });
  });

  it("updates cover image URL on success", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1" } as never);
    mockDbSelect.mockReturnValue(
      makeSelectChain([{ ownerId: "user-1", slug: "my-club" }]),
    );
    mockDbUpdate.mockReturnValue(makeUpdateChain());

    const result = await updateCoverPhoto("comm-1", "https://example.com/img.jpg");
    expect(result).toEqual({ success: true, data: undefined });
  });
});
