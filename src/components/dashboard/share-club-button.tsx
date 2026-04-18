"use client";
import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareClubButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a temporary input
      const input = document.createElement("input");
      input.value = `${window.location.origin}/${slug}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "11px",
        background: copied ? "#F0FDF4" : "#FFFFFF",
        color: copied ? "#16A34A" : "#78716C",
        border: `1px solid ${copied ? "#BBF7D0" : "#F5F0EB"}`,
        borderRadius: "11px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copied!" : "Share club"}
    </button>
  );
}
