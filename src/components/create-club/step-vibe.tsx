"use client";

import type { UseFormReturn } from "react-hook-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VIBE_OPTIONS } from "@/lib/constants";
import type { WizardData } from "@/components/create-club-wizard";

const VIBE_DESCRIPTIONS: Record<string, string> = {
  competitive: "PBs, intervals, race training",
  social: "All paces, community-first, fun",
  casual: "Easy going, no pressure, beginners welcome",
};

interface StepVibeProps {
  form: UseFormReturn<WizardData>;
  onNext: () => void;
  onBack: () => void;
}

export function StepVibe({ form, onNext, onBack }: StepVibeProps) {
  const selected = form.watch("vibe");

  async function handleNext() {
    const valid = await form.trigger(["vibe"]);
    if (valid) onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          What&apos;s your vibe?
        </h2>
        <p className="text-[13px] text-text-muted">
          This helps members know what to expect.
        </p>
      </div>

      <div className="space-y-2">
        {VIBE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => form.setValue("vibe", opt.value, { shouldValidate: true })}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-[var(--radius-card)] border text-left transition-colors",
              selected === opt.value
                ? "bg-primary/10 border-primary"
                : "bg-surface border-border-muted hover:border-border",
            )}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <div className="flex-1">
              <div className="font-heading font-semibold text-[15px] text-text">
                {opt.label}
              </div>
              <div className="text-[12px] text-text-muted">
                {VIBE_DESCRIPTIONS[opt.value]}
              </div>
            </div>
            {selected === opt.value && (
              <Check size={16} className="text-primary shrink-0" />
            )}
          </button>
        ))}
      </div>

      {form.formState.errors.vibe && (
        <p className="text-xs text-destructive">
          {form.formState.errors.vibe.message}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/3">
          ← Back
        </Button>
        <Button
          type="button"
          className="flex-1 shadow-primary-glow"
          onClick={handleNext}
          disabled={!selected}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
