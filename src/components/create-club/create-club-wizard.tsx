"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCommunitySchema } from "@/lib/validations/community";
import { createCommunity } from "@/lib/actions/community";
import { AuthForm } from "@/components/ui/auth-form";
import { StepName } from "@/components/create-club/step-name";
import { StepCity } from "@/components/create-club/step-city";
import { StepVibe } from "@/components/create-club/step-vibe";
import { StepAfters } from "@/components/create-club/step-afters";
import { StepInstagram } from "@/components/create-club/step-instagram";
import { StepCover } from "@/components/create-club/step-cover";
import { StepDone } from "@/components/create-club/step-done";

// Input type: what the form fields actually store (defaults = optional)
export type WizardData = z.input<typeof createCommunitySchema>;

const STORAGE_KEY = "runclub_onboarding";
const TOTAL_STEPS = 8;

interface CreateClubWizardProps {
  initialUser: { id: string } | null;
  authComplete: boolean;
}

export function CreateClubWizard({
  initialUser,
  authComplete,
}: CreateClubWizardProps) {
  const router = useRouter();
  // Step 0 = processing screen (shown immediately when returning from auth)
  const [step, setStep] = useState(authComplete ? 0 : 1);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [communitySlug, setCommunitySlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // Prevent double-fire in React Strict Mode
  const createAttemptedRef = useRef(false);
  // Hold data for retry after error (sessionStorage already cleared by then)
  const pendingDataRef = useRef<WizardData | null>(null);

  const form = useForm<WizardData>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      slug: "",
      city: "",
      postRunDefault: "none" as const,
      instagramHandle: "",
      timezone: "UTC",
    },
  });

  // On mount: detect browser timezone, handle auth_complete redirect
  useEffect(() => {
    // Set timezone from browser
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    form.setValue("timezone", tz);

    if (!authComplete) return;
    if (createAttemptedRef.current) return;
    createAttemptedRef.current = true;

    // Restore wizard state saved before auth redirect
    // localStorage (not sessionStorage) — magic link opens in a new tab so
    // sessionStorage would be empty; localStorage persists across tabs.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // No saved data — fall back to step 1 so user can re-enter details
      setStep(1);
      return;
    }

    try {
      const data = JSON.parse(saved) as WizardData;
      form.reset(data);
      localStorage.removeItem(STORAGE_KEY);

      // Fire community creation now that we're authenticated
      void submitCreate(data);
    } catch {
      // Corrupt storage — let user start fresh
      localStorage.removeItem(STORAGE_KEY);
      setStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitCreate(data: WizardData) {
    pendingDataRef.current = data;
    setIsCreating(true);
    setCreateError(null);

    const result = await createCommunity(data);
    setIsCreating(false);

    if (!result.success) {
      if (result.field === "slug") {
        // Bounce back to step 1 so user can pick a new slug
        setCreateError(result.error);
      } else {
        setCreateError(result.error);
      }
      // Stay on step 0 (processing/error screen) so user sees the error
      return;
    }

    // Clean ?auth_complete=1 from URL BEFORE advancing step.
    // This prevents revalidatePath in the server action from triggering a
    // router refresh that would re-process auth_complete=1 and reset the wizard.
    router.replace("/create");

    setCommunityId(result.data.id);
    setCommunitySlug(result.data.slug);
    setStep(7);
  }

  async function handleStep5Next() {
    const valid = await form.trigger(["instagramHandle"]);
    if (!valid) return;

    const data = form.getValues();

    if (initialUser) {
      // Already logged in — skip auth step, create directly
      await submitCreate(data);
    } else {
      // Save state, redirect to auth
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStep(6);
    }
  }

  function progressPercent() {
    return Math.round((Math.max(step, 1) / TOTAL_STEPS) * 100);
  }

  // Step 0: processing screen — shown immediately when returning from auth
  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3 max-w-[300px]">
          {isCreating || !createError ? (
            <>
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[14px] text-text-muted">Setting up your club…</p>
            </>
          ) : (
            <>
              <p className="text-[14px] font-medium text-text">Something went wrong</p>
              <p className="text-[13px] text-text-muted">{createError}</p>
              <button
                type="button"
                onClick={() => {
                  if (pendingDataRef.current) {
                    void submitCreate(pendingDataRef.current);
                  } else {
                    setStep(1);
                  }
                }}
                className="text-[13px] text-primary underline"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-[3px] bg-border-muted w-full">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent()}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {step > 1 && step < 8 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-[13px] text-text-muted hover:text-text"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <span className="text-[12px] text-text-light ml-auto">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-10">
        <div className="w-full max-w-[440px]">
          <div className="bg-surface border border-border-muted rounded-[var(--radius-card)] p-6 shadow-card">
            {createError && step !== 1 && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-[10px]">
                <p className="text-xs text-destructive">{createError}</p>
              </div>
            )}

            {step === 1 && (
              <>
                {createError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-[10px]">
                    <p className="text-xs text-destructive">{createError}</p>
                  </div>
                )}
                <StepName form={form} onNext={() => setStep(2)} />
              </>
            )}

            {step === 2 && (
              <StepCity
                form={form}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <StepVibe
                form={form}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <StepAfters
                form={form}
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <StepInstagram
                form={form}
                onNext={handleStep5Next}
                onBack={() => setStep(4)}
              />
            )}

            {step === 6 && (
              <div className="space-y-2">
                <AuthForm
                  variant="embedded"
                  redirectTo="/create?auth_complete=1"
                />
              </div>
            )}

            {step === 7 && communityId && (
              <StepCover
                communityId={communityId}
                clubName={form.getValues("name")}
                onNext={() => setStep(8)}
                onBack={() => setStep(6)}
              />
            )}

            {step === 8 && communitySlug && (
              <StepDone
                clubSlug={communitySlug}
                clubName={form.getValues("name")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
