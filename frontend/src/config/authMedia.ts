// Video panel Masuk dan Aktivasi (komponen AuthVideoSlot).
//
// File diletakkan di `frontend/public/media/auth/`, lalu tulis path-nya di
// sini (diawali "/"). Selama nilainya null, yang tampil ilustrasi maskot dan
// orbit dari desain. Spesifikasi lengkap: docs/design/auth/Brief-Animasi.dc.html.
//
// - desktop: panel kiri. MP4 (H.264) 1200×1200, maks. 3 MB, loop 12–15 detik
//   tanpa suara. Area aman di tengah 800×800 karena tepinya bisa terpotong.
// - mobile : banner atas di HP dan tablet. MP4 1280×720, maks. 1,5 MB.
//   Area aman di tengah 1000×620.
// - poster : JPG dari frame pertama video. Tampil selama video dimuat, saat
//   video gagal diputar, dan saat pengguna mematikan animasi
//   (prefers-reduced-motion).

export interface AuthMediaSource {
  video: string | null;
  poster: string | null;
}

export const AUTH_MEDIA: Record<"desktop" | "mobile", AuthMediaSource> = {
  desktop: {
    // Contoh: "/media/auth/auth-desktop.mp4"
    video: null,
    // Contoh: "/media/auth/auth-desktop.jpg"
    poster: null,
  },
  mobile: {
    // Contoh: "/media/auth/auth-mobile.mp4"
    video: null,
    // Contoh: "/media/auth/auth-mobile.jpg"
    poster: null,
  },
};
