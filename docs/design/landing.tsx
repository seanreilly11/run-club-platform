import { Nav } from "./all-pages.jsx";
import { t } from "./all-pages.jsx";

const LandingPage = () => (
  <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
    <Nav />
    {/* Hero */}
    <div
      style={{
        background: t.heroBg,
        padding: "52px 24px 60px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div
        style={{ position: "relative", maxWidth: "500px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: "5px",
            padding: "4px 12px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            marginBottom: "14px",
            fontSize: "12px",
            color: "white",
            fontWeight: 500,
          }}
        >
          🏃 The platform for run clubs
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "34px",
            fontWeight: 800,
            color: "white",
            margin: "0 0 10px 0",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          Run together.
          <br />
          Grab drinks after.
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 24px 0",
            lineHeight: 1.6,
          }}
        >
          The all-in-one platform for run club organizers. Schedule events,
          manage members, track attendance — and coordinate afters at your
          favourite venue.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            style={{
              padding: "12px 28px",
              background: "white",
              color: t.primary,
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            Start a club — it's free
          </button>
          <button
            style={{
              padding: "12px 20px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              backdropFilter: "blur(4px)",
            }}
          >
            Explore clubs
          </button>
        </div>
      </div>
    </div>

    {/* Social proof */}
    <div
      style={{
        textAlign: "center",
        padding: "20px 24px",
        borderBottom: `1px solid ${t.borderMuted}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "28px",
          fontSize: "13px",
          color: t.textMuted,
        }}
      >
        <span>
          <strong style={{ color: t.text }}>1,200+</strong> clubs
        </span>
        <span>
          <strong style={{ color: t.text }}>48,000+</strong> members
        </span>
        <span>
          <strong style={{ color: t.text }}>12 cities</strong>
        </span>
      </div>
    </div>

    {/* Features */}
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "36px 24px" }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Everything your club needs
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          {
            icon: "📋",
            title: "Events & RSVPs",
            desc: "Schedule runs, set pace groups, collect RSVPs. Know exactly who's coming.",
          },
          {
            icon: "🍺",
            title: "Afters coordination",
            desc: "Every event has a venue. Members RSVP for the run AND the afters separately.",
          },
          {
            icon: "📊",
            title: "Attendance analytics",
            desc: "Track turnout trends, show rates, member health. Know what's working.",
          },
          {
            icon: "🌐",
            title: "Your club page",
            desc: "A beautiful, SEO-optimized page. New members find you on Google and join in one click.",
          },
          {
            icon: "🔥",
            title: "Streaks & engagement",
            desc: "Member streaks, milestones, and stats. Keep your community coming back.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              display: "flex",
              gap: "14px",
              padding: "16px",
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: t.radius,
              boxShadow: t.cardShadow,
            }}
          >
            <span style={{ fontSize: "24px", flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: t.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Pricing */}
    <div
      style={{
        background: t.surfaceAlt,
        padding: "36px 24px",
        borderTop: `1px solid ${t.borderMuted}`,
      }}
    >
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          textAlign: "center",
          margin: "0 0 6px 0",
        }}
      >
        Simple pricing
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: t.textMuted,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Free to start. Upgrade when your club grows.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "20px",
            boxShadow: t.cardShadow,
          }}
        >
          <div
            style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}
          >
            Free
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              marginBottom: "10px",
            }}
          >
            $0
          </div>
          {[
            "1 club, up to 30 members",
            "Events & RSVPs",
            "Afters coordination",
            "Public club page",
            "Email reminders",
          ].map((f) => (
            <div
              key={f}
              style={{
                fontSize: "12px",
                color: t.textMuted,
                display: "flex",
                gap: "5px",
                marginBottom: "4px",
              }}
            >
              <Check size={13} color={t.success} /> {f}
            </div>
          ))}
          <button
            style={{
              width: "100%",
              marginTop: "14px",
              padding: "10px",
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "10px",
              background: t.surface,
              color: t.text,
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Get started
          </button>
        </div>
        <div
          style={{
            background: t.surface,
            border: `2px solid ${t.primary}`,
            borderRadius: t.radius,
            padding: "20px",
            boxShadow: "0 4px 16px rgba(244,63,94,0.1)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "12px",
              padding: "2px 10px",
              background: t.primary,
              color: "white",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            POPULAR
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: t.primary,
              marginBottom: "2px",
            }}
          >
            Pro
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              marginBottom: "2px",
            }}
          >
            $29
            <span
              style={{ fontSize: "14px", color: t.textMuted, fontWeight: 400 }}
            >
              /mo
            </span>
          </div>
          {[
            "Up to 3 clubs",
            "Unlimited members",
            "Full analytics dashboard",
            "Member health & streaks",
            "AI insights",
            "Custom branding",
          ].map((f) => (
            <div
              key={f}
              style={{
                fontSize: "12px",
                color: t.textMuted,
                display: "flex",
                gap: "5px",
                marginBottom: "4px",
              }}
            >
              <Check size={13} color={t.primary} /> {f}
            </div>
          ))}
          <button
            style={{
              width: "100%",
              marginTop: "14px",
              padding: "10px",
              border: "none",
              borderRadius: "10px",
              background: t.primary,
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
            }}
          >
            Start free trial
          </button>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      style={{
        padding: "24px",
        textAlign: "center",
        fontSize: "12px",
        color: t.textLight,
        borderTop: `1px solid ${t.borderMuted}`,
      }}
    >
      © 2026 RunClub ·{" "}
      <span style={{ color: t.textMuted, cursor: "pointer" }}>Privacy</span> ·{" "}
      <span style={{ color: t.textMuted, cursor: "pointer" }}>Terms</span>
    </div>
  </div>
);
