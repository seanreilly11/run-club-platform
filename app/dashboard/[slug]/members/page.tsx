import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";
import { MembersList } from "@/components/dashboard/members-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardMembersPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const members = await getDashboardMembers(community.id);
  const isFree = community.tier === "free";
  const activeMembers = members.filter((m) => m.role !== "waitlisted");

  return (
    <div style={{ padding: "20px", maxWidth: "720px" }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
          }}
        >
          Members{" "}
          <span style={{ fontSize: "14px", color: "#A8A29E", fontWeight: 400 }}>
            ({activeMembers.length}
            {isFree ? ` / ${FREE_TIER_MEMBER_LIMIT}` : ""})
          </span>
        </h2>
      </div>

      {members.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1C1917",
              marginBottom: "4px",
            }}
          >
            No members yet
          </div>
          <div style={{ fontSize: "12px", color: "#78716C" }}>
            Share your club page to get runners joining
          </div>
        </div>
      ) : (
        <MembersList
          members={members}
          communitySlug={slug}
          isFree={isFree}
          freeLimit={FREE_TIER_MEMBER_LIMIT}
        />
      )}
    </div>
  );
}
