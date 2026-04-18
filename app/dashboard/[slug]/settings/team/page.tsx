import { notFound, redirect } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getTeamMembers } from "@/lib/db/queries/memberships";
import { getAuthUser } from "@/lib/supabase/server";
import { InviteAdminForm } from "@/components/dashboard/invite-admin-form";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const [community, user] = await Promise.all([
    getClubBySlug(slug),
    getAuthUser(),
  ]);
  if (!community) notFound();
  if (!user) redirect("/login");

  const members = await getTeamMembers(community.id);

  return (
    <div style={{ padding: "20px", maxWidth: "720px" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 4px 0",
          color: "#1C1917",
        }}
      >
        Team
      </h2>
      <p style={{ fontSize: "12px", color: "#78716C", margin: "0 0 20px 0" }}>
        Manage who can edit your club
      </p>
      <InviteAdminForm
        members={members}
        communitySlug={slug}
        currentUserId={user.id}
      />
    </div>
  );
}
