import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  getAuthUser: vi.fn(),
}));

const mockDbSelect = vi.fn();
const mockDbInsert = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbDelete = vi.fn();
const mockDbTransaction = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    get select() {
      return mockDbSelect;
    },
    get insert() {
      return mockDbInsert;
    },
    get update() {
      return mockDbUpdate;
    },
    get delete() {
      return mockDbDelete;
    },
    transaction: (...args: unknown[]) => mockDbTransaction(...args),
  },
}));

import { getAuthUser } from "@/lib/supabase/server";
import { createRsvp, updateRsvpAfters, withdrawRsvp, joinClub } from "./rsvp";

const mockUser = { id: "user-1", email: "test@test.com" };

function makeSelectChain(rows: unknown[]) {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(rows),
  };
}

function makeInsertChain() {
  return {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: "rsvp-1" }]),
  };
}

function makeUpdateChain() {
  return {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  };
}

function makeDeleteChain() {
  return {
    where: vi.fn().mockResolvedValue(undefined),
  };
}

/** Mocks the transaction to call its callback with a tx object */
function mockTransactionImpl() {
  mockDbTransaction.mockImplementation(
    async (cb: (tx: unknown) => Promise<void>) => {
      await cb({
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([{ id: "rsvp-1" }]),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnThis(),
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });
    },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createRsvp ───────────────────────────────────────────────────────────────

describe("createRsvp", () => {
  it("returns error if unauthenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("returns error if event not found", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    // event query returns empty
    mockDbSelect.mockReturnValue(makeSelectChain([]));
    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: false,
      error: "Event not found or no longer accepting RSVPs",
    });
  });

  it("returns error if event not upcoming", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    // event query returns a cancelled event
    mockDbSelect.mockReturnValue(
      makeSelectChain([
        { id: "event-1", communityId: "comm-1", status: "cancelled" },
      ]),
    );
    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: false,
      error: "Event not found or no longer accepting RSVPs",
    });
  });

  it("returns error if already RSVP'd", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    // event query returns upcoming event
    mockDbSelect
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "event-1", communityId: "comm-1", status: "upcoming" },
        ]),
      )
      // community query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", tier: "pro", memberCount: 5, isActive: true },
        ]),
      )
      // duplicate RSVP check — already exists
      .mockReturnValueOnce(makeSelectChain([{ id: "rsvp-existing" }]));

    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: false,
      error: "Already RSVP'd to this event",
    });
  });

  it("creates RSVP with auto-join when not a member", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // event query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "event-1", communityId: "comm-1", status: "upcoming" },
        ]),
      )
      // community query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", tier: "pro", memberCount: 5, isActive: true },
        ]),
      )
      // duplicate RSVP check — none
      .mockReturnValueOnce(makeSelectChain([]))
      // membership check — not a member
      .mockReturnValueOnce(makeSelectChain([]));

    mockTransactionImpl();

    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: true,
      data: { rsvpId: "rsvp-1", autoJoined: true },
    });
  });

  it("creates RSVP without auto-join when already a member", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // event query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "event-1", communityId: "comm-1", status: "upcoming" },
        ]),
      )
      // community query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", tier: "pro", memberCount: 10, isActive: true },
        ]),
      )
      // duplicate RSVP check — none
      .mockReturnValueOnce(makeSelectChain([]))
      // membership check — already a member
      .mockReturnValueOnce(makeSelectChain([{ role: "member" }]));

    mockTransactionImpl();

    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: true,
      data: { rsvpId: "rsvp-1", autoJoined: false },
    });
  });

  it("blocks RSVP when free tier club at cap and user not a member", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // event query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "event-1", communityId: "comm-1", status: "upcoming" },
        ]),
      )
      // community query — free tier, at cap
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", tier: "free", memberCount: 30, isActive: true },
        ]),
      )
      // membership check for cap — not a member
      .mockReturnValueOnce(makeSelectChain([]));

    const result = await createRsvp({
      eventId: "event-1",
      status: "going",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: false,
      error:
        "This club is at capacity. Join the waitlist to get notified when a spot opens.",
    });
  });
});

// ─── updateRsvpAfters ─────────────────────────────────────────────────────────

describe("updateRsvpAfters", () => {
  it("returns error if unauthenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    const result = await updateRsvpAfters({
      eventId: "event-1",
      joiningSocial: true,
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("updates joining_social", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbUpdate.mockReturnValue(makeUpdateChain());

    const result = await updateRsvpAfters({
      eventId: "event-1",
      joiningSocial: true,
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: true, data: undefined });
  });
});

// ─── withdrawRsvp ─────────────────────────────────────────────────────────────

describe("withdrawRsvp", () => {
  it("deletes RSVP record", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbDelete.mockReturnValue(makeDeleteChain());

    const result = await withdrawRsvp({
      eventId: "event-1",
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: true, data: undefined });
  });
});

// ─── joinClub ─────────────────────────────────────────────────────────────────

describe("joinClub", () => {
  it("inserts member + increments count when under cap", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // community query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", isActive: true, tier: "pro", memberCount: 10 },
        ]),
      )
      // existing membership check — not a member
      .mockReturnValueOnce(makeSelectChain([]));

    mockTransactionImpl();

    const result = await joinClub({
      communityId: "comm-1",
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: true, data: { waitlisted: false } });
  });

  it("inserts waitlisted when at cap", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // community query — free tier, at cap
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", isActive: true, tier: "free", memberCount: 30 },
        ]),
      )
      // existing membership check — not a member
      .mockReturnValueOnce(makeSelectChain([]));

    mockDbInsert.mockReturnValue(makeInsertChain());

    const result = await joinClub({
      communityId: "comm-1",
      communitySlug: "test-club",
    });
    expect(result).toEqual({ success: true, data: { waitlisted: true } });
  });

  it("returns error if already a member", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as never);
    mockDbSelect
      // community query
      .mockReturnValueOnce(
        makeSelectChain([
          { id: "comm-1", isActive: true, tier: "free", memberCount: 5 },
        ]),
      )
      // existing membership check — already a member
      .mockReturnValueOnce(makeSelectChain([{ role: "member" }]));

    const result = await joinClub({
      communityId: "comm-1",
      communitySlug: "test-club",
    });
    expect(result).toEqual({
      success: false,
      error: "Already a member of this club",
    });
  });
});
