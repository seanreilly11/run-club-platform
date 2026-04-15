"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { VenueBadge } from "@/components/ui/venue-badge";
import {
  createRsvp,
  updateRsvpAfters,
  updateRsvpPaceGroup,
  withdrawRsvp,
} from "@/lib/actions/rsvp";
import type { UpcomingEventRow } from "@/lib/db/queries/events";
import type { EventRsvp } from "@/lib/db/schema";
import type { communities } from "@/lib/db/schema";

type Community = typeof communities.$inferSelect;

interface NextEventCardProps {
  event: UpcomingEventRow;
  community: Pick<
    Community,
    "id" | "slug" | "name" | "tier" | "themeColor" | "postRunDefault" | "timezone"
  >;
  initialRsvp: EventRsvp | null;
  isLoggedIn: boolean;
}

type RsvpState = {
  status: "going" | "maybe" | null;
  paceGroup: string | null;
  joiningSocial: boolean;
  rsvpId: string | null;
};

type UiStep = "default" | "confirmed" | "pace" | "afters" | "done";

function formatEventDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getDaysUntil(date: Date): string {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export function NextEventCard({
  event,
  community,
  initialRsvp,
  isLoggedIn,
}: NextEventCardProps) {
  const [rsvpState, setRsvpState] = useState<RsvpState>({
    status: initialRsvp?.status ?? null,
    paceGroup: initialRsvp?.paceGroup ?? null,
    joiningSocial: initialRsvp?.joiningSocial ?? false,
    rsvpId: initialRsvp?.id ?? null,
  });
  const [uiStep, setUiStep] = useState<UiStep>(initialRsvp ? "done" : "default");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goingCount, setGoingCount] = useState(event.goingCount);

  async function handleRsvp(status: "going" | "maybe") {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=/${community.slug}`;
      return;
    }
    // Optimistic update
    setRsvpState((prev) => ({ ...prev, status }));
    setUiStep("confirmed");
    if (status === "going") setGoingCount((c) => c + 1);
    setIsSubmitting(true);
    setError(null);

    const result = await createRsvp({
      eventId: event.id,
      status,
      communitySlug: community.slug,
    });
    setIsSubmitting(false);

    if (!result.success) {
      // Revert
      setRsvpState({ status: null, paceGroup: null, joiningSocial: false, rsvpId: null });
      setUiStep("default");
      if (status === "going") setGoingCount((c) => c - 1);
      setError(result.error);
      return;
    }
    setRsvpState((prev) => ({ ...prev, rsvpId: result.data.rsvpId }));

    // Advance to pace step if event has pace groups, else skip to afters or done
    if (event.paceGroups && event.paceGroups.length > 0) {
      setUiStep("pace");
    } else if (event.postRunVenueName) {
      setUiStep("afters");
    } else {
      setUiStep("done");
    }
  }

  async function handlePaceSelect(group: string) {
    setRsvpState((prev) => ({ ...prev, paceGroup: group }));
    // Fire and forget — don't block UI
    void updateRsvpPaceGroup({ eventId: event.id, paceGroup: group, communitySlug: community.slug });
    // Advance
    if (event.postRunVenueName) {
      setUiStep("afters");
    } else {
      setUiStep("done");
    }
  }

  function handleSkipPace() {
    if (event.postRunVenueName) {
      setUiStep("afters");
    } else {
      setUiStep("done");
    }
  }

  async function handleAfters(joiningSocial: boolean) {
    setRsvpState((prev) => ({ ...prev, joiningSocial }));
    void updateRsvpAfters({ eventId: event.id, joiningSocial, communitySlug: community.slug });
    setUiStep("done");
  }

  async function handleWithdraw() {
    if (!rsvpState.rsvpId) return;
    const prevState = { ...rsvpState };
    const prevStep = uiStep;
    const prevCount = goingCount;
    // Optimistic
    setRsvpState({ status: null, paceGroup: null, joiningSocial: false, rsvpId: null });
    setUiStep("default");
    if (prevState.status === "going") setGoingCount((c) => c - 1);

    const result = await withdrawRsvp({ eventId: event.id, communitySlug: community.slug });
    if (!result.success) {
      // Revert
      setRsvpState(prevState);
      setUiStep(prevStep);
      setGoingCount(prevCount);
      setError(result.error);
    }
  }

  const sunriseGradient = "linear-gradient(to right, #F59E0B, #F97066, #F43F5E)";
  const accentStyle =
    community.tier === "pro" && community.themeColor
      ? { backgroundColor: community.themeColor }
      : { background: sunriseGradient };

  return (
    <>
      {/* CSS animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-down { animation: slideDown 0.3s ease; }
        .animate-pop-in { animation: popIn 0.25s ease; }
      `}</style>

      <div
        className="overflow-hidden rounded-[16px] border bg-surface shadow-sm"
        style={{ borderColor: "#F43F5E", boxShadow: "0 2px 12px rgba(244,63,94,0.12)" }}
      >
        {/* Accent bar */}
        <div className="h-[3px] w-full" style={accentStyle} />

        <div className="p-4">
          {/* Header row */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Next Run
            </span>
            <span className="text-[11px] text-text-light">{getDaysUntil(event.date)}</span>
          </div>

          {/* Title */}
          <h2 className="mb-2 font-heading text-[16px] font-bold text-text">{event.title}</h2>

          {/* Info row: date + distance */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-text">
              {formatEventDate(event.date, community.timezone)}
            </span>
            {event.distanceKm && (
              <span className="rounded-[6px] bg-surface-alt px-1.5 py-0.5 text-[10px] text-text-muted">
                {event.distanceKm} {event.distanceUnit}
              </span>
            )}
          </div>

          {/* Meeting point */}
          <div className="mb-3 flex items-start gap-1.5">
            <MapPin size={12} className="mt-0.5 shrink-0 text-text-muted" />
            <span className="text-[12px] text-text-muted">{event.meetingPointName}</span>
          </div>

          {/* Pace group pills */}
          {event.paceGroups && event.paceGroups.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {event.paceGroups.map((group) => (
                <span
                  key={group.name}
                  className="rounded-[6px] bg-surface-alt px-2 py-0.5 text-[10px] text-text-muted"
                >
                  {group.name} · {group.pace}
                </span>
              ))}
            </div>
          )}

          {/* Afters venue */}
          {event.postRunVenueName && (
            <div className="mb-4">
              <VenueBadge
                venueName={event.postRunVenueName}
                postRunDefault={community.postRunDefault}
                variant="card"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mb-2 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {error}
            </p>
          )}

          {/* ── Step: default ── */}
          {uiStep === "default" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleRsvp("going")}
                disabled={isSubmitting}
                className="flex-1 rounded-[12px] bg-primary py-2.5 text-[14px] font-bold text-white disabled:opacity-60"
                style={{ boxShadow: "0 2px 12px rgba(244,63,94,0.3)" }}
              >
                I&apos;m in! 🏃
              </button>
              <button
                onClick={() => handleRsvp("maybe")}
                disabled={isSubmitting}
                className="rounded-[12px] border border-primary px-4 py-2.5 text-[13px] font-medium text-primary disabled:opacity-60"
              >
                Maybe
              </button>
            </div>
          )}

          {/* ── Steps: confirmed / pace / afters / done ── */}
          {(uiStep === "confirmed" ||
            uiStep === "pace" ||
            uiStep === "afters" ||
            uiStep === "done") && (
            <div className="animate-slide-down space-y-3">
              {/* Confirmation */}
              <div
                className="flex items-center gap-2 rounded-[10px] border px-3 py-2.5"
                style={{ backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }}
              >
                <span className="text-[18px]">🎉</span>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>
                    {rsvpState.status === "going"
                      ? "You're in!"
                      : "Maybe — we'll save you a spot"}
                  </p>
                  {rsvpState.paceGroup && (
                    <p className="text-[11px]" style={{ color: "#16A34A" }}>
                      {rsvpState.paceGroup} group
                    </p>
                  )}
                </div>
                <span className="ml-auto text-[11px] text-text-light">{goingCount} going</span>
              </div>

              {/* ── Step: pace ── */}
              {uiStep === "pace" && event.paceGroups && (
                <div className="animate-pop-in space-y-2">
                  <p className="text-[12px] font-medium text-text">Choose your pace group</p>
                  {event.paceGroups.map((group) => (
                    <button
                      key={group.name}
                      onClick={() => handlePaceSelect(group.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left transition-colors",
                        rsvpState.paceGroup === group.name
                          ? "border-primary bg-primary/5"
                          : "border-border-muted bg-surface hover:bg-surface-alt",
                      )}
                    >
                      <span className="text-[13px] font-medium text-text">{group.name}</span>
                      <span className="text-[11px] text-text-muted">{group.pace}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleSkipPace}
                    className="text-[11px] text-text-light underline"
                  >
                    Skip
                  </button>
                </div>
              )}

              {/* ── Step: afters ── */}
              {uiStep === "afters" && event.postRunVenueName && (
                <div
                  className="animate-pop-in rounded-[10px] border p-3"
                  style={{
                    background: "linear-gradient(135deg, #FEF3C7, #FEF9C3)",
                    borderColor: "#FDE68A",
                  }}
                >
                  <p className="mb-2 text-[13px] font-semibold" style={{ color: "#78350F" }}>
                    Staying for afters at {event.postRunVenueName}?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAfters(true)}
                      className="flex-1 rounded-[10px] py-2 text-[13px] font-semibold text-white"
                      style={{ backgroundColor: "#B45309" }}
                    >
                      Count me in! 🍺
                    </button>
                    <button
                      onClick={() => handleAfters(false)}
                      className="flex-1 rounded-[10px] border py-2 text-[13px] font-semibold"
                      style={{
                        borderColor: "#B45309",
                        color: "#B45309",
                        backgroundColor: "white",
                      }}
                    >
                      Just the run
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step: done ── */}
              {uiStep === "done" && (
                <div className="flex items-center gap-3 text-[12px]">
                  {rsvpState.joiningSocial && event.postRunVenueName && (
                    <span className="text-text-muted">🍺 Afters at {event.postRunVenueName}</span>
                  )}
                  <div className="ml-auto flex gap-3">
                    <button onClick={handleWithdraw} className="text-text-light underline">
                      Undo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
