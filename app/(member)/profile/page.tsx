import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/db/queries/users";
import { EditProfileForm } from "@/components/member/edit-profile-form";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?redirectTo=/profile");

  const profile = await getUserProfile(user.id);
  if (!profile) redirect("/login");

  return (
    <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F5F0EB",
          padding: "16px 0",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            margin: 0,
            color: "#1C1917",
            padding: "0 12px",
          }}
        >
          Your Profile
        </h1>
      </div>
      <EditProfileForm user={profile} />
    </div>
  );
}
