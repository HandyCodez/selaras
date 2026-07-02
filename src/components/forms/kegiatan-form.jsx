"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";

function toLocalInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function KegiatanForm({ action, kegiatan }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="judul">Judul Kegiatan</Label>
        <Input id="judul" name="judul" defaultValue={kegiatan?.judul} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea id="deskripsi" name="deskripsi" defaultValue={kegiatan?.deskripsi} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lokasi">Lokasi</Label>
        <Input id="lokasi" name="lokasi" defaultValue={kegiatan?.lokasi} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="kuota">Kuota Pendonor</Label>
        <Input
          id="kuota"
          name="kuota"
          type="number"
          min="1"
          defaultValue={kegiatan?.kuota || 50}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tanggalMulai">Tanggal &amp; Waktu Mulai</Label>
          <Input
            id="tanggalMulai"
            name="tanggalMulai"
            type="datetime-local"
            defaultValue={toLocalInputValue(kegiatan?.tanggalMulai)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tanggalSelesai">Tanggal &amp; Waktu Selesai</Label>
          <Input
            id="tanggalSelesai"
            name="tanggalSelesai"
            type="datetime-local"
            defaultValue={toLocalInputValue(kegiatan?.tanggalSelesai)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={kegiatan?.status || "draft"} required>
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>{kegiatan ? "Simpan Perubahan" : "Buat Kegiatan"}</SubmitButton>
    </form>
  );
}
