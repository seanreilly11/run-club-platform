import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/server";
import { getMyClubsMemberships } from "@/lib/db/queries/memberships";
import { getUpcomingEventsForMember } from "@/lib/db/queries/events";
import { VENUE_EMOJI } from "@/lib/constants";
import { MyClubsRsvpButton } from "@/components/my-clubs/rsvp-button";

export const metadata = {
  title: "My Clubs — RunClub",
};

const VibeBadge = ({ vibe }: { vibe: "social" | "competitive" | "casual" }) => {
  const styles = {
    social: { bg: "#FFF1F2", text: "#F43F5E" },
    competitive: { bg: "#EDE9FE", text: "#7C3AED" },
    casual: { bg: "#FEF3C7", text: "#B45309" },
  };
  const s = styles[vibe];
  return (
    <span
      style={{
        fontSize: "9px",
        padding: "1px 6px",
        borderRadius: "5px",
        fontWeight: 600,
        background: s.bg,
        color: s.text,
      }}
    >
      {vibe}
    </span>
  );
};

function formatWaitDate(joinedAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - joinedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export default async function MyClubsPage() {
  const user = await getAuthUser();
  if (!user) return;

  const [upcomingEvents, myClubs] = await Promise.all([
    getUpcomingEventsForMember(user.id, 10),
    getMyClubsMemberships(user.id),
  ]);

  const ownedClubs = myClubs.filter(
    (m) => m.role === "owner" || m.role === "admin",
  );
  const memberClubs = myClubs.filter((m) => m.role === "member");
  const waitlistedClubs = myClubs.filter((m) => m.role === "waitlisted");

  const combinedClubs = [
    ...ownedClubs.map((m) => ({ ...m, isOwner: true })),
    ...memberClubs.map((m) => ({ ...m, isOwner: false })),
  ];

  return (
    <div style={{ background: "#FFFBF7", minHeight: "100%", color: "#1C1917" }}>
      <div
        style={{
          padding: "20px 20px 28px",
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                margin: "0 0 2px 0",
              }}
            >
              My Clubs
            </h1>
            <p style={{ fontSize: "13px", color: "#78716C", margin: 0 }}>
              Your upcoming runs across all clubs
            </p>
          </div>
        </div>

        {/* This week */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              margin: "0 0 10px 0",
            }}
          >
            This week
          </h2>

          {upcomingEvents.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🏃</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1C1917",
                  marginBottom: "4px",
                }}
              >
                No upcoming runs
              </div>
              <div style={{ fontSize: "12px", color: "#78716C" }}>
                Join a club to see events here
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {upcomingEvents.map((e) => {
                const venueEmoji = e.communityPostRunDefault
                  ? (VENUE_EMOJI[e.communityPostRunDefault] ?? "📍")
                  : "📍";

                const formattedDate = new Intl.DateTimeFormat("en-GB", {
                  timeZone: e.communityTimezone,
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(e.date);

                return (
                  <Link
                    key={e.id}
                    href={`/${e.communitySlug}/events/${e.id}`}
                    style={{
                      display: "block",
                      background: "#FFFFFF",
                      border: "1px solid #F5F0EB",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#F43F5E",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {e.communityName}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                            }}
                          >
                            {e.title}
                          </span>
                          {e.distanceKm && (
                            <span
                              style={{
                                fontSize: "10px",
                                padding: "1px 6px",
                                background: "#FFF5F0",
                                borderRadius: "5px",
                                color: "#78716C",
                              }}
                            >
                              {e.distanceKm}
                              {e.distanceUnit}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#78716C",
                            marginTop: "2px",
                          }}
                        >
                          {formattedDate}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#A8A29E",
                            marginTop: "2px",
                          }}
                        >
                          {e.goingCount} going · {e.aftersCount} for afters
                        </div>
                        {e.postRunVenueName && (
                          <div
                            style={{
                              display: "inline-flex",
                              gap: "3px",
                              alignItems: "center",
                              padding: "2px 7px",
                              background: "#FEF3C7",
                              borderRadius: "5px",
                              marginTop: "5px",
                            }}
                          >
                            <span style={{ fontSize: "9px" }}>
                              {venueEmoji}
                            </span>
                            <span
                              style={{
                                fontSize: "9px",
                                color: "#B45309",
                                fontWeight: 600,
                              }}
                            >
                              Afters at {e.postRunVenueName}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Stop link propagation so RSVP click doesn't navigate */}
                      <span onClick={(ev) => ev.preventDefault()}>
                        <MyClubsRsvpButton
                          eventId={e.id}
                          communitySlug={e.communitySlug}
                          initialStatus={e.rsvpStatus}
                          initialJoiningSocial={e.rsvpJoiningSocial}
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* My clubs */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              My clubs
            </h2>
            <Link
              href="/create"
              style={{
                padding: "5px 12px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#78716C",
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              + Start a club
            </Link>
          </div>

          {combinedClubs.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🔍</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1C1917",
                  marginBottom: "4px",
                }}
              >
                No clubs yet
              </div>
              <Link
                href="/explore"
                style={{
                  fontSize: "12px",
                  color: "#F43F5E",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Find a club →
              </Link>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {combinedClubs.map((m) => (
                <div
                  key={m.community.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #F5F0EB",
                    borderRadius: "12px",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* Flame avatar */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background:
                        "linear-gradient(to top, #F59E0B 0%, #FB923C 30%, #F97066 60%, #F43F5E 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    🔥
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.community.name}
                      </span>
                      {m.isOwner && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 5px",
                            borderRadius: "4px",
                            background: "#FFF1F2",
                            color: "#F43F5E",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {m.role === "owner" ? "Owner" : "Admin"}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginTop: "2px",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#78716C" }}>
                        {m.community.city} · {m.community.memberCount} members
                      </span>
                      <VibeBadge vibe={m.community.vibe} />
                      {m.currentStreak > 0 && (
                        <span style={{ fontSize: "10px", color: "#F43F5E" }}>
                          🔥 {m.currentStreak}
                        </span>
                      )}
                    </div>
                  </div>

                  {m.isOwner ? (
                    <Link
                      href={`/dashboard/${m.community.slug}`}
                      style={{
                        padding: "6px 14px",
                        background: "#FFF1F2",
                        color: "#F43F5E",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Manage →
                    </Link>
                  ) : (
                    <Link
                      href={`/${m.community.slug}`}
                      style={{
                        padding: "6px 14px",
                        background: "#FFFFFF",
                        color: "#78716C",
                        border: "1px solid #F5F0EB",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        fontFamily: "inherit",
                      }}
                    >
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Waitlisted */}
        {waitlistedClubs.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                margin: "0 0 10px 0",
              }}
            >
              Waitlisted
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {waitlistedClubs.map((m) => (
                <div
                  key={m.community.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #F5F0EB",
                    borderRadius: "12px",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "#FFF5F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                      opacity: 0.6,
                    }}
                  >
                    🔥
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {m.community.name}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginTop: "2px",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#78716C" }}>
                        {m.community.city} · {m.community.memberCount} members
                      </span>
                      <span style={{ fontSize: "10px", color: "#A8A29E" }}>
                        Joined waitlist {formatWaitDate(m.joinedAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "4px 10px",
                        background: "#FEF3C7",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#B45309",
                      }}
                    >
                      Waitlisted
                    </span>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#A8A29E",
                        marginTop: "3px",
                      }}
                    >
                      Organizer notified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
