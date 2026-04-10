# RunClub Platform — Product Spec

## Overview

A web-based SaaS for run club organizers. Replaces WhatsApp + Strava + Google Forms + Instagram with one purpose-built platform. The "afters" venue feature (pubs, cafés, brunch spots) is the core differentiator — no competitor offers this.

Target: run club organizers managing 30–500 member clubs.
Revenue: Freemium → $19/mo Pro.
Path to $10k MRR: ~527 paying clubs at $19/mo.

### Launch Scope — Traction-Based, Multi-City
The initial launch targets **Sydney, London, and Amsterdam** simultaneously — whichever city gets the most traction becomes the focus. The data model supports multi-city from day one (city field on communities, location lat/lng, timezone).

For launch:
- `/explore` shows all clubs with a **city filter** (pill buttons or dropdown: All / Sydney / London / Amsterdam). Not full `/explore/[city]` SEO routes yet — just filtering on one page.
- Landing page hero says "Find your crew" (no city-specific branding) with a simple name/keyword search.
- SEO targets: "run clubs in Sydney", "run clubs in London", "run clubs in Amsterdam" — create a basic `/explore/[city]` page for each to start indexing early.
- Once one city clearly leads in traction, double down on that city for seeding, outreach, and content. The other cities remain live but are lower priority.
- The multi-city approach works because the founder moves between all three cities and can do in-person outreach in each.

## Brand & Theme — Coral Soft (Sunrise)

**Personality**: Fun, playful, warm, community-first. Sporty but approachable — not intimidating.

**Colors**:
- Primary: #F43F5E (coral)
- Secondary: #8B5CF6 (purple)  
- Accent: #F59E0B (amber)
- Success: #16A34A (green)
- Background: #FFFBF7 (warm cream)
- Surface: #FFFFFF
- Text: #1C1917
- Text muted: #78716C
- Venue badge: amber (#FEF3C7 bg, #B45309 text) — distinct from primary coral

**Hero gradient**: Sunrise direction (bottom-to-top): #F59E0B → #FB923C → #F97066 → #F43F5E → #E879A0

**Typography**:
- Headings: Bricolage Grotesque (bold, characterful, sporty) — Google Font
- Body: DM Sans (clean, friendly, readable) — Google Font

**UI conventions**:
- Border radius: 14px (rounded, friendly)
- Venue badges always use amber (not coral) with contextual emoji: 🍺 pubs, ☕ cafés, 🥐 brunch, 📍 other
- Language: "Afters" not "post-run". "Afters at [venue name]" is the standard phrasing
- Flame icon (🔥) for streaks throughout
- Cards with subtle shadows, generous whitespace
- Sunrise gradient accent bar on featured/next event cards

---

## Data Model

### Tables

**users**
- id (uuid, PK), email (unique), name, avatar_url, pace_preference, current_overall_streak (int, default 0), longest_overall_streak (int, default 0), created_at

**communities**
- id (uuid, PK), slug (unique), name, description, type (enum: run_club), city, timezone (text, e.g. "Europe/London"), location_lat, location_lng, cover_image_url, instagram_handle (text, nullable — stored without @, e.g. "bondibeachrunclub"), vibe (enum: competitive|social|casual), post_run_default (enum: pub|coffee|brunch|none), theme_color (text, nullable — hex string e.g. "#1E40AF", Pro only), is_featured (boolean), is_active (boolean, default true), member_count (int, denormalized), owner_id (FK→users), stripe_subscription_id, stripe_customer_id, tier (enum: free|pro), created_at
- Key: named "communities" not "clubs" for future tipster expansion. Always filter by `type`.
- Deactivated clubs (`is_active = false`): hidden from explore, public page shows "no longer active", no new events. All public-facing queries MUST filter `is_active = true`.

**memberships**
- id, user_id (FK), community_id (FK), role (enum: owner|admin|member|waitlisted), attendance_count (int), joined_at
- Unique constraint on (user_id, community_id)
- Waitlisted members are excluded from member_count and cannot RSVP. Active member queries filter `role IN ('owner', 'admin', 'member')`.

**events**
- id (uuid, PK), community_id (FK), title, description, date (timestamptz), meeting_point_name, meeting_point_lat, meeting_point_lng, distance_km (numeric), distance_unit (enum: km|mi), route_url, pace_groups (jsonb), post_run_venue_name, post_run_venue_url, post_run_venue_notes, is_recurring (boolean), recurrence_rule, status (enum: upcoming|completed|cancelled), actual_attendance (int, nullable), actual_social_attendance (int, nullable), post_event_note, weather_conditions, completed_at, created_at
- Status auto-transitions to "completed" 3hrs after event start time.

**event_rsvps**
- id, event_id (FK), user_id (FK), status (enum: going|maybe), joining_social (boolean), pace_group, attended (boolean), checked_in (boolean), checked_in_at, created_at
- Unique constraint on (event_id, user_id)

**community_stats** (cache table — recomputed after each event completes)
- community_id (FK, PK), total_events, total_rsvps, total_actual_attendance, total_distance_km (sum of distance_km × actual_attendance for all completed events — "We've run 4,280 km together"), total_afters_count (sum of actual_social_attendance across all completed events), unique_runners (count of distinct members who've attended ≥1 event), avg_rsvp_per_event, avg_actual_per_event, avg_show_rate, avg_social_rate, member_count, active_member_count, retention_rate_30d, streak_record, updated_at

**member_attendance_stats** (per-member per-community — recomputed after each event)
- id, user_id (FK), community_id (FK), events_attended, events_rsvpd, total_distance_km (sum of distance_km for events this member attended), afters_count (number of events where this member stayed for afters), current_streak, longest_streak, last_attended_at, show_rate, joins_social_rate, preferred_pace_group, status (enum: new|active|at_risk|lapsed)
- Status rules: new=joined <2wks, active=attended in last 2wks, at_risk=2-4wks since last attendance, lapsed=4+wks

---

## Conventions

**Timezones**: All event times are displayed in the club's timezone (derived from the club's city). A member browsing from a different timezone sees the club's local time, not their own. Store `events.date` as `timestamptz` in UTC, store a `timezone` field on the community (e.g. "Europe/London"), and format for display using the community's timezone. This avoids confusion — if a London club's run is at 6:30 PM, everyone sees 6:30 PM regardless of where they're browsing from. The timezone is **auto-derived from the city** during club creation (use a city-to-timezone lookup library like `city-timezones` or a geocoding API). No manual timezone picker — the organizer never sees this field.

**Distance units**: Per-event, chosen by the organizer in the create/edit event form. Store as `distance_km` (numeric) and `distance_unit` (enum: km|mi) on the event. Display using the stored unit. No per-member unit preference for MVP.

**Language**: Always "afters" not "post-run". Always "club" in user-facing text even though the DB table is `communities`.

**Recurring events**: Weekly only for MVP. When an organizer marks an event as recurring, the system maintains a rolling window of **4 weeks of upcoming events** ahead.

### On Create
- Organizer toggles "Recurring" on and picks a day (e.g. "Every Wednesday").
- The Server Action creates the first event AND immediately generates the next 3 copies (4 total). Each copy is a real, independent `event` row.
- All copies inherit: title, time, meeting point, distance, pace groups, afters venue. Only `date` changes (+7 days each).
- Each event gets `is_recurring: true` and `recurrence_rule: 'WEEKLY:WED'` (simple string format, not iCal — weekly only for MVP).

### Daily Cron Job
- Runs once per day via Vercel Cron (`vercel.json` cron config) or Supabase Edge Function.
- Finds recurring series that need more events:
  ```sql
  SELECT DISTINCT community_id, recurrence_rule
  FROM events
  WHERE is_recurring = true AND status = 'upcoming'
  GROUP BY community_id, recurrence_rule
  HAVING COUNT(*) < 4
  ```
- For each result: find the latest upcoming event in that series, clone it with `date + 7 days`. Repeat until 4 upcoming events exist.
- The cron copies the **most recent event** as the template — so if the organizer edited the venue on the latest one, new events inherit that change.

### Editing a Single Occurrence
- Edit it normally — it's a regular event row. The edit only affects that one event.
- `is_recurring` stays true so the cron knows it's part of a series.

### Stopping Recurrence
- Organizer toggles "Recurring" off on any event in the series.
- Server Action sets `is_recurring: false` on ALL future events in that series (matching `community_id` + `recurrence_rule` + `status: 'upcoming'`).
- The cron no longer generates new ones. Existing upcoming events remain.

### Cancelling One Occurrence
- Set that event's `status: 'cancelled'`. The cron still generates future events — one cancellation doesn't break the chain.

### Identifying a Series
- Events in the same series share `community_id` + `recurrence_rule`. Sufficient for weekly-only MVP.
- If multiple weekly series are needed later (e.g. Wednesday 5K + Sunday long run), they have different `recurrence_rule` values ('WEEKLY:WED' vs 'WEEKLY:SUN').
- For more complex recurrence patterns in the future, add a `recurrence_group_id` UUID to explicitly link series.

### Key Rules
- RSVPs do NOT carry over between recurring events — members RSVP fresh each week.
- Each generated event is fully independent — it can be edited, cancelled, or have different RSVPs without affecting others.
- The cron job endpoint should be idempotent — running it twice produces the same result (check before inserting).

---

## Pages & Routes

### Public (SSR for SEO)
- `/` — Landing page (hero, features, pricing, CTA)
- `/explore` — Browse clubs by city (map + list)
- `/explore/[city]` — City-specific SEO page
- `/[slug]` — Club public page (THE most important page)
- `/[slug]/events/[eventId]` — Event detail page

### Auth
- `/login` — Unified auth page. Email-first flow: enter email → existing user sees password field, new user sees name + password fields. Magic link available for both. No separate `/signup` page.

### Dashboard (behind auth, owner/admin only — scoped per club)
- `/dashboard/[slug]` — Overview + post-event capture prompts
- `/dashboard/[slug]/events` — Event management (CRUD)
- `/dashboard/[slug]/events/new` — Create event form
- `/dashboard/[slug]/analytics` — Pro analytics dashboard
- `/dashboard/[slug]/members` — Member list with status badges
- `/dashboard/[slug]/settings` — Club settings + Stripe billing
- `/dashboard` (no slug) — Redirects to `/my-clubs`. Never a valid page on its own.
- Middleware verifies the logged-in user has owner or admin role for the community matching `[slug]`. If not, redirect to `/my-clubs`.

### Member Hub
- `/my-clubs` — Unified hub for ALL logged-in users. Shows upcoming events across all clubs, club list with "Manage →" for owned clubs and "View →" for member clubs. No "Dashboard" link in the nav — this is the entry point for everything.

### User Roles
A user can be both an organizer and a member simultaneously. The "owner" and "admin" roles are per-community, not global. The nav shows "My Clubs" for all logged-in users — no "Dashboard" link. Organizers access their dashboard by clicking "Manage →" on their club within `/my-clubs`.

### Member Cap & Waitlist

When a free-tier club reaches 30 members, new members cannot join directly. Instead:

**What the member sees:**
1. The "Join" button text changes to "Join waitlist" (same style, still prominent).
2. On click: they're added to a waitlist (stored as a membership with `role: 'waitlisted'`).
3. Confirmation: "You're on the waitlist! We've let the organizer know. You'll be notified when a spot opens up."
4. They can still view the club page, events, and all public content — they just can't RSVP.

**What the organizer sees:**
1. **Email notifications (batched, not per-join):**
   - **First waitlist join ever**: immediate email: "[Name] tried to join [Club Name] but your club has reached the 30-member limit. Upgrade to Pro to let them in →"
   - **Subsequent joins**: batched into a daily digest (once per day, only if new people joined the waitlist since the last email). Format: "[Name] and 4 others are waiting to join [Club Name]. You now have 16 people on the waitlist. Upgrade to Pro to let them all in →". Uses the most recent joiner's name for personalisation.
   - **No email** if no new waitlist joins that day. Never spam.
2. Dashboard banner (persistent, dismissable but reappears when count increases): "🙋 5 people are waiting to join your club. Upgrade to Pro to unlock unlimited members." with "View waitlist" and "Upgrade" buttons.
3. Waitlist view: list of waiting members with name, date they tried to join, and a "Let them in" button (disabled with "Upgrade to unlock" tooltip on free tier).

**Implementation:** Track `last_waitlist_email_sent_at` on the community record (or a separate notifications table). A daily cron job checks: for each free-tier club with waitlisted members, if new waitlist joins since `last_waitlist_email_sent_at`, send the digest and update the timestamp. The first-ever waitlist join triggers an immediate email (bypass the cron).

**On upgrade to Pro:**
1. All waitlisted members are automatically converted to full members (`role: 'waitlisted'` → `role: 'member'`).
2. Each waitlisted member receives an email: "Great news! You're now a member of [Club Name]. See upcoming events →"
3. The organizer sees a confirmation: "12 waitlisted members have been added to your club!"

**Data model:** No new table needed. Use the existing `memberships` table with an additional role value: `role: 'waitlisted'`. Waitlisted members are excluded from member counts and can't RSVP. Queries for active members filter `role IN ('owner', 'admin', 'member')` — never include 'waitlisted'.

---

## Key UI Patterns

### Club Public Page (`/[slug]`)
1. **Hero**: Sunrise gradient with club name, location, member count, vibe, streak
2. **Next Event section** (prominent, below hero): Own card with sunrise accent bar at top, coral border. Shows title, date/time, distance, meeting point, pace groups, afters venue (amber card). "I'm in! 🏃" button with going count.
3. **Two-step RSVP flow**: Click "I'm in" → green confirmation slides in → afters prompt pops up below ("Staying for afters at [venue]?") with "Count me in!" / "Just the run" buttons → final confirmation adapts message.
4. **Join button**: Secondary/outlined style below the next event (since RSVP is the primary action)
5. **Upcoming events**: Card list with title, date, distance, RSVP count, afters venue badge
6. **About section**: Club description
7. **Quick stats**: 3-column grid (avg turnout, afters %, club streak) with emoji icons
8. **Active members**: List with avatar, name, pace, streak flame

### Event Detail Page (`/[slug]/events/[eventId]`)
1. Breadcrumb navigation (Club → Events → Event name)
2. Key info: 2-column grid (date/time + meeting point with Maps link)
3. **Afters venue card**: Warm amber gradient, prominent, shows venue name, notes, social count
4. Description text
5. **Pace group selector**: Clickable cards, part of RSVP flow
6. **RSVP section**: Two options only — "I'm in! 🏃" (primary, 2x width) and "Maybe" (secondary). No "can't make it". Social toggle appears after RSVP with smooth animation.
7. Attendees list with pace group and afters emoji
8. Share + invite buttons

### Explore Page (`/explore`)
1. Sunrise gradient hero with search bar + city filter pills (All/Sydney/London/Amsterdam)
2. **Sticky filter bar**: Vibe (All/Social/Competitive/Casual) + Afters type (Any/🍺 Pub/☕ Café/🥐 Brunch) + Sort (Most members/Next run soonest/Newest). The afters filter is the unique differentiator — no other platform has this.
3. **Rich club cards**: Name, vibe badge, Instagram link, location, quick stats (members/streak/run day), **inline next event preview** (date/time/distance/going count), **prominent afters venue strip** at bottom of card (full-width amber). Cards give enough context to decide without clicking through.
4. Map view toggle with Leaflet clustering
5. Empty state with CTA to start a club

The explore page should feel like browsing a curated list of local experiences, not a database of clubs. Every card should answer: "When do they run? How far? Where do they go after? Is this my vibe?"

---

## Features by Priority

### P0 — Must Have for Launch
1. Club public page with SSR + SEO metadata + Open Graph
2. Event creation with date, meeting point, distance, pace groups, route URL
3. "Add to calendar" on every event — generates .ics file (iCal format) with event title, date/time (club timezone), meeting point, and afters venue. Works with Apple Calendar, Google Calendar, Outlook. Meeting point links to Google Maps (`google.com/maps/search/?api=1&query=[lat],[lng]`).
4. Afters venue on events (name, Maps link, notes) — THE differentiator. Language: "Afters at [venue name]" with contextual emoji (🍺/☕/🥐).
4. RSVP system (going/maybe + joining_social boolean). No "can't make it" option — if not going, you simply don't respond.
5. Member join flow (public page → /login → auto-joined on return)
6. Member management (list, roles, basic stats)
7. Stripe subscription billing (free/pro tiers)
8. Post-event capture (2-number form: actual attendance + afters attendance)

### P1 — Should Have for Launch
1. Club discovery / explore page with city filtering
2. City-specific SEO pages
3. Email notifications (3 types only): weekly digest (Monday, all members, all upcoming events), 24h reminder (RSVP'd members only), welcome email (on join). No per-event published emails, no recaps. Email only for MVP — no in-app notifications or push.
4. Recurring events (weekly, auto-generate next event)
5. Attendance analytics dashboard (Pro) — bar charts, show rate, social rate, member health, day-of-week, AI insights
6. Pace group management
7. Member streaks + milestone tracking
8. Organizer dashboard overview

### Deliberately Deferred — Do NOT Build
- Club dues collection (Stripe Connect) — too complex for MVP
- Strava integration — nice-to-have, not essential
- In-app messaging/chat — WhatsApp is fine for this
- Route builder/map drawing — link to Strava routes instead
- Mobile app — responsive web is enough
- Photo gallery — link to Instagram instead
- Advanced gamification (badges, XP, levels) — streaks are enough for now
- **Reviews/ratings** — no review system for MVP. Club quality is signalled by member count, show rate, growth rate, streaks, and afters rate. Reviews add complexity, look empty at low club count, and one bad review unfairly tanks a small club. Revisit when there are 100+ clubs and members need help choosing.
- **Community moderation/verification** — no manual approval or verified badges for MVP. At launch scale (<50 clubs across 3 cities), fake communities can be spotted and handled manually. Add reporting + verified badges later if spam becomes a real problem.

---

## Why Not Strava?

Strava is great for tracking personal runs. It was never built to run a club. Here's why clubs with Strava events still get 3 RSVPs and 40 people showing up:

- **Events are buried.** Members have to open the app, navigate to the club, find the event, and tap "I'm in." There are no email notifications for new events — it's entirely pull-based. Most members never see them.
- **Attendance tracking is broken.** Strava's "Event Insights" uses a narrow time window from the event start to detect who attended, which gives wildly inaccurate counts for clubs that gather and organise before starting.
- **Features keep getting removed.** Event organiser assignment was removed. Event descriptions can't be edited after the event ends (the only place clubs could post links). The community forums are full of frustrated admins.
- **No concept of "afters."** Zero support for post-run social venues. For clubs where the pub/café IS the draw, Strava is missing the entire point.
- **No recurring events.** Organisers manually create each weekly event. Tedious, easily forgotten.
- **Events disappear.** Past events are removed from the club page after the start time. No history, no analytics, no attendance records.
- **Not discoverable.** Strava clubs don't appear in Google search results. They're invisible outside the app.
- **API is deliberately limited.** Club endpoints return max 200 activities with no dates or IDs, because Strava doesn't want third-party apps competing with paid features.

**Our positioning:** "Strava tracks your runs. [Brand] runs your club." We don't replace Strava — members keep logging their runs there. We replace the Instagram + WhatsApp + Google Forms + "just show up and hope" stack that organisers are actually using for coordination.

---

## Shareability & Social Design

The goal: members share the platform on Instagram without being asked. This drives organic growth. Every shareable moment should look good in an Instagram story (1080×1920 portrait) and include the club/platform branding subtly.

### Shareable Moments (built into the product)

**1. "I'm in" confirmation card**
After RSVP, show a beautifully designed confirmation that's screenshot-worthy:
- Club name + event title + date/time
- Sunrise gradient background (or club theme colour if Pro)
- "Going 🏃" badge + afters venue with emoji
- Pace group badge
- Going count: "You're 1 of 28"
- Subtle [Brand] wordmark at bottom (small, tasteful, not obnoxious)
- **Share button**: "Share to Instagram" — generates a 1080×1920 story-sized image with all the above. Uses the Web Share API or downloads the image.

**2. Streak milestone card**
When a member hits a streak milestone (4, 10, 20, 52 weeks), show a celebratory card:
- "🔥 12 week streak at [Club Name]"
- Sunrise gradient or club theme colour
- Animated flame effect
- Share button for Instagram story

**3. Post-run recap card (for members)**
After an event completes, show a card in My Clubs:
- "[Club Name] — Wednesday 5K"
- "42 ran · 28 stayed for afters at The Anchor 🍺"
- "Your streak: 🔥 8 weeks"
- Clean, minimal design — looks good as a screenshot
- Share button

**4. Club page itself**
The club public page (`/[slug]`) should look good when screenshotted:
- Beautiful hero with gradient
- Clean typography
- The OG image (for link previews on Instagram/WhatsApp/iMessage) should be a branded card: club name + vibe + next event + member count on a gradient background. When someone shares a link to the club, the preview looks premium.

### OG Image Generation
Generate dynamic Open Graph images for each club and event using `@vercel/og` (Vercel's edge OG image generator):
- **Club page OG**: gradient bg + club name (Bricolage 800) + city + vibe badge + "X members" + next event date + [Brand] wordmark
- **Event page OG**: gradient bg + event title + date/time + distance + afters venue + going count + [Brand] wordmark
- These are generated server-side as PNG images and served via the `<meta property="og:image">` tag. When the link is shared on Instagram, WhatsApp, iMessage, Twitter, etc., the preview looks like a designed card, not a generic screenshot.

### Design Principles for Shareability
- **Warm, premium aesthetic.** The sunrise gradient, Bricolage Grotesque font, and coral palette already feel more "lifestyle" than "SaaS tool." Lean into this.
- **Cards over tables.** Everything is a card with rounded corners, gentle shadows, and generous padding. Cards screenshot well. Tables don't.
- **Minimal chrome.** Hide nav, footers, and UI clutter when generating shareable images. The content IS the design.
- **Emoji as visual language.** 🏃🔥🍺☕🥐 — these are universal, fun, and look great on Instagram. Use them consistently but not excessively.
- **Subtle branding.** The [Brand] wordmark appears on shareable cards but small and at the bottom. It should feel like a watermark, not an ad. Members share because the card looks good, and the brand comes along for the ride.
- **Dark mode option (future).** Many runners screenshot in the morning (dark mode on their phone). A dark variant of shareable cards would look better in stories.

---

## Pace Group Behaviour

### User Profile
- Users set a **default pace preference** on their profile: a broad range like "< 5:00/km", "5:00–6:00/km", "6:00+/km", or "No preference".
- This is set during profile edit or prompted gently on first RSVP if not set.
- Stored in `users.pace_preference` as text.

### On RSVP
- When a user RSVPs to an event, the pace group selector is shown as part of the RSVP confirmation (below the "I'm in!" confirmation, alongside the afters prompt).
- If the user has a default pace preference, the **closest matching group is auto-selected** based on string/range matching against the event's pace groups.
- The auto-selected group is highlighted but the user can **change it with one tap** — no extra step or confirmation.
- Pace group selection is **optional** — a user can RSVP without picking one. The organizer sees "Unassigned" for those members.
- If the user has no default pace preference, no group is pre-selected. A gentle nudge is shown: "Pick a pace group so the organizer knows which group you're in."

### RSVP Data Flow — Initial RSVP (Batched: status + pace group)

The initial RSVP batches **status and pace group** into a single write. Afters is a separate update.

**Auto-join on RSVP:** If the user is not a member of the club, the Server Action auto-joins them before creating the RSVP — both in one transaction. The user sees one confirmation: "You've joined [Club Name] and RSVP'd for [Event]! 🎉". They never see a "join first" blocker.

**Member cap edge case:** If the club is on the free tier and at 30 members, the auto-join goes to waitlist instead. The RSVP button shows the waitlist flow (see Member Cap & Waitlist section). The user cannot RSVP while waitlisted.

1. User clicks "I'm in!" → **UI immediately shows green confirmation** (optimistic). Pace group auto-selects from profile default.
2. User can tap a different pace group if they want → **client state only**, no DB write yet.
3. **Server Action fires on "I'm in!" click**:
   - Check if user is a member of this club. If not: INSERT into `memberships` (auto-join with `role: 'member'`), increment `communities.member_count`.
   - INSERT into `event_rsvps` with `{ eventId, userId, status: 'going', paceGroup: 'Steady', joiningSocial: false }`.
   - Both operations in a single transaction.
4. Afters prompt appears. User answers "Count me in" or "Just the run" → **separate Server Action**: `update event_rsvps set joining_social = true`. One UPDATE.

So the RSVP record exists in the DB **immediately after step 3** — the user is officially going. The afters answer updates it separately, and if they close the page before answering, their RSVP is still saved (just with `joining_social: false`).

If user selects "Maybe" instead of "I'm in!": same flow but `status: 'maybe'`.

### RSVP Data Flow — Post-RSVP Changes (Immediate, one write each)

After the initial RSVP exists in the DB, all subsequent changes are **immediate single-column updates**:

- **Change pace group** → `update event_rsvps set pace_group = $1 where event_id = $2 and user_id = $3`. Debounced 500ms. Toast with undo.
- **Toggle afters** → `update event_rsvps set joining_social = $1`. Immediate. Toast with undo.
- **Change RSVP status** (going ↔ maybe) → `update event_rsvps set status = $1`. Immediate. Toast with undo.
- **Withdraw RSVP** → `delete from event_rsvps where event_id = $1 and user_id = $2`. Immediate. Toast with undo (undo re-inserts the record).

All mutations are Server Actions with optimistic UI updates — the UI changes instantly, the DB write happens async, and if it fails the UI reverts.

### Stored on RSVP
- The selected pace group name is saved to `event_rsvps.pace_group` as text (matches the group name from the event's `pace_groups` jsonb).
- If no group selected, `pace_group` is null.

### After RSVP
- The user can change their pace group at any time by tapping a different group on the event detail page. Instant switch, toast with undo.
- The `member_attendance_stats.preferred_pace_group` field is updated over time based on which group the member selects most frequently (mode calculation on recomputation).

### For Organizers
- The event management view shows RSVP count per pace group: "🐇 Fast: 8 · 🏃 Steady: 22 · 🐢 Easy: 12 · Unassigned: 3".
- This helps the organizer plan the run (e.g., do they need a separate pacer for each group).

---

## Analytics

### Organizer Analytics (Dashboard)

The organizer enters 2 numbers after each event:
1. How many people actually showed up (approximate)
2. How many stayed for afters

**Free tier** — basic counts only:
- Post-event capture form (2 numbers + notes)
- Total events run, total RSVPs, total attendance (simple counters)
- Current member count

**Pro tier** — full analytics dashboard:

From the 2 inputs + existing RSVP data, the system computes:

- **RSVP vs Actual chart** — bar chart per event showing grey (RSVPs), green (actual), amber (afters)
- **Show rate trend** — % of RSVPs who actually attend, as area chart over time
- **RSVP-to-attendance conversion** — per-event breakdown: how many RSVP'd "going" vs actually showed up. Highlights events with high no-show rates so the organizer can investigate (bad weather? wrong time? venue issue?)
- **Social rate trend** — % of attendees who stay for afters
- **Best performing afters venues** — ranked list of venues by social rate. "Events at The Crown get 82% afters rate vs 61% at The Fox." Helps organizers pick the right venue.
- **Growth rate** — new members per week and per month, shown as a line chart. "You gained 12 members this month (+18% vs last month)." Includes a breakdown of where they came from if trackable (direct link, explore page, shared event link).
- **Member health segmentation** — pie chart: active, at-risk, lapsed, new
- **Best day of week** — bar chart showing avg attendance by day
- **Member streaks + milestones** — leaderboard of longest streaks, milestone alerts
- **AI insight cards** — derived observations like:
  - "Your attendance is up 22% this month"
  - "Rainy days reduce attendance by ~28%"
  - "Events at The Crown get 18% more RSVPs than The Fox"
  - "12 members haven't attended in 3+ weeks"
  - "Sarah has a 16-week attendance streak"
  - "Your no-show rate is 24% — try sending a reminder message in your WhatsApp group"

The post-event flow:
- Event auto-transitions to "completed" 3hrs after start
- Organizer sees a prompt on next dashboard visit
- 15-second form: 2 number inputs + optional notes
- If not submitted within 48hrs, RSVP count used as fallback

### Platform Analytics (Internal — for us)

These are NOT shown to organizers. This is our internal dashboard to understand user behaviour and growth. Use a lightweight analytics tool (PostHog free tier, or Vercel Analytics) — not custom-built.

**Funnel tracking:**
- Page view → Join club → RSVP to event → Attend (post-event capture confirms)
- Track conversion rates at each step. Where are people dropping off?
- Segment by: source (direct, explore, shared link, email), device (mobile/desktop), city

**Email performance:**
- Open rates and click-through rates per email type (weekly digest, mid-week alert, 24h reminder, welcome)
- Resend provides this via webhooks — track opens, clicks, bounces
- Key metric: digest → click "RSVP to this week's runs" → actually RSVP. This tells us if the email strategy is working.

**Feature usage:**
- % of clubs that use afters venues (our differentiator — is it actually being used?)
- % of events with pace groups set up
- % of RSVPs that include a pace group selection
- % of RSVPs where member opts into afters
- % of organizers who submit post-event attendance numbers
- Average time to submit post-event capture after event completes

**Engagement metrics:**
- DAU/MAU ratio (daily active / monthly active)
- RSVP rate: what % of members RSVP to events in clubs they belong to
- Retention: % of members who RSVP to at least one event per month
- Churn: clubs that stop creating events (organizer disengagement)
- Which clubs have highest/lowest engagement — learn from the best, help the struggling

**Implementation:** PostHog (free up to 1M events/month, includes session replay, funnels, and feature flags).

Setup:
- `npm install posthog-js posthog-node` — client-side and server-side SDKs.
- Create a free PostHog Cloud account at posthog.com. Copy the project API key → `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local`. Copy the host → `NEXT_PUBLIC_POSTHOG_HOST`.
- Client-side: create a `PostHogProvider` Client Component that wraps `posthog-js/react`'s `<PostHogProvider>`. Add it to the root layout. This auto-tracks page views and sessions.
- Server-side: use `posthog-node` in Server Actions to capture backend events (RSVP, join, event created) with the user's ID.
- Identify users: call `posthog.identify(userId, { name, email, ... })` after login so events are tied to real users.

Key events to track (start with these, add more later):

| Event | Trigger | Key Properties |
|-------|---------|---------------|
| `page_viewed` | Auto (PostHog pageview tracking) | path, referrer |
| `club_joined` | Server Action: join club | club_slug, source (explore/event/direct) |
| `event_rsvp` | Server Action: RSVP created | club_slug, event_id, status (going/maybe), auto_joined (bool) |
| `afters_opted_in` | Server Action: joining_social set to true | club_slug, event_id, venue_name |
| `pace_group_selected` | Server Action: pace group set on RSVP | club_slug, event_id, pace_group |
| `post_event_submitted` | Server Action: organizer submits attendance | club_slug, event_id, actual_count, afters_count |
| `event_created` | Server Action: organizer creates event | club_slug, has_afters (bool), has_pace_groups (bool), is_recurring (bool) |
| `club_created` | Server Action: onboarding completes | club_slug, vibe, has_afters_default |
| `upgrade_clicked` | Client: clicks upgrade to Pro | club_slug, source (dashboard/waitlist_banner/pricing) |
| `email_opened` | Resend webhook | email_type (digest/reminder/midweek/welcome) |
| `email_clicked` | Resend webhook | email_type, link_url |

Keep it lightweight — don't instrument every click. These 11 events cover the full funnel and feature adoption. Add more only when you have a specific question to answer.

---

## Streaks

### What is a streak?
Consecutive **weeks** where a member RSVP'd "going" to at least one event and didn't withdraw before the event start time. Weekly is forgiving — a member can skip Tuesday's run and attend Saturday's, and the streak continues.

"Maybe" RSVPs don't count. Only "going" that was still active when the event's `date` passed.

### Two types of streaks

**Per-club streak** — consecutive weeks attending events at a specific club. Stored on `member_attendance_stats.current_streak` and `longest_streak`. Displayed on the club page member list, event attendee lists, and the organizer's dashboard.

**Overall streak** — consecutive weeks attending at least one event at ANY club. Stored on `users.current_overall_streak` and `longest_overall_streak`. Displayed on the My Clubs page next to the member's name.

### Where streaks are shown

- **Club public page** — member list shows 🔥 streak count next to each member's name (per-club streak).
- **Club public page — quick stats** — "Club streak record: 🔥 24 weeks (Sarah C.)" in the stats grid.
- **Event detail page** — attendee list shows 🔥 streak per member.
- **My Clubs page** — next to the user's name/avatar at the top: "🔥 12 week streak" (overall streak). Visible to the user themselves.
- **Dashboard members tab** — organizer sees each member's streak. Sortable column.
- **Dashboard analytics (Pro)** — streak leaderboard (top 10 members by current streak), milestone alerts ("Sarah hit 20 weeks!"), and streak distribution chart.
- **Weekly digest email** — at the bottom: "Your streak: 🔥 8 weeks — keep it going!" (overall streak). If the user hasn't RSVP'd to anything this week yet: "Your 8-week streak is at risk! RSVP to keep it alive."

### Streak recomputation

Triggered when an event auto-completes (3hrs after start). The cron job / Server Action:

1. **Identify attending members**: all `event_rsvps` for this event where `status = 'going'` at event completion time. These members "attended" this week.

2. **Per-club streak update** (for each attending member):
   - Get the event's week number (ISO week of `events.date`).
   - Look at `member_attendance_stats.last_attended_at` — was it within the previous week?
   - If yes: `current_streak += 1`. Update `longest_streak` if current exceeds it.
   - If no (gap of 2+ weeks): `current_streak = 1` (reset, this is week 1 of a new streak).
   - Update `last_attended_at` to this event's date.

3. **Per-club streak decay** (for members who DIDN'T attend):
   - Run weekly (separate cron, e.g. Sunday night): for all members where `last_attended_at` is older than 1 week AND `current_streak > 0`, set `current_streak = 0`.
   - This handles the case where nobody's event completes to trigger a reset — the weekly cron catches it.

4. **Overall streak update** (for each attending member):
   - Same logic but across all clubs: did this user have at least one "going" RSVP at ANY club in each of the previous consecutive weeks?
   - Query: for the user, look at all their `event_rsvps` with `status = 'going'` across all clubs, group by ISO week, and count consecutive weeks backward from the current week.
   - Update `users.current_overall_streak` and `longest_overall_streak`.

5. **Overall streak decay**: same weekly cron — if a user hasn't attended any event in the past week, reset `current_overall_streak = 0`.

### Streak milestones

At certain thresholds, generate an AI insight card on the organizer's dashboard:
- 4 weeks: "🔥 [Name] has a 4-week streak — they're becoming a regular!"
- 10 weeks: "🔥 [Name] hit 10 weeks! Consider giving them a shoutout."
- 20 weeks: "🔥 [Name] has been coming for 20 weeks straight — that's dedication!"
- New club record: "🏆 [Name] just set a new club streak record at [X] weeks!"

These are Pro-only insights. Free tier sees streak numbers but not the milestone cards.

---

## Pricing Tiers

**Free ($0/mo)** — per club
- Unlimited free clubs per organizer. Each club starts on Free with its own independent limits. No gating on club creation — ever.
- Up to 30 members per club (new joins go to waitlist after cap)
- Up to 4 events per month per club (manual creation only, no recurring)
- Public club page, RSVP tracking, full afters venue feature (name + notes + social count)
- Weekly digest + 24h reminder emails
- Post-event capture (2-number form), basic attendance count
- Owner-only management (no additional admins)
- "Powered by [Brand]" badge on club page footer

**Pro ($19/mo)** — per club, billed independently
- **No club limit.** Each club is its own $19/mo subscription. An organizer with 3 Pro clubs pays $57/mo. An organizer with 1 Pro club and 2 Free clubs pays $19/mo. Each club is upgraded independently from its own dashboard settings.
- Unlimited members per club
- Unlimited events per month
- Recurring events (weekly auto-generation)
- Multiple admins per club (invite via email)
- Full attendance analytics dashboard (charts, trends, AI insights)
- Member health segmentation (active/at-risk/lapsed)
- Member streaks + milestone insight cards
- CSV export of member list
- Custom theme colour (club page + event pages)
- Remove "Powered by [Brand]" badge
- Priority placement in explore page results (Pro clubs sort above free clubs at equal relevance)

**What stays free (never gated):**
- Joining clubs as a member — always free, no limits
- RSVP-ing to events — always free
- The full afters feature (venue name, notes, social count, toggle) — always free. This is the differentiator and should shine for everyone.
- Explore page, club discovery, map — always free
- Streaks for members — always visible. Only the organizer's streak insight cards on the dashboard are Pro.
- Weekly digest and reminder emails — always sent regardless of tier

**Upgrade triggers (moments that push organizers to Pro):**
1. Hit 30 member cap → "Upgrade to unlock unlimited members"
2. Try to create 5th event in a month → "Upgrade for unlimited events"
3. Try to enable recurring events → "Upgrade to auto-create weekly events"
4. Click Analytics tab → see blurred charts with real data + upgrade CTA
5. Try to add an admin → "Upgrade to invite admins"
6. Dashboard member progress bar fills up → visual pressure
7. Streak milestone cards → locked with "Unlock with Pro"

**Future tier (not built for MVP):**
- Club dues collection (Stripe Connect), white-label domain, API access — if demand emerges, add as a higher tier or add-ons. Don't spec this until there's a real need.

---

## Week-by-Week Build Plan

### Week 1: Foundation + Club Pages (40 hrs)
- Project setup (Next.js 16 + Supabase + Drizzle + Tailwind + shadcn)
- Full database schema (all 7 tables)
- Auth (unified /login — email-first flow, handles both login and registration, magic link)
- Club creation flow
- Club public page with SSR + SEO
- Event creation form with afters venue fields
- Event detail page
- RSVP system with joining_social
- Member join flow

### Week 2: Dashboard + Post-Event Capture (40 hrs)
- Organizer dashboard overview
- Post-event capture flow (2-number form, auto-detect completed events)
- Event status auto-transition (upcoming → completed)
- Event management (CRUD, duplicate)
- Recurring events
- Attendance tracking (check-in)
- Member management with status badges
- Pace group management
- Email notifications (weekly digest cron, 24h reminder cron, welcome on join)
- /my-clubs page
- SEO (meta tags, OG images, structured data)

### Week 3: Discovery + Analytics + Payments (40 hrs)
- Explore page (map + list by city)
- City SEO pages
- Search and filters
- Stripe integration (Checkout, Customer Portal, webhooks)
- Free vs Pro gating
- Analytics: attendance bar chart, show rate trend
- Analytics: social rate, member health pie
- Analytics: day-of-week patterns, AI insight cards
- Member streaks
- Cache table recomputation
- Analytics free tier locked preview
- Club settings page

### Week 4: Launch Prep (40 hrs)
- Landing page
- Pricing page
- 3 SEO articles
- Seed 5-10 real clubs
- Product Hunt prep
- Reddit posts, Instagram DMs to organizers
- Analytics, error tracking, monitoring
- Bug fixes, QA
- Launch

---

## Future: Tipster Vertical Expansion

~70% of the codebase reuses as-is: users, communities table (type='tipster_group'), memberships, Stripe billing, email system, public pages + SEO, explore/discovery, dashboard shell, member management.

~30% new build: tip posting UI, automatic result tracking, ROI/hit rate stats, Stripe Connect for tipster payouts, tip delivery (email + web feed), verified results system, sport/league filters.

Separate brand, shared codebase. Multi-domain middleware detects hostname and serves correct branding. Estimated 2-3 weeks to add.

---

## SEO Strategy

### Meta Tags Per Page
- Landing (`/`): title "[Brand] — The platform for run clubs" / desc "Schedule events, manage members, track attendance, and coordinate afters at your favourite venue. Free to start."
- Explore (`/explore`): title "Find Run Clubs Near You | [Brand]" / desc "Discover run clubs in your city. Filter by vibe, distance, and where they go for afters."
- City (`/explore/[city]`): title "Run Clubs in [City] | [Brand]" / desc "Find the best run clubs in [City]. Social runs, competitive training, and great afters venues. Browse [X] clubs."
- Club (`/[slug]`): title "[Club Name] — Run Club in [City] | [Brand]" / desc "[Club description]. [X] members. Next run: [date]. Afters at [venue]."
- Event (`/[slug]/events/[id]`): title "[Event Title] — [Club Name] | [Brand]" / desc "[Distance] run on [date] at [time]. Meeting at [location]. Afters at [venue]. [X] going."

### Structured Data (JSON-LD)
Every club page: SportsClub schema with name, sport ("Running"), location (city, geo), memberCount.
Every event page: SportsEvent schema with name, startDate, location (meeting point), organizer (club).
Embed via `<script type="application/ld+json">` in generateMetadata or the page's head.

### Dynamic OG Images
Use @vercel/og (Edge Runtime) to generate shareable images:
- Club pages: sunrise gradient bg + club name + city + member count + next event date → `/api/og/club?slug=xxx`
- Event pages: sunrise gradient bg + event title + date + distance + venue → `/api/og/event?id=xxx`
- City pages: sunrise gradient bg + "Run Clubs in [City]" + club count → `/api/og/city?city=xxx`
Set in generateMetadata: `openGraph: { images: [{ url: \`/api/og/club?slug=\${slug}\` }] }`

### Priority SEO Pages
1. /explore/[city] — "run clubs in [city]" — HIGHEST. Create for every major city.
2. /[slug] — "[club name]" — HIGH. Every club is a long-tail keyword.
3. /blog/how-to-start-a-run-club — "how to start a run club" — HIGH. Top-of-funnel content.
4. /blog/best-post-run-pubs-[city] — "best pubs after running [city]" — MEDIUM. Unique angle.
5. /explore — "find run club near me" — MEDIUM. Competitive but high intent.

---

## Empty States

Every empty state must feel encouraging, not broken. Always show: emoji icon, friendly message, helpful subtitle, and a clear CTA button.

- **Club page — no events**: "No upcoming runs yet" / "The organizer hasn't scheduled any events. Check back soon!" / CTA: "Join to get notified". Organizer sees instead: "You haven't created any events yet. Your members are waiting!" / CTA: "Create your first event →"
- **Club page — no members**: "Be the first to join!" / "This club is brand new. Join now and be part of the founding crew." / CTA: "Join [Club Name]"
- **Explore — no clubs in city**: "No clubs in [City] yet" / "Be the first to start a run club here." / CTA: "Start a club in [City] →"
- **Explore — no filter results**: "No clubs match your filters" / "Try widening your search." / CTA: "Clear filters"
- **My Clubs — no memberships**: "You haven't joined any clubs yet" / "Explore clubs near you." / CTA: "Explore clubs →"
- **Dashboard analytics — no data**: "Not enough data yet" / "Analytics will appear after your first few events. Keep running!"
- **Event detail — no RSVPs**: "No one has RSVP'd yet" / "Be the first! Share this event." / CTA: "I'm in! 🏃"
- **Dashboard members — no members**: "No members yet" / "Share your club page to start growing." / CTA: "Copy club link"

---

## Club Creation Onboarding Flow

9 steps, ~2 minutes. Each step is one screen. Progress bar at top. Back button on each step. Steps 7-8 are skippable. Auth happens mid-flow (step 6) — AFTER the user has invested in naming their club and choosing their vibe. Steps 1-5 are stored in client state (React state). After auth, a Server Action creates the club with all collected data in one transaction.

**Every club starts on Free. Always.** There is NO payment step, plan selection, or Pro upsell anywhere in the onboarding flow. The organizer should experience the platform, create events, get members, and hit natural limits before ever seeing an upgrade prompt. The first upgrade triggers happen in the dashboard (member progress bar, recurring events lock, event limit, analytics teaser) — never during club creation.

**Entry point:** "Start a club" button on landing page or nav → navigates to `/create`. No auth required to start.

1. **Name your club** — Text input. Auto-generates slug (editable). "London City Runners" → london-city-runners. No auth needed — stored in client state.
2. **Where are you based?** — City search with autocomplete. Sets city + approximate lat/lng. Client state.
3. **What's your vibe?** — Three big selectable cards: 🏆 Competitive, 🤝 Social, 😎 Casual. Client state.
4. **Where do you go for afters?** — Four options: 🍺 Pub, ☕ Café, 🥐 Brunch, 🚫 We don't do afters. If they pick a venue type, optional prompt for default venue name. Client state.
5. **Instagram handle** — Optional. Input with @ prefix shown. "Link your Instagram so members can find you there too." Stored without @. Validated: alphanumeric, periods, underscores only, max 30 chars. Skip link available. Client state.
6. **Create an account** — "Almost there! Create an account to publish your club." Shows the same auth form as `/login` (email-first, handles both login and registration). If user is already logged in, this step is **auto-skipped**. After auth completes, the Server Action fires: creates the community + owner membership in one transaction using all the data from steps 1-5. Slug uniqueness is validated server-side at this point — if taken, the user is bounced back to step 1 with an error.
7. **Add a cover photo** — Upload or skip. Placeholder if skipped. Don't block progress. (Must be after auth since upload needs a user ID for the storage path.)
8. **Your club is live! 🎉** — Show their public club page. "Share this link" CTA. Prompt to create first event. Confetti animation.

**Slug validation timing:** The slug is checked for availability client-side (async on blur in step 1) for fast feedback, but also validated server-side when the club is actually created in step 6. If another user took the slug between steps 1 and 6, the user is shown an error and can pick a new one.

**If user abandons mid-flow:** No data is saved — everything is in client state. No orphaned records. If they come back, they start fresh.

---

## Logged-Out User Experience

Key principle: NEVER show a login wall before showing value. Auth only gates actions, never content.

- **Visits club page**: Full page visible (SSR, public). Events, members, stats all visible. Clicking "Join" or "I'm in" → redirect to /login?redirect=/[slug], return after auth.
- **Visits event detail**: Full event visible. Clicking RSVP → redirect to /login?redirect=/[slug]/events/[id]&action=rsvp. After auth, auto-join + RSVP.
- **Visits explore page**: Fully functional. Search, filters, all clubs. No auth needed to browse.
- **Visits /dashboard or /my-clubs**: Middleware redirects to /login?redirect=[original path].
- **Receives shared event link**: Full event page, fully readable. CTA: "Join [Club Name] to RSVP" → signup → auto-join club + RSVP.

Always use `?redirect=` query param to preserve user intent through the auth flow.

---

## Rate Limiting & Abuse Prevention

Use @upstash/ratelimit for Server Actions. Supabase Auth handles auth rate limiting built-in.

- Signup: 5 per IP per hour (Supabase Auth built-in)
- Login attempts: 10 per IP per hour (Supabase Auth built-in)
- RSVP: 20 per user per hour (Server Action + Upstash)
- Create event: 10 per user per hour (Server Action + Upstash)
- Create club: 3 per user per day (Server Action + Upstash)
- Join club: 20 per user per hour (Server Action + Upstash)
- General: block after repeated violations. Sliding window algorithm.

Implementation: `npm install @upstash/ratelimit @upstash/redis`. Create a free Upstash Redis instance. Wrap Server Actions with a rate limit check before executing the mutation.

---

## Stripe Setup & Billing Model

**Only the club owner pays. Members never pay.** Billing is per-community, not per-user. An owner with 3 Pro clubs pays 3× $19/mo. Each community has its own `stripe_subscription_id`.

Stripe handles all payment UI, PCI compliance, and billing management. You never touch card details.

### Setup Steps
1. **Create Stripe account** — dashboard.stripe.com. Use test mode for development.
2. **Create Pro product** — Products → Add product "RunClub Pro". Price: $19/month recurring. Copy price_id → NEXT_PUBLIC_STRIPE_PRO_PRICE_ID in .env.local.
3. **Set up webhook** — Developers → Webhooks → Add endpoint: /api/webhooks/stripe. Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed.
4. **Checkout flow** — On "Upgrade to Pro": Server Action creates Stripe Checkout Session with price ID, success_url, cancel_url, and `metadata: { communityId }`. Redirect to Checkout. Stripe handles the payment page.
5. **Handle webhook** — checkout.session.completed: look up communityId from session metadata, update `communities.tier` to `'pro'`, save `stripe_subscription_id` and `stripe_customer_id`. subscription.deleted: set tier back to `'free'`. invoice.payment_failed: send email to owner warning their subscription may lapse.
6. **Customer Portal** — Settings → Customer portal → Enable cancel subscription + update payment method. On "Manage billing" in dashboard settings: Server Action creates a Stripe portal session and redirects. Stripe handles everything — invoices, card updates, cancellation.
7. **Local dev** — Install Stripe CLI: `brew install stripe/stripe-cli/stripe`. Login: `stripe login`. Listen: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. Copy webhook secret → STRIPE_WEBHOOK_SECRET.

### Billing Edge Cases
- **Failed payment**: Stripe retries automatically (up to 4 attempts over ~3 weeks). On final failure, subscription is cancelled → webhook fires `subscription.deleted` → tier reverts to `'free'`. If the club has >30 members, excess members are NOT removed — the club keeps functioning but the owner can't access Pro features (analytics, insights, custom branding). A banner prompts them to update payment.
- **Owner cancels subscription**: tier reverts to `'free'` at end of billing period (Stripe handles this). Same behaviour as failed payment — club keeps working, Pro features locked.
- **Downgrade with >30 members**: existing members stay. The club just can't accept new members beyond 30 (waitlist kicks in). No one gets kicked out.
- **Multiple clubs**: each club has its own independent subscription. Owner upgrades each club separately via that club's dashboard settings. No bundle pricing for MVP.

---

## Email Strategy & Migration Plan

### Email Types (5 total — deliberately minimal)

**1. Weekly digest (Monday morning, all members)**
- One email per member per week, regardless of how many clubs or events they're in.
- **Time window: Tuesday → Monday.** The digest is sent Monday morning, so it shows events from **tomorrow (Tuesday) through next Monday**. It cannot include events for the day it's sent (Monday) since members receive it too late to act. If a club has a Monday event, it will have been covered by the previous week's digest.
- Content: "This week at [Club Name]:" followed by a summary of each upcoming event in that Tuesday–Monday window — title, date/time, distance, afters venue with emoji badge, and current RSVP count ("23 going · 8 for afters"). Events the member has already RSVP'd to show a green "You're going ✓" badge. At the bottom, one prominent **"RSVP to this week's runs →"** primary button linking to `/my-clubs`. The My Clubs page shows the full week's events with one-click "I'm in" buttons, so members can rapidly RSVP to everything from one place.
- If a member is in multiple clubs, all clubs appear in the same digest email (one section per club).
- This replaces individual "event published" emails and post-event recaps. One email does the job of 3–4.
- Sent via cron job every Monday morning (in the club's timezone).
- If the club has no events that week, skip that club in the digest (don't send empty sections).
- If a member has no upcoming events across any of their clubs, don't send the digest at all.
- **Streak line** at the bottom of the email, below the CTA button: if the member has an active overall streak, show "🔥 Your streak: X weeks — keep it going!" If they haven't RSVP'd to anything this week yet AND have an active streak: "🔥 Your X-week streak is at risk! RSVP to keep it alive." If no streak, omit this line.

**2. Mid-week event alert (all members of that club, triggered on publish)**
- Sent ONLY when an organizer publishes an event that falls within the current week (i.e., after the Monday digest has already gone out).
- Content: "New run added this week at [Club Name]!" + event card (title, date/time, distance, afters venue, RSVP count) + **"RSVP now →"** button linking directly to the event page (`/[slug]/events/[eventId]`).
- Scoped to that single club's members — not a cross-club digest. Short and focused.
- Logic: when creating/publishing an event, check if `event.date` falls within the current digest window (this Tuesday → next Monday) AND the Monday digest has already been sent. If yes, trigger the alert. If the event is in a future digest window, it will be included in that Monday's digest — no alert needed.
- This ensures no event is invisible to members. Recurring events generated by the cron won't trigger this because they're created 4 weeks ahead — only manually created ad-hoc events within the current week trigger it.

**3. 24h reminder (RSVP'd members only)**
- Sent 24 hours before each event, ONLY to members who RSVP'd "going" or "maybe".
- Content: event title, date/time, meeting point, afters venue, pace group, going count. "See you there →" button linking to event page.
- This is the lowest-cost high-value email — it only goes to engaged members and reinforces commitment.
- Triggered by cron job checking for events happening in the next 24 hours.

**4. Welcome email (per club, on join)**
- Sent immediately when a member joins a club (including auto-join on RSVP). One welcome email per club joined — NOT just the first club. If a member joins 3 clubs, they get 3 separate welcome emails.
- Content: "You've joined [Club Name]!" + club description + next upcoming event card + "View your club page →" button.
- Low volume — only new joins, ~10% of members per month.

**5. Event cancellation (RSVP'd members only, triggered immediately)**
- Sent immediately when an organizer cancels an event, ONLY to members who RSVP'd "going" or "maybe".
- Content: "[Club Name]: [Event Title] on [date] has been cancelled." + optional reason if the organizer provided one (e.g. "Due to severe weather"). Simple and direct — no CTA needed, just information. If there's a next upcoming event, show it below: "Next run: [title] on [date]" with a link to the event page.
- Triggered by the cancel event Server Action. NOT a cron — fires immediately since timing is critical (someone might be about to head out).
- Very low volume — cancellations are rare. Maybe 1-2% of events.

### Emails we deliberately DON'T send
- **Per-event published** — replaced by weekly digest + mid-week alert for edge cases. No per-event spam for recurring events.
- **Post-event recap** — members don't need this. Organizers see it in the dashboard.
- **RSVP confirmation** — handled in the UI (toast + green confirmation card). No email needed.
- **Afters reminder** — not a separate email. The 24h reminder already includes the afters venue.

### Volume Model (optimised)

Per member: 1 weekly digest + ~1.6 reminders/month (assumes RSVP to 40% of events, 4 events/month)
Per new member: 1 welcome email
Mid-week alerts: low volume — only triggered for ad-hoc events created within the current week. Recurring events don't trigger these (they're generated weeks ahead). Estimate ~10% of events are ad-hoc mid-week → adds ~5% to total volume.

| Stage | Clubs | Members | Digests/mo | Reminders/mo | Mid-week/mo | Welcome/mo | Total/mo | Resend cost | AWS SES cost |
|-------|-------|---------|-----------|-------------|------------|-----------|---------|-------------|-------------|
| Launch | 10 | 300 | 1,200 | 480 | 120 | 30 | 1,830 | $0 (Free) | $0.18 |
| 3 months | 30 | 1,050 | 4,200 | 1,680 | 420 | 105 | 6,405 | $20 (Pro) | $0.64 |
| 6 months | 80 | 3,200 | 12,800 | 5,120 | 1,280 | 320 | 19,520 | $20 (Pro) | $1.95 |
| 12 months | 200 | 8,000 | 32,000 | 12,800 | 3,200 | 800 | 48,800 | $20 (Pro) | $4.88 |
| $10k MRR | 500 | 20,000 | 80,000 | 32,000 | 8,000 | 2,000 | 122,000 | $110 (Scale) | $12.20 |
| 1,000 clubs | 1,000 | 45,000 | 180,000 | 72,000 | 18,000 | 4,500 | 274,500 | $247 (Scale) | $27.45 |

Mid-week alerts add minimal volume (~5–8%) because most clubs run recurring weekly events that are generated well in advance. Only ad-hoc events (pub quiz night, special group run, etc.) trigger the alert.

### Phase 1: Resend (launch → ~200 clubs / ~50k emails)
Use Resend for the developer experience — React Email templates, great API, 5-minute setup. Free tier (3k/mo) covers launch, Pro ($20/mo for 50k) covers growth. The optimised model keeps you on Resend Pro much longer — up to ~200 clubs before hitting the 50k limit.

### Phase 2: Migrate to AWS SES (~200+ clubs / 50k+ emails)
When Resend costs exceed ~$90/month, migrate to AWS SES at $0.10/1k emails. The migration is straightforward:
- Keep all React Email templates — they render to HTML, which any transport can send.
- Replace the Resend SDK send call with `@aws-sdk/client-sesv2`. The API shape is similar: you pass HTML content, subject, to/from addresses.
- Set up SES in the AWS console: verify your sending domain (DNS records), request production access (takes 24hrs), configure DKIM/SPF.
- No dedicated IPs needed until very high volume. Shared IPs are fine for transactional email.
- Total migration effort: ~2–4 hours of work. The email templates don't change at all.

### Architecture for Easy Migration
Abstract the email transport behind a simple interface from day one:

```
// src/lib/email/send.ts
export async function sendEmail({ to, subject, html }: EmailParams) {
  // Phase 1: Resend
  // Phase 2: swap this for SES — everything else stays the same
}
```

All email sends go through this one function. Templates are built with React Email and rendered to HTML before being passed in. When you migrate, you change ONE file — the transport — and nothing else in the codebase is affected.

### All Automated Processes (Crons, Webhooks & Event-Driven Triggers)

#### Cron Jobs (Vercel Cron via `vercel.json` or Supabase Edge Functions)

| # | Job | Schedule | What it does |
|---|-----|----------|-------------|
| 1 | **Weekly digest email** | Monday 7:00 AM (per club timezone) | Queries all members, their clubs, and upcoming events for the Tue→Mon window. Batches into one email per member. Includes streak nudge. Skips members with no events. |
| 2 | **24h reminder email** | Hourly | Finds events starting in the next 24 hours that haven't been reminded yet. Sends to RSVP'd "going" and "maybe" members only. Marks event as `reminder_sent = true` to prevent duplicates. |
| 3 | **Event auto-completion** | Hourly | Finds events where `status = 'upcoming'` AND `date` is 3+ hours ago. Sets `status = 'completed'`, sets `completed_at = now()`. Triggers streak recomputation and cache table recomputation for each completed event. |
| 4 | **Recurring event generation** | Daily (e.g. 2:00 AM) | For each recurring series: count upcoming events. If fewer than 4, clone the most recent event with `date + 7 days`. Idempotent — safe to run multiple times. |
| 5 | **Streak decay** | Weekly (Sunday 11:00 PM) | For all members where `last_attended_at` is older than 1 week AND `current_streak > 0`: reset `current_streak = 0`. Same for `users.current_overall_streak`. Catches members who weren't reset by event completion. |
| 6 | **Waitlist digest email** | Daily (e.g. 9:00 AM) | For each free-tier club with waitlisted members: if new waitlist joins since `last_waitlist_email_sent_at`, send digest to owner ("[Name] and X others are waiting"). Update timestamp. |
| 7 | **Community stats recomputation** | After each event completion (triggered by cron #3) | Recomputes `community_stats` cache table: total events, avg attendance, show rate, social rate, member health counts, streak record, active member count. |

#### Webhooks (incoming from external services)

| # | Webhook | Source | What it does |
|---|---------|--------|-------------|
| 8 | **Stripe: checkout.session.completed** | Stripe | Look up `communityId` from session metadata. Update `communities.tier = 'pro'`, save `stripe_subscription_id` + `stripe_customer_id`. Convert all waitlisted members to active members. Send welcome email to each. |
| 9 | **Stripe: customer.subscription.deleted** | Stripe | Set `communities.tier = 'free'`. Pro features locked. Existing members stay — no one is removed. |
| 10 | **Stripe: invoice.payment_failed** | Stripe | Send email to owner warning their subscription may lapse. |
| 11 | **Stripe: customer.subscription.updated** | Stripe | Update subscription status if changed (e.g. plan change, renewal). |
| 12 | **Resend: email.opened** | Resend | Forward to PostHog: `posthog.capture('email_opened', { email_type, recipient })`. |
| 13 | **Resend: email.clicked** | Resend | Forward to PostHog: `posthog.capture('email_clicked', { email_type, link_url })`. |

#### Event-Driven Triggers (Server Actions that fire side effects)

| # | Trigger | When | Side effects |
|---|---------|------|-------------|
| 14 | **Member joins club** | Server Action: join or auto-join on RSVP | Send welcome email. Increment `communities.member_count`. If club is at cap, create waitlisted membership instead + send first-ever waitlist email to owner (if first waitlister). |
| 15 | **RSVP created** | Server Action: "I'm in!" clicked | Insert `event_rsvps`. If not a member, auto-join first (trigger #14). PostHog: `event_rsvp`. |
| 16 | **Mid-week event published** | Server Action: organizer publishes event | Check if event date falls in current digest window AND digest already sent. If yes, send mid-week alert email to all club members. |
| 17 | **Event cancelled** | Server Action: organizer cancels event | Set `status = 'cancelled'`. Send cancellation email immediately to all RSVP'd members ("going" and "maybe"). Include next upcoming event if one exists. |
| 18 | **Post-event attendance submitted** | Server Action: organizer submits 2 numbers | Update `events.actual_attendance` + `actual_social_attendance`. Trigger `community_stats` recomputation. PostHog: `post_event_submitted`. |
| 19 | **Organizer upgrades to Pro** | Stripe webhook #8 | Convert all waitlisted members → active. Send email to each converted member. Update tier. |
| 20 | **Event completed** (triggered by cron #3) | Cron detects event is 3hrs past | Recompute per-member streaks (per-club + overall). Recompute `member_attendance_stats` (status, show rate, etc.). Recompute `community_stats`. |

#### Implementation Notes
- All crons run as Vercel Cron jobs configured in `vercel.json` (e.g. `"crons": [{ "path": "/api/cron/weekly-digest", "schedule": "0 7 * * 1" }]`).
- Stripe webhooks hit `/api/webhooks/stripe` — validate signatures before processing.
- Resend webhooks hit `/api/webhooks/resend` — forward events to PostHog.
- All cron endpoints must be idempotent — running twice produces the same result.
- Protect cron endpoints with a `CRON_SECRET` env var checked in the handler — prevents external callers from triggering them.
- Event-driven triggers are side effects inside Server Actions — keep them fast. If a side effect is slow (e.g. sending emails to many members), queue it or run it async.

All crons can run as Vercel Cron jobs (configured in `vercel.json`) or Supabase Edge Functions.

---

## Seed Data Strategy

An empty platform looks dead. You need content on day one across all three launch cities.

1. **Seed 5–10 real clubs per city** (do first) — Find run clubs on Instagram in Sydney, London, and Amsterdam. Create their pages with real names, descriptions, locations, and Instagram handles. Reach out first — they might become real users.
2. **Create realistic events** (do first) — For each seeded club, create 2–3 upcoming events with real dates, meeting points, distances, and real pub/café names from the area.
3. **Start your own real club** (high priority) — Use your own platform in whichever city you're in. Gives you: a real demo, firsthand organizer experience, content to share, a genuinely active club page.
4. **Pre-create city pages** (high priority) — `/explore/sydney`, `/explore/london`, `/explore/amsterdam` at minimum. Add secondary cities too (Melbourne, Manchester, Rotterdam) with even 1–2 clubs to start Google indexing early.
5. **Use real member counts** (medium) — Set to approximate real size. Don't inflate — fake numbers destroy trust.
6. **Write 3 SEO blog posts** (week 4) — "How to start a run club in 2026", "Best afters venues in [your city]", "Run club management tips for organizers".

---

## Launch Playbook — Zero Budget

### Pre-Launch (weeks before going live)

**Concierge onboarding — your secret weapon:**
Don't wait for organizers to create their own clubs. YOU create their club pages for them using their public Instagram data, then DM them with a screenshot of their page + the public URL. No email collection, no dodgy links — they visit a normal public page on your platform.

**The flow:**
1. You create the club yourself (you are the temporary owner). Fill in name, slug, city, vibe, afters default, Instagram handle, description — all from their public Instagram.
2. Create 2–3 upcoming events with real data from their Instagram posts (dates, meeting points, distances, afters venues).
3. DM the organizer on Instagram:

   "Hey [name]! I built a free platform for run clubs and set up a page for [club name] — check it out: [public URL]. I filled it in from your Instagram so it's basically ready to go. If you want to manage it yourself (edit events, see RSVPs, etc.), just create an account on [brand].com and let me know — I'll hand it over to you. No pressure either way!"

4. They visit the public URL. It looks great — their club with real events and the afters venue featured. This isn't a sales pitch, it's a finished product.
5. If they want it: they sign up on the platform (normal `/login` flow) and DM you back saying they've created an account.
6. You transfer ownership via an admin tool (see below).
7. If they don't respond: you still have a seeded club page with real data that helps explore and SEO. No downside.

**Admin ownership transfer tool:**
Build a simple admin-only page (`/admin/transfer` — behind a hardcoded admin check on your user ID) that lets you:
- Search for a club by name or slug
- Search for a user by email or name
- Click "Transfer ownership" → runs in a single transaction:
  1. **Upsert new owner's membership**: if they already joined the club as a member, UPDATE their existing `memberships.role` from `'member'` to `'owner'`. If they haven't joined yet, INSERT a new membership with `role: 'owner'`. The unique constraint on `(user_id, community_id)` prevents duplicates — use an upsert (`ON CONFLICT DO UPDATE`).
  2. **Downgrade old owner**: UPDATE old owner's `memberships.role` from `'owner'` to `'member'` (keeps them as a member). Or DELETE their membership row if you don't want to stay in the club.
  3. **Update community**: SET `communities.owner_id` to the new user's ID.
- This handles all cases: new user who hasn't joined, existing member claiming ownership, or transferring between two existing members.
- This is a one-time internal tool, not a user-facing feature. Simple form, no need for fancy UI.

**Why this works:**
- No email collection needed — the organizer signs up on their own terms.
- No sketchy claim links — they visit a normal public page.
- No friction — the club is already set up. They just take the keys.
- No downside if they ignore it — the page still exists for SEO and explore.
- The screenshot in the DM is the hook — they see their club looking professional on a real platform.

Do this for 10–15 clubs across all three cities before launch. By day one, the explore page looks alive with real clubs, real events, and real afters venues.

**Build your own Instagram presence:**
- Create @[brand] on Instagram before launch.
- Post the shareable cards (RSVP confirmation, streak milestones) as examples of what the platform generates.
- Follow every run club in Sydney, London, and Amsterdam. Engage with their content genuinely — comment on their posts, share their stories. Build relationships before you need anything.
- Bio: "[Brand] — Find your crew. Run together. Grab drinks after. 🏃🍺 Link in bio."

### Launch Week

**1. SEO — Long-term, starts working in weeks 2-8:**

City pages (create immediately):
- `/explore/sydney` — "Run Clubs in Sydney — Find Your Crew"
- `/explore/london` — "Run Clubs in London — Find Your Crew"
- `/explore/amsterdam` — "Run Clubs in Amsterdam — Find Your Crew"
- Each page: H1 with city name, short intro paragraph, club list filtered by city, structured data (LocalBusiness schema for each club).
- Secondary cities (seed with 1-2 clubs each for early indexing): Melbourne, Coogee, Bondi, Hackney, Shoreditch, Camden, Jordaan, De Pijp.

Blog posts (write 1 per week for the first month):
- "The 15 Best Run Clubs in Sydney (2026)" — list the clubs on your platform with links. This is the page that will rank. Every club listed has an incentive to share it.
- "The Best Run Clubs in London (2026)" — same format.
- "How to Start a Run Club in 2026 — The Complete Guide" — organizer-focused, mentions your platform as the tool.
- "Best Afters Spots for Run Clubs in [City]" — unique angle nobody else covers. Lists pubs/cafés that run clubs actually go to. Extremely shareable.
- "Run Club vs Parkrun: What's the Difference?" — captures search traffic from people exploring options.

Technical SEO:
- Every club page has unique meta title/description with club name + city.
- Dynamic OG images via `@vercel/og` for every club and event (already specced).
- Sitemap at `/sitemap.xml` auto-generated from all clubs and city pages.
- Schema.org markup: `SportsTeam` for clubs, `SportsEvent` for events.

**2. Social Media — Immediate, free:**

Reddit (week 1):
- Post to r/running: "I built a free tool for run club organizers — events, RSVPs, and tracking where you go for drinks after" — show the product, link to it, ask for feedback.
- Post to r/sydney, r/london, r/amsterdam: "Found this directory of run clubs in [city] with RSVP and afters info" — don't self-promote, frame it as useful discovery.
- Post to r/SideProject, r/webdev: build-in-public angle, show the tech stack.
- Respond genuinely to every comment. Don't be spammy.

Instagram (ongoing):
- Share the "Best Run Clubs in [City]" blog post as a carousel — 1 club per slide, beautiful cards.
- Tag every club featured. Many will repost to their stories → free distribution to their members.
- Share user-generated streak milestone cards and RSVP confirmations (once real users start sharing them).
- Use location tags on every post (Bondi Beach, Hackney, Amsterdam Centrum, etc.).

Twitter/X (if you're active there):
- Build-in-public thread: "I'm building a platform for run clubs. Here's why Strava events are broken and what I'm doing about it." — technical + product angle.
- Share interesting data as you grow: "42 people RSVP'd for a Wednesday evening 5K in Bondi. 28 stayed for beers at The Anchor. This is what run clubs are really about."

**3. Direct Outreach — The highest-ROI activity:**

- DM the 10-15 organizers whose clubs you concierge-onboarded. Send them their page link. Ask them to share it once with their members.
- One Instagram story from a club with 500 followers = 200+ page views = 20-50 sign-ups. This is worth more than any blog post in week 1.
- Ask each organizer: "Would you mind sharing your club page in your next Instagram story? Here's a ready-made graphic." — provide them the shareable card so they don't have to create anything.

**4. Partnerships — Free, relationship-based:**

Local venues (pubs, cafés, bakeries):
- The afters venues are natural partners. DM them: "Hey, [Club Name] lists your venue as their afters spot on [Brand]. We're sending runners your way every [day]. Want us to add a note about any specials you run?" This costs nothing and builds goodwill. The venue might mention the platform to customers or display a small card.

Running stores:
- Local running shoe shops (not chains) often have community boards. Ask if you can put up a small poster/flyer: "Find run clubs near you — [Brand].com". Or partner: "We list the best local run clubs — want us to feature your store as a partner?"

Run club cross-promotion:
- Feature one club per week on the @[brand] Instagram as "Club of the Week." Organizers love recognition and will share it.

### Post-Launch (weeks 2-8)

**Referral system (build in month 2, not launch):**
Keep it simple — don't build a complex referral program for launch. Instead:
- Add a "Share your club" button that generates a shareable link with a referral code (`/[slug]?ref=[userId]`).
- Track referrals in PostHog (event: `club_joined` with `source: referral`).
- Phase 1: no reward, just tracking. Understand whether referrals actually drive sign-ups.
- Phase 2 (if referrals work): give the referrer a small reward. NOT a discount (the product is free for members). Instead: a **streak shield** — "Your next missed week won't break your streak." One shield per 3 referrals. This is free to implement, aligns with the product, and creates a real incentive.

**Content flywheel:**
Once clubs are active, the platform generates content automatically:
- "X people ran with [City] clubs this week" — weekly stat post on Instagram.
- Club of the Week features — tag the club, they share it.
- Streak milestone celebrations — "Sarah just hit 20 weeks with Bondi Beach Runners 🔥" (with permission).
- "Top afters spots this month" — aggregate which venues are most popular.

**Measure what matters (PostHog):**
- How do organizers find you? (Direct DM, Google, Instagram, referral)
- What's the conversion rate from explore page → join club?
- How many members RSVP after receiving the weekly digest?
- Which city is growing fastest?
- Are members actually sharing the streak/RSVP cards?

### What NOT to Do
- Don't pay for Instagram ads — the audience is too broad and CPA will be terrible.
- Don't build a referral system before you have 50+ active users — it's premature complexity.
- Don't post on Product Hunt until you have at least 10 active clubs with real members using it. A PH launch with no social proof falls flat.
- Don't approach chain brands (Nike, Adidas) — they have their own run clubs. Partner with independent local businesses instead.
- Don't spam run club Instagram accounts with generic DMs — always personalise, always show you've actually looked at their club.
