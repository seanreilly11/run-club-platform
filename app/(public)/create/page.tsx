import { CreateClubWizard } from "@/components/create-club-wizard";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "Start a club — RunClub",
  description: "Create your run club in minutes. Free to start.",
};

interface CreatePageProps {
  searchParams: Promise<{ auth_complete?: string }>;
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const [params, user] = await Promise.all([searchParams, getAuthUser()]);

  return (
    <CreateClubWizard
      initialUser={user ? { id: user.id } : null}
      authComplete={params.auth_complete === "1"}
    />
  );
}
