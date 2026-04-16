import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDbSelect = vi.fn();
const mockDbExecute = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    get select() {
      return mockDbSelect;
    },
    execute: (...args: unknown[]) => mockDbExecute(...args),
  },
}));

import { getExploreClubs } from "./communities";

// ─── Chain helpers ────────────────────────────────────────────────────────────

function makeSelectChain(rows: unknown[]) {
  return {
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue(rows),
  };
}

function makeGoingCountChain(rows: unknown[]) {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockResolvedValue(rows),
  };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseClub = {
  id: "comm-1",
  slug: "bondi-runners",
  name: "Bondi Runners",
  description: "Running by the beach",
  city: "Sydney",
  vibe: "social" as const,
  postRunDefault: "pub" as const,
  instagramHandle: "bondirunners",
  memberCount: 42,
  tier: "free" as const,
  locationLat: "-33.8900000",
  locationLng: "151.2740000",
  streakRecord: 10,
};

const baseNextEventRow = {
  id: "event-1",
  community_id: "comm-1",
  title: "Saturday Morning Run",
  date: new Date("2026-05-01T07:00:00Z"),
  distance_km: "10.00",
  distance_unit: "km",
  meeting_point_name: "Bondi Pavilion",
  meeting_point_lat: "-33.8900000",
  meeting_point_lng: "151.2740000",
  post_run_venue_name: "The Bucket List",
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getExploreClubs", () => {
  it("returns [] when no clubs match", async () => {
    mockDbSelect.mockReturnValueOnce(makeSelectChain([]));

    const result = await getExploreClubs();

    expect(result).toEqual([]);
    // execute should NOT be called since we short-circuit on empty clubs
    expect(mockDbExecute).not.toHaveBeenCalled();
  });

  it("returns clubs with nextEvent: null when no upcoming events", async () => {
    mockDbSelect.mockReturnValueOnce(makeSelectChain([baseClub]));
    // execute returns empty array for DISTINCT ON query (postgres-js RowList is array-like)
    mockDbExecute.mockResolvedValueOnce([]);
    // no going counts needed since no event IDs

    const result = await getExploreClubs();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("comm-1");
    expect(result[0].nextEvent).toBeNull();
  });

  it("merges next event and going count correctly", async () => {
    mockDbSelect
      .mockReturnValueOnce(makeSelectChain([baseClub]))
      .mockReturnValueOnce(
        makeGoingCountChain([{ eventId: "event-1", count: 23 }]),
      );
    mockDbExecute.mockResolvedValueOnce([baseNextEventRow]);

    const result = await getExploreClubs();

    expect(result).toHaveLength(1);
    const club = result[0];
    expect(club.id).toBe("comm-1");
    expect(club.nextEvent).not.toBeNull();
    expect(club.nextEvent!.id).toBe("event-1");
    expect(club.nextEvent!.title).toBe("Saturday Morning Run");
    expect(club.nextEvent!.goingCount).toBe(23);
    expect(club.nextEvent!.distanceUnit).toBe("km");
    expect(club.nextEvent!.postRunVenueName).toBe("The Bucket List");
  });

  it("calls where() when vibe filter is set", async () => {
    const chain = makeSelectChain([]);
    mockDbSelect.mockReturnValueOnce(chain);

    await getExploreClubs({ vibe: "competitive" });

    expect(chain.where).toHaveBeenCalled();
  });

  it("re-sorts by next event date when sort === soonest", async () => {
    const clubA = {
      ...baseClub,
      id: "comm-A",
      slug: "club-a",
      name: "Club A",
      tier: "free" as const,
    };
    const clubB = {
      ...baseClub,
      id: "comm-B",
      slug: "club-b",
      name: "Club B",
      tier: "free" as const,
    };

    // Step 1: communities query returns clubA and clubB
    mockDbSelect
      .mockReturnValueOnce(makeSelectChain([clubA, clubB]))
      .mockReturnValueOnce(makeGoingCountChain([]));

    // Step 2: DISTINCT ON returns clubB with an earlier date than clubA
    const eventForA = {
      ...baseNextEventRow,
      id: "event-A",
      community_id: "comm-A",
      date: new Date("2026-05-10T07:00:00Z"),
    };
    const eventForB = {
      ...baseNextEventRow,
      id: "event-B",
      community_id: "comm-B",
      date: new Date("2026-05-03T07:00:00Z"),
    };
    mockDbExecute.mockResolvedValueOnce([eventForA, eventForB]);

    const result = await getExploreClubs({ sort: "soonest" });

    expect(result).toHaveLength(2);
    // Club B has earlier date, should come first
    expect(result[0].id).toBe("comm-B");
    expect(result[1].id).toBe("comm-A");
  });
});
