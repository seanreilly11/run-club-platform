import { AuthForm } from "@/components/ui/auth-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export const metadata = {
  title: "Log in — RunClub",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo, error } = await searchParams;

  return (
    <div className="w-full flex flex-col items-center gap-4 py-8">
      {error === "link_expired" && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 max-w-[340px] w-full text-center">
          That magic link has expired. Request a new one below.
        </p>
      )}
      <AuthForm redirectTo={redirectTo ?? "/my-clubs"} />
    </div>
  );
}
