"use client";

import { useState } from "react";
import { updateEvent, cancelEvent } from "@/lib/actions/event";

interface PaceGroup {
  name: string;
  pace: string;
}

interface EditEventModalProps {
  event: {
    id: string;
    title: string;
    date: Date;
    meetingPointName: string;
    distanceKm: string | null;
    distanceUnit: string;
    routeUrl: string | null;
    postRunVenueName: string | null;
    postRunVenueUrl: string | null;
    postRunVenueNotes: string | null;
    paceGroups: PaceGroup[] | null;
    description: string | null;
    status: string;
  };
  communitySlug: string;
  communityTimezone: string;
  onClose: () => void;
  onCancelled: () => void;
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "10px",
    border: "1.5px solid #F5F0EB",
    fontSize: "13px",
    background: "#FFFBF7",
    outline: "none",
    boxSizing: "border-box" as const,
    color: "#1C1917",
    fontFamily: "'DM Sans', sans-serif",
    ...extra,
  };
}

function labelStyle(): React.CSSProperties {
  return { fontSize: "13px", fontWeight: 600, display: "block" as const, marginBottom: "4px", color: "#1C1917" };
}

export function EditEventModal({
  event,
  communitySlug,
  communityTimezone,
  onClose,
  onCancelled,
}: EditEventModalProps) {
  const dateObj = new Date(event.date);
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: communityTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
  const localTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: communityTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(localDate);
  const [time, setTime] = useState(localTime);
  const [meetingPoint, setMeetingPoint] = useState(event.meetingPointName);
  const [distance, setDistance] = useState(event.distanceKm ?? "");
  const [routeUrl, setRouteUrl] = useState(event.routeUrl ?? "");
  const [venueName, setVenueName] = useState(event.postRunVenueName ?? "");
  const [venueNotes, setVenueNotes] = useState(event.postRunVenueNotes ?? "");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateEvent({
      eventId: event.id,
      communitySlug,
      title,
      date,
      time,
      meetingPointName: meetingPoint,
      distanceKm: distance || "",
      distanceUnit: event.distanceUnit as "km" | "mi",
      routeUrl,
      postRunVenueName: venueName,
      postRunVenueNotes: venueNotes,
      paceGroups: event.paceGroups ?? undefined,
      description: event.description ?? "",
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(onClose, 1200);
    } else {
      setError(result.error);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    const result = await cancelEvent({ eventId: event.id, communitySlug });
    setCancelling(false);
    if (result.success) {
      setCancelled(true);
      setTimeout(onCancelled, 1500);
    } else {
      setError(result.error);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFBF7",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #F5F0EB",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "16px 16px 0 0",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
                color: "#1C1917",
              }}
            >
              Edit Event
            </h2>
            <p style={{ fontSize: "11px", color: "#78716C", margin: "2px 0 0 0" }}>
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#A8A29E",
              padding: "4px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          {cancelled ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: "#1C1917",
                }}
              >
                Event cancelled
              </div>
              <div style={{ fontSize: "13px", color: "#78716C" }}>
                Members who RSVP&apos;d will be notified by email.
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#FEF2F2",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#DC2626",
                    marginBottom: "14px",
                  }}
                >
                  {error}
                </div>
              )}
              {saved && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "#F0FDF4",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#166534",
                    marginBottom: "14px",
                  }}
                >
                  ✓ Event updated!
                </div>
              )}

              {/* Title */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle()}>
                  Event title <span style={{ color: "#F43F5E" }}>*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle({ fontSize: "14px" })}
                />
              </div>

              {/* Date + Time */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label style={labelStyle()}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle()}>Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Meeting point */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle()}>Meeting point</label>
                <input
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  style={inputStyle({ fontSize: "14px" })}
                />
              </div>

              {/* Distance + Route */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label style={labelStyle()}>Distance (km)</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle()}>Route link</label>
                  <input
                    value={routeUrl}
                    onChange={(e) => setRouteUrl(e.target.value)}
                    placeholder="https://…"
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Afters */}
              <div
                style={{
                  padding: "14px",
                  background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
                  border: "1px solid #FDE68A",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#78350F",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Afters venue
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ ...labelStyle(), color: "#78350F" }}>Venue name</label>
                  <input
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    style={inputStyle({ border: "1.5px solid #FDE68A" })}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle(), color: "#78350F" }}>Notes</label>
                  <input
                    value={venueNotes}
                    onChange={(e) => setVenueNotes(e.target.value)}
                    placeholder="e.g. Happy hour until 8pm"
                    style={inputStyle({ border: "1.5px solid #FDE68A" })}
                  />
                </div>
              </div>

              {/* Save / Discard */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 2,
                    padding: "12px",
                    background: "#F43F5E",
                    color: "white",
                    border: "none",
                    borderRadius: "11px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: saving ? "default" : "pointer",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#FFFFFF",
                    color: "#78716C",
                    border: "1.5px solid #F5F0EB",
                    borderRadius: "11px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Discard
                </button>
              </div>

              {/* Danger zone — only for upcoming events */}
              {event.status === "upcoming" && (
                <div
                  style={{
                    padding: "14px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: "13px", fontWeight: 600, color: "#EF4444" }}
                      >
                        Cancel this event
                      </div>
                      <div style={{ fontSize: "11px", color: "#991B1B" }}>
                        Members who RSVP&apos;d will be notified
                      </div>
                    </div>
                    {!showCancel ? (
                      <button
                        onClick={() => setShowCancel(true)}
                        style={{
                          padding: "6px 14px",
                          background: "white",
                          border: "1.5px solid #FECACA",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#EF4444",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Cancel event
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={handleCancel}
                          disabled={cancelling}
                          style={{
                            padding: "6px 14px",
                            background: "#EF4444",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "white",
                            cursor: cancelling ? "default" : "pointer",
                          }}
                        >
                          {cancelling ? "…" : "Yes, cancel it"}
                        </button>
                        <button
                          onClick={() => setShowCancel(false)}
                          style={{
                            padding: "6px 14px",
                            background: "white",
                            border: "1px solid #F5F0EB",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "#78716C",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Never mind
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
