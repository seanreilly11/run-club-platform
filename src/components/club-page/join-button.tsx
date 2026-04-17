"use client";

import { useState } from "react";
import { joinClub } from "@/lib/actions/rsvp";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";

interface JoinButtonProps {
  communityId: string;
  communitySlug: string;
  communityName: string;
  memberCount: number;
  tier: "free" | "pro";
  isLoggedIn: boolean;
  isMember: boolean;
}

export function JoinButton({
  communityId,
  communitySlug,
  communityName,
  memberCount,
  tier,
  isLoggedIn,
  isMember,
}: JoinButtonProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isMember) return null;

  const atCap = tier === "free" && memberCount >= FREE_TIER_MEMBER_LIMIT;

  async function handleJoin() {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=/${communitySlug}`;
      return;
    }
    setIsJoining(true);
    setError(null);
    const result = await joinClub({ communityId, communitySlug });
    setIsJoining(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    if (result.data.waitlisted) {
      setWaitlisted(true);
    } else {
      setJoined(true);
    }
  }

  if (waitlisted) {
    return (
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
          color: "#B45309",
        }}
      >
        You&apos;re on the waitlist! 🙋 We&apos;ve let the organizer know.
      </p>
    );
  }

  if (joined) {
    return (
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
          color: "#16A34A",
        }}
      >
        You&apos;re a member! 🎉
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={isJoining}
        style={{
          width: "100%",
          padding: "11px",
          background: "#FFFFFF",
          color: "#F43F5E",
          border: "1.5px solid #FECDD3",
          borderRadius: "14px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: isJoining ? "default" : "pointer",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          opacity: isJoining ? 0.6 : 1,
        }}
      >
        {isJoining
          ? "Joining..."
          : atCap
            ? `Join waitlist`
            : `Join ${communityName}`}
      </button>
      {atCap && (
        <p
          style={{
            marginTop: "4px",
            textAlign: "center",
            fontSize: "11px",
            color: "#78716C",
          }}
        >
          This club is at capacity. Join the waitlist and we&apos;ll let the
          organizer know.
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: "4px",
            textAlign: "center",
            fontSize: "12px",
            color: "#DC2626",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
