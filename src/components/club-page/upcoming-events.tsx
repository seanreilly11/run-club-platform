import { VenueBadge } from "@/components/ui/venue-badge";
import type { UpcomingEventRow } from "@/lib/db/queries/events";

interface UpcomingEventsProps {
  events: UpcomingEventRow[]; // already sliced — pass events[1..] from page
  timezone: string;
  postRunDefault: "pub" | "coffee" | "brunch" | "none";
}

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

export function UpcomingEvents({
  events,
  timezone,
  postRunDefault,
}: UpcomingEventsProps) {
  return (
    <section>
      <h2 className="mb-3 font-heading text-[16px] font-bold text-text">
        Upcoming runs
      </h2>

      {events.length === 0 ? (
        <div className="rounded-[14px] border border-border-muted bg-surface p-5 text-center">
          <p className="text-[14px] text-text-muted">
            No upcoming runs scheduled yet. Check back soon! 🏃
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-[14px] border border-border-muted bg-surface px-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-[13px] font-semibold text-text">
                  {event.title}
                </p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {formatEventDate(event.date, timezone)}
                </p>
                {event.aftersVenueName && (
                  <div className="mt-1.5">
                    <VenueBadge
                      venueName={event.aftersVenueName}
                      postRunDefault={postRunDefault}
                      variant="small"
                    />
                  </div>
                )}
              </div>
              <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                {event.distanceKm && (
                  <span className="rounded-[6px] bg-surface-alt px-1.5 py-0.5 text-[10px] text-text-muted">
                    {event.distanceKm} {event.distanceUnit}
                  </span>
                )}
                <span className="text-[11px] font-medium text-primary">
                  {event.goingCount} going
                </span>
                {event.aftersCount > 0 && (
                  <span className="text-[10px] text-text-muted">
                    {event.aftersCount} for afters
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
