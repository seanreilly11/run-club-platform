import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { getClubBySlug } from "@/lib/db/queries/communities";
import {
  getEventById,
  getEventAttendees,
  getUserRsvpForEvent,
} from "@/lib/db/queries/events";
import { getAuthUser } from "@/lib/supabase/server";
import { EventRsvp } from "@/components/event-page/event-rsvp";
import { VENUE_EMOJI } from "@/lib/constants";

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

  const venueEmoji = VENUE_EMOJI[community.postRunDefault] ?? "📍";

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: community.timezone,
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(event.date);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: community.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(event.date);

  return (
    <div style={{ background: "#FFFBF7", minHeight: "100%", color: "#1C1917" }}>
      <div style={{ padding: "14px 20px 28px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            fontSize: "11px",
            color: "#A8A29E",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/${slug}`}
            style={{ color: "#F43F5E", textDecoration: "none" }}
          >
            {community.name}
          </Link>
          <ChevronRight size={11} />
          <span>Events</span>
          <ChevronRight size={11} />
          <span style={{ color: "#78716C" }}>{event.title}</span>
        </div>

        {/* Tag row */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              background: "#FFE4E6",
              color: "#F43F5E",
              borderRadius: "5px",
              fontWeight: 600,
            }}
          >
            🏃 Running
          </span>
          {event.distanceKm && (
            <span
              style={{
                fontSize: "10px",
                padding: "2px 7px",
                background: "#FFF5F0",
                color: "#78716C",
                borderRadius: "5px",
              }}
            >
              {event.distanceKm}
              {event.distanceUnit}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 3px 0",
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
            display: "block",
            marginBottom: "16px",
          }}
        >
          {community.name}
        </Link>

        {/* Date + Meeting point 2-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "11px",
              padding: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <Calendar size={13} color="#F43F5E" />
              <span style={{ fontSize: "10px", color: "#A8A29E" }}>
                Date & time
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {formattedDate}
            </div>
            <div style={{ fontSize: "12px", color: "#78716C" }}>
              {formattedTime}
            </div>
          </div>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "11px",
              padding: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <MapPin size={13} color="#F43F5E" />
              <span style={{ fontSize: "10px", color: "#A8A29E" }}>
                Meeting point
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {event.meetingPointName}
            </div>
          </div>
        </div>

        {/* Afters venue card */}
        {event.postRunVenueName && (
          <div
            style={{
              background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
              border: "1px solid #FDE68A",
              borderRadius: "11px",
              padding: "14px",
              marginBottom: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#B45309",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "3px",
                  }}
                >
                  {venueEmoji} Afters
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: "#78350F",
                  }}
                >
                  {event.postRunVenueName}
                </div>
                {event.postRunVenueNotes && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#92400E",
                      marginTop: "2px",
                    }}
                  >
                    {event.postRunVenueNotes}
                  </div>
                )}
              </div>
              {event.postRunVenueUrl && (
                <Link
                  href={event.postRunVenueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    color: "#B45309",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View →
                </Link>
              )}
            </div>
            {event.aftersCount > 0 && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#92400E",
                }}
              >
                <strong>{event.aftersCount}</strong> staying for afters
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p
            style={{
              fontSize: "12px",
              color: "#78716C",
              lineHeight: 1.7,
              margin: "0 0 16px 0",
            }}
          >
            {event.description}
          </p>
        )}

        {/* RSVP card — Client Component (includes pace group selector + afters) */}
        <EventRsvp
          event={{
            id: event.id,
            paceGroups: event.paceGroups ?? [],
            postRunVenueName: event.postRunVenueName,
            postRunVenueNotes: event.postRunVenueNotes,
            goingCount: event.goingCount,
          }}
          community={{
            slug: community.slug,
            postRunDefault: community.postRunDefault,
          }}
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
        <div
          style={{
            fontSize: "11px",
            color: "#A8A29E",
            marginBottom: "8px",
          }}
        >
          {event.goingCount} going · {event.aftersCount} for afters
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {attendees.map((m) => (
            <div
              key={m.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "9px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#FFE4E6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#F43F5E",
                  flexShrink: 0,
                }}
              >
                {m.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ flex: 1, fontSize: "12px", fontWeight: 500 }}>
                {m.name}
              </span>
              {m.paceGroup && (
                <span
                  style={{
                    fontSize: "9px",
                    padding: "2px 6px",
                    background: "#FFF5F0",
                    borderRadius: "4px",
                    color: "#78716C",
                  }}
                >
                  {m.paceGroup}
                </span>
              )}
              {m.joiningSocial && (
                <span style={{ fontSize: "11px" }}>{venueEmoji}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
