import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterTabs({
  options,
  activeValue,
  baseHref,
  paramName = "status",
  extraParams,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const params = new URLSearchParams(extraParams);
        if (opt.value) {
          params.set(paramName, opt.value);
        } else {
          params.delete(paramName);
        }
        const query = params.toString();
        const href = query ? `${baseHref}?${query}` : baseHref;
        return (
          <Link
            key={opt.value}
            href={href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              (activeValue || "") === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
