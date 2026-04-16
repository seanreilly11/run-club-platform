"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const CITIES = [
  { label: "All", value: "" },
  { label: "Sydney", value: "sydney" },
  { label: "London", value: "london" },
  { label: "Amsterdam", value: "amsterdam" },
] as const;

interface ExploreHeroProps {}

export function ExploreHero({}: ExploreHeroProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with URL params on mount and when params change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchValue(q);
  }, [searchParams]);

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for URL update
    debounceTimeoutRef.current = setTimeout(() => {
      updateParams({ q: value });
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleCityChange = (cityValue: string) => {
    updateParams({ city: cityValue });
  };

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }

  const currentCity = searchParams.get("city") || "";

  return (
    <div
      className="w-full py-8 px-6"
      style={{
        background: "linear-gradient(to top, #F59E0B 0%, #FB923C 20%, #F97066 50%, #F43F5E 80%, #E879A0 100%)",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        {/* Heading */}
        <h1
          className="font-heading text-[26px] font-extrabold tracking-[-0.03em] text-white text-center mb-1"
        >
          Find your crew
        </h1>

        {/* Subtitle */}
        <p
          className="text-[13px] text-center mb-4"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Discover run clubs near you
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full rounded-xl bg-white py-2.5 pl-9 pr-4 text-[14px] text-text shadow-md outline-none placeholder:text-text-muted"
          />
        </div>

        {/* City pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CITIES.map((city) => {
            const isActive = currentCity === city.value;
            return (
              <button
                key={city.value || "all"}
                onClick={() => handleCityChange(city.value)}
                className="rounded-full px-3.5 py-1 text-[12px] font-semibold transition-colors"
                style={{
                  background: isActive ? "white" : "rgba(255,255,255,0.2)",
                  color: isActive ? "#F43F5E" : "white",
                }}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
