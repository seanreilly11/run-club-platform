"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { checkEmail, signIn, signUp, sendMagicLink } from "@/lib/actions/auth";

type Step = "email" | "existing" | "new" | "magic-sent";

const emailOnlySchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const signUpFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface AuthFormProps {
  redirectTo?: string;
  variant?: "standalone" | "embedded";
}

export function AuthForm({
  redirectTo = "/my-clubs",
  variant = "standalone",
}: AuthFormProps) {
  const embedded = variant === "embedded";
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Email step
  const emailForm = useForm<z.infer<typeof emailOnlySchema>>({
    resolver: zodResolver(emailOnlySchema),
  });

  // Existing user (sign in)
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email },
  });

  // New user (sign up)
  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email },
  });

  async function onEmailSubmit(data: z.infer<typeof emailOnlySchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await checkEmail({ email: data.email });
    setIsLoading(false);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setEmail(data.email);
    signInForm.setValue("email", data.email);
    signUpForm.setValue("email", data.email);
    setStep(result.data.exists ? "existing" : "new");
  }

  async function onSignInSubmit(data: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await signIn({ ...data, redirectTo });
    setIsLoading(false);

    if (result && !result.success) {
      setServerError(result.error);
    }
  }

  async function onSignUpSubmit(data: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true);
    setServerError(null);
    const result = await signUp({ ...data, redirectTo });
    setIsLoading(false);

    if (result && !result.success) {
      setServerError(result.error);
    }
  }

  async function onMagicLink() {
    const currentEmail =
      step === "email" ? emailForm.getValues("email") : email;

    if (!currentEmail) {
      setServerError("Enter your email first");
      return;
    }

    setIsLoading(true);
    setServerError(null);
    const result = await sendMagicLink({ email: currentEmail, redirectTo });
    setIsLoading(false);

    if (result.success) {
      setStep("magic-sent");
    } else {
      setServerError(result.error);
    }
  }

  const heading = embedded
    ? step === "magic-sent"
      ? "Check your inbox ✉️"
      : "Almost there!"
    : step === "email"
      ? "Welcome to RunClub"
      : step === "existing"
        ? "Welcome back!"
        : step === "new"
          ? "Let's get you set up!"
          : "Check your inbox ✉️";

  const subheading = embedded
    ? step === "magic-sent"
      ? `We sent a magic link to ${email}`
      : "Create an account to publish your club."
    : step === "email"
      ? "Enter your email to get started"
      : step === "existing"
        ? null
        : step === "new"
          ? null
          : `We sent a magic link to ${email}`;

  return (
    <div className={cn("w-full", !embedded && "max-w-[340px] px-4")}>
      {/* Logo — standalone only */}
      {!embedded && (
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-md bg-primary flex items-center justify-center mb-3">
            <Flame className="text-white" size={22} />
          </div>
          <h1 className="font-heading text-[22px] font-extrabold text-text">
            {heading}
          </h1>
          {subheading && (
            <p className="text-[13px] text-text-muted mt-1 text-center">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Heading — embedded only */}
      {embedded && (
        <div className="mb-5">
          <h2 className="font-heading text-[20px] font-bold text-text">
            {heading}
          </h2>
          {subheading && (
            <p className="text-[13px] text-text-muted mt-1">{subheading}</p>
          )}
        </div>
      )}

      {step === "magic-sent" ? (
        <p className="text-center text-sm text-text-muted">
          Click the link in your email to sign in. You can close this tab.
        </p>
      ) : (
        <div
          className={cn(
            !embedded &&
              "bg-surface border border-border-muted rounded-[var(--radius-card)] p-5 shadow-card",
          )}
        >
          {/* Email step */}
          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-3"
            >
              <Input
                {...emailForm.register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Checking…" : "Continue"}
              </Button>
              <div className="relative flex items-center gap-2 py-1">
                <div className="flex-1 border-t border-border-muted" />
                <span className="text-xs text-text-light">or</span>
                <div className="flex-1 border-t border-border-muted" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onMagicLink}
                disabled={isLoading}
              >
                Send me a magic link ✉️
              </Button>
            </form>
          )}

          {/* Existing user — sign in */}
          {step === "existing" && (
            <form
              onSubmit={signInForm.handleSubmit(onSignInSubmit)}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{email}</span>
                <button
                  type="button"
                  className="text-primary underline text-xs"
                  onClick={() => {
                    setStep("email");
                    setServerError(null);
                  }}
                >
                  Change
                </button>
              </div>
              <Input
                {...signInForm.register("password")}
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                autoFocus
              />
              {signInForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Log in"}
              </Button>
              <button
                type="button"
                className="text-xs text-text-light underline w-full text-center"
                onClick={onMagicLink}
                disabled={isLoading}
              >
                Forgot password? Send magic link instead.
              </button>
            </form>
          )}

          {/* New user — sign up */}
          {step === "new" && (
            <form
              onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>{email}</span>
                <button
                  type="button"
                  className="text-primary underline text-xs"
                  onClick={() => {
                    setStep("email");
                    setServerError(null);
                  }}
                >
                  Change
                </button>
              </div>
              <Input
                {...signUpForm.register("name")}
                type="text"
                placeholder="e.g. Sarah"
                autoComplete="name"
                autoFocus
              />
              {signUpForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
              <Input
                {...signUpForm.register("password")}
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              {signUpForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}
              <Button
                type="submit"
                className="w-full shadow-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-[10px] text-text-light text-center">
                By signing up you agree to our{" "}
                <a href="/terms" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
