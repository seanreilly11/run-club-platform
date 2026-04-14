# Auth System & App Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Supabase Auth (email/password + magic link), session proxy, public navbar layout, dashboard sidebar layout, and the /login page.

**Architecture:** `proxy.ts` at project root refreshes Supabase session cookies only — no redirects. Auth checks live in route layouts as Server Components. Dashboard layout queries the DB to verify owner/admin role. Login page uses a multi-step `"use client"` RHF form that calls Server Actions.

**Tech Stack:** Next.js 16 App Router, Supabase Auth (`@supabase/ssr`), Drizzle ORM, React Hook Form v7 + `@hookform/resolvers` v5 (zodResolver), Zod v4, `@base-ui/react`, Tailwind CSS, Lucide React, Vitest + React Testing Library.

---

## Important: Next.js 16 Changes

- Route layouts receive `params` as `Promise<{...}>` — always `await params`.
- Middleware is renamed to **Proxy**. File is `proxy.ts` at project root (same level as `app/`).
- `"use server"` functions use Server Functions API, called from Client Components.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `proxy.ts` | Create | Session refresh — calls `updateSession`, no redirects |
| `src/lib/supabase/proxy.ts` | Create | `updateSession(request)` helper for proxy.ts |
| `src/lib/supabase/server.ts` | Modify | Add `createAdminClient()` for service-role operations |
| `src/lib/validations/auth.ts` | Create | Zod schemas: emailSchema, signInSchema, signUpSchema, magicLinkSchema |
| `src/lib/actions/auth.ts` | Create | Server Actions: checkEmail, signIn, signUp, sendMagicLink, signOut |
| `src/lib/actions/auth.test.ts` | Create | Unit tests for all auth actions |
| `app/(auth)/layout.tsx` | Create | Clean centered layout — no navbar |
| `app/(auth)/callback/route.ts` | Create | Magic link exchange + redirect handler |
| `app/(auth)/login/page.tsx` | Create | SSR shell — reads ?redirect= param, renders AuthForm |
| `src/components/ui/input.tsx` | Create | Input component using `@base-ui/react/input` |
| `src/components/ui/auth-form.tsx` | Create | `"use client"` multi-step RHF login/signup form |
| `src/components/ui/auth-form.test.tsx` | Create | RTL tests for AuthForm |
| `src/components/nav-link.tsx` | Create | `"use client"` active-link wrapper using usePathname |
| `src/components/navbar-actions.tsx` | Create | `"use client"` avatar dropdown + mobile hamburger |
| `src/components/navbar.tsx` | Create | Server Component navbar — reads auth state |
| `src/components/navbar.test.tsx` | Create | RTL tests for navbar |
| `app/(public)/layout.tsx` | Create | Public layout: `<Navbar>` + `{children}` |
| `app/(public)/page.tsx` | Create | Landing page placeholder (replaces root `app/page.tsx`) |
| `app/(member)/layout.tsx` | Create | Auth-check layout for /my-clubs |
| `app/(member)/my-clubs/page.tsx` | Create | /my-clubs placeholder |
| `src/lib/db/queries/memberships.ts` | Create | `getUserMembership(userId, communitySlug)` query |
| `src/components/dashboard-sidebar.tsx` | Create | Server Component sidebar |
| `src/components/dashboard-mobile-tabs.tsx` | Create | `"use client"` horizontal tab strip |
| `app/dashboard/layout.tsx` | Create | Dashboard auth + role check layout |
| `app/dashboard/[slug]/page.tsx` | Create | Dashboard overview placeholder |
| `app/page.tsx` | Delete | Replaced by `app/(public)/page.tsx` |

---

## Task 1: Supabase proxy helper + root proxy.ts

**Files:**
- Create: `src/lib/supabase/proxy.ts`
- Create: `proxy.ts`

- [ ] **Step 1: Create `src/lib/supabase/proxy.ts`**

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — do NOT add redirects here.
  // Auth checks belong in route layouts.
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

- [ ] **Step 2: Create `proxy.ts` at project root**

```typescript
import { updateSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 3: Verify proxy.ts compiles**

```bash
cd c:/Users/seanr/projects/run-club-platform && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add proxy.ts src/lib/supabase/proxy.ts
git commit -m "feat: add supabase session refresh proxy"
```

---

## Task 2: Admin client + auth Zod schemas

**Files:**
- Modify: `src/lib/supabase/server.ts`
- Create: `src/lib/validations/auth.ts`

- [ ] **Step 1: Add `createAdminClient` to `src/lib/supabase/server.ts`**

Append after the existing `getAuthUser` export:

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS.
 * Use ONLY in Server Actions and API routes. NEVER in Client Components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
```

- [ ] **Step 2: Create `src/lib/validations/auth.ts`**

```typescript
import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
```

- [ ] **Step 3: Verify schemas compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/validations/auth.ts
git commit -m "feat: add admin supabase client and auth zod schemas"
```

---

## Task 3: Auth Server Actions (TDD)

**Files:**
- Create: `src/lib/actions/auth.test.ts`
- Create: `src/lib/actions/auth.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/actions/auth.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation before importing actions
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock the supabase server client factory
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
  createAdminClient: vi.fn(),
}));

// Mock drizzle db
vi.mock("@/lib/db", () => ({
  db: { insert: vi.fn() },
}));

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { checkEmail, signIn, signUp, sendMagicLink, signOut } from "./auth";

const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithOtp = vi.fn();
const mockSignOut = vi.fn();
const mockGetUserByEmail = vi.fn();

function makeSupabaseClient() {
  return {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOtp: mockSignInWithOtp,
      signOut: mockSignOut,
    },
  };
}

function makeAdminClient() {
  return {
    auth: {
      admin: {
        getUserByEmail: mockGetUserByEmail,
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createClient).mockResolvedValue(makeSupabaseClient() as never);
  vi.mocked(createAdminClient).mockReturnValue(makeAdminClient() as never);
});

// ─── checkEmail ────────────────────────────────────────────────────────────────

describe("checkEmail", () => {
  it("returns success false on invalid email", async () => {
    const result = await checkEmail({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("returns exists:true when admin API finds user", async () => {
    mockGetUserByEmail.mockResolvedValue({
      data: { user: { id: "user-1", email: "test@test.com" } },
      error: null,
    });
    const result = await checkEmail({ email: "test@test.com" });
    expect(result).toEqual({ success: true, data: { exists: true } });
  });

  it("returns exists:false when admin API finds no user", async () => {
    mockGetUserByEmail.mockResolvedValue({
      data: { user: null },
      error: { message: "User not found" },
    });
    const result = await checkEmail({ email: "new@test.com" });
    expect(result).toEqual({ success: true, data: { exists: false } });
  });
});

// ─── signIn ────────────────────────────────────────────────────────────────────

describe("signIn", () => {
  it("returns success false on invalid input", async () => {
    const result = await signIn({ email: "bad", password: "" });
    expect(result.success).toBe(false);
  });

  it("returns error on wrong credentials", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });
    const result = await signIn({
      email: "test@test.com",
      password: "wrongpass",
    });
    expect(result).toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });

  it("redirects on successful sign in", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    await signIn({ email: "test@test.com", password: "correct", redirectTo: "/my-clubs" });
    expect(redirect).toHaveBeenCalledWith("/my-clubs");
  });
});

// ─── signUp ────────────────────────────────────────────────────────────────────

describe("signUp", () => {
  it("returns success false on invalid input (short name)", async () => {
    const result = await signUp({
      email: "test@test.com",
      name: "A",
      password: "password123",
    });
    expect(result.success).toBe(false);
    expect(result).toMatchObject({ field: "name" });
  });

  it("returns success false on short password", async () => {
    const result = await signUp({
      email: "test@test.com",
      name: "Alice",
      password: "short",
    });
    expect(result.success).toBe(false);
    expect(result).toMatchObject({ field: "password" });
  });

  it("returns error when supabase signup fails", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    });
    const result = await signUp({
      email: "taken@test.com",
      name: "Alice",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

// ─── sendMagicLink ─────────────────────────────────────────────────────────────

describe("sendMagicLink", () => {
  it("returns success false on invalid email", async () => {
    const result = await sendMagicLink({ email: "not-valid" });
    expect(result.success).toBe(false);
  });

  it("returns success true on valid email", async () => {
    mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });
    const result = await sendMagicLink({ email: "user@test.com" });
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("returns error when supabase fails", async () => {
    mockSignInWithOtp.mockResolvedValue({
      data: {},
      error: { message: "Rate limit exceeded" },
    });
    const result = await sendMagicLink({ email: "user@test.com" });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd c:/Users/seanr/projects/run-club-platform && npx vitest run src/lib/actions/auth.test.ts
```

Expected: all tests fail with "Cannot find module './auth'" or similar import errors.

- [ ] **Step 3: Create `src/lib/actions/auth.ts`**

```typescript
"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  emailSchema,
  signInSchema,
  signUpSchema,
  magicLinkSchema,
} from "@/lib/validations/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { ActionResult } from "@/types/actions";

// ─── checkEmail ───────────────────────────────────────────────────────────────

export async function checkEmail(
  input: unknown,
): Promise<ActionResult<{ exists: boolean }>> {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserByEmail(parsed.data.email);

  return { success: true, data: { exists: !!data.user } };
}

// ─── signIn ───────────────────────────────────────────────────────────────────

export async function signIn(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = signInSchema.safeParse(
    typeof input === "object" && input !== null ? input : {},
  );
  if (!parsed.success) {
    const err = parsed.error.errors[0];
    return { success: false, error: err.message, field: err.path[0] as string };
  }

  const { email, password } = parsed.data;
  const redirectTo =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "Invalid email or password" };
  }

  redirect(redirectTo);
}

// ─── signUp ───────────────────────────────────────────────────────────────────

export async function signUp(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const err = parsed.error.errors[0];
    return { success: false, error: err.message, field: err.path[0] as string };
  }

  const { email, password, name } = parsed.data;
  const redirectTo =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Could not create account",
    };
  }

  // Insert profile row — id matches Supabase auth user id
  await db.insert(users).values({
    id: data.user.id,
    email,
    name,
  });

  redirect(redirectTo);
}

// ─── sendMagicLink ────────────────────────────────────────────────────────────

export async function sendMagicLink(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = magicLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email } = parsed.data;
  const callbackUrl =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? `/auth/callback?next=${encodeURIComponent((input as { redirectTo: string }).redirectTo)}`
      : "/auth/callback";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "")}${callbackUrl}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { success: false, error: "Could not send magic link. Try again." };
  }

  return { success: true, data: undefined };
}

// ─── signOut ──────────────────────────────────────────────────────────────────

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
```

- [ ] **Step 4: Run tests — expect them to pass**

```bash
npx vitest run src/lib/actions/auth.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Fix `sendMagicLink` emailRedirectTo**

The `emailRedirectTo` in `sendMagicLink` uses an incorrect URL construction. Replace just that value in the action with a proper approach using `NEXT_PUBLIC_SUPABASE_URL` to derive the app URL — but for the tests above, this doesn't matter (tests don't call the real Supabase). A proper app URL should come from an env var like `NEXT_PUBLIC_APP_URL`. For now, the magic link callback URL is configured in the Supabase dashboard. Update `sendMagicLink` to use a simpler redirect path string:

In `src/lib/actions/auth.ts`, replace the `callbackUrl` block and `signInWithOtp` call:

```typescript
  const next =
    typeof input === "object" &&
    input !== null &&
    "redirectTo" in input &&
    typeof (input as { redirectTo?: string }).redirectTo === "string"
      ? (input as { redirectTo: string }).redirectTo
      : "/my-clubs";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });
```

- [ ] **Step 6: Run tests again to confirm still passing**

```bash
npx vitest run src/lib/actions/auth.test.ts
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/actions/auth.ts src/lib/actions/auth.test.ts
git commit -m "feat: auth server actions with tests (checkEmail, signIn, signUp, sendMagicLink, signOut)"
```

---

## Task 4: Auth callback route + layouts

**Files:**
- Create: `app/(auth)/callback/route.ts`
- Create: `app/(auth)/layout.tsx`

- [ ] **Step 1: Create `app/(auth)/callback/route.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/my-clubs";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link_expired`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
```

- [ ] **Step 2: Create `app/(auth)/layout.tsx`**

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </main>
  );
}
```

- [ ] **Step 3: Verify types**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/callback/route.ts app/\(auth\)/layout.tsx
git commit -m "feat: auth callback route and auth layout"
```

---

## Task 5: Input UI component + AuthForm

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/auth-form.tsx`
- Create: `src/components/ui/auth-form.test.tsx`

- [ ] **Step 1: Create `src/components/ui/input.tsx`**

```typescript
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Input({ className, ...props }: ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      className={cn(
        "w-full rounded-[var(--radius-input)] border border-border bg-[#FFFBF7] px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
```

- [ ] **Step 2: Write failing tests for AuthForm**

Create `src/components/ui/auth-form.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

// Mock server actions
vi.mock("@/lib/actions/auth", () => ({
  checkEmail: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  sendMagicLink: vi.fn(),
}));

import { checkEmail, signIn, signUp, sendMagicLink } from "@/lib/actions/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthForm", () => {
  it("renders email input on initial load", () => {
    render(<AuthForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows password field after Continue for existing user", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: true,
      data: { exists: true },
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "existing@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText(/your name/i)).not.toBeInTheDocument();
  });

  it("shows name + password fields for new user", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: true,
      data: { exists: false },
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "new@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/let's get you set up/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. sarah/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("shows inline error when checkEmail fails", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: false,
      error: "Something went wrong",
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("calls sendMagicLink on magic link button click", async () => {
    vi.mocked(sendMagicLink).mockResolvedValue({ success: true, data: undefined });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
    await user.click(screen.getByRole("button", { name: /magic link/i }));

    await waitFor(() => {
      expect(sendMagicLink).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@test.com" }),
      );
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npx vitest run src/components/ui/auth-form.test.tsx
```

Expected: fails with "Cannot find module './auth-form'".

- [ ] **Step 4: Install `@testing-library/user-event` if not present**

```bash
cd c:/Users/seanr/projects/run-club-platform && npm ls @testing-library/user-event 2>/dev/null | head -3
```

If not listed, run: `npm install -D @testing-library/user-event`

- [ ] **Step 5: Create `src/components/ui/auth-form.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  checkEmail,
  signIn,
  signUp,
  sendMagicLink,
} from "@/lib/actions/auth";

type Step = "email" | "existing" | "new" | "magic-sent";

const emailOnlySchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const signUpFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface AuthFormProps {
  redirectTo?: string;
}

export function AuthForm({ redirectTo = "/my-clubs" }: AuthFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Email step
  const emailForm = useForm<z.infer<typeof emailOnlySchema>>({
    resolver: zodResolver(emailOnlySchema),
  });

  // Existing user (sign in)
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email },
  });

  // New user (sign up)
  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email },
  });

  async function onEmailSubmit(data: z.infer<typeof emailOnlySchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await checkEmail({ email: data.email });
    setIsLoading(false);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setEmail(data.email);
    signInForm.setValue("email", data.email);
    signUpForm.setValue("email", data.email);
    setStep(result.data.exists ? "existing" : "new");
  }

  async function onSignInSubmit(data: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await signIn({ ...data, redirectTo });
    setIsLoading(false);

    if (result && !result.success) {
      setServerError(result.error);
    }
  }

  async function onSignUpSubmit(data: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await signUp({ ...data, redirectTo });
    setIsLoading(false);

    if (result && !result.success) {
      setServerError(result.error);
    }
  }

  async function onMagicLink() {
    const currentEmail =
      step === "email"
        ? emailForm.getValues("email")
        : email;

    if (!currentEmail) {
      setServerError("Enter your email first");
      return;
    }

    setIsLoading(true);
    setServerError(null);
    const result = await sendMagicLink({ email: currentEmail, redirectTo });
    setIsLoading(false);

    if (result.success) {
      setStep("magic-sent");
    } else {
      setServerError(result.error);
    }
  }

  const heading =
    step === "email"
      ? "Welcome to RunClub"
      : step === "existing"
        ? "Welcome back!"
        : step === "new"
          ? "Let's get you set up!"
          : "Check your inbox ✉️";

  const subheading =
    step === "email"
      ? "Enter your email to get started"
      : step === "existing"
        ? null
        : step === "new"
          ? null
          : `We sent a magic link to ${email}`;

  return (
    <div className="w-full max-w-[340px] px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-11 h-11 rounded-md bg-primary flex items-center justify-center mb-3">
          <Flame className="text-white" size={22} />
        </div>
        <h1 className="font-heading text-[22px] font-extrabold text-text">
          {heading}
        </h1>
        {subheading && (
          <p className="text-[13px] text-text-muted mt-1 text-center">
            {subheading}
          </p>
        )}
      </div>

      {step === "magic-sent" ? (
        <p className="text-center text-sm text-text-muted">
          Click the link in your email to sign in. You can close this tab.
        </p>
      ) : (
        <div className="bg-surface border border-border-muted rounded-[var(--radius-card)] p-5 shadow-card">
          {/* Email step */}
          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-3"
            >
              <Input
                {...emailForm.register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Checking…" : "Continue"}
              </Button>
              <div className="relative flex items-center gap-2 py-1">
                <div className="flex-1 border-t border-border-muted" />
                <span className="text-xs text-text-light">or</span>
                <div className="flex-1 border-t border-border-muted" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onMagicLink}
                disabled={isLoading}
              >
                Send me a magic link ✉️
              </Button>
            </form>
          )}

          {/* Existing user — sign in */}
          {step === "existing" && (
            <form
              onSubmit={signInForm.handleSubmit(onSignInSubmit)}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{email}</span>
                <button
                  type="button"
                  className="text-primary underline text-xs"
                  onClick={() => {
                    setStep("email");
                    setServerError(null);
                  }}
                >
                  Change
                </button>
              </div>
              <Input
                {...signInForm.register("password")}
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                autoFocus
              />
              {signInForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Log in"}
              </Button>
              <button
                type="button"
                className="text-xs text-text-light underline w-full text-center"
                onClick={onMagicLink}
                disabled={isLoading}
              >
                Forgot password? Send magic link instead.
              </button>
            </form>
          )}

          {/* New user — sign up */}
          {step === "new" && (
            <form
              onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{email}</span>
                <button
                  type="button"
                  className="text-primary underline text-xs"
                  onClick={() => {
                    setStep("email");
                    setServerError(null);
                  }}
                >
                  Change
                </button>
              </div>
              <Input
                {...signUpForm.register("name")}
                type="text"
                placeholder="e.g. Sarah"
                autoComplete="name"
                autoFocus
              />
              {signUpForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
              <Input
                {...signUpForm.register("password")}
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              {signUpForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-[10px] text-text-light text-center">
                By signing up you agree to our{" "}
                <a href="/terms" className="underline">Terms</a> and{" "}
                <a href="/privacy" className="underline">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Run tests — expect them to pass**

```bash
npx vitest run src/components/ui/auth-form.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 7: Create `app/(auth)/login/page.tsx`**

```typescript
import { AuthForm } from "@/components/ui/auth-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export const metadata = {
  title: "Log in — RunClub",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo, error } = await searchParams;

  return (
    <div className="w-full flex flex-col items-center gap-4 py-8">
      {error === "link_expired" && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 max-w-[340px] w-full text-center">
          That magic link has expired. Request a new one below.
        </p>
      )}
      <AuthForm redirectTo={redirectTo ?? "/my-clubs"} />
    </div>
  );
}
```

- [ ] **Step 8: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/input.tsx src/components/ui/auth-form.tsx src/components/ui/auth-form.test.tsx app/\(auth\)/login/page.tsx
git commit -m "feat: AuthForm multi-step RHF login/signup component and /login page"
```

---

## Task 6: Navbar

**Files:**
- Create: `src/components/nav-link.tsx`
- Create: `src/components/navbar-actions.tsx`
- Create: `src/components/navbar.tsx`
- Create: `src/components/navbar.test.tsx`

- [ ] **Step 1: Create `src/components/nav-link.tsx`**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href.toString());

  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-text-muted transition-colors hover:text-text",
        isActive && "text-primary font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/components/navbar-actions.tsx`**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface NavbarActionsProps {
  user: { name: string; email: string } | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function NavbarActions({ user }: NavbarActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Account menu"
            >
              {getInitials(user.name)}
            </button>
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-10 z-20 w-44 bg-surface border border-border-muted rounded-[var(--radius-card)] shadow-card py-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-sm text-text hover:bg-surface-alt"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface-alt"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              Log in
            </Link>
            <Button asChild size="sm" className="shadow-primary-glow">
              <Link href="/login?action=create">Start a club</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="flex md:hidden items-center gap-2">
        {user && (
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold">
            {getInitials(user.name)}
          </div>
        )}
        <button
          onClick={() => setMenuOpen(true)}
          className="p-1 text-text-muted hover:text-text"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-surface flex flex-col"
          style={{ animation: "slideInRight 0.2s ease" }}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 text-text-muted"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 pt-4">
            <Link
              href="/explore"
              className="py-3 text-lg font-medium text-text border-b border-border-muted"
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  href="/my-clubs"
                  className="py-3 text-lg font-medium text-text border-b border-border-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  My Clubs
                </Link>
                <form action={signOut} className="mt-4">
                  <button type="submit" className="text-sm text-text-muted underline">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-3 text-lg font-medium text-text border-b border-border-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <div className="mt-6">
                  <Button asChild className="w-full shadow-primary-glow">
                    <Link href="/login?action=create" onClick={() => setMenuOpen(false)}>
                      Start a club — it&apos;s free
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 3: Create `src/components/navbar.tsx`**

```typescript
import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/nav-link";
import { NavbarActions } from "@/components/navbar-actions";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function Navbar() {
  const authUser = await getAuthUser();

  let userProfile: { name: string; email: string } | null = null;
  if (authUser) {
    const [profile] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);
    userProfile = profile ?? { name: authUser.email ?? "User", email: authUser.email ?? "" };
  }

  return (
    <header className="h-[45px] bg-white border-b border-border-muted flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-md bg-primary flex items-center justify-center">
            <Flame className="text-white" size={14} />
          </div>
          <span className="font-heading font-bold text-[15px] text-text">
            RunClub
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-5">
          <NavLink href="/explore">Explore</NavLink>
          {userProfile && <NavLink href="/my-clubs">My Clubs</NavLink>}
          {!userProfile && (
            <NavLink href="/explore">Explore</NavLink>
          )}
        </nav>

        {/* Auth actions */}
        <NavbarActions user={userProfile} />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Write tests for Navbar**

Create `src/components/navbar.test.tsx`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/supabase/server", () => ({
  getAuthUser: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([]),
        })),
      })),
    })),
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/"),
}));

// NavbarActions and NavLink use client hooks — mock them for Server Component tests
vi.mock("@/components/navbar-actions", () => ({
  NavbarActions: ({ user }: { user: { name: string } | null }) => (
    <div data-testid="navbar-actions">{user ? user.name : "logged-out"}</div>
  ),
}));

vi.mock("@/components/nav-link", () => ({
  NavLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { getAuthUser } from "@/lib/supabase/server";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("renders logo link", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    render(await Navbar());
    expect(screen.getByText("RunClub")).toBeInTheDocument();
  });

  it("shows logged-out state when no user", async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);
    render(await Navbar());
    expect(screen.getByTestId("navbar-actions")).toHaveTextContent("logged-out");
  });

  it("shows user name when authenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({ id: "user-1", email: "a@b.com" } as never);
    const { db } = await import("@/lib/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([{ name: "Alice", email: "a@b.com" }]),
        })),
      })),
    } as never);
    render(await Navbar());
    expect(screen.getByTestId("navbar-actions")).toHaveTextContent("Alice");
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run src/components/navbar.test.tsx
```

Expected: all 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/nav-link.tsx src/components/navbar-actions.tsx src/components/navbar.tsx src/components/navbar.test.tsx
git commit -m "feat: navbar with server component auth state and mobile hamburger"
```

---

## Task 7: Public layout + landing placeholder

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `app/(public)/page.tsx`
- Delete: `app/page.tsx`

- [ ] **Step 1: Create `app/(public)/layout.tsx`**

```typescript
import { Navbar } from "@/components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
```

- [ ] **Step 2: Create `app/(public)/page.tsx`**

```typescript
export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-heading text-4xl font-extrabold text-text mb-3">
        Find your crew. Run together. Grab drinks after.
      </h1>
      <p className="text-text-muted text-lg max-w-md">
        Landing page coming soon.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Delete `app/page.tsx`**

```bash
rm c:/Users/seanr/projects/run-club-platform/app/page.tsx
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/\(public\)/layout.tsx app/\(public\)/page.tsx
git rm app/page.tsx
git commit -m "feat: public layout with navbar and landing placeholder"
```

---

## Task 8: Member layout + /my-clubs placeholder

**Files:**
- Create: `app/(member)/layout.tsx`
- Create: `app/(member)/my-clubs/page.tsx`

- [ ] **Step 1: Create `app/(member)/layout.tsx`**

```typescript
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "/my-clubs";
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
```

- [ ] **Step 2: Create `app/(member)/my-clubs/page.tsx`**

```typescript
export const metadata = {
  title: "My Clubs — RunClub",
};

export default function MyClubsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-heading text-[22px] font-extrabold text-text">
        My Clubs
      </h1>
      <p className="text-[13px] text-text-muted mt-1">
        Your upcoming runs across all clubs
      </p>
      <div className="mt-8 text-center text-text-muted">
        <p className="text-3xl mb-3">🏃</p>
        <p className="font-medium">My Clubs page coming soon</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/\(member\)/layout.tsx app/\(member\)/my-clubs/page.tsx
git commit -m "feat: member layout with auth guard and /my-clubs placeholder"
```

---

## Task 9: Membership query + dashboard layout + sidebar

**Files:**
- Create: `src/lib/db/queries/memberships.ts`
- Create: `src/components/dashboard-sidebar.tsx`
- Create: `src/components/dashboard-mobile-tabs.tsx`
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/[slug]/page.tsx`

- [ ] **Step 1: Create `src/lib/db/queries/memberships.ts`**

```typescript
import { db } from "@/lib/db";
import { memberships, communities } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export type MemberRole = "owner" | "admin" | "member" | "waitlisted";

export type UserMembership = {
  role: MemberRole;
  community: {
    id: string;
    slug: string;
    name: string;
    tier: "free" | "pro";
  };
};

/**
 * Get the authenticated user's membership for a community identified by slug.
 * Returns null if the user has no membership for that community.
 */
export async function getUserMembership(
  userId: string,
  communitySlug: string,
): Promise<UserMembership | null> {
  const results = await db
    .select({
      role: memberships.role,
      communityId: communities.id,
      communitySlug: communities.slug,
      communityName: communities.name,
      communityTier: communities.tier,
    })
    .from(memberships)
    .innerJoin(communities, eq(memberships.communityId, communities.id))
    .where(
      and(
        eq(memberships.userId, userId),
        eq(communities.slug, communitySlug),
      ),
    )
    .limit(1);

  if (!results.length) return null;

  const row = results[0];
  return {
    role: row.role,
    community: {
      id: row.communityId,
      slug: row.communitySlug,
      name: row.communityName,
      tier: row.communityTier,
    },
  };
}
```

- [ ] **Step 2: Create `src/components/dashboard-sidebar.tsx`**

```typescript
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MemberRole } from "@/lib/db/queries/memberships";

interface SidebarItem {
  emoji: string;
  label: string;
  section: string;
  proOnly?: boolean;
}

const NAV_ITEMS: SidebarItem[] = [
  { emoji: "🏠", label: "Overview", section: "" },
  { emoji: "📅", label: "Events", section: "events" },
  { emoji: "👥", label: "Members", section: "members" },
  { emoji: "📊", label: "Analytics", section: "analytics", proOnly: true },
  { emoji: "⚙️", label: "Settings", section: "settings" },
];

interface DashboardSidebarProps {
  community: { slug: string; name: string; tier: "free" | "pro" };
  userRole: MemberRole;
  currentPath: string;
}

export function DashboardSidebar({
  community,
  currentPath,
}: DashboardSidebarProps) {
  const isFree = community.tier === "free";

  return (
    <div className="flex flex-col h-full py-4">
      {/* Club header */}
      <div className="px-4 mb-4">
        <Link
          href="/my-clubs"
          className="block text-[10px] text-text-light uppercase tracking-wide hover:text-text-muted transition-colors"
        >
          {community.name}
        </Link>
        {isFree ? (
          <p className="text-[10px] text-text-muted mt-0.5">
            Free plan{" "}
            <Link
              href={`/dashboard/${community.slug}/settings`}
              className="text-primary font-semibold"
            >
              Upgrade →
            </Link>
          </p>
        ) : (
          <span className="inline-flex items-center rounded-md bg-[#FFF1F2] text-primary text-[9px] font-semibold px-1.5 py-0.5 mt-0.5">
            ✨ Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2">
        {NAV_ITEMS.map((item) => {
          const href =
            item.section === ""
              ? `/dashboard/${community.slug}`
              : `/dashboard/${community.slug}/${item.section}`;

          const isActive =
            item.section === ""
              ? currentPath === `/dashboard/${community.slug}` ||
                currentPath === `/dashboard/${community.slug}/`
              : currentPath.startsWith(
                  `/dashboard/${community.slug}/${item.section}`,
                );

          const isLocked = item.proOnly && isFree;

          return (
            <Link
              key={item.section}
              href={href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-colors mb-0.5",
                isActive
                  ? "bg-surface-alt text-primary font-semibold"
                  : "text-text-muted hover:text-text hover:bg-surface-alt",
                isLocked && "opacity-50",
              )}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
              {isLocked && <span className="ml-auto text-[9px]">🔒</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/dashboard-mobile-tabs.tsx`**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileTab {
  emoji: string;
  label: string;
  section: string;
}

const TABS: MobileTab[] = [
  { emoji: "🏠", label: "Overview", section: "" },
  { emoji: "📅", label: "Events", section: "events" },
  { emoji: "👥", label: "Members", section: "members" },
  { emoji: "📊", label: "Analytics", section: "analytics" },
  { emoji: "⚙️", label: "Settings", section: "settings" },
];

interface DashboardMobileTabsProps {
  slug: string;
  className?: string;
}

export function DashboardMobileTabs({ slug, className }: DashboardMobileTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex overflow-x-auto border-b border-border-muted bg-surface",
        className,
      )}
    >
      {TABS.map((tab) => {
        const href =
          tab.section === ""
            ? `/dashboard/${slug}`
            : `/dashboard/${slug}/${tab.section}`;

        const isActive =
          tab.section === ""
            ? pathname === `/dashboard/${slug}` || pathname === `/dashboard/${slug}/`
            : pathname.startsWith(`/dashboard/${slug}/${tab.section}`);

        return (
          <Link
            key={tab.section}
            href={href}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-[11px] font-medium transition-colors border-b-2",
              isActive
                ? "text-primary border-primary"
                : "text-text-muted border-transparent hover:text-text",
            )}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4: Create `app/dashboard/layout.tsx`**

```typescript
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/my-clubs");
  }

  // Slug-specific auth checks happen in app/dashboard/[slug]/layout.tsx
  return <>{children}</>;
}
```

- [ ] **Step 5: Create `app/dashboard/[slug]/layout.tsx`** (replacing the .gitkeep)

```typescript
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import { getUserMembership } from "@/lib/db/queries/memberships";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardMobileTabs } from "@/components/dashboard-mobile-tabs";

interface DashboardSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardSlugLayout({
  children,
  params,
}: DashboardSlugLayoutProps) {
  const { slug } = await params;
  const user = await getAuthUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/dashboard/${slug}`)}`);
  }

  const membership = await getUserMembership(user.id, slug);

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    redirect("/my-clubs");
  }

  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") ?? `/dashboard/${slug}`;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-[180px] flex-col border-r border-border-muted bg-surface">
        <DashboardSidebar
          community={membership.community}
          userRole={membership.role}
          currentPath={currentPath}
        />
      </aside>
      <main className="flex-1 overflow-auto">
        <DashboardMobileTabs slug={slug} className="md:hidden" />
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Create `app/dashboard/[slug]/page.tsx`** (replacing .gitkeep)

```typescript
interface DashboardOverviewProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverviewPage({
  params,
}: DashboardOverviewProps) {
  const { slug } = await params;

  return (
    <div className="p-6">
      <h1 className="font-heading text-xl font-bold text-text">
        Dashboard — {slug}
      </h1>
      <p className="text-text-muted mt-1 text-sm">Overview coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 7: Remove .gitkeep from dashboard slug dir**

```bash
rm "c:/Users/seanr/projects/run-club-platform/app/dashboard/[slug]/.gitkeep"
```

- [ ] **Step 8: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/lib/db/queries/memberships.ts src/components/dashboard-sidebar.tsx src/components/dashboard-mobile-tabs.tsx app/dashboard/layout.tsx "app/dashboard/[slug]/layout.tsx" "app/dashboard/[slug]/page.tsx"
git rm "app/dashboard/[slug]/.gitkeep" 2>/dev/null || true
git commit -m "feat: dashboard layout with auth/role guard, sidebar, and mobile tabs"
```

---

## Task 10: Final wiring + smoke test

**Files:**
- Modify: `app/layout.tsx` (remove unused Geist import)
- Verify dev server runs

- [ ] **Step 1: Clean up `app/layout.tsx`**

Current file imports `Geist` which isn't part of the brand spec. Remove it:

```typescript
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
      className={cn("h-full antialiased", bricolage.variable, dmSans.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Start dev server and verify pages load**

```bash
npm run dev
```

Verify in browser:
- `http://localhost:3000` — landing placeholder renders with navbar (no errors)
- `http://localhost:3000/login` — auth form renders with email step
- `http://localhost:3000/dashboard/test` — redirects to `/login?redirect=%2Fdashboard%2Ftest` (not authenticated)
- `http://localhost:3000/my-clubs` — redirects to `/login?redirect=%2Fmy-clubs`

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "fix: remove unused Geist font from root layout"
```

---

## Self-Review Checklist

- [x] `proxy.ts` at root (not `middleware.ts`) — Next.js 16 convention
- [x] `params` awaited in all layouts and pages — Next.js 16 async params
- [x] Auth actions return `ActionResult<T>`, never throw
- [x] `checkEmail` uses admin client (service_role) — correct for server-only code
- [x] `signIn` error message "Invalid email or password" — avoids user enumeration
- [x] Magic link callback route at `app/(auth)/callback/route.ts`
- [x] Dashboard layout checks BOTH auth + owner/admin role
- [x] `/my-clubs` protected by `(member)/layout.tsx` auth check
- [x] All `"use client"` components receive data via props only (no data fetching)
- [x] Mobile hamburger in `NavbarActions`, mobile tabs in `DashboardMobileTabs`
- [x] `@base-ui/react` used for Button and Input primitives
- [x] RHF + zodResolver for AuthForm — matches CLAUDE.md pattern
- [x] Tests for auth actions, AuthForm, and Navbar
- [x] No `any` types used
