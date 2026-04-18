"use client";

import { useState } from "react";
import type { DashboardMemberRow } from "@/lib/db/queries/memberships";

interface MembersListProps {
  members: DashboardMemberRow[];
  communitySlug: string;
  isFree: boolean;
  freeLimit: number;
}

type FilterTab = "all" | "active" | "at_risk" | "lapsed" | "new";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "at_risk", label: "At risk" },
  { value: "lapsed", label: "Lapsed" },
  { value: "new", label: "New" },
];

const ROLE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  owner: { label: "Owner", bg: "#FFE4E6", color: "#F43F5E" },
  admin: { label: "Admin", bg: "#EDE9FE", color: "#7C3AED" },
  member: { label: "Member", bg: "#F5F0EB", color: "#78716C" },
  waitlisted: { label: "Waitlisted", bg: "#FEF3C7", color: "#B45309" },
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#16A34A" },
  new: { label: "New", color: "#8B5CF6" },
  at_risk: { label: "At risk", color: "#F59E0B" },
  lapsed: { label: "Lapsed", color: "#DC2626" },
};

export function MembersList({ members, communitySlug, isFree, freeLimit }: MembersListProps) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const activeMembers = members.filter((m) => m.role !== "waitlisted");
  const waitlisted = members.filter((m) => m.role === "waitlisted");

  const filteredMembers = filter === "all"
    ? activeMembers
    : activeMembers.filter((m) => m.status === filter);

  const exportUrl = `/api/dashboard/${communitySlug}/members/export?filter=${filter}`;

  return (
    <>
      {/* Filter tabs + export */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                padding: "5px 10px",
                borderRadius: "7px",
                border: filter === tab.value ? "1.5px solid #F43F5E" : "1px solid #F5F0EB",
                background: filter === tab.value ? "#FFF5F0" : "#FFFFFF",
                fontSize: "11px",
                fontWeight: filter === tab.value ? 700 : 500,
                color: filter === tab.value ? "#F43F5E" : "#78716C",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isFree ? (
          <button
            title="Upgrade to Pro to export CSV"
            disabled
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "7px 12px",
              background: "#FFFFFF",
              color: "#A8A29E",
              border: "1px solid #F5F0EB",
              borderRadius: "9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "default",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            ⬇ CSV (PRO)
          </button>
        ) : (
          <a
            href={exportUrl}
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "7px 12px",
              background: "#FFFFFF",
              color: "#78716C",
              border: "1px solid #F5F0EB",
              borderRadius: "9px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            ⬇ Export CSV
          </a>
        )}
      </div>

      {filteredMembers.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "12px",
            fontSize: "13px",
            color: "#78716C",
          }}
        >
          No members in this category
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {filteredMembers.map((m) => {
            const roleBadge = ROLE_BADGE[m.role];
            const statusBadge = m.status ? STATUS_BADGE[m.status] : null;

            return (
              <div
                key={m.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#FFE4E6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#F43F5E",
                    flexShrink: 0,
                  }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1C1917",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#A8A29E" }}>
                    {m.eventsAttended} runs
                    {m.showRate !== null && (
                      <> · {Math.round(parseFloat(m.showRate) * 100)}% show rate</>
                    )}
                    {m.currentStreak > 0 && <> · {m.currentStreak}wk streak</>}
                    {m.preferredPaceGroup && <> · {m.preferredPaceGroup}</>}
                  </div>
                </div>
                {statusBadge && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      color: statusBadge.color,
                      flexShrink: 0,
                    }}
                  >
                    {statusBadge.label}
                  </span>
                )}
                {roleBadge && m.role !== "member" && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      padding: "2px 6px",
                      background: roleBadge.bg,
                      color: roleBadge.color,
                      borderRadius: "4px",
                      flexShrink: 0,
                    }}
                  >
                    {roleBadge.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Waitlist — only shown when filter is "all" */}
      {filter === "all" && waitlisted.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#B45309",
            }}
          >
            Waitlist ({waitlisted.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {waitlisted.map((m) => (
              <div
                key={m.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "#FEF3C7",
                  border: "1px solid #FDE68A",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#FDE68A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#B45309",
                    flexShrink: 0,
                  }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: "#78350F" }}>
                  {m.name}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    background: "#FEF3C7",
                    color: "#B45309",
                    border: "1px solid #FDE68A",
                    borderRadius: "4px",
                  }}
                >
                  Waitlisted
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
