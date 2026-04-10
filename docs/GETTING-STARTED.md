# Getting Started with Claude Code

## File Placement

Put these 3 files in your repo:

```
your-repo/
├── CLAUDE.md          ← Root of repo (Claude Code reads this automatically)
├── docs/
│   ├── SPEC.md        ← Full product specification
│   └── DESIGN.md      ← Page-by-page design specification
├── src/
│   └── app/           ← Next.js App Router (already created)
├── package.json
└── ...
```

**CLAUDE.md** goes in the ROOT — Claude Code auto-reads this on every interaction.
**SPEC.md** and **DESIGN.md** go in a `docs/` folder — reference them when needed.

---

## First Session Prompt

Copy this as your first message to Claude Code:

```
Read docs/SPEC.md and docs/DESIGN.md fully. These are the complete product spec and design spec for a run club management platform. The NextJS App router has been set up already.

Set up the project foundation:

1. Install dependencies:
   - @supabase/supabase-js @supabase/ssr (auth + DB)
   - drizzle-orm drizzle-kit (ORM)
   - stripe (payments)
   - resend @react-email/components (email)
   - react-hook-form @hookform/resolvers zod (forms)
   - recharts (charts)
   - posthog-js (analytics)
   - tailwindcss @shadcn/ui (styling)
   - lucide-react (icons)

2. Set up the Drizzle schema in src/lib/db/schema.ts matching the data model in SPEC.md:
   - users, communities, memberships, events, event_rsvps, community_stats, member_attendance_stats
   - All enums, all fields, all constraints as specified

3. Create the folder structure from CLAUDE.md:
   - src/app/(public)/ — public pages
   - src/app/dashboard/[slug]/ — organizer dashboard
   - src/app/admin/ — admin tools
   - src/lib/db/queries/ — reusable query functions
   - src/lib/actions/ — server actions
   - src/lib/email/ — email transport + templates
   - src/lib/stripe/ — payment helpers
   - src/lib/supabase/ — client + server helpers

4. Set up Tailwind config with the colour system from CLAUDE.md (coral primary, amber venue, sunrise gradient)

5. Set up the Supabase client helpers (src/lib/supabase/client.ts + server.ts)

6. Create a .env.local.example with all required env vars listed in CLAUDE.md

Don't build any pages yet — just the foundation. I want to review the schema and structure before we start building UI.
```

---

## Build Order (suggested sessions after foundation)

### Session 2: Auth + Layout

```
Build the auth system and app layout:
1. Supabase Auth with email/password + magic link (see CLAUDE.md Auth section)
2. Auth middleware for protected routes
3. Public layout with navbar (see DESIGN.md navbar spec)
4. Dashboard layout with sidebar (see DESIGN.md dashboard spec)
5. Login/signup page (see DESIGN.md auth page spec)
```

### Session 3: Club Creation Onboarding

```
Build the club creation onboarding flow. See SPEC.md "Club Creation Onboarding Flow"
and DESIGN.md section 6 for the full 8-step spec. Key points:
- Steps 1-5 are client state (React state), no auth needed
- Auth happens at step 6 AFTER the user has invested in naming their club
- Server Action creates the club after auth with all collected data
- Every club starts Free. No payment step — ever.
- Slug auto-generation from name, editable during creation, locked after
```

### Session 4: Club Public Page

```
Build the club public page at /[slug]. See DESIGN.md section 3 for full spec.
This is the SSR public-facing page. Key sections:
- Hero with sunrise gradient + club info
- Next event card with RSVP flow (3-step: confirm → pace → afters)
- Club stats aggregate (total distance, events, runners, afters)
- Active members list with personal stats
- Upcoming events list
```

### Session 5: Event System

```
Build the event system:
1. Create event form (see DESIGN.md section 5) — 4 sections with free tier limits
2. Event detail page (see DESIGN.md section 4) — RSVP, afters toggle, attendees
3. Event list in dashboard
4. Recurring event toggle (Pro only, locked for free)
```

### Session 6: Explore Page

```
Build the explore page at /explore. See DESIGN.md section 2 for full spec.
- Search + city filter pills in hero
- Sticky filter bar (vibe + afters type + sort)
- Rich club cards with inline next event + afters strip
- Map view with Leaflet + react-leaflet-cluster
- Priority placement for Pro clubs
```

### Session 7: Dashboard + Analytics

```
Build the organizer dashboard. See DESIGN.md sections for each tab:
- Overview: member progress bar, stats grid, club totals, post-event capture, upcoming events
- Events tab: event list with create/manage
- Members tab: member list with status badges + CSV export (Pro)
- Analytics tab: charts with Recharts (Pro only, blurred teaser for free)
- Settings tab: club details, billing, custom branding
```

### Session 8: Email System

```
Build the email system using Resend + React Email.
See SPEC.md "Email Strategy" for the 5 email types:
1. Weekly digest (Monday AM)
2. Mid-week event alert
3. 24h reminder
4. Welcome email
5. Event cancellation
Set up src/lib/email/send.ts as the single transport function.
```

### Session 9: Stripe Billing

```
Set up Stripe billing. See SPEC.md "Stripe Setup & Billing Model" for full spec.
- Per-club billing ($19/mo per club)
- Checkout flow → webhook → tier update
- Customer Portal for billing management
- Upgrade UI in dashboard settings
- Handle downgrade edge cases (>30 members, excess features)
```

### Session 10: Cron Jobs + Admin Tools

```
Build automated processes:
- Cron jobs: weekly digest, mid-week alert, 24h reminder, event completion, streak decay
- Admin transfer tool at /admin/transfer (see SPEC.md concierge onboarding)
- PostHog event tracking (see SPEC.md PostHog Events)
```

---

## Tips for Working with Claude Code

1. **Always reference the docs**: "See DESIGN.md section 4 for the event page spec" — Claude Code reads the file and follows it precisely.

2. **Build one feature at a time**: Don't ask for 5 pages in one prompt. One page or one feature per session.

3. **Review before moving on**: After each session, review what was built. Fix issues before starting the next feature.

4. **Use the NEVER warnings**: If Claude Code does something wrong, point to the specific NEVER warning in CLAUDE.md. "CLAUDE.md says NEVER use useEffect for data fetching — fix this to use a Server Component."

5. **Test as you go**: Run the app after each session. Don't build 5 features and then test.

6. **Keep env vars up to date**: As you set up Supabase, Stripe, Resend etc, add the real values to .env.local.

7. **The CLAUDE.md file is your control**: If you want to change a decision (e.g. pricing, colour, feature), update CLAUDE.md first, then tell Claude Code to read it again.
