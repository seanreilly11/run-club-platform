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
  NavLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
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
    expect(screen.getByTestId("navbar-actions")).toHaveTextContent(
      "logged-out",
    );
  });

  it("shows user name when authenticated", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      id: "user-1",
      email: "a@b.com",
    } as never);
    const { db } = await import("@/lib/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi
            .fn()
            .mockResolvedValue([{ name: "Alice", email: "a@b.com" }]),
        })),
      })),
    } as never);
    render(await Navbar());
    expect(screen.getByTestId("navbar-actions")).toHaveTextContent("Alice");
  });
});
