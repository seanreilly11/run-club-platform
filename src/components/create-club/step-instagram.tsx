"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WizardData } from "@/components/create-club-wizard";

interface StepInstagramProps {
  form: UseFormReturn<WizardData>;
  onNext: () => void;
  onBack: () => void;
}

export function StepInstagram({ form, onNext, onBack }: StepInstagramProps) {
  async function handleNext() {
    const valid = await form.trigger(["instagramHandle"]);
    if (valid) onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          Link your Instagram{" "}
          <span className="text-text-light font-normal text-[16px]">
            (optional)
          </span>
        </h2>
        <p className="text-[13px] text-text-muted">
          Members can follow you for updates between runs.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border border-border-muted rounded-[var(--radius-input)] overflow-hidden focus-within:border-primary transition-colors">
          <span className="px-3 text-text-muted text-[15px] bg-surface-alt border-r border-border-muted h-full flex items-center py-2.5">
            @
          </span>
          <Input
            {...form.register("instagramHandle")}
            placeholder="yourclub"
            className="border-0 rounded-none focus:ring-0 shadow-none"
          />
        </div>
        {form.formState.errors.instagramHandle && (
          <p className="text-xs text-destructive">
            {form.formState.errors.instagramHandle.message}
          </p>
        )}
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

      <button
        type="button"
        onClick={onNext}
        className="text-[13px] text-text-light underline w-full text-center block"
      >
        Skip for now →
      </button>
    </div>
  );
}
