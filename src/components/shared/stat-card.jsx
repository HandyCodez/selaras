import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLOR_CLASSES = {
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
  muted: "bg-muted text-muted-foreground",
};

export function StatCard({ icon: Icon, label, value, color = "muted", className }) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 pt-6">
        {Icon && (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full",
              COLOR_CLASSES[color] || COLOR_CLASSES.muted,
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
