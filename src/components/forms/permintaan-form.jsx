"use client";

import { useActionState, useState } from "react";
import { createPermintaan } from "@/actions/permintaan.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_LABELS } from "@/lib/blood-components";
import { PlusIcon, XIcon } from "lucide-react";

const URGENSI_LABELS = {
  biasa: "Biasa",
  mendesak: "Mendesak",
};

function emptyItem() {
  return { golonganDarah: GOLONGAN_DARAH[0], komponenDarah: KOMPONEN_DARAH[0], jumlah: 1 };
}

export function PermintaanForm({ cabangList, defaultCabangId }) {
  const [state, formAction] = useActionState(createPermintaan, null);
  const [items, setItems] = useState([emptyItem()]);

  function updateItem(index, patch) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />

      <div className="space-y-2">
        <Label htmlFor="cabangId">Cabang PMI Tujuan</Label>
        <Select name="cabangId" defaultValue={defaultCabangId} required>
          <SelectTrigger id="cabangId" className="w-full">
            <SelectValue placeholder="Pilih cabang PMI">
              {(value) => {
                const cabang = cabangList.find((c) => c._id === value);
                return cabang ? `${cabang.nama} - ${cabang.kota}` : "Pilih cabang PMI";
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cabangList.map((cabang) => (
              <SelectItem key={cabang._id} value={cabang._id}>
                {cabang.nama} - {cabang.kota}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Kantong Darah Dibutuhkan</Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                {index === 0 && <Label className="text-xs">Golongan</Label>}
                <Select
                  value={item.golonganDarah}
                  onValueChange={(v) => updateItem(index, { golonganDarah: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOLONGAN_DARAH.map((gol) => (
                      <SelectItem key={gol} value={gol}>
                        {gol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                {index === 0 && <Label className="text-xs">Komponen</Label>}
                <Select
                  value={item.komponenDarah}
                  onValueChange={(v) => updateItem(index, { komponenDarah: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) => KOMPONEN_DARAH_LABELS[value] ?? value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {KOMPONEN_DARAH.map((k) => (
                      <SelectItem key={k} value={k}>
                        {KOMPONEN_DARAH_LABELS[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20 space-y-1">
                {index === 0 && <Label className="text-xs">Jumlah</Label>}
                <Input
                  type="number"
                  min="1"
                  value={item.jumlah}
                  onChange={(e) => updateItem(index, { jumlah: Number(e.target.value) })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                title="Hapus item"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <PlusIcon className="size-4" />
          Tambah Item
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgensi">Urgensi</Label>
        <Select name="urgensi" defaultValue="biasa" required>
          <SelectTrigger id="urgensi" className="w-full">
            <SelectValue>{(value) => URGENSI_LABELS[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="biasa">Biasa</SelectItem>
            <SelectItem value="mendesak">Mendesak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea id="catatan" name="catatan" />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Ajukan Permintaan</SubmitButton>
    </form>
  );
}
