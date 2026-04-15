"use client";

import type { UseFormReturn } from "react-hook-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { POST_RUN_OPTIONS } from "@/lib/constants";
import type { WizardData } from "@/components/create-club-wizard";

interface StepAftersProps {
  form: UseFormReturn<WizardData>;
  onNext: () => void;
  onBack: () => void;
}

export function StepAfters({ form, onNext, onBack }: StepAftersProps) {
  const selected = form.watch("postRunDefault");

  function handleNext() {
    // postRunDefault has a default value, always valid
    onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          Where do you go for afters?
        </h2>
        <p className="text-[13px] text-text-muted">
          The post-run social is what keeps clubs together.
        </p>
      </div>

      <div className="space-y-2">
        {POST_RUN_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          const isVenue = opt.value !== "none";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                form.setValue("postRunDefault", opt.value, {
                  shouldValidate: true,
                })
              }
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-[var(--radius-card)] border text-left transition-colors",
                isSelected && isVenue
                  ? "bg-[#FEF3C7] border-[#B45309]"
                  : isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-surface border-border-muted hover:border-border",
              )}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div className="flex-1 font-heading font-semibold text-[15px] text-text">
                {opt.label}
              </div>
              {isSelected && (
                <Check
                  size={16}
                  className={cn(
                    "shrink-0",
                    isVenue ? "text-[#B45309]" : "text-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/3">
          ← Back
        </Button>
        <Button
          type="button"
          className="flex-1 shadow-primary-glow"
          onClick={handleNext}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
