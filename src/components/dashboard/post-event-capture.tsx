"use client";

import { useState } from "react";
import { savePostEventCapture } from "@/lib/actions/event";

interface PostEventCaptureProps {
  event: { id: string; title: string; date: Date };
  communitySlug: string;
}

export function PostEventCapture({
  event,
  communitySlug,
}: PostEventCaptureProps) {
  const [actual, setActual] = useState("");
  const [social, setSocial] = useState("0");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(event.date);

  async function handleSave() {
    const a = parseInt(actual, 10);
    const s = parseInt(social, 10);
    if (isNaN(a) || isNaN(s)) {
      setError("Enter valid numbers");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await savePostEventCapture({
      eventId: event.id,
      communitySlug,
      actualAttendance: a,
      actualSocialAttendance: s,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error);
    } else {
      setSaved(true);
    }
  }

  if (saved) {
    return (
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: "12px",
          padding: "14px",
          fontSize: "12px",
          color: "#166534",
          fontWeight: 600,
        }}
      >
        ✓ Attendance saved for {event.title}!
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
        border: "1px solid #FDE68A",
        borderRadius: "12px",
        padding: "14px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#78350F",
          marginBottom: "2px",
        }}
      >
        How did {event.title}&apos;s run go?
      </div>
      <div style={{ fontSize: "11px", color: "#92400E", marginBottom: "12px" }}>
        {formattedDate} · Add the final numbers
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              color: "#92400E",
              fontWeight: 600,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Showed up
          </label>
          <input
            type="number"
            min="0"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#78350F",
              textAlign: "center",
              outline: "none",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              color: "#92400E",
              fontWeight: 600,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            For afters
          </label>
          <input
            type="number"
            min="0"
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #FDE68A",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#78350F",
              textAlign: "center",
              outline: "none",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !actual || social === ""}
          style={{
            padding: "8px 16px",
            background: saving || !actual || social === "" ? "#D4D4D8" : "#B45309",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: saving || !actual ? "default" : "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            flexShrink: 0,
            height: "38px",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && (
        <p style={{ marginTop: "6px", fontSize: "11px", color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
