import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "/my-clubs";
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
