"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WizardData } from "@/components/create-club/create-club-wizard";

interface StepCityProps {
  form: UseFormReturn<WizardData>;
  onNext: () => void;
  onBack: () => void;
}

export function StepCity({ form, onNext, onBack }: StepCityProps) {
  async function handleNext() {
    const valid = await form.trigger(["city"]);
    if (valid) onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          Where are you based?
        </h2>
        <p className="text-[13px] text-text-muted">
          We use this to help runners find your club.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          {...form.register("city")}
          placeholder="e.g. London, Sydney, Amsterdam"
          autoFocus
        />
        {form.formState.errors.city && (
          <p className="text-xs text-destructive">
            {form.formState.errors.city.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-1/3"
        >
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
