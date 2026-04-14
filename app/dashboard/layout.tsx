import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/my-clubs");
  }

  // Slug-specific auth checks happen in app/dashboard/[slug]/layout.tsx
  return <>{children}</>;
}
