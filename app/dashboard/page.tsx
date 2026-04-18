import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/server";
import { getUserMemberships } from "@/lib/db/queries/memberships";

export default async function DashboardRootPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const allMemberships = await getUserMemberships(user.id);
  const managed = allMemberships.filter(
    (m) => m.role === "owner" || m.role === "admin",
  );

  if (managed.length === 0) redirect("/my-clubs");
  if (managed.length === 1) redirect(`/dashboard/${managed[0].community.slug}`);

  return (
    <div style={{ padding: "32px 20px", maxWidth: "480px", margin: "0 auto" }}>
      <h1
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#1C1917",
          margin: "0 0 6px 0",
        }}
      >
        Your clubs
      </h1>
      <p style={{ fontSize: "13px", color: "#78716C", margin: "0 0 20px 0" }}>
        Pick a club to manage
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {managed.map((m) => (
          <Link
            key={m.community.slug}
            href={`/dashboard/${m.community.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              background: "#FFFFFF",
              border: "1px solid #F5F0EB",
              borderRadius: "14px",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#FFE4E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: "#F43F5E",
                flexShrink: 0,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {m.community.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1C1917",
                  marginBottom: "2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.community.name}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#A8A29E" }}>
                  {m.role === "owner" ? "Owner" : "Admin"}
                </span>
                {m.community.tier === "pro" && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "1px 5px",
                      background: "#EDE9FE",
                      color: "#7C3AED",
                      borderRadius: "4px",
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: "16px", color: "#A8A29E" }}>›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
