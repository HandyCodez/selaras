import { cn } from "@/lib/utils";

export function CapacityBar({ terisi, kuota, className }) {
  const percent = kuota > 0 ? Math.min(100, Math.round((terisi / kuota) * 100)) : 0;
  const penuh = terisi >= kuota;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {terisi}/{kuota} pendonor
        </span>
        {penuh && <span className="font-medium text-destructive">Penuh</span>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            penuh ? "bg-destructive" : "bg-rose-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
