import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreHero } from "@/components/explore/explore-hero";
import { FilterBar } from "@/components/explore/filter-bar";
import { ClubList } from "@/components/explore/club-list";
import { MapWrapper } from "@/components/explore/map-wrapper";
import { getExploreClubs } from "@/lib/db/queries/communities";
import type { ExploreFilters } from "@/lib/db/queries/communities";

export const metadata: Metadata = {
  title: "Explore Run Clubs — RunClub",
  description:
    "Find run clubs near you in Sydney, London, and Amsterdam. Filter by vibe and afters venue. See who's going before you commit.",
  openGraph: {
    title: "Explore Run Clubs — RunClub",
    description:
      "Find run clubs by vibe, location, and where they go for afters.",
  },
};

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    vibe?: string;
    afters?: string;
    sort?: string;
    view?: string;
  }>;
}

const VALID_VIBES = ["competitive", "social", "casual"] as const;
const VALID_AFTERS = ["pub", "coffee", "brunch"] as const;
const VALID_SORTS = ["members", "soonest", "newest"] as const;

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const filters: ExploreFilters = {
    search: params.q || undefined,
    city: params.city || undefined,
    vibe: VALID_VIBES.includes(params.vibe as never)
      ? (params.vibe as ExploreFilters["vibe"])
      : undefined,
    afters: VALID_AFTERS.includes(params.afters as never)
      ? (params.afters as ExploreFilters["afters"])
      : undefined,
    sort: VALID_SORTS.includes(params.sort as never)
      ? (params.sort as ExploreFilters["sort"])
      : undefined,
  };

  const clubs = await getExploreClubs(filters);
  const isMapView = params.view === "map";
  const selectedCity = params.city ?? "";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — Suspense required for useSearchParams inside */}
      <Suspense>
        <ExploreHero />
      </Suspense>

      {/* Sticky filter bar */}
      <Suspense>
        <FilterBar />
      </Suspense>

      {/* Content */}
      <div className="mx-auto max-w-[720px] px-4 py-5">
        {isMapView ? (
          <Suspense>
            <MapWrapper clubs={clubs} selectedCity={selectedCity} />
          </Suspense>
        ) : (
          <ClubList
            clubs={clubs}
            totalCount={clubs.length}
            selectedCity={selectedCity}
          />
        )}
      </div>
    </div>
  );
}
