"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, generateSlug } from "@/lib/utils";
import { checkSlugAvailability } from "@/lib/actions/community";
import type { WizardData } from "@/components/create-club/create-club-wizard";

interface StepNameProps {
  form: UseFormReturn<WizardData>;
  onNext: () => void;
}

export function StepName({ form, onNext }: StepNameProps) {
  const [slugEditable, setSlugEditable] = useState(false);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const name = form.watch("name");
  const slug = form.watch("slug");

  // Auto-generate slug from name when not manually edited
  useEffect(() => {
    if (!slugEditable && name) {
      const generated = generateSlug(name);
      form.setValue("slug", generated, { shouldValidate: !!generated });
      setSlugStatus("idle");
    }
  }, [name, slugEditable, form]);

  async function checkSlug(value: string) {
    if (!value || value.length < 3) return;
    setSlugStatus("checking");
    const result = await checkSlugAvailability(value);
    if (!result.success) {
      setSlugStatus("taken");
    } else {
      setSlugStatus(result.data.available ? "available" : "taken");
    }
  }

  async function handleNext() {
    const valid = await form.trigger(["name", "slug"]);
    if (!valid) return;
    if (slugStatus === "idle" && slug) {
      await checkSlug(slug);
    }
    if (slugStatus === "taken") return;
    onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          Name your club
        </h2>
        <p className="text-[13px] text-text-muted">
          Pick a name that runners will remember.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          {...form.register("name")}
          placeholder="e.g. London City Runners"
          className="text-[18px] font-heading font-bold"
          autoFocus
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}

        {/* Slug preview */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-text-light">runclub.app/</span>
            {slugEditable ? (
              <Input
                {...form.register("slug")}
                className="text-[13px] h-7 py-0 flex-1"
                onBlur={(e) => checkSlug(e.target.value)}
              />
            ) : (
              <span className="text-[13px] text-text-light font-mono">
                {slug || "your-club-name"}
              </span>
            )}
            {!slugEditable && (
              <button
                type="button"
                onClick={() => setSlugEditable(true)}
                className="text-[12px] text-primary underline"
              >
                Edit
              </button>
            )}
            {slugStatus === "available" && (
              <Check size={14} className="text-success shrink-0" />
            )}
            {slugStatus === "taken" && (
              <X size={14} className="text-destructive shrink-0" />
            )}
            {slugStatus === "checking" && (
              <span className="text-[11px] text-text-light">checking…</span>
            )}
          </div>
          <p className="text-[11px] text-text-light">
            This is your club&apos;s permanent URL — it cannot be changed later.
          </p>
        </div>

        {form.formState.errors.slug && (
          <p className="text-xs text-destructive">
            {form.formState.errors.slug.message}
          </p>
        )}
        {slugStatus === "taken" && !form.formState.errors.slug && (
          <p className="text-xs text-destructive">
            This URL is already taken. Please choose another.
          </p>
        )}
      </div>

      <Button
        type="button"
        className={cn("w-full shadow-primary-glow")}
        onClick={handleNext}
        disabled={slugStatus === "checking"}
      >
        Next →
      </Button>
    </div>
  );
}
