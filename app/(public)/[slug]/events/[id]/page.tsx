import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubBySlug } from "@/lib/db/queries/communities";
import {
  getEventById,
  getEventAttendees,
  getUserRsvpForEvent,
} from "@/lib/db/queries/events";
import { getAuthUser } from "@/lib/supabase/server";
import { EventRsvp } from "@/components/event-page/event-rsvp";

type Props = { params: Promise<{ slug: string; id: string }> };

export default async function EventPage({ params }: Props) {
  const { slug, id } = await params;

  const [event, community, user] = await Promise.all([
    getEventById(id),
    getClubBySlug(slug),
    getAuthUser(),
  ]);

  if (!event || !community || event.communityId !== community.id) notFound();

  const [attendees, userRsvp] = await Promise.all([
    getEventAttendees(event.id, 20),
    user ? getUserRsvpForEvent(event.id, user.id) : Promise.resolve(null),
  ]);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: community.timezone,
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(event.date);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: community.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(event.date);

  return (
    <div
      style={{
        background: "#FFFBF7",
        minHeight: "100%",
        color: "#1C1917",
        padding: "10px 16px 24px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "11px",
          padding: "0 0 10px",
        }}
      >
        <Link
          href={`/${slug}`}
          style={{ color: "#F43F5E", fontWeight: 500, textDecoration: "none" }}
        >
          {community.name}
        </Link>
        <span style={{ color: "#A8A29E" }}>›</span>
        <span style={{ color: "#A8A29E" }}>Events</span>
        <span style={{ color: "#A8A29E" }}>›</span>
        <span style={{ color: "#78716C" }}>{event.title}</span>
      </div>

      {/* Tags + Title */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 8px",
              background: "#FFF1F2",
              borderRadius: "5px",
              color: "#F43F5E",
              fontWeight: 600,
            }}
          >
            🏃 Running
          </span>
          {event.distanceKm && (
            <span
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                background: "#FFF5F0",
                borderRadius: "5px",
                color: "#78716C",
              }}
            >
              {event.distanceKm} {event.distanceUnit}
            </span>
          )}
          {event.isRecurring && (
            <span
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                background: "#FFF5F0",
                borderRadius: "5px",
                color: "#78716C",
              }}
            >
              Weekly
            </span>
          )}
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 4px 0",
            color: "#1C1917",
            letterSpacing: "-0.02em",
          }}
        >
          {event.title}
        </h1>
        <Link
          href={`/${slug}`}
          style={{
            fontSize: "13px",
            color: "#F43F5E",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {community.name}
        </Link>
      </div>

      {/* Date/Time + Meeting Point grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        {/* Date card */}
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
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              📅
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "#A8A29E",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              When
            </span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1917" }}>
            {formattedDate}
          </div>
          <div style={{ fontSize: "12px", color: "#78716C" }}>
            {formattedTime}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#F43F5E",
              marginTop: "6px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add to calendar →
          </div>
        </div>

        {/* Meeting point card */}
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
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              📍
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "#A8A29E",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Meeting Point
            </span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1917" }}>
            {event.meetingPointName}
          </div>
          <div style={{ fontSize: "12px", color: "#78716C" }}>
            {community.city}
          </div>
          {event.meetingPointLat && event.meetingPointLng && (
            <a
              href={`https://maps.google.com/?q=${event.meetingPointLat},${event.meetingPointLng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "#F43F5E",
                marginTop: "6px",
                fontWeight: 500,
                textDecoration: "none",
                display: "block",
              }}
            >
              Open in Maps →
            </a>
          )}
        </div>
      </div>

      {/* Route link */}
      {event.routeUrl && (
        <a
          href={event.routeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "12px",
            padding: "12px 14px",
            marginBottom: "12px",
            textDecoration: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              🗺️
            </div>
            <div>
              <div
                style={{ fontSize: "12px", fontWeight: 500, color: "#1C1917" }}
              >
                View route
              </div>
              <div style={{ fontSize: "10px", color: "#A8A29E" }}>
                {event.routeUrl.replace(/^https?:\/\//, "").split("/")[0]}
              </div>
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#F43F5E", fontWeight: 500 }}>
            →
          </span>
        </a>
      )}

      {/* Afters venue card */}
      {event.postRunVenueName && (
        <div
          style={{
            background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
            border: "1px solid #FDE68A",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "80px",
              height: "80px",
              background:
                "radial-gradient(circle at top right, rgba(245,158,11,0.15), transparent)",
              borderRadius: "0 0 0 80px",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#78350F",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              🍺 Afters
            </div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#78350F",
                marginBottom: "4px",
              }}
            >
              {event.postRunVenueName}
            </div>
            {event.postRunVenueNotes && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#92400E",
                  marginBottom: "8px",
                  lineHeight: 1.5,
                }}
              >
                {event.postRunVenueNotes}
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#78350F" }}
              >
                🍺 {event.aftersCount} staying for afters
              </span>
              {event.postRunVenueUrl && (
                <a
                  href={event.postRunVenueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    color: "#B45309",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Open in Maps →
                </a>
              )}
            </div>
            <div style={{ fontSize: "9px", color: "#D97706" }}>
              You&apos;ll be asked after you RSVP
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              margin: "0 0 6px 0",
              color: "#1C1917",
            }}
          >
            About this run
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#78716C",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {event.description}
          </p>
        </div>
      )}

      {/* Pace selector + RSVP card (Client Component — includes both sections) */}
      <EventRsvp
        event={{
          id: event.id,
          paceGroups: event.paceGroups ?? [],
          postRunVenueName: event.postRunVenueName,
          goingCount: event.goingCount,
          maybeCount: event.maybeCount,
          aftersCount: event.aftersCount,
        }}
        community={{ slug: community.slug }}
        initialRsvp={
          userRsvp
            ? {
                id: userRsvp.id,
                status: userRsvp.status,
                joiningSocial: userRsvp.joiningSocial ?? false,
                paceGroup: userRsvp.paceGroup,
              }
            : null
        }
        isLoggedIn={!!user}
      />

      {/* Attendees */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              margin: 0,
              color: "#1C1917",
            }}
          >
            Who&apos;s coming
          </h3>
          <span style={{ fontSize: "11px", color: "#A8A29E" }}>
            {event.goingCount} going · {event.aftersCount} afters ·{" "}
            {event.maybeCount} maybe
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {attendees.map((a) => (
            <div
              key={a.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#FFE4E6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#F43F5E",
                  flexShrink: 0,
                }}
              >
                {a.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1C1917",
                  }}
                >
                  {a.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    marginTop: "1px",
                  }}
                >
                  {a.paceGroup && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "1px 5px",
                        background: "#FFF5F0",
                        borderRadius: "4px",
                        color: "#78716C",
                      }}
                    >
                      {a.paceGroup}
                    </span>
                  )}
                  {a.currentStreak > 0 && (
                    <span style={{ fontSize: "10px", color: "#F43F5E" }}>
                      🔥 {a.currentStreak}
                    </span>
                  )}
                </div>
              </div>
              {a.joiningSocial && <span style={{ fontSize: "12px" }}>🍺</span>}
            </div>
          ))}
        </div>
        {event.goingCount > attendees.length && (
          <button
            style={{
              width: "100%",
              padding: "8px",
              background: "none",
              border: "none",
              color: "#F43F5E",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: "6px",
            }}
          >
            View all {event.goingCount} attendees →
          </button>
        )}
      </div>

      {/* Share + Invite */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button
          style={{
            flex: 1,
            padding: "10px",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#78716C",
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#78716C"
            strokeWidth="2"
          >
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        <button
          style={{
            flex: 1,
            padding: "10px",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#78716C",
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#78716C"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Invite a friend
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          color: "#A8A29E",
          padding: "8px 0",
          borderTop: "1px solid #F5F0EB",
        }}
      >
        © 2026 runclub · Privacy · Terms · Feedback
      </div>
    </div>
  );
}
