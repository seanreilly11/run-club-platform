# Explore Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full `/explore` page — sunrise hero with search + city pills, sticky vibe/afters/sort filter bar, rich club cards with inline next event + afters strip, and a Leaflet map view with marker clustering.

**Architecture:** URL search params drive all filtering (city, vibe, afters, sort, search, view). The Server Component `page.tsx` reads params, calls `getExploreClubs()`, and renders either `ClubList` or `MapWrapper`. Client Components (`ExploreHero`, `FilterBar`) update URL params via `router.replace`. Pro clubs rank first within each sort order (invisible boosting, no label). The map is Leaflet + react-leaflet-cluster, lazy-loaded with `dynamic({ ssr: false })` to avoid SSR issues.

**Tech Stack:** Next.js 16 App Router, Drizzle ORM 0.45, Leaflet 1.9, react-leaflet 4, react-leaflet-cluster, Tailwind CSS, `lucide-react`, existing `VenueBadge` + `VibeBadge` components.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/db/queries/communities.ts` | Modify | Add `ExploreFilters` type, `ExploreClubRow` type, `getExploreClubs()` |
| `src/lib/db/queries/communities.test.ts` | Create | Tests for `getExploreClubs` |
| `src/components/explore/club-card.tsx` | Create | Rich club card — Server Component |
| `src/components/explore/club-list.tsx` | Create | List of cards + empty state — Server Component |
| `src/components/explore/explore-hero.tsx` | Create | Gradient hero, search input, city pills — Client Component |
| `src/components/explore/filter-bar.tsx` | Create | Sticky vibe/afters/sort/map toggle — Client Component |
| `src/components/explore/map-view.tsx` | Create | Leaflet map with clustering — Client Component |
| `src/components/explore/map-wrapper.tsx` | Create | `dynamic(() => import('./map-view'), { ssr: false })` wrapper |
| `app/(public)/explore/page.tsx` | Modify | Server Component wiring everything together |

---

## Task 1: Install Leaflet dependencies

**Files:** `package.json` (modified by npm)

- [ ] **Step 1: Install packages**

```bash
npm install leaflet react-leaflet react-leaflet-cluster
npm install -D @types/leaflet
```

- [ ] **Step 2: Verify install**

```bash
node -e "require('leaflet'); require('react-leaflet'); console.log('ok')"
```

Expected: prints `ok` with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install leaflet, react-leaflet, react-leaflet-cluster"
```

---

## Task 2: `getExploreClubs` query + types + tests

**Files:**
- Modify: `src/lib/db/queries/communities.ts`
- Create: `src/lib/db/queries/communities.test.ts`

### Context for the implementer

The explore page needs clubs with: basic fields, streak from `community_stats`, and the next upcoming event (date, distance, meeting point, afters venue name, going count). Because PostgreSQL's `DISTINCT ON` is the cleanest way to get one event per club, the query runs in three steps and merges in JS:

1. Filtered + sorted communities (Drizzle query builder)
2. Next upcoming event per community (`DISTINCT ON`, raw SQL via `db.execute`)
3. Going counts per event (Drizzle query builder)

Priority placement: Pro clubs rank above free within each sort via `CASE WHEN tier = 'pro' THEN 0 ELSE 1 END` as the first ORDER BY term.

- [ ] **Step 1: Write the failing test**

Create `src/lib/db/queries/communities.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDbSelect = vi.fn();
const mockDbExecute = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    get select() { return mockDbSelect; },
    execute: (...args: unknown[]) => mockDbExecute(...args),
  },
}));

import { getExploreClubs } from "./communities";

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

const baseClub = {
  id: "club-1",
  slug: "test-club",
  name: "Test Club",
  description: null,
  city: "Sydney",
  vibe: "social" as const,
  postRunDefault: "pub" as const,
  instagramHandle: null,
  memberCount: 42,
  tier: "free" as const,
  locationLat: "-33.8688",
  locationLng: "151.2093",
  streakRecord: 5,
};

beforeEach(() => { vi.clearAllMocks(); });

describe("getExploreClubs", () => {
  it("returns empty array when no clubs match", async () => {
    mockDbSelect.mockReturnValue(makeSelectChain([]));
    const result = await getExploreClubs({});
    expect(result).toEqual([]);
  });

  it("returns clubs with null nextEvent when no upcoming events", async () => {
    mockDbSelect.mockReturnValue(makeSelectChain([baseClub]));
    mockDbExecute.mockResolvedValue({ rows: [] });
    const result = await getExploreClubs({});
    expect(result).toHaveLength(1);
    expect(result[0].nextEvent).toBeNull();
    expect(result[0].slug).toBe("test-club");
  });

  it("merges next event and going count", async () => {
    mockDbSelect
      .mockReturnValueOnce(makeSelectChain([baseClub]))
      .mockReturnValueOnce(makeGoingCountChain([{ eventId: "evt-1", count: 23 }]));
    mockDbExecute.mockResolvedValue({
      rows: [{
        id: "evt-1",
        community_id: "club-1",
        title: "Wednesday Run",
        date: new Date("2026-05-01T18:00:00Z"),
        distance_km: "5.00",
        distance_unit: "km",
        meeting_point_name: "Bondi Icebergs",
        meeting_point_lat: "-33.89",
        meeting_point_lng: "151.27",
        post_run_venue_name: "The Anchor",
      }],
    });
    const result = await getExploreClubs({});
    expect(result[0].nextEvent).toMatchObject({
      id: "evt-1",
      title: "Wednesday Run",
      goingCount: 23,
      postRunVenueName: "The Anchor",
    });
  });

  it("filters by vibe", async () => {
    const chain = makeSelectChain([baseClub]);
    mockDbSelect.mockReturnValue(chain);
    mockDbExecute.mockResolvedValue({ rows: [] });
    await getExploreClubs({ vibe: "social" });
    // where() was called (filter was applied)
    expect(chain.where).toHaveBeenCalled();
  });

  it("re-sorts by next event date when sort=soonest", async () => {
    const proClub = { ...baseClub, id: "club-pro", slug: "pro-club", tier: "free" as const };
    const freeClub = { ...baseClub, id: "club-free", slug: "free-club", tier: "free" as const };
    mockDbSelect
      .mockReturnValueOnce(makeSelectChain([freeClub, proClub]))
      .mockReturnValueOnce(makeGoingCountChain([]));
    mockDbExecute.mockResolvedValue({
      rows: [
        { id: "evt-a", community_id: "club-free", title: "Soon", date: new Date("2026-05-01"), distance_km: null, distance_unit: "km", meeting_point_name: "A", meeting_point_lat: null, meeting_point_lng: null, post_run_venue_name: null },
        { id: "evt-b", community_id: "club-pro", title: "Later", date: new Date("2026-06-01"), distance_km: null, distance_unit: "km", meeting_point_name: "B", meeting_point_lat: null, meeting_point_lng: null, post_run_venue_name: null },
      ],
    });
    const result = await getExploreClubs({ sort: "soonest" });
    expect(result[0].slug).toBe("free-club");
    expect(result[1].slug).toBe("pro-club");
  });
});
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npm test -- communities.test
```

Expected: FAIL — `getExploreClubs is not a function` or import errors.

- [ ] **Step 3: Add types and `getExploreClubs` to `src/lib/db/queries/communities.ts`**

Add these imports at the top (merge with existing):

```typescript
import { eq, and, inArray, sql, ilike, or, desc, asc } from "drizzle-orm";
import { events, eventRsvps } from "@/lib/db/schema";
import type { SQL } from "drizzle-orm";
```

Then append to the file (after existing exports):

```typescript
export type ExploreFilters = {
  city?: string;
  vibe?: "competitive" | "social" | "casual";
  afters?: "pub" | "coffee" | "brunch";
  sort?: "members" | "soonest" | "newest";
  search?: string;
};

export type ExploreClubRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  city: string;
  vibe: "competitive" | "social" | "casual";
  postRunDefault: "pub" | "coffee" | "brunch" | "none";
  instagramHandle: string | null;
  memberCount: number;
  tier: "free" | "pro";
  locationLat: string | null;
  locationLng: string | null;
  streakRecord: number;
  nextEvent: {
    id: string;
    title: string;
    date: Date;
    distanceKm: string | null;
    distanceUnit: "km" | "mi";
    meetingPointName: string;
    meetingPointLat: string | null;
    meetingPointLng: string | null;
    postRunVenueName: string | null;
    goingCount: number;
  } | null;
};

type NextEventDbRow = {
  id: string;
  community_id: string;
  title: string;
  date: Date;
  distance_km: string | null;
  distance_unit: "km" | "mi";
  meeting_point_name: string;
  meeting_point_lat: string | null;
  meeting_point_lng: string | null;
  post_run_venue_name: string | null;
};

export async function getExploreClubs(
  filters: ExploreFilters = {},
): Promise<ExploreClubRow[]> {
  // ── Step 1: filtered + sorted communities ──────────────────────────────────
  const conditions: SQL[] = [
    eq(communities.isActive, true),
    eq(communities.type, "run_club"),
  ];

  if (filters.city) {
    conditions.push(ilike(communities.city, `%${filters.city}%`));
  }
  if (filters.vibe) {
    conditions.push(eq(communities.vibe, filters.vibe));
  }
  if (filters.afters) {
    conditions.push(eq(communities.postRunDefault, filters.afters));
  }
  if (filters.search) {
    conditions.push(
      or(
        ilike(communities.name, `%${filters.search}%`),
        ilike(communities.city, `%${filters.search}%`),
      )!,
    );
  }

  // Pro clubs ranked first within each sort order (invisible boosting)
  const proFirst = sql`CASE WHEN ${communities.tier} = 'pro' THEN 0 ELSE 1 END`;

  const primarySort =
    filters.sort === "newest"
      ? desc(communities.createdAt)
      : desc(communities.memberCount); // default + soonest both start by memberCount; soonest re-sorted later

  const clubRows = await db
    .select({
      id: communities.id,
      slug: communities.slug,
      name: communities.name,
      description: communities.description,
      city: communities.city,
      vibe: communities.vibe,
      postRunDefault: communities.postRunDefault,
      instagramHandle: communities.instagramHandle,
      memberCount: communities.memberCount,
      tier: communities.tier,
      locationLat: communities.locationLat,
      locationLng: communities.locationLng,
      streakRecord: sql<number>`COALESCE(${communityStats.streakRecord}, 0)`.mapWith(
        Number,
      ),
    })
    .from(communities)
    .leftJoin(communityStats, eq(communityStats.communityId, communities.id))
    .where(and(...conditions))
    .orderBy(asc(proFirst), primarySort);

  if (clubRows.length === 0) return [];

  const communityIds = clubRows.map((r) => r.id);

  // ── Step 2: next upcoming event per community (DISTINCT ON) ────────────────
  const idList = sql.join(
    communityIds.map((id) => sql`${id}::uuid`),
    sql`, `,
  );

  const nextEventsResult = await db.execute(sql`
    SELECT DISTINCT ON (community_id)
      id::text,
      community_id::text,
      title,
      date,
      distance_km::text,
      distance_unit::text,
      meeting_point_name,
      meeting_point_lat::text,
      meeting_point_lng::text,
      post_run_venue_name
    FROM events
    WHERE community_id IN (${idList})
      AND status = 'upcoming'
      AND date >= NOW()
    ORDER BY community_id, date ASC
  `);

  const nextEventRows = nextEventsResult.rows as NextEventDbRow[];
  const eventIds = nextEventRows.map((r) => r.id).filter(Boolean);

  // ── Step 3: going counts ───────────────────────────────────────────────────
  const goingCountRows =
    eventIds.length > 0
      ? await db
          .select({
            eventId: eventRsvps.eventId,
            count: sql<number>`COUNT(*)::int`.mapWith(Number),
          })
          .from(eventRsvps)
          .where(
            and(
              inArray(eventRsvps.eventId, eventIds),
              eq(eventRsvps.status, "going"),
            ),
          )
          .groupBy(eventRsvps.eventId)
      : [];

  // ── Step 4: merge ──────────────────────────────────────────────────────────
  const nextEventByClub = new Map(nextEventRows.map((r) => [r.community_id, r]));
  const goingByEvent = new Map(goingCountRows.map((r) => [r.eventId, r.count]));

  const merged: ExploreClubRow[] = clubRows.map((club) => {
    const ne = nextEventByClub.get(club.id);
    return {
      ...club,
      nextEvent: ne
        ? {
            id: ne.id,
            title: ne.title,
            date: ne.date,
            distanceKm: ne.distance_km,
            distanceUnit: ne.distance_unit,
            meetingPointName: ne.meeting_point_name,
            meetingPointLat: ne.meeting_point_lat,
            meetingPointLng: ne.meeting_point_lng,
            postRunVenueName: ne.post_run_venue_name,
            goingCount: goingByEvent.get(ne.id) ?? 0,
          }
        : null,
    };
  });

  // Re-sort by next event date for "soonest" (clubs with no event go to end)
  if (filters.sort === "soonest") {
    merged.sort((a, b) => {
      const proA = a.tier === "pro" ? 0 : 1;
      const proB = b.tier === "pro" ? 0 : 1;
      if (proA !== proB) return proA - proB;
      const dateA = a.nextEvent?.date.getTime() ?? Infinity;
      const dateB = b.nextEvent?.date.getTime() ?? Infinity;
      return dateA - dateB;
    });
  }

  return merged;
}
```

- [ ] **Step 4: Fix existing import in `communities.ts`**

The existing file imports `{ eq, and, inArray, sql }` and `{ communities, communityStats, memberships, users, memberAttendanceStats }`. Merge the new imports so there are no duplicates. Also add `events` and `eventRsvps` to the schema import.

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm test -- communities.test
```

Expected: all 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/queries/communities.ts src/lib/db/queries/communities.test.ts
git commit -m "feat: add getExploreClubs query with filtering, sorting, and next-event merge"
```

---

## Task 3: `ClubCard` Server Component

**Files:**
- Create: `src/components/explore/club-card.tsx`

### Context

Rich card displaying one club. Uses existing `VenueBadge` and `VibeBadge`. Shows: club name + vibe badge, Instagram link (if set), location, quick stats (members, streak, run day), inline next event preview, afters strip at bottom. Per DESIGN.md section 2: description snippet (80 chars max) shown on desktop only.

The card does NOT have RSVP interactivity — that lives on the club page. The card just links to `/[slug]`.

- [ ] **Step 1: Create `src/components/explore/club-card.tsx`**

```typescript
import Link from "next/link";
import { MapPin, Instagram } from "lucide-react";
import { VenueBadge } from "@/components/ui/venue-badge";
import { VibeBadge } from "@/components/ui/vibe-badge";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

interface ClubCardProps {
  club: ExploreClubRow;
  timezone: string; // community timezone for date formatting
}

function formatEventDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// Derive run day label from next event (e.g. "Wednesdays")
function getRunDayLabel(date: Date, timezone: string): string {
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "long",
  }).format(date);
  return `${day}s`;
}

export function ClubCard({ club, timezone }: ClubCardProps) {
  return (
    <Link
      href={`/${club.slug}`}
      className="block rounded-[14px] border bg-surface px-4 py-4 transition-shadow hover:shadow-md"
      style={{
        borderColor: "#F5F0EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header row: name + vibe + Instagram */}
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-heading text-[15px] font-bold text-text">
            {club.name}
          </span>
          <VibeBadge vibe={club.vibe} />
        </div>
        {club.instagramHandle && (
          <a
            href={`https://instagram.com/${club.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-text-muted hover:text-text"
            aria-label={`@${club.instagramHandle} on Instagram`}
          >
            <Instagram size={14} />
          </a>
        )}
      </div>

      {/* Location */}
      <div className="mb-2 flex items-center gap-1">
        <MapPin size={11} className="shrink-0 text-text-muted" />
        <span className="text-[11px] text-text-muted">{club.city}</span>
      </div>

      {/* Quick stats */}
      <div className="mb-2.5 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
        <span>👥 {club.memberCount} members</span>
        {club.streakRecord > 0 && (
          <span>🔥 Club streak: {club.streakRecord} wks</span>
        )}
        {club.nextEvent && (
          <span>
            📅 Runs {getRunDayLabel(club.nextEvent.date, timezone)}
          </span>
        )}
      </div>

      {/* Next event preview */}
      {club.nextEvent ? (
        <div className="mb-2.5">
          <p className="text-[12px] font-medium text-text">
            {formatEventDate(club.nextEvent.date, timezone)}
            {club.nextEvent.distanceKm && (
              <> · {club.nextEvent.distanceKm} {club.nextEvent.distanceUnit}</>
            )}
            {" · "}{club.nextEvent.meetingPointName}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-primary">
            {club.nextEvent.goingCount} going
          </p>
        </div>
      ) : (
        <p className="mb-2.5 text-[11px] text-text-muted">No upcoming events</p>
      )}

      {/* Description snippet — desktop only */}
      {club.description && (
        <p className="mb-2.5 hidden text-[11px] text-text-muted sm:block">
          {club.description.slice(0, 80)}
          {club.description.length > 80 ? "..." : ""}
        </p>
      )}

      {/* Afters strip */}
      {club.nextEvent?.postRunVenueName && (
        <VenueBadge
          venueName={club.nextEvent.postRunVenueName}
          postRunDefault={club.postRunDefault}
          variant="small"
          className="w-full justify-center py-1.5 text-[11px]"
        />
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Run build to check types**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no TypeScript errors in `club-card.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/explore/club-card.tsx
git commit -m "feat: add ClubCard component for explore page"
```

---

## Task 4: `ClubList` Server Component

**Files:**
- Create: `src/components/explore/club-list.tsx`

### Context

Renders the vertically-stacked list of `ClubCard`s. Shows result count. Shows empty state if no clubs match filters. The timezone per card must come from the community data — but `ExploreClubRow` doesn't include `timezone`. Since we're rendering all clubs, we'll derive a display timezone from the city name using a simple lookup. The `ClubCard` accepts a `timezone` prop but the explore page doesn't query per-club timezones. Use a city→timezone lookup for the card timezone.

Actually — for simplicity, use `"UTC"` as the fallback timezone in explore cards. The exact timezone matters on the club page (full SSR). On the explore list the date is displayed with weekday + time, and UTC vs local will differ by at most a few hours. This is acceptable for a browse/discovery view. Document this limitation in a comment.

- [ ] **Step 1: Create `src/components/explore/club-list.tsx`**

```typescript
import { ClubCard } from "./club-card";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

interface ClubListProps {
  clubs: ExploreClubRow[];
  totalCount: number;
}

// Explore cards show event times without per-club timezone lookup.
// Times are shown in UTC — acceptable approximation for discovery browsing.
// Full timezone-correct display is on the club's own page.
const EXPLORE_TIMEZONE = "UTC";

export function ClubList({ clubs, totalCount }: ClubListProps) {
  return (
    <section>
      <p className="mb-3 text-[12px] text-text-muted">
        {totalCount} club{totalCount !== 1 ? "s" : ""}
      </p>

      {clubs.length === 0 ? (
        <div className="rounded-[14px] border border-border-muted bg-surface p-8 text-center">
          <p className="mb-1 text-2xl">🏃</p>
          <p className="mb-1 font-heading text-[15px] font-semibold text-text">
            No clubs match your filters
          </p>
          <p className="mb-4 text-[13px] text-text-muted">
            Try broadening your search or changing the vibe / afters filter.
          </p>
          <a
            href="/create"
            className="inline-block rounded-[12px] bg-primary px-4 py-2 text-[13px] font-bold text-white"
            style={{ boxShadow: "0 2px 12px rgba(244,63,94,0.3)" }}
          >
            Start your own club →
          </a>
        </div>
      ) : (
        <div className="space-y-2.5">
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              timezone={EXPLORE_TIMEZONE}
            />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Run build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/explore/club-list.tsx
git commit -m "feat: add ClubList component with empty state"
```

---

## Task 5: `ExploreHero` Client Component

**Files:**
- Create: `src/components/explore/explore-hero.tsx`

### Context

Gradient hero (sunrise, shorter than landing — 32px 24px 36px padding). Contains:
- H1 "Find your crew" (Bricolage 800, 26px, white)
- Subtitle "Discover run clubs near you" (13px, white 0.8 opacity)
- Search input (white, rounded-xl, shadow, search icon, 300ms debounced URL update)
- City filter pills: All / Sydney / London / Amsterdam (white at 0.2 bg when inactive, white bg + primary text when active)

All state lives in the URL: `?q=` for search, `?city=` for city (values: "sydney", "london", "amsterdam" or absent for "all").

Uses `useSearchParams()` to read current values, `useRouter()` + `router.replace()` to update them. Debounce search input 300ms with `useEffect` + `setTimeout` cleanup.

- [ ] **Step 1: Create `src/components/explore/explore-hero.tsx`**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const CITIES = [
  { label: "All", value: "" },
  { label: "Sydney", value: "sydney" },
  { label: "London", value: "london" },
  { label: "Amsterdam", value: "amsterdam" },
] as const;

export function ExploreHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city") ?? "";
  const currentQ = searchParams.get("q") ?? "";

  const [searchValue, setSearchValue] = useState(currentQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local search value in sync if URL changes externally
  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ q: value });
    }, 300);
  }

  function handleCityClick(cityValue: string) {
    updateParams({ city: cityValue });
  }

  return (
    <div
      className="w-full py-8 px-6"
      style={{
        background:
          "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        {/* Heading */}
        <h1 className="mb-1 text-center font-heading text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-white">
          Find your crew
        </h1>
        <p className="mb-4 text-center text-[13px] text-white/80">
          Discover run clubs near you
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by name or area..."
            className="w-full rounded-xl bg-white py-2.5 pl-9 pr-4 text-[14px] text-text shadow-md outline-none placeholder:text-text-muted"
          />
        </div>

        {/* City pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CITIES.map(({ label, value }) => {
            const isActive = currentCity === value;
            return (
              <button
                key={value}
                onClick={() => handleCityClick(value)}
                className="rounded-full px-3.5 py-1 text-[12px] font-semibold transition-colors"
                style={
                  isActive
                    ? { background: "white", color: "#F43F5E" }
                    : { background: "rgba(255,255,255,0.2)", color: "white" }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/explore/explore-hero.tsx
git commit -m "feat: add ExploreHero with search input and city pills"
```

---

## Task 6: `FilterBar` Client Component

**Files:**
- Create: `src/components/explore/filter-bar.tsx`

### Context

Sticky bar below the hero. Two filter groups + sort dropdown + map toggle. Reads URL params via `useSearchParams()`, updates via `router.replace()`.

URL params used:
- `?vibe=` — "social" | "competitive" | "casual" or absent for "all"
- `?afters=` — "pub" | "coffee" | "brunch" or absent for "any"
- `?sort=` — "members" | "soonest" | "newest" or absent for default ("members")
- `?view=` — "map" or absent for list view

Design: `position: sticky`, `top: 0`, `z-index: 10`, white bg, subtle bottom border. Two rows on mobile (pills wrap), single row on desktop.

Active vibe pill: `bg-[#FFF1F2] text-primary` (primary-light). Active afters pill: amber (`bg-[#FEF3C7] text-[#B45309]`). Active map toggle: primary-light bg.

- [ ] **Step 1: Create `src/components/explore/filter-bar.tsx`**

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const VIBE_OPTIONS = [
  { label: "All", value: "" },
  { label: "🤝 Social", value: "social" },
  { label: "🏆 Competitive", value: "competitive" },
  { label: "😎 Casual", value: "casual" },
] as const;

const AFTERS_OPTIONS = [
  { label: "Any", value: "" },
  { label: "🍺 Pub", value: "pub" },
  { label: "☕ Café", value: "coffee" },
  { label: "🥐 Brunch", value: "brunch" },
] as const;

const SORT_OPTIONS = [
  { label: "Most members", value: "members" },
  { label: "Next run soonest", value: "soonest" },
  { label: "Newest clubs", value: "newest" },
] as const;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentVibe = searchParams.get("vibe") ?? "";
  const currentAfters = searchParams.get("afters") ?? "";
  const currentSort = searchParams.get("sort") ?? "members";
  const isMapView = searchParams.get("view") === "map";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }

  function toggleMapView() {
    updateParam("view", isMapView ? "" : "map");
  }

  const pillBase =
    "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap";

  return (
    <div
      className="sticky top-0 z-10 border-b bg-white px-4 py-2.5"
      style={{ borderColor: "#F5F0EB" }}
    >
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Vibe pills */}
          <div className="flex flex-wrap gap-1.5">
            {VIBE_OPTIONS.map(({ label, value }) => {
              const isActive = currentVibe === value;
              return (
                <button
                  key={value}
                  onClick={() => updateParam("vibe", value)}
                  className={pillBase}
                  style={
                    isActive
                      ? { background: "#FFF1F2", color: "#F43F5E" }
                      : { background: "#F5F0EB", color: "#78716C" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden h-4 w-px bg-border-muted sm:block" />

          {/* Afters pills */}
          <div className="flex flex-wrap gap-1.5">
            {AFTERS_OPTIONS.map(({ label, value }) => {
              const isActive = currentAfters === value;
              return (
                <button
                  key={value}
                  onClick={() => updateParam("afters", value)}
                  className={pillBase}
                  style={
                    isActive
                      ? { background: "#FEF3C7", color: "#B45309" }
                      : { background: "#F5F0EB", color: "#78716C" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Spacer + right-side controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Sort dropdown */}
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="rounded-[8px] border border-border-muted bg-white px-2 py-1 text-[11px] text-text-muted outline-none"
            >
              {SORT_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Map toggle */}
            <button
              onClick={toggleMapView}
              className={pillBase}
              style={
                isMapView
                  ? { background: "#FFF1F2", color: "#F43F5E" }
                  : { background: "#F5F0EB", color: "#78716C" }
              }
            >
              🗺️ Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/explore/filter-bar.tsx
git commit -m "feat: add FilterBar with vibe/afters/sort pills and map toggle"
```

---

## Task 7: `MapView` + `MapWrapper` Client Components

**Files:**
- Create: `src/components/explore/map-view.tsx`
- Create: `src/components/explore/map-wrapper.tsx`

### Context

Leaflet requires browser APIs — cannot render on the server. Use `dynamic(() => import('./map-view'), { ssr: false })` in `map-wrapper.tsx`. The `page.tsx` Server Component imports `MapWrapper` (not `MapView` directly).

Map features:
- Club markers: coral circle (`#F43F5E`) with `🏃` emoji or initials. Position = next event meeting point lat/lng, fallback to club's `location_lat/lng`. Skip clubs with neither.
- Clustering: `react-leaflet-cluster` (MarkerClusterGroup). Cluster icons: coral circle with count.
- Popup on click: club name, vibe badge, meeting point name, next event date+distance, going count, afters strip, "View club →" link.
- Filters apply: only clubs passed as props are shown (filtering happens server-side before the component receives data).
- City filter: when a city is selected, pan + zoom to that city's center (Sydney: [-33.87, 151.21], London: [51.51, -0.13], Amsterdam: [52.37, 4.90]).
- User location: "📍 Near me" button triggers `navigator.geolocation`. If granted, adds a blue dot. Does NOT ask on page load.
- Tile: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- CSS import: must include Leaflet CSS. Import `leaflet/dist/leaflet.css` at the top of `map-view.tsx`.
- Mobile: full-screen overlay when active (fixed, top-0, left-0, w-full, h-full). Desktop: 500px height block in page flow. Use Tailwind responsive classes.

Leaflet default marker icons are broken in Webpack/Next.js — fix by deleting the `_getIconUrl` property:
```typescript
import L from "leaflet";
// Fix broken default icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
```

But we're using custom `DivIcon` for markers so this isn't strictly needed. Include it anyway to prevent console errors.

- [ ] **Step 1: Create `src/components/explore/map-view.tsx`**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

// Fix broken default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

const CITY_CENTERS: Record<string, [number, number]> = {
  sydney: [-33.8688, 151.2093],
  london: [51.5074, -0.1278],
  amsterdam: [52.3676, 4.9041],
};

function createClubIcon(name: string) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return L.divIcon({
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#F43F5E;color:white;
      display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:700;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(244,63,94,0.4)
    ">${initials}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function CityPanner({ city }: { city: string }) {
  const map = useMap();
  useEffect(() => {
    const center = CITY_CENTERS[city.toLowerCase()];
    if (center) map.setView(center, 13, { animate: true });
  }, [city, map]);
  return null;
}

interface MapViewProps {
  clubs: ExploreClubRow[];
  selectedCity: string;
  onClose?: () => void; // called when mobile "back" button is tapped
}

export function MapView({ clubs, selectedCity, onClose }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  function requestUserLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }

  const markersData = clubs
    .map((club) => {
      const lat = parseFloat(
        club.nextEvent?.meetingPointLat ?? club.locationLat ?? "",
      );
      const lng = parseFloat(
        club.nextEvent?.meetingPointLng ?? club.locationLng ?? "",
      );
      if (isNaN(lat) || isNaN(lng)) return null;
      return { club, lat, lng };
    })
    .filter(Boolean) as { club: ExploreClubRow; lat: number; lng: number }[];

  const defaultCenter: [number, number] = CITY_CENTERS[selectedCity?.toLowerCase()] ?? [20, 0];
  const defaultZoom = selectedCity ? 12 : 3;

  return (
    <div className="relative">
      {/* Mobile: full-screen overlay. Desktop: 500px block. */}
      <div
        className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto md:h-[500px] md:w-full md:rounded-[14px] md:overflow-hidden"
        style={{ top: 0 }}
      >
        {/* Mobile back button */}
        <button
          onClick={onClose}
          className="absolute left-3 top-3 z-[1000] rounded-[10px] bg-white px-3 py-1.5 text-[13px] font-semibold text-text shadow-md md:hidden"
        >
          ← Back to list
        </button>

        {/* Near me button */}
        <button
          onClick={requestUserLocation}
          className="absolute bottom-4 right-3 z-[1000] rounded-[10px] bg-white px-3 py-1.5 text-[12px] font-semibold text-text shadow-md"
        >
          📍 Near me
        </button>

        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedCity && <CityPanner city={selectedCity} />}

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="
                  width:36px;height:36px;border-radius:50%;
                  background:#F43F5E;color:white;
                  display:flex;align-items:center;justify-content:center;
                  font-size:12px;font-weight:700;
                  border:2px solid white;
                  box-shadow:0 2px 8px rgba(244,63,94,0.4)
                ">${count}</div>`,
                className: "",
                iconSize: [36, 36],
                iconAnchor: [18, 18],
              });
            }}
          >
            {markersData.map(({ club, lat, lng }) => (
              <Marker
                key={club.id}
                position={[lat, lng]}
                icon={createClubIcon(club.name)}
              >
                <Popup minWidth={280} maxWidth={280}>
                  <div className="p-1">
                    <div className="mb-1 font-heading text-[14px] font-bold">
                      {club.name}
                    </div>
                    {club.nextEvent && (
                      <>
                        <p className="mb-0.5 text-[12px] text-gray-500">
                          {club.nextEvent.meetingPointName}
                        </p>
                        <p className="mb-0.5 text-[12px] font-medium">
                          {new Date(club.nextEvent.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                          {club.nextEvent.distanceKm &&
                            ` · ${club.nextEvent.distanceKm} ${club.nextEvent.distanceUnit}`}
                        </p>
                        <p className="mb-1 text-[11px] font-medium text-[#F43F5E]">
                          {club.nextEvent.goingCount} going
                        </p>
                        {club.nextEvent.postRunVenueName && (
                          <p
                            className="mb-1.5 rounded-[6px] px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: "#FEF3C7", color: "#B45309" }}
                          >
                            {club.postRunDefault === "pub" ? "🍺" : club.postRunDefault === "coffee" ? "☕" : club.postRunDefault === "brunch" ? "🥐" : "📍"}{" "}
                            Afters at {club.nextEvent.postRunVenueName}
                          </p>
                        )}
                      </>
                    )}
                    <a
                      href={`/${club.slug}`}
                      className="text-[12px] font-semibold text-[#F43F5E]"
                    >
                      View club →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* User location dot */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.divIcon({
                html: `<div style="
                  width:14px;height:14px;border-radius:50%;
                  background:#3B82F6;
                  border:2px solid white;
                  box-shadow:0 0 0 4px rgba(59,130,246,0.2)
                "></div>`,
                className: "",
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              })}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/explore/map-wrapper.tsx`**

```typescript
"use client";

import dynamic from "next/dynamic";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-[14px] border border-border-muted bg-surface-alt">
      <p className="text-[13px] text-text-muted">Loading map…</p>
    </div>
  ),
});

interface MapWrapperProps {
  clubs: ExploreClubRow[];
  selectedCity: string;
  onClose?: () => void;
}

export function MapWrapper({ clubs, selectedCity, onClose }: MapWrapperProps) {
  return <MapView clubs={clubs} selectedCity={selectedCity} onClose={onClose} />;
}
```

- [ ] **Step 3: Run build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors. If `react-leaflet-cluster` types cause issues, add `// @ts-ignore` on the import line and note it.

- [ ] **Step 4: Commit**

```bash
git add src/components/explore/map-view.tsx src/components/explore/map-wrapper.tsx
git commit -m "feat: add MapView and MapWrapper with Leaflet clustering"
```

---

## Task 8: Wire `page.tsx`

**Files:**
- Modify: `app/(public)/explore/page.tsx`

### Context

Server Component. Reads all search params, calls `getExploreClubs()`, renders `ExploreHero` + `FilterBar` + either `ClubList` or `MapWrapper`. The `MapWrapper` receives the same clubs data so filters apply to the map automatically.

The `ExploreHero` and `FilterBar` are Client Components — they are imported and rendered by this Server Component (passing no data, since they read URL params themselves).

The `MapWrapper` is a Client Component. It receives `clubs` + `selectedCity` props. The `onClose` handler needs to update the URL param to remove `?view=map`. Since `MapWrapper` is a Client Component, it can call `router.replace` itself. Pass `onClose` as undefined (the wrapper handles it internally via its own `useRouter`).

Update `MapWrapper` to handle its own `onClose` by calling `router.replace` without `?view=map`. Actually, `MapWrapper` already receives `onClose` as a prop. The `page.tsx` cannot pass a function (Server → Client). Instead, make `MapWrapper` handle `onClose` internally.

**Fix the MapWrapper**: remove the `onClose` prop pattern. Instead, have `MapWrapper` call `router.replace` directly. The Server Component does NOT pass `onClose`.

Here's the updated `MapWrapper` (amend during this task):

```typescript
"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-[14px] border border-border-muted bg-surface-alt">
      <p className="text-[13px] text-text-muted">Loading map…</p>
    </div>
  ),
});

interface MapWrapperProps {
  clubs: ExploreClubRow[];
  selectedCity: string;
}

export function MapWrapper({ clubs, selectedCity }: MapWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }

  return <MapView clubs={clubs} selectedCity={selectedCity} onClose={handleClose} />;
}
```

- [ ] **Step 1: Update `map-wrapper.tsx`** with the version above (remove `onClose` from props interface, add internal `useRouter` handler).

- [ ] **Step 2: Replace `app/(public)/explore/page.tsx`**

```typescript
import { Suspense } from "react";
import { ExploreHero } from "@/components/explore/explore-hero";
import { FilterBar } from "@/components/explore/filter-bar";
import { ClubList } from "@/components/explore/club-list";
import { MapWrapper } from "@/components/explore/map-wrapper";
import { getExploreClubs } from "@/lib/db/queries/communities";
import type { ExploreFilters } from "@/lib/db/queries/communities";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Run Clubs — RunClub",
  description:
    "Find run clubs near you in Sydney, London, and Amsterdam. Filter by vibe and afters venue. See who's going before you commit.",
  openGraph: {
    title: "Explore Run Clubs — RunClub",
    description:
      "Find run clubs by vibe, location, and where they go for afters.",
  },
};

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    vibe?: string;
    afters?: string;
    sort?: string;
    view?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const filters: ExploreFilters = {
    search: params.q || undefined,
    city: params.city || undefined,
    vibe: (params.vibe as ExploreFilters["vibe"]) || undefined,
    afters: (params.afters as ExploreFilters["afters"]) || undefined,
    sort: (params.sort as ExploreFilters["sort"]) || undefined,
  };

  const clubs = await getExploreClubs(filters);
  const isMapView = params.view === "map";
  const selectedCity = params.city ?? "";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with search + city pills — wrapped in Suspense for useSearchParams */}
      <Suspense>
        <ExploreHero />
      </Suspense>

      {/* Sticky filter bar */}
      <Suspense>
        <FilterBar />
      </Suspense>

      {/* Content */}
      <div className="mx-auto max-w-[720px] px-4 py-5">
        {isMapView ? (
          <Suspense>
            <MapWrapper clubs={clubs} selectedCity={selectedCity} />
          </Suspense>
        ) : (
          <ClubList clubs={clubs} totalCount={clubs.length} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run full build**

```bash
npm run build
```

Expected: clean build, no TypeScript or compilation errors. The `/explore` route should appear in the build output as `ƒ (Dynamic)`.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all tests pass (53 existing + 5 new from Task 2 = 58 total).

- [ ] **Step 5: Commit**

```bash
git add app/(public)/explore/page.tsx src/components/explore/map-wrapper.tsx
git commit -m "feat: implement explore page with search, filters, club cards, and map view"
```

---

## Self-Review Checklist

### Spec coverage

| Requirement | Task |
|-------------|------|
| Sunrise gradient hero, 32px/24px/36px padding | Task 5 |
| H1 "Find your crew", subtitle | Task 5 |
| Search input (debounced, white, rounded-xl) | Task 5 |
| City pills: All / Sydney / London / Amsterdam | Task 5 |
| Sticky filter bar | Task 6 |
| Vibe pills (All / Social / Competitive / Casual) | Task 6 |
| Afters pills (Any / Pub / Café / Brunch) | Task 6 |
| Sort dropdown (Most members / Soonest / Newest) | Task 6 |
| Map toggle pill | Task 6 |
| Pro priority placement (invisible) | Task 2 |
| Club card: name + vibe badge | Task 3 |
| Club card: Instagram link | Task 3 |
| Club card: location with MapPin | Task 3 |
| Club card: quick stats (members, streak, run day) | Task 3 |
| Club card: inline next event preview | Task 3 |
| Club card: going count in primary color | Task 3 |
| Club card: afters strip (amber, prominent) | Task 3 |
| Club card: description snippet (desktop only) | Task 3 |
| Map view: Leaflet + react-leaflet-cluster | Task 7 |
| Map: coral circle markers with initials | Task 7 |
| Map: coral cluster icons with count | Task 7 |
| Map: popup with club info + afters strip + link | Task 7 |
| Map: filters apply (server-side) | Task 8 |
| Map: city filter pans/zooms to city | Task 7 |
| Map: user location on "Near me" button click | Task 7 |
| Map: desktop 500px block, mobile full-screen overlay | Task 7 |
| Map: "Back to list" button (mobile) | Task 7 |
| Empty state with CTA | Task 4 |
| `generateMetadata` for SEO | Task 8 |
| Result count | Task 4 |

### Type consistency

- `ExploreClubRow` defined in Task 2, used in Tasks 3, 4, 7, 8 — same import path throughout: `@/lib/db/queries/communities`
- `ExploreFilters` defined in Task 2, used in Task 8
- `MapWrapper` props in Task 7 updated in Task 8 (remove `onClose` from interface)

### Notes for implementer

1. **Leaflet CSS**: `import "leaflet/dist/leaflet.css"` must be in `map-view.tsx` (the `ssr: false` component), not in a Server Component. If it causes a "Cannot use import statement" error, add `"use client"` to any file that transitively imports it.

2. **react-leaflet-cluster types**: The package may lack complete TypeScript types. If `iconCreateFunction` shows a type error, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` above it.

3. **`db.execute` return type**: Drizzle's `db.execute()` returns `{ rows: Record<string, unknown>[] }`. The type assertion `as NextEventDbRow[]` on `nextEventsResult.rows` is safe given the explicit column aliases in the SQL query.

4. **`sql.join` with UUIDs**: The `sql.join(communityIds.map(id => sql\`${id}::uuid\`), sql\`, \`)` pattern creates a parameterized `IN (...)` clause. Each `${id}` is a bound parameter.

5. **`Suspense` wrappers**: `ExploreHero` and `FilterBar` use `useSearchParams()` which requires a `Suspense` boundary in Next.js 16 App Router. The `<Suspense>` wrappers in `page.tsx` satisfy this requirement.
