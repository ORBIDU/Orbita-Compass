// Teks halaman Profil, mengikuti docs/design/portal/Portal-Profil.dc.html.

import { BRAND } from "@/config/brand";
import { NICKNAME_MAX } from "@/types/profil";

export const PROFIL_HEADER = {
  breadcrumbHome: "Dashboard",
  title: "Profil",
  description: `Data dirimu yang tercatat di sekolah, dan pengaturan akun ${BRAND.name}.`,
  infoBefore: "Data diri diisi oleh ",
  infoStrong: "pihak kurikulum sekolah",
  infoAfter: ". Kamu bisa mengubah nama panggilan, foto, dan password. Kalau ada data yang salah, hubungi wali kelasmu.",
  updated: (date: string) => `Diperbarui sekolah ${date}`,
};

export const EMPTY_VALUE = "Belum diisi sekolah";

export const IDENTITY = {
  label: "Identitas",
  changePhoto: "Ubah foto profil",
  removePhoto: "Hapus foto",
  photoHint: "JPG atau PNG, maksimal 2 MB.",
  photoType: "Foto harus berformat JPG atau PNG.",
  photoSize: "Ukuran foto maksimal 2 MB.",
  photoError: "Foto gagal disimpan. Coba lagi.",
  photoSaved: "Foto profil disimpan",
  nickLabel: "Nama panggilan",
  nickBadge: "Bisa kamu ubah",
  nickHint: "Dipakai untuk menyapamu di Dashboard.",
  nickEmpty: "Belum diatur",
  edit: "Ubah",
  cancel: "Batal",
  save: "Simpan",
  saving: "Menyimpan...",
  nickMax: `Maksimal ${NICKNAME_MAX} karakter.`,
  nickRequired: "Nama panggilan tidak boleh kosong.",
  nickTooLong: `Nama panggilan maksimal ${NICKNAME_MAX} karakter.`,
  nickSaved: "Nama panggilan disimpan",
  nickError: "Nama panggilan gagal disimpan. Coba lagi.",
  localNote: "Tersimpan di perangkat ini, karena server belum menyimpan nama panggilan dan foto.",
};

export const AKUN = {
  title: `Akun ${BRAND.name}`,
  email: "Email akun",
  emailHint: `Dipakai untuk masuk dan menerima informasi dari ${BRAND.name}.`,
  password: "Password",
  change: "Ganti password",
  changeUnavailable: "Ganti password belum tersedia. Hubungi admin sekolah kalau perlu mengganti password.",
  consentOk: "Persetujuan orang tua/wali tercatat",
  consentOkDate: (date: string) => `Diberikan saat mendaftar, ${date}`,
  consentMissing: "Persetujuan orang tua/wali belum tercatat",
  consentMissingBody: "Hubungi wali kelas supaya persetujuan orang tua/wali dicatat.",
  consentUnknown: "Status persetujuan orang tua/wali belum bisa ditampilkan",
  consentUnknownBody: "Server belum menyimpan data persetujuan.",
  shortcutTitle: "Prestasi dan nilai rapor",
  shortcutBody: "Ada di Analisis Potensi",
};

export const PASSWORD_DIALOG = {
  title: "Ganti password",
  current: "Password sekarang",
  next: "Password baru",
  nextHint: "Minimal 8 karakter, campuran huruf dan angka.",
  repeat: "Ulangi password baru",
  cancel: "Batal",
  save: "Simpan password",
  saving: "Menyimpan...",
  currentEmpty: "Isi password sekarang.",
  currentWrong: "Password sekarang salah.",
  tooShort: "Password baru minimal 8 karakter.",
  needMix: "Password baru harus berisi huruf dan angka.",
  sameAsOld: "Password baru harus berbeda dari password sekarang.",
  mismatch: "Ulangi password baru belum sama.",
  error: "Password gagal diganti. Coba lagi.",
  success: "Password berhasil diganti",
  show: "Tampilkan password",
  hide: "Sembunyikan password",
};

export const SECTIONS = {
  diri: "Data diri",
  alamat: "Alamat tempat tinggal",
  kontak: "Kontak dan orang tua/wali",
  keluarga: "Kondisi keluarga",
  khusus: "Kondisi khusus",
  privateNote: "Hanya terlihat olehmu, guru BK, dan wali kelas",
  show: "Tampilkan",
  hide: "Sembunyikan",
  hiddenBody: "Bagian ini disembunyikan supaya tidak terlihat orang di sekitarmu. Tekan \"Tampilkan\" untuk melihatnya.",
  footer: `Ada data yang salah atau belum diisi? Sampaikan ke wali kelasmu supaya diperbarui oleh pihak kurikulum. ${BRAND.name} tidak bisa mengubah data ini.`,
};

export const LABELS = {
  name: "Nama lengkap",
  gender: "Jenis kelamin",
  birth: "Tempat, tanggal lahir",
  nis: "NIS",
  nisn: "NISN",
  religion: "Agama",
  grade: "Kelas",
  school: "Sekolah",
  street: "Alamat lengkap",
  rtrw: "RT / RW",
  village: "Kelurahan / desa",
  district: "Kecamatan",
  city: "Kota / kabupaten",
  province: "Provinsi",
  postalCode: "Kode pos",
  studentPhone: "No. HP / WhatsApp siswa",
  guardianPhone: "No. HP orang tua/wali",
  fatherName: "Nama ayah",
  fatherJob: "Pekerjaan ayah",
  motherName: "Nama ibu",
  motherJob: "Pekerjaan ibu",
  guardianName: "Nama wali",
  parentStatus: "Status orang tua",
  livingWith: "Tinggal bersama",
  fatherEducation: "Pendidikan ayah",
  motherEducation: "Pendidikan ibu",
  socioEconomic: "Kondisi sosial ekonomi",
  educationAid: "Bantuan pendidikan",
  siblings: "Anak ke- / jumlah saudara",
  specialNeeds: "Berkebutuhan khusus",
  colorBlind: "Buta warna",
  notes: "Catatan tambahan",
};

export const VALUES = {
  gender: { L: "Laki-laki", P: "Perempuan" } as Record<string, string>,
  yes: "Ya",
  no: "Tidak",
  yesWith: (types: string) => `Ya (${types})`,
  noAid: "Tidak ada",
  siblings: (order: number | null, count: number | null) =>
    order !== null && count !== null
      ? `Anak ke-${order} dari ${count} bersaudara`
      : order !== null
        ? `Anak ke-${order}`
        : `${count} bersaudara`,
};
