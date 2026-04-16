import { getUserMemberships } from "@/lib/db/queries/memberships";
import { getAuthUser } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "My Clubs — RunClub",
};

export default async function MyClubsPage() {
  const user = await getAuthUser();
  if (!user) return;
  const myClubs = await getUserMemberships(user.id);

  function showClubActions(role: string, slug: string) {
    if (role === "owner" || role === "admin") {
      return <Link href={`/dashboard/${slug}`}>Manage</Link>;
    } else if (role === "member") {
      return <Link href={`/clubs/${slug}`}>View</Link>;
    } else if (role === "waitlisted") {
      return <span className="text-text-muted text-[12px]">Waitlisted</span>;
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-heading text-[22px] font-extrabold text-text">
        My Clubs
      </h1>
      <p className="text-[13px] text-text-muted mt-1">
        Your upcoming runs across all clubs
      </p>
      <div className="mt-6 space-y-4">
        {myClubs.map((membership) => (
          <div
            key={membership.community.id}
            className="rounded-[14px] border border-border-muted bg-surface p-5"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-[15px] font-semibold text-text">
                {membership.community.name}
              </h2>

              {showClubActions(membership.role, membership.community.slug)}
            </div>
            <p className="text-[12px] text-text-muted">
              {membership.role === "waitlisted"
                ? "Waitlisted"
                : membership.role === "member"
                  ? "Member"
                  : membership.role === "admin"
                    ? "Admin"
                    : "Owner"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
