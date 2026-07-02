export const GOLONGAN_DARAH = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

export const GOLONGAN_DARAH_LABELS = GOLONGAN_DARAH.reduce((acc, gol) => {
  acc[gol] = gol;
  return acc;
}, {});
