# Referensi desain situs publik ORBIDU (Fase 10)

Desain dari Figma (ekspor SVG, lebar 1728), menggantikan `docs/design/landing/`
untuk tampilan halaman publik. File di sini hanya **pratinjau JPG**; SVG aslinya
(±17 MB, teksnya sudah jadi path) tidak disimpan di git. Minta ke tim desain
kalau butuh ukuran atau aset pasti.

| File | Halaman | Route |
|---|---|---|
| `Beranda-Desktop.jpg` | Beranda | `/` |
| `UntukSekolah-Desktop.jpg` | Untuk Sekolah | `/untuk-sekolah` |
| `EksplorJurusan-Desktop.jpg` | Eksplor Jurusan | `/jurusan` |
| `LatihanSoal-Desktop.jpg` | Latihan Soal | `/latihan-soal` |
| `FAQ-Desktop.jpg` | FAQ + Hubungi Kami | `/faq` |

Belum ada: desain HP, halaman **Tentang Kami** (menunya disembunyikan dulu).

## Yang sengaja berbeda dari desain
Keputusan Fase 10 (lihat `docs/SPEK_SISWA.md` bagian 1):
- Tombol **"Daftar"** diganti **"Berlangganan"** (WhatsApp): ORBIDU tidak punya pendaftaran mandiri.
- Semua teks memakai **Poppins** (desain memakai Plus Jakarta Sans dan Inter di beberapa bagian).
- Tampilan HP disusun sendiri dari desain desktop.
- Angka jumlah PTN/PTS di kartu jurusan hanya tampil kalau dihitung dari data kampus asli.
- Teks yang tidak sesuai kondisi produk diganti (mis. "Sumber Terpercaya & Teruji" selama bank soal masih contoh, nama lama "ORBITA").
- Form "Kirim Pesan" dikirim lewat WhatsApp sampai backend punya endpoint pesan.
- Tahun di footer otomatis (desain: © 2025).

## Interaksi
- Hero Beranda: dua meteor jatuh diagonal berulang (keluar dari hero, lalu muncul lagi dari atas). Diam kalau `prefers-reduced-motion`.
