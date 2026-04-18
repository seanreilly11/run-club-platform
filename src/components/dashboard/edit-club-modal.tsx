"use client";

import { useState } from "react";
import { updateCommunity } from "@/lib/actions/community";

interface EditClubModalProps {
  community: {
    slug: string;
    name: string;
    city: string;
    description: string | null;
    vibe: "competitive" | "social" | "casual";
    postRunDefault: "pub" | "coffee" | "brunch" | "none";
    instagramHandle: string | null;
  };
  onClose: () => void;
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
  return {
    fontSize: "13px",
    fontWeight: 600,
    display: "block" as const,
    marginBottom: "4px",
    color: "#1C1917",
  };
}

const VIBE_OPTIONS: { value: "competitive" | "social" | "casual"; label: string }[] = [
  { value: "competitive", label: "Competitive" },
  { value: "social", label: "Social" },
  { value: "casual", label: "Casual" },
];

const AFTERS_OPTIONS: { value: "pub" | "coffee" | "brunch" | "none"; label: string }[] = [
  { value: "pub", label: "Pub" },
  { value: "coffee", label: "Coffee" },
  { value: "brunch", label: "Brunch" },
  { value: "none", label: "None" },
];

export function EditClubModal({ community, onClose }: EditClubModalProps) {
  const [name, setName] = useState(community.name);
  const [city, setCity] = useState(community.city);
  const [description, setDescription] = useState(community.description ?? "");
  const [vibe, setVibe] = useState<"competitive" | "social" | "casual">(community.vibe);
  const [postRunDefault, setPostRunDefault] = useState<"pub" | "coffee" | "brunch" | "none">(community.postRunDefault);
  const [instagramHandle, setInstagramHandle] = useState(community.instagramHandle ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateCommunity({
      communitySlug: community.slug,
      name,
      city,
      description,
      vibe,
      postRunDefault,
      instagramHandle,
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(onClose, 1200);
    } else {
      setError(result.error);
    }
  }

  const selectorBtnStyle = (active: boolean, danger?: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "8px 6px",
    borderRadius: "8px",
    border: active ? "2px solid #F43F5E" : "1.5px solid #F5F0EB",
    background: active ? "#FFF5F0" : "#FFFFFF",
    fontSize: "12px",
    fontWeight: active ? 700 : 500,
    color: active ? "#F43F5E" : "#78716C",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "center" as const,
  });

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
              Club Details
            </h2>
            <p style={{ fontSize: "11px", color: "#78716C", margin: "2px 0 0 0" }}>
              Edit your club&apos;s public page
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
              ✓ Club details updated!
            </div>
          )}

          {/* Club name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle()}>
              Club name <span style={{ color: "#F43F5E" }}>*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle({ fontSize: "14px" })} />
          </div>

          {/* Slug (read-only) */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle()}>URL slug</label>
            <input
              value={community.slug}
              readOnly
              style={inputStyle({ background: "#F5F0EB", color: "#A8A29E", cursor: "not-allowed" })}
            />
            <p style={{ fontSize: "11px", color: "#A8A29E", margin: "4px 0 0 0" }}>
              URL can&apos;t be changed after creation.
            </p>
          </div>

          {/* City */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle()}>
              City <span style={{ color: "#F43F5E" }}>*</span>
            </label>
            <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle()} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle()}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ ...inputStyle(), resize: "vertical" as const, minHeight: "72px" }}
            />
          </div>

          {/* Instagram */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle()}>Instagram handle</label>
            <input
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="yourclub"
              style={inputStyle()}
            />
          </div>

          {/* Vibe */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle()}>Vibe</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {VIBE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setVibe(opt.value)}
                  style={selectorBtnStyle(vibe === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default afters */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle()}>Default afters</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {AFTERS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPostRunDefault(opt.value)}
                  style={selectorBtnStyle(postRunDefault === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save / Discard */}
          <div style={{ display: "flex", gap: "8px" }}>
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
        </div>
      </div>
    </div>
  );
}
