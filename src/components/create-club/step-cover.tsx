"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { updateCoverPhoto } from "@/lib/actions/community";

interface StepCoverProps {
  communityId: string;
  clubName: string;
  onNext: () => void;
  onBack: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function StepCover({ communityId, clubName, onNext, onBack }: StepCoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be under 2MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  async function handleUploadAndNext() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      onNext();
      return;
    }

    setIsUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `covers/${communityId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Upload failed. Try again or skip.");
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from("covers").getPublicUrl(path);
    const result = await updateCoverPhoto(communityId, data.publicUrl);

    if (!result.success) {
      setError("Could not save cover photo. You can add one from dashboard settings.");
    }

    setIsUploading(false);
    onNext();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[22px] font-bold text-text mb-1">
          Add a cover photo
        </h2>
        <p className="text-[13px] text-text-muted">
          A great photo helps {clubName} stand out on the explore page.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full h-40 rounded-[var(--radius-card)] border-2 border-dashed border-border-muted",
          "flex flex-col items-center justify-center gap-2 transition-colors",
          "hover:border-primary hover:bg-primary/5",
          preview && "border-0 p-0 overflow-hidden",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <Camera size={28} className="text-text-light" />
            <span className="text-[13px] text-text-muted">
              Drag or click to upload
            </span>
            <span className="text-[11px] text-text-light">
              JPG, PNG or WebP · max 2MB
            </span>
          </>
        )}
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/3">
          ← Back
        </Button>
        <Button
          type="button"
          className="flex-1 shadow-primary-glow"
          onClick={handleUploadAndNext}
          disabled={isUploading}
        >
          {isUploading ? "Uploading…" : preview ? "Save & continue →" : "Skip for now →"}
        </Button>
      </div>
    </div>
  );
}
