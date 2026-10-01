# Referensi desain halaman Masuk & Daftar ORBIDU

File di folder ini adalah desain dari canvas (format .dc.html), bukan kode untuk dipakai langsung.
Bangun ulang di React + Tailwind dengan mengikuti isi teks, warna, ukuran huruf, jarak, dan radius yang tertulis di sini.

- Auth-Desktop.dc.html  : halaman Masuk/Daftar versi desktop (lebar 1440, tinggi 900). Kiri 65% slot video, kanan 35% form.
- Auth-Mobile.dc.html   : versi HP (lebar 390). Video jadi banner di atas, form di bawah.
- Brief-Animasi.dc.html : brief untuk tim animasi (spesifikasi file video, area aman, storyboard). Bukan halaman aplikasi.

Cara membaca format:
- {{nama}} adalah data dinamis dari blok script di bawah file.
- <sc-for> adalah perulangan, <sc-if> adalah kondisi.
- Blok <script type="text/x-dc"> berisi logika toggle Masuk/Daftar, tampilkan password, pilihan kelas, dan contoh error.
- Gambar maskot di panel kiri dan banner HP hanya pengganti sementara. Nantinya diganti video MP4 dari tim.
- Font 'Caveat' di desain adalah pengganti sementara font Pecita.
