"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  currentUrl?: string;
  folder: string;
  onUpload: (key: string, url: string) => void;
}

export default function ImageUpload({
  currentUrl,
  folder,
  onUpload,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al subir imagen");
      }

      const { key, url } = await res.json();
      setPreview(url);
      onUpload(key, url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {preview && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-neutral-700">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UploadCloud className="size-4" />
        )}
        {preview ? "Cambiar imagen" : "Subir imagen"}
      </Button>
    </div>
  );
}
