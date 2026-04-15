"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepDoneProps {
  clubSlug: string;
  clubName: string;
}

export function StepDone({ clubSlug, clubName }: StepDoneProps) {
  const [copied, setCopied] = useState(false);
  const clubUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${clubSlug}`
      : `/${clubSlug}`;

  useEffect(() => {
    // Dynamically import to avoid SSR issues
    import("canvas-confetti").then((mod) => {
      mod.default({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    });
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(clubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="font-heading text-[26px] font-extrabold text-text">
          Your club is live! 🎉
        </h1>
        <p className="text-[14px] text-text-muted">
          <span className="font-semibold text-text">{clubName}</span> is ready
          for runners to find and join.
        </p>
      </div>

      <div className="bg-surface-alt border border-border-muted rounded-[var(--radius-card)] p-4">
        <p className="text-[13px] text-text-muted mb-1">Your club page</p>
        <p className="font-mono text-[14px] text-primary font-medium break-all">
          {clubUrl}
        </p>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          className="w-full shadow-primary-glow"
          onClick={copyLink}
        >
          {copied ? (
            <span className="flex items-center gap-2">
              <Check size={14} /> Copied!
            </span>
          ) : (
            "Share your club page"
          )}
        </Button>
        <Button type="button" variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/${clubSlug}`}>
            Create your first event →
          </Link>
        </Button>
      </div>
    </div>
  );
}
