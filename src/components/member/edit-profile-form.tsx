"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/user";

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    pacePreference: string | null;
  };
}

const PACE_OPTIONS = [
  { value: "< 5:00/km", label: "< 5:00/km" },
  { value: "5:00–6:00/km", label: "5:00–6:00/km" },
  { value: "6:00+/km", label: "6:00+/km" },
  { value: "No preference", label: "No preference" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1.5px solid #F5F0EB",
    fontSize: "14px",
    background: "#FFFBF7",
    outline: "none",
    boxSizing: "border-box" as const,
    color: "#1C1917",
    fontFamily: "'DM Sans', sans-serif",
    ...extra,
  };
}

function labelStyle(): React.CSSProperties {
  return {
    fontSize: "13px",
    fontWeight: 600,
    display: "block" as const,
    marginBottom: "5px",
    color: "#1C1917",
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [pacePreference, setPacePreference] = useState(user.pacePreference ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateProfile({ name, pacePreference: pacePreference || null });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      {/* Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "#F43F5E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: "white",
            marginBottom: "8px",
          }}
        >
          {initials(name || user.name)}
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "12px",
            color: "#F43F5E",
            cursor: "not-allowed",
            fontWeight: 600,
            opacity: 0.6,
          }}
          disabled
          title="Photo upload coming soon"
        >
          Change photo
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px 12px",
            background: "#FEF2F2",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#DC2626",
            marginBottom: "16px",
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
            marginBottom: "16px",
          }}
        >
          ✓ Profile saved!
        </div>
      )}

      {/* Name */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle()}>
          Name <span style={{ color: "#F43F5E" }}>*</span>
        </label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle()} />
      </div>

      {/* Email (read-only) */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle()}>Email</label>
        <input
          value={user.email}
          readOnly
          style={inputStyle({ background: "#F5F0EB", color: "#A8A29E", cursor: "not-allowed" })}
        />
        <p style={{ fontSize: "11px", color: "#A8A29E", margin: "4px 0 0 0" }}>
          Email can&apos;t be changed here. Contact support if needed.
        </p>
      </div>

      {/* Pace preference */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle()}>Pace preference</label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {PACE_OPTIONS.map((opt) => {
            const active = pacePreference === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setPacePreference(active ? "" : opt.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: active ? "2px solid #F43F5E" : "1.5px solid #F5F0EB",
                  background: active ? "#FFF5F0" : "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#F43F5E" : "#78716C",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "13px",
          background: "#F43F5E",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: saving ? "default" : "pointer",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
          opacity: saving ? 0.7 : 1,
          marginBottom: "24px",
        }}
      >
        {saving ? "Saving…" : "Save profile"}
      </button>

      {/* Account section */}
      <div
        style={{
          padding: "16px",
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: "10px",
          }}
        >
          Account
        </div>
        {[
          { label: "Change password" },
          { label: "Notification preferences" },
          { label: "Delete account", danger: true },
        ].map((item) => (
          <button
            key={item.label}
            disabled
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "9px 0",
              background: "none",
              border: "none",
              borderBottom: "1px solid #F5F0EB",
              fontSize: "13px",
              color: "danger" in item && item.danger ? "#EF4444" : "#78716C",
              cursor: "not-allowed",
              opacity: 0.5,
              fontFamily: "inherit",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
