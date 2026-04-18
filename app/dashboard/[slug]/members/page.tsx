import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getDashboardMembers } from "@/lib/db/queries/memberships";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> =
  {
    owner: { label: "Owner", bg: "#FFE4E6", color: "#F43F5E" },
    admin: { label: "Admin", bg: "#EDE9FE", color: "#7C3AED" },
    member: { label: "Member", bg: "#F5F0EB", color: "#78716C" },
    waitlisted: { label: "Waitlisted", bg: "#FEF3C7", color: "#B45309" },
  };

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#16A34A" },
  new: { label: "New", color: "#8B5CF6" },
  at_risk: { label: "At risk", color: "#F59E0B" },
  lapsed: { label: "Lapsed", color: "#DC2626" },
};

export default async function DashboardMembersPage({ params }: Props) {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) notFound();

  const members = await getDashboardMembers(community.id);
  const isFree = community.tier === "free";
  const activeMembers = members.filter((m) => m.role !== "waitlisted");
  const waitlisted = members.filter((m) => m.role === "waitlisted");

  return (
    <div style={{ padding: "20px", maxWidth: "640px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
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
        <button
          title={isFree ? "Upgrade to Pro to export CSV" : "Export as CSV"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "7px 12px",
            background: "#FFFFFF",
            color: isFree ? "#A8A29E" : "#78716C",
            border: "1px solid #F5F0EB",
            borderRadius: "9px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: isFree ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          ⬇ Export CSV {isFree && "🔒"}
        </button>
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
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>👥</div>
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
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {activeMembers.map((m) => {
              const roleBadge = ROLE_BADGE[m.role];
              const statusBadge = m.status ? STATUS_BADGE[m.status] : null;

              return (
                <div
                  key={m.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #F5F0EB",
                    borderRadius: "10px",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#FFE4E6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#F43F5E",
                      flexShrink: 0,
                    }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + stats */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1C1917",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#A8A29E" }}>
                      {m.eventsAttended} runs
                      {m.showRate !== null && (
                        <>
                          {" "}
                          · {Math.round(parseFloat(m.showRate) * 100)}% show
                          rate
                        </>
                      )}
                      {m.currentStreak > 0 && <> · 🔥 {m.currentStreak}wk</>}
                      {m.preferredPaceGroup && <> · {m.preferredPaceGroup}</>}
                    </div>
                  </div>

                  {/* Status badge */}
                  {statusBadge && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        color: statusBadge.color,
                        flexShrink: 0,
                      }}
                    >
                      {statusBadge.label}
                    </span>
                  )}

                  {/* Role badge */}
                  {roleBadge && m.role !== "member" && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        background: roleBadge.bg,
                        color: roleBadge.color,
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                    >
                      {roleBadge.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Waitlist section */}
          {waitlisted.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                  color: "#B45309",
                }}
              >
                Waitlist ({waitlisted.length})
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {waitlisted.map((m) => (
                  <div
                    key={m.userId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      background: "#FEF3C7",
                      border: "1px solid #FDE68A",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#B45309",
                        flexShrink: 0,
                      }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#78350F",
                      }}
                    >
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        background: "#FEF3C7",
                        color: "#B45309",
                        border: "1px solid #FDE68A",
                        borderRadius: "4px",
                      }}
                    >
                      Waitlisted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
