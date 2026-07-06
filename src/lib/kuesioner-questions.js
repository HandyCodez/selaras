// Canonical donor health-history questionnaire (based on the standard
// PMI/AABB Uniform Donor History Questionnaire). Single source of truth for
// both the pendonor-facing form and the read-only view page — every
// question here needs a matching `id` stored under Partisipasi.kuesioner.jawaban.
export const KUESIONER_SECTIONS = [
  {
    label: "Hari ini",
    questions: [
      { id: "sehatHariIni", text: "Merasa sehat pada hari ini?", safeAnswer: "ya" },
      { id: "minumAntibiotik", text: "Sedang minum antibiotik?" },
      { id: "minumObatInfeksi", text: "Sedang minum obat lain untuk infeksi?" },
    ],
  },
  {
    label: "Dalam waktu 48 jam terakhir",
    questions: [
      {
        id: "minumAspirin",
        text: "Apakah anda sedang minum aspirin atau obat yang mengandung aspirin?",
      },
    ],
  },
  {
    label: "Dalam waktu 1 minggu terakhir",
    questions: [
      { id: "sakitKepalaDemam", text: "Apakah anda mengalami sakit kepala dan demam bersamaan?" },
    ],
  },
  {
    label: "Dalam waktu 6 minggu terakhir",
    questions: [
      {
        id: "sedangHamil",
        text: "Untuk donor darah wanita: apakah anda saat ini sedang hamil?",
        genderOnly: "P",
        hasDetail: true,
      },
    ],
  },
  {
    label: "Dalam waktu 8 minggu terakhir",
    questions: [
      {
        id: "donorDarahTrombositPlasma",
        text: "Apakah anda mendonorkan darah, trombosit atau plasma?",
      },
      { id: "vaksinasiSuntikan", text: "Apakah anda menerima vaksinasi atau suntikan lainnya?" },
    ],
  },
  {
    label: "Dalam waktu 16 minggu terakhir",
    questions: [
      {
        id: "donor2KantongAferesis",
        text: "Apakah anda mendonorkan 2 kantong sel darah merah melalui proses aferesis?",
      },
    ],
  },
  {
    label: "Dalam waktu 12 bulan terakhir",
    questions: [
      { id: "transfusiDarah", text: "Apakah anda pernah menerima transfusi darah?" },
      {
        id: "transplantasiOrganJaringanSumsum",
        text: "Apakah anda pernah mendapat transplantasi, organ, jaringan atau sumsum tulang?",
      },
      { id: "cangkokTulangKulit", text: "Apakah anda pernah cangkok tulang untuk kulit?" },
      { id: "tertusukJarumMedis", text: "Apakah anda pernah tertusuk jarum medis?" },
      {
        id: "seksHivAids",
        text: "Apakah anda pernah berhubungan seksual dengan orang dengan HIV/AIDS?",
      },
      {
        id: "seksPekerjaSeks",
        text: "Apakah anda pernah berhubungan seksual dengan pekerja seks komersial?",
      },
      {
        id: "seksPenggunaNarkobaSuntik",
        text: "Apakah anda pernah berhubungan seksual dengan pengguna narkoba jarum suntik?",
      },
      {
        id: "seksPenggunaFaktorPembekuan",
        text: "Apakah anda pernah berhubungan seksual dengan pengguna konsentrat faktor pembekuan?",
      },
      {
        id: "seksLakiBiseksual",
        text: "Donor wanita: apakah anda pernah berhubungan seksual dengan laki-laki yang biseksual?",
        genderOnly: "P",
      },
      {
        id: "seksPenderitaHepatitis",
        text: "Apakah anda pernah berhubungan seksual dengan penderita hepatitis?",
      },
      { id: "tinggalDenganPenderitaHepatitis", text: "Apakah anda tinggal bersama penderita hepatitis?" },
      {
        id: "kontakVaksinasiSmallpox",
        text: "Apakah anda pernah kontak dengan orang yang menerima vaksinasi smallpox?",
      },
      { id: "memilikiTato", text: "Apakah anda memiliki tato?" },
      {
        id: "memilikiTindik",
        text: "Apakah anda memiliki tindik telinga atau bagian tubuh lainnya?",
      },
      {
        id: "pengobatanSifilisGO",
        text: "Apakah anda sedang atau pernah mendapat pengobatan sifilis atau GO (kencing nanah)?",
      },
      {
        id: "ditahanPenjara72Jam",
        text: "Apakah anda pernah ditahan di penjara untuk waktu lebih dari 72 jam?",
      },
    ],
  },
  {
    label: "Dalam waktu 3 tahun terakhir",
    questions: [
      { id: "beradaLuarIndonesia", text: "Apakah anda pernah berada di luar wilayah Indonesia?" },
    ],
  },
  {
    label: "Tahun 1977 hingga sekarang",
    questions: [
      {
        id: "terimaUangObatUntukSeks",
        text: "Apakah anda menerima uang, obat atau pembayaran lainnya untuk seks?",
      },
      {
        id: "seksDenganLakiLaki",
        text: "Laki-laki: Apakah anda pernah berhubungan seksual dengan laki-laki, walaupun sekali?",
        genderOnly: "L",
      },
    ],
  },
  {
    label: "Tahun 1980 hingga sekarang",
    questions: [
      { id: "tinggal5TahunEropa", text: "Apakah anda tinggal selama 5 tahun atau lebih di Eropa?" },
      { id: "transfusiDarahInggris", text: "Apakah anda menerima transfusi darah di Inggris?" },
    ],
  },
  {
    label: "Tahun 1980 hingga 1996",
    questions: [
      { id: "tinggal3BulanInggris", text: "Apakah anda tinggal selama 3 bulan atau lebih di Inggris?" },
    ],
  },
  {
    label: "Apakah anda pernah",
    questions: [
      { id: "tesHivPositif", text: "Mendapat hasil positif untuk tes HIV/AIDS?" },
      {
        id: "jarumSuntikObatTanpaResep",
        text: "Menggunakan jarum suntik untuk obat-obatan, steroid yang tidak diresepkan dokter?",
      },
      { id: "menggunakanFaktorPembekuan", text: "Menggunakan konsentrat faktor pembekuan?" },
      { id: "menderitaHepatitis", text: "Menderita hepatitis?" },
      { id: "menderitaMalaria", text: "Menderita malaria?" },
      { id: "menderitaKankerLeukemia", text: "Menderita kanker termasuk leukemia?" },
      { id: "masalahJantungParu", text: "Bermasalah dengan jantung dan paru-paru?" },
      {
        id: "pendarahanPenyakitDarah",
        text: "Menderita pendarahan atau penyakit berhubungan dengan darah?",
      },
      { id: "seksOrangAfrika", text: "Berhubungan seksual dengan orang yang tinggal di Afrika?" },
      { id: "tinggalDiAfrika", text: "Tinggal di Afrika?" },
    ],
  },
];

export const KUESIONER_QUESTIONS = KUESIONER_SECTIONS.flatMap((s) => s.questions);

export function isQuestionApplicable(question, jenisKelamin) {
  return !question.genderOnly || question.genderOnly === jenisKelamin;
}

// Every question defaults to "tidak" being the safe answer (e.g. "Sedang
// minum antibiotik?") except a few explicitly marked otherwise (e.g.
// "Merasa sehat pada hari ini?", where "ya" is the safe answer).
export function evaluateKuesioner(jawaban, jenisKelamin) {
  const applicable = KUESIONER_QUESTIONS.filter((q) =>
    isQuestionApplicable(q, jenisKelamin),
  );
  const bermasalah = applicable.filter((q) => {
    const jawabYa = Boolean(jawaban[q.id]);
    const safeAnswerIsYa = q.safeAnswer === "ya";
    return jawabYa !== safeAnswerIsYa;
  });
  return {
    lolos: bermasalah.length === 0,
    bermasalah: bermasalah.map((q) => q.text),
  };
}
