"use client";

import { useActionState, useState } from "react";
import { checkinDonor } from "@/actions/partisipasi.actions";
import { QrScanner } from "@/components/qr/qr-scanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheckIcon, CircleAlertIcon } from "lucide-react";

export function CheckinPanel({ kegiatanList }) {
  const [state, formAction, isPending] = useActionState(checkinDonor, null);
  const [kegiatanId, setKegiatanId] = useState(kegiatanList[0]?._id || "");

  function handleScan(qrPayload) {
    if (isPending || !kegiatanId) return;
    const fd = new FormData();
    fd.set("qrPayload", qrPayload);
    fd.set("kegiatanId", kegiatanId);
    formAction(fd);
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kegiatanId">Kegiatan</Label>
        <Select value={kegiatanId} onValueChange={setKegiatanId}>
          <SelectTrigger id="kegiatanId" className="w-full">
            <SelectValue placeholder="Pilih kegiatan" />
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

      {state?.message && (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6 text-sm">
            <CircleCheckIcon className="size-4 text-green-600" />
            {state.message}
          </CardContent>
        </Card>
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
