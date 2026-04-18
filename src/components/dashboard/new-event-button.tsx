"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CreateEventModal } from "./create-event-modal";
import { Button } from "../ui/button";

interface Props {
  communitySlug: string;
  communityName: string;
  variant?: "primary" | "empty-state";
  block?: boolean;
}

export function NewEventButton({
  communitySlug,
  communityName,
  variant = "primary",
  block = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className={block ? "flex-1" : ""}
        >
          <Plus size={12} /> New event
        </Button>
      ) : (
        // <button
        //   onClick={() => setOpen(true)}
        //   style={{
        //     display: "inline-flex",
        //     alignItems: "center",
        //     gap: "4px",
        //     padding: "8px 14px",
        //     background: "#F43F5E",
        //     color: "white",
        //     borderRadius: "10px",
        //     fontSize: "12px",
        //     fontWeight: 700,
        //     border: "none",
        //     cursor: "pointer",
        //     fontFamily: "'Bricolage Grotesque', sans-serif",
        //     boxShadow: "0 2px 8px rgba(244,63,94,0.25)",
        //   }}
        // >
        //   <Plus size={12} /> New event
        // </button>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "inline-block",
            padding: "9px 18px",
            background: "#F43F5E",
            color: "white",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            ...(block && { display: "block", width: "100%" }),
          }}
        >
          + Create event
        </button>
      )}

      {open && (
        <CreateEventModal
          communitySlug={communitySlug}
          communityName={communityName}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
