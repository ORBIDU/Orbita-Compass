# Referensi desain portal siswa ORBIDU

File di folder ini adalah desain dari canvas (format .dc.html), bukan kode untuk dipakai langsung.
Bangun ulang di React + Tailwind dengan mengikuti isi teks, warna, ukuran huruf, jarak, dan radius yang tertulis di sini.

- PortalHeader.dc.html         : header portal desktop (logo, menu dengan garis bawah untuk menu aktif, dropdown Persiapan, notifikasi, menu akun). Dipakai di semua halaman portal.
- Portal-Dashboard.dc.html     : dashboard desktop (lebar 1440) dengan tiga kondisi siswa: baru, sudah_asesmen, aktif.
- Portal-Dashboard-HP.dc.html  : dashboard HP (lebar 390) dengan menu bawah 5 item.
- Portal-Analisis.dc.html      : Analisis Potensi desktop, tiga tab: Gambaran Minat Bakat, Prestasi, Nilai Rapor. Panel 'Contoh tes' menampilkan Bagian 1 (pilihan tunggal, pilihan ganda, urutan), Bagian 5 (skala), Bagian 7 (Simpan & Analisis), layar Menganalisis, dan Selesai. Tweaks: raporKosong, modeBackend.
- Portal-Analisis-HP.dc.html   : Analisis Potensi versi HP (lebar 390).
- Portal-Compass.dc.html       : ORBIDU Compass desktop. Panel Mode Demo: Terkunci (status baru) dan Terbuka.
- Portal-Beasiswa.dc.html      : Explore Beasiswa desktop (filter, simpan, jendela detail). Data beasiswa masih contoh.
- Portal-ActionPlan.dc.html    : Action Plan desktop. Semua tugas berupa latihan soal dari AI per hari belajar, tanpa tugas manual. Klik tanggal di kalender untuk melihat dan mengerjakan latihan hari itu. Di laptop kalender tetap di tempat (sticky) saat daftar latihan di-scroll. Mode Demo: Terkunci, Belum ada rencana, Aktif.

Cara membaca format:
- <dc-import name="PortalHeader" ...> artinya komponen PortalHeader dipasang di situ.
- {{nama}} adalah data dinamis dari blok script di bawah file.
- <sc-for> adalah perulangan, <sc-if> adalah kondisi.
- Blok <script type="text/x-dc"> berisi data contoh dan logika (ganti status, tab, jawaban tes, jendela tambah prestasi, grafik rapor).
- Panel "Mode Demo" di desain hanya menggambarkan panel Mode Demo yang sudah ada di aplikasi. Jangan dibuat dua kali.
- Soal dan nama bagian tes masih contoh, menunggu 42 soal final dari Bu Putri.
