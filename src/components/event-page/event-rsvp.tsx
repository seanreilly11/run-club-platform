"use client";

import { useState } from "react";
import {
  createRsvp,
  updateRsvpAfters,
  updateRsvpStatus,
  withdrawRsvp,
} from "@/lib/actions/rsvp";

interface PaceGroup {
  name: string;
  pace: string;
}

interface EventRsvpProps {
  event: {
    id: string;
    paceGroups: PaceGroup[];
    postRunVenueName: string | null;
    goingCount: number;
    maybeCount: number;
    aftersCount: number;
  };
  community: { slug: string };
  initialRsvp: {
    id: string;
    status: "going" | "maybe";
    joiningSocial: boolean;
    paceGroup: string | null;
  } | null;
  isLoggedIn: boolean;
}

export function EventRsvp({
  event,
  community,
  initialRsvp,
  isLoggedIn,
}: EventRsvpProps) {
  const [rsvpState, setRsvpState] = useState<"none" | "going" | "maybe">(
    initialRsvp ? initialRsvp.status : "none",
  );
  const [selectedPace, setSelectedPace] = useState<string | null>(
    initialRsvp?.paceGroup ?? null,
  );
  const [joinAfters, setJoinAfters] = useState(
    initialRsvp?.joiningSocial ?? false,
  );
  const [goingCount, setGoingCount] = useState(event.goingCount);
  const [maybeCount, setMaybeCount] = useState(event.maybeCount);
  const [error, setError] = useState<string | null>(null);

  const hasPaceGroups = event.paceGroups.length > 0;

  async function handleRsvp(status: "going" | "maybe") {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=/${community.slug}`;
      return;
    }
    if (rsvpState === status) return;
    const prevState = rsvpState;
    setRsvpState(status);
    if (status === "going") {
      setGoingCount((c) => c + 1);
      if (prevState === "maybe") setMaybeCount((c) => c - 1);
    } else {
      setMaybeCount((c) => c + 1);
      if (prevState === "going") setGoingCount((c) => c - 1);
    }

    const result = await createRsvp({
      eventId: event.id,
      status,
      communitySlug: community.slug,
    });
    if (!result.success) {
      setRsvpState(prevState);
      if (status === "going") {
        setGoingCount((c) => c - 1);
        if (prevState === "maybe") setMaybeCount((c) => c + 1);
      } else {
        setMaybeCount((c) => c - 1);
        if (prevState === "going") setGoingCount((c) => c + 1);
      }
      setError(result.error);
    }
  }

  async function handleAftersToggle() {
    const next = !joinAfters;
    setJoinAfters(next);
    void updateRsvpAfters({
      eventId: event.id,
      joiningSocial: next,
      communitySlug: community.slug,
    });
  }

  async function handleChangeStatus() {
    const next = rsvpState === "going" ? "maybe" : "going";
    const prev = rsvpState;
    setRsvpState(next);
    if (next === "going") {
      setGoingCount((c) => c + 1);
      setMaybeCount((c) => c - 1);
    } else {
      setMaybeCount((c) => c + 1);
      setGoingCount((c) => c - 1);
    }
    const result = await updateRsvpStatus({
      eventId: event.id,
      status: next,
      communitySlug: community.slug,
    });
    if (!result.success) {
      setRsvpState(prev);
      if (next === "going") {
        setGoingCount((c) => c - 1);
        setMaybeCount((c) => c + 1);
      } else {
        setMaybeCount((c) => c - 1);
        setGoingCount((c) => c + 1);
      }
      setError(result.error);
    }
  }

  async function handleUndo() {
    const prev = rsvpState;
    const prevGoing = goingCount;
    const prevMaybe = maybeCount;
    setRsvpState("none");
    if (prev === "going") setGoingCount((c) => c - 1);
    else setMaybeCount((c) => c - 1);

    const result = await withdrawRsvp({
      eventId: event.id,
      communitySlug: community.slug,
    });
    if (!result.success) {
      setRsvpState(prev);
      setGoingCount(prevGoing);
      setMaybeCount(prevMaybe);
      setError(result.error);
    }
  }

  return (
    <>
      {/* Pace group selector — standalone section */}
      {hasPaceGroups && (
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              margin: "0 0 4px 0",
              color: "#1C1917",
            }}
          >
            Choose your pace group
          </h3>
          <p
            style={{
              fontSize: "11px",
              color: "#A8A29E",
              margin: "0 0 8px 0",
            }}
          >
            Pick a group so the organizer knows where you&apos;ll be
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {event.paceGroups.map((g) => {
              const selected = selectedPace === g.name;
              return (
                <button
                  key={g.name}
                  onClick={() => setSelectedPace(selected ? null : g.name)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    background: selected ? "#FFF1F2" : "#FFFFFF",
                    border: `1.5px solid ${selected ? "#F43F5E" : "#F5F0EB"}`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `2px solid ${selected ? "#F43F5E" : "#A8A29E"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: selected ? "#F43F5E" : "transparent",
                        flexShrink: 0,
                      }}
                    >
                      {selected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1917" }}>{g.name}</div>
                      <div style={{ fontSize: "11px", color: "#78716C" }}>{g.pace}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RSVP Card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        {error && (
          <p
            style={{
              marginBottom: "10px",
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

        {rsvpState === "none" ? (
          <>
            <h3
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                margin: "0 0 10px 0",
                color: "#1C1917",
              }}
            >
              Are you coming?
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleRsvp("going")}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: "#F43F5E",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  cursor: "pointer",
                  boxShadow: "0 3px 14px rgba(244,63,94,0.3)",
                }}
              >
                I&apos;m in! 🏃
              </button>
              <button
                onClick={() => handleRsvp("maybe")}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "#FFFFFF",
                  color: "#78716C",
                  border: "1.5px solid #F5F0EB",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Maybe
              </button>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#A8A29E",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {goingCount} going · {maybeCount} maybe
            </div>
          </>
        ) : (
          <div>
            {/* Confirmation badge */}
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#166534" }}>
                  {rsvpState === "going" ? "You're in! 🎉" : "Maybe — we'll save you a spot"}
                </div>
                {selectedPace && (
                  <div style={{ fontSize: "11px", color: "#15803D" }}>Pace: {selectedPace}</div>
                )}
              </div>
            </div>

            {/* Afters toggle */}
            {event.postRunVenueName && (
              <div
                onClick={handleAftersToggle}
                style={{
                  background: joinAfters ? "#FEF3C7" : "#FFF5F0",
                  border: `1px solid ${joinAfters ? "#FDE68A" : "#F5F0EB"}`,
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>🍺</span>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: joinAfters ? "#78350F" : "#1C1917",
                      }}
                    >
                      Staying for afters?
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: joinAfters ? "#92400E" : "#A8A29E",
                      }}
                    >
                      {event.postRunVenueName} · {event.aftersCount} others are
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: joinAfters ? "#16A34A" : "#D1D5DB",
                    padding: "2px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      transform: joinAfters ? "translateX(18px)" : "translateX(0)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Change / Undo */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
              <span
                onClick={handleChangeStatus}
                style={{ color: "#F43F5E", cursor: "pointer", fontWeight: 500 }}
              >
                Change to {rsvpState === "going" ? "Maybe" : "Going"}
              </span>
              <span
                onClick={handleUndo}
                style={{ color: "#A8A29E", cursor: "pointer" }}
              >
                Undo
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
