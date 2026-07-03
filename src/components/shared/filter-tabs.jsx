import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterTabs({ options, activeValue, baseHref, paramName = "status" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Link
          key={opt.value}
          href={opt.value ? `${baseHref}?${paramName}=${opt.value}` : baseHref}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            (activeValue || "") === opt.value
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
