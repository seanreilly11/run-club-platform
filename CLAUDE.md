@AGENTS.md

# RunClub Platform

## What This Is

A web-based SaaS platform for run club organizers to manage their clubs, events, members, and attendance — replacing the WhatsApp + Strava + Google Forms + Instagram stack. The unique differentiator is "afters" — treating the post-run venue (pub, café, brunch spot) as a first-class feature throughout the product.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth (magic link + email/password)
- **Payments**: Stripe (Checkout + Customer Portal)
- **Email**: Resend with React Email templates
- **Maps**: Leaflet (free) for meeting point pins and explore map
- **Storage**: Supabase Storage for images
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + `@hookform/resolvers` (Zod resolver). Shared Zod schemas validate both client-side (RHF) and server-side (Server Actions).
- **Charts**: Recharts (for Pro analytics dashboard)
- **Platform Analytics**: PostHog (free tier — 1M events/month, session replay, funnels, feature flags)
- **Testing**: Vitest (unit + integration) + React Testing Library (components) + Playwright (E2E)
- **Hosting**: Vercel

## Brand & Theme — Coral Soft (Sunrise)

Personality: Fun, playful, warm, community-first. Sporty but approachable.

**Colors (use as CSS variables / Tailwind config)**:

- Primary: #F43F5E (coral) — buttons, links, active states
- Secondary: #8B5CF6 (purple) — secondary badges, accents
- Accent: #F59E0B (amber) — venue/afters badges, warnings
- Success: #16A34A — confirmations, check marks
- Background: #FFFBF7 (warm cream) — page background
- Surface: #FFFFFF — cards, modals
- Surface alt: #FFF5F0 — subtle card backgrounds
- Border: #FECDD3 — featured card borders
- Border muted: #F5F0EB — standard card borders
- Text: #1C1917 — headings, body
- Text muted: #78716C — secondary text
- Text light: #A8A29E — labels, hints
- Venue badge: #FEF3C7 bg, #B45309 text — ALWAYS amber, never coral

**Hero gradient** (sunrise, bottom-to-top): `linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)`

**Typography** (Google Fonts):

- Headings: `Bricolage Grotesque` — weights 600-800, letter-spacing -0.02em
- Body: `DM Sans` — weights 400-700

**UI rules**:

- Border radius: 14px for cards, 12px for buttons, 10px for inputs, 7px for small badges
- Venue/afters badges ALWAYS use amber palette with contextual emoji: 🍺 pubs, ☕ cafés, 🥐 brunch, 📍 other
- Language: use "afters" not "post-run". "Afters at [venue name]" is the standard phrasing
- Flame icon (Lucide `Flame`) for all streak displays
- Card shadows: `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)` — very subtle
- Primary button shadow: `0 2px 12px rgba(244,63,94,0.3)` — soft glow
- RSVP has two options only: "I'm in!" (going) and "Maybe". No "can't make it" option.
- The RSVP flow is two-step: 1) "I'm in!" → 2) "Staying for afters?" prompt slides in below
- Sunrise accent bar (3px, hero gradient) on next event / featured cards

## Architecture Decisions

- The main entity table is called `communities` (NOT `clubs`) with a `type` enum field. This supports future expansion to other verticals (tipster groups, cycling clubs) on the same codebase.
- Multi-brand architecture planned: separate domains serve different verticals from one deployment. Middleware detects hostname and sets brand context. For now, build only the run club vertical.
- Public pages (club pages, explore, events) are Server Components with SSR for SEO. Dashboard pages use Client Components for interactivity.
- Analytics cache tables (`community_stats`, `member_attendance_stats`) are recomputed after each event completion — never query aggregates on the fly.

## Code Conventions & Best Practices

### SOLID Principles

- **Single Responsibility**: Each component does ONE thing. A `ClubCard` renders a club card — it doesn't fetch data, manage auth, or handle routing. If a component file exceeds ~100 lines, split it.
- **Open/Closed**: Components accept props for customization rather than being modified directly. Use composition (children, render props, slots) over conditional logic branches inside a component.
- **Liskov Substitution**: Shared interfaces/types for similar components. A `VenueBadge` should work anywhere a badge is expected — club page, event page, explore card.
- **Interface Segregation**: Props interfaces should be minimal. Don't pass an entire `Event` object when a component only needs `title` and `date`. Define specific prop types.
- **Dependency Inversion**: Components depend on abstractions (query functions, types) not concrete implementations. Data fetching lives in `src/lib/db/queries/`, not inside components.

### DRY Principles

- Extract repeated UI into shared components in `src/components/`. If you build the same card layout twice, make it a component.
- Shared query logic goes in `src/lib/db/queries/` as reusable functions — never duplicate a database query across pages.
- Constants (venue types, vibe options, status enums) go in `src/lib/constants.ts` — never hardcode string arrays in multiple files.
- Shared TypeScript types/interfaces go in `src/types/` — derive from Drizzle schema types where possible using `typeof schema.communities.$inferSelect`.
- Utility functions (date formatting, slug generation, etc.) go in `src/lib/utils.ts`.

### Next.js 16 Best Practices

- **Server Components by default**: Every component is a Server Component unless it absolutely needs interactivity (onClick, useState, useEffect, browser APIs). This is critical for performance.
- **Push client boundaries down**: Don't make an entire page a Client Component because one button needs onClick. Instead, make the page a Server Component and only wrap the interactive button in a small Client Component. Example: the club page is a Server Component, but the RSVP button is a separate `"use client"` component that receives only the data it needs via props.
- **Data fetching in Server Components**: Fetch data directly in Server Components using async/await — no useEffect, no loading states needed. Use the query functions from `src/lib/db/queries/`.
- **Parallel data fetching**: When a page needs multiple queries, use `Promise.all()` to run them in parallel, not sequentially.
- **Server Actions for mutations**: Use Next.js Server Actions (`"use server"`) for form submissions and data mutations (RSVP, create event, join club). Define them in `src/lib/actions/`. Don't build API routes for simple CRUD operations.
- **Streaming with Suspense**: Wrap slow-loading sections in `<Suspense fallback={...}>` to stream the page progressively. The club page hero and basic info should render immediately; the event list can stream in after.
- **Route Groups**: Use `(public)` and `(auth)` route groups to share layouts without affecting URL structure. Dashboard pages share a sidebar layout via `dashboard/layout.tsx`.
- **generateMetadata**: Every public page must export a `generateMetadata` function for SEO — title, description, Open Graph image. Never hardcode metadata.
- **Dynamic params with generateStaticParams**: For high-traffic club pages, use `generateStaticParams` to pre-render the most popular clubs at build time.
- **Revalidation**: Use `revalidatePath()` or `revalidateTag()` in Server Actions after mutations so pages update without full rebuilds. Example: after a new RSVP, revalidate the event page.

### Component Architecture

- **Page files (`page.tsx`)** are Server Components. They fetch data and compose layout. Keep them thin — delegate to sub-components.
- **Layout files (`layout.tsx`)** handle shared chrome (nav, sidebar). Fetch auth state here so child pages don't repeat it.
- **Client Components** are small, focused interactive pieces. Prefix the file with `"use client"` at the top. They receive data via props from Server Component parents — they do NOT fetch their own data.
- **Composition over props drilling**: If data needs to pass through 3+ levels, either restructure the component tree or use Server Component data fetching at the level that needs it.

### TypeScript

- Strict mode, no `any` types
- Use named exports, not default exports
- Derive database types from Drizzle schema: `type Community = typeof communities.$inferSelect`
- Props interfaces defined above each component, not inline
- Use `@/` import alias for all project imports

### Styling

- Tailwind utility classes only, no custom CSS files
- shadcn/ui components for all UI primitives (buttons, inputs, dialogs, select, etc.)
- Use `cn()` utility from shadcn for conditional class merging
- Component variants via props + Tailwind, not CSS modules

## Backend Patterns

### Response Shape — Server Actions

All Server Actions return a consistent `ActionResult` type. NEVER throw errors from Server Actions — always return them.

```typescript
// src/types/actions.ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };
```

Usage in Server Actions:

```typescript
export async function createEvent(
  formData: FormData,
): Promise<ActionResult<Event>> {
  // validation...
  if (!title)
    return { success: false, error: "Title is required", field: "title" };
  // db insert...
  return { success: true, data: event };
}
```

Usage in Client Components:

```typescript
const result = await createEvent(formData);
if (result.success) {
  toast.success("Event created!");
} else {
  toast.error(result.error);
}
```

### Response Shape — Query Functions

Query functions in `src/lib/db/queries/` are called from Server Components. They return data directly (not wrapped in an envelope) since errors in Server Components are caught by error boundaries. Use return types derived from Drizzle schema.

```typescript
// src/lib/db/queries/events.ts
export async function getUpcomingEvents(communityId: string): Promise<Event[]> { ... }
export async function getEventById(eventId: string): Promise<Event | null> { ... }
```

### Pagination — Cursor-Based

All paginated lists use cursor-based pagination. The cursor is the `id` or a natural sort field (e.g., `date` for events, `joined_at` for members). NEVER use offset-based pagination.

```typescript
// src/types/pagination.ts
type PaginatedResult<T> = {
  items: T[];
  nextCursor: string | null; // null = no more items
  hasMore: boolean;
};

type PaginationParams = {
  cursor?: string; // omit for first page
  limit?: number; // default 20, max 50
  sortBy?: string; // field name
  sortOrder?: "asc" | "desc";
};
```

Query function pattern:

```typescript
export async function getClubMembers(
  communityId: string,
  params: PaginationParams,
): Promise<PaginatedResult<Member>> {
  const limit = Math.min(params.limit ?? 20, 50);
  const query = db
    .select()
    .from(memberships)
    .where(eq(memberships.communityId, communityId))
    .orderBy(
      params.sortOrder === "desc"
        ? desc(memberships.joinedAt)
        : asc(memberships.joinedAt),
    )
    .limit(limit + 1); // fetch one extra to determine hasMore

  if (params.cursor) {
    query.where(gt(memberships.joinedAt, params.cursor));
  }

  const results = await query;
  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, limit) : results;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].joinedAt : null,
    hasMore,
  };
}
```

Client-side "Load more" pattern:

```typescript
const [cursor, setCursor] = useState<string | null>(null);
const loadMore = async () => {
  const result = await fetchMembers({ cursor, limit: 20 });
  setMembers((prev) => [...prev, ...result.items]);
  setCursor(result.nextCursor);
};
```

### Where pagination is needed

- `/explore` — club list (cursor: `id`, sorted by `member_count` desc or `created_at`)
- `/[slug]` — upcoming events list (cursor: `date`, sorted asc)
- `/[slug]` — active members list (cursor: `joined_at`, sorted desc)
- `/dashboard/[slug]/events` — all events (cursor: `date`, sorted desc)
- `/dashboard/[slug]/members` — member list (cursor: `joined_at`, sortable by multiple fields)
- `/my-clubs` — upcoming events this week (unlikely to need pagination — max ~20 events, but implement the pattern for consistency)

### Where pagination is NOT needed (fetch all)

- Pace groups on an event (max 5–6 groups)
- RSVP list on an event (max ~100, fetch all for the attendee count display; paginate the full list if needed)
- Sidebar nav items
- Club stats (single row from cache table)

### Error Handling

- Server Actions: return `{ success: false, error }` — never throw
- Query functions: throw errors — caught by Next.js error boundaries (`error.tsx`)
- Validation: use Zod schemas. Validate in Server Actions before any DB operation. Return field-level errors.
- Auth errors: middleware handles — redirect to `/login`. Never show a broken page.
- Not found: query functions return `null` → page renders `notFound()` from Next.js

### Caching & Revalidation

- Public pages (club page, event page, explore): use Next.js `unstable_cache` or fetch cache with `revalidate` tag. Revalidate when data changes.
- After mutations: call `revalidatePath('/[slug]')` or `revalidateTag('club-[slug]')` in the Server Action to bust the cache.
- Cache tables (`community_stats`, `member_attendance_stats`): read from these in Server Components. Never compute aggregates on the fly.
- Dashboard pages: no caching — always fresh data. These are behind auth and low-traffic.

### Forms — React Hook Form

All forms use React Hook Form with the Zod resolver. The same Zod schema from `src/lib/validations/` is used for both client-side validation (RHF) and server-side validation (Server Action).

```typescript
// src/components/create-event-form.tsx
"use client"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createEventSchema } from "@/lib/validations/event"
import { createEvent } from "@/lib/actions/event"
import type { z } from "zod"

type FormData = z.infer<typeof createEventSchema>

export function CreateEventForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { distanceUnit: "km", isRecurring: false },
  })

  const paceGroups = useFieldArray({ control: form.control, name: "paceGroups" })

  const onSubmit = async (data: FormData) => {
    const result = await createEvent(data)
    if (result.success) { toast.success("Event created!") }
    else { toast.error(result.error) }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Use form.register(), form.watch(), form.formState.errors */}
    </form>
  )
}
```

**Key patterns:**

- `useForm` with `zodResolver` — single source of truth for validation
- `useFieldArray` for dynamic pace groups (add/remove)
- `form.watch("fieldName")` for live preview (create event form shows a preview card that updates as you type)
- `form.formState.errors.fieldName?.message` for inline error messages
- `form.handleSubmit` prevents submission if client-side validation fails — the Server Action only fires with valid data
- Server Action still validates with the same Zod schema (defence in depth — never trust the client)

**Multi-step forms (onboarding wizard):**
Use a single `useForm` instance across all steps. Each step only shows/validates its own fields. Use `form.trigger(["fieldA", "fieldB"])` to validate the current step before advancing to the next.

```typescript
const form = useForm<OnboardingData>({
  resolver: zodResolver(onboardingSchema),
});

const nextStep = async () => {
  const fieldsForStep = stepFields[currentStep];
  const valid = await form.trigger(fieldsForStep);
  if (valid) setCurrentStep((prev) => prev + 1);
};
```

**Where RHF is used:**

- Create event form (15+ fields, dynamic pace groups, conditional sections)
- Club onboarding wizard (multi-step, shared state across steps)
- Edit event / edit club settings (pre-filled forms)
- Profile edit
- Feedback form
- Login/register forms

**Where RHF is NOT needed:**

- One-click actions (RSVP button, afters toggle, pace group tap) — these are single Server Action calls, not forms
- Search inputs (explore page) — simple controlled input with `useState`

### Optimistic Updates

- All instant-action flows (RSVP, pace group change, afters toggle) use optimistic updates in Client Components.
- Pattern: update local state immediately → fire Server Action async → if action fails, revert local state and show error toast.
- Use React's `useOptimistic` hook or manual state management.
- The Server Action still calls `revalidatePath` on success so any Server Component showing the same data also refreshes.

### Map Clustering

- Use Leaflet with `react-leaflet` + `react-leaflet-cluster` (wrapper around Leaflet.markercluster) for the explore page map.
- All club coordinates are fetched server-side and passed to the map Client Component as props.
- For the explore page: fetch all clubs with `{ id, name, slug, location_lat, location_lng, member_count, vibe }` — lightweight payload, no full club objects.
- Cluster markers at zoom levels where pins overlap. Cluster shows count badge. Clicking a cluster zooms in. Clicking an individual pin shows a popup with club name, vibe badge, member count, and "View →" link.
- At Sydney-only scale (<500 clubs), performance is not a concern. If expanding globally (10k+ clubs), add server-side bounding box queries: only fetch clubs within the visible map viewport.
- Meeting point maps on event pages: single pin, no clustering needed.

### Rate Limiting Response

When a Server Action hits a rate limit (via @upstash/ratelimit):

```typescript
return {
  success: false,
  error: "Too many requests. Please try again in a moment.",
};
```

Never expose internal rate limit details (remaining count, reset time) to the client.

### Input Validation — Zod Schemas

Every Server Action validates input with a Zod schema BEFORE any database operation. Schemas live in `src/lib/validations/`.

```typescript
// src/lib/validations/event.ts
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  date: z.string().datetime("Invalid date"),
  meetingPointName: z.string().min(1, "Meeting point is required"),
  distanceKm: z.number().positive().optional(),
  distanceUnit: z.enum(["km", "mi"]).default("km"),
  routeUrl: z.string().url().optional().or(z.literal("")),
  paceGroups: z
    .array(z.object({ name: z.string().min(1), pace: z.string() }))
    .optional(),
  postRunVenueName: z.string().optional(),
  postRunVenueUrl: z.string().url().optional().or(z.literal("")),
  postRunVenueNotes: z.string().max(200).optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
  description: z.string().max(2000).optional(),
});
```

Server Action pattern:

```typescript
export async function createEvent(
  input: unknown,
): Promise<ActionResult<Event>> {
  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return {
      success: false,
      error: firstError.message,
      field: firstError.path[0] as string,
    };
  }
  const event = await db.insert(events).values(parsed.data).returning();
  return { success: true, data: event };
}
```

**Schemas to create:** `createEventSchema`, `updateEventSchema`, `createCommunitySchema`, `updateCommunitySchema`, `rsvpSchema`, `postEventCaptureSchema`, `updateProfileSchema`, `feedbackSchema`, `inviteAdminSchema`.

**Sanitisation rules:**

- Strip HTML from all user text inputs before storing
- Trim whitespace on all string fields
- URLs: must start with `https://`. Never store `javascript:` or `data:` URLs

**Slug rules:**

- Auto-generated from club name during onboarding: lowercase, replace spaces with hyphens, strip non-alphanumeric characters except hyphens, collapse multiple hyphens, trim leading/trailing hyphens. "Bondi Beach Runners!" → `bondi-beach-runners`.
- Editable during creation (step 2 of onboarding) — show a live preview: "yourdomain.com/[slug]". Validate on each keystroke.
- Validation: 3–60 characters, lowercase alphanumeric + hyphens only, must start and end with alphanumeric, no consecutive hyphens, must be unique (check against DB on blur).
- **Locked after creation.** Cannot be changed from the dashboard. If an organizer needs to change it, they contact you — manual DB update + set up a redirect. This avoids breaking shared links, Google index, and email links.
- Reserved slugs that cannot be used: `explore`, `login`, `signup`, `dashboard`, `my-clubs`, `api`, `admin`, `settings`, `profile`, `about`, `pricing`, `blog`, `help`, `support`, `terms`, `privacy`. Store this list in `src/lib/constants.ts`.

### Deletion Policies

**Club deletion: NOT allowed.** Organizers can **deactivate** their club but not permanently delete it. Deactivation preserves all member data, attendance history, and streaks.

- Deactivate sets `communities.is_active = false` (add this boolean field to the schema, default `true`).
- Deactivated clubs: hidden from explore page, public page shows "This club is no longer active", members can still view their history in My Clubs (greyed out), no new events can be created, existing events are cancelled.
- Organizer can reactivate at any time from dashboard settings.
- If the organizer has an active Stripe subscription, they must cancel it before deactivating.

**User account deletion: allowed, with anonymisation.** Hard delete the user record but anonymise their footprint so club analytics remain intact.

- Replace `users.name` with "Deleted User", clear `email`, `avatar_url`, `pace_preference`. Then delete the `users` row.
- OR: keep the row with anonymised data (`name = 'Deleted User'`, `email = '[uuid]@deleted.local'`, all other fields null). This avoids orphaned foreign keys.
- `event_rsvps` records stay — they reference the anonymised user. Club attendance counts, show rates, and analytics remain accurate.
- `memberships` records are hard deleted — the user is removed from all clubs.
- `member_attendance_stats` records are hard deleted — per-member stats are no longer meaningful.
- If the user owns any clubs, they MUST transfer ownership to another admin or deactivate the club before deleting their account. The UI should enforce this — block account deletion until all owned clubs are handled.
- Supabase Auth: delete the auth user record so the email can't be used to log in.
- Supabase Storage: delete their avatar file.

**Other deletions (hard delete, no change from current spec):**

- **Cancel event**: set `status = 'cancelled'`. Not a delete. Record stays for analytics.
- **Withdraw RSVP**: hard delete `event_rsvps` row. Undo re-inserts.
- **Leave club / Remove member**: hard delete `memberships` row.

### Database Transactions

Use `db.transaction()` when multiple writes must succeed or fail together.

**Use transactions for:**

- RSVP with auto-join (insert membership + insert RSVP + increment member_count)
- Club creation (insert community + insert owner membership)
- Upgrade to Pro (update tier + convert all waitlisted → active)
- Delete club (delete community + cascade everything)
- Post-event completion (update status + recompute stats)

```typescript
await db.transaction(async (tx) => {
  await tx.insert(memberships).values({ userId, communityId, role: "member" });
  await tx
    .update(communities)
    .set({ memberCount: sql`member_count + 1` })
    .where(eq(communities.id, communityId));
  await tx
    .insert(eventRsvps)
    .values({ eventId, userId, status: "going", paceGroup });
});
```

**Do NOT use transactions for:** single writes, read queries, sending emails (emails go AFTER the transaction commits, not inside it).

### File Upload Handling

Supabase Storage for cover photos and avatars. Direct client-to-Supabase upload.

1. Client validates: max 2MB, JPG/PNG/WebP only.
2. Upload: `supabase.storage.from('images').upload('covers/[communityId]/[timestamp].jpg', file)`
3. Server Action updates the DB record with the public URL. Validates user has permission.

**Buckets:** `covers` (club cover photos, public), `avatars` (user photos, public).
**RLS:** anyone can read. Only club owner/admin can upload to their club's cover folder. Only the user can upload to their own avatar folder.
**No server-side image processing for MVP.** Add Supabase Image Transformations later if needed.

### Search Implementation

PostgreSQL `ilike` for MVP. No external search service.

```typescript
export async function searchClubs(query: string, params: PaginationParams) {
  return db
    .select()
    .from(communities)
    .where(
      or(
        ilike(communities.name, `%${query}%`),
        ilike(communities.city, `%${query}%`),
        ilike(communities.description, `%${query}%`),
      ),
    )
    .orderBy(desc(communities.memberCount))
    .limit(params.limit ?? 20);
}
```

**Search needed:** explore page (clubs by name/keyword), dashboard members (by name).
**Search NOT needed:** events within a club (small list), pace groups.

At <500 clubs, `ilike` is fast. Add `pg_trgm` GIN index when search feels slow.

### Database Indexes

```sql
CREATE INDEX idx_communities_name_trgm ON communities USING gin (name gin_trgm_ops);
CREATE INDEX idx_communities_city ON communities (city);
CREATE INDEX idx_communities_type ON communities (type);
CREATE INDEX idx_communities_vibe ON communities (vibe);
CREATE INDEX idx_events_community_status ON events (community_id, status);
CREATE INDEX idx_events_date ON events (date);
CREATE INDEX idx_event_rsvps_event_user ON event_rsvps (event_id, user_id);
CREATE INDEX idx_memberships_user ON memberships (user_id);
CREATE INDEX idx_memberships_community ON memberships (community_id);
CREATE INDEX idx_memberships_community_role ON memberships (community_id, role);
```

Define these in the Drizzle schema file. The compound indexes on `(community_id, status)` and `(community_id, role)` are critical for the most common queries.

## Key Directories

- `src/app/(public)/` — Public-facing pages (Server Components, SSR, SEO-critical)
- `src/app/dashboard/[slug]/` — Organizer dashboard (behind auth, scoped per club via slug)
- `src/app/admin/` — Admin-only pages (ownership transfer, etc.). Protected by hardcoded admin user ID check — NOT a role in the DB. Only the founder accesses this.
- `src/lib/db/schema.ts` — Complete Drizzle schema (source of truth for data model)
- `src/lib/db/queries/` — Reusable database query functions (all data access goes here)
- `src/lib/actions/` — Server Actions for mutations (RSVP, create event, join club, etc.)
- `src/lib/email/send.ts` — Single email transport function. ALL email sends go through this one file. Uses Resend SDK initially, designed to be swapped to AWS SES later without changing any templates or calling code. See docs/SPEC.md Email Strategy section.
- `src/lib/email/templates/` — React Email templates (rendered to HTML, transport-agnostic)
- `src/lib/supabase/` — Supabase client helpers (client.ts, server.ts)
- `src/lib/constants.ts` — Shared constants (venue types, vibe options, status enums)
- `src/lib/utils.ts` — Utility functions (date formatting, slug generation, cn() helper)
- `src/lib/posthog/` — PostHog client setup (provider.tsx for Client Component wrapper, server.ts for server-side tracking). Track events via `posthog.capture('event_name', { properties })`.
- `src/components/` — Shared UI components (small, focused, reusable)
- `src/components/analytics/` — Recharts-based analytics components (Pro feature, Client Components)
- `src/components/posthog-provider.tsx` — Client Component wrapping `<PostHogProvider>` in the root layout
- `src/types/` — Shared TypeScript types/interfaces (derived from Drizzle schema where possible)
- `src/types/actions.ts` — `ActionResult<T>` type used by all Server Actions
- `src/types/pagination.ts` — `PaginatedResult<T>` and `PaginationParams` types
- `src/lib/validations/` — Zod schemas for form validation (event creation, club creation, profile edit, etc.)
- `src/test/` — Test utilities, mocks, fixtures (shared across all test files)
- `src/e2e/` — Playwright end-to-end test specs

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run db:push` — Push schema changes to Supabase
- `npm run db:generate` — Generate Drizzle migrations
- `npm run db:studio` — Open Drizzle Studio (DB browser)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run test` — Run Vitest unit + integration tests
- `npm run test:watch` — Run Vitest in watch mode
- `npm run test:coverage` — Run tests with coverage report
- `npm run test:e2e` — Run Playwright end-to-end tests
- `npm run test:e2e:ui` — Run Playwright with interactive UI

## Testing — Priority from Day One

Testing is not optional. Every Server Action, query function, and interactive component should have tests BEFORE the feature is considered complete. Write tests as you build, not after.

### Stack

- **Unit + Integration**: Vitest + React Testing Library (`@testing-library/react`)
- **E2E**: Playwright
- **Setup**: `vitest.config.ts` at project root, `playwright.config.ts` at project root

### Packages

```
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom playwright @playwright/test
```

### File Structure

Tests live next to the code they test, using `.test.ts` / `.test.tsx` suffix:

```
src/
  lib/
    db/queries/
      events.ts
      events.test.ts        ← unit test for query functions
    actions/
      rsvp.ts
      rsvp.test.ts           ← integration test for Server Actions
    validations/
      event.ts
      event.test.ts          ← unit test for Zod schemas
  components/
    rsvp-button.tsx
    rsvp-button.test.tsx     ← component test with RTL
  e2e/
    rsvp-flow.spec.ts        ← Playwright E2E test
    auth-flow.spec.ts
    create-event.spec.ts
```

### What to Test — Priority Tiers

**Tier 1: MUST test (data-changing, business logic)**
These are non-negotiable. If they break, users lose data or the app is fundamentally broken.

| What                             | Test type   | What to assert                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server Actions (all mutations)   | Integration | Auth check rejects unauthenticated. Auth check rejects unauthorised. Validation rejects bad input with correct field error. Success case creates/updates correct DB record. Side effects fire (revalidatePath, emails, PostHog). Rate limiting works.                                                          |
| RSVP Server Action               | Integration | Creates RSVP with status + pace group. Auto-joins club if not a member. Respects member cap (waitlist). Doesn't create duplicate RSVPs. Withdraw deletes the record.                                                                                                                                           |
| Query functions (filtered lists) | Unit        | Returns correct items for given filters. Pagination returns correct cursor + hasMore. Empty results return empty array, not null. Excludes waitlisted members. Excludes deactivated clubs. Excludes cancelled events from public queries.                                                                      |
| Zod validation schemas           | Unit        | Accepts valid input. Rejects missing required fields with correct error message. Rejects invalid types (string where number expected). Rejects out-of-range values. Handles optional fields correctly.                                                                                                         |
| Stripe webhook handler           | Integration | Rejects invalid signatures. Processes checkout.session.completed (updates tier, converts waitlist). Processes subscription.deleted (reverts tier). Handles idempotent reprocessing.                                                                                                                            |
| Cron job handlers                | Integration | Weekly digest: correct members queried, correct date window (Tue→Mon), skips members with no events. 24h reminder: only RSVP'd members, marks as reminded, no duplicate sends. Event completion: sets status, triggers stat recomputation. Recurring generation: creates correct number of events, idempotent. |

**Tier 2: SHOULD test (interactive UI, important components)**

| What                         | Test type | What to assert                                                                                                                                                                         |
| ---------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RSVP button component        | RTL       | Renders "I'm in!" for non-RSVP'd state. Calls Server Action on click. Shows optimistic "Going ✓" immediately. Shows undo toast. Reverts on action failure.                             |
| Pace group selector          | RTL       | Pre-selects from user profile default. Tap changes selection. Shows check on selected. Runner count updates.                                                                           |
| Afters toggle                | RTL       | Default off. Toggle switches state. Shows venue emoji when on.                                                                                                                         |
| Create event form            | RTL       | All required fields validate on submit. Pace groups can be added/removed. Afters section toggles. Recurring toggle reveals day selector. Submit calls Server Action with correct data. |
| Club page                    | RTL       | Renders club name, vibe, member count. Shows next event section. RSVP button present. Join button present. Empty state when no events.                                                 |
| My Clubs "I'm in!" one-click | RTL       | Fires RSVP action on click. Shows Going ✓ after. Works across multiple events.                                                                                                         |
| Auth flow                    | RTL       | Email input shown first. Existing user: password field appears. New user: name + password fields appear.                                                                               |

**Tier 3: NICE to have (E2E flows)**

| Flow                         | Tool       | What to assert                                                                                                       |
| ---------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Full RSVP flow               | Playwright | Visit club page → click "I'm in!" → see confirmation → answer afters → see final state. Verify DB has the RSVP.      |
| Auth → RSVP redirect         | Playwright | Visit event page logged out → click "I'm in!" → redirected to login → complete auth → redirected back → auto-RSVP'd. |
| Create event                 | Playwright | Login as organizer → navigate to dashboard → create event with all fields → verify event appears on club page.       |
| Organizer post-event capture | Playwright | Login → dashboard → submit attendance numbers → verify stats update.                                                 |
| Stripe upgrade               | Playwright | Login → dashboard → click upgrade → complete Stripe checkout (test mode) → verify tier changes to Pro.               |

### Testing Patterns

**Mocking Supabase**: Create a test utility that provides a mock Supabase client. For query function tests, mock the DB responses. For Server Action tests, use a test database (Supabase local via Docker) or mock at the Drizzle query level.

```typescript
// src/test/mocks.ts
export const mockUser = { id: 'user-1', email: 'test@test.com', name: 'Test User' }
export const mockCommunity = { id: 'comm-1', slug: 'test-club', name: 'Test Club', ... }

export function mockGetAuthUser(user = mockUser) {
  vi.mock('@/lib/supabase/server', () => ({
    getAuthUser: vi.fn().mockResolvedValue(user),
  }))
}
```

**Testing Server Actions**: mock the auth layer, provide real Zod validation (don't mock it — that's the point of the test), mock or use a test DB for the actual query.

```typescript
// src/lib/actions/rsvp.test.ts
describe("createRsvp", () => {
  it("rejects unauthenticated users", async () => {
    mockGetAuthUser(null);
    const result = await createRsvp({ eventId: "e1", status: "going" });
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("rejects invalid input", async () => {
    mockGetAuthUser();
    const result = await createRsvp({ eventId: "", status: "invalid" });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("creates RSVP with correct data", async () => {
    mockGetAuthUser();
    mockMembership({ role: "member" });
    const result = await createRsvp({
      eventId: "e1",
      status: "going",
      paceGroup: "Steady",
    });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe("going");
    expect(result.data.paceGroup).toBe("Steady");
  });
});
```

**Testing components with RTL**: test user behaviour, not implementation details. Click buttons, fill inputs, check what's visible. Never test internal state or props directly.

```typescript
// src/components/rsvp-button.test.tsx
describe('RsvpButton', () => {
  it('shows I\'m in button when not RSVP\'d', () => {
    render(<RsvpButton eventId="e1" rsvpStatus={null} />)
    expect(screen.getByText("I'm in! 🏃")).toBeInTheDocument()
  })

  it('shows Going badge when RSVP\'d', () => {
    render(<RsvpButton eventId="e1" rsvpStatus="going" />)
    expect(screen.getByText("Going ✓")).toBeInTheDocument()
  })

  it('calls action on click', async () => {
    const user = userEvent.setup()
    render(<RsvpButton eventId="e1" rsvpStatus={null} />)
    await user.click(screen.getByText("I'm in! 🏃"))
    // assert optimistic UI update
    expect(screen.getByText("Going ✓")).toBeInTheDocument()
  })
})
```

**Playwright E2E**: use test fixtures with seeded data. Create a test user and club before each test suite. Clean up after.

### Rules

- **NEVER** merge/deploy a Server Action without at least: auth rejection test, validation rejection test, and success case test.
- **NEVER** mock Zod validation — always test with real schemas. The point is to catch when schema and form drift apart.
- Test file names match source: `events.ts` → `events.test.ts`. No separate `__tests__` directories.
- Use `describe` blocks grouped by function/component name. Use `it` with clear descriptions: `it('rejects RSVP when club is at member cap')`.
- Prefer `toEqual` for objects, `toBe` for primitives, `toBeInTheDocument` for DOM assertions.
- Run `npm run test` in CI (Vercel build or GitHub Actions) — tests must pass before deploy.

## Important Context

- The full product spec is in `docs/SPEC.md` — data model, features, UI patterns, build plan, SEO strategy, empty states, onboarding, auth flows, rate limiting, Stripe setup, and seed data strategy. Read before architectural decisions.
- The detailed page-by-page design spec is in `docs/DESIGN.md` — exact layout, components, interactions, Tailwind classes, empty states, onboarding wizard, and logged-out UX patterns for every page.
- The database schema in `src/lib/db/schema.ts` is the source of truth. 7 tables: users, communities, memberships, events, event_rsvps, community_stats, member_attendance_stats.
- **Launch scope: Sydney, London, Amsterdam.** Traction-based — whichever city gets the most early adoption becomes the focus. `/explore` has a city filter. Basic `/explore/[city]` pages for SEO. Landing hero says "Find your crew" (no city-specific branding).
- **Two audiences**: members (runners) and organizers (club owners). The landing page is member-first (search/explore hero) with an organizer section below the fold (features/pricing). Members never pay — pricing only applies to organizers.
- **Users can be both**: a club owner can also join and RSVP for other clubs as a member. Roles (owner/admin/member) are per-community, not global. The nav shows "My Clubs" for all logged-in users — no "Dashboard" link. Organizers reach their dashboard via "Manage →" on their club in `/my-clubs`.
- The "afters" venue feature is the core differentiator. Always use "afters" language, never "post-run". Venue badges are ALWAYS amber (#FEF3C7), never coral.
- RSVP has two statuses only: "going" and "maybe". No "not going" / "can't make it" option.
- The initial RSVP batches status + pace group into one DB write. Afters is a separate update. Post-RSVP changes are immediate individual updates.
- **Auto-join on RSVP**: if a user RSVPs to an event but isn't a member of the club, the Server Action auto-joins them + creates the RSVP in one transaction. No "join first" blocker. Exception: if the club is at member cap, show the waitlist flow instead.
- The club public page has a "Next Event" section at the top with quick RSVP — this is the primary action, not the Join button.
- Attendance analytics are a Pro upsell. Organizer enters 2 numbers after each event (actual attendance + afters attendance). Everything else is computed.
- Free tier: 1 club, 30 members, 4 events/month, no recurring, owner-only, full afters feature. Pro ($19/mo per club, no club limit): unlimited members, unlimited events, recurring events, multiple admins, full analytics, custom theme, CSV export, priority explore placement. Members never pay. Each club is upgraded independently — an organizer with 3 Pro clubs pays $57/mo.
- Every club page at `/[slug]` must be SSR for SEO — this is the primary growth engine.
- Public pages are fully visible without auth. Auth only gates ACTIONS (RSVP, join, dashboard), never CONTENT. Use ?redirect= params to preserve intent through auth flow.
- **Single auth page at `/login`** — no separate `/signup`. Email-first flow: enter email → system detects new vs existing user → new users see name + password fields, existing users see password field. Magic link available for both. Name is captured during registration; fallback prompt if magic link skips it.
- Empty states must feel encouraging, not broken. Always show an emoji, friendly message, and a clear CTA. Organizers see different empty state messages than visitors.
- Use Server Actions for all mutations (RSVP, create event, join club). Don't build API routes for CRUD.
- Use @upstash/ratelimit on all Server Actions. See docs/SPEC.md for limits per action.

## Security — CRITICAL

Security is a first-class concern. Every feature must be built with these rules from day one — not retrofitted later.

### Environment Variables

- ALL secrets go in `.env.local` (local dev) and Vercel Environment Variables (production). NEVER commit `.env.local` to git.
- **`NEXT_PUBLIC_` prefix** = exposed to the browser. ONLY use this for values that are safe to be public (PostHog project key, Supabase anon key, Stripe publishable key).
- **Everything else** (Supabase service role key, Stripe secret key, Resend API key, CRON*SECRET, Stripe webhook secret, Upstash Redis credentials) MUST NOT have the `NEXT_PUBLIC*` prefix. These are server-only.
- NEVER import server-only env vars in Client Components or files with `"use client"`. Next.js will bundle them into client JS and expose them.
- Use a `src/lib/env.ts` file that validates all required env vars exist at startup using Zod:

```typescript
const envSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  RESEND_API_KEY: z.string().startsWith("re_"),
  CRON_SECRET: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});
export const env = envSchema.parse(process.env);
```

### Authentication & Authorisation

- **Every Server Action** must verify the user is authenticated before doing anything. First line of every mutation: `const user = await getAuthUser()`. If null, return `{ success: false, error: "Not authenticated" }`.
- **Every dashboard page** is protected by middleware that checks auth AND verifies the user has owner/admin role for the community matching the `[slug]` param. Redirect to `/login` if not authenticated, redirect to `/my-clubs` if not authorised for that club.
- **Supabase has two keys**: the `anon` key (public, used in browser, respects RLS) and the `service_role` key (bypasses RLS, server-only). NEVER use the service role key in Client Components.
- Server Components and Server Actions use the Supabase server client (with cookies for auth context). API routes (webhooks, crons) use the service role client since they don't have user context.

### Row Level Security (RLS)

Enable RLS on ALL tables in Supabase. Define policies so that even if someone bypasses the application layer, the database itself enforces access control.

Key policies:

- **communities**: anyone can SELECT (public pages). Only owner can UPDATE/DELETE.
- **memberships**: authenticated users can SELECT their own memberships. Anyone can SELECT memberships for public club pages (member list). Only the user themselves can INSERT (join) or DELETE (leave) their own membership. Owner/admin can DELETE any membership in their community (remove member).
- **events**: anyone can SELECT (public). Only owner/admin of the community can INSERT/UPDATE/DELETE.
- **event_rsvps**: anyone can SELECT (public attendee lists). Only the user themselves can INSERT/UPDATE/DELETE their own RSVP. Must be authenticated.
- **users**: users can SELECT/UPDATE their own row only. No user can see another user's email (select only id, name, avatar_url, pace_preference for other users).
- **community_stats**: anyone can SELECT (displayed on public pages). Only the service role can UPDATE (cron jobs).
- **member_attendance_stats**: owner/admin can SELECT for their community. The user can SELECT their own. Service role can UPDATE.

### Server Action Security

- **Auth check**: always first. `const user = await getAuthUser(); if (!user) return { success: false, error: "Not authenticated" }`
- **Authorisation check**: after auth, verify the user has permission for the action. E.g., creating an event: verify the user is owner/admin of that community. Editing a club: verify owner. Submitting post-event: verify owner/admin.
- **Input validation**: after auth + authorisation, validate with Zod. Never trust client input.
- **Rate limiting**: after validation, check rate limit. Return generic error if limited.
- Order: Auth → Authorise → Validate → Rate limit → Execute

```typescript
export async function createEvent(
  input: unknown,
): Promise<ActionResult<Event>> {
  // 1. Auth
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // 2. Authorise
  const membership = await getMembership(user.id, input.communityId);
  if (!membership || !["owner", "admin"].includes(membership.role))
    return { success: false, error: "Not authorised" };

  // 3. Validate
  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.errors[0].message };

  // 4. Rate limit
  const { success: allowed } = await ratelimit.limit(user.id);
  if (!allowed) return { success: false, error: "Too many requests" };

  // 5. Execute
  const event = await db.insert(events).values(parsed.data).returning();
  revalidatePath(`/${community.slug}`);
  return { success: true, data: event };
}
```

### Webhook Security

- **Stripe webhooks**: ALWAYS verify the webhook signature using `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)` before processing. Reject any request that fails verification.
- **Resend webhooks**: verify using the svix signature headers that Resend provides.
- **Cron endpoints**: verify the `Authorization: Bearer ${CRON_SECRET}` header. Vercel automatically sends this header for cron invocations. Reject any request without it — prevents external callers from triggering your crons.

### API Route Security

- Webhook routes (`/api/webhooks/*`) and cron routes (`/api/cron/*`) are the ONLY API routes in the app. Everything else uses Server Actions.
- These routes must NOT be accessible without proper authentication (webhook signature or cron secret).
- Return minimal error information. Never expose stack traces, database errors, or internal state in API responses.

### Database Security

- Use Drizzle's parameterised queries for ALL database operations. Drizzle does this by default — NEVER construct raw SQL with string concatenation.
- NEVER expose database IDs in URLs where a slug or other non-sequential identifier can be used instead. Club pages use slugs (`/[slug]`), not UUIDs.
- Event IDs in URLs are UUIDs — this is fine since they're not guessable and don't reveal ordering.
- The `service_role` Supabase key can bypass RLS. Only use it in: cron jobs, webhook handlers, and admin scripts. Never in user-facing Server Components or Server Actions.

### Client-Side Security

- NEVER store sensitive data in localStorage, sessionStorage, or cookies accessible to JS.
- Auth tokens are managed by Supabase's built-in cookie handling (httpOnly, secure, sameSite).
- NEVER pass sensitive props from Server Components to Client Components. Only pass the minimum data needed for rendering.
- All `<a href>` and `<Link>` to external URLs should use `rel="noopener noreferrer"` and `target="_blank"`.
- User-generated content (club descriptions, event descriptions, venue notes) must be rendered as text, NEVER as `dangerouslySetInnerHTML`. React's default escaping handles this — just don't bypass it.

### CORS & Headers

- Next.js handles CORS automatically for same-origin requests.
- Webhook endpoints need to accept POST from external origins (Stripe, Resend). Configure appropriate CORS headers on those routes only.
- Security headers (set in `next.config.js` or middleware):
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-XSS-Protection: 1; mode=block`
  - Content-Security-Policy: restrictive policy appropriate for the app

### Secrets Checklist

| Secret                   | Env var                                | Server-only? | Used by                   |
| ------------------------ | -------------------------------------- | ------------ | ------------------------- |
| Supabase publishable key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No (public)  | Browser Supabase client   |
| Supabase URL             | `NEXT_PUBLIC_SUPABASE_URL`             | No (public)  | Browser + server client   |
| Supabase secret key      | `SUPABASE_SECRET_KEY`                  | YES          | Crons, webhooks only      |
| Stripe publishable key   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`   | No (public)  | Stripe.js in browser      |
| Stripe secret key        | `STRIPE_SECRET_KEY`                    | YES          | Server Actions, webhooks  |
| Stripe webhook secret    | `STRIPE_WEBHOOK_SECRET`                | YES          | Webhook handler           |
| Stripe Pro price ID      | `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`      | No (public)  | Checkout session creation |
| Resend API key           | `RESEND_API_KEY`                       | YES          | Email send function       |
| Cron secret              | `CRON_SECRET`                          | YES          | Cron route auth           |
| Upstash Redis URL        | `UPSTASH_REDIS_REST_URL`               | YES          | Rate limiter              |
| Upstash Redis token      | `UPSTASH_REDIS_REST_TOKEN`             | YES          | Rate limiter              |
| PostHog project key      | `NEXT_PUBLIC_POSTHOG_KEY`              | No (public)  | Browser analytics         |
| PostHog host             | `NEXT_PUBLIC_POSTHOG_HOST`             | No (public)  | Browser analytics         |

## Warnings

- NEVER make an entire page a Client Component — push `"use client"` down to the smallest interactive leaf component
- NEVER install or use global state management (Redux, Zustand, Jotai, etc.). This app doesn't need it. Server Components fetch data, Server Actions mutate data, Client Components use local state (`useState`, `useOptimistic`) or React Hook Form. The only cross-component state is the onboarding wizard, handled by a single `useForm` instance. Explore page filters use URL search params (`useSearchParams`), not state. If data needs to pass through 3+ component levels, restructure the Server Component tree or use a small-scope React context — not a global store.
- NEVER add a payment step, plan selection, or Pro upsell to the club creation onboarding flow. Every club starts on Free. Upgrade prompts only appear in the dashboard after the organizer hits natural limits.
- NEVER fetch data in Client Components — data flows DOWN from Server Component parents via props
- NEVER use useEffect for data fetching — use Server Components with async/await or Server Actions
- NEVER build API routes for simple CRUD — use Server Actions (`"use server"`) instead
- NEVER duplicate query logic — all database queries live in `src/lib/db/queries/` and are imported where needed
- NEVER use "post-run" in any user-facing text — always use "afters"
- NEVER make venue badges coral/pink — they are ALWAYS amber (#FEF3C7 bg, #B45309 text)
- NEVER add a "can't make it" / "not going" RSVP option — only "going" and "maybe"
- NEVER skip the Supabase auth middleware on dashboard routes
- NEVER query aggregate analytics on the fly — always use the cache tables
- The `communities.type` field defaults to `'run_club'` — do not hardcode this assumption anywhere. Always filter by type so the tipster expansion works later.
- The member_role enum is `['owner', 'admin', 'member', 'waitlisted']`. Active member queries MUST filter `role IN ('owner', 'admin', 'member')` — NEVER include 'waitlisted' in member counts, RSVP eligibility, or member lists.
- When a free-tier club is at 30 members, new joins go to waitlist (role: 'waitlisted'). On upgrade to Pro, all waitlisted members auto-convert to 'member'. See docs/SPEC.md for full waitlist spec.
- Stripe webhook handler must validate signatures before processing
- The rsvp_status enum is `['going', 'maybe']` — NOT `['going', 'maybe', 'not_going']`
