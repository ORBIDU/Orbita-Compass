# Font aksen Pecita

Taruh file font Pecita di folder ini dengan nama:

- `Pecita.woff2` (disarankan, ukurannya paling kecil), dan/atau
- `Pecita.otf`

`@font-face`-nya sudah disiapkan di `src/styles/fonts.css`. Setelah file ada, kelas Tailwind `font-accent` langsung memakai Pecita. Selama file belum ada, `font-accent` memakai Poppins sebagai cadangan.

Kalau hanya salah satu format yang tersedia, hapus baris format lainnya di `fonts.css` supaya build tidak memunculkan peringatan.

Ingat: Pecita hanya untuk 1–3 kata penekanan (misalnya di hero), bukan untuk teks biasa.
