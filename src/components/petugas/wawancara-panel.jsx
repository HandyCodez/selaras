"use client";

import { useActionState, useState, startTransition } from "react";
import { findPartisipasiForWawancara } from "@/actions/partisipasi.actions";
import { QrScanner } from "@/components/qr/qr-scanner";
import { WawancaraForm } from "@/components/forms/wawancara-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon, ShieldCheckIcon, ShieldAlertIcon } from "lucide-react";

export function WawancaraPanel({ kegiatanList }) {
  const [state, formAction, isPending] = useActionState(
    findPartisipasiForWawancara,
    null,
  );
  const [kegiatanId, setKegiatanId] = useState(kegiatanList[0]?._id || "");
  const [done, setDone] = useState(null);

  function handleScan(qrPayload) {
    if (isPending || !kegiatanId) return;
    const fd = new FormData();
    fd.set("qrPayload", qrPayload);
    fd.set("kegiatanId", kegiatanId);
    startTransition(() => {
      formAction(fd);
    });
  }

  if (state?.success && state.partisipasi && !done) {
    const k = state.partisipasi.kuesioner;
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <p className="font-medium">{state.partisipasi.donorId?.nama}</p>
            <p className="text-sm text-muted-foreground">
              {state.partisipasi.donorId?.telepon}
            </p>
          </CardContent>
        </Card>
        {typeof k?.lolosOtomatis === "boolean" && (
          <Card
            className={
              k.lolosOtomatis
                ? "border-emerald-200 dark:border-emerald-900"
                : "border-amber-200 dark:border-amber-900"
            }
          >
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center gap-2">
                {k.lolosOtomatis ? (
                  <ShieldCheckIcon className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldAlertIcon className="size-4 shrink-0 text-amber-600" />
                )}
                <p className="text-sm font-medium">
                  Kuesioner:{" "}
                  {k.lolosOtomatis ? "Lolos skrining awal" : "Ada faktor risiko"}
                </p>
              </div>
              {!k.lolosOtomatis && k.bermasalah?.length > 0 && (
                <ul className="ml-6 list-disc space-y-0.5 text-xs text-muted-foreground">
                  {k.bermasalah.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
        <WawancaraForm partisipasi={state.partisipasi} onDone={setDone} />
      </div>
    );
  }

  if (done) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm">{done.message}</p>
          <Button onClick={() => window.location.reload()}>
            Wawancara Pendonor Berikutnya
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kegiatanId">Kegiatan</Label>
        <Select value={kegiatanId} onValueChange={setKegiatanId}>
          <SelectTrigger id="kegiatanId" className="w-full">
            <SelectValue placeholder="Pilih kegiatan">
              {(value) =>
                kegiatanList.find((k) => k._id === value)?.judul || "Pilih kegiatan"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {kegiatanList.map((k) => (
              <SelectItem key={k._id} value={k._id}>
                {k.judul}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {kegiatanId ? (
        <QrScanner onScan={handleScan} paused={isPending} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Pilih kegiatan terlebih dahulu untuk mulai memindai QR.
        </p>
      )}

      {state?.error && (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-destructive">
            <CircleAlertIcon className="size-4" />
            {state.error}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
