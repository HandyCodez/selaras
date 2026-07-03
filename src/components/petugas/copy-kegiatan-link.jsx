"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";

export function CopyKegiatanLink({ kegiatanId }) {
  const [copied, setCopied] = useState(false);
  const path = `/dashboard/pendonor/kegiatan/${kegiatanId}`;

  function handleCopy() {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex gap-2">
      <Input readOnly value={path} className="text-sm text-muted-foreground" />
      <Button type="button" variant="outline" onClick={handleCopy}>
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        {copied ? "Tersalin" : "Salin Link"}
      </Button>
    </div>
  );
}
