"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageViewerProps {
  src: string;
  alt: string;
  trigger: React.ReactNode;
  rounded?: string;
}

export function ImageViewer({
  src,
  alt,
  trigger,
  rounded = "rounded-xl",
}: ImageViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group/viewer relative block cursor-zoom-in ${rounded}`}
        aria-label={`Ver imagen: ${alt}`}
      >
        {trigger}
        <span
          className={`absolute inset-0 ${rounded} bg-black/0 group-hover/viewer:bg-black/40 flex items-center justify-center transition-colors`}
        >
          <ZoomIn className="size-6 text-white opacity-0 group-hover/viewer:opacity-100 transition-opacity drop-shadow-lg" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 p-3 sm:max-w-2xl flex items-center justify-center">
          <div className="relative w-full max-h-[80vh] flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={900}
              height={1200}
              className="max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
