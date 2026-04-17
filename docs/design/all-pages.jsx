import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Inline icon components to avoid lucide version issues
const Icon = ({
  d,
  size = 14,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}
    {...props}
  >
    <path d={d} />
  </svg>
);
const MapPin = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    {...p}
  />
);
const Users = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
    {...p}
  />
);
const Calendar = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18"
    {...p}
  />
);
const Check = ({ size, color, strokeWidth: sw, ...p }) => (
  <Icon size={size} color={color} strokeWidth={sw} d="M20 6L9 17l-5-5" {...p} />
);
const ChevronRight = ({ size, color, ...p }) => (
  <Icon size={size} color={color} d="M9 18l6-6-6-6" {...p} />
);
const Search = ({ size, color, style, ...p }) => (
  <svg
    width={size || 14}
    height={size || 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}
    {...p}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const Share2 = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13"
    {...p}
  />
);
const UserPlus = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M20 8v6 M23 11h-6"
    {...p}
  />
);
const Plus = ({ size, color, ...p }) => (
  <Icon size={size} color={color} d="M12 5v14 M5 12h14" {...p} />
);
const Download = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3"
    {...p}
  />
);
const Mail = ({ size, color, ...p }) => (
  <Icon
    size={size}
    color={color}
    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"
    {...p}
  />
);
const MoreH = ({ size, color, ...p }) => (
  <svg
    width={size || 14}
    height={size || 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="2"
    style={{ flexShrink: 0, cursor: "pointer" }}
    {...p}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
const TrendUp = ({ size, color, ...p }) => (
  <Icon size={size} color={color} d="M23 6l-9.5 9.5-5-5L1 18" {...p} />
);
const TrendDown = ({ size, color, ...p }) => (
  <Icon size={size} color={color} d="M23 18l-9.5-9.5-5 5L1 6" {...p} />
);
// Simple icon replacements using emoji or text where complex SVGs aren't needed
const FlameIcon = ({ size = 14, color = "#F43F5E" }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>🔥</span>
);
const HomeIcon = () => <span style={{ fontSize: "13px" }}>🏠</span>;
const CalendarIcon = () => <span style={{ fontSize: "13px" }}>📅</span>;
const UsersIcon = () => <span style={{ fontSize: "13px" }}>👥</span>;
const ChartIcon = () => <span style={{ fontSize: "13px" }}>📊</span>;
const SettingsIcon = () => <span style={{ fontSize: "13px" }}>⚙️</span>;
const FilterIcon = ({ size, ...p }) => (
  <Icon size={size} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" {...p} />
);

// ============================================
// THEME
// ============================================
export const t = {
  bg: "#FFFBF7",
  surface: "#FFFFFF",
  surfaceAlt: "#FFF5F0",
  border: "#FECDD3",
  borderMuted: "#F5F0EB",
  text: "#1C1917",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  primary: "#F43F5E",
  primaryHover: "#E11D48",
  primaryLight: "#FFF1F2",
  primaryBg: "#FFE4E6",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  success: "#16A34A",
  heroBg:
    "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)",
  heroText: "#FFFFFF",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
  badgeBg: "#FFF1F2",
  badgeText: "#F43F5E",
  venueBg: "#FEF3C7",
  venueText: "#B45309",
  navBg: "#FFFFFF",
  radius: "14px",
};

const ve = (type) =>
  type === "pub"
    ? "🍺"
    : type === "cafe"
      ? "☕"
      : type === "brunch"
        ? "🥐"
        : "📍";
const vibeC = {
  social: { bg: "#FFF1F2", text: "#F43F5E" },
  competitive: { bg: "#EDE9FE", text: "#7C3AED" },
  casual: { bg: "#FEF3C7", text: "#B45309" },
};

// Chart tooltip
const CT = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #F5F0EB",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "11px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ color: t.text, fontWeight: 600, marginBottom: "3px" }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ============================================
// SHARED NAV
// ============================================
export const Nav = ({ active, loggedIn }) => (
  <nav
    style={{
      background: t.navBg,
      borderBottom: `1px solid ${t.borderMuted}`,
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          background: t.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlameIcon size={14} />
      </div>
      <span
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          color: t.text,
        }}
      >
        runclub
      </span>
    </div>
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <span
        style={{
          fontSize: "12px",
          color: active === "explore" ? t.primary : t.textMuted,
          fontWeight: active === "explore" ? 600 : 400,
        }}
      >
        Explore
      </span>
      {!loggedIn ? (
        <>
          <span style={{ fontSize: "12px", color: t.textMuted }}>Log in</span>
          <button
            style={{
              padding: "5px 14px",
              background: t.primary,
              color: "white",
              border: "none",
              borderRadius: "7px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start a club
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              fontSize: "12px",
              color: active === "my-clubs" ? t.primary : t.textMuted,
              fontWeight: active === "my-clubs" ? 600 : 400,
            }}
          >
            My Clubs
          </span>
          <span
            style={{
              fontSize: "12px",
              color: active === "dashboard" ? t.primary : t.textMuted,
              fontWeight: active === "dashboard" ? 600 : 400,
            }}
          >
            Dashboard
          </span>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: t.primaryBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600,
              color: t.primary,
            }}
          >
            JK
          </div>
        </>
      )}
    </div>
  </nav>
);

// ============================================
// 1. LANDING PAGE
// ============================================
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

// ============================================
// 2. EXPLORE PAGE
// ============================================
const clubs = [
  {
    name: "London City Runners",
    city: "Bermondsey",
    members: 247,
    vibe: "social",
    next: "Wed 6:30 PM",
    dist: "5K",
    afterT: "pub",
    afterN: "The Crown & Anchor",
    streak: 24,
  },
  {
    name: "Hackney Half Pacers",
    city: "Hackney",
    members: 156,
    vibe: "competitive",
    next: "Tue 7:00 PM",
    dist: "8K",
    afterT: "cafe",
    afterN: "Climpson & Sons",
    streak: 18,
  },
  {
    name: "Brixton Brunch Runners",
    city: "Brixton",
    members: 89,
    vibe: "social",
    next: "Sat 9:00 AM",
    dist: "5K",
    afterT: "brunch",
    afterN: "Federation",
    streak: 12,
  },
  {
    name: "Mile End Track Club",
    city: "Mile End",
    members: 72,
    vibe: "competitive",
    next: "Thu 6:30 PM",
    dist: "10K",
    afterT: "pub",
    afterN: "The Morgan Arms",
    streak: 31,
  },
  {
    name: "Peckham Plodders",
    city: "Peckham",
    members: 64,
    vibe: "casual",
    next: "Sun 10:00 AM",
    dist: "5K",
    afterT: "cafe",
    afterN: "Old Spike Roastery",
    streak: 8,
  },
];

const ExplorePage = () => {
  const [vf, setVf] = useState("all");
  const [af, setAf] = useState("all");
  const filtered = clubs.filter(
    (c) => (vf === "all" || c.vibe === vf) && (af === "all" || c.afterT === af),
  );
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav active="explore" />
      <div
        style={{
          background: t.heroBg,
          padding: "32px 24px 36px",
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
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "white",
              margin: "0 0 6px 0",
            }}
          >
            Find your run club
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 16px 0",
            }}
          >
            Discover clubs near you. Run together, grab drinks after.
          </p>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: t.textLight,
              }}
            />
            <input
              placeholder="Search by city or club name..."
              defaultValue="London"
              style={{
                width: "100%",
                padding: "11px 14px 11px 40px",
                borderRadius: "12px",
                border: "none",
                fontSize: "14px",
                background: "white",
                color: t.text,
                outline: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "100%", padding: "16px 20px 0" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "6px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                color: t.textLight,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "5px",
              }}
            >
              Vibe
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[
                { id: "all", l: "All" },
                { id: "social", l: "Social" },
                { id: "competitive", l: "Competitive" },
                { id: "casual", l: "Casual" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setVf(f.id)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: vf === f.id ? t.primaryLight : t.surface,
                    color: vf === f.id ? t.primary : t.textMuted,
                    border: `1px solid ${vf === f.id ? t.border : t.borderMuted}`,
                    borderRadius: "7px",
                    fontFamily: "inherit",
                  }}
                >
                  {f.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "9px",
                color: t.textLight,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "5px",
              }}
            >
              Afters
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[
                { id: "all", l: "Any" },
                { id: "pub", l: "🍺 Pub" },
                { id: "cafe", l: "☕ Café" },
                { id: "brunch", l: "🥐 Brunch" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAf(f.id)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: af === f.id ? t.venueBg : t.surface,
                    color: af === f.id ? t.venueText : t.textMuted,
                    border: `1px solid ${af === f.id ? "#FDE68A" : t.borderMuted}`,
                    borderRadius: "7px",
                    fontFamily: "inherit",
                  }}
                >
                  {f.l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{ fontSize: "11px", color: t.textLight, marginBottom: "12px" }}
        >
          {filtered.length} clubs
        </div>
      </div>
      <div
        style={{
          padding: "0 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {filtered.map((c, i) => (
          <div
            key={i}
            style={{
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: t.radius,
              padding: "14px",
              boxShadow: t.cardShadow,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    margin: "0 0 2px 0",
                  }}
                >
                  {c.name}
                </h3>
                <div
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <MapPin size={11} color={t.textLight} />
                  <span style={{ fontSize: "11px", color: t.textMuted }}>
                    {c.city}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 6px",
                      borderRadius: "5px",
                      fontWeight: 600,
                      background: vibeC[c.vibe].bg,
                      color: vibeC[c.vibe].text,
                    }}
                  >
                    {c.vibe}
                  </span>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <FlameIcon size={12} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: t.primary,
                  }}
                >
                  {c.streak}wk
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "11px",
                color: t.textMuted,
              }}
            >
              <span>
                <Users size={11} /> {c.members}
              </span>
              <span>Next: {c.next}</span>
              <span
                style={{
                  padding: "1px 6px",
                  background: t.surfaceAlt,
                  borderRadius: "4px",
                }}
              >
                {c.dist}
              </span>
            </div>
            <div
              style={{
                display: "inline-flex",
                gap: "4px",
                alignItems: "center",
                padding: "4px 8px",
                background: t.venueBg,
                borderRadius: "6px",
              }}
            >
              <span style={{ fontSize: "11px" }}>{ve(c.afterT)}</span>
              <span
                style={{
                  fontSize: "10px",
                  color: t.venueText,
                  fontWeight: 600,
                }}
              >
                Afters at {c.afterN}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 3. CLUB PUBLIC PAGE
// ============================================
const ClubPage = () => {
  const [rsvp, setRsvp] = useState(null);
  const [showAfters, setShowAfters] = useState(false);
  const handleRsvp = () => {
    setRsvp("going");
    setShowAfters(true);
  };
  const handleAfters = (j) => {
    setRsvp(j ? "going+social" : "going");
    setShowAfters(false);
  };
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav />
      <div
        style={{
          background: t.heroBg,
          padding: "32px 20px 40px",
          position: "relative",
          overflow: "hidden",
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
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              gap: "5px",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: "16px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <MapPin size={11} color="white" />
            <span style={{ fontSize: "11px", color: "white", fontWeight: 500 }}>
              Bermondsey, London
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "white",
              margin: "0 0 6px 0",
              lineHeight: 1.1,
            }}
          >
            London City Runners
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 12px 0",
              lineHeight: 1.5,
            }}
          >
            Wednesday and Sunday runs through Bermondsey. All paces welcome.
            Always ends at a great venue.
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              color: "white",
              fontWeight: 600,
              flexWrap: "wrap",
            }}
          >
            <span>
              <Users size={12} /> 247 members
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>🏃 Social</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              <FlameIcon size={12} /> 24wk streak
            </span>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px 28px" }}>
        {/* Next event */}
        <div
          style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: "0 2px 12px rgba(244,63,94,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: t.heroBg,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: t.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Next run
              </span>
              <span style={{ fontSize: "10px", color: t.textLight }}>
                in 4 days
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: t.primary,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Details <ChevronRight size={12} style={{ display: "inline" }} />
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              margin: "0 0 6px 0",
            }}
          >
            Wednesday Evening 5K
          </h3>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontSize: "12px",
              color: t.textMuted,
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>Wed 26 Mar · 6:30 PM</span>
            <span
              style={{
                padding: "1px 6px",
                background: t.surfaceAlt,
                borderRadius: "5px",
                fontSize: "10px",
              }}
            >
              5K
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              fontSize: "12px",
              color: t.textMuted,
              marginBottom: "10px",
            }}
          >
            <MapPin size={12} color={t.textLight} /> The Arch Climbing Wall
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {["🐇 Fast", "🏃 Steady", "🐢 Easy"].map((pg) => (
              <span
                key={pg}
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  background: t.surfaceAlt,
                  color: t.textMuted,
                  borderRadius: "6px",
                }}
              >
                {pg}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 10px",
              background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
              border: "1px solid #FDE68A",
              borderRadius: "9px",
              marginBottom: "14px",
            }}
          >
            <span>🍺</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#78350F",
                flex: 1,
              }}
            >
              Afters at The Crown & Anchor
            </span>
            <span style={{ fontSize: "10px", color: "#92400E" }}>31 going</span>
          </div>
          {!rsvp && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleRsvp}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: t.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "11px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  boxShadow: "0 3px 14px rgba(244,63,94,0.3)",
                }}
              >
                I'm in! 🏃
              </button>
              <div style={{ textAlign: "center", minWidth: "44px" }}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  42
                </div>
                <div style={{ fontSize: "9px", color: t.textLight }}>going</div>
              </div>
            </div>
          )}
          {showAfters && (
            <div style={{ animation: "slideDown 0.35s ease forwards" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 10px",
                  background: "#F0FDF4",
                  borderRadius: "9px",
                  border: "1px solid #BBF7D0",
                  marginBottom: "8px",
                }}
              >
                <Check size={14} color={t.success} strokeWidth={3} />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#166534",
                    fontWeight: 600,
                  }}
                >
                  You're in! 🎉
                </span>
              </div>
              <div
                style={{
                  background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
                  border: "1px solid #FDE68A",
                  borderRadius: "11px",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78350F",
                    marginBottom: "8px",
                  }}
                >
                  🍺 Staying for afters at The Crown & Anchor?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleAfters(true)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      background: "#B45309",
                      color: "white",
                      border: "none",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    Count me in! 🍺
                  </button>
                  <button
                    onClick={() => handleAfters(false)}
                    style={{
                      padding: "9px 14px",
                      background: "rgba(255,255,255,0.7)",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      borderRadius: "9px",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Just the run
                  </button>
                </div>
              </div>
            </div>
          )}
          {rsvp && !showAfters && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 12px",
                background: "#F0FDF4",
                borderRadius: "10px",
                border: "1px solid #BBF7D0",
              }}
            >
              <Check size={14} color={t.success} strokeWidth={3} />
              <span
                style={{
                  fontSize: "12px",
                  color: "#166534",
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {rsvp === "going+social"
                  ? "See you at The Crown & Anchor! 🎉"
                  : "See you at the start line! 🏃"}
              </span>
              <button
                onClick={() => {
                  setRsvp(null);
                  setShowAfters(false);
                }}
                style={{
                  fontSize: "10px",
                  color: t.textLight,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                }}
              >
                Undo
              </button>
            </div>
          )}
        </div>
        <button
          style={{
            width: "100%",
            padding: "11px",
            background: t.surface,
            color: t.primary,
            border: `1.5px solid ${t.border}`,
            borderRadius: t.radius,
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            marginBottom: "24px",
          }}
        >
          Join London City Runners
        </button>
        {/* Upcoming */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Upcoming runs
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              t: "Sunday Long Run",
              d: "Sun 30 Mar · 9:00 AM",
              dist: "10K",
              v: "Brewed Awakening",
              vt: "cafe",
              r: 28,
              s: 22,
            },
            {
              t: "Track Tuesday",
              d: "Tue 1 Apr · 7:00 PM",
              dist: "6K",
              v: null,
              vt: null,
              r: 19,
              s: null,
            },
            {
              t: "Wednesday Evening 5K",
              d: "Wed 2 Apr · 6:30 PM",
              dist: "5K",
              v: "The Crown & Anchor",
              vt: "pub",
              r: 14,
              s: 9,
            },
          ].map((e, i) => (
            <div
              key={i}
              style={{
                background: t.surface,
                border: `1px solid ${t.borderMuted}`,
                borderRadius: t.radius,
                padding: "12px",
                boxShadow: t.cardShadow,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      margin: "0 0 2px 0",
                    }}
                  >
                    {e.t}
                  </h3>
                  <span style={{ fontSize: "11px", color: t.textMuted }}>
                    {e.d}
                  </span>{" "}
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 5px",
                      background: t.surfaceAlt,
                      borderRadius: "4px",
                      color: t.textMuted,
                    }}
                  >
                    {e.dist}
                  </span>
                </div>
                <div style={{ textAlign: "right", fontSize: "11px" }}>
                  <div style={{ fontWeight: 600 }}>{e.r} going</div>
                  {e.s && (
                    <div style={{ color: t.textLight }}>{e.s} for afters</div>
                  )}
                </div>
              </div>
              {e.v && (
                <div
                  style={{
                    marginTop: "6px",
                    display: "inline-flex",
                    gap: "4px",
                    alignItems: "center",
                    padding: "3px 8px",
                    background: t.venueBg,
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{ve(e.vt)}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: t.venueText,
                      fontWeight: 600,
                    }}
                  >
                    Afters at {e.v}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* About + Stats */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 8px 0",
          }}
        >
          About
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: t.textMuted,
            lineHeight: 1.7,
            margin: "0 0 20px 0",
          }}
        >
          A social running club on Bermondsey's Beer Mile. Beginners to PB
          chasers. We always end at a local venue.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            marginBottom: "24px",
          }}
        >
          {[
            { l: "Avg turnout", v: "36", i: "👟" },
            { l: "Stay for afters", v: "78%", i: "🍻" },
            { l: "Club streak", v: "24wk", i: "🔥" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: t.surface,
                border: `1px solid ${t.borderMuted}`,
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
                boxShadow: t.cardShadow,
              }}
            >
              <div style={{ fontSize: "16px" }}>{s.i}</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: "9px", color: t.textLight }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Members */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          Active members
        </h2>
        {[
          { n: "Sarah Chen", s: 16, p: "5:00" },
          { n: "Tom Williams", s: 8, p: "5:30" },
          { n: "Priya Patel", s: 3, p: "6:30" },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "9px",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: t.primaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: t.primary,
              }}
            >
              {m.n[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 500 }}>{m.n}</div>
              <div style={{ fontSize: "10px", color: t.textLight }}>
                {m.p}/km
              </div>
            </div>
            <FlameIcon size={11} />
            <span
              style={{ fontSize: "10px", fontWeight: 600, color: t.primary }}
            >
              {m.s}wk
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 4. EVENT DETAIL
// ============================================
const EventPage = () => {
  const [rsvp, setRsvp] = useState(null);
  const [social, setSocial] = useState(false);
  const [pace, setPace] = useState(null);
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav />
      <div style={{ padding: "14px 20px 0" }}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            fontSize: "11px",
            color: t.textLight,
            marginBottom: "14px",
          }}
        >
          <span style={{ color: t.primary }}>London City Runners</span>
          <ChevronRight size={11} />
          <span>Events</span>
          <ChevronRight size={11} />
          <span style={{ color: t.textMuted }}>Wed 5K</span>
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              background: t.primaryLight,
              color: t.primary,
              borderRadius: "5px",
              fontWeight: 600,
            }}
          >
            🏃 Running
          </span>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              background: t.surfaceAlt,
              color: t.textMuted,
              borderRadius: "5px",
            }}
          >
            5K
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 3px 0",
          }}
        >
          Wednesday Evening 5K
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: t.primary,
            fontWeight: 600,
            margin: "0 0 16px 0",
          }}
        >
          London City Runners
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "11px",
              padding: "12px",
              boxShadow: t.cardShadow,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <Calendar size={13} color={t.primary} />
              <span style={{ fontSize: "10px", color: t.textLight }}>
                Date & time
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              Wed 26 March 2026
            </div>
            <div style={{ fontSize: "12px", color: t.textMuted }}>6:30 PM</div>
          </div>
          <div
            style={{
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "11px",
              padding: "12px",
              boxShadow: t.cardShadow,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <MapPin size={13} color={t.primary} />
              <span style={{ fontSize: "10px", color: t.textLight }}>
                Meeting point
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              The Arch Climbing Wall
            </div>
            <div
              style={{ fontSize: "11px", color: t.primary, fontWeight: 500 }}
            >
              Open in Maps →
            </div>
          </div>
        </div>
        {/* Venue card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
            border: "1px solid #FDE68A",
            borderRadius: "11px",
            padding: "14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: t.venueText,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "3px",
                }}
              >
                🍺 Afters
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: "#78350F",
                }}
              >
                The Crown & Anchor
              </div>
              <div
                style={{ fontSize: "12px", color: "#92400E", marginTop: "2px" }}
              >
                Happy hour until 8pm
              </div>
            </div>
            <span
              style={{ fontSize: "11px", color: t.venueText, fontWeight: 600 }}
            >
              View →
            </span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#92400E" }}>
            <strong>31</strong> staying for afters
          </div>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: t.textMuted,
            lineHeight: 1.7,
            margin: "0 0 16px 0",
          }}
        >
          Meet outside The Arch, warm-up, then our 5K loop through Southwark
          Park. Three pace groups — nobody left behind.
        </p>
        {/* Pace groups */}
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            margin: "0 0 8px 0",
          }}
        >
          Choose your pace group
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginBottom: "16px",
          }}
        >
          {[
            { n: "🐇 Fast", p: "< 5:00/km", r: 8 },
            { n: "🏃 Steady", p: "5:00–6:00/km", r: 22 },
            { n: "🐢 Easy", p: "6:00+/km", r: 12 },
          ].map((g) => (
            <button
              key={g.n}
              onClick={() => setPace(g.n)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: "9px",
                cursor: "pointer",
                fontFamily: "inherit",
                background: pace === g.n ? t.primaryLight : t.surface,
                border: `1.5px solid ${pace === g.n ? t.primary : t.borderMuted}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {pace === g.n && (
                  <Check size={14} color={t.primary} strokeWidth={3} />
                )}
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{g.n}</div>
                  <div style={{ fontSize: "11px", color: t.textMuted }}>
                    {g.p}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", color: t.textLight }}>
                {g.r} runners
              </span>
            </button>
          ))}
        </div>
        {/* RSVP */}
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "16px",
            boxShadow: t.cardShadow,
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              margin: "0 0 10px 0",
            }}
          >
            Are you coming?
          </h3>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {[
              { id: "going", l: "I'm in! 🏃" },
              { id: "maybe", l: "Maybe" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setRsvp(o.id)}
                style={{
                  flex: o.id === "going" ? 2 : 1,
                  padding: "11px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: 600,
                  background:
                    rsvp === o.id
                      ? o.id === "going"
                        ? t.primary
                        : t.accent
                      : t.surface,
                  color: rsvp === o.id ? "white" : t.textMuted,
                  border: `1.5px solid ${rsvp === o.id ? "transparent" : t.borderMuted}`,
                  boxShadow:
                    rsvp === o.id && o.id === "going"
                      ? "0 2px 12px rgba(244,63,94,0.3)"
                      : "none",
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
          {(rsvp === "going" || rsvp === "maybe") && (
            <div
              onClick={() => setSocial(!social)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "9px",
                cursor: "pointer",
                background: social ? t.venueBg : t.surfaceAlt,
                border: `1.5px solid ${social ? "#FDE68A" : t.borderMuted}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>🍺</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: social ? "#78350F" : t.textMuted,
                  }}
                >
                  Staying for afters?
                </span>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "10px",
                  padding: "2px",
                  background: social ? t.success : "#D4D4D8",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "white",
                    transform: social ? "translateX(16px)" : "translateX(0)",
                    transition: "transform 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>
          )}
          {rsvp === "going" && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "6px",
                alignItems: "center",
                padding: "8px 10px",
                background: "#F0FDF4",
                borderRadius: "9px",
                border: "1px solid #BBF7D0",
              }}
            >
              <Check size={14} color={t.success} strokeWidth={3} />
              <span
                style={{ fontSize: "12px", color: "#166534", fontWeight: 500 }}
              >
                {social
                  ? "See you at The Crown & Anchor! 🎉"
                  : "See you at the start line 🏃"}
              </span>
            </div>
          )}
        </div>
        {/* Attendees */}
        <div
          style={{ fontSize: "11px", color: t.textLight, marginBottom: "8px" }}
        >
          42 going · 31 for afters · 6 maybe
        </div>
        {[
          { n: "Sarah C.", p: "Fast", s: true },
          { n: "Tom W.", p: "Steady", s: true },
          { n: "Priya P.", p: "Easy", s: true },
          { n: "James K.", p: "Steady", s: false },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              background: t.surface,
              border: `1px solid ${t.borderMuted}`,
              borderRadius: "9px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: t.primaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 600,
                color: t.primary,
              }}
            >
              {m.n[0]}
            </div>
            <span style={{ flex: 1, fontSize: "12px", fontWeight: 500 }}>
              {m.n}
            </span>
            <span
              style={{
                fontSize: "9px",
                padding: "2px 6px",
                background: t.surfaceAlt,
                borderRadius: "4px",
                color: t.textMuted,
              }}
            >
              {m.p}
            </span>
            {m.s && <span style={{ fontSize: "11px" }}>🍺</span>}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "9px",
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "9px",
              background: t.surface,
              fontSize: "12px",
              fontWeight: 600,
              color: t.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Share2 size={12} /> Share
          </button>
          <button
            style={{
              flex: 1,
              padding: "9px",
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "9px",
              background: t.surface,
              fontSize: "12px",
              fontWeight: 600,
              color: t.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <UserPlus size={12} /> Invite
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 5. MY CLUBS (MEMBER HOME)
// ============================================
const MyClubsPage = () => (
  <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
    <Nav loggedIn active="my-clubs" />
    <div style={{ padding: "20px 20px 28px" }}>
      <h1
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          margin: "0 0 4px 0",
        }}
      >
        My Clubs
      </h1>
      <p style={{ fontSize: "13px", color: t.textMuted, margin: "0 0 20px 0" }}>
        Your upcoming runs across all clubs
      </p>
      {/* Upcoming across clubs */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          margin: "0 0 10px 0",
        }}
      >
        Coming up
      </h2>
      {[
        {
          club: "London City Runners",
          event: "Wednesday Evening 5K",
          date: "Wed 26 Mar · 6:30 PM",
          dist: "5K",
          v: "The Crown & Anchor",
          vt: "pub",
          rsvp: true,
        },
        {
          club: "London City Runners",
          event: "Sunday Long Run",
          date: "Sun 30 Mar · 9:00 AM",
          dist: "10K",
          v: "Brewed Awakening",
          vt: "cafe",
          rsvp: false,
        },
        {
          club: "Hackney Half Pacers",
          event: "Tuesday Track Session",
          date: "Tue 1 Apr · 7:00 PM",
          dist: "8K",
          v: null,
          vt: null,
          rsvp: false,
        },
      ].map((e, i) => (
        <div
          key={i}
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "12px",
            marginBottom: "8px",
            boxShadow: t.cardShadow,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: t.primary,
              fontWeight: 600,
              marginBottom: "3px",
            }}
          >
            {e.club}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: "0 0 2px 0",
                }}
              >
                {e.event}
              </h3>
              <span style={{ fontSize: "11px", color: t.textMuted }}>
                {e.date}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 5px",
                  background: t.surfaceAlt,
                  borderRadius: "4px",
                  color: t.textMuted,
                  marginLeft: "5px",
                }}
              >
                {e.dist}
              </span>
            </div>
            {e.rsvp ? (
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  background: "#F0FDF4",
                  color: "#166534",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                Going ✓
              </span>
            ) : (
              <button
                style={{
                  fontSize: "10px",
                  padding: "4px 10px",
                  background: t.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                RSVP
              </button>
            )}
          </div>
          {e.v && (
            <div
              style={{
                marginTop: "5px",
                display: "inline-flex",
                gap: "3px",
                alignItems: "center",
                padding: "3px 7px",
                background: t.venueBg,
                borderRadius: "5px",
              }}
            >
              <span style={{ fontSize: "10px" }}>{ve(e.vt)}</span>
              <span
                style={{ fontSize: "9px", color: t.venueText, fontWeight: 600 }}
              >
                Afters at {e.v}
              </span>
            </div>
          )}
        </div>
      ))}
      {/* Clubs list */}
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          margin: "20px 0 10px 0",
        }}
      >
        Your clubs
      </h2>
      {[
        { n: "London City Runners", m: 247, s: 16, city: "Bermondsey" },
        { n: "Hackney Half Pacers", m: 156, s: 4, city: "Hackney" },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            marginBottom: "8px",
            boxShadow: t.cardShadow,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: t.heroBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlameIcon size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {c.n}
            </div>
            <div style={{ fontSize: "11px", color: t.textMuted }}>
              {c.city} · {c.m} members
            </div>
          </div>
          <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
            <FlameIcon size={11} />
            <span
              style={{ fontSize: "11px", fontWeight: 600, color: t.primary }}
            >
              {c.s}wk
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// 6. DASHBOARD
// ============================================
const attData = [
  { e: "Feb 5", rsvp: 38, actual: 32, social: 24 },
  { e: "Feb 12", rsvp: 30, actual: 21, social: 15 },
  { e: "Feb 19", rsvp: 42, actual: 35, social: 28 },
  { e: "Feb 26", rsvp: 40, actual: 34, social: 25 },
  { e: "Mar 5", rsvp: 45, actual: 38, social: 30 },
  { e: "Mar 12", rsvp: 48, actual: 41, social: 32 },
  { e: "Mar 19", rsvp: 44, actual: 36, social: 27 },
];
const showData = [
  { m: "Nov", r: 71 },
  { m: "Dec", r: 65 },
  { m: "Jan", r: 74 },
  { m: "Feb", r: 76 },
  { m: "Mar", r: 80 },
];
const healthData = [
  { name: "Active", value: 38, color: "#16A34A" },
  { name: "At Risk", value: 12, color: "#F59E0B" },
  { name: "Lapsed", value: 18, color: "#EF4444" },
  { name: "New", value: 6, color: "#8B5CF6" },
];

const DashboardPage = () => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text }}>
      <Nav loggedIn active="dashboard" />
      <div style={{ display: "flex", minHeight: "calc(100% - 45px)" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "180px",
            background: t.surface,
            borderRight: `1px solid ${t.borderMuted}`,
            padding: "16px 10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: t.textLight,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
              padding: "0 8px",
            }}
          >
            London City Runners
          </div>
          {[
            { id: "overview", icon: HomeIcon, l: "Overview" },
            { id: "events", icon: CalendarIcon, l: "Events" },
            { id: "members", icon: UsersIcon, l: "Members" },
            { id: "analytics", icon: ChartIcon, l: "Analytics" },
            { id: "settings", icon: SettingsIcon, l: "Settings" },
          ].map((i) => (
            <button
              key={i.id}
              onClick={() => setTab(i.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 10px",
                width: "100%",
                background: tab === i.id ? t.primaryLight : "transparent",
                border: "none",
                borderRadius: "8px",
                color: tab === i.id ? t.primary : t.textMuted,
                fontSize: "12px",
                fontWeight: tab === i.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: "2px",
              }}
            >
              <i.icon /> {i.l}
              {i.id === "analytics" && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "8px",
                    padding: "1px 5px",
                    background: t.primaryBg,
                    color: t.primary,
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  PRO
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {tab === "overview" && (
            <>
              {/* Post-event capture */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${t.venueBg}, #FEF9C3)`,
                  border: "1px solid #FDE68A",
                  borderRadius: "12px",
                  padding: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#78350F",
                    marginBottom: "3px",
                  }}
                >
                  How did Wednesday's run go?
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#92400E",
                    marginBottom: "10px",
                  }}
                >
                  March 19 · Wednesday Evening 5K · 44 RSVPs
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#92400E",
                        marginBottom: "3px",
                      }}
                    >
                      Showed up
                    </div>
                    <input
                      type="number"
                      defaultValue="36"
                      style={{
                        width: "60px",
                        padding: "6px 8px",
                        borderRadius: "7px",
                        border: "1px solid #FDE68A",
                        background: "white",
                        fontSize: "15px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        textAlign: "center",
                        color: "#78350F",
                      }}
                      readOnly
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#92400E",
                        marginBottom: "3px",
                      }}
                    >
                      For afters
                    </div>
                    <input
                      type="number"
                      defaultValue="27"
                      style={{
                        width: "60px",
                        padding: "6px 8px",
                        borderRadius: "7px",
                        border: "1px solid #FDE68A",
                        background: "white",
                        fontSize: "15px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        textAlign: "center",
                        color: "#78350F",
                      }}
                      readOnly
                    />
                  </div>
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "#B45309",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {[
                  { l: "Avg attendance", v: "31", c: t.success },
                  { l: "Show rate", v: "78%", c: t.secondary },
                  { l: "Afters rate", v: "74%", c: t.accent },
                  { l: "Active members", v: "38", c: t.text },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: t.surface,
                      border: `1px solid ${t.borderMuted}`,
                      borderRadius: "10px",
                      padding: "12px",
                      boxShadow: t.cardShadow,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: t.textLight,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "3px",
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: s.c,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Next event */}
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderMuted}`,
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: t.cardShadow,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: t.textLight,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  Next event
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      Wednesday Evening 5K
                    </div>
                    <div style={{ fontSize: "12px", color: t.textMuted }}>
                      Wed 26 Mar · 6:30 PM · 42 RSVPs
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "6px 12px",
                      background: t.primaryLight,
                      color: t.primary,
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Manage →
                  </button>
                </div>
              </div>
            </>
          )}
          {tab === "analytics" && (
            <>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 14px 0",
                }}
              >
                Attendance Analytics
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {[
                  { l: "Avg attendance", v: "31", s: "+12%", up: true },
                  { l: "Show rate", v: "78%", s: "+4%", up: true },
                  { l: "Afters rate", v: "74%", s: "-2%", up: false },
                  { l: "Active members", v: "38/74", s: "51%", up: null },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: t.surface,
                      border: `1px solid ${t.borderMuted}`,
                      borderRadius: "10px",
                      padding: "10px",
                      boxShadow: t.cardShadow,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: t.textLight,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        marginBottom: "2px",
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {s.v}
                    </div>
                    {s.up !== null && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: s.up ? t.success : t.primary,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        {s.up ? <TrendUp size={10} /> : <TrendDown size={10} />}{" "}
                        {s.s}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Attendance chart */}
              <div
                style={{
                  background: t.surface,
                  border: `1px solid ${t.borderMuted}`,
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: t.cardShadow,
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Attendance Over Time
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={attData} barGap={2}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={t.borderMuted}
                    />
                    <XAxis
                      dataKey="e"
                      tick={{ fill: t.textLight, fontSize: 9 }}
                    />
                    <YAxis tick={{ fill: t.textLight, fontSize: 9 }} />
                    <Tooltip content={<CT />} />
                    <Bar
                      dataKey="rsvp"
                      name="RSVPs"
                      fill={t.borderMuted}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      name="Actual"
                      fill={t.success}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="social"
                      name="Afters"
                      fill={t.accent}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    fontSize: "10px",
                    color: t.textLight,
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  Grey = RSVPs · Green = showed up · Amber = stayed for afters
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                {/* Show rate */}
                <div
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Show Rate Trend
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={showData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={t.borderMuted}
                      />
                      <XAxis
                        dataKey="m"
                        tick={{ fill: t.textLight, fontSize: 9 }}
                      />
                      <YAxis
                        domain={[50, 100]}
                        tick={{ fill: t.textLight, fontSize: 9 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Area
                        type="monotone"
                        dataKey="r"
                        name="Show rate"
                        stroke={t.secondary}
                        fill={`${t.secondary}15`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Member health */}
                <div
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Member Health
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <ResponsiveContainer width="45%" height={100}>
                      <PieChart>
                        <Pie
                          data={healthData}
                          cx="50%"
                          cy="50%"
                          outerRadius={40}
                          innerRadius={25}
                          dataKey="value"
                          stroke="none"
                        >
                          {healthData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div>
                      {healthData.map((d) => (
                        <div
                          key={d.name}
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "2px",
                              background: d.color,
                            }}
                          />
                          <span
                            style={{ fontSize: "10px", color: t.textMuted }}
                          >
                            {d.name}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              marginLeft: "auto",
                            }}
                          >
                            {d.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Insights */}
              <div
                style={{
                  fontSize: "10px",
                  color: t.textLight,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Insights
              </div>
              {[
                { i: "📈", t: "Attendance up 22% this month", c: t.success },
                {
                  i: "🌧️",
                  t: "Rainy days reduce attendance ~28%",
                  c: t.accent,
                },
                {
                  i: "🍺",
                  t: "The Crown gets 18% more RSVPs than The Fox",
                  c: t.accent,
                },
                { i: "⚠️", t: "12 members at risk of lapsing", c: t.primary },
              ].map((ins, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "8px",
                    marginBottom: "5px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{ins.i}</span>
                  <span style={{ fontSize: "11px", color: ins.c }}>
                    {ins.t}
                  </span>
                </div>
              ))}
            </>
          )}
          {tab === "events" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Events
                </h2>
                <button
                  style={{
                    padding: "7px 14px",
                    background: t.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={14} /> New event
                </button>
              </div>
              {[
                {
                  t: "Wednesday Evening 5K",
                  d: "Wed 26 Mar · 6:30 PM",
                  s: "upcoming",
                  r: 42,
                },
                {
                  t: "Sunday Long Run",
                  d: "Sun 30 Mar · 9:00 AM",
                  s: "upcoming",
                  r: 28,
                },
                {
                  t: "Wednesday Evening 5K",
                  d: "Wed 19 Mar · 6:30 PM",
                  s: "completed",
                  r: 44,
                  a: 36,
                },
                {
                  t: "Sunday Long Run",
                  d: "Sun 16 Mar · 9:00 AM",
                  s: "completed",
                  r: 32,
                  a: 26,
                },
              ].map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "10px",
                    marginBottom: "6px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {e.t}
                    </div>
                    <div style={{ fontSize: "11px", color: t.textMuted }}>
                      {e.d}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {e.s === "completed" && (
                      <span style={{ fontSize: "10px", color: t.textMuted }}>
                        {e.a}/{e.r} attended
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "5px",
                        fontWeight: 600,
                        background:
                          e.s === "upcoming" ? "#F0FDF4" : t.surfaceAlt,
                        color: e.s === "upcoming" ? t.success : t.textLight,
                      }}
                    >
                      {e.s}
                    </span>
                    <MoreH size={14} color={t.textLight} />
                  </div>
                </div>
              ))}
            </>
          )}
          {tab === "members" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Members{" "}
                  <span
                    style={{
                      fontSize: "13px",
                      color: t.textLight,
                      fontWeight: 400,
                    }}
                  >
                    · 74
                  </span>
                </h2>
                <button
                  style={{
                    padding: "6px 12px",
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "7px",
                    background: t.surface,
                    fontSize: "11px",
                    color: t.textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "inherit",
                  }}
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>
              {[
                {
                  n: "Sarah Chen",
                  r: "member",
                  s: "active",
                  att: 16,
                  sr: "100%",
                  p: "5:00/km",
                },
                {
                  n: "Tom Williams",
                  r: "admin",
                  s: "active",
                  att: 8,
                  sr: "88%",
                  p: "5:30/km",
                },
                {
                  n: "Priya Patel",
                  r: "member",
                  s: "new",
                  att: 3,
                  sr: "100%",
                  p: "6:30/km",
                },
                {
                  n: "Alex Morgan",
                  r: "member",
                  s: "at_risk",
                  att: 12,
                  sr: "72%",
                  p: "5:15/km",
                },
                {
                  n: "Mike Johnson",
                  r: "member",
                  s: "lapsed",
                  att: 5,
                  sr: "60%",
                  p: "6:00/km",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "9px",
                    marginBottom: "5px",
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: t.primaryBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: t.primary,
                    }}
                  >
                    {m.n[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>
                      {m.n}{" "}
                      {m.r === "admin" && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 5px",
                            background: t.primaryLight,
                            color: t.primary,
                            borderRadius: "4px",
                            fontWeight: 600,
                          }}
                        >
                          Admin
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "10px", color: t.textLight }}>
                      {m.p} · {m.att} events · {m.sr} show rate
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 7px",
                      borderRadius: "5px",
                      fontWeight: 600,
                      background:
                        m.s === "active"
                          ? "#F0FDF4"
                          : m.s === "new"
                            ? "#EDE9FE"
                            : m.s === "at_risk"
                              ? "#FEF3C7"
                              : "#FEF2F2",
                      color:
                        m.s === "active"
                          ? t.success
                          : m.s === "new"
                            ? t.secondary
                            : m.s === "at_risk"
                              ? t.accent
                              : "#EF4444",
                    }}
                  >
                    {m.s === "at_risk" ? "At risk" : m.s}
                  </span>
                </div>
              ))}
            </>
          )}
          {tab === "settings" && (
            <>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 14px 0",
                }}
              >
                Settings
              </h2>
              {[
                "Club details",
                "Billing & subscription",
                "Custom branding",
                "Notifications",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px",
                    background: t.surface,
                    border: `1px solid ${t.borderMuted}`,
                    borderRadius: "10px",
                    marginBottom: "6px",
                    boxShadow: t.cardShadow,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{s}</span>
                  <ChevronRight size={16} color={t.textLight} />
                </div>
              ))}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#DC2626",
                    marginBottom: "3px",
                  }}
                >
                  Danger zone
                </div>
                <div style={{ fontSize: "12px", color: "#991B1B" }}>
                  Delete club permanently
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// 7. LOGIN / SIGNUP
// ============================================
const AuthPage = () => (
  <div
    style={{
      background: t.bg,
      minHeight: "100%",
      color: t.text,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Nav />
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "340px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: t.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <FlameIcon size={22} />
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "22px",
              fontWeight: 800,
              margin: "0 0 4px 0",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>
            Log in to manage your club
          </p>
        </div>
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: t.radius,
            padding: "20px",
            boxShadow: t.cardShadow,
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                fontSize: "12px",
                color: t.textMuted,
                fontWeight: 500,
                display: "block",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <input
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: `1px solid ${t.borderMuted}`,
                fontSize: "14px",
                background: t.bg,
                outline: "none",
                boxSizing: "border-box",
                color: t.text,
              }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "12px",
                color: t.textMuted,
                fontWeight: 500,
                display: "block",
                marginBottom: "5px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: `1px solid ${t.borderMuted}`,
                fontSize: "14px",
                background: t.bg,
                outline: "none",
                boxSizing: "border-box",
                color: t.text,
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              padding: "11px",
              background: t.primary,
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
              marginBottom: "10px",
            }}
          >
            Log in
          </button>
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: t.textLight,
              marginBottom: "12px",
            }}
          >
            or
          </div>
          <button
            style={{
              width: "100%",
              padding: "10px",
              background: t.surface,
              color: t.textMuted,
              border: `1.5px solid ${t.borderMuted}`,
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Mail size={14} /> Send me a magic link
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: t.textMuted,
            marginTop: "14px",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{ color: t.primary, fontWeight: 600, cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN — PAGE SWITCHER
// ============================================
const allPages = [
  { id: "landing", label: "Landing", comp: LandingPage },
  { id: "explore", label: "Explore", comp: ExplorePage },
  { id: "club", label: "Club Page", comp: ClubPage },
  { id: "event", label: "Event Detail", comp: EventPage },
  { id: "auth", label: "Login", comp: AuthPage },
  { id: "myclubs", label: "My Clubs", comp: MyClubsPage },
  { id: "dashboard", label: "Dashboard", comp: DashboardPage },
];

export default function AllPages() {
  const [active, setActive] = useState("landing");
  const Comp = allPages.find((p) => p.id === active).comp;
  const isMobile = ["club", "event", "auth"].includes(active);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bricolage+Grotesque:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); max-height: 0; } to { opacity: 1; transform: translateY(0); max-height: 200px; } }`}</style>
      {/* Page selector */}
      <div
        style={{
          background: "#0a0f1a",
          borderBottom: "1px solid #1e293b",
          padding: "12px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            gap: "4px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginRight: "8px",
            }}
          >
            All Pages
          </span>
          {allPages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              style={{
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: active === p.id ? 700 : 400,
                background: active === p.id ? "#F43F5E15" : "transparent",
                border:
                  active === p.id
                    ? "1px solid #F43F5E33"
                    : "1px solid transparent",
                borderRadius: "6px",
                color: active === p.id ? "#F43F5E" : "#64748b",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {/* Frame */}
      <div
        style={{ display: "flex", justifyContent: "center", padding: "24px" }}
      >
        <div
          style={{
            width: isMobile ? "390px" : "100%",
            maxWidth: isMobile ? "390px" : "860px",
            borderRadius: isMobile ? "20px" : "12px",
            overflow: "hidden",
            border: "3px solid #334155",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            maxHeight: isMobile ? "780px" : "700px",
            overflowY: "auto",
            background: t.bg,
          }}
        >
          <Comp />
        </div>
      </div>
    </div>
  );
}
