"use client";

import { useActionState } from "react";
import {
  konfirmasiPermintaan,
  tolakPermintaan,
} from "@/actions/permintaan.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PermintaanConfirmPanel({ permintaan, stokMap }) {
  const confirmAction = konfirmasiPermintaan.bind(null, permintaan._id);
  const rejectAction = tolakPermintaan.bind(null, permintaan._id);
  const [confirmState, confirmFormAction] = useActionState(confirmAction, null);
  const [rejectState, rejectFormAction] = useActionState(rejectAction, null);

  return (
    <div className="space-y-6">
      <form action={confirmFormAction} className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Golongan Darah</TableHead>
              <TableHead>Diminta</TableHead>
              <TableHead>Stok Tersedia</TableHead>
              <TableHead>Penuhi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permintaan.items.map((item) => (
              <TableRow key={item.golonganDarah}>
                <TableCell>{item.golonganDarah}</TableCell>
                <TableCell>{item.jumlahDiminta}</TableCell>
                <TableCell>{stokMap[item.golonganDarah] || 0}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name={`fulfill_${item.golonganDarah}`}
                    min="0"
                    max={item.jumlahDiminta}
                    defaultValue={Math.min(
                      item.jumlahDiminta,
                      stokMap[item.golonganDarah] || 0,
                    )}
                    className="w-24"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {confirmState?.error && (
          <p className="text-sm text-destructive">{confirmState.error}</p>
        )}
        {confirmState?.message && (
          <p className="text-sm text-green-600">{confirmState.message}</p>
        )}
        <SubmitButton>Konfirmasi &amp; Penuhi Permintaan</SubmitButton>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tolak Permintaan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={rejectFormAction} className="space-y-3">
            <Label htmlFor="catatan">Alasan Penolakan</Label>
            <Textarea id="catatan" name="catatan" />
            {rejectState?.error && (
              <p className="text-sm text-destructive">{rejectState.error}</p>
            )}
            {rejectState?.message && (
              <p className="text-sm text-green-600">{rejectState.message}</p>
            )}
            <SubmitButton variant="destructive">Tolak Permintaan</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
