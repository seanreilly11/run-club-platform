"use client";

import { useState } from "react";
import { joinClub } from "@/lib/actions/rsvp";

interface JoinButtonProps {
  communityId: string;
  communitySlug: string;
  memberCount: number;
  tier: "free" | "pro";
  isLoggedIn: boolean;
  isMember: boolean;
}

export function JoinButton({
  communityId,
  communitySlug,
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

  const atCap = tier === "free" && memberCount >= 30;
  const buttonLabel = atCap ? "Join waitlist" : "Join club";

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
      <p className="text-center text-[12px] font-medium" style={{ color: "#B45309" }}>
        You&apos;re on the waitlist! 🙋 We&apos;ve let the organizer know.
      </p>
    );
  }

  if (joined) {
    return (
      <p className="text-center text-[12px] font-medium" style={{ color: "#16A34A" }}>
        You&apos;re a member! 🎉
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={isJoining}
        className="w-full rounded-[12px] border border-primary px-4 py-2.5 text-[14px] font-semibold text-primary bg-white disabled:opacity-60"
      >
        {isJoining ? "Joining..." : buttonLabel}
      </button>
      {atCap && (
        <p className="mt-1 text-center text-[11px] text-text-muted">
          This club is at capacity. Join the waitlist and we&apos;ll let the organizer know.
        </p>
      )}
      {error && (
        <p className="mt-1 text-center text-[12px] text-red-600">{error}</p>
      )}
    </div>
  );
}
