"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_TIER_MEMBER_LIMIT } from "@/lib/constants";

interface MemberProgressProps {
  memberCount: number;
  waitlistedCount: number;
  communitySlug: string;
}

export function MemberProgress({
  memberCount,
  waitlistedCount,
  communitySlug,
}: MemberProgressProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((memberCount / FREE_TIER_MEMBER_LIMIT) * 100, 100);

  // Animate on mount
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);

  const barColor = pct >= 90 ? "#F59E0B" : "#F43F5E";
  const isNearCap = pct >= 67 && pct < 90;
  const isAtCap = memberCount >= FREE_TIER_MEMBER_LIMIT;

  let label: React.ReactNode;
  if (isAtCap) {
    label = (
      <span style={{ fontSize: "11px", color: "#F43F5E", fontWeight: 600 }}>
        Club is full — new members are being waitlisted.{" "}
        <Link
          href={`/dashboard/${communitySlug}/settings`}
          style={{ textDecoration: "underline" }}
        >
          Upgrade to Pro →
        </Link>
      </span>
    );
  } else if (isNearCap) {
    label = (
      <span style={{ fontSize: "11px", color: "#F59E0B" }}>
        Getting close! {memberCount} of {FREE_TIER_MEMBER_LIMIT} members
      </span>
    );
  } else {
    label = (
      <span style={{ fontSize: "11px", color: "#A8A29E" }}>
        {memberCount} of {FREE_TIER_MEMBER_LIMIT} members
      </span>
    );
  }

  return (
    <>
      {/* Progress card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "12px",
          padding: "14px",
          marginBottom: waitlistedCount > 0 ? "8px" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#1C1917",
            }}
          >
            {memberCount} / {FREE_TIER_MEMBER_LIMIT} members
          </span>
          <span style={{ fontSize: "10px", color: "#A8A29E" }}>Free plan</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#FFF5F0",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${width}%`,
              background: barColor,
              borderRadius: "999px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div style={{ marginTop: "6px" }}>{label}</div>
      </div>

      {/* Waitlist banner */}
      {waitlistedCount > 0 && (
        <div
          style={{
            background: "#FFF1F2",
            border: "1px solid #FECDD3",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#F43F5E",
                marginBottom: "2px",
              }}
            >
              {waitlistedCount}{" "}
              {waitlistedCount === 1 ? "person is" : "people are"} waiting to
              join
            </div>
            <div style={{ fontSize: "12px", color: "#78716C" }}>
              Your club has reached the 30-member limit on the free plan.
            </div>
          </div>
          <Link
            href={`/dashboard/${communitySlug}/settings`}
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              background: "#F43F5E",
              color: "white",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              boxShadow: "0 2px 8px rgba(244,63,94,0.3)",
            }}
          >
            Upgrade →
          </Link>
        </div>
      )}
    </>
  );
}
