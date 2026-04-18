"use client";

import { useState, useEffect, useRef } from "react";
import { duplicateEvent } from "@/lib/actions/event";
import { EditEventModal } from "@/components/dashboard/edit-event-modal";
import type { DashboardEventRow } from "@/lib/db/queries/events";

interface EventsListProps {
  events: DashboardEventRow[];
  communitySlug: string;
  communityTimezone: string;
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "Upcoming", bg: "#F0FDF4", color: "#16A34A" },
  completed: { label: "Completed", bg: "#F5F0EB", color: "#78716C" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626" },
};

export function EventsList({ events, communitySlug, communityTimezone }: EventsListProps) {
  const [editingEvent, setEditingEvent] = useState<DashboardEventRow | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [duplicatedId, setDuplicatedId] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  async function handleDuplicate(event: DashboardEventRow) {
    setOpenMenuId(null);
    setDuplicating(event.id);
    const result = await duplicateEvent({ eventId: event.id, communitySlug });
    setDuplicating(null);
    if (result.success) {
      setDuplicatedId(result.data.id);
    }
  }

  return (
    <>
      {duplicatedId && (
        <div
          style={{
            padding: "10px 14px",
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#166534",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Event duplicated — scheduled for next week.</span>
          <button
            onClick={() => {
              const dup = events.find((e) => e.id === duplicatedId);
              if (dup) setEditingEvent(dup);
              setDuplicatedId(null);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "12px",
              color: "#166534",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Edit draft →
          </button>
        </div>
      )}

      <div ref={menuRef} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {events.map((event) => {
          const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.upcoming;
          const formattedDate = new Intl.DateTimeFormat("en-GB", {
            timeZone: communityTimezone,
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(event.date);

          return (
            <div
              key={event.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "11px",
                position: "relative",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1C1917",
                    marginBottom: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.title}
                </div>
                <div style={{ fontSize: "11px", color: "#A8A29E" }}>
                  {formattedDate} · {event.goingCount} RSVPs
                  {event.actualAttendance !== null && (
                    <> · {event.actualAttendance} attended</>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  background: badge.bg,
                  color: badge.color,
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              >
                {badge.label}
              </span>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                  disabled={duplicating === event.id}
                  style={{
                    background: openMenuId === event.id ? "#F5F0EB" : "none",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "16px",
                    cursor: duplicating === event.id ? "default" : "pointer",
                    color: "#A8A29E",
                    lineHeight: 1,
                    opacity: duplicating === event.id ? 0.5 : 1,
                  }}
                >
                  {duplicating === event.id ? "…" : "⋯"}
                </button>
                {openMenuId === event.id && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 4px)",
                      background: "#FFFFFF",
                      border: "1px solid #F5F0EB",
                      borderRadius: "10px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      zIndex: 20,
                      minWidth: "160px",
                      overflow: "hidden",
                    }}
                  >
                    {[
                      {
                        icon: "✏️",
                        label: "Edit event",
                        onClick: () => { setOpenMenuId(null); setEditingEvent(event); },
                      },
                      {
                        icon: "📋",
                        label: "Duplicate",
                        onClick: () => handleDuplicate(event),
                      },
                      ...(event.status === "upcoming"
                        ? [{
                            icon: "🚫",
                            label: "Cancel event",
                            onClick: () => { setOpenMenuId(null); setEditingEvent(event); },
                            danger: true,
                          }]
                        : []),
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "10px 14px",
                          background: "none",
                          border: "none",
                          fontSize: "13px",
                          color: "danger" in item && item.danger ? "#EF4444" : "#1C1917",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          communitySlug={communitySlug}
          communityTimezone={communityTimezone}
          onClose={() => setEditingEvent(null)}
          onCancelled={() => setEditingEvent(null)}
        />
      )}
    </>
  );
}
