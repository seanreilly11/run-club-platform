"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { VENUE_EMOJI } from "@/lib/constants";
import {
  createRsvp,
  updateRsvpAfters,
  withdrawRsvp,
} from "@/lib/actions/rsvp";
import type { UpcomingEventRow } from "@/lib/db/queries/events";
import type { communities } from "@/lib/db/schema";

type Community = typeof communities.$inferSelect;

interface NextEventCardProps {
  event: UpcomingEventRow;
  community: Pick<
    Community,
    "id" | "slug" | "name" | "tier" | "themeColor" | "postRunDefault" | "timezone"
  >;
  initialRsvp: { id: string; status: "going" | "maybe"; joiningSocial: boolean } | null;
  isLoggedIn: boolean;
}

type RsvpDisplay = "going+social" | "going" | null;

function formatEventDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getDaysUntil(date: Date): string {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export function NextEventCard({
  event,
  community,
  initialRsvp,
  isLoggedIn,
}: NextEventCardProps) {
  const [rsvp, setRsvp] = useState<RsvpDisplay>(
    initialRsvp
      ? initialRsvp.joiningSocial
        ? "going+social"
        : "going"
      : null,
  );
  const [showAfters, setShowAfters] = useState(false);
  const [goingCount, setGoingCount] = useState(event.goingCount);
  const [rsvpId, setRsvpId] = useState<string | null>(initialRsvp?.id ?? null);
  const [error, setError] = useState<string | null>(null);

  const sunriseGradient =
    "linear-gradient(to right, #F59E0B, #F97066, #F43F5E)";
  const accentBg =
    community.tier === "pro" && community.themeColor
      ? community.themeColor
      : sunriseGradient;

  const venueEmoji = VENUE_EMOJI[community.postRunDefault] ?? "📍";

  async function handleRsvp() {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=/${community.slug}`;
      return;
    }
    setRsvp("going");
    setShowAfters(true);
    setGoingCount((c) => c + 1);

    const result = await createRsvp({
      eventId: event.id,
      status: "going",
      communitySlug: community.slug,
    });

    if (!result.success) {
      setRsvp(null);
      setShowAfters(false);
      setGoingCount((c) => c - 1);
      setError(result.error);
    } else {
      setRsvpId(result.data.rsvpId);
    }
  }

  async function handleAfters(joiningSocial: boolean) {
    setRsvp(joiningSocial ? "going+social" : "going");
    setShowAfters(false);
    void updateRsvpAfters({
      eventId: event.id,
      joiningSocial,
      communitySlug: community.slug,
    });
  }

  async function handleUndo() {
    const prevRsvp = rsvp;
    const prevCount = goingCount;
    setRsvp(null);
    setShowAfters(false);
    setGoingCount((c) => c - 1);

    const result = await withdrawRsvp({
      eventId: event.id,
      communitySlug: community.slug,
    });
    if (!result.success) {
      setRsvp(prevRsvp);
      setGoingCount(prevCount);
      setError(result.error);
    } else {
      setRsvpId(null);
    }
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.35s ease forwards; }
      `}</style>

      <div
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #FECDD3",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 2px 12px rgba(244,63,94,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sunrise accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: accentBg,
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#F43F5E",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Next run
            </span>
            <span style={{ fontSize: "10px", color: "#A8A29E" }}>
              {getDaysUntil(event.date)}
            </span>
          </div>
          <Link
            href={`/${community.slug}/events/${event.id}`}
            style={{
              fontSize: "11px",
              color: "#F43F5E",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            Details ›
          </Link>
        </div>

        {/* Event title */}
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 6px 0",
            color: "#1C1917",
          }}
        >
          {event.title}
        </h3>

        {/* Date + distance */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: "12px",
            color: "#78716C",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <span>{formatEventDate(event.date, community.timezone)}</span>
          {event.distanceKm && (
            <span
              style={{
                padding: "1px 6px",
                background: "#FFF5F0",
                borderRadius: "5px",
                fontSize: "10px",
              }}
            >
              {event.distanceKm}
              {event.distanceUnit}
            </span>
          )}
        </div>

        {/* Meeting point */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            fontSize: "12px",
            color: "#78716C",
            marginBottom: "10px",
          }}
        >
          <MapPin size={12} color="#A8A29E" />
          {event.meetingPointName}
        </div>

        {/* Pace group pills */}
        {event.paceGroups && event.paceGroups.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {event.paceGroups.map((pg) => (
              <span
                key={pg.name}
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  background: "#FFF5F0",
                  color: "#78716C",
                  borderRadius: "6px",
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        )}

        {/* Afters venue card */}
        {event.postRunVenueName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 10px",
              background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
              border: "1px solid #FDE68A",
              borderRadius: "9px",
              marginBottom: "14px",
            }}
          >
            <span>{venueEmoji}</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#78350F",
                flex: 1,
              }}
            >
              Afters at {event.postRunVenueName}
            </span>
            {event.aftersCount > 0 && (
              <span style={{ fontSize: "10px", color: "#92400E" }}>
                {event.aftersCount} going
              </span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <p
            style={{
              marginBottom: "8px",
              padding: "8px 12px",
              background: "#FEF2F2",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#DC2626",
            }}
          >
            {error}
          </p>
        )}

        {/* Default state: RSVP button + going count */}
        {!rsvp && !showAfters && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handleRsvp}
              style={{
                flex: 1,
                padding: "12px",
                background: "#F43F5E",
                color: "white",
                border: "none",
                borderRadius: "11px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: "0 3px 14px rgba(244,63,94,0.3)",
              }}
            >
              I&apos;m in! 🏃
            </button>
            <div style={{ textAlign: "center", minWidth: "44px" }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "#1C1917",
                }}
              >
                {goingCount}
              </div>
              <div style={{ fontSize: "9px", color: "#A8A29E" }}>going</div>
            </div>
          </div>
        )}

        {/* After clicking I'm in: confirmation + afters prompt */}
        {showAfters && (
          <div className="slide-down">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 10px",
                background: "#F0FDF4",
                borderRadius: "9px",
                border: "1px solid #BBF7D0",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>✓</span>
              <span
                style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}
              >
                You&apos;re in! 🎉
              </span>
            </div>

            {event.postRunVenueName && (
              <div
                style={{
                  background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
                  border: "1px solid #FDE68A",
                  borderRadius: "11px",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78350F",
                    marginBottom: "8px",
                  }}
                >
                  {venueEmoji} Staying for afters at {event.postRunVenueName}?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleAfters(true)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      background: "#B45309",
                      color: "white",
                      border: "none",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    Count me in! {venueEmoji}
                  </button>
                  <button
                    onClick={() => handleAfters(false)}
                    style={{
                      padding: "9px 14px",
                      background: "rgba(255,255,255,0.7)",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Just the run
                  </button>
                </div>
              </div>
            )}

            {/* No afters venue — skip straight */}
            {!event.postRunVenueName && (
              <button
                onClick={() => { setShowAfters(false); }}
                style={{
                  fontSize: "11px",
                  color: "#A8A29E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                }}
              >
                Done
              </button>
            )}
          </div>
        )}

        {/* Final confirmed state */}
        {rsvp && !showAfters && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 12px",
              background: "#F0FDF4",
              borderRadius: "10px",
              border: "1px solid #BBF7D0",
            }}
          >
            <span style={{ fontSize: "14px" }}>✓</span>
            <span
              style={{
                fontSize: "12px",
                color: "#166534",
                fontWeight: 600,
                flex: 1,
              }}
            >
              {rsvp === "going+social" && event.postRunVenueName
                ? `See you at ${event.postRunVenueName}! 🎉`
                : "See you at the start line! 🏃"}
            </span>
            <button
              onClick={handleUndo}
              style={{
                fontSize: "10px",
                color: "#A8A29E",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
