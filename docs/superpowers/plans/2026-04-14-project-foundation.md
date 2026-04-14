# Project Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the complete project foundation for the RunClub platform — dependencies, `src/` directory structure, Drizzle schema, Tailwind v4 brand theme, Supabase helpers, env validation, shared types, and utility functions — ready for feature development, with no pages yet.

**Architecture:** Next.js 16 App Router with `app/` at the project root (the Next.js default — no `src/app/` migration). Library code lives in `src/lib/`, components in `src/components/`, types in `src/types/`. The `@/` TypeScript alias is updated to point to `./src/` so `@/lib/...`, `@/components/...`, and `@/types/...` all resolve correctly. The `app/` directory stays at root as-is.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Drizzle ORM + postgres, Supabase Auth + Storage, Tailwind v4, shadcn/ui, Zod, Vitest

---

### Task 1: Install npm dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres stripe resend @react-email/components react-hook-form @hookform/resolvers zod recharts posthog-js posthog-node lucide-react @upstash/ratelimit @upstash/redis
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D drizzle-kit vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test @types/pg
```

- [ ] **Step 3: Verify installation succeeded — no peer dependency errors**

```bash
npm ls --depth=0 2>&1 | grep -E "^(WARN|ERR)" | head -20
```

Expected: no ERROR lines (peer warnings are acceptable)

- [ ] **Step 4: Add database + test scripts to package.json**

Replace the `"scripts"` section in `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
},
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install project dependencies"
```

---

### Task 2: Create src/ structure and configure TypeScript @/ alias

**Files:**

- Create: `src/` directory (lib, components, types, test, e2e subdirs)
- Modify: `tsconfig.json`

> **Why:** `app/` stays at root as the Next.js default. Library code (`src/lib/`), components (`src/components/`), and types (`src/types/`) live in `src/`. The `@/` alias is updated to point to `./src/` so that `@/lib/db/schema`, `@/components/...`, and `@/types/...` all resolve correctly. App files import from `@/lib/...` — no circular dependency.\*\*

- [ ] **Step 1: Create src/ subdirectory structure**

```bash
mkdir -p src/lib/db/queries src/lib/actions src/lib/email/templates src/lib/supabase src/lib/stripe src/lib/posthog src/lib/validations src/components/ui src/components/analytics src/components/posthog src/types src/test src/e2e
```

- [ ] **Step 2: Update tsconfig.json — change @/ alias to point to src/**

Replace `tsconfig.json` entirely:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Verify dev server starts — app/ still works at root**

```bash
npm run dev
```

Expected: `✓ Ready in Xs` — visit http://localhost:3000 and see the existing page. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json src/
git commit -m "chore: create src/ structure and update @/ alias to ./src/"
```

---

### Task 3: Tailwind v4 brand theme + Google Fonts

**Files:**

- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

> **Why:** Tailwind v4 uses CSS-based configuration via `@theme {}` instead of `tailwind.config.js`. All brand colors, fonts, and custom tokens go in globals.css.

- [ ] **Step 1: Replace app/globals.css with full brand theme**

```css
@import "tailwindcss";

/* ─── Brand: Coral Soft (Sunrise) ─── */
@theme {
  /* Colors */
  --color-primary: #f43f5e; /* coral — buttons, links, active */
  --color-secondary: #8b5cf6; /* purple — badges, accents */
  --color-accent: #f59e0b; /* amber — venue/afters badges, warnings */
  --color-success: #16a34a; /* green — confirmations */

  --color-background: #fffbf7; /* warm cream */
  --color-surface: #ffffff;
  --color-surface-alt: #fff5f0; /* subtle card bg */

  --color-border: #fecdd3; /* featured card borders */
  --color-border-muted: #f5f0eb; /* standard card borders */

  --color-text: #1c1917; /* headings, body */
  --color-text-muted: #78716c; /* secondary text */
  --color-text-light: #a8a29e; /* labels, hints */

  /* Venue badge — ALWAYS amber, never coral */
  --color-venue-bg: #fef3c7;
  --color-venue-text: #b45309;

  /* Typography */
  --font-heading: var(--font-bricolage), "Bricolage Grotesque", sans-serif;
  --font-body: var(--font-dm-sans), "DM Sans", sans-serif;
  --font-sans: var(--font-dm-sans), "DM Sans", sans-serif;

  /* Border radii */
  --radius-card: 14px;
  --radius-button: 12px;
  --radius-input: 10px;
  --radius-badge: 7px;
}

/* ─── Base styles ─── */
:root {
  background-color: #fffbf7;
  color: #1c1917;
}

body {
  font-family: var(--font-body);
  background-color: #fffbf7;
  color: #1c1917;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ─── Sunrise gradient utility ─── */
.bg-sunrise {
  background: linear-gradient(
    to top,
    #f59e0b 0%,
    #fb923c 20%,
    #f97066 50%,
    #f43f5e 80%,
    #e879a0 100%
  );
}

/* ─── Card shadow utilities ─── */
.shadow-card {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
}

.shadow-primary-glow {
  box-shadow: 0 2px 12px rgba(244, 63, 94, 0.3);
}
```

- [ ] **Step 2: Update app/layout.tsx to load Google Fonts**

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RunClub — The platform for run clubs",
  description:
    "Schedule events, manage members, track attendance, and coordinate afters at your favourite venue. Free to start.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify fonts load correctly**

```bash
npm run dev
```

Expected: dev server starts, http://localhost:3000 shows warm cream background. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: set up Tailwind v4 brand theme with Coral Soft palette"
```

---

### Task 4: Initialize shadcn/ui

**Files:**

- Create: `components.json`
- Create/Modify: `src/lib/utils.ts` (shadcn creates cn() here)

> **shadcn/ui provides accessible, unstyled UI primitives (Button, Dialog, Input, etc.) that get copied into `src/components/ui/`. Components are added individually with `npx shadcn@latest add <component>`.**

- [ ] **Step 1: Run shadcn init**

```bash
npx shadcn@latest init
```

When prompted, answer:

- **Which style?** → Default
- **Which base color?** → Stone
- **Use CSS variables for theming?** → Yes
- **src/ directory?** → No (`app/` is at the root)
- **Tailwind CSS file?** → app/globals.css
- **components alias (@/components)?** → @/components
- **utils alias (@/lib/utils)?** → @/lib/utils

> If prompted for anything else, accept defaults.

- [ ] **Step 2: Verify components.json was created**

```bash
cat components.json
```

Expected: JSON file with `style`, `tailwind`, `aliases` fields.

- [ ] **Step 3: Verify src/lib/utils.ts exists with cn()**

```bash
cat src/lib/utils.ts
```

Expected: file contains `import { clsx }` and `export function cn(...)`.

> **Note:** shadcn may add CSS variable definitions to `src/app/globals.css` (e.g., `--background`, `--foreground`, `--primary`). These can coexist with the brand `@theme` block — do NOT remove them.

- [ ] **Step 4: Verify build still passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ Compiled successfully` or similar success output.

- [ ] **Step 5: Commit**

```bash
git add components.json src/lib/utils.ts src/app/globals.css
git commit -m "chore: initialize shadcn/ui"
```

---

### Task 5: Drizzle schema and database connection

**Files:**

- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`
- Create: `drizzle.config.ts`

> **This is the source of truth for the entire data model. 7 tables. Read before touching.**

- [ ] **Step 1: Create drizzle.config.ts**

```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

- [ ] **Step 2: Create src/lib/db/index.ts**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Used for query purposes (pooled connection)
const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema });
```

- [ ] **Step 3: Create src/lib/db/schema.ts — enums first**

```ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const communityTypeEnum = pgEnum("community_type", ["run_club"]);
export const vibeEnum = pgEnum("vibe", ["competitive", "social", "casual"]);
export const postRunDefaultEnum = pgEnum("post_run_default", [
  "pub",
  "coffee",
  "brunch",
  "none",
]);
export const tierEnum = pgEnum("tier", ["free", "pro"]);
export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "admin",
  "member",
  "waitlisted",
]);
export const distanceUnitEnum = pgEnum("distance_unit", ["km", "mi"]);
export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "completed",
  "cancelled",
]);
export const rsvpStatusEnum = pgEnum("rsvp_status", ["going", "maybe"]);
export const memberStatusEnum = pgEnum("member_status", [
  "new",
  "active",
  "at_risk",
  "lapsed",
]);
```

- [ ] **Step 4: Add the 7 tables to src/lib/db/schema.ts — paste below the enums**

```ts
// ─── users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  pacePreference: text("pace_preference"),
  currentOverallStreak: integer("current_overall_streak").notNull().default(0),
  longestOverallStreak: integer("longest_overall_streak").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── communities ──────────────────────────────────────────────────────────────

export const communities = pgTable(
  "communities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    type: communityTypeEnum("type").notNull().default("run_club"),
    city: text("city").notNull(),
    timezone: text("timezone").notNull(), // e.g. "Europe/London"
    locationLat: numeric("location_lat", { precision: 10, scale: 7 }),
    locationLng: numeric("location_lng", { precision: 10, scale: 7 }),
    coverImageUrl: text("cover_image_url"),
    instagramHandle: text("instagram_handle"), // stored without @
    vibe: vibeEnum("vibe").notNull(),
    postRunDefault: postRunDefaultEnum("post_run_default")
      .notNull()
      .default("none"),
    themeColor: text("theme_color"), // Pro only — hex string e.g. "#1E40AF"
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    memberCount: integer("member_count").notNull().default(0),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: tierEnum("tier").notNull().default("free"),
    lastWaitlistEmailSentAt: timestamp("last_waitlist_email_sent_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_communities_city").on(table.city),
    index("idx_communities_type").on(table.type),
    index("idx_communities_vibe").on(table.vibe),
  ],
);

// ─── memberships ──────────────────────────────────────────────────────────────

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("member"),
    attendanceCount: integer("attendance_count").notNull().default(0),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_memberships_user_community").on(
      table.userId,
      table.communityId,
    ),
    index("idx_memberships_user").on(table.userId),
    index("idx_memberships_community").on(table.communityId),
    index("idx_memberships_community_role").on(table.communityId, table.role),
  ],
);

// ─── events ───────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    meetingPointName: text("meeting_point_name").notNull(),
    meetingPointLat: numeric("meeting_point_lat", { precision: 10, scale: 7 }),
    meetingPointLng: numeric("meeting_point_lng", { precision: 10, scale: 7 }),
    distanceKm: numeric("distance_km", { precision: 6, scale: 2 }),
    distanceUnit: distanceUnitEnum("distance_unit").notNull().default("km"),
    routeUrl: text("route_url"),
    // jsonb array of { name: string, pace: string } objects
    paceGroups:
      jsonb("pace_groups").$type<Array<{ name: string; pace: string }>>(),
    postRunVenueName: text("post_run_venue_name"),
    postRunVenueUrl: text("post_run_venue_url"),
    postRunVenueNotes: text("post_run_venue_notes"),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurrenceRule: text("recurrence_rule"), // e.g. "WEEKLY:WED"
    status: eventStatusEnum("status").notNull().default("upcoming"),
    actualAttendance: integer("actual_attendance"),
    actualSocialAttendance: integer("actual_social_attendance"),
    postEventNote: text("post_event_note"),
    weatherConditions: text("weather_conditions"),
    reminderSent: boolean("reminder_sent").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_events_community_status").on(table.communityId, table.status),
    index("idx_events_date").on(table.date),
  ],
);

// ─── event_rsvps ──────────────────────────────────────────────────────────────

export const eventRsvps = pgTable(
  "event_rsvps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: rsvpStatusEnum("status").notNull().default("going"),
    joiningSocial: boolean("joining_social").notNull().default(false),
    paceGroup: text("pace_group"), // matches a name from events.pace_groups
    attended: boolean("attended").notNull().default(false),
    checkedIn: boolean("checked_in").notNull().default(false),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_event_rsvps_event_user").on(table.eventId, table.userId),
    index("idx_event_rsvps_event_user").on(table.eventId, table.userId),
  ],
);

// ─── community_stats (cache table — recomputed after each event completes) ────

export const communityStats = pgTable("community_stats", {
  communityId: uuid("community_id")
    .primaryKey()
    .references(() => communities.id, { onDelete: "cascade" }),
  totalEvents: integer("total_events").notNull().default(0),
  totalRsvps: integer("total_rsvps").notNull().default(0),
  totalActualAttendance: integer("total_actual_attendance")
    .notNull()
    .default(0),
  // sum of distance_km × actual_attendance for all completed events
  totalDistanceKm: numeric("total_distance_km", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0"),
  totalAftersCount: integer("total_afters_count").notNull().default(0),
  // count of distinct members who've attended ≥1 event
  uniqueRunners: integer("unique_runners").notNull().default(0),
  avgRsvpPerEvent: numeric("avg_rsvp_per_event", { precision: 6, scale: 2 }),
  avgActualPerEvent: numeric("avg_actual_per_event", {
    precision: 6,
    scale: 2,
  }),
  avgShowRate: numeric("avg_show_rate", { precision: 5, scale: 4 }), // 0.0–1.0
  avgSocialRate: numeric("avg_social_rate", { precision: 5, scale: 4 }),
  memberCount: integer("member_count").notNull().default(0),
  activeMemberCount: integer("active_member_count").notNull().default(0),
  retentionRate30d: numeric("retention_rate_30d", { precision: 5, scale: 4 }),
  streakRecord: integer("streak_record").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── member_attendance_stats (per-member per-community) ───────────────────────

export const memberAttendanceStats = pgTable(
  "member_attendance_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    eventsAttended: integer("events_attended").notNull().default(0),
    eventsRsvpd: integer("events_rsvpd").notNull().default(0),
    // sum of distance_km for events this member attended
    totalDistanceKm: numeric("total_distance_km", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default("0"),
    // number of events where member stayed for afters
    aftersCount: integer("afters_count").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastAttendedAt: timestamp("last_attended_at", { withTimezone: true }),
    showRate: numeric("show_rate", { precision: 5, scale: 4 }), // 0.0–1.0
    joinsSocialRate: numeric("joins_social_rate", { precision: 5, scale: 4 }),
    preferredPaceGroup: text("preferred_pace_group"),
    status: memberStatusEnum("status").notNull().default("new"),
  },
  (table) => [
    uniqueIndex("uq_member_stats_user_community").on(
      table.userId,
      table.communityId,
    ),
  ],
);

// ─── Inferred types (use these throughout the codebase) ───────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
export type CommunityStats = typeof communityStats.$inferSelect;
export type MemberAttendanceStats = typeof memberAttendanceStats.$inferSelect;
```

- [ ] **Step 5: Verify TypeScript compiles the schema without errors**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output (clean compile). If there are errors, fix them before proceeding.

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/schema.ts src/lib/db/index.ts drizzle.config.ts
git commit -m "feat: add Drizzle schema (7 tables) and database connection"
```

---

### Task 6: Supabase client helpers

**Files:**

- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

> **Two clients: browser (uses anon key + browser storage) and server (uses anon key + server-side cookies). The service role key — used only in crons and webhooks — gets its own client, added when those routes are built.**

- [ ] **Step 1: Create src/lib/supabase/client.ts**

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 2: Create src/lib/supabase/server.ts**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — cookies cannot be set
            // in middleware or layout — safe to ignore
          }
        },
      },
    },
  );
}

/**
 * Get the authenticated user from the server-side Supabase client.
 * Returns null if not authenticated.
 * Use this at the start of every Server Action and Server Component that needs auth.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
```

- [ ] **Step 3: Verify TypeScript is happy**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase client and server helpers"
```

---

### Task 7: Environment validation with Zod

**Files:**

- Create: `src/lib/env.ts`
- Create: `src/lib/env.test.ts`

> **All secrets are validated at startup. Server-only vars must never have the `NEXT_PUBLIC_` prefix. This file crashes fast with a clear message if a required env var is missing.**

- [ ] **Step 1: Write the failing test first**

Create `src/lib/env.test.ts`:

```ts
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
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    await expect(import("./env")).rejects.toThrow();
  });

  it("throws when STRIPE_SECRET_KEY does not start with sk_", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    process.env.STRIPE_SECRET_KEY = "not-a-stripe-key";
    await expect(import("./env")).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails (env.ts does not exist yet)**

```bash
npm test -- src/lib/env.test.ts
```

Expected: FAIL — "Cannot find module './env'"

- [ ] **Step 3: Create src/lib/env.ts**

```ts
import { z } from "zod";

const envSchema = z.object({
  // ─── Public (safe to expose to browser) ───
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),

  // ─── Server-only (NEVER use in Client Components) ───
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  RESEND_API_KEY: z.string().startsWith("re_"),
  CRON_SECRET: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

/**
 * Parsed + validated environment variables.
 * Import this — never access process.env directly in application code.
 * This throws at startup if any required variable is missing or invalid.
 */
export const env = envSchema.parse(process.env);
```

- [ ] **Step 4: Run the test — should pass now**

```bash
npm test -- src/lib/env.test.ts
```

Expected: PASS (both tests pass)

- [ ] **Step 5: Commit**

```bash
git add src/lib/env.ts src/lib/env.test.ts
git commit -m "feat: add environment variable validation with Zod"
```

---

### Task 8: Constants, shared types, and utility functions

**Files:**

- Create: `src/lib/constants.ts`
- Create: `src/types/actions.ts`
- Create: `src/types/pagination.ts`
- Modify: `src/lib/utils.ts` (add generateSlug + formatDate)
- Create: `src/lib/utils.test.ts`

- [ ] **Step 1: Create src/lib/constants.ts**

```ts
// Slugs that cannot be used by run clubs — reserved for platform routes
export const RESERVED_SLUGS = [
  "explore",
  "login",
  "signup",
  "dashboard",
  "my-clubs",
  "api",
  "admin",
  "settings",
  "profile",
  "about",
  "pricing",
  "blog",
  "help",
  "support",
  "terms",
  "privacy",
  "create",
] as const;

export const VIBE_OPTIONS = [
  { value: "competitive", label: "Competitive", emoji: "🏆" },
  { value: "social", label: "Social", emoji: "🤝" },
  { value: "casual", label: "Casual", emoji: "😎" },
] as const;

export const POST_RUN_OPTIONS = [
  { value: "pub", label: "Pub", emoji: "🍺" },
  { value: "coffee", label: "Café", emoji: "☕" },
  { value: "brunch", label: "Brunch", emoji: "🥐" },
  { value: "none", label: "We don't do afters", emoji: "🚫" },
] as const;

export const VENUE_EMOJI: Record<string, string> = {
  pub: "🍺",
  coffee: "☕",
  brunch: "🥐",
  none: "📍",
};

export const DISTANCE_UNITS = ["km", "mi"] as const;

export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const MEMBER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  WAITLISTED: "waitlisted",
} as const;

// Active members = anyone who can RSVP and be counted
export const ACTIVE_ROLES = ["owner", "admin", "member"] as const;

export const FREE_TIER_MEMBER_LIMIT = 30;
export const FREE_TIER_EVENTS_PER_MONTH = 4;
export const FREE_TIER_RECURRING_ALLOWED = false;
export const FREE_TIER_ADMINS_ALLOWED = 1;

export const PRO_PRICE_PER_MONTH = 19;

// Number of upcoming recurring events to maintain ahead
export const RECURRING_EVENTS_WINDOW = 4;

// Hours after event start that status auto-transitions to 'completed'
export const EVENT_COMPLETION_HOURS = 3;

// Streak milestone thresholds (weeks) for Pro dashboard insight cards
export const STREAK_MILESTONES = [4, 10, 20, 52] as const;
```

- [ ] **Step 2: Create src/types/actions.ts**

```ts
/**
 * Standard return shape for all Server Actions.
 * NEVER throw from a Server Action — always return ActionResult.
 *
 * Usage:
 *   const result = await someAction(data)
 *   if (result.success) { toast.success(...) }
 *   else { toast.error(result.error) }
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };
```

- [ ] **Step 3: Create src/types/pagination.ts**

```ts
/**
 * Cursor-based pagination types.
 * ALL paginated lists use this pattern — never offset-based pagination.
 */
export type PaginatedResult<T> = {
  items: T[];
  nextCursor: string | null; // null = no more pages
  hasMore: boolean;
};

export type PaginationParams = {
  cursor?: string; // omit for first page
  limit?: number; // default 20, max 50
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
```

- [ ] **Step 4: Write tests for utils.ts slug generation BEFORE implementing**

Create `src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug", () => {
  it("lowercases the input", () => {
    expect(generateSlug("London City Runners")).toBe("london-city-runners");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("bondi beach runners")).toBe("bondi-beach-runners");
  });

  it("strips non-alphanumeric characters except hyphens", () => {
    expect(generateSlug("Bondi Beach Runners!")).toBe("bondi-beach-runners");
  });

  it("collapses multiple hyphens into one", () => {
    expect(generateSlug("run--club")).toBe("run-club");
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateSlug("-cool runners-")).toBe("cool-runners");
  });

  it("handles special characters in names", () => {
    expect(generateSlug("O'Brien's Run Club")).toBe("obriens-run-club");
  });

  it("handles numbers", () => {
    expect(generateSlug("Run Club 5K")).toBe("run-club-5k");
  });
});
```

- [ ] **Step 5: Run the test — should fail (generateSlug not exported yet)**

```bash
npm test -- src/lib/utils.test.ts
```

Expected: FAIL — "generateSlug is not a function" or similar

- [ ] **Step 6: Add generateSlug and formatDate to src/lib/utils.ts**

> **Note:** shadcn created `src/lib/utils.ts` with `cn()`. Append these functions to it — do NOT replace `cn()`.

Open `src/lib/utils.ts` and append at the bottom:

```ts
/**
 * Generate a URL-safe slug from a club name.
 * "Bondi Beach Runners!" → "bondi-beach-runners"
 * Rules: lowercase, hyphens for spaces/punctuation, no consecutive hyphens,
 * no leading/trailing hyphens. Locked after club creation.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // strip non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/-{2,}/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // strip leading/trailing hyphens
}

/**
 * Format a date in a community's timezone.
 * Always displays the club's local time regardless of viewer's location.
 */
export function formatEventDate(
  date: Date,
  timezone: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);
}

/**
 * Format a relative date for display (e.g., "This Wednesday", "Next Monday")
 */
export function formatRelativeDate(date: Date, timezone: string): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      weekday: "long",
    }).format(date);
  }
  return formatEventDate(date, timezone, {
    weekday: undefined,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
```

- [ ] **Step 7: Run the tests — should pass**

```bash
npm test -- src/lib/utils.test.ts
```

Expected: PASS (7/7 tests)

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 9: Commit**

```bash
git add src/lib/constants.ts src/types/actions.ts src/types/pagination.ts src/lib/utils.ts src/lib/utils.test.ts
git commit -m "feat: add constants, shared types, and utility functions"
```

---

### Task 9: Vitest configuration

**Files:**

- Create: `vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "src/e2e/**"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Create src/test/setup.ts**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 3: Run all tests to confirm the suite works end to end**

```bash
npm test
```

Expected: all tests pass (the slug tests + env tests from earlier tasks)

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts src/test/setup.ts
git commit -m "chore: add Vitest configuration"
```

---

### Task 10: Folder structure placeholders and .env.local.example

**Files:**

- Create: `app/(public)/` (route group — public SSR pages)
- Create: `app/(auth)/` (route group — auth-gated pages)
- Create: `app/dashboard/[slug]/` (organizer dashboard)
- Create: `app/admin/` (admin tools)
- Create: `app/api/webhooks/`, `app/api/cron/`, `app/api/og/` (API routes)
- Create: `.env.local.example`

> **Note:** `src/components/`, `src/lib/`, and `src/types/` subdirectories were already created in Task 2. This task only adds the `app/` route-group scaffolding.

- [ ] **Step 1: Create app/ route group scaffolding with .gitkeep files**

```bash
# Route groups (parens = no URL segment)
mkdir -p "app/(public)"
mkdir -p "app/(auth)"
mkdir -p "app/dashboard/[slug]"
mkdir -p "app/admin"
mkdir -p "app/api/webhooks"
mkdir -p "app/api/cron"
mkdir -p "app/api/og"

# Add .gitkeep so git tracks empty directories
touch "app/(public)/.gitkeep"
touch "app/(auth)/.gitkeep"
touch "app/dashboard/[slug]/.gitkeep"
touch "app/admin/.gitkeep"
touch "app/api/webhooks/.gitkeep"
touch "app/api/cron/.gitkeep"
touch "app/api/og/.gitkeep"

# Also .gitkeep the src/ leaf dirs created in Task 2
touch src/lib/db/queries/.gitkeep
touch src/lib/actions/.gitkeep
touch src/lib/email/templates/.gitkeep
touch src/lib/stripe/.gitkeep
touch src/lib/posthog/.gitkeep
touch src/lib/validations/.gitkeep
touch src/e2e/.gitkeep
```

- [ ] **Step 2: Create .env.local.example**

```bash
cat > .env.local.example << 'EOF'
# ─── Public (safe to expose to browser — use NEXT_PUBLIC_ prefix) ───

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ─── Server-only (NEVER use NEXT_PUBLIC_ prefix — NEVER import in Client Components) ───

# Database (Supabase connection string — use connection pooler for serverless)
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true

# Supabase service role key — bypasses RLS — crons and webhooks ONLY
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (email)
RESEND_API_KEY=re_...

# Cron protection — min 32 characters, random string
# Generate with: openssl rand -hex 32
CRON_SECRET=your-min-32-char-random-secret

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
EOF
```

- [ ] **Step 3: Verify .env.local is in .gitignore**

```bash
grep ".env.local" .gitignore
```

Expected: `.env.local` appears in the output. If it doesn't, add it:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 4: Final TypeScript check across the whole project**

```bash
npx tsc --noEmit 2>&1
```

Expected: no output (clean compile).

- [ ] **Step 5: Final test run**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: add folder structure, .gitkeep placeholders, and .env.local.example"
```

---

## Self-Review

### Spec Coverage Check

| Requirement                                            | Covered in                    |
| ------------------------------------------------------ | ----------------------------- |
| 7 tables with all fields + enums                       | Task 5                        |
| users, communities, memberships                        | Task 5                        |
| events, event_rsvps                                    | Task 5                        |
| community_stats, member_attendance_stats               | Task 5                        |
| All DB indexes from CLAUDE.md                          | Task 5 (in table definitions) |
| Tailwind v4 brand colors (coral, amber, purple, cream) | Task 3                        |
| Google Fonts (Bricolage Grotesque + DM Sans)           | Task 3                        |
| Sunrise gradient utility                               | Task 3                        |
| shadcn/ui + cn() utility                               | Task 4                        |
| Supabase browser + server clients                      | Task 6                        |
| getAuthUser() helper                                   | Task 6                        |
| Env validation with Zod                                | Task 7                        |
| ActionResult<T> type                                   | Task 8                        |
| PaginatedResult<T> + PaginationParams                  | Task 8                        |
| RESERVED_SLUGS constant                                | Task 8                        |
| generateSlug() + tests                                 | Task 8                        |
| formatEventDate() (club timezone display)              | Task 8                        |
| Vitest configuration                                   | Task 9                        |
| src/ folder structure per CLAUDE.md                    | Tasks 2 + 10                  |
| .env.local.example with all secrets                    | Task 10                       |
| `last_waitlist_email_sent_at` on communities           | Task 5                        |
| `reminder_sent` on events                              | Task 5                        |
| `is_active` on communities                             | Task 5                        |
| db:push, db:generate, db:studio scripts                | Task 1                        |

### Missing trgm Index

The CLAUDE.md spec mentions a GIN trigram index for search:

```sql
CREATE INDEX idx_communities_name_trgm ON communities USING gin (name gin_trgm_ops);
```

This requires the `pg_trgm` extension to be enabled in Supabase (SQL editor: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`). It's left out of the schema — add it when building the search feature in Task 3 of Week 3.
