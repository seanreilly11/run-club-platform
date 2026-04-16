"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Map } from "lucide-react";

const VIBE_OPTIONS = [
  { label: "All", value: "" },
  { label: "🤝 Social", value: "social" },
  { label: "🏆 Competitive", value: "competitive" },
  { label: "😎 Casual", value: "casual" },
] as const;

const AFTERS_OPTIONS = [
  { label: "Any", value: "" },
  { label: "🍺 Pub", value: "pub" },
  { label: "☕ Café", value: "coffee" },
  { label: "🥐 Brunch", value: "brunch" },
] as const;

const SORT_OPTIONS = [
  { label: "Most members", value: "members" },
  { label: "Next run soonest", value: "soonest" },
  { label: "Newest clubs", value: "newest" },
] as const;

function updateParam(
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>,
  key: string,
  value: string
) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  router.replace(`/explore?${params.toString()}`, { scroll: false });
}

interface FilterBarProps {
  // Optional: for testing or external control
}

export function FilterBar({}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentVibe = searchParams.get("vibe") || "";
  const currentAfters = searchParams.get("afters") || "";
  const currentSort = searchParams.get("sort") || "members";
  const isMapView = searchParams.get("view") === "map";

  return (
    <div
      className="sticky top-0 z-10 border-b bg-white px-4 py-2.5"
      style={{ borderColor: "#F5F0EB" }}
    >
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Vibe pills */}
          <div className="flex flex-wrap gap-1.5">
            {VIBE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateParam(searchParams, router, "vibe", option.value)
                }
                className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap"
                style={
                  currentVibe === option.value
                    ? {
                        background: "#FFF1F2",
                        color: "#F43F5E",
                      }
                    : {
                        background: "#F5F0EB",
                        color: "#78716C",
                      }
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Vertical divider (hidden on small screens) */}
          <div
            className="hidden h-4 w-px bg-border-muted sm:block"
            style={{ backgroundColor: "#F5F0EB" }}
          />

          {/* Afters pills */}
          <div className="flex flex-wrap gap-1.5">
            {AFTERS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateParam(searchParams, router, "afters", option.value)
                }
                className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap"
                style={
                  currentAfters === option.value
                    ? {
                        background: "#FEF3C7",
                        color: "#B45309",
                      }
                    : {
                        background: "#F5F0EB",
                        color: "#78716C",
                      }
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Right side: sort dropdown + map toggle */}
          <div className="ml-auto flex items-center gap-2">
            {/* Sort select */}
            <select
              value={currentSort}
              onChange={(e) =>
                updateParam(searchParams, router, "sort", e.target.value)
              }
              className="rounded-[8px] border bg-white px-2 py-1 text-[11px] outline-none"
              style={{
                borderColor: "#F5F0EB",
                color: "#78716C",
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Map toggle pill */}
            <button
              onClick={() =>
                updateParam(
                  searchParams,
                  router,
                  "view",
                  isMapView ? "" : "map"
                )
              }
              className="rounded-full px-3 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap flex items-center gap-1"
              style={
                isMapView
                  ? {
                      background: "#FFF1F2",
                      color: "#F43F5E",
                    }
                  : {
                      background: "#F5F0EB",
                      color: "#78716C",
                    }
              }
            >
              <Map size={12} />
              Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
