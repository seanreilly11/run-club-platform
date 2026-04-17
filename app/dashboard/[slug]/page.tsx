import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/db/queries/communities";
import { getCommunityStats } from "@/lib/db/queries/communities";
import { getUpcomingEvents } from "@/lib/db/queries/events";
import { getLastUncapturedEvent } from "@/lib/db/queries/events";
import { getWaitlistedCount } from "@/lib/db/queries/memberships";
import { MemberProgress } from "@/components/dashboard/member-progress";
import { PostEventCapture } from "@/components/dashboard/post-event-capture";
import { VENUE_EMOJI } from "@/lib/constants";
import { ShareClubButton } from "@/components/dashboard/share-club-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverviewPage({ params }: Props) {
  const { slug } = await params;

  const communityData = await getClubBySlug(slug);
  if (!communityData) notFound();

  const [statsData, upcomingEventsData, uncapturedEventData, waitlistedData] =
    await Promise.all([
      getCommunityStats(communityData.id),
      getUpcomingEvents(communityData.id, 3),
      getLastUncapturedEvent(communityData.id),
      getWaitlistedCount(communityData.id),
    ]);

  const isFree = communityData.tier === "free";

  const avgTurnout = statsData?.avgActualPerEvent
    ? Math.round(parseFloat(statsData.avgActualPerEvent))
    : null;
  const showRate = statsData?.avgShowRate
    ? Math.round(parseFloat(statsData.avgShowRate) * 100)
    : null;
  const aftersRate = statsData?.avgSocialRate
    ? Math.round(parseFloat(statsData.avgSocialRate) * 100)
    : null;
  const activeMembers = statsData?.activeMemberCount ?? null;

  const statCells = [
    {
      label: "Avg turnout",
      value: avgTurnout !== null ? String(avgTurnout) : "—",
      color: "#16A34A",
    },
    {
      label: "Show rate",
      value: showRate !== null ? `${showRate}%` : "—",
      color: "#8B5CF6",
    },
    {
      label: "Afters rate",
      value: aftersRate !== null ? `${aftersRate}%` : "—",
      color: "#F59E0B",
    },
    {
      label: "Active members",
      value: activeMembers !== null ? String(activeMembers) : "—",
      color: "#1C1917",
    },
  ];

  const totalDistanceKm = statsData?.totalDistanceKm
    ? Math.round(parseFloat(statsData.totalDistanceKm))
    : 0;

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "640px",
      }}
    >
      {/* Member progress bar (free tier only) */}
      {isFree && (
        <MemberProgress
          memberCount={communityData.memberCount}
          waitlistedCount={waitlistedData}
          communitySlug={slug}
        />
      )}

      {/* Post-event capture */}
      {uncapturedEventData && (
        <PostEventCapture event={uncapturedEventData} communitySlug={slug} />
      )}

      {/* Stats grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}
        className="sm:grid-cols-4"
      >
        {statCells.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#A8A29E",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Club totals */}
      {statsData && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            <span>🏃 {totalDistanceKm.toLocaleString()} km together</span>
            <span>🎉 {statsData.totalEvents} runs</span>
            <span>👥 {statsData.uniqueRunners} runners</span>
            <span>🍺 {statsData.totalAftersCount} afters</span>
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
            color: "#1C1917",
          }}
        >
          Upcoming runs
        </h2>
        {upcomingEventsData.length === 0 ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
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
            <div
              style={{
                fontSize: "12px",
                color: "#78716C",
                marginBottom: "12px",
              }}
            >
              Schedule your first run to get started
            </div>
            <Link
              href={`/dashboard/${slug}/events`}
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "#F43F5E",
                color: "white",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              + New event
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {upcomingEventsData.map((event, i) => {
              const venueEmoji = event.postRunVenueName
                ? (VENUE_EMOJI[communityData.postRunDefault] ?? "📍")
                : null;
              const formattedDate = new Intl.DateTimeFormat("en-GB", {
                timeZone: communityData.timezone,
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(event.date);

              return (
                <div
                  key={event.id}
                  style={{
                    background: "#FFFFFF",
                    border:
                      i === 0 ? "1.5px solid #FECDD3" : "1px solid #F5F0EB",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {i === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background:
                          "linear-gradient(to right, #F59E0B, #F97066, #F43F5E)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1C1917",
                          marginBottom: "2px",
                        }}
                      >
                        {event.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#78716C",
                          marginBottom: "4px",
                        }}
                      >
                        {formattedDate}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "#A8A29E" }}>
                          {event.goingCount} going
                        </span>
                        {venueEmoji && event.postRunVenueName && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "10px",
                              padding: "1px 6px",
                              background: "#FEF3C7",
                              color: "#B45309",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            {venueEmoji} {event.postRunVenueName}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/${slug}/events`}
                      style={{
                        flexShrink: 0,
                        marginLeft: "12px",
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#F43F5E",
                        background: "#FFF1F2",
                        borderRadius: "7px",
                        textDecoration: "none",
                      }}
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              );
            })}
            <Link
              href={`/dashboard/${slug}/events`}
              style={{
                display: "block",
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "#78716C",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              View all events →
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Link
          href={`/dashboard/${slug}/events/new`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "11px",
            background: "#F43F5E",
            color: "white",
            borderRadius: "11px",
            fontSize: "13px",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
          }}
        >
          <Plus size={14} /> New event
        </Link>
        <ShareClubButton slug={slug} />
      </div>
    </div>
  );
}
