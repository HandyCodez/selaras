import { CheckCircle2Icon, CircleIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Generic timeline step shape
// { label, description, timestamp, done, active }
function TimelineStep({ label, description, timestamp, done, active, isLast }) {
  return (
    <div className="flex gap-4">
      {/* Icon + connector line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
            done
              ? "border-rose-500 bg-rose-500 text-white dark:border-rose-400 dark:bg-rose-400"
              : active
                ? "border-rose-400 bg-rose-50 text-rose-500 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-400"
                : "border-border bg-muted text-muted-foreground",
          )}
        >
          {done ? (
            <CheckCircle2Icon className="size-4" />
          ) : active ? (
            <ClockIcon className="size-4" />
          ) : (
            <CircleIcon className="size-4" />
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              "mt-1 w-0.5 flex-1",
              done ? "bg-rose-200 dark:bg-rose-900" : "bg-border",
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-6", isLast && "pb-0")}>
        <p
          className={cn(
            "text-sm font-semibold",
            done
              ? "text-foreground"
              : active
                ? "text-rose-600 dark:text-rose-400"
                : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
        {timestamp && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// Builds the timeline steps from a PengirimanDarah document.
export function PengirimanTimeline({ pengiriman, createdAt }) {
  const status = pengiriman.status;
  const dikirim = status === "dikirim" || status === "diterima" || status === "selesai";
  const diterima = status === "diterima" || status === "selesai";
  const selesai = status === "selesai";

  const steps = [
    {
      label: "Permintaan Dikonfirmasi",
      description: "PMI menyetujui permintaan darah",
      timestamp: createdAt,
      done: true,
      active: false,
    },
    {
      label: "Pengiriman Disiapkan",
      description: "Kantong darah sedang disiapkan oleh petugas PMI",
      timestamp: pengiriman.createdAt,
      done: dikirim,
      active: status === "disiapkan",
    },
    {
      label: "Darah Dikirim",
      description: pengiriman.petugasKirimId?.nama
        ? `Dikirim oleh ${pengiriman.petugasKirimId.nama}`
        : "Sedang dalam perjalanan ke rumah sakit",
      timestamp: pengiriman.tanggalKirim,
      done: diterima,
      active: status === "dikirim",
    },
    {
      label: "Diterima Rumah Sakit",
      description: pengiriman.penerimaDiRSId?.nama
        ? `Diterima oleh ${pengiriman.penerimaDiRSId.nama}`
        : "Rumah sakit mengkonfirmasi penerimaan",
      timestamp: pengiriman.tanggalTiba,
      done: selesai,
      active: status === "diterima",
    },
    {
      label: "Darah Digunakan",
      description: "Semua kantong telah digunakan untuk pasien",
      timestamp: null,
      done: selesai,
      active: false,
    },
  ];

  return (
    <div className="pt-2">
      {steps.map((step, i) => (
        <TimelineStep
          key={step.label}
          {...step}
          isLast={i === steps.length - 1}
        />
      ))}
    </div>
  );
}
