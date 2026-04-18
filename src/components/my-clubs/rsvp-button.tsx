"use client";

import { useState } from "react";
import { createRsvp } from "@/lib/actions/rsvp";

interface MyClubsRsvpButtonProps {
  eventId: string;
  communitySlug: string;
  initialStatus: "going" | "maybe" | null;
  initialJoiningSocial: boolean;
}

export function MyClubsRsvpButton({
  eventId,
  communitySlug,
  initialStatus,
  initialJoiningSocial,
}: MyClubsRsvpButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [joiningSocial] = useState(initialJoiningSocial);
  const [loading, setLoading] = useState(false);

  const isGoing = status === "going" || status === "maybe";

  async function handleRsvp() {
    setLoading(true);
    setStatus("going");
    const result = await createRsvp({
      eventId,
      status: "going",
      communitySlug,
    });
    if (!result.success) setStatus(null);
    setLoading(false);
  }

  if (isGoing) {
    return (
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "8px",
          }}
        >
          <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 700 }}>
            ✓
          </span>
          <span style={{ fontSize: "11px", color: "#166534", fontWeight: 600 }}>
            Going
          </span>
        </div>
        {joiningSocial && (
          <div
            style={{
              fontSize: "9px",
              color: "#B45309",
              marginTop: "3px",
              textAlign: "right",
            }}
          >
            + afters 🍺
          </div>
        )}
      </div>
    );
  }

  return (
    <span onClick={(ev) => ev.preventDefault()}>
      <button
        onClick={handleRsvp}
        disabled={loading}
        style={{
          padding: "6px 14px",
          background: loading ? "#F5F0EB" : "#F43F5E",
          color: loading ? "#A8A29E" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          boxShadow: loading ? "none" : "0 2px 8px rgba(244,63,94,0.25)",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "..." : "I'm in! 🏃"}
      </button>
    </span>
  );
}
