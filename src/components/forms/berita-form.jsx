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

export function BeritaForm({ action, berita }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="judul">Judul</Label>
        <Input id="judul" name="judul" defaultValue={berita?.judul} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="konten">Konten</Label>
        <Textarea
          id="konten"
          name="konten"
          rows={8}
          defaultValue={berita?.konten}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImage">Gambar Sampul</Label>
        <Input id="coverImage" name="coverImage" type="file" accept="image/*" />
        {berita?.coverImage && (
          <p className="text-xs text-muted-foreground">
            Gambar saat ini akan tetap dipakai jika tidak diganti.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={berita?.status || "draft"} required>
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Terbitkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>{berita ? "Simpan Perubahan" : "Buat Berita"}</SubmitButton>
    </form>
  );
}
