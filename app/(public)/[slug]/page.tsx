import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getClubBySlug,
  getCommunityStats,
  getActiveMembers,
} from "@/lib/db/queries/communities";
import {
  getNextEvent,
  getUpcomingEvents,
  getUserRsvpForEvent,
} from "@/lib/db/queries/events";
import { getUserMembership } from "@/lib/db/queries/memberships";
import { getAuthUser } from "@/lib/supabase/server";
import { Hero } from "@/components/club-page/hero";
import { NextEventCard } from "@/components/club-page/next-event-card";
import { UpcomingEvents } from "@/components/club-page/upcoming-events";
import { ClubStats } from "@/components/club-page/club-stats";
import { ActiveMembers } from "@/components/club-page/active-members";
import { JoinButton } from "@/components/club-page/join-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = await getClubBySlug(slug);
  if (!community) return { title: "Club not found" };
  return {
    title: `${community.name} — RunClub`,
    description:
      community.description ??
      `${community.name} is a run club in ${community.city}. Join us for runs and afters.`,
    openGraph: {
      title: community.name,
      description: community.description ?? `Run club in ${community.city}`,
      type: "website",
    },
  };
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params;

  // Parallel fetch: community + auth user
  const [community, user] = await Promise.all([
    getClubBySlug(slug),
    getAuthUser(),
  ]);

  if (!community) notFound();

  // Parallel fetch: everything else
  const [stats, nextEvent, allUpcoming, members, membership] =
    await Promise.all([
      getCommunityStats(community.id),
      getNextEvent(community.id),
      getUpcomingEvents(community.id),
      getActiveMembers(community.id),
      user ? getUserMembership(user.id, community.slug) : Promise.resolve(null),
    ]);

  // User's RSVP for next event (sequential — depends on nextEvent)
  const userRsvp =
    user && nextEvent ? await getUserRsvpForEvent(nextEvent.id, user.id) : null;

  const isMember = !!membership && membership.role !== "waitlisted";

  return (
    <div className="min-h-screen bg-background">
      <Hero community={community} stats={stats} />

      <div
        style={{
          padding: "16px 20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        {nextEvent ? (
          <NextEventCard
            event={nextEvent}
            community={{
              id: community.id,
              slug: community.slug,
              name: community.name,
              tier: community.tier,
              themeColor: community.themeColor ?? null,
              postRunDefault: community.postRunDefault,
              timezone: community.timezone,
            }}
            initialRsvp={userRsvp}
            isLoggedIn={!!user}
          />
        ) : (
          <div className="rounded-[14px] border border-border-muted bg-surface p-5 text-center">
            <p className="text-[14px] text-text-muted">
              No upcoming runs yet. Check back soon! 🏃
            </p>
          </div>
        )}

        <JoinButton
          communityId={community.id}
          communitySlug={community.slug}
          communityName={community.name}
          memberCount={community.memberCount}
          tier={community.tier}
          isLoggedIn={!!user}
          isMember={isMember}
        />

        {allUpcoming.length > 1 && (
          <UpcomingEvents
            events={allUpcoming.slice(1)}
            postRunDefault={community.postRunDefault}
            timezone={community.timezone}
          />
        )}

        {community.description && (
          <section>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                margin: "0 0 8px 0",
                color: "#1C1917",
              }}
            >
              About
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#78716C",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {community.description}
            </p>
          </section>
        )}

        {stats && <ClubStats stats={stats} />}

        <ActiveMembers members={members} />
      </div>
    </div>
  );
}
