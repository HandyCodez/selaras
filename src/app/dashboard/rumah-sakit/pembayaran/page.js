"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ReceiptTextIcon,
  CreditCardIcon,
  BuildingIcon,
  CheckCircle2Icon,
  ShieldAlertIcon,
  ArrowRightIcon,
  QrCodeIcon,
  FileTextIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

// Simulasi data tagihan BPPD (Biaya Pengganti Pengolahan Darah)
// Standar Permenkes tarif BPPD berkisar Rp 360.000 - Rp 490.000 per kantong
const INVOICES_DATA = [
  {
    id: "INV-2026-0089",
    nomorPermintaan: "REQ-JKT-1024",
    cabang: "PMI Kota Jakarta Pusat",
    tanggal: "27 Nov 2026",
    jatuhTempo: "30 Nov 2026",
    status: "menunggu_pembayaran",
    items: [
      { nama: "Whole Blood (WB) - Gol. O+", jumlah: 2, tarifPerKantong: 490000 },
      { nama: "Packed Red Cell (PRC) - Gol. A+", jumlah: 3, tarifPerKantong: 490000 },
    ],
  },
  {
    id: "INV-2026-0074",
    nomorPermintaan: "REQ-JKT-0982",
    cabang: "PMI Kota Jakarta Pusat",
    tanggal: "24 Nov 2026",
    jatuhTempo: "27 Nov 2026",
    status: "lunas",
    items: [
      { nama: "Thrombocyte Concentrate (TC) - Gol. B+", jumlah: 4, tarifPerKantong: 490000 },
    ],
  },
];

export default function PembayaranBPPDPrototypePage() {
  const [selectedInvoice, setSelectedInvoice] = useState(INVOICES_DATA[0]);
  const [metodePembayaran, setMetodePembayaran] = useState("va");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = selectedInvoice.items.reduce(
    (acc, curr) => acc + curr.jumlah * curr.tarifPerKantong,
    0
  );
  const biayaLayanan = 5000;
  const totalBayar = subtotal + biayaLayanan;

  const handleSimulasiBayar = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Simulasi Pembayaran Berhasil!", {
        description: `Tagihan ${selectedInvoice.id} telah tercatat lunas.`,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Prototype Banner */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
        <SparklesIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Halaman Prototype:</strong> Simulasi proses administrasi dan pembayaran Biaya Pengganti Pengolahan Darah (BPPD) resmi PMI sesuai regulasi Kemenkes RI.
        </span>
      </div>

      <PageHeaderIcon
        icon={ReceiptTextIcon}
        title="Pembayaran & Tagihan BPPD"
        description="Biaya Pengganti Pengolahan Darah (bukan harga jual darah, melainkan pengganti uji saring infeksi, kantong darah, dan penyimpanan dingin)."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom Kiri: Daftar Tagihan */}
        <div className="space-y-4 md:col-span-1">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Daftar Tagihan
          </h2>
          <div className="space-y-3">
            {INVOICES_DATA.map((inv) => {
              const invTotal = inv.items.reduce(
                (sum, i) => sum + i.jumlah * i.tarifPerKantong,
                0
              );
              const isSelected = selectedInvoice.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setIsSuccess(inv.status === "lunas");
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-rose-500 bg-rose-50/50 shadow-sm dark:bg-rose-950/20"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {inv.id}
                    </span>
                    <Badge variant={inv.status === "lunas" ? "default" : "destructive"}>
                      {inv.status === "lunas" ? "Lunas" : "Menunggu Bayar"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{inv.cabang}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Tagihan:</span>
                    <span className="font-semibold text-foreground">
                      Rp {invTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Rincian & Checkout */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Detail Tagihan: {selectedInvoice.id}</CardTitle>
                  <CardDescription>
                    Permintaan: <span className="font-mono font-medium">{selectedInvoice.nomorPermintaan}</span> ({selectedInvoice.cabang})
                  </CardDescription>
                </div>
                <Badge variant={isSuccess || selectedInvoice.status === "lunas" ? "default" : "secondary"}>
                  {isSuccess || selectedInvoice.status === "lunas" ? "LUNAS / SELESAI" : "BELUM DIBAYAR"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rincian Kantong */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Komponen & Golongan</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Tarif BPPD</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-sm">{item.nama}</TableCell>
                        <TableCell className="text-center">{item.jumlah} kantong</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          Rp {item.tarifPerKantong.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          Rp {(item.jumlah * item.tarifPerKantong).toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Ringkasan Biaya */}
              <div className="space-y-1.5 rounded-lg bg-muted/40 p-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Pengolahan Darah</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Biaya Administrasi Bank / Virtual Account</span>
                  <span>Rp {biayaLayanan.toLocaleString("id-ID")}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                  <span>Total Tagihan BPPD</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    Rp {totalBayar.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Opsi Pembayaran Jika Belum Lunas */}
              {!isSuccess && selectedInvoice.status !== "lunas" ? (
                <div className="space-y-4 pt-2">
                  <Label className="text-sm font-semibold">Pilih Metode Pembayaran (Simulasi):</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setMetodePembayaran("va")}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-center text-xs transition-colors ${
                        metodePembayaran === "va"
                          ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/30 dark:text-rose-400"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <BuildingIcon className="size-4" />
                      Virtual Account Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetodePembayaran("qris")}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-center text-xs transition-colors ${
                        metodePembayaran === "qris"
                          ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/30 dark:text-rose-400"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <QrCodeIcon className="size-4" />
                      QRIS / E-Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetodePembayaran("corporate")}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-center text-xs transition-colors ${
                        metodePembayaran === "corporate"
                          ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/30 dark:text-rose-400"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <CreditCardIcon className="size-4" />
                      Corporate Billing
                    </button>
                  </div>

                  {metodePembayaran === "va" && (
                    <div className="rounded-lg border border-dashed p-3 text-xs space-y-1 bg-background">
                      <p className="text-muted-foreground">Nomor Virtual Account Mandiri / BNI:</p>
                      <p className="font-mono text-sm font-bold text-foreground tracking-wider">
                        8809 0812 3456 7890
                      </p>
                      <p className="text-muted-foreground">Atas Nama: <span className="font-medium text-foreground">PMI Pusat - BPPD RS Mitra</span></p>
                    </div>
                  )}

                  <Button
                    onClick={handleSimulasiBayar}
                    disabled={isProcessing}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium"
                  >
                    {isProcessing ? "Memproses Pembayaran..." : "Bayar Sekarang (Simulasi)"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <CheckCircle2Icon className="size-10 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-foreground">Tagihan Telah Lunas</h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Kwitansi resmi BPPD telah terbit otomatis dan darah siap diproses untuk pengiriman atau penggunaan pasien.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={() => toast.info("Unduh Kwitansi PDF (Prototype)")}>
                    <FileTextIcon className="size-3.5" />
                    Unduh Kwitansi Resmi (PDF)
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t text-xs text-muted-foreground pt-4">
              <span className="flex items-center gap-1">
                <ShieldAlertIcon className="size-3.5 text-muted-foreground" />
                Darah tidak diperjualbelikan (UU Kesehatan No. 17/2023)
              </span>
              <Link href="/dashboard/rumah-sakit/permintaan" className="hover:text-foreground inline-flex items-center gap-1 font-medium">
                Kembali ke Permintaan <ArrowRightIcon className="size-3" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
