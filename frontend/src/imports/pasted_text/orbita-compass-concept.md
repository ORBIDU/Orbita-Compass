1. Konsep utama Orbita Compass

Saya akan membuat urutannya:

🧭 Orbita Compass

1. Rekomendasi Pendidikan Lanjutan
↓
2. Jenjang yang sesuai
↓
3. Pilihan Perguruan Tinggi / Jalur
↓
4. Rekomendasi Program Studi
↓
5. Evidence & Cross Analysis
↓
6. Rekomendasi Beasiswa

Jadi siswa tidak langsung dilempar ke “Sistem Informasi di UI”.

Mereka terlebih dahulu diberi gambaran:

“Dari profilmu, kamu punya beberapa jalur pendidikan yang menarik.”

2. Halaman awal: Rekomendasi Pendidikan Lanjutan

Headline-nya bisa dibuat lebih menarik:

🧭 Mau lanjut ke mana setelah SMA?

Nggak harus langsung tahu jurusan.
Orbita membantu kamu melihat jalur pendidikan yang paling sesuai dengan profil, minat, dan potensimu.

Kemudian hasil scoring:

✨ Rekomendasi untukmu

94% — S1 / Sarjana
89% — D4 / Sarjana Terapan
84% — Pendidikan Kedinasan
78% — D3

Tidak semua kategori harus muncul.

Kalau suatu jalur tidak cukup relevan:

Tidak ada rekomendasi yang memenuhi kriteria

bukan:

0%

Ini membuat sistem tidak memberikan kesan bahwa semua siswa harus cocok dengan semua jalur.

3. Jenjang pendidikan harus dijelaskan

Ini penting sekali untuk siswa SMA karena banyak siswa sebenarnya belum memahami perbedaan S1, D3, D4, vokasi, akademik, dan kedinasan.

Saya akan memberikan informasi singkat di Orbita:

🎓 Pilih berdasarkan jalur dan jenjang
Jenjang	Penjelasan sederhana
D3	Pendidikan vokasi yang lebih berfokus pada keterampilan terapan
D4 / Sarjana Terapan	Pendidikan vokasi dengan jenjang setara S1, dengan fokus kuat pada penerapan
S1 / Sarjana	Pendidikan akademik yang berfokus pada penguasaan bidang ilmu
Profesi	Pendidikan lanjutan setelah S1 untuk bidang profesi tertentu
S2 / Magister	Pendidikan lanjutan setelah sarjana
S3 / Doktor	Pendidikan tingkat doktoral

Untuk konteks siswa SMA, S1, D3, dan D4 menjadi fokus utama. Jenjang seperti profesi, S2, dan S3 bisa ditampilkan sebagai informasi lanjutan, bukan sebagai rekomendasi utama.

UU 12/2012 memang membedakan pendidikan akademik, vokasi, dan profesi; pendidikan vokasi mencakup program diploma sampai sarjana terapan.

4. Lalu di mana PTN, Vokasi, dan Kedinasan?

Di sinilah saya menyarankan jangan dibuat seperti ini:

S1
D4
PTN
Vokasi
Kedinasan

karena levelnya bercampur.

Lebih baik:

🎓 S1 / Sarjana — 94% cocok

Jenis pilihan yang tersedia:

PTN PTS PTLN

Kemudian:

Program studi yang paling sesuai dengan profilmu

Sistem Informasi — 96%

Informatika — 91%

Manajemen — 84%

Lalu baru:

Pilihan kampus

PTN

Universitas Indonesia
Universitas Sriwijaya
...

PTS

...

PTLN

...
5. Untuk D4 / Sarjana Terapan

Misalnya:

🎓 D4 / Sarjana Terapan — 89% cocok

Jalur vokasi yang menggabungkan pembelajaran akademik dengan keterampilan terapan.

Bidang yang cocok untukmu:

Sistem Informasi
Teknologi Rekayasa
Akuntansi
Manajemen Bisnis

Kemudian:

Pilihan perguruan tinggi

PTN
PTS
Politeknik
Perguruan tinggi lain yang menyediakan program relevan

Secara hukum, pendidikan vokasi memang menyiapkan mahasiswa untuk pekerjaan dengan keahlian terapan tertentu sampai program sarjana terapan.

6. Lalu Kedinasan masuk ke jenjang mana?

Jawabannya: Kedinasan bukan jenjang pendidikan.

Ini yang menurut saya perlu kamu tegaskan dalam desain.

Kedinasan bisa memiliki program dan jenjang yang berbeda, tergantung sekolah/institusinya. Contoh seleksi sekolah kedinasan 2025 mencakup PKN STAN, IPDN, STIN, Politeknik Siber dan Sandi Negara, Politeknik Statistika STIS, STMKG, serta sekolah kedinasan Kemenhub.

Jadi dalam database Orbita:

Pendidikan Kedinasan
│
├── Institusi
│   ├── PKN STAN
│   ├── IPDN
│   ├── STIN
│   ├── Polstat STIS
│   ├── STMKG
│   └── ...
│
├── Jenjang
│   ├── D3
│   ├── D4 / Sarjana Terapan
│   └── S1 / sesuai program yang tersedia
│
└── Program Studi

Jangan menempatkan Kedinasan di bawah “D4” secara permanen.

Lebih tepat:

Kedinasan → Institusi → Program → Jenjang

karena struktur setiap sekolah kedinasan dapat berbeda.

Dan karena penerimaan sekolah kedinasan memang diumumkan per tahun, database Orbita harus memiliki atribut tahun_akademik/tahun_seleksi. Misalnya pada 2025 pemerintah membuka 3.252 formasi pada tujuh instansi; jumlah dan instansi tersebut tidak boleh dianggap sebagai daftar permanen untuk tahun berikutnya.

7. Jadi UI-nya bisa seperti ini
🧭 Rekomendasi Pendidikan Lanjutan

Ini bukan cuma soal S1 atau kuliah di mana.
Lihat berbagai jalur pendidikan yang mungkin cocok dengan profilmu.

Your Top Matches
┌──────────────────────────────────────────┐
│ 🎓 S1 / Sarjana                          │
│                                          │
│ 94%                                      │
│ Strong Match                             │
│                                          │
│ Pendidikan akademik                      │
│                                          │
│ [Lihat rekomendasi →]                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 🎓 D4 / Sarjana Terapan                  │
│                                          │
│ 89%                                      │
│ Great Match                              │
│                                          │
│ Pendidikan vokasi                        │
│                                          │
│ [Lihat rekomendasi →]                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 🏛️ Kedinasan                             │
│                                          │
│ 84%                                      │
│ Worth Exploring                          │
│                                          │
│ Pendidikan pada sekolah kedinasan        │
│                                          │
│ [Lihat rekomendasi →]                    │
└──────────────────────────────────────────┘

Kemudian:

Kenapa hasilnya seperti ini?

[ Lihat analisis ]

8. Setelah siswa klik S1

Baru masuk ke:

🎓 S1 / Sarjana

94% cocok dengan profilmu

Berdasarkan hasil analisis minat, kemampuan, prestasi, nilai akademik, dan preferensi pendidikanmu.

🎯 Program Studi yang Direkomendasikan

#1 Sistem Informasi — 96%

Teknologi × bisnis × problem solving

#2 Informatika — 91%

Programming × teknologi × logika

#3 Manajemen — 84%

Bisnis × strategi × komunikasi

9. Baru rekomendasi PTN

Ini bagian yang kamu tekankan:

Dalam Orbita Compass disarankan untuk merekomendasi PTN baru jurusan.

Saya setuju.

Jadi jangan:

Jurusan → selesai.

Tetapi:

🏫 PTN yang mungkin cocok untukmu

Misalnya siswa memilih:

Sistem Informasi

Orbita menampilkan:

1. Universitas Indonesia
Sistem Informasi
92% match

2. Universitas Sriwijaya
Sistem Informasi
88% match

3. Universitas ...
Sistem Informasi
84% match

Tetapi jangan menyebut score tersebut sebagai peluang diterima.

Gunakan:

92% profile match

atau bahasa Indonesia:

92% kecocokan profil

Karena scoring Orbita adalah kecocokan, bukan probabilitas kelulusan.

10. Tambahkan Beasiswa sebagai bagian dari output

Ini menurut saya justru bisa menjadi fitur unggulan Orbita Compass.

Setelah siswa mendapatkan rekomendasi pendidikan:

💰 Beasiswa yang mungkin cocok untukmu

Kuliah sudah punya target. Sekarang cari cara untuk mewujudkannya.

Misalnya:

Beasiswa A
🎓 S1
📍 Dalam negeri
💰 Tuition + living allowance
Eligibility: 92% match

Beasiswa B
🎓 D4 / S1
📍 Dalam negeri
💰 Tuition support
Eligibility: 86% match

Beasiswa C
🌏 Undergraduate
📍 Luar negeri
💰 Fully funded
Eligibility: 78% match

11. Scoring beasiswa juga jangan cuma berdasarkan "profil"

Untuk beasiswa, sistem harus mencocokkan:

Profil siswa

Jenjang

Jurusan

Institusi/negara tujuan

Persyaratan beasiswa

Tahun/periode pendaftaran

Jadi:

86% match

berarti:

"Profilmu memenuhi sebagian besar kriteria yang tersedia."

Bukan:

"86% kemungkinan mendapatkan beasiswa."

Ini penting.

12. Saya akan membuat "Evidence" setelah rekomendasi

Misalnya:

🔎 Why this recommendation?

Sistem Informasi — 96%

Minat
91%

Kemampuan
88%

Nilai akademik
90%

Prestasi/pengalaman
87%

Preferensi karier
94%

Kemudian:

💡 Orbita Insight
Kamu punya kombinasi minat teknologi dan bisnis yang cukup kuat. Karena itu, Sistem Informasi menjadi salah satu pilihan yang paling sesuai dengan profilmu.

Ini jauh lebih berguna daripada hanya menunjukkan:

96%

13. Cross Analysis menjadi fitur pembanding

Kemudian:

🔀 Compare Your Options

Masih bingung antara S1 dan D4? Coba bandingkan.

Faktor	S1	D4
Minat	91%	89%
Akademik	90%	86%
Praktik	78%	94%
Karier	92%	90%
Overall Match	94%	89%

Lalu Orbita memberikan insight:

S1 sedikit lebih cocok dengan profilmu, terutama dari sisi minat dan arah akademik. Namun, D4 menjadi alternatif kuat jika kamu lebih menyukai pembelajaran yang praktis.

Ini membantu siswa membuat keputusan, bukan sekadar menerima rekomendasi AI.

14. Sistem harus Year-Aware

Karena kamu menyebut:

"program yang tersedia pada tahun berjalan"

Saya sangat setuju.

Ini harus menjadi requirement sistem, bukan hanya catatan UI.

Data Orbita sebaiknya memiliki:

Institution
Program
Education Level
Education Type
Admission Path
Academic Year
Registration Period
Availability Status
Requirements
Scholarship

Contohnya:

PKN STAN
│
├── Institution Type: Kedinasan
├── Education Type: Vokasi
├── Level: D4
├── Program: Akuntansi Sektor Publik
├── Admission Year: 2026
├── Available: TRUE
├── Registration Period: ...
└── Requirements: ...

Tahun berikutnya datanya di-update, bukan sekadar menggunakan data 2026.

Ini sangat penting terutama untuk sekolah kedinasan karena daftar instansi, formasi, program, persyaratan, dan jadwal seleksi memang dapat berubah setiap tahun. Pada 2025 saja, BKN mencatat tujuh instansi penyelenggara dan total 3.252 formasi.

15. Bahasa UI-nya

Karena kamu ingin Bahasa Indonesia + English, jangan mencampur keduanya secara random.

Buat language switcher:

🇮🇩 ID 🇬🇧 EN

Indonesia

Rekomendasi Pendidikan Lanjutan
Jalur yang paling sesuai dengan profilmu

English

Education Path Recommendations
Education pathways that best match your profile

Beberapa terminology:

Indonesia	English
Analisis Potensi	Potential Analysis
Orbita Compass	Orbita Compass
Rekomendasi Pendidikan Lanjutan	Education Path Recommendations
Jenjang Pendidikan	Education Level
Pendidikan Akademik	Academic Education
Pendidikan Vokasi	Vocational Education
Pendidikan Kedinasan	Government Service Education / Service Academy
Perguruan Tinggi Negeri	Public University
Perguruan Tinggi Swasta	Private University
Perguruan Tinggi Luar Negeri	Overseas University
Program Studi	Study Program
Kecocokan Profil	Profile Match
Dasar Rekomendasi	Recommendation Insights
Perbandingan	Compare Options
Beasiswa	Scholarships

Untuk “Kedinasan”, saya tidak akan menerjemahkan secara literal menjadi “Official Education”. Dalam UI English, Service Academy atau Government Service Academy lebih mudah dipahami, dengan penjelasan kontekstual bahwa ini adalah institusi pendidikan yang terkait dengan kementerian/lembaga pemerintah.

16. Jadi struktur final Orbita Compass saya rekomendasikan menjadi
🧭 ORBITA COMPASS
│
├── 01. EDUCATION PATH
│   │
│   ├── 🎓 S1 / Sarjana
│   ├── 🎓 D4 / Sarjana Terapan
│   ├── 🎓 D3
│   └── 🏛️ Kedinasan
│
├── 02. STUDY PROGRAM
│   │
│   ├── Sistem Informasi
│   ├── Informatika
│   ├── Akuntansi
│   └── ...
│
├── 03. UNIVERSITY MATCH
│   │
│   ├── PTN
│   ├── PTS
│   ├── Vokasi / Politeknik
│   └── PTLN
│
├── 04. RECOMMENDATION INSIGHTS
│   │
│   ├── Evidence
│   ├── Profile Match
│   └── Cross Analysis
│
└── 05. SCHOLARSHIP MATCH
    │
    ├── Beasiswa yang sesuai
    ├── Eligibility
    ├── Benefit
    ├── Deadline
    └── Requirements

Namun secara UI, siswa tidak perlu melihat struktur teknis ini. Mereka cukup melihat journey:

🎓 Jalur pendidikan yang cocok → 🎯 Jurusan yang cocok → 🏫 Kampus yang cocok → 🔎 Kenapa cocok → 💰 Beasiswa yang bisa dicoba