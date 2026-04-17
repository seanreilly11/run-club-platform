import { Check } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RunClub — The platform for run clubs",
  description:
    "Schedule events, manage members, track attendance — and coordinate afters at your favourite venue.",
};

const FEATURES = [
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
];

const FREE_FEATURES = [
  "1 club, up to 30 members",
  "Events & RSVPs",
  "Afters coordination",
  "Public club page",
  "Email reminders",
];

const PRO_FEATURES = [
  "Up to 3 clubs",
  "Unlimited members",
  "Full analytics dashboard",
  "Member health & streaks",
  "AI insights",
  "Custom branding",
];

export default function LandingPage() {
  return (
    <div className="min-h-full bg-background text-text">
      {/* Hero */}
      <div
        className="relative overflow-hidden text-center"
        style={{
          background:
            "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)",
          padding: "52px 24px 60px",
        }}
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.06,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto max-w-[700px]">
          <div
            className="mb-[32px] inline-flex items-center gap-[5px] text-[12px] font-medium text-white"
            style={{
              padding: "4px 12px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
            }}
          >
            🏃 The platform for run clubs
          </div>
          <h1
            className="text-white"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "42px",
              fontWeight: 800,
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
              margin: "0 0 32px 0",
              lineHeight: 1.6,
            }}
          >
            The all-in-one platform for run club organizers. Schedule events,
            manage members, track attendance — and coordinate afters at your
            favourite venue.
          </p>
          <div className="flex justify-center gap-[10px]">
            <Link
              href="/create"
              style={{
                padding: "12px 28px",
                background: "white",
                color: "#F43F5E",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              Start a club — it&apos;s free
            </Link>
            <Link
              href="/explore"
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              Explore clubs
            </Link>
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div
        className="text-center"
        style={{ padding: "20px 24px", borderBottom: "1px solid #F5F0EB" }}
      >
        <div className="flex justify-center gap-[28px] text-[13px] text-text-muted">
          <span>
            <strong className="text-text">1,200+</strong> clubs
          </span>
          <span>
            <strong className="text-text">48,000+</strong> members
          </span>
          <span>
            <strong className="text-text">12 cities</strong>
          </span>
        </div>
      </div>

      {/* Features */}
      <div
        className="mx-auto"
        style={{ maxWidth: "560px", padding: "36px 24px" }}
      >
        <h2
          className="text-center text-text"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            margin: "0 0 24px 0",
          }}
        >
          Everything your club needs
        </h2>
        <div className="flex flex-col gap-[12px]">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-[14px]"
              style={{
                padding: "16px",
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "14px",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              <span className="flex-shrink-0 text-[24px]">{f.icon}</span>
              <div>
                <div className="mb-[2px] text-[14px] font-semibold text-text">
                  {f.title}
                </div>
                <div className="text-[13px] leading-[1.5] text-text-muted">
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
          background: "#FFF5F0",
          padding: "36px 24px",
          borderTop: "1px solid #F5F0EB",
        }}
      >
        <h2
          className="text-center text-text"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            margin: "0 0 6px 0",
          }}
        >
          Simple pricing
        </h2>
        <p
          className="text-center text-[13px] text-text-muted"
          style={{ margin: "0 0 24px 0" }}
        >
          Free to start. Upgrade when your club grows.
        </p>
        <div
          className="mx-auto grid grid-cols-2 gap-[12px]"
          style={{ maxWidth: "480px" }}
        >
          {/* Free */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "14px",
              padding: "20px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            <div className="mb-[2px] text-[13px] font-semibold text-text">
              Free
            </div>
            <div
              className="mb-[10px] text-text"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              $0
            </div>
            {FREE_FEATURES.map((f) => (
              <div
                key={f}
                className="mb-[4px] flex items-center gap-[5px] text-[12px] text-text-muted"
              >
                <Check size={13} color="#16A34A" strokeWidth={2.5} />
                {f}
              </div>
            ))}
            <Link
              href="/create"
              className="mt-[14px] block text-center text-[13px] font-semibold text-text"
              style={{
                padding: "10px",
                border: "1.5px solid #F5F0EB",
                borderRadius: "10px",
                background: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div
            className="relative"
            style={{
              background: "#FFFFFF",
              border: "2px solid #F43F5E",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 16px rgba(244,63,94,0.1)",
            }}
          >
            <div
              className="absolute text-[10px] font-bold text-white"
              style={{
                top: "-10px",
                right: "12px",
                padding: "2px 10px",
                background: "#F43F5E",
                borderRadius: "6px",
              }}
            >
              POPULAR
            </div>
            <div className="mb-[2px] text-[13px] font-semibold text-primary">
              Pro
            </div>
            <div
              className="mb-[2px] text-text"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              $29
              <span className="text-[14px] font-normal text-text-muted">
                /mo
              </span>
            </div>
            {PRO_FEATURES.map((f) => (
              <div
                key={f}
                className="mb-[4px] flex items-center gap-[5px] text-[12px] text-text-muted"
              >
                <Check size={13} color="#F43F5E" strokeWidth={2.5} />
                {f}
              </div>
            ))}
            <Link
              href="/create"
              className="mt-[14px] block text-center text-[13px] font-semibold text-white"
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "10px",
                background: "#F43F5E",
                boxShadow: "0 2px 12px rgba(244,63,94,0.3)",
                textDecoration: "none",
              }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center text-[12px] text-text-light"
        style={{ padding: "24px", borderTop: "1px solid #F5F0EB" }}
      >
        © 2026 RunClub ·{" "}
        <Link href="/privacy" className="text-text-muted">
          Privacy
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="text-text-muted">
          Terms
        </Link>
      </div>
    </div>
  );
}
