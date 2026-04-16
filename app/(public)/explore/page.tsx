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

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const filters: ExploreFilters = {
    search: params.q || undefined,
    city: params.city || undefined,
    vibe: (params.vibe as ExploreFilters["vibe"]) || undefined,
    afters: (params.afters as ExploreFilters["afters"]) || undefined,
    sort: (params.sort as ExploreFilters["sort"]) || undefined,
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
          <ClubList clubs={clubs} totalCount={clubs.length} />
        )}
      </div>
    </div>
  );
}
