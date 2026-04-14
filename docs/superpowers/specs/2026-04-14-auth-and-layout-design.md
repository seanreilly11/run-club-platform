# Auth System & App Layout — Design Spec

**Date:** 2026-04-14
**Scope:** Supabase Auth (email/password + magic link), proxy session refresh, public layout with navbar, dashboard layout with sidebar, login/signup page.

---

## Approach

Option A: proxy.ts refreshes Supabase session cookies only. No redirects in proxy. All auth checks happen in route layouts (Server Components) where DB access is available.

Reason: follows Next.js 16 guidance ("avoid DB checks in Proxy"), keeps security close to the data, avoids optimistic-check false negatives.

---

## File Structure

```
proxy.ts                              ← session refresh only (root, not src/)
app/
  layout.tsx                          ← root layout (fonts, globals.css) — exists
  (public)/
    layout.tsx                        ← wraps public pages with Navbar
    page.tsx                          ← landing placeholder
  (auth)/
    layout.tsx                        ← clean centered layout, no navbar
    login/
      page.tsx                        ← /login SSR shell (Server Component)
    callback/
      route.ts                        ← /auth/callback magic link handler
  dashboard/
    layout.tsx                        ← auth check + community slug resolution
    [slug]/
      layout.tsx                      ← role check (owner/admin only)
      page.tsx                        ← overview placeholder
  (member)/
    layout.tsx                        ← auth check layout (getAuthUser → redirect /login)
    my-clubs/
      page.tsx                        ← /my-clubs placeholder (authed)
src/
  components/
    navbar.tsx                        ← Server Component, reads auth state
    navbar-actions.tsx                ← "use client" — avatar dropdown + mobile hamburger
    dashboard-sidebar.tsx             ← Server Component
    dashboard-mobile-tabs.tsx         ← "use client" — horizontal scrollable tabs
  lib/
    supabase/
      proxy.ts                        ← updateSession helper (used by proxy.ts)
    actions/
      auth.ts                         ← checkEmail, signIn, signUp, sendMagicLink, signOut
    validations/
      auth.ts                         ← Zod: emailSchema, signInSchema, signUpSchema
  components/ui/
    auth-form.tsx                     ← "use client" — RHF multi-step login form
```

---

## proxy.ts

Root-level `proxy.ts` (Next.js 16 — `middleware.ts` is deprecated).

```ts
import { updateSession } from '@/lib/supabase/proxy'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

`src/lib/supabase/proxy.ts` creates a Supabase server client using `createServerClient` from `@supabase/ssr`, forwards cookies from the request, and returns a response with refreshed session cookies. No redirects.

---

## Auth Callback

`app/(auth)/callback/route.ts` — GET handler.

1. Read `code` query param.
2. Call `supabase.auth.exchangeCodeForSession(code)`.
3. Read `next` query param (the `redirect` value encoded by `/login`).
4. Redirect to `next` or `/my-clubs`.

This is the URL Supabase sends in magic link emails. Must be registered in Supabase dashboard as an allowed redirect URL.

---

## Server Actions (`src/lib/actions/auth.ts`)

All return `ActionResult<T>`. Auth order in each action: validate → call Supabase → handle error.

| Action | Supabase call | Notes |
|---|---|---|
| `checkEmail(email)` | `signInWithPassword` with dummy password to detect user existence | Returns `{ exists: boolean }` |
| `signIn(email, password)` | `signInWithPassword` | On success: `revalidatePath('/')` + `redirect(redirectTo)` |
| `signUp(email, password, name)` | `signUp` | After auth: insert row into `users` table with name. Redirect to `/my-clubs` or `redirectTo`. |
| `sendMagicLink(email)` | `signInWithOtp` with `emailRedirectTo: /auth/callback?next=...` | Works for both new + existing users |
| `signOut()` | `signOut` | Then `redirect('/login')` |

**Note on `checkEmail`:** Supabase doesn't have a "does this email exist" endpoint. Safe pattern: attempt `signInWithPassword` with a known-wrong password. If error is `Invalid login credentials` → user exists. If error is `Email not confirmed` → user exists (unverified). If error contains `user not found` → new user. This avoids user enumeration concerns since it's used only for UX (showing name field), not for access control.

---

## Zod Schemas (`src/lib/validations/auth.ts`)

```ts
emailSchema       = z.object({ email: z.string().email() })
signInSchema      = z.object({ email: z.string().email(), password: z.string().min(1) })
signUpSchema      = z.object({
  email:    z.string().email(),
  name:     z.string().min(2).max(50),
  password: z.string().min(8),
})
magicLinkSchema   = z.object({ email: z.string().email() })
```

---

## Login Page (`app/(auth)/login/page.tsx`)

Server Component shell. Reads `?redirect=` and `?action=` search params, passes as props to `<AuthForm>`.

`src/components/ui/auth-form.tsx` — `"use client"`. RHF with Zod resolver. Three states:

1. **Email step**: email input + "Continue" button + "Send magic link" outlined button.
2. **Existing user**: email (static) + password input + "Log in" + "Forgot password?" link.
3. **New user**: email (static) + name input + password input + "Create account" button + terms text.

State transitions triggered by `checkEmail` Server Action response. Animations: `slideDown` on new fields appearing.

On success: Server Action returns redirect target; form calls `router.push(redirectTarget)`.

---

## Navbar (`src/components/navbar.tsx`)

Server Component. Calls `getAuthUser()`. Passes `user` to `<NavbarActions>`.

- Height ~45px, `bg-white border-b border-border-muted`
- Left: `<Link href="/">` with Flame icon (coral bg, 26×26, rounded-md) + "RunClub" Bricolage 700
- Right desktop (logged out): Explore · Log in · "Start a club" primary button
- Right desktop (logged in): Explore · My Clubs · `<NavbarActions user={user}>`

`src/components/navbar-actions.tsx` — `"use client"`:
- Desktop: avatar circle (initials, coral bg) → dropdown: Profile + Sign out
- Mobile: avatar (if logged in) + `☰` → full-screen overlay slide-in from right

Active link detection: small `<NavLink>` client component using `usePathname()`.

---

## Public Layout (`app/(public)/layout.tsx`)

```tsx
export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
```

---

## Auth Layout (`app/(auth)/layout.tsx`)

No navbar. Clean centered page:

```tsx
export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </main>
  )
}
```

---

## Dashboard Layout (`app/dashboard/layout.tsx`)

Server Component:
1. `getAuthUser()` → null → `redirect('/login?redirect=' + encodedPath)`
2. Extract `slug` from params
3. Query `memberships` for `(userId, communitySlug)` with role in `['owner', 'admin']`
4. Not found → `redirect('/my-clubs')`
5. Fetch community row for sidebar display
6. Render dashboard shell

Shell:
```tsx
<div className="flex min-h-screen">
  <aside className="hidden md:flex md:w-[180px] flex-col border-r border-border-muted bg-surface">
    <DashboardSidebar community={community} userRole={role} currentPath={pathname} />
  </aside>
  <main className="flex-1 overflow-auto">
    <DashboardMobileTabs slug={slug} currentPath={pathname} className="md:hidden" />
    {children}
  </main>
</div>
```

---

## Dashboard Sidebar (`src/components/dashboard-sidebar.tsx`)

Server Component. Receives `{ community, userRole, currentPath }`.

```
[club name — 10px text-light uppercase, links to /my-clubs]
[tier badge — "Free plan" + "Upgrade →" | "✨ Pro"]
────────────────────────
🏠 Overview       → /dashboard/[slug]
📅 Events         → /dashboard/[slug]/events
👥 Members        → /dashboard/[slug]/members
📊 Analytics      → /dashboard/[slug]/analytics  (locked if free)
⚙️ Settings       → /dashboard/[slug]/settings
```

Active item: `bg-surface-alt text-primary font-semibold rounded-md`.
Analytics on free tier: muted text + lock icon. Clickable — leads to upgrade teaser page.

---

## Dashboard Mobile Tabs (`src/components/dashboard-mobile-tabs.tsx`)

`"use client"`. `flex overflow-x-auto` strip. Same 5 items. Active: primary color + 2px bottom border. Uses `usePathname()` for active detection.

---

## Error Handling

- `checkEmail` failure: show generic "Something went wrong" inline error. Don't expose Supabase error messages.
- `signIn` failure: "Invalid email or password" — never "user not found" (avoids enumeration).
- `signUp` failure: field-level errors via `ActionResult.field`.
- Magic link sent: replace form with success message "Check your inbox ✉️".
- Auth callback error (`?error=` param): redirect to `/login?error=link_expired`.

---

## Testing

**Tier 1 (must have):**
- `auth.ts` actions: unauthenticated rejection, validation rejection, success case
- `checkEmail`: returns correct `exists` flag for known states
- Dashboard layout: redirects unauthenticated users, redirects non-admin users

**Tier 2:**
- `AuthForm` component: email step renders, transitions to existing/new user correctly, calls actions on submit
- Navbar: renders correct links for logged-in vs logged-out state

**Tier 3 (E2E):**
- Full email/password sign-up flow
- Magic link flow (requires Supabase test setup)
- Dashboard access protection

---

## Out of Scope

- Password reset flow (Supabase handles email; UI is a future task)
- OAuth / social login
- MFA
- Onboarding wizard (separate feature)
