# Organizer Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full organizer dashboard at `/dashboard/[slug]` with Overview, Events, Members, Analytics (Pro), and Settings tabs.

**Architecture:** Each tab is a Server Component page fetching data directly via Drizzle query functions and passing to focused client components only where interactivity is required (post-event capture form, member progress bar animation). The dashboard shell (sidebar + mobile tabs) already exists; this plan fills in the tab content. Analytics charts use Recharts in a `"use client"` component behind a Pro gate.

**Tech Stack:** Next.js 16 App Router (Server Components), Drizzle ORM, Recharts (already installed), Tailwind CSS, inline styles for pixel-perfect design tokens.

---

## Existing Foundation (do not recreate)

- `app/dashboard/layout.tsx` — auth guard
- `app/dashboard/[slug]/layout.tsx` — role check + sidebar + mobile tabs
- `src/components/dashboard-sidebar.tsx` — sidebar nav
- `src/components/dashboard-mobile-tabs.tsx` — mobile tab strip
- `src/lib/db/queries/communities.ts` — `getClubBySlug`, `getCommunityStats` (returns `CommunityStats`)
- `src/lib/db/queries/events.ts` — `getUpcomingEvents`, `getEventById`
- `src/lib/db/queries/memberships.ts` — `getUserMembership`
- `src/lib/db/schema.ts` — `communityStats` has: `totalEvents`, `totalActualAttendance`, `totalDistanceKm`, `totalAftersCount`, `uniqueRunners`, `avgActualPerEvent`, `avgShowRate`, `avgSocialRate`, `activeMemberCount`, `streakRecord`

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/lib/db/queries/events.ts` | Add `getDashboardEvents`, `getLastUncapturedEvent`, `getAttendanceHistory` |
| `src/lib/db/queries/memberships.ts` | Add `getDashboardMembers`, `getWaitlistedCount` |
| `src/lib/actions/event.ts` | Create — `savePostEventCapture` server action |
| `src/components/dashboard/member-progress.tsx` | Create — animated progress bar (client) |
| `src/components/dashboard/post-event-capture.tsx` | Create — "How did the run go?" form (client) |
| `src/components/dashboard/attendance-charts.tsx` | Create — Recharts charts for analytics (client) |
| `app/dashboard/[slug]/page.tsx` | Modify stub → full Overview |
| `app/dashboard/[slug]/events/page.tsx` | Create — Events tab |
| `app/dashboard/[slug]/members/page.tsx` | Create — Members tab |
| `app/dashboard/[slug]/analytics/page.tsx` | Create — Analytics tab (Pro gate) |
| `app/dashboard/[slug]/settings/page.tsx` | Create — Settings tab |

---

## Task 1: Dashboard query functions — events

**Files:**
- Modify: `src/lib/db/queries/events.ts`

- [ ] **Step 1: Add types and `getDashboardEvents`**

Add after the existing exports in `src/lib/db/queries/events.ts`:

```typescript
export type DashboardEventRow = {
  id: string;
  title: string;
  date: Date;
  status: "upcoming" | "completed" | "cancelled";
  goingCount: number;
  actualAttendance: number | null;
  actualSocialAttendance: number | null;
  distanceKm: string | null;
  distanceUnit: "km" | "mi";
  postRunVenueName: string | null;
};

export async function getDashboardEvents(
  communityId: string,
): Promise<DashboardEventRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      status: events.status,
      goingCount,
      actualAttendance: events.actualAttendance,
      actualSocialAttendance: events.actualSocialAttendance,
      distanceKm: events.distanceKm,
      distanceUnit: events.distanceUnit,
      postRunVenueName: events.postRunVenueName,
    })
    .from(events)
    .where(eq(events.communityId, communityId))
    .orderBy(desc(events.date));

  return rows;
}
```

Add `desc` to the drizzle-orm import at the top of the file:
```typescript
import { eq, and, gte, sql, desc } from "drizzle-orm";
```

- [ ] **Step 2: Add `getLastUncapturedEvent`**

```typescript
export type UncapturedEventRow = {
  id: string;
  title: string;
  date: Date;
};

export async function getLastUncapturedEvent(
  communityId: string,
): Promise<UncapturedEventRow | null> {
  const rows = await db
    .select({ id: events.id, title: events.title, date: events.date })
    .from(events)
    .where(
      and(
        eq(events.communityId, communityId),
        eq(events.status, "completed"),
        isNull(events.actualAttendance),
      ),
    )
    .orderBy(desc(events.date))
    .limit(1);

  return rows[0] ?? null;
}
```

Add `isNull` to the drizzle-orm import.

- [ ] **Step 3: Add `getAttendanceHistory`**

```typescript
export type AttendanceHistoryRow = {
  id: string;
  title: string;
  date: Date;
  goingCount: number;
  actualAttendance: number | null;
  actualSocialAttendance: number | null;
};

export async function getAttendanceHistory(
  communityId: string,
  limit = 12,
): Promise<AttendanceHistoryRow[]> {
  const goingCount = sql<number>`(SELECT COUNT(*) FROM ${eventRsvps} WHERE ${eventRsvps.eventId} = ${events.id} AND ${eventRsvps.status} = 'going')::int`;

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      goingCount,
      actualAttendance: events.actualAttendance,
      actualSocialAttendance: events.actualSocialAttendance,
    })
    .from(events)
    .where(
      and(
        eq(events.communityId, communityId),
        eq(events.status, "completed"),
      ),
    )
    .orderBy(events.date)
    .limit(limit);

  return rows;
}
```

- [ ] **Step 4: Type-check**

```bash
cd c:/Users/seanr/projects/run-club-platform && npx tsc --noEmit
```

Expected: no output (no errors).

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/queries/events.ts
git commit -m "feat: add getDashboardEvents, getLastUncapturedEvent, getAttendanceHistory queries"
```

---

## Task 2: Dashboard query functions — memberships

**Files:**
- Modify: `src/lib/db/queries/memberships.ts`

- [ ] **Step 1: Add imports and `getDashboardMembers`**

Add `memberAttendanceStats, users` to the import from `@/lib/db/schema`, and add `count, sql` to the drizzle-orm import. Then add:

```typescript
export type DashboardMemberRow = {
  userId: string;
  name: string;
  role: "owner" | "admin" | "member" | "waitlisted";
  joinedAt: Date;
  eventsAttended: number;
  showRate: string | null;
  currentStreak: number;
  status: "new" | "active" | "at_risk" | "lapsed" | null;
  preferredPaceGroup: string | null;
};

export async function getDashboardMembers(
  communityId: string,
): Promise<DashboardMemberRow[]> {
  const rows = await db
    .select({
      userId: memberships.userId,
      name: users.name,
      role: memberships.role,
      joinedAt: memberships.joinedAt,
      eventsAttended: memberAttendanceStats.eventsAttended,
      showRate: memberAttendanceStats.showRate,
      currentStreak: memberAttendanceStats.currentStreak,
      status: memberAttendanceStats.status,
      preferredPaceGroup: memberAttendanceStats.preferredPaceGroup,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .leftJoin(
      memberAttendanceStats,
      and(
        eq(memberAttendanceStats.userId, memberships.userId),
        eq(memberAttendanceStats.communityId, communityId),
      ),
    )
    .where(eq(memberships.communityId, communityId))
    .orderBy(memberships.joinedAt);

  return rows.map((r) => ({
    userId: r.userId,
    name: r.name,
    role: r.role,
    joinedAt: r.joinedAt,
    eventsAttended: r.eventsAttended ?? 0,
    showRate: r.showRate,
    currentStreak: r.currentStreak ?? 0,
    status: r.status ?? null,
    preferredPaceGroup: r.preferredPaceGroup ?? null,
  }));
}
```

The import line at the top of `memberships.ts` needs updating:
```typescript
import { memberships, communities, users, memberAttendanceStats } from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
```

- [ ] **Step 2: Add `getWaitlistedCount`**

```typescript
export async function getWaitlistedCount(communityId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(memberships)
    .where(
      and(
        eq(memberships.communityId, communityId),
        eq(memberships.role, "waitlisted"),
      ),
    );
  return rows[0]?.count ?? 0;
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/queries/memberships.ts
git commit -m "feat: add getDashboardMembers, getWaitlistedCount queries"
```

---

## Task 3: Post-event capture server action

**Files:**
- Create: `src/lib/actions/event.ts`

- [ ] **Step 1: Create the action file**

```typescript
// src/lib/actions/event.ts
"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { events, memberships } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

export async function savePostEventCapture(input: {
  eventId: string;
  communitySlug: string;
  actualAttendance: number;
  actualSocialAttendance: number;
}): Promise<ActionResult<void>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Verify user is owner/admin of the event's community
  const eventRows = await db
    .select({ communityId: events.communityId })
    .from(events)
    .where(eq(events.id, input.eventId))
    .limit(1);

  if (!eventRows.length) return { success: false, error: "Event not found" };

  const { communityId } = eventRows[0];

  const membershipRows = await db
    .select({ role: memberships.role })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, user.id),
        eq(memberships.communityId, communityId),
      ),
    )
    .limit(1);

  const membership = membershipRows[0];
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { success: false, error: "Not authorised" };
  }

  // 3. Validate
  if (
    typeof input.actualAttendance !== "number" ||
    input.actualAttendance < 0 ||
    typeof input.actualSocialAttendance !== "number" ||
    input.actualSocialAttendance < 0 ||
    input.actualSocialAttendance > input.actualAttendance
  ) {
    return { success: false, error: "Invalid attendance numbers" };
  }

  // 4. Update
  await db
    .update(events)
    .set({
      actualAttendance: input.actualAttendance,
      actualSocialAttendance: input.actualSocialAttendance,
      status: "completed",
    })
    .where(eq(events.id, input.eventId));

  revalidatePath(`/dashboard/${input.communitySlug}`);
  return { success: true, data: undefined };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/event.ts
git commit -m "feat: add savePostEventCapture server action"
```

---

## Task 4: Member progress bar component

**Files:**
- Create: `src/components/dashboard/member-progress.tsx`

Design tokens: coral primary `#F43F5E`, amber `#F59E0B`, surface `#FFFFFF`, border-muted `#F5F0EB`.

- [ ] **Step 1: Create the component**

```typescript
// src/components/dashboard/member-progress.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";

interface MemberProgressProps {
  memberCount: number;
  waitlistedCount: number;
  communitySlug: string;
}

export function MemberProgress({
  memberCount,
  waitlistedCount,
  communitySlug,
}: MemberProgressProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((memberCount / FREE_TIER_MEMBER_LIMIT) * 100, 100);

  // Animate on mount
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);

  const barColor = pct >= 90 ? "#F59E0B" : "#F43F5E";
  const isNearCap = pct >= 67 && pct < 90;
  const isAtCap = memberCount >= FREE_TIER_MEMBER_LIMIT;

  let label: React.ReactNode;
  if (isAtCap) {
    label = (
      <span style={{ fontSize: "11px", color: "#F43F5E", fontWeight: 600 }}>
        🔒 Club is full — new members are being waitlisted.{" "}
        <Link href={`/dashboard/${communitySlug}/settings`} style={{ textDecoration: "underline" }}>
          Upgrade to Pro →
        </Link>
      </span>
    );
  } else if (isNearCap) {
    label = (
      <span style={{ fontSize: "11px", color: "#F59E0B" }}>
        Getting close! {memberCount} of {FREE_TIER_MEMBER_LIMIT} members
      </span>
    );
  } else {
    label = (
      <span style={{ fontSize: "11px", color: "#A8A29E" }}>
        {memberCount} of {FREE_TIER_MEMBER_LIMIT} members
      </span>
    );
  }

  return (
    <>
      {/* Progress card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "12px",
          padding: "14px",
          marginBottom: waitlistedCount > 0 ? "8px" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#1C1917",
            }}
          >
            👥 {memberCount} / {FREE_TIER_MEMBER_LIMIT} members
          </span>
          <span style={{ fontSize: "10px", color: "#A8A29E" }}>Free plan</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#FFF5F0",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${width}%`,
              background: barColor,
              borderRadius: "999px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div style={{ marginTop: "6px" }}>{label}</div>
      </div>

      {/* Waitlist banner */}
      {waitlistedCount > 0 && (
        <div
          style={{
            background: "#FFF1F2",
            border: "1px solid #FECDD3",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#F43F5E",
                marginBottom: "2px",
              }}
            >
              🙋 {waitlistedCount}{" "}
              {waitlistedCount === 1 ? "person is" : "people are"} waiting to
              join
            </div>
            <div style={{ fontSize: "12px", color: "#78716C" }}>
              Your club has reached the 30-member limit on the free plan.
            </div>
          </div>
          <Link
            href={`/dashboard/${communitySlug}/settings`}
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              background: "#F43F5E",
              color: "white",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              boxShadow: "0 2px 8px rgba(244,63,94,0.3)",
            }}
          >
            Upgrade →
          </Link>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/member-progress.tsx
git commit -m "feat: add MemberProgress dashboard component"
```

---

## Task 5: Post-event capture component

**Files:**
- Create: `src/components/dashboard/post-event-capture.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/dashboard/post-event-capture.tsx
"use client";

import { useState } from "react";
import { savePostEventCapture } from "@/lib/actions/event";

interface PostEventCaptureProps {
  event: { id: string; title: string; date: Date };
  communitySlug: string;
}

export function PostEventCapture({ event, communitySlug }: PostEventCaptureProps) {
  const [actual, setActual] = useState("");
  const [social, setSocial] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(event.date);

  async function handleSave() {
    const a = parseInt(actual, 10);
    const s = parseInt(social, 10);
    if (isNaN(a) || isNaN(s)) {
      setError("Enter valid numbers");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await savePostEventCapture({
      eventId: event.id,
      communitySlug,
      actualAttendance: a,
      actualSocialAttendance: s,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error);
    } else {
      setSaved(true);
    }
  }

  if (saved) {
    return (
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: "12px",
          padding: "14px",
          fontSize: "12px",
          color: "#166534",
          fontWeight: 600,
        }}
      >
        ✓ Attendance saved for {event.title}!
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
        border: "1px solid #FDE68A",
        borderRadius: "12px",
        padding: "14px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#78350F",
          marginBottom: "2px",
        }}
      >
        How did {event.title}&apos;s run go?
      </div>
      <div style={{ fontSize: "11px", color: "#92400E", marginBottom: "12px" }}>
        {formattedDate} · Add the final numbers
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              color: "#92400E",
              fontWeight: 600,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Showed up
          </label>
          <input
            type="number"
            min="0"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#78350F",
              textAlign: "center",
              outline: "none",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              color: "#92400E",
              fontWeight: 600,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            For afters
          </label>
          <input
            type="number"
            min="0"
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#78350F",
              textAlign: "center",
              outline: "none",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !actual}
          style={{
            padding: "8px 16px",
            background: saving || !actual ? "#D4D4D8" : "#B45309",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: saving || !actual ? "default" : "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            flexShrink: 0,
            height: "38px",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && (
        <p style={{ marginTop: "6px", fontSize: "11px", color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/post-event-capture.tsx
git commit -m "feat: add PostEventCapture dashboard component"
```

---

## Task 6: Dashboard Overview page

**Files:**
- Modify: `app/dashboard/[slug]/page.tsx`

- [ ] **Step 1: Replace stub with full Overview**

```typescript
// app/dashboard/[slug]/page.tsx
import Link from "next/link";
import { Plus, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getCommunityStats } from "@/lib/db/queries/communities";
import { getUpcomingEvents } from "@/lib/db/queries/events";
import { getLastUncapturedEvent } from "@/lib/db/queries/events";
import { getWaitlistedCount } from "@/lib/db/queries/memberships";
import { MemberProgress } from "@/components/dashboard/member-progress";
import { PostEventCapture } from "@/components/dashboard/post-event-capture";
import { VENUE_EMOJI } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverviewPage({ params }: Props) {
  const { slug } = await params;

  const [community, stats, upcomingEvents, uncapturedEvent, waitlistedCount] =
    await Promise.all([
      getClubBySlug(slug),
      getCommunityStats(
        /* we need communityId — fetch community first, then stats */
        // workaround: fetch community then stats sequentially below
        "placeholder",
      ),
      // Placeholder — resolved below
      Promise.resolve([] as Awaited<ReturnType<typeof getUpcomingEvents>>),
      Promise.resolve(null as Awaited<ReturnType<typeof getLastUncapturedEvent>>),
      Promise.resolve(0),
    ]);

  // Re-fetch properly (community id needed for stats)
  const communityData = await getClubBySlug(slug);
  if (!communityData) notFound();

  const [statsData, upcomingEventsData, uncapturedEventData, waitlistedData] =
    await Promise.all([
      getCommunityStats(communityData.id),
      getUpcomingEvents(communityData.id, 3),
      getLastUncapturedEvent(communityData.id),
      getWaitlistedCount(communityData.id),
    ]);

  const isFree = communityData.tier === "free";

  const avgTurnout = statsData?.avgActualPerEvent
    ? Math.round(parseFloat(statsData.avgActualPerEvent))
    : null;
  const showRate = statsData?.avgShowRate
    ? Math.round(parseFloat(statsData.avgShowRate) * 100)
    : null;
  const aftersRate = statsData?.avgSocialRate
    ? Math.round(parseFloat(statsData.avgSocialRate) * 100)
    : null;
  const activeMembers = statsData?.activeMemberCount ?? null;

  const statCells = [
    { label: "Avg turnout", value: avgTurnout !== null ? String(avgTurnout) : "—", color: "#16A34A" },
    { label: "Show rate", value: showRate !== null ? `${showRate}%` : "—", color: "#8B5CF6" },
    { label: "Afters rate", value: aftersRate !== null ? `${aftersRate}%` : "—", color: "#F59E0B" },
    { label: "Active members", value: activeMembers !== null ? String(activeMembers) : "—", color: "#1C1917" },
  ];

  const totalDistanceKm = statsData?.totalDistanceKm
    ? Math.round(parseFloat(statsData.totalDistanceKm))
    : 0;

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }}>

      {/* Member progress bar (free tier only) */}
      {isFree && (
        <MemberProgress
          memberCount={communityData.memberCount}
          waitlistedCount={waitlistedData}
          communitySlug={slug}
        />
      )}

      {/* Post-event capture */}
      {uncapturedEventData && (
        <PostEventCapture
          event={uncapturedEventData}
          communitySlug={slug}
        />
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }} className="sm:grid-cols-4">
        {statCells.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "9px", color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Club totals */}
      {statsData && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            <span>🏃 {totalDistanceKm.toLocaleString()} km together</span>
            <span>🎉 {statsData.totalEvents} runs</span>
            <span>👥 {statsData.uniqueRunners} runners</span>
            <span>🍺 {statsData.totalAftersCount} afters</span>
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
            color: "#1C1917",
          }}
        >
          Upcoming runs
        </h2>
        {upcomingEventsData.length === 0 ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1917", marginBottom: "4px" }}>
              No upcoming runs
            </div>
            <div style={{ fontSize: "12px", color: "#78716C", marginBottom: "12px" }}>
              Schedule your first run to get started
            </div>
            <Link
              href={`/dashboard/${slug}/events`}
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "#F43F5E",
                color: "white",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              + New event
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {upcomingEventsData.map((event, i) => {
              const venueEmoji = event.postRunVenueName
                ? (VENUE_EMOJI[communityData.postRunDefault] ?? "📍")
                : null;
              const formattedDate = new Intl.DateTimeFormat("en-GB", {
                timeZone: communityData.timezone,
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(event.date);

              return (
                <div
                  key={event.id}
                  style={{
                    background: "#FFFFFF",
                    border: i === 0 ? "1.5px solid #FECDD3" : "1px solid #F5F0EB",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {i === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(to right, #F59E0B, #F97066, #F43F5E)",
                      }}
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1C1917",
                          marginBottom: "2px",
                        }}
                      >
                        {event.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#78716C", marginBottom: "4px" }}>
                        {formattedDate}
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: "#A8A29E" }}>
                          {event.goingCount} going
                        </span>
                        {venueEmoji && event.postRunVenueName && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "10px",
                              padding: "1px 6px",
                              background: "#FEF3C7",
                              color: "#B45309",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            {venueEmoji} {event.postRunVenueName}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/${slug}/events`}
                      style={{
                        flexShrink: 0,
                        marginLeft: "12px",
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#F43F5E",
                        background: "#FFF1F2",
                        borderRadius: "7px",
                        textDecoration: "none",
                      }}
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              );
            })}
            <Link
              href={`/dashboard/${slug}/events`}
              style={{
                display: "block",
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "#78716C",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              View all events →
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Link
          href={`/dashboard/${slug}/events/new`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "11px",
            background: "#F43F5E",
            color: "white",
            borderRadius: "11px",
            fontSize: "13px",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
          }}
        >
          <Plus size={14} /> New event
        </Link>
        <button
          onClick={() => {
            void navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "11px",
            background: "#FFFFFF",
            color: "#78716C",
            border: "1px solid #F5F0EB",
            borderRadius: "11px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Share2 size={14} /> Share club
        </button>
      </div>
    </div>
  );
}
```

**NOTE:** The `Share club` button requires `"use client"`. Extract it to a small client component:

```typescript
// src/components/dashboard/share-club-button.tsx
"use client";
import { Share2 } from "lucide-react";

export function ShareClubButton({ slug }: { slug: string }) {
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      }}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "11px",
        background: "#FFFFFF",
        color: "#78716C",
        border: "1px solid #F5F0EB",
        borderRadius: "11px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <Share2 size={14} /> Share club
    </button>
  );
}
```

Import `ShareClubButton` in the page and use it instead of the inline button. Remove `"use client"` from page.tsx.

The final `getCommunityStats` call has a bug (passing "placeholder"). Fix it by fetching community first, then everything else:

```typescript
// app/dashboard/[slug]/page.tsx — correct fetch pattern
export default async function DashboardOverviewPage({ params }: Props) {
  const { slug } = await params;

  const communityData = await getClubBySlug(slug);
  if (!communityData) notFound();

  const [statsData, upcomingEventsData, uncapturedEventData, waitlistedData] =
    await Promise.all([
      getCommunityStats(communityData.id),
      getUpcomingEvents(communityData.id, 3),
      getLastUncapturedEvent(communityData.id),
      getWaitlistedCount(communityData.id),
    ]);
  // ... rest of page
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/[slug]/page.tsx src/components/dashboard/share-club-button.tsx
git commit -m "feat: implement dashboard overview page"
```

---

## Task 7: Events tab

**Files:**
- Create: `app/dashboard/[slug]/events/page.tsx`

- [ ] **Step 1: Create the Events tab page**

```typescript
// app/dashboard/[slug]/events/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardEvents } from "@/lib/db/queries/events";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "Upcoming", bg: "#F0FDF4", color: "#16A34A" },
  completed: { label: "Completed", bg: "#F5F0EB", color: "#78716C" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626" },
};

export default async function DashboardEventsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const allEvents = await getDashboardEvents(community.id);

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
          }}
        >
          Events
        </h2>
        <Link
          href={`/dashboard/${slug}/events/new`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "8px 14px",
            background: "#F43F5E",
            color: "white",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow: "0 2px 8px rgba(244,63,94,0.25)",
          }}
        >
          <Plus size={12} /> New event
        </Link>
      </div>

      {allEvents.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>📅</div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: "4px",
            }}
          >
            No events yet
          </div>
          <div style={{ fontSize: "12px", color: "#78716C", marginBottom: "16px" }}>
            Create your first run to get started
          </div>
          <Link
            href={`/dashboard/${slug}/events/new`}
            style={{
              display: "inline-block",
              padding: "9px 18px",
              background: "#F43F5E",
              color: "white",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            + Create event
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {allEvents.map((event) => {
            const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.upcoming;
            const formattedDate = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).format(event.date);

            return (
              <div
                key={event.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "11px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1C1917",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {event.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#A8A29E" }}>
                    {formattedDate} · {event.goingCount} RSVPs
                    {event.actualAttendance !== null && (
                      <> · {event.actualAttendance} attended</>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    background: badge.bg,
                    color: badge.color,
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                >
                  {badge.label}
                </span>
                <Link
                  href={`/dashboard/${slug}/events/${event.id}/edit`}
                  style={{
                    flexShrink: 0,
                    fontSize: "11px",
                    color: "#A8A29E",
                    textDecoration: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: "#FFF5F0",
                  }}
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "app/dashboard/[slug]/events/page.tsx"
git commit -m "feat: add dashboard events tab"
```

---

## Task 8: Members tab

**Files:**
- Create: `app/dashboard/[slug]/members/page.tsx`

- [ ] **Step 1: Create the Members tab page**

```typescript
// app/dashboard/[slug]/members/page.tsx
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  owner: { label: "Owner", bg: "#FFE4E6", color: "#F43F5E" },
  admin: { label: "Admin", bg: "#EDE9FE", color: "#7C3AED" },
  member: { label: "Member", bg: "#F5F0EB", color: "#78716C" },
  waitlisted: { label: "Waitlisted", bg: "#FEF3C7", color: "#B45309" },
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#16A34A" },
  new: { label: "New", color: "#8B5CF6" },
  at_risk: { label: "At risk", color: "#F59E0B" },
  lapsed: { label: "Lapsed", color: "#DC2626" },
};

export default async function DashboardMembersPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const members = await getDashboardMembers(community.id);
  const isFree = community.tier === "free";
  const activeMembers = members.filter((m) => m.role !== "waitlisted");
  const waitlisted = members.filter((m) => m.role === "waitlisted");

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
          }}
        >
          Members{" "}
          <span style={{ fontSize: "14px", color: "#A8A29E", fontWeight: 400 }}>
            ({activeMembers.length}
            {isFree ? ` / ${FREE_TIER_MEMBER_LIMIT}` : ""})
          </span>
        </h2>
        <button
          title={isFree ? "Upgrade to Pro to export CSV" : "Export as CSV"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "7px 12px",
            background: "#FFFFFF",
            color: isFree ? "#A8A29E" : "#78716C",
            border: "1px solid #F5F0EB",
            borderRadius: "9px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: isFree ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          ⬇ Export CSV {isFree && "🔒"}
        </button>
      </div>

      {members.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>👥</div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: "4px",
            }}
          >
            No members yet
          </div>
          <div style={{ fontSize: "12px", color: "#78716C" }}>
            Share your club page to get runners joining
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {activeMembers.map((m) => {
              const roleBadge = ROLE_BADGE[m.role];
              const statusBadge = m.status ? STATUS_BADGE[m.status] : null;

              return (
                <div
                  key={m.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #F5F0EB",
                    borderRadius: "10px",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#FFE4E6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#F43F5E",
                      flexShrink: 0,
                    }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + stats */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1C1917",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#A8A29E" }}>
                      {m.eventsAttended} runs
                      {m.showRate && (
                        <> · {Math.round(parseFloat(m.showRate) * 100)}% show rate</>
                      )}
                      {m.currentStreak > 0 && (
                        <> · 🔥 {m.currentStreak}wk</>
                      )}
                      {m.preferredPaceGroup && (
                        <> · {m.preferredPaceGroup}</>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  {statusBadge && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        color: statusBadge.color,
                        flexShrink: 0,
                      }}
                    >
                      {statusBadge.label}
                    </span>
                  )}

                  {/* Role badge */}
                  {roleBadge && m.role !== "member" && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        background: roleBadge.bg,
                        color: roleBadge.color,
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                    >
                      {roleBadge.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Waitlist section */}
          {waitlisted.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                  color: "#B45309",
                }}
              >
                Waitlist ({waitlisted.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {waitlisted.map((m) => (
                  <div
                    key={m.userId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      background: "#FEF3C7",
                      border: "1px solid #FDE68A",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#B45309",
                        flexShrink: 0,
                      }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: "#78350F" }}>
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        background: "#FEF3C7",
                        color: "#B45309",
                        border: "1px solid #FDE68A",
                        borderRadius: "4px",
                      }}
                    >
                      Waitlisted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "app/dashboard/[slug]/members/page.tsx"
git commit -m "feat: add dashboard members tab"
```

---

## Task 9: Analytics charts component

**Files:**
- Create: `src/components/dashboard/attendance-charts.tsx`

- [ ] **Step 1: Create the Recharts component**

```typescript
// src/components/dashboard/attendance-charts.tsx
"use client";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AttendanceDataPoint {
  label: string;
  rsvps: number;
  actual: number | null;
  afters: number | null;
}

interface AttendanceChartsProps {
  attendanceData: AttendanceDataPoint[];
  showRateTrend: { label: string; rate: number }[];
  memberHealth: { name: string; value: number; color: string }[];
}

export function AttendanceCharts({
  attendanceData,
  showRateTrend,
  memberHealth,
}: AttendanceChartsProps) {
  const barData = attendanceData.map((d) => ({
    name: d.label,
    RSVPs: d.rsvps,
    Attended: d.actual ?? 0,
    Afters: d.afters ?? 0,
  }));

  const areaData = showRateTrend.map((d) => ({
    name: d.label,
    rate: Math.round(d.rate * 100),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Attendance bar chart */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: "12px",
          }}
        >
          Attendance
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="RSVPs" fill="#F5F0EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Attended" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Afters" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2-col: show rate + member health */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {/* Show rate area chart */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1C1917",
              marginBottom: "12px",
            }}
          >
            Show rate
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "#A8A29E" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(v: number) => [`${v}%`, "Show rate"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="#8B5CF6"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Member health donut */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1C1917",
              marginBottom: "12px",
            }}
          >
            Member health
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={memberHealth}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
                paddingAngle={2}
              >
                {memberHealth.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: "9px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/attendance-charts.tsx
git commit -m "feat: add AttendanceCharts Recharts component"
```

---

## Task 10: Analytics tab page

**Files:**
- Create: `app/dashboard/[slug]/analytics/page.tsx`

- [ ] **Step 1: Create the Analytics tab page**

```typescript
// app/dashboard/[slug]/analytics/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubBySlug, getCommunityStats } from "@/lib/db/queries/communities";
import { getAttendanceHistory } from "@/lib/db/queries/events";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { AttendanceCharts } from "@/components/dashboard/attendance-charts";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardAnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const isFree = community.tier === "free";

  const [stats, history, members] = await Promise.all([
    getCommunityStats(community.id),
    getAttendanceHistory(community.id, 12),
    getDashboardMembers(community.id),
  ]);

  const statCells = [
    {
      label: "Avg turnout",
      value: stats?.avgActualPerEvent
        ? Math.round(parseFloat(stats.avgActualPerEvent))
        : "—",
      color: "#16A34A",
    },
    {
      label: "Show rate",
      value: stats?.avgShowRate
        ? `${Math.round(parseFloat(stats.avgShowRate) * 100)}%`
        : "—",
      color: "#8B5CF6",
    },
    {
      label: "Afters rate",
      value: stats?.avgSocialRate
        ? `${Math.round(parseFloat(stats.avgSocialRate) * 100)}%`
        : "—",
      color: "#F59E0B",
    },
    {
      label: "Events run",
      value: stats?.totalEvents ?? "—",
      color: "#1C1917",
    },
  ];

  // Prepare chart data
  const attendanceData = history.map((e) => ({
    label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(e.date),
    rsvps: e.goingCount,
    actual: e.actualAttendance,
    afters: e.actualSocialAttendance,
  }));

  const showRateTrend = history.map((e) => ({
    label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(e.date),
    rate:
      e.goingCount > 0 && e.actualAttendance !== null
        ? e.actualAttendance / e.goingCount
        : 0,
  }));

  const activeCount = members.filter((m) => m.status === "active").length;
  const newCount = members.filter((m) => m.status === "new").length;
  const atRiskCount = members.filter((m) => m.status === "at_risk").length;
  const lapsedCount = members.filter((m) => m.status === "lapsed").length;
  const memberHealth = [
    { name: "Active", value: activeCount, color: "#16A34A" },
    { name: "New", value: newCount, color: "#8B5CF6" },
    { name: "At risk", value: atRiskCount, color: "#F59E0B" },
    { name: "Lapsed", value: lapsedCount, color: "#DC2626" },
  ].filter((s) => s.value > 0);

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#1C1917",
        }}
      >
        Analytics
      </h2>

      {/* Stats grid — always visible */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          marginBottom: "16px",
        }}
        className="sm:grid-cols-4"
      >
        {statCells.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {isFree ? (
        /* Free tier: blurred charts + upgrade CTA */
        <div style={{ position: "relative" }}>
          <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
            <AttendanceCharts
              attendanceData={attendanceData.length > 0 ? attendanceData : [
                { label: "Jan 1", rsvps: 18, actual: 14, afters: 8 },
                { label: "Jan 8", rsvps: 22, actual: 19, afters: 11 },
                { label: "Jan 15", rsvps: 20, actual: 16, afters: 9 },
              ]}
              showRateTrend={showRateTrend.length > 0 ? showRateTrend : [
                { label: "Jan 1", rate: 0.78 },
                { label: "Jan 8", rate: 0.86 },
                { label: "Jan 15", rate: 0.80 },
              ]}
              memberHealth={memberHealth.length > 0 ? memberHealth : [
                { name: "Active", value: 18, color: "#16A34A" },
                { name: "New", value: 5, color: "#8B5CF6" },
                { name: "At risk", value: 4, color: "#F59E0B" },
                { name: "Lapsed", value: 3, color: "#DC2626" },
              ]}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "28px" }}>🔒</div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1C1917",
                textAlign: "center",
              }}
            >
              Unlock full analytics
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#78716C",
                textAlign: "center",
                maxWidth: "240px",
              }}
            >
              See attendance trends, show rates, and member health with Pro
            </div>
            <Link
              href={`/dashboard/${slug}/settings`}
              style={{
                padding: "10px 20px",
                background: "#F43F5E",
                color: "white",
                borderRadius: "11px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
              }}
            >
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      ) : (
        /* Pro tier: full charts */
        <AttendanceCharts
          attendanceData={attendanceData}
          showRateTrend={showRateTrend}
          memberHealth={memberHealth}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "app/dashboard/[slug]/analytics/page.tsx"
git commit -m "feat: add dashboard analytics tab with Pro gate and Recharts"
```

---

## Task 11: Settings tab

**Files:**
- Create: `app/dashboard/[slug]/settings/page.tsx`

- [ ] **Step 1: Create the Settings tab page**

```typescript
// app/dashboard/[slug]/settings/page.tsx
import { ChevronRight, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubBySlug } from "@/lib/db/queries/communities";

interface Props {
  params: Promise<{ slug: string }>;
}

interface SettingsRow {
  icon: string;
  label: string;
  description: string;
  href: string;
  proOnly?: boolean;
  destructive?: boolean;
}

export default async function DashboardSettingsPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const isFree = community.tier === "free";

  const rows: SettingsRow[] = [
    {
      icon: "📝",
      label: "Club details",
      description: "Name, description, city, vibe, afters venue",
      href: `/dashboard/${slug}/settings/details`,
    },
    {
      icon: "💳",
      label: "Billing & subscription",
      description: isFree ? "Free plan · Upgrade to Pro" : "Pro plan · Manage subscription",
      href: `/dashboard/${slug}/settings/billing`,
    },
    {
      icon: "🎨",
      label: "Custom branding",
      description: "Theme colour for your club page",
      href: `/dashboard/${slug}/settings/branding`,
      proOnly: true,
    },
    {
      icon: "🔔",
      label: "Notifications",
      description: "Email preferences for reminders and digests",
      href: `/dashboard/${slug}/settings/notifications`,
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#1C1917",
        }}
      >
        Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "24px" }}>
        {rows.map((row) => {
          const isLocked = row.proOnly && isFree;

          return (
            <Link
              key={row.label}
              href={isLocked ? `/dashboard/${slug}/settings/billing` : row.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "12px",
                textDecoration: "none",
                opacity: isLocked ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: "18px" }}>{row.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1C1917",
                    marginBottom: "1px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {row.label}
                  {isLocked && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "1px 5px",
                        background: "#FFE4E6",
                        color: "#F43F5E",
                        borderRadius: "4px",
                      }}
                    >
                      <Lock size={8} /> PRO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", color: "#A8A29E" }}>
                  {row.description}
                </div>
              </div>
              <ChevronRight size={14} color="#A8A29E" />
            </Link>
          );
        })}
      </div>

      {/* Danger zone */}
      <div
        style={{
          background: "#FEF3C7",
          border: "1px solid #FDE68A",
          borderRadius: "12px",
          padding: "14px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#B45309",
            marginBottom: "4px",
          }}
        >
          Danger zone
        </div>
        <div style={{ fontSize: "11px", color: "#92400E", marginBottom: "10px" }}>
          Deactivating hides your club from explore and cancels upcoming events. All data is preserved and you can reactivate at any time.
        </div>
        <Link
          href={`/dashboard/${slug}/settings/deactivate`}
          style={{
            display: "inline-block",
            padding: "7px 14px",
            background: "rgba(255,255,255,0.7)",
            color: "#B45309",
            border: "1px solid #FDE68A",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Deactivate club
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "app/dashboard/[slug]/settings/page.tsx"
git commit -m "feat: add dashboard settings tab"
```

---

## Verification

1. `npx tsc --noEmit` passes with no errors
2. Start dev server: `npm run dev`
3. Navigate to `/dashboard/[any-slug]` — overview renders with progress bar, stats grid, upcoming events, quick actions
4. Click Events tab — event list renders with status badges
5. Click Members tab — member list with role/status badges
6. Click Analytics tab as free user — stats grid visible, charts are blurred with upgrade CTA overlay
7. Click Settings tab — four rows with correct Pro lock on branding
8. Post-event capture: mark an event as completed in DB with `actualAttendance = NULL`, navigate to overview — capture card appears; fill in numbers and click Save — card disappears and shows success
9. Mobile: tabs appear at top instead of sidebar at <768px
