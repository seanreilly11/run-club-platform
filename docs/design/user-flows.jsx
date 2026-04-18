import { useState } from "react";

const t = {
  bg: "#FFFBF7", surface: "#FFFFFF", surfaceAlt: "#FFF5F0",
  border: "#FECDD3", borderMuted: "#F5F0EB",
  text: "#1C1917", textMuted: "#78716C", textLight: "#A8A29E",
  primary: "#F43F5E", primaryLight: "#FFF1F2", primaryBg: "#FFE4E6",
  secondary: "#8B5CF6", accent: "#F59E0B", success: "#16A34A",
  venueBg: "#FEF3C7", venueText: "#B45309",
  danger: "#EF4444", dangerLight: "#FEF2F2",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
  radius: "14px",
};

const flows = [
  { id: "edit-event", label: "Edit / Cancel Event" },
  { id: "change-rsvp", label: "Change RSVP" },
  { id: "edit-club", label: "Edit Club Details" },
  { id: "invite-admin", label: "Invite Admin" },
  { id: "pace-group", label: "Change Pace Group" },
  { id: "export", label: "Export Members" },
  { id: "duplicate", label: "Duplicate Event" },
  { id: "profile", label: "Edit Profile" },
];

// ============================================
// SHARED COMPONENTS
// ============================================
const Toast = ({ message, undo, type = "success" }) => (
  <div style={{
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 18px", borderRadius: "12px",
    background: type === "success" ? "#166534" : type === "danger" ? "#991B1B" : "#78350F",
    color: "white", fontSize: "13px", fontWeight: 500,
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)", zIndex: 100,
    animation: "toastIn 0.3s ease",
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <span>{type === "success" ? "✓" : type === "danger" ? "!" : "ℹ"}</span>
    <span style={{ flex: 1 }}>{message}</span>
    {undo && <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "6px", padding: "4px 10px", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Undo</button>}
  </div>
);

const DashShell = ({ title, children, subtitle }) => (
  <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, minHeight: "100%", color: t.text }}>
    <div style={{ background: t.surface, borderBottom: `1px solid ${t.borderMuted}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", fontWeight: 700, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "12px", color: t.textMuted, margin: "2px 0 0 0" }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ padding: "20px" }}>{children}</div>
  </div>
);

const Input = ({ label, value, hint, required }) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>
      {label} {required && <span style={{ color: t.primary }}>*</span>}
    </label>
    <input defaultValue={value} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: `1.5px solid ${t.borderMuted}`, fontSize: "14px", background: t.bg, outline: "none", boxSizing: "border-box", color: t.text, fontFamily: "'DM Sans', sans-serif" }} />
    {hint && <div style={{ fontSize: "11px", color: t.textLight, marginTop: "3px" }}>{hint}</div>}
  </div>
);

// ============================================
// 1. EDIT / CANCEL EVENT
// ============================================
const EditEventFlow = () => {
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <DashShell title="Edit Event" subtitle="Wednesday Evening 5K · Wed 26 Mar">
      {cancelled ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚫</div>
          <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: "4px" }}>Event cancelled</div>
          <div style={{ fontSize: "13px", color: t.textMuted, marginBottom: "16px" }}>42 members who RSVP'd will be notified by email.</div>
          <button onClick={() => setCancelled(false)} style={{ padding: "8px 20px", background: t.surface, border: `1.5px solid ${t.borderMuted}`, borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.textMuted, fontFamily: "inherit" }}>Back to events</button>
          <Toast message="Event cancelled. Members notified." undo type="danger" />
        </div>
      ) : (
        <>
          <Input label="Event title" value="Wednesday Evening 5K" required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Input label="Date" value="2026-03-26" />
            <Input label="Time" value="18:30" />
          </div>
          <Input label="Meeting point" value="The Arch Climbing Wall, Bermondsey" />
          <Input label="Distance (km)" value="5" />
          <Input label="Route link" value="https://strava.com/routes/123" />

          {/* Afters section */}
          <div style={{ padding: "14px", background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`, border: "1px solid #FDE68A", borderRadius: "12px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#78350F", fontWeight: 600, marginBottom: "8px" }}>🍺 Afters venue</div>
            <Input label="Venue name" value="The Crown & Anchor" />
            <Input label="Notes" value="Happy hour until 8pm" />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button onClick={() => setSaved(true)} style={{ flex: 2, padding: "12px", background: t.primary, color: "white", border: "none", borderRadius: "11px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", boxShadow: "0 2px 12px rgba(244,63,94,0.3)" }}>
              Save changes
            </button>
            <button style={{ flex: 1, padding: "12px", background: t.surface, color: t.textMuted, border: `1.5px solid ${t.borderMuted}`, borderRadius: "11px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Discard
            </button>
          </div>

          {/* Danger zone */}
          <div style={{ padding: "14px", background: t.dangerLight, border: "1px solid #FECACA", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.danger }}>Cancel this event</div>
                <div style={{ fontSize: "11px", color: "#991B1B" }}>Members who RSVP'd will be notified</div>
              </div>
              {!showCancel ? (
                <button onClick={() => setShowCancel(true)} style={{ padding: "6px 14px", background: "white", border: `1.5px solid #FECACA`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: t.danger, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel event
                </button>
              ) : (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setCancelled(true)} style={{ padding: "6px 14px", background: t.danger, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "white", cursor: "pointer" }}>
                    Yes, cancel it
                  </button>
                  <button onClick={() => setShowCancel(false)} style={{ padding: "6px 14px", background: "white", border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", color: t.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                    Never mind
                  </button>
                </div>
              )}
            </div>
          </div>

          {saved && <Toast message="Event updated! Members will see the changes." undo type="success" />}
        </>
      )}
    </DashShell>
  );
};

// ============================================
// 2. CHANGE RSVP
// ============================================
const ChangeRsvpFlow = () => {
  const [status, setStatus] = useState("going+social");
  const [toast, setToast] = useState(null);

  const change = (newStatus) => {
    setStatus(newStatus);
    const msgs = {
      "going+social": "RSVP updated — you're in + staying for afters 🎉",
      "going": "RSVP updated — you're in for the run 🏃",
      "maybe": "RSVP changed to maybe",
      "withdrawn": "RSVP withdrawn",
    };
    setToast(msgs[newStatus]);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, minHeight: "100%", color: t.text, padding: "20px" }}>
      <div style={{ fontSize: "11px", color: t.textLight, marginBottom: "12px" }}>Event detail page — RSVP section (already RSVP'd)</div>

      <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: t.radius, padding: "16px", boxShadow: t.cardShadow }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "14px", fontWeight: 700, margin: "0 0 12px 0" }}>Your RSVP</h3>

        {/* Current status */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", marginBottom: "12px" }}>
          <span style={{ color: t.success, fontWeight: 700 }}>✓</span>
          <span style={{ fontSize: "13px", color: "#166534", fontWeight: 600, flex: 1 }}>
            {status === "going+social" ? "Going + staying for afters 🎉" :
             status === "going" ? "Going — just the run 🏃" :
             status === "maybe" ? "Maybe" : "Not going"}
          </span>
        </div>

        {/* Change options */}
        <div style={{ fontSize: "11px", color: t.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Change your response</div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
          {[
            { id: "going+social", label: "Going + afters 🍺", active: status === "going+social" },
            { id: "going", label: "Just the run 🏃", active: status === "going" },
            { id: "maybe", label: "Maybe", active: status === "maybe" },
          ].map(opt => (
            <button key={opt.id} onClick={() => change(opt.id)} style={{
              flex: 1, padding: "9px 6px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit",
              fontSize: "11px", fontWeight: 600, transition: "all 0.15s ease",
              background: opt.active ? (opt.id.includes("going") ? t.primary : t.accent) : t.surface,
              color: opt.active ? "white" : t.textMuted,
              border: `1.5px solid ${opt.active ? "transparent" : t.borderMuted}`,
            }}>
              {opt.label}
            </button>
          ))}
        </div>

        <button onClick={() => change("withdrawn")} style={{
          width: "100%", padding: "8px", background: "transparent", border: "none",
          fontSize: "12px", color: t.textLight, cursor: "pointer", fontFamily: "inherit",
          textDecoration: "underline",
        }}>
          Withdraw RSVP
        </button>
      </div>

      {toast && <Toast message={toast} undo type="success" />}
    </div>
  );
};

// ============================================
// 3. EDIT CLUB DETAILS
// ============================================
const EditClubFlow = () => {
  const [saved, setSaved] = useState(false);
  return (
    <DashShell title="Club Details" subtitle="Edit your club's public page">
      <Input label="Club name" value="London City Runners" required />
      <Input label="Slug" value="london-city-runners" hint="This is your club's URL: yourdomain.com/london-city-runners" />
      <Input label="City" value="London" required />

      <div style={{ marginBottom: "14px" }}>
        <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>Description</label>
        <textarea defaultValue="A social running club based in Bermondsey, right on London's famous Beer Mile. Whether you're a complete beginner or chasing a PB, there's a pace group for you." rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: `1.5px solid ${t.borderMuted}`, fontSize: "13px", background: t.bg, outline: "none", boxSizing: "border-box", color: t.text, fontFamily: "'DM Sans', sans-serif", resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>Vibe</label>
        <div style={{ display: "flex", gap: "6px" }}>
          {["🏆 Competitive", "🤝 Social", "😎 Casual"].map((v, i) => (
            <button key={v} style={{
              flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit",
              fontSize: "12px", fontWeight: 600,
              background: i === 1 ? t.primaryLight : t.surface,
              color: i === 1 ? t.primary : t.textMuted,
              border: `1.5px solid ${i === 1 ? t.primary : t.borderMuted}`,
            }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>Default afters type</label>
        <div style={{ display: "flex", gap: "6px" }}>
          {[{ e: "🍺", l: "Pub", a: true }, { e: "☕", l: "Café", a: false }, { e: "🥐", l: "Brunch", a: false }, { e: "🚫", l: "None", a: false }].map(v => (
            <button key={v.l} style={{
              flex: 1, padding: "8px 4px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
              fontSize: "11px", fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              background: v.a ? t.venueBg : t.surface,
              color: v.a ? t.venueText : t.textMuted,
              border: `1.5px solid ${v.a ? "#FDE68A" : t.borderMuted}`,
            }}><span style={{ fontSize: "16px" }}>{v.e}</span>{v.l}</button>
          ))}
        </div>
      </div>

      {/* Cover photo */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>Cover photo</label>
        <div style={{ height: "100px", background: "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)", borderRadius: "10px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button style={{ padding: "6px 14px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: t.text }}>Change photo</button>
        </div>
      </div>

      <button onClick={() => setSaved(true)} style={{ width: "100%", padding: "12px", background: t.primary, color: "white", border: "none", borderRadius: "11px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", boxShadow: "0 2px 12px rgba(244,63,94,0.3)" }}>
        Save changes
      </button>
      {saved && <Toast message="Club details updated!" type="success" />}
    </DashShell>
  );
};

// ============================================
// 4. INVITE ADMIN
// ============================================
const InviteAdminFlow = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <DashShell title="Team" subtitle="Manage who can edit your club">
      {/* Current admins */}
      <div style={{ fontSize: "11px", color: t.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Current team</div>
      {[
        { name: "You", email: "james@email.com", role: "Owner", you: true },
        { name: "Tom Williams", email: "tom@email.com", role: "Admin", you: false },
      ].map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px", marginBottom: "6px", boxShadow: t.cardShadow }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: m.you ? t.primaryBg : t.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: m.you ? t.primary : t.textMuted }}>{m.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>{m.name} {m.you && <span style={{ fontSize: "10px", color: t.textLight }}>(you)</span>}</div>
            <div style={{ fontSize: "11px", color: t.textLight }}>{m.email}</div>
          </div>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "5px", fontWeight: 600, background: m.role === "Owner" ? t.primaryLight : t.surfaceAlt, color: m.role === "Owner" ? t.primary : t.textMuted }}>{m.role}</span>
          {!m.you && <button style={{ fontSize: "11px", color: t.textLight, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Remove</button>}
        </div>
      ))}

      {/* Invite new */}
      <div style={{ marginTop: "20px", padding: "16px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "12px", boxShadow: t.cardShadow }}>
        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Invite a new admin</div>
        <div style={{ fontSize: "11px", color: t.textMuted, marginBottom: "12px" }}>Admins can create/edit events, manage members, and view analytics. They can't change billing or delete the club.</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", border: `1.5px solid ${t.borderMuted}`, fontSize: "13px", background: t.bg, outline: "none", color: t.text, fontFamily: "'DM Sans', sans-serif" }}
          />
          <button onClick={() => { setSent(true); setEmail(""); }} style={{ padding: "9px 18px", background: t.primary, color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Send invite
          </button>
        </div>
      </div>

      {sent && <Toast message="Invite sent! They'll receive an email to accept." type="success" />}
    </DashShell>
  );
};

// ============================================
// 5. CHANGE PACE GROUP
// ============================================
const ChangePaceFlow = () => {
  const [selected, setSelected] = useState("🏃 Steady");
  const [toast, setToast] = useState(null);

  const change = (pg) => {
    setSelected(pg);
    setToast(`Pace group changed to ${pg}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, minHeight: "100%", color: t.text, padding: "20px" }}>
      <div style={{ fontSize: "11px", color: t.textLight, marginBottom: "12px" }}>Event detail page — pace group section (already RSVP'd)</div>

      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0" }}>Your pace group</h3>
      <p style={{ fontSize: "12px", color: t.textMuted, margin: "0 0 10px 0" }}>Tap to switch — the organizer will see your updated group.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { n: "🐇 Fast", p: "< 5:00/km", r: 8 },
          { n: "🏃 Steady", p: "5:00 – 6:00/km", r: 22 },
          { n: "🐢 Easy", p: "6:00+/km", r: 12 },
        ].map(g => (
          <button key={g.n} onClick={() => change(g.n)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit",
            background: selected === g.n ? t.primaryLight : t.surface,
            border: `1.5px solid ${selected === g.n ? t.primary : t.borderMuted}`,
            transition: "all 0.15s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {selected === g.n && <span style={{ color: t.primary, fontWeight: 700 }}>✓</span>}
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>{g.n}</div>
                <div style={{ fontSize: "11px", color: t.textMuted }}>{g.p}</div>
              </div>
            </div>
            <span style={{ fontSize: "11px", color: t.textLight }}>{g.r} runners</span>
          </button>
        ))}
      </div>

      {toast && <Toast message={toast} undo type="success" />}
    </div>
  );
};

// ============================================
// 6. EXPORT MEMBERS
// ============================================
const ExportMembersFlow = () => {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const startExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); }, 1500);
  };

  return (
    <DashShell title="Members" subtitle="74 members · London City Runners">
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {["All", "Active", "At risk", "Lapsed", "New"].map((f, i) => (
            <button key={f} style={{
              padding: "5px 10px", fontSize: "11px", fontWeight: 500, cursor: "pointer",
              background: i === 0 ? t.primaryLight : t.surface,
              color: i === 0 ? t.primary : t.textMuted,
              border: `1px solid ${i === 0 ? t.border : t.borderMuted}`,
              borderRadius: "7px", fontFamily: "inherit",
            }}>{f}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={startExport} disabled={exporting} style={{
            padding: "6px 14px", border: `1px solid ${t.borderMuted}`, borderRadius: "8px",
            background: t.surface, fontSize: "12px", color: t.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px", fontFamily: "inherit", fontWeight: 600,
            opacity: exporting ? 0.6 : 1,
          }}>
            {exporting ? "⏳ Exporting..." : "⬇ Export CSV"}
          </button>
        </div>
      </div>

      {/* Member list preview */}
      {[
        { n: "Sarah Chen", e: "sarah@email.com", s: "active", att: 16, sr: "100%", p: "5:00/km" },
        { n: "Tom Williams", e: "tom@email.com", s: "active", att: 8, sr: "88%", p: "5:30/km" },
        { n: "Priya Patel", e: "priya@email.com", s: "new", att: 3, sr: "100%", p: "6:30/km" },
        { n: "Alex Morgan", e: "alex@email.com", s: "at_risk", att: 12, sr: "72%", p: "5:15/km" },
      ].map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "9px", marginBottom: "5px", boxShadow: t.cardShadow }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: t.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: t.primary }}>{m.n[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>{m.n}</div>
            <div style={{ fontSize: "10px", color: t.textLight }}>{m.e} · {m.p} · {m.att} events · {m.sr} show rate</div>
          </div>
          <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", fontWeight: 600,
            background: m.s === "active" ? "#F0FDF4" : m.s === "new" ? "#EDE9FE" : m.s === "at_risk" ? "#FEF3C7" : "#FEF2F2",
            color: m.s === "active" ? t.success : m.s === "new" ? t.secondary : m.s === "at_risk" ? t.accent : t.danger,
          }}>{m.s === "at_risk" ? "At risk" : m.s}</span>
        </div>
      ))}

      {/* Export preview */}
      {done && (
        <div style={{ marginTop: "14px", padding: "14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#166534", marginBottom: "4px" }}>✓ Export ready</div>
          <div style={{ fontSize: "12px", color: "#166534", marginBottom: "8px" }}>74 members exported with: name, email, join date, events attended, show rate, pace, status</div>
          <button style={{ padding: "8px 16px", background: t.success, color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Download CSV</button>
        </div>
      )}
    </DashShell>
  );
};

// ============================================
// 7. DUPLICATE EVENT
// ============================================
const DuplicateEventFlow = () => {
  const [duplicated, setDuplicated] = useState(false);
  return (
    <DashShell title="Events" subtitle="London City Runners">
      <div style={{ fontSize: "11px", color: t.textLight, marginBottom: "10px" }}>Dashboard event list — more menu on each event</div>

      {[
        { t: "Wednesday Evening 5K", d: "Wed 26 Mar · 6:30 PM", s: "upcoming" },
        { t: "Sunday Long Run", d: "Sun 30 Mar · 9:00 AM", s: "upcoming" },
      ].map((e, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px", marginBottom: "6px", boxShadow: t.cardShadow }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{e.t}</div>
            <div style={{ fontSize: "11px", color: t.textMuted }}>{e.d}</div>
          </div>
          <div style={{ position: "relative" }}>
            {i === 0 && (
              <div style={{ background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", padding: "4px", minWidth: "150px" }}>
                {[
                  { l: "✏️ Edit event", a: null },
                  { l: "📋 Duplicate", a: () => setDuplicated(true) },
                  { l: "🚫 Cancel event", a: null, danger: true },
                ].map((action, j) => (
                  <button key={j} onClick={action.a} style={{
                    display: "block", width: "100%", padding: "8px 12px", background: "transparent",
                    border: "none", fontSize: "12px", textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", borderRadius: "6px",
                    color: action.danger ? t.danger : t.text,
                  }}>
                    {action.l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {duplicated && (
        <div style={{ marginTop: "12px", padding: "14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#166534" }}>✓ Event duplicated</div>
            <div style={{ fontSize: "12px", color: "#166534" }}>A draft copy of "Wednesday Evening 5K" was created. Edit the date and publish when ready.</div>
          </div>
          <button style={{ padding: "6px 14px", background: t.primary, color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Edit draft →</button>
        </div>
      )}

      <Toast message="Event duplicated as draft" undo type="success" />
    </DashShell>
  );
};

// ============================================
// 8. EDIT PROFILE
// ============================================
const EditProfileFlow = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, minHeight: "100%", color: t.text }}>
      <div style={{ background: t.surface, borderBottom: `1px solid ${t.borderMuted}`, padding: "14px 20px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", fontWeight: 700, margin: 0 }}>Your Profile</h1>
      </div>
      <div style={{ padding: "20px" }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: t.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: t.primary }}>JK</div>
          <div>
            <button style={{ padding: "6px 12px", background: t.surface, border: `1.5px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: t.textMuted, fontFamily: "inherit" }}>Change photo</button>
            <div style={{ fontSize: "10px", color: t.textLight, marginTop: "4px" }}>JPG or PNG, max 2MB</div>
          </div>
        </div>

        <Input label="Name" value="James Kim" required />
        <Input label="Email" value="james@email.com" hint="Used for login and notifications" />

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", color: t.text, fontWeight: 600, display: "block", marginBottom: "4px" }}>Default pace preference</label>
          <div style={{ display: "flex", gap: "6px" }}>
            {["< 5:00/km", "5:00–6:00/km", "6:00+/km", "No preference"].map((p, i) => (
              <button key={p} style={{
                flex: 1, padding: "8px 4px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
                fontSize: "11px", fontWeight: 500,
                background: i === 0 ? t.primaryLight : t.surface,
                color: i === 0 ? t.primary : t.textMuted,
                border: `1.5px solid ${i === 0 ? t.primary : t.borderMuted}`,
              }}>{p}</button>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: t.textLight, marginTop: "4px" }}>Pre-selects your pace group when you RSVP to events</div>
        </div>

        <button onClick={() => setSaved(true)} style={{ width: "100%", padding: "12px", background: t.primary, color: "white", border: "none", borderRadius: "11px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", boxShadow: "0 2px 12px rgba(244,63,94,0.3)", marginBottom: "16px" }}>
          Save profile
        </button>

        {/* Account section */}
        <div style={{ padding: "14px", background: t.surfaceAlt, borderRadius: "12px", border: `1px solid ${t.borderMuted}` }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Account</div>
          <button style={{ display: "block", width: "100%", padding: "10px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", color: t.textMuted, cursor: "pointer", fontFamily: "inherit", textAlign: "left", marginBottom: "6px" }}>Change password</button>
          <button style={{ display: "block", width: "100%", padding: "10px 12px", background: t.surface, border: `1px solid ${t.borderMuted}`, borderRadius: "8px", fontSize: "12px", color: t.textMuted, cursor: "pointer", fontFamily: "inherit", textAlign: "left", marginBottom: "6px" }}>Notification preferences</button>
          <button style={{ display: "block", width: "100%", padding: "10px 12px", background: t.dangerLight, border: `1px solid #FECACA`, borderRadius: "8px", fontSize: "12px", color: t.danger, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>Delete account</button>
        </div>

        {saved && <Toast message="Profile updated!" type="success" />}
      </div>
    </div>
  );
};

// ============================================
// MAIN
// ============================================
const comps = {
  "edit-event": EditEventFlow,
  "change-rsvp": ChangeRsvpFlow,
  "edit-club": EditClubFlow,
  "invite-admin": InviteAdminFlow,
  "pace-group": ChangePaceFlow,
  "export": ExportMembersFlow,
  "duplicate": DuplicateEventFlow,
  "profile": EditProfileFlow,
};

export default function UserFlows() {
  const [active, setActive] = useState("edit-event");
  const Comp = comps[active];

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>

      <div style={{ background: "#0a0f1a", borderBottom: "1px solid #1e293b", padding: "12px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>User Flows</div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {flows.map(f => (
              <button key={f.id} onClick={() => setActive(f.id)} style={{
                padding: "5px 12px", fontSize: "11px", fontWeight: active === f.id ? 700 : 400,
                background: active === f.id ? "#F43F5E15" : "transparent",
                border: active === f.id ? "1px solid #F43F5E33" : "1px solid transparent",
                borderRadius: "6px", color: active === f.id ? "#F43F5E" : "#64748b",
                cursor: "pointer", fontFamily: "inherit",
              }}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
        <div style={{
          width: "480px", borderRadius: "16px", overflow: "hidden",
          border: "3px solid #334155", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          maxHeight: "750px", overflowY: "auto", background: t.bg,
        }}>
          <Comp />
        </div>
      </div>
    </div>
  );
}
