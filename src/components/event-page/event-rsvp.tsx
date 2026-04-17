"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { VENUE_EMOJI } from "@/lib/constants";
import {
  createRsvp,
  updateRsvpAfters,
  updateRsvpPaceGroup,
  withdrawRsvp,
} from "@/lib/actions/rsvp";

interface EventRsvpProps {
  event: {
    id: string;
    paceGroups: Array<{ name: string; pace: string }>;
    postRunVenueName: string | null;
    postRunVenueNotes: string | null;
    goingCount: number;
  };
  community: { slug: string; postRunDefault: "pub" | "coffee" | "brunch" | "none" };
  initialRsvp: {
    id: string;
    status: "going" | "maybe";
    joiningSocial: boolean;
    paceGroup: string | null;
  } | null;
  isLoggedIn: boolean;
}

type Step = "idle" | "pace" | "afters" | "done";

export function EventRsvp({
  event,
  community,
  initialRsvp,
  isLoggedIn,
}: EventRsvpProps) {
  const [step, setStep] = useState<Step>(initialRsvp ? "done" : "idle");
  const [selectedPace, setSelectedPace] = useState<string | null>(
    initialRsvp?.paceGroup ?? null,
  );
  const [joiningSocial, setJoiningSocial] = useState(
    initialRsvp?.joiningSocial ?? false,
  );
  const [goingCount, setGoingCount] = useState(event.goingCount);
  const [error, setError] = useState<string | null>(null);

  const venueEmoji = VENUE_EMOJI[community.postRunDefault] ?? "📍";
  const hasPaceGroups = event.paceGroups.length > 0;

  function nextAfterPace() {
    setStep(event.postRunVenueName ? "afters" : "done");
  }

  async function handleRsvp() {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=/${community.slug}`;
      return;
    }
    setGoingCount((c) => c + 1);
    setStep(hasPaceGroups ? "pace" : event.postRunVenueName ? "afters" : "done");

    const result = await createRsvp({
      eventId: event.id,
      status: "going",
      communitySlug: community.slug,
    });
    if (!result.success) {
      setGoingCount((c) => c - 1);
      setStep("idle");
      setError(result.error);
    }
  }

  function handlePaceSelect(paceName: string) {
    setSelectedPace(paceName);
    void updateRsvpPaceGroup({
      eventId: event.id,
      paceGroup: paceName,
      communitySlug: community.slug,
    });
    nextAfterPace();
  }

  function handleAfters(social: boolean) {
    setJoiningSocial(social);
    void updateRsvpAfters({
      eventId: event.id,
      joiningSocial: social,
      communitySlug: community.slug,
    });
    setStep("done");
  }

  async function handleUndo() {
    const prevCount = goingCount;
    setStep("idle");
    setGoingCount((c) => c - 1);
    const result = await withdrawRsvp({
      eventId: event.id,
      communitySlug: community.slug,
    });
    if (!result.success) {
      setGoingCount(prevCount);
      setStep("done");
      setError(result.error);
    }
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #F5F0EB",
        borderRadius: "14px",
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        marginBottom: "16px",
      }}
    >
      <h3
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          margin: "0 0 10px 0",
        }}
      >
        Are you coming?
      </h3>

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

      {step === "idle" && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={handleRsvp}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "9px",
              cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              background: "#F43F5E",
              color: "white",
              border: "none",
              boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
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

      {step === "pace" && (
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#166534",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            ✓ You&apos;re in! Pick a pace group:
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              marginBottom: "8px",
            }}
          >
            {event.paceGroups.map((g) => (
              <button
                key={g.name}
                onClick={() => handlePaceSelect(g.name)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: selectedPace === g.name ? "#FFE4E6" : "#FFFFFF",
                  border: `1.5px solid ${selectedPace === g.name ? "#F43F5E" : "#F5F0EB"}`,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: "11px", color: "#78716C" }}>{g.pace}</div>
                </div>
                {selectedPace === g.name && (
                  <Check size={14} color="#F43F5E" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={nextAfterPace}
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
            Skip for now →
          </button>
        </div>
      )}

      {step === "afters" && event.postRunVenueName && (
        <div>
          <div
            style={{
              fontSize: "12px",
              color: "#166534",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            ✓ You&apos;re in!
          </div>
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
        </div>
      )}

      {step === "done" && (
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
          <Check size={14} color="#16A34A" strokeWidth={3} />
          <span
            style={{
              fontSize: "12px",
              color: "#166534",
              fontWeight: 600,
              flex: 1,
            }}
          >
            {joiningSocial && event.postRunVenueName
              ? `See you at ${event.postRunVenueName}! 🎉`
              : "See you at the start line! 🏃"}
          </span>
          <div style={{ textAlign: "center", minWidth: "44px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "#1C1917",
              }}
            >
              {goingCount}
            </div>
            <div style={{ fontSize: "9px", color: "#A8A29E" }}>going</div>
          </div>
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
  );
}
