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
    userProfile = profile ?? {
      name: authUser.email ?? "User",
      email: authUser.email ?? "",
    };
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
          {!userProfile && <NavLink href="/explore">Explore</NavLink>}
        </nav>

        {/* Auth actions */}
        <NavbarActions user={userProfile} />
      </div>
    </header>
  );
}
