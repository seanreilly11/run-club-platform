import { useState } from "react";

const t = {
  bg: "#FFFBF7", surface: "#FFFFFF", surfaceAlt: "#FFF5F0",
  border: "#FECDD3", borderMuted: "#F5F0EB",
  text: "#1C1917", textMuted: "#78716C", textLight: "#A8A29E",
  primary: "#F43F5E", primaryLight: "#FFF1F2", primaryBg: "#FFE4E6",
  secondary: "#8B5CF6", accent: "#F59E0B", success: "#16A34A",
  venueBg: "#FEF3C7", venueText: "#B45309",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
  radius: "14px",
};

const Input = ({ label, required, placeholder, type = "text", value, onChange, hint }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "5px" }}>
      {label} {required && <span style={{ color: t.primary }}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: `1.5px solid ${t.borderMuted}`, fontSize: "14px",
        background: t.bg, outline: "none", boxSizing: "border-box",
        color: t.text, fontFamily: "'DM Sans', sans-serif",
      }}
    />
    {hint && <div style={{ fontSize: "11px", color: t.textLight, marginTop: "4px" }}>{hint}</div>}
  </div>
);

const TextArea = ({ label, required, placeholder, rows = 3, hint }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "5px" }}>
      {label} {required && <span style={{ color: t.primary }}>*</span>}
    </label>
    <textarea
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: `1.5px solid ${t.borderMuted}`, fontSize: "14px",
        background: t.bg, outline: "none", boxSizing: "border-box",
        color: t.text, fontFamily: "'DM Sans', sans-serif", resize: "vertical",
      }}
    />
    {hint && <div style={{ fontSize: "11px", color: t.textLight, marginTop: "4px" }}>{hint}</div>}
  </div>
);

const SelectInput = ({ label, required, options, value, onChange, hint }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "5px" }}>
      {label} {required && <span style={{ color: t.primary }}>*</span>}
    </label>
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: "10px",
          border: `1.5px solid ${t.borderMuted}`, fontSize: "14px",
          background: t.bg, outline: "none", boxSizing: "border-box",
          color: t.text, fontFamily: "'DM Sans', sans-serif",
          appearance: "none", cursor: "pointer",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: t.textLight, pointerEvents: "none", fontSize: "12px" }}>▼</span>
    </div>
    {hint && <div style={{ fontSize: "11px", color: t.textLight, marginTop: "4px" }}>{hint}</div>}
  </div>
);

export default function CreateEventForm() {
  const [paceGroups, setPaceGroups] = useState([
    { name: "🐇 Fast", pace: "< 5:00/km" },
    { name: "🏃 Steady", pace: "5:00 – 6:00/km" },
    { name: "🐢 Easy", pace: "6:00+/km" },
  ]);
  const [showAfters, setShowAfters] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [venueType, setVenueType] = useState("pub");
  const [activeSection, setActiveSection] = useState(null);

  const removePaceGroup = (idx) => setPaceGroups(paceGroups.filter((_, i) => i !== idx));
  const addPaceGroup = () => setPaceGroups([...paceGroups, { name: "", pace: "" }]);

  const SectionHeader = ({ icon, title, number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", paddingBottom: "10px", borderBottom: `1px solid ${t.borderMuted}` }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: t.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: t.primary }}>
        {number}
      </div>
      <span style={{ fontSize: "12px", marginRight: "2px" }}>{icon}</span>
      <span style={{ fontSize: "15px", fontWeight: 700, color: t.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</span>
    </div>
  );

  const Toggle = ({ checked, onChange, label, sublabel }) => (
    <div
      onClick={onChange}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
        background: checked ? t.surfaceAlt : t.surface,
        border: `1.5px solid ${checked ? t.border : t.borderMuted}`,
        marginBottom: "12px", transition: "all 0.15s ease",
      }}
    >
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>{label}</div>
        {sublabel && <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "1px" }}>{sublabel}</div>}
      </div>
      <div style={{
        width: "40px", height: "22px", borderRadius: "11px", padding: "2px",
        background: checked ? t.success : "#D4D4D8", transition: "background 0.2s ease",
      }}>
        <div style={{
          width: "18px", height: "18px", borderRadius: "50%", background: "white",
          transition: "transform 0.2s ease",
          transform: checked ? "translateX(18px)" : "translateX(0)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", justifyContent: "center", padding: "24px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div>
        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>
          Create Event Form — Dashboard
        </div>
        <div style={{
          width: "520px", borderRadius: "16px", overflow: "hidden",
          border: "3px solid #334155", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          maxHeight: "820px", overflowY: "auto", background: t.bg,
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: t.text }}>
            {/* Header */}
            <div style={{ background: t.surface, borderBottom: `1px solid ${t.borderMuted}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "20px", fontWeight: 800, margin: "0 0 2px 0", letterSpacing: "-0.01em" }}>New Event</h1>
                <p style={{ fontSize: "12px", color: t.textMuted, margin: 0 }}>London City Runners</p>
              </div>
              <button style={{ padding: "4px 10px", background: "transparent", border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", color: t.textMuted, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>

            <div style={{ padding: "24px" }}>
              {/* ===== SECTION 1: BASICS ===== */}
              <SectionHeader icon="📋" title="Event details" number="1" />

              <Input label="Event title" required placeholder="e.g. Wednesday Evening 5K" hint="Keep it simple — members see this in their feed" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Input label="Date" required type="date" />
                <Input label="Time" required type="time" />
              </div>

              <TextArea label="Description" placeholder="What should members expect? Route details, what to bring, any notes..." rows={3} hint="Optional but recommended — helps new members feel welcome" />

              {/* Recurring toggle */}
              <Toggle
                checked={recurring}
                onChange={() => setRecurring(!recurring)}
                label="Recurring event"
                sublabel="Automatically create this event every week"
              />
              {recurring && (
                <div style={{ marginBottom: "16px", padding: "12px", background: t.surfaceAlt, borderRadius: "10px", border: `1px solid ${t.borderMuted}` }}>
                  <SelectInput
                    label="Repeat on"
                    required
                    options={[
                      { value: "MON", label: "Every Monday" },
                      { value: "TUE", label: "Every Tuesday" },
                      { value: "WED", label: "Every Wednesday" },
                      { value: "THU", label: "Every Thursday" },
                      { value: "FRI", label: "Every Friday" },
                      { value: "SAT", label: "Every Saturday" },
                      { value: "SUN", label: "Every Sunday" },
                    ]}
                    value="WED"
                  />
                </div>
              )}

              {/* ===== SECTION 2: ROUTE ===== */}
              <div style={{ marginTop: "8px" }}>
                <SectionHeader icon="🗺️" title="Route & meeting point" number="2" />
              </div>

              <Input label="Meeting point" required placeholder="e.g. Outside The Arch Climbing Wall, Bermondsey" hint="Be specific — new members need to find you" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Input label="Distance" placeholder="e.g. 5" hint="In km" />
                <SelectInput
                  label="Distance unit"
                  options={[
                    { value: "km", label: "Kilometres" },
                    { value: "mi", label: "Miles" },
                  ]}
                  value="km"
                />
              </div>

              <Input label="Route link" placeholder="https://strava.com/routes/..." hint="Optional — paste a Strava route, Google Maps link, or Komoot route" />

              {/* Map placeholder */}
              <div style={{
                height: "120px", background: t.surfaceAlt, borderRadius: "10px",
                border: `1.5px dashed ${t.borderMuted}`, marginBottom: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "4px", cursor: "pointer",
              }}>
                <span style={{ fontSize: "20px" }}>📍</span>
                <span style={{ fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>Click to set meeting point on map</span>
                <span style={{ fontSize: "10px", color: t.textLight }}>Or enter an address above</span>
              </div>

              {/* ===== SECTION 3: PACE GROUPS ===== */}
              <SectionHeader icon="🏃" title="Pace groups" number="3" />

              <div style={{ marginBottom: "16px" }}>
                {paceGroups.map((pg, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px",
                    padding: "10px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`,
                    borderRadius: "10px", boxShadow: t.cardShadow,
                  }}>
                    <div style={{ flex: 1 }}>
                      <input
                        placeholder="Group name (e.g. 🐇 Fast)"
                        defaultValue={pg.name}
                        style={{
                          width: "100%", padding: "6px 0", border: "none", fontSize: "13px",
                          fontWeight: 600, background: "transparent", outline: "none",
                          color: t.text, fontFamily: "'DM Sans', sans-serif",
                        }}
                      />
                    </div>
                    <input
                      placeholder="Pace range"
                      defaultValue={pg.pace}
                      style={{
                        width: "120px", padding: "6px 8px", borderRadius: "6px",
                        border: `1px solid ${t.borderMuted}`, fontSize: "12px",
                        background: t.bg, outline: "none", color: t.textMuted,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                    <button
                      onClick={() => removePaceGroup(i)}
                      style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        border: `1px solid ${t.borderMuted}`, background: t.surface,
                        cursor: "pointer", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "14px", color: t.textLight,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPaceGroup}
                  style={{
                    width: "100%", padding: "10px", border: `1.5px dashed ${t.borderMuted}`,
                    borderRadius: "10px", background: "transparent", cursor: "pointer",
                    fontSize: "13px", color: t.primary, fontWeight: 600, fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  }}
                >
                  + Add pace group
                </button>
                <div style={{ fontSize: "11px", color: t.textLight, marginTop: "6px" }}>
                  Pace groups help runners find the right speed. Members choose a group when they RSVP.
                </div>
              </div>

              {/* ===== SECTION 4: AFTERS ===== */}
              <SectionHeader icon="🍻" title="Afters" number="4" />

              <Toggle
                checked={showAfters}
                onChange={() => setShowAfters(!showAfters)}
                label="Include an afters venue"
                sublabel="Where is the group heading after the run?"
              />

              {showAfters && (
                <div style={{
                  padding: "16px", background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
                  border: "1px solid #FDE68A", borderRadius: "12px", marginBottom: "16px",
                }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "12px", color: "#78350F", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                      Venue type
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[
                        { id: "pub", emoji: "🍺", label: "Pub" },
                        { id: "cafe", emoji: "☕", label: "Café" },
                        { id: "brunch", emoji: "🥐", label: "Brunch" },
                        { id: "other", emoji: "📍", label: "Other" },
                      ].map(vt => (
                        <button
                          key={vt.id}
                          onClick={() => setVenueType(vt.id)}
                          style={{
                            flex: 1, padding: "8px 4px", borderRadius: "8px", cursor: "pointer",
                            fontFamily: "inherit", fontSize: "12px", fontWeight: 600,
                            background: venueType === vt.id ? "#B45309" : "rgba(255,255,255,0.7)",
                            color: venueType === vt.id ? "white" : "#92400E",
                            border: venueType === vt.id ? "1px solid #B45309" : "1px solid #FDE68A",
                            transition: "all 0.15s ease",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>{vt.emoji}</span>
                          {vt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#78350F", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                      Venue name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      placeholder="e.g. The Crown & Anchor"
                      defaultValue="The Crown & Anchor"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: "8px",
                        border: "1px solid #FDE68A", fontSize: "14px",
                        background: "rgba(255,255,255,0.8)", outline: "none",
                        boxSizing: "border-box", color: "#78350F",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#78350F", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                      Venue link
                    </label>
                    <input
                      placeholder="Google Maps link or website"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: "8px",
                        border: "1px solid #FDE68A", fontSize: "13px",
                        background: "rgba(255,255,255,0.8)", outline: "none",
                        boxSizing: "border-box", color: "#78350F",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                    <div style={{ fontSize: "10px", color: "#92400E", marginTop: "3px" }}>
                      Paste a Google Maps link so members can find it easily
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", color: "#78350F", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                      Notes for attendees
                    </label>
                    <input
                      placeholder="e.g. Happy hour until 8pm, reserved area at the back"
                      defaultValue="Happy hour until 8pm"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: "8px",
                        border: "1px solid #FDE68A", fontSize: "13px",
                        background: "rgba(255,255,255,0.8)", outline: "none",
                        boxSizing: "border-box", color: "#78350F",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ===== PREVIEW ===== */}
              <div style={{ marginTop: "8px", marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", color: t.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                  Preview — how members will see it
                </div>
                <div style={{
                  background: t.surface, border: `1.5px solid ${t.border}`, borderRadius: "14px",
                  padding: "14px", boxShadow: "0 2px 12px rgba(244,63,94,0.06)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: t.primary, textTransform: "uppercase" }}>Next run</span>
                    <span style={{ fontSize: "10px", color: t.textLight }}>in 4 days</span>
                  </div>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, margin: "0 0 4px 0" }}>Wednesday Evening 5K</h3>
                  <div style={{ fontSize: "12px", color: t.textMuted, marginBottom: "6px" }}>Wed 26 Mar · 6:30 PM · 📍 The Arch Climbing Wall</div>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "8px", flexWrap: "wrap" }}>
                    {paceGroups.filter(p => p.name).map((pg, i) => (
                      <span key={i} style={{ fontSize: "10px", padding: "2px 7px", background: t.surfaceAlt, color: t.textMuted, borderRadius: "5px" }}>{pg.name}</span>
                    ))}
                  </div>
                  {showAfters && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 9px", background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`, border: "1px solid #FDE68A", borderRadius: "8px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px" }}>{venueType === "pub" ? "🍺" : venueType === "cafe" ? "☕" : venueType === "brunch" ? "🥐" : "📍"}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#78350F" }}>Afters at The Crown & Anchor</span>
                    </div>
                  )}
                  <div style={{ padding: "10px", background: t.primaryBg, borderRadius: "9px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: t.primary, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    I'm in! 🏃
                  </div>
                </div>
              </div>

              {/* ===== SUBMIT ===== */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{
                  flex: 1, padding: "13px", background: t.surface, color: t.textMuted,
                  border: `1.5px solid ${t.borderMuted}`, borderRadius: "12px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                  Save as draft
                </button>
                <button style={{
                  flex: 2, padding: "13px", background: t.primary, color: "white",
                  border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif",
                  boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
                }}>
                  Publish event 🚀
                </button>
              </div>
              <div style={{ textAlign: "center", fontSize: "11px", color: t.textLight, marginTop: "8px" }}>
                Members will be notified 24 hours before the event
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
