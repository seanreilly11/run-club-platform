# RunClub — Page-by-Page Design Spec

Reference this document when building any page. Every page uses the Coral Soft theme. See CLAUDE.md for color tokens and typography.

## Shared Components

### Navbar (all pages)
- Height: ~45px. White bg, bottom border `border-muted`.
- Left: Flame icon (coral bg, white icon, 26×26px rounded-md) + "[brand]" in Bricolage Grotesque 700.
- Right (logged out): "Explore" link, "Log in" link, "Start a club" primary button (small).
- Right (logged in): "Explore" link, "My Clubs" link, avatar circle (initials, coral bg → dropdown: Profile, Log out).
- No "Dashboard" link in the nav. Organizers access their dashboard via "Manage →" on their club in `/my-clubs`.
- Active nav link uses primary color + font-weight 600.

### Venue Badge (used everywhere)
- ALWAYS amber palette: bg `#FEF3C7`, text `#B45309`. NEVER coral.
- Contextual emoji prefix: 🍺 pub, ☕ café, 🥐 brunch, 📍 other.
- Format: `[emoji] Afters at [Venue Name]`
- Small variant: padding 3px 8px, text 10px, border-radius 6px.
- Card variant: full-width, padding 8px 12px, border-radius 9px, gradient bg `linear-gradient(135deg, #FEF3C7, #FEF9C3)`, border `1px solid #FDE68A`.

### Vibe Badge
- Social: bg `#FFF1F2`, text `#F43F5E`
- Competitive: bg `#EDE9FE`, text `#7C3AED`
- Casual: bg `#FEF3C7`, text `#B45309`
- Size: text 9-10px, padding 1px 6-8px, border-radius 5-6px, font-weight 600.

### Member Status Badge
- Active: bg `#F0FDF4`, text `#16A34A`
- New: bg `#EDE9FE`, text `#8B5CF6`
- At risk: bg `#FEF3C7`, text `#F59E0B`
- Lapsed: bg `#FEF2F2`, text `#EF4444`

### Streak Display
- 🔥 emoji + count + "wk" in primary color, font-weight 600-700, text 10-12px.

---

## 1. Landing Page (`/`)

**Layout**: Full-width hero. Content sections max-width 680px centered. Two-part structure: member-first top half, organizer bottom half.

**Key principle**: The majority of traffic is runners (members), not organizers. The hero speaks to runners first. Organizer content lives below the fold. CTAs naturally sort people: "Explore clubs" → member path, "Start a club" → organizer path.

**Users can be both**: A club owner can also explore and join other clubs as a member. The `memberships` table supports multiple memberships with different roles per community. The nav shows both "My Clubs" (member view) and "Dashboard" (organizer view).

### Nav
- "Explore clubs" link (for members) + "For organizers" link (smooth-scrolls to organizer section) + "Log in" + "Start a club" primary button.

### Hero — Member-First
- Sunrise gradient background, full-width, padding 52px 24px 56px. Dot pattern overlay.
- Centered content:
  - H1: "Find your crew. Run together. Grab drinks after." — Bricolage Grotesque 800, 36px, white, -0.03em tracking. Line breaks after "crew." and "together."
  - Subtitle: "Discover run clubs near you. See who's going, pick your pace, and know exactly where the group is heading for afters." — 16px, white at 0.85 opacity.
  - **Two CTA buttons** (side by side, centered):
    - "Explore clubs" (white bg, coral text, shadow, rounded-xl, 15px Bricolage 700) — links to `/explore`.
    - "Start a club — it's free" (white border, transparent bg, white text, backdrop blur, rounded-xl, 15px 600) — links to `/login` → onboarding.
  - **Note for multi-city expansion**: When launching in multiple cities, replace the two buttons with the search bar (see full design spec) and add popular city pills below. No other changes needed.

### Social Proof Bar
- Below hero, centered, border-bottom. "X clubs" · "X runners" · "Sydney". Bold values, muted labels. Update numbers as real clubs are seeded.

### Featured Clubs Section
- H2: "Clubs running this week" + subtitle "Join with one click. No app download needed."
- 3 real-looking club cards showing the product in action:
  - Club name (Bricolage 700, 15px) + location + vibe badge + member count.
  - "View club →" primary button (top right of card).
  - Next event date + afters venue badge (amber).
- Below cards: "Explore all clubs →" outlined button, centered.

### How It Works — Member (3-step)
- H2: "How it works"
- 3-column grid of cards:
  1. 🔍 "Find a club" — "Browse clubs by vibe or where they go for afters."
  2. 🏃 "RSVP in one tap" — "Pick your pace group and say whether you're staying for drinks."
  3. 🍺 "Run & socialise" — "Show up, run with your crew, and head to the venue after."

### Divider
- Simple 1px line (border-muted) separating member and organizer sections.

### Organizer Section
- "For organizers" pill badge (primaryLight bg, primary text, centered).
- H2: "Run a club? Ditch the WhatsApp chaos." — Bricolage 800, 26px.
- Subtitle: "One platform for events, RSVPs, members, attendance tracking, and afters coordination. Stop juggling 5 different tools."
- 3 feature cards (vertical stack):
  1. 📋 "Events & RSVPs that actually work" — pace groups, route links, afters venues, one-tap RSVP.
  2. 🌐 "Your own club page — found on Google" — SEO-optimized, new members find you, one-click join.
  3. 🍺 "Afters coordination, built in" — separate RSVP for the run and the afters, know headcount for the pub.

### Analytics Preview (Pro teaser)
- Card with sunrise accent bar at top, coral border.
- Title: "Know how your club is doing" + "PRO" badge.
- Mini stats grid: avg turnout, show rate, afters rate, active members.
- Mini bar chart (Recharts, small, 80px height) showing attendance trend.
- This sells the upgrade without being pushy.

### "Replaces" Section
- surfaceAlt bg, rounded card.
- Crossed-out tool names: "WhatsApp groups", "Instagram posts", "Google Forms", "Strava clubs", "Manual headcounts" — each in a small pill with line-through text.
- Below: "→ One platform for everything" in primary color.

### Pricing — Organizer Only
- H2: "Simple pricing for organizers" + subtitle: **"Free for members. Always. Organizers only pay when they need more."**
- 2-column grid: Free vs Pro (same layout as before but with updated subtitle).
- Below pricing: "Members never pay. Joining clubs, RSVP-ing, and exploring are always free." in text-light, centered.

### Testimonial
- surfaceAlt bg, border-top. Centered quote (italic, 15px) + attribution. From a member perspective to reinforce the member value.

### Final CTA — Dual
- H2: "Ready to run?" + "Whether you're looking for a club or building one."
- Two buttons side by side: "Find a club near me" (primary) + "Start a club — it's free" (outlined).

### Footer (all pages)
- Simple centered: © 2026 [Brand] · Privacy · Terms · **Feedback**. Text-light color.
- "Feedback" link opens a small modal/dialog (not a new page): textarea "What's on your mind?" (placeholder "Share an idea, report a bug, or just say hi...") + email field (pre-filled if logged in) + "Send" primary button.
- On submit: Server Action sends an email to the founder's inbox via the existing email transport (`src/lib/email/send.ts`). Email contains: feedback text, user name, user email, current page URL, timestamp. No DB table — zero storage cost, one email per submission.
- Toast on success: "Thanks for the feedback! 🙏"
- Keep it simple — no categories, no upvoting, no status tracking. Just a direct line to you.

---

## 2. Explore Page (`/explore`)

**Layout**: Full-width hero, content max-width 720px centered.

### Search Hero
- Sunrise gradient, shorter than landing (padding 32px 24px 36px).
- Centered: H1 "Find your crew" (26px, Bricolage 800, white), subtitle "Discover run clubs near you" (13px, white at 0.8).
- Search input (white, rounded-xl, shadow, search icon left, placeholder "Search by name or area...").
- City filter pills directly below search (inside the gradient): All / Sydney / London / Amsterdam — white at 0.2 bg when inactive, white bg with primary text when active.

### Filter Bar
- Below hero, sticky on scroll (surface bg, subtle bottom border). Two filter groups:
  - **Vibe**: All / 🤝 Social / 🏆 Competitive / 😎 Casual — pill buttons, primary-light bg when active.
  - **Afters**: Any / 🍺 Pub / ☕ Café / 🥐 Brunch — pill buttons, venue-amber bg when active. This filter is THE differentiator — no other platform lets you find clubs by their post-run spot.
- **Sort**: dropdown on the right — "Most members" (default) / "Next run soonest" / "Newest clubs". Subtle, text-muted. **Priority placement**: within each sort order, Pro clubs are ranked above free clubs at equal relevance. This is not shown to users — it's invisible boosting. No "Promoted" badge or ad-like treatment.
- Result count below: "[N] clubs" in text-light.

### Club Cards — Rich Preview
Each card should give enough context that a member can decide "this is my vibe" without clicking through. Cards are the primary discovery surface — they need to sell the club.

- Vertical stack, gap 10px.
- Each card (surface bg, border-muted, radius 14px, card shadow, padding 16px):
  - **Header row**: Club name (Bricolage 700, 15px) + vibe badge (pill). Right side: Instagram icon linking to their IG (if set, subtle, text-muted).
  - **Location**: MapPin icon + city/area (11px, text-muted).
  - **Quick stats row** (11px, text-muted, flex with gaps): "👥 64 members" · "🔥 Club streak: 24 wks" · "📅 Runs [day]s"
  - **Next event preview** — this is key. Shows inline without clicking:
    - "[Day] [time] · [distance] · [meeting point area]" (12px, text color, 500 weight)
    - Going count: "23 going" in primary color (12px)
  - **Afters badge** (amber, prominent — not tucked away):
    - Full-width amber strip at bottom of card: "🍺 Afters at The Anchor" or "☕ Coffee at Depot Café" or "🥐 Brunch at AP Bakery"
    - If no afters: strip is hidden entirely (don't show "No afters" — it's a negative signal)
  - **Club description snippet**: first 80 chars of description, truncated with "..." (11px, text-muted). Only shown if there's space (desktop: always, mobile: hidden to save space).

### Map View
- **Toggle button** in the filter bar: pill button "🗺️ Map" next to the sort dropdown. When active, switches to primary-light bg. Toggles between list view (default) and map view.
- **Desktop**: map appears in the content area replacing the club card list. Full width of content container, 500px height. Filter bar stays sticky above.
- **Mobile**: map opens as a full-screen overlay sliding up from the bottom (like Uber/Airbnb). "← Back to list" button top-left. Map fills the entire screen below the nav.

#### Map Content
- **Each club's next event meeting point** is plotted as a marker — NOT the club's general location. This shows members exactly where they'd meet, not just the suburb. If a club has no upcoming events, fall back to the club's `location_lat/lng`.
- **Marker style**: small coral circle (16px) with white running emoji (🏃) or the club's initials. On hover/tap, the marker scales up slightly.
- **Marker clustering**: use `react-leaflet-cluster` (Leaflet.markercluster). Clusters show a count badge in a coral circle. Clicking a cluster zooms in.
- **Popup on marker tap**: card-style popup (280px wide, surface bg, rounded-lg, shadow):
  - Club name (Bricolage 700, 14px) + vibe badge
  - Meeting point name (12px, text-muted)
  - Next event: "[Day] [time] · [distance]" (12px)
  - Going count: "23 going" (primary, 11px)
  - Afters venue strip: amber bg, "🍺 Afters at The Anchor" (same style as explore cards)
  - "View club →" link (primary, 12px)
- **Filters apply to map**: if user filters by vibe or afters type, map markers update to only show matching clubs. City filter zooms the map to the selected city.
- **User location** (optional): if the user grants location permission, show a blue dot for their position. This helps them find clubs near them. Don't ask on page load — only ask when they tap a "📍 Near me" button in the map controls.
- **Map tile**: use OpenStreetMap tiles (free). Style: default or a light/clean tileset. Don't use satellite imagery — it's distracting.

#### Data for Map
- Fetch all clubs with `{ id, name, slug, vibe, location_lat, location_lng, instagram_handle, member_count, post_run_default }` + each club's next event `{ title, date, meeting_point_name, meeting_point_lat, meeting_point_lng, distance_km, distance_unit }` + RSVP going count + afters venue name.
- This is a lightweight query — no full club objects. At <500 clubs across 3 cities, this is a single query with no performance concerns.
- For future scale (1000+ clubs): add server-side bounding box filtering to only return clubs within the visible map viewport.

### Empty State
- If filters return no results: "No clubs match your filters" + "Try broadening your search or changing the vibe/afters filter" + "Start your own club →" CTA.

### Why This Explore is Better
- **Afters filter is unique.** Nobody else lets you find clubs by post-run venue type.
- **Next event visible on the card.** You see when they run, how far, and how many are going before clicking.
- **Going count creates urgency.** "23 going" is social proof on the card itself.
- **Vibe badges set expectations.** Beginners know to look for "Casual", not guess.

---

## 3. Club Public Page (`/[slug]`) — SSR

**Layout**: Full-width hero, content padding 16-20px, no max-width (mobile-first).

### Hero
- Sunrise gradient, padding 32px 20px 40px, dot pattern overlay.
- **Custom theme colour (Pro only):** If `theme_color` is set and club is Pro tier, replace the sunrise gradient with a gradient derived from their theme colour: `linear-gradient(to top, [theme_color], [theme_color_lighter])`. Generate the lighter shade by increasing lightness by 15-20% in HSL space. The dot pattern overlay, white text, and all other hero elements remain the same — only the background gradient changes.
- If no theme colour or free tier: default sunrise gradient (amber → coral → pink).
- Location pill (MapPin icon + city, white at 0.18 opacity bg).
- H1: Club name, Bricolage 800, 26px, white.
- Description: 13px, white at 0.85.
- Stats row: Members count, vibe emoji, streak flame — all white, 12px, font-weight 600.
- **Instagram link** (if set): Instagram icon + "@[handle]" in white, 12px, font-weight 500. Links to `https://instagram.com/[handle]` with `target="_blank" rel="noopener noreferrer"`. Shown in the stats row alongside members/vibe/streak. If no Instagram handle, this is simply omitted.

### Theme Colour — Where It Applies (Pro Only)
When a Pro club has `theme_color` set, the following elements use it instead of the default coral primary:
- **Club page hero**: background gradient derived from theme colour
- **Club page next event card**: accent bar (3px top bar) uses theme colour instead of sunrise gradient
- **Club page RSVP button**: background uses theme colour instead of coral
- **Event detail page**: same three elements (hero gradient, accent bar, RSVP button)
- Everything else (afters badges stay amber, nav stays default, dashboard stays default, emails stay brand coral) is UNCHANGED. The theme colour is a page-level tint, not a full reskin.

### Next Event Section (PRIMARY FEATURE)
- Immediately below hero. Own card with:
  - Sunrise accent bar (3px height, hero gradient) at very top of card.
  - 1.5px coral border (not muted). Border-radius 16px. Subtle coral shadow.
  - Header row: "NEXT RUN" label (10px, primary, uppercase) + "in X days" (text-light) + "Details >" link (primary).
  - Title: Bricolage 700, 16px.
  - Info: date/time (tappable — "Add to calendar →" link, generates .ics download) + distance badge. Meeting point with MapPin icon (tappable — "Open in Maps →" link to Google Maps).
  - Pace groups: horizontal pills (surfaceAlt bg).
  - Afters venue: card variant (amber gradient bg, amber border).
  - **RSVP button**: "I'm in! 🏃" — full-width primary button (14px, Bricolage 700, 12px radius, coral shadow). Going count to the right.
  - **Three-step flow on click**:
    1. Green confirmation slides down (animation: slideDown 0.35s): "You're in! 🎉" with check icon, green bg/border.
    2. Pace group selector appears below confirmation: the user's default pace preference auto-selects the closest matching group (highlighted with primary border + check). If no default, no pre-selection + gentle nudge text "Pick a pace group so the organizer knows which group you're in." User can tap to change or skip — optional, not blocking.
    3. Afters prompt pops in below (animation: popIn 0.3s with delay): amber gradient card, "Staying for afters at [venue]?", two buttons: "Count me in! [emoji]" (amber bg, white text) + "Just the run" (white bg, amber text/border).
    4. Final state: green confirmation with adapted message + selected pace group shown + "Undo" link.

### Join Button
- Below next event. SECONDARY style: outlined, coral text, coral border, white bg. Full-width.
- **When club is at member cap (free tier, 30 members):**
  - Button text changes to "Join waitlist" (same outlined style — still looks inviting, not broken).
  - Small text below button: "This club is at capacity. Join the waitlist and we'll let the organizer know." (12px, text-muted).
  - On click: instant action. Toast: "You're on the waitlist! We've let the organizer know." (success type).
  - The member sees the club page normally — they can browse events and content, they just can't RSVP. RSVP buttons show a tooltip: "Join the club to RSVP".
  - In `/my-clubs`: the club appears with a "Waitlisted" badge (amber bg, amber text) instead of the normal card. Text: "You're on the waitlist. The organizer has been notified."

### Upcoming Events
- H2: "Upcoming runs", Bricolage 700, 16px.
- Card list (surface bg, border-muted, radius 14px):
  - Title (Bricolage 600, 13px) + date (11px muted) + distance badge.
  - Right: going count + "for afters" subcount.
  - Venue badge if applicable (amber, small variant).

### About Section
- H2 + paragraph text (12px muted, line-height 1.7).

### Club Stats — Aggregate
These make the club feel alive. Computed from real completed event data only — no estimates.

- **Stats banner** below the About section. Full-width card (surface bg, border-muted, radius 14px, padding 16px).
- **4-column grid** (2×2 on mobile):
  - 🏃 **Total distance**: "4,280 km run together" — sum of (distance_km × actual_attendance) for all completed events. The big hero stat. Use the club's preferred unit if consistent, otherwise km. Shows as large Bricolage 700 number + "km together" label.
  - 🎉 **Events completed**: "127 runs" — count of completed events.
  - 👥 **Unique runners**: "89 runners" — count of distinct members who attended at least one event.
  - 🍺 **Afters count**: "2,340 drinks earned" — sum of actual_social_attendance across completed events. Fun, social, shareable. If afters count is 0 or too low, show "Avg turnout: 34" instead.
- **Fun milestones** (optional, shown below the grid when hit):
  - At 1,000 km: "🌍 That's London to Barcelona!"
  - At 5,000 km: "🌍 That's Sydney to Tokyo!"
  - At 10,000 km: "🌍 That's London to Sydney — halfway around the world!"
  - At 42.195 km × 100 (4,219.5 km): "🏅 100 marathons worth of running!"
  - These are fun, shareable, and make the stats feel human. Only show the most recent milestone, not all of them.

### Quick Stats (legacy — merge into the above)
- Avg turnout, Stay for afters %, Club streak — these move into the stats banner or dashboard analytics.

### Active Members
- H2 + member list:
  - Each row: avatar circle (30px, primaryBg, initial in primary) + name (12px 500) + personal stats: "24 runs · 186 km · 🔥 12" (10px text-light). Shows their individual contribution to the club total.
  - Pace badge (10px, surfaceAlt bg) if they have a preferred pace.

---

## 4. Event Detail Page (`/[slug]/events/[eventId]`) — SSR

**Layout**: Content padding 14-20px, no max-width.

### Breadcrumb
- [Club name (primary)] > Events > [Event name (muted)]. ChevronRight separators. 11px.

### Header
- Tag badges: "🏃 Running" (primaryLight bg) + distance (surfaceAlt bg) + "Weekly" if recurring (surfaceAlt bg). 10px.
- H1: Event title, Bricolage 800, 22px.
- Club name link in primary, 13px 600.

### Key Info Grid
- 2 columns:
  - Date/time card: Calendar icon (primary) + label + date (13px 600) + time (12px muted) + **"Add to calendar →"** link (primary, 11px). Generates an `.ics` file download (iCal format) containing: event title, date/time (in club timezone), location (meeting point name + lat/lng), description (event description + afters venue). Works with Apple Calendar, Google Calendar, Outlook. Implementation: generate the `.ics` content server-side or via a client-side library, serve as a downloadable file or a `data:` URI.
  - Meeting point card: MapPin icon (primary) + label + location (13px 600) + **"Open in Maps →"** link (primary, 11px). Links to `https://www.google.com/maps/search/?api=1&query=[lat],[lng]`. If no lat/lng, use `https://www.google.com/maps/search/?api=1&query=[encodeURIComponent(meetingPointName)]`. Opens in new tab with `target="_blank" rel="noopener noreferrer"`.

### Route Link (optional)
- Only shown if the event has a `route_url` set.
- Card: surface bg, border-muted, radius 12px, padding 12px 14px. Display: flex, space-between, center.
- Left: map emoji icon (28px bg circle) + route description ("View route on Strava" or "View route") + subtitle if organizer added one (10px, text-light).
- Right: arrow "→" in primary.
- Entire card is clickable, opens `route_url` in new tab.
- If no `route_url`, this card is omitted entirely.

### Afters Venue Card — THE DIFFERENTIATOR
This is the feature nobody else has. It should feel premium and be the second thing a member looks at after the date/time.

- Card variant: warm amber gradient background (`linear-gradient(135deg, #FEF3C7, #FEF9C3)`), amber border (#FDE68A), radius 12px, padding 16px. Slightly larger than other cards — it should stand out.
- "🍺 AFTERS" label (10px, uppercase, letter-spacing 0.08em, dark amber #78350F).
- Venue name: Bricolage 700, 16px, dark amber (#78350F).
- Notes: 12px, medium amber (#92400E). E.g. "Happy hour until 8pm" or "They do great burgers" — organizer-written, personal, local knowledge.
- **"Open in Maps →"** link (amber text, 11px). Links to Google Maps with the venue name. If the organizer provided `post_run_venue_url`, use that instead (e.g. a direct link to the pub's website or Google Maps page).
- **Social count** (prominent): "🍺 18 staying for afters" (13px, 600 weight, dark amber). This creates FOMO and is the nudge that gets people to stay.
- If no one has opted in for afters yet: "Be the first to stay for afters!" (12px, medium amber).
- **Context line** (very small, bottom of card): "You'll be asked after you RSVP" (9px, text-light amber). Tells people they don't need to commit to afters before RSVP-ing.

### No Afters? No Card.
If the event has no afters venue set, this card simply doesn't appear. Don't show "No afters planned" — that's a negative signal. The absence is neutral.

### Description
- Body text, 12px muted, line-height 1.7.

### Pace Group Selector
- H3: "Choose your pace group", Bricolage 700, 14px.
- Vertical stack of selectable buttons (surface bg → primaryLight bg when selected, border changes to primary):
  - Left: check icon (only when selected) + group name (13px 600) + pace range (11px muted).
  - Right: runner count (11px text-light).
- **Auto-select behaviour**: If user has a default pace preference in their profile, the closest matching group is pre-highlighted on page load. User can tap to change.
- **If no default**: no pre-selection. Subtle hint below: "Pick a pace group so the organizer knows which group you're in" (11px, text-light).
- Selection is **optional** — user can RSVP without picking a group. Organizer sees "Unassigned".

### RSVP Section
- Card (surface bg, border-muted, radius 14px, padding 16px, card shadow).
- H3: "Are you coming?"
- Two buttons side by side: "I'm in! 🏃" (flex:2, primary bg when selected, coral shadow) + "Maybe" (flex:1, outlined, border-muted).
- **After RSVP, in sequence** (smooth animations):
  1. Green confirmation card: check icon in green circle + "You're in! 🎉" (or "Maybe — we'll save you a spot") + pace group shown below.
  2. Afters toggle: card with venue emoji + "Staying for afters?" + venue name + "[X] others are" + toggle switch (36×20px track, 16px knob, off=grey, on=green). Card background transitions: surfaceAlt → venueBg when toggled on.
  3. **Change / Undo links**: below the toggle, two links side by side: "Change to [Maybe/Going]" (primary, left) + "Undo" (text-light, right). Change swaps the status. Undo reverts to pre-RSVP state (deletes the record).
- **Confirmation**: green bg/border, check icon, adaptive message including pace group if selected.

### Attendees List
- Header: "Who's coming" (Bricolage 700, 14px) + summary on right: "X going · X afters · X maybe" (11px text-light).
- Member rows (surface bg, border-muted, radius 10px, padding 8px 10px):
  - Avatar circle (30px, primaryBg, initials in primary) + name (12px 500) + pace badge (surfaceAlt, 10px) + **streak count** (🔥 X, primary, 10px) + venue emoji (🍺) if joining social.
  - Streaks shown per member — this makes the attendee list engaging and creates mild competition.
- Show first 5 attendees. "View all X attendees →" link (primary, centered) to expand.

### Action Buttons
- Two outlined buttons side by side: "Share" + "Invite a friend". Both: surface bg, border-muted, 12px 600, icons (Share2, UserPlus).
- "Share" uses the Web Share API if available (mobile), falls back to copy-link-to-clipboard with toast.

---

## 5. Create Event Form (`/dashboard/events/new`) — Authed

**Layout**: Dashboard shell (sidebar + content). Form width 520px, centered in content area.

### Header
- H1: "New Event", Bricolage 800, 20px.
- Subtitle: Club name, 12px muted.
- "Cancel" outlined button, top right.
- **Free tier event limit**: if the club is on the free tier, show a small counter below the subtitle: "X of 4 events this month" (11px, text-muted). If at 4/4: the "Save" button is disabled and a banner appears at the top: "You've reached the 4-event limit this month. Upgrade to Pro for unlimited events →" (surfaceAlt bg, primary link).

### Form Structure — 4 numbered sections

#### Section 1: 📋 Event details
- Section header: numbered circle (24px, primaryLight bg, primary text) + emoji + title (Bricolage 700, 15px). Bottom border separator.
- **Event title** (required): text input, placeholder "e.g. Wednesday Evening 5K". Hint: "Keep it simple — members see this in their feed".
- **Date + Time** (required): 2-column grid, date picker + time picker.
- **Description** (optional): textarea, 3 rows, placeholder about route details / what to bring. Hint encourages writing.
- **Recurring toggle**: custom toggle component (surface bg → surfaceAlt when on, border change). Label: "Recurring event", sublabel: "Automatically create this event every week".
  - **Free tier**: toggle is visible but disabled with a small lock icon and "Pro" badge. Tapping shows a tooltip: "Upgrade to Pro to auto-create weekly events →". This lets free organizers see what they're missing without being blocked from creating the event.
  - **Pro tier**: toggle works normally. When enabled, reveals a day-of-week select dropdown inside a surfaceAlt box.

#### Section 2: 🗺️ Route & meeting point
- **Meeting point** (required): text input. Hint: "Be specific — new members need to find you".
- **Distance + Unit**: 2-column grid. Number input + select (km/miles).
- **Route link** (optional): text input for Strava/Maps/Komoot URL. Hint explains accepted formats.
- **Map placeholder**: 120px height, surfaceAlt bg, dashed border, centered pin emoji + "Click to set meeting point on map" + "Or enter an address above" hint. Interactive in final build.

#### Section 3: 🏃 Pace groups
- Pre-populated with 3 defaults: 🐇 Fast (< 5:00/km), 🏃 Steady (5:00–6:00/km), 🐢 Easy (6:00+/km).
- Each group row: surface bg card, border-muted, radius 10px. Contains: name input (13px 600, no border, transparent bg) + pace range input (120px, small bordered input) + remove button (× icon, 28×28).
- "Add pace group" button: dashed border, full-width, primary text, + icon.
- Hint below: explains why pace groups matter for RSVPs.

#### Section 4: 🍻 Afters
- **Include afters toggle**: same toggle component. Label: "Include an afters venue", sublabel: "Where is the group heading after the run?"
- When enabled, reveals amber-themed section (amber gradient bg, amber border, radius 12px, padding 16px):
  - **Venue type selector**: 4 equal buttons in a row — 🍺 Pub, ☕ Café, 🥐 Brunch, 📍 Other. Selected: amber bg (#B45309), white text. Unselected: white bg, amber text, amber border.
  - **Venue name** (required): input with amber border, white-ish bg, dark amber text (#78350F).
  - **Venue link** (optional): input for Google Maps URL. Hint: "Paste a Google Maps link so members can find it easily".
  - **Notes** (optional): input for attendee notes, placeholder "e.g. Happy hour until 8pm, reserved area at the back".

### Live Preview
- Below the form sections. Label: "Preview — how members will see it" (10px, text-light, uppercase).
- Shows a mini version of the Next Event card exactly as it would appear on the club page: sunrise accent bar, "NEXT RUN" label, title, date/time, meeting point, pace group pills, afters venue card (amber), and a static "I'm in! 🏃" button (primaryBg, not interactive).
- Updates in real-time as the organizer fills in the form.

### Submit Buttons
- 2 buttons side by side: "Save as draft" (flex:1, outlined, muted text) + "Publish event 🚀" (flex:2, primary bg, coral shadow, Bricolage 700).
- Hint below: "Members will be notified 24 hours before the event" (11px, text-light, centered).

---

## 6. Auth Page (`/login`) — Handles Both Login and Registration

**Layout**: Centered card, max-width 340px, vertically centered in viewport. Single URL `/login` for everything. No separate `/signup` page.

### Step 1: Email First
- Flame logo (44×44, primary bg, centered).
- H1: "Welcome to [Brand]", Bricolage 800, 22px.
- Subtitle: "Enter your email to get started", 13px muted.
- Card (surface bg, border-muted, radius 14px, padding 20px, card shadow):
  - **Email input** only — no password field yet. Placeholder "you@example.com". bg #FFFBF7, border-muted, radius 10px.
  - "Continue" primary button (full-width, coral shadow).
  - "or" divider (1px line with "or" text centered, text-light).
  - "Send me a magic link ✉️" outlined button — works for both new and existing users. Supabase handles both cases.

### Step 2a: Existing User (email found)
- H1 changes to: "Welcome back!" 
- Email shown as static text (not editable) with a "Change" link.
- **Password input** appears with animation (slideDown).
- "Log in" primary button.
- "Forgot password?" link below (text-light, underlined) → triggers Supabase password reset email.
- Magic link option still available as fallback.

### Step 2b: New User (email not found)
- H1 changes to: "Let's get you set up!"
- Email shown as static text with "Change" link.
- **Name input** appears: "What should we call you?" placeholder "e.g. Sarah". Required.
- **Password input** appears: "Choose a password" placeholder "At least 8 characters".
- "Create account" primary button (full-width, coral shadow).
- Below: "By signing up you agree to our Terms and Privacy Policy" (10px, text-light).

### After Auth Completes
- If `?redirect=` param exists: navigate there and execute any `?action=` param (join, rsvp).
- If no redirect: navigate to `/my-clubs` if they're a member of any clubs, or `/explore` if they're brand new.
- If they came from the "Start a club" CTA: redirect to the club creation onboarding flow.

### Name Capture Fallback
- If a magic link user somehow completes auth without entering a name (edge case — magic link for new user), show a blocking inline prompt on their next action: "Before you continue, what's your name?" — single text input + "Save" button. Stores to `users.name`. Only shown once.

---

## 7. My Clubs Page (`/my-clubs`) — Authed

**Layout**: Content padding 20px. This is the single hub for all logged-in users. No "Dashboard" in the nav — organizers reach their dashboard from here via "Manage →".

**All clubs in one list**: Owned, admin, and member clubs appear in a single "My clubs" section. The "Owner"/"Admin" badge and "Manage →" vs "View →" button distinguish the role. Waitlisted clubs appear in a separate section below.

### Header
- H1: "My Clubs", Bricolage 800, 22px.
- Subtitle: "Your upcoming runs across all clubs", 13px muted.
- **Overall streak badge** (right side of header, or below subtitle): "🔥 12 week streak" (primary color, Bricolage 700, 14px). Shows the user's `current_overall_streak`. If streak is 0, don't show the badge. If the user hasn't RSVP'd to anything this week yet and has an active streak: show in amber with "🔥 12 weeks — RSVP to keep it going!" as a subtle nudge.

### Coming Up Section
- H2: "This week", Bricolage 700, 15px. Shows the current week's events (Monday–Sunday) from ALL clubs the user is a member of, sorted by date. This is the primary RSVP surface — the weekly digest email links here.
- Event cards from all clubs, each card (surface bg, border-muted, radius 12px, padding 12px 14px):
  - **Club name label** above event: 10px, primary color, font-weight 600. Distinguishes which club the event belongs to.
  - Title (Bricolage 600, 13px) + distance badge (surfaceAlt bg, 10px) on the same row.
  - Date (11px, muted) below.
  - RSVP count: "23 going · 8 for afters" (10px, text-light) below date.
  - Afters venue badge (amber, small variant) below.
  - **Right side — one-click RSVP**:
    - If not RSVP'd: **"I'm in! 🏃"** coral primary button (6px 14px, 12px, 600). One click RSVPs immediately (Server Action, optimistic UI, toast with undo). Auto-joins club if not a member. Pace group auto-selected from profile default. `joining_social` defaults to false.
    - If RSVP'd going: green "Going ✓" badge (F0FDF4 bg, BBF7D0 border, green text). Below: "+ afters 🍺" in amber text (9px) if joining social. Clicking the badge expands inline options to change response or toggle afters.
    - If RSVP'd maybe: amber "Maybe" badge. Same expand behaviour.
- Show ALL events for the current week — no cap. If there are no events this week, show: "No runs this week. Check back Monday!" with a subtle note about the next event if one exists further out.
- Below the week's events: "Next week →" text link to show the following week's events (simple toggle or section expansion).

### My Clubs Section
- H2: "My clubs" + "+ Start a club" outlined button (11px, border-muted) on the right. Always active, always links to `/create`. No gating on club creation — any user can create unlimited clubs. Each new club starts on Free tier with its own independent limits.
- Single combined list of ALL clubs the user is in (owned + member + admin), sorted with owned clubs first, then by join date.
- Club rows (surface bg, border-muted, radius 12px, padding 12px 14px, card shadow):
  - Sunrise gradient thumbnail (40×40, rounded-lg, flame emoji centered).
  - Name (Bricolage 600, 14px). If owner: "Owner" badge (9px, primaryLight bg, primary text). If admin: "Admin" badge. If member: no badge.
  - Below name: city + member count (11px muted) + vibe badge + streak flame.
  - **Personal stats row** (10px, text-light): "12 runs · 86 km · 🍺 9 afters" — the member's individual stats with this club. Pulled from member_attendance_stats. Makes each club row feel personal.
  - **Right button depends on role**:
    - Owner/Admin: **"Manage →"** button (primaryLight bg, primary text, 12px 600, rounded-md). Links to `/dashboard/[slug]`.
    - Member: **"View →"** outlined button (surface bg, border-muted, 12px). Links to `/[slug]`.

### Waitlisted Section (only if user has waitlisted memberships)
- H2: "Waitlisted", Bricolage 700, 15px.
- Club rows with muted styling:
  - Faded thumbnail (surfaceAlt bg, 0.6 opacity flame).
  - Name + city/members + "Joined waitlist X days ago" (10px, text-light).
  - Right: **"Waitlisted"** amber badge (venueBg, venueText, 11px 600, rounded-md) + "Organizer notified" (9px, text-light) below.

### Post-auth default route
- After login, if no `?redirect=` param, users land here at `/my-clubs`.
- If the user has no memberships at all, show the empty state: "You haven't joined any clubs yet" → "Explore clubs →".

---

## 8. Dashboard (`/dashboard/[slug]/*`) — Authed, Owner/Admin

**Layout**: Sidebar (180px) + content area. Sidebar: surface bg, right border. All dashboard routes are scoped to a specific club via `[slug]`. Middleware verifies the user has owner/admin role for this club.

### Sidebar
- Club name label (10px, text-light, uppercase). Clicking the club name → links back to `/my-clubs`.
- **Tier badge** below club name:
  - Free tier: "Free plan" in text-muted (10px) + "Upgrade →" link in primary (10px, 600). Subtle but always visible.
  - Pro tier: "✨ Pro" badge (9px, primaryLight bg, primary text, fontWeight 600, rounded-md).
- Nav items: emoji icon + label (12px). Active: primaryLight bg, primary text, 600 weight.
- Items: 🏠 Overview, 📅 Events, 👥 Members, 📊 Analytics (with "PRO" badge if free tier — lock icon + muted text), ⚙️ Settings.
- All sidebar links go to `/dashboard/[slug]/[section]`.
- **Analytics on free tier**: the nav item is visible but muted with a lock icon. Clicking it shows a preview/teaser page (see below).

### Dashboard Overview (`/dashboard/[slug]`)

- **Member count progress bar** (free tier only, always shown at the very top):
  - Full-width card, surface bg, border-muted, radius 12px, padding 14px.
  - Left: "👥 [X] / 30 members" (Bricolage 700, 14px). Right: "Free plan" text-muted.
  - Progress bar below: 100% width track (surfaceAlt bg, 8px height, rounded-full). Fill: primary colour, width = `(memberCount / 30) * 100%`. Animated on load (CSS transition width 0.6s ease).
  - At 0–20 members (0–66%): fill is primary (#F43F5E). Bar label: "[X] of 30 members" (11px, text-muted).
  - At 21–27 members (67–90%): fill turns amber (#F59E0B). Label changes to: "Getting close! [X] of 30 members" (11px, amber).
  - At 28–30 members (90–100%): fill turns amber, pulsing gently (CSS animation). Label: "Almost full! Upgrade to unlock unlimited members →" (11px, primary, fontWeight 600, link to settings/billing).
  - At 30 members (100%): fill is full, amber, label: "🔒 Club is full — new members are being waitlisted. Upgrade to Pro →" (12px, primary, 600). "Upgrade to Pro" is a primary button inline on the right.
  - On Pro tier: this entire progress bar card is hidden. No member limit, no bar.

- **Waitlist banner** (only shown when waitlisted members exist, below the progress bar):
  - Coral-light bg (primaryLight), coral border, radius 12px, padding 14px.
  - "🙋 5 people are waiting to join your club" (14px, 600, primary color).
  - "Your club has reached the 30-member limit on the free plan." (12px, text-muted).
  - Two buttons side by side: "View waitlist" (outlined, small) + "Upgrade to Pro →" (primary, small, coral shadow).
  - Dismissable with an × button (reappears if more people join waitlist).

- **Pro upsell touchpoints** (free tier only — subtle but consistent):
  - Analytics nav item: lock icon + "PRO" badge.
  - Analytics teaser page (when free user clicks): show the stats grid with real numbers from their club but blur/lock the charts below. "Unlock full analytics with Pro →" CTA overlaying the blurred content. Show enough that they can see the VALUE of analytics, but not enough to use it. This is more compelling than a blank "upgrade" page.
  - Members tab: if approaching limit (25+), show a small banner below the member count: "You're close to the 30-member limit. Upgrade to Pro for unlimited members →" (11px, surfaceAlt bg, text-muted + primary link).
  - Settings > Custom branding: lock icon, "Upgrade to Pro" on the row.
  - Streak milestones on dashboard: show the insight card but with a lock: "🔒 Sarah hit a 20-week streak! Unlock streak insights with Pro →"
- **Post-event capture prompt** (amber gradient card, amber border):
  - "How did [event]'s run go?" (13px 600, dark amber).
  - Event details (11px, medium amber).
  - Two number inputs side by side: "Showed up" + "For afters" (styled amber, Bricolage 700).
  - "Save" button (amber bg, white text).
- **Stats grid**: 4 columns. Each: label (9px, text-light, uppercase) + value (20px, Bricolage 700, colored). Avg attendance (green), Show rate (purple), Afters rate (amber), Active members (text).
- **Club totals** (below stats grid, surface bg, border-muted, radius 12px, padding 14px):
  - Horizontal row of aggregate stats: "🏃 4,280 km together · 🎉 127 runs · 👥 89 runners · 🍺 2,340 afters"
  - Smaller text, Bricolage 600, 12px. These are the same stats from the public page but give the organizer pride in what they've built. If a distance milestone has been hit, show it: "🌍 That's London to Barcelona!"
- **Upcoming events** (next 3): vertical stack. First event gets sunrise accent bar (3px) and coral border. Each card: title (Bricolage 600, 13px) + date + RSVP count + afters venue badge + "Manage →" button. Below cards: "View all events →" full-width outlined button linking to events tab.
- **Quick actions**: two buttons side by side: "+ New event" (primary) + "Share club page" (outlined).

### Events Tab (`/dashboard/events`)
- Header: H2 + "New event" primary button (Plus icon).
- Event list: rows with title (Bricolage 600) + date (muted) + attendance ratio for completed + status badge (green "upcoming" or grey "completed") + more menu icon.

### Members Tab (`/dashboard/members`)
- Header: H2 with count + "Export CSV" outlined button (Download icon).
- Member rows: avatar + name (with "Admin" badge if applicable) + pace/events/show-rate stats (10px text-light) + status badge (active/new/at_risk/lapsed).

### Analytics Tab (`/dashboard/analytics`) — PRO
- H2: "Attendance Analytics".
- Stats grid: 4 columns with values + trend indicators (TrendUp green / TrendDown coral + percentage).
- **Attendance chart**: Recharts BarChart. Three bar series: RSVPs (border-muted fill), Actual (green), Afters (amber). CartesianGrid with border-muted stroke.
- **2-column grid below**:
  - Show Rate Trend: Recharts AreaChart. Purple stroke, purple fill at 0.15 opacity. Y-axis 50-100%.
  - Member Health: Recharts PieChart (donut). Active=green, At Risk=amber, Lapsed=red, New=purple. Legend beside.
- **Insight cards**: vertical stack. Each: emoji (14px) + text (11px, colored by type). Surface bg, border-muted, radius 8px.

### Settings Tab (`/dashboard/settings`)
- Clickable rows: "Club details", "Billing & subscription", "Custom branding", "Notifications". Each: surface bg, border-muted, radius 10px, ChevronRight on right.
- **Custom branding** (Pro only — free tier shows a lock icon + "Upgrade to Pro" on this row):
  - **Theme colour**: colour picker (hex input + visual swatch grid of 12 preset colours + custom hex input). Live preview showing a mini hero gradient with the selected colour. "Save" button. "Reset to default" text link to remove custom colour.
  - Preset palette: deep blue (#1E40AF), forest green (#166534), purple (#7C3AED), navy (#1E293B), burgundy (#991B1B), teal (#0F766E), slate (#334155), orange (#C2410C), indigo (#4338CA), emerald (#059669), rose (#BE123C), black (#18181B). All chosen to work well as gradients with white text.
  - Validation: must be a valid hex colour, must have sufficient contrast with white text (WCAG AA — minimum 4.5:1 contrast ratio). Reject colours that are too light (e.g. #FFFF00) with a message: "This colour is too light for white text to be readable."
- Danger zone: amber bg (#FEF3C7), amber border. "Deactivate club" — hides from explore, cancels upcoming events, preserves all data. Two-step inline confirmation. Reactivatable from settings. NOT a permanent delete.

---

## Animations

- `slideDown`: opacity 0→1, translateY -8px→0, max-height 0→200px. Duration 0.35s ease.
- `popIn`: opacity 0→1, scale 0.95→1. Duration 0.25s ease.
- Toggle switch: `transition: transform 0.2s ease` on the knob.
- Button hover: `transition: all 0.15s ease` on background/border changes.
- Card hover: border-color transition 0.15s.

---

## Responsive Design — Mobile First

### Strategy
Write all CSS mobile-first. The default (un-breakpointed) styles are mobile. Use `md:` (768px) Tailwind prefix for desktop overrides. No tablet breakpoint — tablets get the desktop layout.

### Breakpoints
- **Mobile** (default, <768px): single column, full-width content, touch-optimized tap targets (min 44px)
- **Desktop** (`md:`, ≥768px): wider layouts, multi-column grids, sidebar on dashboard

### Navbar — Mobile vs Desktop

**Mobile (<768px)**:
- Height: ~50px. Flame logo + brand name on the left.
- Right: avatar circle (if logged in) + hamburger icon (☰).
- Hamburger opens a full-screen overlay (surface bg, slide in from right, 0.2s ease): "Explore", "My Clubs" (if logged in), "Log in" (if logged out), "Start a club" button. Close × top-right.
- No bottom tab bar — keep the bottom of the screen free for RSVP buttons and content.

**Desktop (≥768px)**:
- Horizontal nav as currently specced: logo left, links + avatar right. No hamburger.

### Page-by-Page Mobile Adaptations

**Landing page**:
- Hero: full-width, single column. Headline wraps naturally. Two CTA buttons stack vertically (full-width each) instead of side-by-side.
- Social proof: horizontal scroll or wrap.
- Featured clubs: single column stack (already specced this way).
- How it works: 3-column grid → single column vertical stack on mobile.
- Organizer section, pricing: single column. Pricing cards stack vertically, Pro card on top.
- Final dual CTA: stack vertically.

**Explore page**:
- Filter bar: horizontal scroll if pills overflow. Vibe and Afters filters on same row, scrollable.
- Club cards: full-width, single column stack (already specced).
- Map: full-width, 200px height on mobile (expandable with "Show map" toggle). Hidden by default to save space — list view is primary on mobile.

**Club page** (`/[slug]`):
- Already mobile-first in design. No changes needed — the mockup IS the mobile view.
- On desktop: content gets a max-width container (640px) centered on the page with whitespace on sides.

**Event detail page**:
- Key info grid: 2 columns → 1 column vertical stack on mobile.
- Pace groups: full-width, vertical stack (already specced).
- RSVP section: full-width (already specced).
- On desktop: max-width container like club page.

**Auth page**:
- Already mobile-first (centered card, max-width 340px). No changes.

**My Clubs page**:
- Overall streak badge: moves below the subtitle instead of inline-right on mobile.
- Event cards: full-width stack (already specced).
- Club rows: full-width stack (already specced). "Manage →" / "View →" buttons may wrap below the club info on very narrow screens.

**Dashboard** (`/dashboard/[slug]`):
- **Mobile**: sidebar disappears entirely. Replaced by a **horizontal scrollable tab strip** at the top of the page (below the club name header): 🏠 Overview · 📅 Events · 👥 Members · 📊 Analytics · ⚙️ Settings. Active tab has primary color + underline (2px). Tabs scroll horizontally if they overflow.
- Club name header: full-width, with "← My Clubs" back link on the left.
- Stats grid: 4 columns → 2×2 grid on mobile.
- Analytics charts: 2-column grid → single column stack on mobile.
- **Desktop**: sidebar + content area as specced.

**Create event form**:
- Already designed as single-column form. No changes.
- Date + time side-by-side → stack vertically on mobile if needed.
- Distance + unit side-by-side → stack vertically on mobile if needed.

### Touch Targets
- All interactive elements (buttons, links, toggles, cards) must have a minimum tap target of **44×44px** (Apple HIG guideline).
- RSVP buttons, nav items, and filter pills should be comfortably tappable with a thumb.
- Small text links (like "Undo", "View all →") should have padding extending the tap area beyond the visible text.

### Mobile-Specific Patterns
- **Sticky RSVP bar**: on the event detail page (mobile only), if the user scrolls past the RSVP section, show a sticky bar at the bottom of the screen (56px height, surface bg, border-top, shadow). Contains: "I'm in! 🏃" (flex:2, primary bg) + "Maybe" (flex:1, outlined). Disappears when RSVP section is in viewport or after the user RSVPs. Ensures the primary action is always reachable.
- **Pull to refresh**: not needed for MVP — standard browser refresh is fine.
- **Swipe gestures**: not needed for MVP. All actions are taps.
- **Safe areas**: respect `env(safe-area-inset-bottom)` on iOS for any sticky bottom elements (RSVP bar).

### Tailwind Implementation
```
// Example: stats grid mobile vs desktop
<div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">

// Example: dashboard sidebar → mobile tabs
<aside className="hidden md:block md:w-[180px]">  // sidebar desktop only
<nav className="flex md:hidden overflow-x-auto">    // tabs mobile only

// Example: 2-col → 1-col
<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
```

All styles are mobile-first: write the mobile version as default classes, add `md:` prefix only for desktop overrides. NEVER write desktop-first and then override with `sm:` or mobile-specific classes.

---

## Empty State Design Pattern

All empty states follow the same layout: centered in the available space, vertical stack.

```
[emoji icon — 28px, centered]
[message — 14px, font-weight 600, text color]
[subtitle — 12px, text-muted, max-width 280px, centered]
[CTA button — primary or outlined, 12px font-weight 600]
```

Background: transparent (inherits page bg). No card wrapper — just floating centered content.
CTA button: primary style for positive actions ("Join", "Create event"), outlined for neutral ("Clear filters", "Explore clubs").

If the empty state is contextual to the organizer (e.g., no events on their own club page), show a different message than what a visitor sees. Use the auth context to determine which message to display.

---

## Club Creation Onboarding Design

Multi-step wizard. Each step is a full screen within a centered card (max-width 440px). Auth happens at step 6 — after the user has invested in naming and configuring their club. Steps 1-5 store data in React state (no DB writes until after auth).

### Shared Shell
- Progress bar at top: thin (3px), primary color fill, width = (currentStep / totalSteps) * 100%.
- Back button: top-left, text-muted, "← Back". Hidden on step 1.
- Step counter: top-right, text-light, "Step X of 8".

### Step Screens
1. **Name your club**: H2 "What's your club called?". Large text input (18px, Bricolage 700). Below: slug preview in text-light "yourdomain.com/[auto-slug]" — auto-generated as they type (live). Small "Edit" link next to the slug to make it editable. Validation on the slug: 3–60 chars, lowercase alphanumeric + hyphens, unique (async check on blur — show ✓ or "already taken" inline). Slug is **locked permanently after creation** — they can't change it later. Show a subtle note: "This is your club's permanent URL." Check against reserved slugs list. "Next →" primary button.
2. **Where are you based?**: H2 "Where are you based?". City search input with autocomplete dropdown. Map preview below showing pin on selected city (or placeholder).
3. **What's your vibe?**: H2 "What's your vibe?". Three large selectable cards (full-width, stacked):
   - 🏆 Competitive — "PBs, intervals, race training"
   - 🤝 Social — "All paces, community-first, fun"
   - 😎 Casual — "Easy going, no pressure, beginners welcome"
   - Selected: primaryLight bg, primary border, check icon.
4. **Afters**: H2 "Where do you go for afters?". Four selectable cards:
   - 🍺 Pub, ☕ Café, 🥐 Brunch, 🚫 We don't do afters
   - If venue type selected: text input below "What's your usual spot?" (optional, placeholder "e.g. The Crown & Anchor").
   - Cards use amber palette when selected (venueBg + venueText).
5. **Instagram**: H2 "Link your Instagram" (optional). Input with "@" shown as a fixed prefix (text-muted). Placeholder "yourclub". Hint: "Members can follow you for updates between runs." Validation: alphanumeric + periods + underscores, max 30 chars. "Skip for now →" text link. If filled, shows a preview: Instagram icon + "@[handle]" in primary color.
6. **Create an account**: H2 "Almost there!" with subtitle "Create an account to publish your club." Same auth form as `/login` — email-first, handles both login and registration (existing user sees password field, new user sees name + password). Magic link option available. **If already logged in: auto-skip this step entirely** — progress bar jumps, user goes straight from step 5 to step 7. After auth completes: Server Action fires, creates the community + owner membership using all data from steps 1-5.
7. **Cover photo**: H2 "Add a cover photo". Upload dropzone (dashed border, centered camera icon + "Drag or click to upload"). "Skip for now →" text link below. Preview of uploaded image. (After auth because upload needs user ID for storage path.)
8. **Success**: Confetti animation (CSS or library). H1 "Your club is live! 🎉" (Bricolage 800, 26px). Preview of their club page card (mini version). Two CTAs: "Share your club page" (primary button, copy link) + "Create your first event →" (outlined button).

---

## Logged-Out Interaction Patterns

### RSVP / Join buttons when not logged in
Show the buttons normally (don't hide or grey them out). On click:
1. Store the intended action in URL params: `/login?redirect=/[slug]&action=join` or `/login?redirect=/[slug]/events/[id]&action=rsvp`
2. After auth completes, read the params and auto-execute the action. For `action=rsvp`: auto-join the club AND create the RSVP in one step (the user never sees a separate "join" step).
3. Show a success toast: "You've joined [Club Name] and RSVP'd for [Event]! 🎉"

### Auto-join on RSVP (logged-in, not a member)
If a logged-in user clicks "I'm in!" on an event but isn't a member of the club:
- The Server Action auto-joins them + creates the RSVP in one transaction.
- Toast: "You've joined [Club Name] and RSVP'd for [Event]! 🎉"
- No "you must join first" blocker. No extra step.
- **Member cap exception**: if the club is full (free tier, 30 members), show the waitlist flow instead. The RSVP button is not available while waitlisted.

### Visual hint for logged-out users
- Below RSVP button: small text "Sign up to RSVP — takes 10 seconds" in text-light. Only show when user is not authenticated.
- Below Join button: "Free to join · No app download needed" in text-light.

### Shared event/club links
When someone shares a link on WhatsApp/iMessage/social media, the OG image and preview text should be compelling enough to click. The page they land on should be fully readable and the CTA should be clear without requiring any context about the platform.

---

## User Flow Interaction Patterns

### Global Pattern: Toast + Undo (No Confirmation Dialogs)

All non-destructive actions follow this pattern:
1. User clicks action → action executes immediately
2. Toast appears at bottom-center: dark bg (#166534 success, #991B1B danger, #78350F info), white text, 13px, rounded-xl, strong shadow
3. Toast includes "Undo" button (white bg at 0.2 opacity, rounded-md) for reversible actions
4. Toast auto-dismisses after 3 seconds
5. Animation: slide up from bottom with opacity fade (`toastIn 0.3s ease`)

**Exception — destructive actions** (cancel event, deactivate club, delete account): Use inline two-step confirmation within a danger zone card. Never use browser confirm() dialogs or modal popups.

---

## 9. Edit / Cancel Event (`/dashboard/events/[id]/edit`)

**Layout**: Dashboard shell. Same form layout as Create Event but pre-populated.

### Edit Mode
- All fields from Create Event form, pre-filled with current values.
- Same 4 sections: Event details, Route & meeting point, Pace groups, Afters.
- Two action buttons: "Save changes" (primary, flex:2) + "Discard" (outlined, flex:1).
- On save: toast "Event updated! Members will see the changes." with undo.
- No live preview needed (unlike create — they've already seen it).

### Cancel Event — Danger Zone
- Below the edit form. Red card: dangerLight bg (#FEF2F2), red border (#FECACA), radius 12px.
- Left: "Cancel this event" title (13px, danger, 600) + "Members who RSVP'd will be notified" subtitle (11px, dark red).
- Right: "Cancel event" button (white bg, red border, red text).
- **On click**: button transforms into a small inline form: optional text input "Reason (optional)" (placeholder "e.g. Severe weather forecast") + two buttons: "Yes, cancel it" (danger bg, white text) + "Never mind" (white bg, muted text). No modal.
- **On confirm**: entire page replaces with confirmation screen: 🚫 emoji (32px) + "Event cancelled" (16px, Bricolage 700) + "[X] members who RSVP'd will be notified by email" (13px, muted) + "Back to events" outlined button. Cancellation email fires immediately to all RSVP'd members with the reason (if provided).
- Toast: "Event cancelled. Members notified." (type: danger). No undo — cancellation emails have already been sent.

---

## 10. Change RSVP (Event Detail Page — already RSVP'd)

**Location**: Replaces the initial RSVP section on the event detail page when user has already RSVP'd.

### Current Status Display
- Green confirmation card (same as initial RSVP confirmation): check icon + current status message.
- Status messages: "Going + staying for afters 🎉" / "Going — just the run 🏃" / "Maybe"

### Change Options
- Label: "Change your response" (11px, text-light, uppercase).
- Three buttons side by side: "Going + afters 🍺" / "Just the run 🏃" / "Maybe".
- Active button: primary bg (for going options) or amber bg (for maybe). Inactive: surface bg, muted border.
- Tap to switch — instant, no confirmation. Toast with undo.

### Withdraw RSVP
- Below the buttons: "Withdraw RSVP" as underlined text link (12px, text-light). Not a button — it's a secondary action.
- On click: instant withdrawal. Toast "RSVP withdrawn" with undo. RSVP section reverts to the initial "I'm in! / Maybe" state.

---

## 11. Edit Club Details (`/dashboard/settings/details`)

**Layout**: Dashboard shell. Single-column form.

### Fields
- **Club name** (required): text input, pre-filled.
- **Slug**: displayed as read-only text (not an editable input). Shows full URL: "yourdomain.com/[slug]". Small text-light note: "Your club URL can't be changed." No edit button.
- **City** (required): text input, pre-filled.
- **Description**: textarea, 3 rows, pre-filled.
- **Vibe**: three selectable cards (Competitive/Social/Casual). Same style as onboarding step 4. Active: primaryLight bg, primary border.
- **Default afters type**: four selectable cards (🍺 Pub / ☕ Café / 🥐 Brunch / 🚫 None). Active: venueBg, amber border.
- **Cover photo**: current photo displayed in a rounded container (100px height, full width) with "Change photo" button overlay.

### Actions
- "Save changes" full-width primary button.
- Toast: "Club details updated!" on save.

---

## 12. Invite Admin (`/dashboard/settings/team`)

**Layout**: Dashboard shell.

### Current Team List
- Label: "Current team" (11px, text-light, uppercase).
- Each member row: avatar (32px) + name + "(you)" label if current user + email (11px, text-light) + role badge (Owner: primaryLight bg / Admin: surfaceAlt bg) + "Remove" underlined link (only on admins, not owner).
- Remove is instant + toast with undo: "Tom removed as admin."

### Invite Form
- Card (surface bg, border-muted, radius 12px, padding 16px).
- Title: "Invite a new admin" (13px, 600).
- Description: "Admins can create/edit events, manage members, and view analytics. They can't change billing or delete the club." (11px, muted).
- Input + button row: email input (flex:1) + "Send invite" primary button.
- On send: toast "Invite sent! They'll receive an email to accept."
- The invited user receives an email with a link to accept the admin role.

---

## 13. Change Pace Group (Event Detail Page)

**Location**: Pace group section on event detail page when user has already RSVP'd and selected a group.

### Behavior
- Same selectable cards as initial pace group selection.
- Already-selected group shows check mark and primary border.
- Tap a different group → instant switch. Toast: "Pace group changed to [group name]" with undo.
- Runner count on each card updates (previous group decrements, new group increments).
- No separate "edit" mode — the cards are always tappable when you've RSVP'd.

---

## 14. Export Members (`/dashboard/members`)

**Location**: Top-right of the members page.

### Filter Bar
- Horizontal pill buttons: All / Active / At risk / Lapsed / New.
- Active filter: primaryLight bg, primary text, primary border. Others: surface bg, muted.
- Filtering updates the member list below in real-time.

### Export Button
- Outlined button: "⬇ Export CSV" (12px, 600, surface bg, border-muted).
- On click: button text changes to "⏳ Exporting..." with reduced opacity (1–2 second delay).
- On complete: green success card appears below the list (F0FDF4 bg, BBF7D0 border, radius 10px):
  - "✓ Export ready" (13px, 600, green).
  - "74 members exported with: name, email, join date, events attended, show rate, pace, status" (12px, green).
  - "Download CSV" green button.
- Export respects current filters — if "At risk" is selected, only at-risk members are exported.

---

## 15. Duplicate Event (Dashboard Events List)

**Location**: Context menu on each event row in `/dashboard/events`.

### Context Menu
- Triggered by "⋯" (more) icon on each event row.
- Dropdown: "✏️ Edit event" / "📋 Duplicate" / "🚫 Cancel event" (red text).
- Menu: surface bg, border-muted, radius 10px, shadow (0 4px 16px rgba(0,0,0,0.1)), padding 4px.

### Duplicate Flow
- On click "Duplicate": instant action. Creates a draft copy with all fields pre-filled except date (cleared — organizer must set a new date).
- Green success card appears: "✓ Event duplicated" + "A draft copy of '[event name]' was created. Edit the date and publish when ready." + "Edit draft →" primary button.
- Toast: "Event duplicated as draft" with undo.
- Clicking "Edit draft →" goes to the edit event form with the draft.

---

## 16. Edit Profile (`/profile` or `/settings/profile`)

**Layout**: Simple single-column, no dashboard sidebar. Accessible from avatar dropdown in navbar.

### Avatar Section
- Current avatar (56px circle, primaryBg with initials if no photo) + "Change photo" outlined button + "JPG or PNG, max 2MB" hint.

### Profile Fields
- **Name** (required): text input.
- **Email**: text input. Hint: "Used for login and notifications".
- **Default pace preference**: four selectable pill buttons (< 5:00/km / 5:00–6:00/km / 6:00+/km / No preference). Active: primaryLight bg, primary border. Hint: "Auto-selects your pace group when you RSVP to events. You can always change it per event."

### Actions
- "Save profile" full-width primary button. Toast: "Profile updated!"

### Account Section
- Below profile, inside a surfaceAlt card with border-muted.
- Title: "Account" (13px, 600).
- Three stacked buttons (full-width, surface bg, border-muted, radius 8px, left-aligned text):
  - "Change password"
  - "Notification preferences"
  - "Delete account" (dangerLight bg, red border, red text)
- Delete account flow:
  - Two-step inline confirmation (same pattern as cancel event).
  - **If user owns any clubs**: show a blocker instead of the confirmation: "You own [X] clubs. Transfer ownership or deactivate them before deleting your account." with a link to each club's settings. The delete button is disabled until all clubs are handled.
  - **If no owned clubs**: confirm → "Your account will be permanently deleted. Your name will be replaced with 'Deleted User' across the platform. Your club memberships will be removed. This cannot be undone."
  - On confirm: anonymise user data, delete memberships, delete auth record, delete avatar. RSVP records stay with anonymised user for club analytics.

---

## 17. Leave Club (Club Page or My Clubs)

**Location**: Two places — a "Leave club" link on the club public page (only visible to members, below the member list) and on the My Clubs page (context menu or subtle link on each club card).

### Flow
- "Leave club" text link (12px, text-light, underlined). Not a button — it's a low-priority action.
- On click: instant removal. Toast: "You've left [Club Name]" with **undo** button.
- Undo re-adds the membership with the same join date and attendance history preserved.
- Server Action: `delete from memberships where user_id = $1 and community_id = $2`. On undo: re-insert the record.
- The user's RSVPs for future events in that club are also removed (cascade or explicit delete in the Server Action).
- Owners cannot leave their own club — the "Leave" link is hidden for owners. They must transfer ownership or delete the club.

