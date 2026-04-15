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
            <Button size="sm" className="shadow-primary-glow">
              <Link href="/create">Start a club</Link>
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
                  <button
                    type="submit"
                    className="text-sm text-text-muted underline"
                  >
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
                  <Button className="w-full shadow-primary-glow">
                    <Link
                      href="/create"
                      onClick={() => setMenuOpen(false)}
                    >
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
