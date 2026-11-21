// Identitas brand ORBIDU. Semua nama, tagline, dan kontak yang terlihat
// pengguna diambil dari sini, jangan ditulis ulang di komponen.
//
// ⚠️ Nilai bertanda "BELUM DIPASTIKAN" wajib dicek sebelum rilis.

export const BRAND = {
  name: "ORBIDU",
  tagline: "The Smart Way to Shape Your Future",
  hashtag: "#TheSmartWaytoShapeYourFuture",
  /** Sapaan untuk pengguna (dipakai di hero, dll.). */
  audience: "Bifriends",
  /** Nama fitur rekomendasi (dulu "Orbita Compass"). */
  compassName: "ORBIDU Compass",
  // BELUM DIPASTIKAN: lokasi dari desain footer Fase 10.
  location: "Palembang, Indonesia",
} as const;

// BELUM DIPASTIKAN: nomor WhatsApp resmi belum ada. Ganti placeholder ini
// dengan format internasional tanpa "+" dan spasi, mis. "6281234567890".
export const WHATSAPP_NUMBER = "62XXXXXXXXXXX";

/** true selama nomor WhatsApp masih placeholder. */
export const WHATSAPP_IS_PLACEHOLDER = WHATSAPP_NUMBER.includes("X");

export const CONTACT = {
  // BELUM DIPASTIKAN
  email: "hello@orbidu.id",
  instagram: {
    // BELUM DIPASTIKAN
    handle: "@orbidu.id",
    url: "https://instagram.com/orbidu.id",
  },
  linkedin: {
    label: "ORBIDU",
    // BELUM DIPASTIKAN: URL LinkedIn belum ada (placeholder).
    url: "https://www.linkedin.com/company/orbidu",
  },
} as const;

/** Pesan pembuka WhatsApp untuk tiap tombol. */
export const WHATSAPP_MESSAGES = {
  berlangganan: `Halo tim ${BRAND.name}, aku mau berlangganan ${BRAND.name}.
Nama: 
Sekolah: 
Kelas: `,
  konsultasi: `Halo tim ${BRAND.name}, aku mau konsultasi soal jurusan dan persiapan kuliah.`,
  faq: `Halo tim ${BRAND.name}, aku punya pertanyaan tentang ${BRAND.name}.`,
  sekolah: `Halo tim ${BRAND.name}, saya ingin tahu cara menghadirkan ${BRAND.name} di sekolah kami.`,
  lupaPassword: `Halo tim ${BRAND.name}, aku lupa password akunku. Boleh dibantu reset? Email akunku: `,
} as const;

export type WhatsAppTopic = keyof typeof WHATSAPP_MESSAGES;

/** Link WhatsApp (wa.me) dengan pesan pembuka sesuai topik. */
export function whatsappLink(topic: WhatsAppTopic): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES[topic])}`;
}
