"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { EditClubModal } from "@/components/dashboard/edit-club-modal";

interface SettingsRow {
  label: string;
  description: string;
  href?: string;
  proOnly?: boolean;
  isClubDetails?: boolean;
}

interface SettingsListProps {
  rows: SettingsRow[];
  community: {
    slug: string;
    name: string;
    city: string;
    description: string | null;
    vibe: "competitive" | "social" | "casual";
    postRunDefault: "pub" | "coffee" | "brunch" | "none";
    instagramHandle: string | null;
  };
  isFree: boolean;
}

export function SettingsList({ rows, community, isFree }: SettingsListProps) {
  const [showClubModal, setShowClubModal] = useState(false);

  const rowStyle = (locked: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#FFFFFF",
    border: "1px solid #F5F0EB",
    borderRadius: "12px",
    textDecoration: "none",
    opacity: locked ? 0.7 : 1,
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box" as const,
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {rows.map((row) => {
          const isLocked = !!row.proOnly && isFree;
          const href = isLocked ? `/dashboard/${community.slug}/settings/billing` : (row.href ?? "#");

          const inner = (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1C1917",
                    marginBottom: "1px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {row.label}
                  {isLocked && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "9px",
                        fontWeight: 600,
                        padding: "1px 5px",
                        background: "#FFE4E6",
                        color: "#F43F5E",
                        borderRadius: "4px",
                      }}
                    >
                      <Lock size={8} /> PRO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", color: "#A8A29E" }}>{row.description}</div>
              </div>
              <ChevronRight size={14} color="#A8A29E" />
            </>
          );

          if (row.isClubDetails) {
            return (
              <button
                key={row.label}
                onClick={() => setShowClubModal(true)}
                style={{ ...rowStyle(isLocked), textAlign: "left" }}
              >
                {inner}
              </button>
            );
          }

          return (
            <Link key={row.label} href={href} style={rowStyle(isLocked)}>
              {inner}
            </Link>
          );
        })}
      </div>

      {showClubModal && (
        <EditClubModal community={community} onClose={() => setShowClubModal(false)} />
      )}
    </>
  );
}
