import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import { getUserMembership } from "@/lib/db/queries/memberships";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileTabs } from "@/components/dashboard/dashboard-mobile-tabs";

interface DashboardSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardSlugLayout({
  children,
  params,
}: DashboardSlugLayoutProps) {
  const { slug } = await params;
  const user = await getAuthUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/dashboard/${slug}`)}`);
  }

  const membership = await getUserMembership(user.id, slug);

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    redirect("/my-clubs");
  }

  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") ?? `/dashboard/${slug}`;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-[180px] flex-col border-r border-border-muted bg-surface">
        <DashboardSidebar
          community={membership.community}
          userRole={membership.role}
          currentPath={currentPath}
        />
      </aside>
      <main className="flex-1 overflow-auto">
        <DashboardMobileTabs slug={slug} className="md:hidden" />
        {children}
      </main>
    </div>
  );
}
