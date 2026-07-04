import { cn } from "@/lib/utils";

export function PageHeaderIcon({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <div className="text-muted-foreground">{description}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}
