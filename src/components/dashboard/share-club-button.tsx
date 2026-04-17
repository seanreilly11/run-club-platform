"use client";
import { Share2 } from "lucide-react";

export function ShareClubButton({ slug }: { slug: string }) {
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      }}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "11px",
        background: "#FFFFFF",
        color: "#78716C",
        border: "1px solid #F5F0EB",
        borderRadius: "11px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <Share2 size={14} /> Share club
    </button>
  );
}
