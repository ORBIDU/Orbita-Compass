# Referensi desain portal siswa ORBIDU (Dashboard & Analisis Potensi)

File di folder ini adalah desain dari canvas (format .dc.html), bukan kode untuk dipakai langsung.
Bangun ulang di React + Tailwind dengan mengikuti isi teks, warna, ukuran huruf, jarak, dan radius yang tertulis di sini.

- PortalHeader.dc.html         : header portal desktop (logo, menu dengan garis bawah untuk menu aktif, dropdown Persiapan, notifikasi, menu akun). Dipakai di semua halaman portal.
- Portal-Dashboard.dc.html     : dashboard desktop (lebar 1440) dengan tiga kondisi siswa: baru, sudah_asesmen, aktif.
- Portal-Dashboard-HP.dc.html  : dashboard HP (lebar 390) dengan menu bawah 5 item.
- Portal-Analisis.dc.html      : Analisis Potensi desktop, tiga tab: Gambaran Minat Bakat, Prestasi, Nilai Rapor. Panel 'Contoh tes' menampilkan Bagian 1 (pilihan tunggal, pilihan ganda, urutan), Bagian 5 (skala), Bagian 7 (Simpan & Analisis), layar Menganalisis, dan Selesai. Tweaks: raporKosong, modeBackend.
- Portal-Analisis-HP.dc.html   : Analisis Potensi versi HP (lebar 390).

Cara membaca format:
- <dc-import name="PortalHeader" ...> artinya komponen PortalHeader dipasang di situ.
- {{nama}} adalah data dinamis dari blok script di bawah file.
- <sc-for> adalah perulangan, <sc-if> adalah kondisi.
- Blok <script type="text/x-dc"> berisi data contoh dan logika (ganti status, tab, jawaban tes, jendela tambah prestasi, grafik rapor).
- Panel "Mode Demo" di desain hanya menggambarkan panel Mode Demo yang sudah ada di aplikasi. Jangan dibuat dua kali.
- Soal dan nama bagian tes masih contoh, menunggu 42 soal final dari Bu Putri.
