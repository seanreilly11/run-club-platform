"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import type { ExploreClubRow } from "@/lib/db/queries/communities";

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-[14px] border border-border-muted bg-surface-alt">
      <p className="text-[13px] text-text-muted">Loading map…</p>
    </div>
  ),
});

interface MapWrapperProps {
  clubs: ExploreClubRow[];
  selectedCity: string;
}

export function MapWrapper({ clubs, selectedCity }: MapWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }

  return (
    <MapView clubs={clubs} selectedCity={selectedCity} onClose={handleClose} />
  );
}
