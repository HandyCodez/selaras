"use client";

import { useActionState } from "react";
import { completeProfile } from "@/actions/pendonor-profile.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  UserIcon,
  IdCardIcon,
  MailIcon,
  CakeIcon,
  UsersIcon,
  MapPinIcon,
  DropletIcon,
} from "lucide-react";

const JENIS_KELAMIN_LABELS = {
  L: "Laki-laki",
  P: "Perempuan",
};

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function FieldLabel({ icon: Icon, htmlFor, children }) {
  return (
    <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
      <Icon className="size-3.5 text-muted-foreground" />
      {children}
    </Label>
  );
}

export function LengkapiProfilForm({ user }) {
  const [state, formAction] = useActionState(completeProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <FieldLabel icon={UserIcon} htmlFor="nama">
          Nama Lengkap
        </FieldLabel>
        <Input id="nama" name="nama" defaultValue={user.nama} required />
      </div>
      <div className="space-y-2">
        <FieldLabel icon={IdCardIcon} htmlFor="nik">
          NIK
        </FieldLabel>
        <Input
          id="nik"
          name="nik"
          inputMode="numeric"
          pattern="\d{16}"
          maxLength={16}
          defaultValue={user.pendonor?.nik}
          placeholder="16 digit sesuai KTP"
          required
        />
      </div>
      <div className="space-y-2">
        <FieldLabel icon={MailIcon} htmlFor="email">
          Email (opsional)
        </FieldLabel>
        <Input id="email" name="email" type="email" defaultValue={user.email} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel icon={CakeIcon} htmlFor="tanggalLahir">
            Tanggal Lahir
          </FieldLabel>
          <Input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            defaultValue={toDateInputValue(user.pendonor?.tanggalLahir)}
            required
          />
        </div>
        <div className="space-y-2">
          <FieldLabel icon={UsersIcon} htmlFor="jenisKelamin">
            Jenis Kelamin
          </FieldLabel>
          <Select
            name="jenisKelamin"
            defaultValue={user.pendonor?.jenisKelamin}
            required
          >
            <SelectTrigger id="jenisKelamin" className="w-full">
              <SelectValue placeholder="Pilih">
                {(value) => JENIS_KELAMIN_LABELS[value] ?? "Pilih"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <FieldLabel icon={MapPinIcon} htmlFor="alamat">
          Alamat
        </FieldLabel>
        <Input id="alamat" name="alamat" defaultValue={user.pendonor?.alamat} required />
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
        <DropletIcon className="mt-0.5 size-4 shrink-0 text-rose-600" />
        <p className="text-xs text-rose-900">
          Golongan darah akan diperiksa dan diisi oleh petugas PMI saat Anda
          melakukan wawancara medis di lokasi donor.
        </p>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Simpan Data Diri</SubmitButton>
    </form>
  );
}
