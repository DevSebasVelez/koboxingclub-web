import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "DRAFT" | "PUBLISHED";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "PUBLISHED"
          ? "bg-green-500/15 text-green-400 border border-green-500/20"
          : "bg-neutral-500/15 text-neutral-400 border border-neutral-500/20",
        className
      )}
    >
      {status === "PUBLISHED" ? "Publicado" : "Borrador"}
    </span>
  );
}
