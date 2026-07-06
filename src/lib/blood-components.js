export const KOMPONEN_DARAH = [
  "WB",
  "PRC",
  "TC",
  "FFP",
  "AHF",
  "PRC_LD_TC",
  "AFERESIS",
];

// Full descriptive label — used in forms/selects and detail views.
export const KOMPONEN_DARAH_LABELS = {
  WB: "Darah Lengkap (WB)",
  PRC: "Pack Red Cell (PRC)",
  TC: "Trombosit Concentrate (TC)",
  FFP: "Fresh Frozen Plasma (FFP)",
  AHF: "Anti Hemolitik Faktor (AHF)",
  PRC_LD_TC: "PRC-LD TC",
  AFERESIS: "Aferesis",
};

// Compact code — used in filter tabs and tight table cells.
export const KOMPONEN_DARAH_SHORT_LABELS = {
  WB: "WB",
  PRC: "PRC",
  TC: "TC",
  FFP: "FFP",
  AHF: "AHF",
  PRC_LD_TC: "PRC-LD TC",
  AFERESIS: "Aferesis",
};

// Shared between the confirm form (building input names) and the server
// action (reading them back) so the two never drift apart.
export function fulfillFieldName(golonganDarah, komponenDarah) {
  return `fulfill__${golonganDarah}__${komponenDarah}`;
}
