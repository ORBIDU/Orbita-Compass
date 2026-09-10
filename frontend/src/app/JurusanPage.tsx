import React, { useState } from "react";
import { ArrowLeft, Heart, Search, Sparkles, ChevronRight, Check, X } from "lucide-react";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";
const GREEN = "#059669";

// ─── Radar Chart ───────────────────────────────────────────────────────────────
function SvgRadar({ axes, values, color }: { axes: string[]; values: number[]; color: string }) {
  const N = axes.length; const CX = 110; const CY = 110; const R = 80;
  function pt(i: number, v: number) { const a = (Math.PI*2*i)/N - Math.PI/2; return { x: CX+R*(v/100)*Math.cos(a), y: CY+R*(v/100)*Math.sin(a) }; }
  function ptR(i: number) { const a = (Math.PI*2*i)/N - Math.PI/2; return { x: CX+R*Math.cos(a), y: CY+R*Math.sin(a) }; }
  const poly = values.map((v,i) => pt(i,v));
  const web  = Array.from({ length: N }, (_,i) => ptR(i));
  return (
    <svg width={220} height={220} viewBox="0 0 220 220">
      {[.25,.5,.75,1].map(r => <polygon key={r} points={web.map(p=>`${CX+(p.x-CX)*r},${CY+(p.y-CY)*r}`).join(" ")} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>)}
      {web.map((p,i) => <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>)}
      <polygon points={poly.map(p=>`${p.x},${p.y}`).join(" ")} fill={color+"28"} stroke={color} strokeWidth={2} strokeLinejoin="round"/>
      {poly.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={color}/>)}
      {web.map((p,i) => { const lx=CX+(p.x-CX)*1.22; const ly=CY+(p.y-CY)*1.22; return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#6b7280" fontFamily={PP} fontWeight={600}>{axes[i]}</text>; })}
    </svg>
  );
}

function Stars({ n, max=5 }: { n: number; max?: number }) {
  return <div className="flex gap-0.5">{Array.from({length:max},(_,i)=><span key={i} className={`text-[11px] ${i<n?"text-[#f1ad00]":"text-[#e5e7eb]"}`}>★</span>)}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PTN & PTS DATA
// ═══════════════════════════════════════════════════════════════════════════════

type JurusanDetail = {
  key: string; nama: string; emoji: string; color: string; light: string;
  durasi: string; deskripsi: string; kategori: string;
  pelajari: { icon: string; label: string }[];
  kompetensi: { label: string; val: number }[]; kompetensiAI: string;
  mapelPendukung: { nama: string; bintang: number }[]; mapelAI: string;
  karier: { nama: string; bintang: number; gaji: string }[];
  universitas: { nama: string; match: number; akreditasi: string; jalur: string[]; kota: string }[]; uniAI: string;
  alumni: { nama: string; univ: string; jurusan: string; quote: string; aiNote: string; foto: string }[];
  serupa: { key: string; nama: string; alasan: string[] }[]; serupaAI: string;
  evidenceCards: { icon: string; title: string; desc: string }[];
};

const DETAIL_DB: JurusanDetail[] = [
  { key:"si", nama:"Sistem Informasi", emoji:"💻", color:"#0965fa", light:"#eff6ff", durasi:"4 Tahun", kategori:"Teknologi",
    deskripsi:"Sistem Informasi menghubungkan teknologi dengan kebutuhan bisnis. Kamu akan mempelajari cara membangun, mengelola, dan mengoptimalkan sistem informasi yang mendukung operasional organisasi modern.",
    pelajari:[{icon:"🗄️",label:"Basis Data"},{icon:"📊",label:"Analisis Bisnis"},{icon:"💻",label:"Pemrograman"},{icon:"🎨",label:"UI/UX"},{icon:"☁️",label:"Cloud"},{icon:"📈",label:"Analitik Data"}],
    kompetensi:[{label:"Berpikir Logis",val:90},{label:"Komunikasi",val:80},{label:"Kreativitas",val:70},{label:"Leadership",val:75},{label:"Problem Solving",val:92}],
    kompetensiAI:"Jurusan Sistem Informasi cocok untuk siswa yang menyukai analisis, pemecahan masalah, serta kolaborasi antara teknologi dan bisnis.",
    mapelPendukung:[{nama:"Matematika",bintang:5},{nama:"Informatika",bintang:5},{nama:"Bahasa Inggris",bintang:4},{nama:"Ekonomi",bintang:3}],
    mapelAI:"Mata pelajaran di atas akan membantumu membangun dasar akademik yang kuat untuk mengikuti perkuliahan Sistem Informasi.",
    karier:[{nama:"Business Analyst",bintang:5,gaji:"Rp 8–15 juta/bln"},{nama:"Product Manager",bintang:5,gaji:"Rp 12–25 juta/bln"},{nama:"IT Consultant",bintang:4,gaji:"Rp 10–20 juta/bln"},{nama:"System Analyst",bintang:4,gaji:"Rp 7–14 juta/bln"},{nama:"UI/UX Designer",bintang:4,gaji:"Rp 8–18 juta/bln"}],
    universitas:[{nama:"Universitas Indonesia",match:96,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Depok"},{nama:"UGM",match:91,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Yogyakarta"},{nama:"ITS",match:90,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Surabaya"},{nama:"UNPAD",match:87,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Bandung"}],
    uniAI:"Berdasarkan profilmu, Universitas Indonesia memiliki tingkat kecocokan tertinggi karena kombinasi kekuatan akademikmu, preferensi lokasi, dan target karier.",
    alumni:[{nama:"Nadiem Makarim",univ:"Harvard Business School",jurusan:"MBA & Teknologi",quote:"Teknologi adalah alat, tetapi yang membuat perbedaan adalah cara kita menggunakannya untuk memecahkan masalah nyata.",aiNote:"Lulusan Sistem Informasi tidak hanya menjadi programmer. Banyak yang memimpin startup, menjadi CTO, atau CEO perusahaan teknologi.",foto:"👨‍💼"},{nama:"William Tanuwijaya",univ:"Universitas Bina Nusantara",jurusan:"Teknik Informatika",quote:"Percayakan pada proses belajarmu. Setiap baris kode yang kamu tulis hari ini adalah investasi untuk masa depan.",aiNote:"Pendiri Tokopedia menunjukkan bahwa lulusan IT Indonesia mampu membangun ekosistem digital kelas dunia.",foto:"👨‍🔧"}],
    serupa:[{key:"informatika",nama:"Informatika",alasan:["Pemrograman Kuat","Logika Tinggi","Tech Enthusiast"]},{key:"ds",nama:"Data Science",alasan:["Analitik Data","Matematika","Problem Solving"]}],
    serupaAI:"Selain Sistem Informasi, kami menemukan beberapa jurusan lain yang memiliki tingkat kecocokan tinggi dengan profilmu.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan analitis dan pemecahan masalahmu selaras dengan kompetensi utama jurusan ini."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Matematika dan Informatika menunjukkan performa yang konsisten di atas rata-rata."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Hasil Student Profiling menunjukkan ketertarikan tinggi pada teknologi, inovasi, dan penyelesaian masalah."}] },

  { key:"informatika", nama:"Informatika", emoji:"🖥️", color:"#8b5cf6", light:"#f5f3ff", durasi:"4 Tahun", kategori:"Teknologi",
    deskripsi:"Informatika membekali kamu dengan kemampuan merancang dan mengembangkan perangkat lunak, algoritma, serta kecerdasan buatan yang menjadi tulang punggung dunia digital.",
    pelajari:[{icon:"⚙️",label:"Algoritma"},{icon:"🤖",label:"Kecerdasan Buatan"},{icon:"🔒",label:"Keamanan Siber"},{icon:"📱",label:"Pengembangan Aplikasi"},{icon:"🌐",label:"Jaringan"},{icon:"🧮",label:"Komputasi"}],
    kompetensi:[{label:"Berpikir Logis",val:95},{label:"Komunikasi",val:70},{label:"Kreativitas",val:80},{label:"Ketepatan",val:90},{label:"Problem Solving",val:95}],
    kompetensiAI:"Informatika sangat cocok untuk siswa dengan kemampuan logika dan matematika tinggi yang tertarik membangun solusi perangkat lunak dari nol.",
    mapelPendukung:[{nama:"Matematika",bintang:5},{nama:"Fisika",bintang:4},{nama:"Informatika",bintang:5},{nama:"Bahasa Inggris",bintang:4}],
    mapelAI:"Penguasaan Matematika dan Informatika di SMA akan sangat membantu memahami konsep algoritma dan pemrograman di tingkat universitas.",
    karier:[{nama:"Software Engineer",bintang:5,gaji:"Rp 10–30 juta/bln"},{nama:"AI Engineer",bintang:5,gaji:"Rp 15–40 juta/bln"},{nama:"Cybersecurity Analyst",bintang:4,gaji:"Rp 10–25 juta/bln"},{nama:"DevOps Engineer",bintang:4,gaji:"Rp 10–25 juta/bln"},{nama:"Peneliti",bintang:4,gaji:"Rp 8–20 juta/bln"}],
    universitas:[{nama:"ITB",match:95,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Bandung"},{nama:"UI",match:93,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Depok"},{nama:"UGM",match:91,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Yogyakarta"},{nama:"ITS",match:90,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Surabaya"}],
    uniAI:"ITB menjadi pilihan utama berdasarkan reputasi program Informatikanya yang diakui secara internasional dan kurikulum berbasis riset yang kuat.",
    alumni:[{nama:"Kevin Aluwi",univ:"University of Southern California",jurusan:"Teknik Informatika",quote:"Coding bukan hanya tentang menulis kode — ini tentang memahami masalah manusia dan memecahkannya secara elegan.",aiNote:"Co-founder Gojek menunjukkan bagaimana lulusan Informatika bisa memimpin transformasi digital di tingkat nasional.",foto:"👨‍💻"}],
    serupa:[{key:"si",nama:"Sistem Informasi",alasan:["Teknologi","Analitik","Bisnis"]},{key:"ds",nama:"Data Science",alasan:["Pemrograman","Matematika","Analitik"]}],
    serupaAI:"Informatika membuka banyak jalur karier berbasis teknologi. Jurusan serupa ini menawarkan fokus berbeda di dunia digital.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan logika dan komputasimu sangat sesuai dengan tuntutan kurikulum Informatika yang padat algoritma."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Matematika dan Fisikamu mencerminkan kesiapan untuk mempelajari konsep komputasi tingkat lanjut."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada teknologi dan pemecahan masalah kompleks adalah fondasi ideal untuk berkarier di Informatika."}] },

  { key:"ds", nama:"Data Science", emoji:"📊", color:"#00b2dd", light:"#e0f8ff", durasi:"4 Tahun", kategori:"Teknologi",
    deskripsi:"Data Science mengajarkan kamu mengubah data mentah menjadi keputusan bisnis yang bernilai. Di era AI, profesi ini menjadi salah satu yang paling dicari di seluruh industri.",
    pelajari:[{icon:"📈",label:"Statistika"},{icon:"🤖",label:"Machine Learning"},{icon:"🐍",label:"Python & R"},{icon:"📊",label:"Visualisasi Data"},{icon:"🧠",label:"Deep Learning"},{icon:"🗄️",label:"Big Data"}],
    kompetensi:[{label:"Matematika",val:92},{label:"Statistika",val:90},{label:"Pemrograman",val:85},{label:"Analitik",val:95},{label:"Komunikasi",val:75}],
    kompetensiAI:"Data Science ideal untuk siswa dengan kecintaan pada angka, pola, dan kemampuan menceritakan data menjadi wawasan yang mudah dipahami.",
    mapelPendukung:[{nama:"Matematika",bintang:5},{nama:"Statistika",bintang:5},{nama:"Informatika",bintang:4},{nama:"Ekonomi",bintang:3}],
    mapelAI:"Penguasaan kuat di Matematika dan Statistika adalah kunci utama untuk menguasai algoritma machine learning dan analisis data.",
    karier:[{nama:"Data Scientist",bintang:5,gaji:"Rp 12–35 juta/bln"},{nama:"Machine Learning Engineer",bintang:5,gaji:"Rp 15–40 juta/bln"},{nama:"Data Analyst",bintang:4,gaji:"Rp 8–20 juta/bln"},{nama:"AI Researcher",bintang:4,gaji:"Rp 12–30 juta/bln"},{nama:"Business Intelligence",bintang:4,gaji:"Rp 8–18 juta/bln"}],
    universitas:[{nama:"UI",match:94,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Depok"},{nama:"ITB",match:93,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Bandung"},{nama:"UGM",match:89,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Yogyakarta"},{nama:"UNAIR",match:86,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Surabaya"}],
    uniAI:"Program Data Science di UI unggul dalam kolaborasi industri, memberikan pengalaman langsung bekerja dengan data nyata dari perusahaan teknologi terkemuka.",
    alumni:[{nama:"Merry Riana",univ:"Nanyang Technological University",jurusan:"Keuangan & Data",quote:"Data bukan sekadar angka. Data adalah cerita tentang manusia yang menunggu untuk diceritakan.",aiNote:"Lulusan Data Science memiliki fleksibilitas karier tertinggi — dari fintech, healthcare, hingga e-commerce, semua membutuhkan data scientist.",foto:"👩‍💼"}],
    serupa:[{key:"si",nama:"Sistem Informasi",alasan:["Teknologi","Analitik","Bisnis"]},{key:"informatika",nama:"Informatika",alasan:["Pemrograman","Komputasi","AI"]}],
    serupaAI:"Jika kamu tertarik pada aspek tertentu dari Data Science, jurusan serupa ini masing-masing menawarkan fokus yang lebih mendalam.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan matematika dan analitikmu membentuk fondasi ideal untuk pemodelan data dan machine learning."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Matematika dan Statistika di atas rata-rata menunjukkan kesiapan akademik yang solid."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada pola dan data selaras sempurna dengan esensi jurusan Data Science."}] },

  { key:"kedokteran", nama:"Kedokteran", emoji:"🩺", color:"#ef4444", light:"#fef2f2", durasi:"6 Tahun", kategori:"Kedokteran & Kesehatan",
    deskripsi:"Kedokteran adalah panggilan mulia untuk menyembuhkan dan menolong sesama. Program studi ini membutuhkan dedikasi tinggi dan membentuk profesional kesehatan yang kompeten serta berempati.",
    pelajari:[{icon:"🧬",label:"Anatomi"},{icon:"💊",label:"Farmakologi"},{icon:"🔬",label:"Patologi"},{icon:"🫀",label:"Fisiologi"},{icon:"🧠",label:"Neurologi"},{icon:"🤝",label:"Keterampilan Klinis"}],
    kompetensi:[{label:"Sains",val:95},{label:"Empati",val:90},{label:"Ketelitian",val:95},{label:"Ketahanan",val:88},{label:"Komunikasi",val:85}],
    kompetensiAI:"Kedokteran membutuhkan kombinasi langka antara kecerdasan akademik, empati mendalam, dan ketahanan mental yang sangat kuat.",
    mapelPendukung:[{nama:"Biologi",bintang:5},{nama:"Kimia",bintang:5},{nama:"Fisika",bintang:4},{nama:"Matematika",bintang:4}],
    mapelAI:"Penguasaan Biologi dan Kimia di level tinggi adalah prasyarat utama. Persiapkan dirimu sedini mungkin dengan mendalami kedua mata pelajaran ini.",
    karier:[{nama:"Dokter Spesialis",bintang:5,gaji:"Rp 20–80 juta/bln"},{nama:"Dokter Umum",bintang:5,gaji:"Rp 8–20 juta/bln"},{nama:"Peneliti Medis",bintang:4,gaji:"Rp 10–25 juta/bln"},{nama:"Konsultan Kesehatan",bintang:4,gaji:"Rp 15–35 juta/bln"}],
    universitas:[{nama:"UI",match:95,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Depok"},{nama:"UGM",match:94,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Yogyakarta"},{nama:"UNAIR",match:92,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Surabaya"},{nama:"UNDIP",match:88,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Semarang"}],
    uniAI:"FK UI adalah pilihan teratas dengan standar pendidikan internasional, fasilitas rumah sakit pendidikan terlengkap, dan kurikulum berbasis kompetensi terkini.",
    alumni:[{nama:"dr. Terawan Agus Putranto",univ:"Universitas Gadjah Mada",jurusan:"Kedokteran",quote:"Menjadi dokter berarti mengabdikan hidup untuk kesehatan dan keselamatan sesama manusia.",aiNote:"Lulusan Kedokteran tidak selalu berkarier sebagai dokter klinis. Banyak yang berhasil di riset, bioteknologi, manajemen rumah sakit, hingga kebijakan kesehatan.",foto:"👨‍⚕️"}],
    serupa:[{key:"farmasi",nama:"Farmasi",alasan:["Kimia Kuat","Sains","Kesehatan"]},{key:"gizi",nama:"Ilmu Gizi",alasan:["Biologi","Kesehatan","Sains"]}],
    serupaAI:"Jika jalur masuk Kedokteran sangat kompetitif, jurusan kesehatan serupa ini menawarkan dampak besar yang setara.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan analitik dan ketelitianmu selaras dengan tuntutan akademik Kedokteran yang sangat tinggi."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Biologi dan Kimia yang konsisten kuat menunjukkan kesiapan menghadapi kurikulum sains kedokteran."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Kepedulianmu pada kesehatan dan keinginan membantu orang lain adalah motivasi terbaik untuk berkarier di Kedokteran."}] },

  { key:"hukum", nama:"Ilmu Hukum", emoji:"⚖️", color:"#f1ad00", light:"#fffbeb", durasi:"4 Tahun", kategori:"Hukum",
    deskripsi:"Ilmu Hukum mempersiapkanmu memahami sistem hukum, keadilan, dan regulasi yang mengatur kehidupan bermasyarakat dan bernegara.",
    pelajari:[{icon:"📜",label:"Hukum Perdata"},{icon:"⚖️",label:"Hukum Pidana"},{icon:"🌐",label:"Hukum Internasional"},{icon:"💼",label:"Hukum Bisnis"},{icon:"🏛️",label:"Hukum Tata Negara"},{icon:"🤝",label:"Mediasi"}],
    kompetensi:[{label:"Berpikir Kritis",val:92},{label:"Komunikasi",val:95},{label:"Argumentasi",val:90},{label:"Riset",val:85},{label:"Etika",val:88}],
    kompetensiAI:"Hukum cocok untuk siswa yang memiliki kemampuan argumentasi kuat, berpikir kritis, dan kepedulian tinggi terhadap keadilan sosial.",
    mapelPendukung:[{nama:"Bahasa Indonesia",bintang:5},{nama:"Bahasa Inggris",bintang:5},{nama:"PKn",bintang:4},{nama:"Sejarah",bintang:3}],
    mapelAI:"Kemampuan menulis dan argumentasi dalam Bahasa Indonesia dan Inggris sangat penting untuk karier di bidang hukum.",
    karier:[{nama:"Pengacara",bintang:5,gaji:"Rp 8–50 juta/bln"},{nama:"Hakim",bintang:5,gaji:"Rp 10–25 juta/bln"},{nama:"Notaris",bintang:5,gaji:"Rp 12–40 juta/bln"},{nama:"Legal Consultant",bintang:4,gaji:"Rp 10–30 juta/bln"},{nama:"Diplomat",bintang:4,gaji:"Rp 8–20 juta/bln"}],
    universitas:[{nama:"UI",match:92,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Depok"},{nama:"UGM",match:91,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Yogyakarta"},{nama:"UNPAD",match:88,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Bandung"},{nama:"UNAIR",match:85,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Surabaya"}],
    uniAI:"Fakultas Hukum UI konsisten menjadi yang terbaik di Indonesia berdasarkan reputasi akademik, jaringan alumni, dan kualitas dosen praktisi.",
    alumni:[{nama:"Najwa Shihab",univ:"Universitas Indonesia",jurusan:"Hukum",quote:"Pendidikan membentuk cara berpikir, tetapi masa depan dibentuk oleh keberanian untuk terus belajar.",aiNote:"Lulusan Hukum tidak hanya menjadi pengacara. Banyak juga yang berkarier sebagai jurnalis, diplomat, legal consultant, hingga pembuat kebijakan publik.",foto:"👩‍⚖️"}],
    serupa:[{key:"hub-int",nama:"Hubungan Internasional",alasan:["Komunikasi","Kebijakan","Sosial"]},{key:"adm-publik",nama:"Administrasi Publik",alasan:["Kebijakan","Manajemen","Publik"]}],
    serupaAI:"Jika kamu tertarik pada aspek kebijakan dan hubungan antarnegara, jurusan serupa ini layak untuk dijelajahi lebih lanjut.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan argumentasi dan berpikir kritis sangat selaras dengan tuntutan kurikulum Hukum."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Bahasa Indonesia dan PKn di atas rata-rata mencerminkan pemahaman yang baik tentang norma dan regulasi."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada isu keadilan sosial dan kebijakan publik selaras dengan visi jurusan Hukum."}] },

  { key:"desain", nama:"Desain Komunikasi Visual", emoji:"🎨", color:"#ec4899", light:"#fdf4ff", durasi:"4 Tahun", kategori:"Seni & Desain",
    deskripsi:"DKV membekali kamu dengan kemampuan merancang komunikasi visual yang efektif — dari brand identity, ilustrasi, motion graphics, hingga kampanye digital yang mampu menggerakkan audiens.",
    pelajari:[{icon:"🖌️",label:"Desain Grafis"},{icon:"📱",label:"UI/UX Digital"},{icon:"🎬",label:"Motion Graphics"},{icon:"📸",label:"Fotografi"},{icon:"🎭",label:"Branding"},{icon:"🖼️",label:"Ilustrasi"}],
    kompetensi:[{label:"Kreativitas",val:95},{label:"Estetika",val:92},{label:"Komunikasi",val:85},{label:"Teknikal",val:80},{label:"Konseptual",val:90}],
    kompetensiAI:"DKV sangat cocok untuk siswa yang memiliki selera estetika tinggi, kemampuan bercerita visual, dan antusiasme terhadap tren desain global.",
    mapelPendukung:[{nama:"Seni Budaya",bintang:5},{nama:"Bahasa Indonesia",bintang:4},{nama:"Informatika",bintang:4},{nama:"Bahasa Inggris",bintang:3}],
    mapelAI:"Kemampuan berkarya di Seni Budaya dan memahami literasi digital menjadi bekal yang sangat berguna di dunia desain modern.",
    karier:[{nama:"Graphic Designer",bintang:5,gaji:"Rp 5–18 juta/bln"},{nama:"UI/UX Designer",bintang:5,gaji:"Rp 8–25 juta/bln"},{nama:"Creative Director",bintang:4,gaji:"Rp 15–40 juta/bln"},{nama:"Motion Designer",bintang:4,gaji:"Rp 8–20 juta/bln"},{nama:"Brand Strategist",bintang:4,gaji:"Rp 8–22 juta/bln"}],
    universitas:[{nama:"ITB",match:93,akreditasi:"Unggul",jalur:["SNBP","SNBT","Mandiri"],kota:"Bandung"},{nama:"IKJ",match:89,akreditasi:"Baik Sekali",jalur:["Mandiri"],kota:"Jakarta"},{nama:"UNTAR",match:84,akreditasi:"Baik Sekali",jalur:["Mandiri"],kota:"Jakarta"},{nama:"UMN",match:82,akreditasi:"Baik Sekali",jalur:["Mandiri"],kota:"Tangerang"}],
    uniAI:"Program DKV di ITB diakui sebagai yang terbaik di Indonesia, memadukan tradisi seni dengan inovasi desain digital.",
    alumni:[{nama:"Tim Desain Jenius",univ:"ITB",jurusan:"DKV",quote:"Desain yang baik bukan tentang membuatnya cantik — melainkan tentang membuatnya benar dan bermakna.",aiNote:"Lulusan DKV Indonesia telah menembus industri kreatif global, bekerja di studio desain internasional dan perusahaan teknologi Fortune 500.",foto:"👩‍🎨"}],
    serupa:[{key:"arsitektur",nama:"Arsitektur",alasan:["Desain","Spasial","Kreatif"]},{key:"film",nama:"Film & Televisi",alasan:["Narasi Visual","Kreatif","Teknologi"]}],
    serupaAI:"Jika kamu ingin mengeksplorasi lebih jauh dunia kreatif visual, jurusan-jurusan ini menawarkan spesialisasi berbeda yang sama menariknya.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan berpikir konseptual dan estetika visualmu adalah aset utama yang sangat dibutuhkan di DKV."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Prestasi di Seni Budaya dan portofolio karya menunjukkan potensi kreatif yang menjanjikan."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada desain dan komunikasi visual selaras dengan semangat yang dibutuhkan di industri kreatif."}] },
];

type JurusanCard = { key: string; nama: string; deskripsi: string; emoji: string; kategori: string; ptnCount: number; ptsCount: number; };

const ALL_JURUSAN: JurusanCard[] = [
  { key:"si",         nama:"Sistem Informasi",          deskripsi:"Menghubungkan teknologi dengan kebutuhan bisnis organisasi",          emoji:"💻", kategori:"Teknologi",              ptnCount:78,  ptsCount:142 },
  { key:"informatika",nama:"Informatika",                deskripsi:"Merancang perangkat lunak, algoritma, dan kecerdasan buatan",          emoji:"🖥️", kategori:"Teknologi",              ptnCount:65,  ptsCount:120 },
  { key:"ds",         nama:"Data Science",               deskripsi:"Mengolah data menjadi keputusan bisnis yang bernilai",                 emoji:"📊", kategori:"Teknologi",              ptnCount:42,  ptsCount:80  },
  { key:"tekkom",     nama:"Teknik Komputer",            deskripsi:"Merancang perangkat keras dan sistem tertanam modern",                emoji:"⚙️", kategori:"Teknologi",              ptnCount:55,  ptsCount:95  },
  { key:"siber",      nama:"Keamanan Siber",             deskripsi:"Melindungi sistem informasi dari ancaman siber",                      emoji:"🔒", kategori:"Teknologi",              ptnCount:28,  ptsCount:60  },
  { key:"rpla",       nama:"Rekayasa Perangkat Lunak",   deskripsi:"Membangun software berkualitas tinggi secara sistematis",             emoji:"🛠️", kategori:"Teknologi",              ptnCount:38,  ptsCount:75  },
  { key:"pend-mat",   nama:"Pendidikan Matematika",      deskripsi:"Mempersiapkan guru Matematika yang profesional dan inovatif",         emoji:"📐", kategori:"Pendidikan",             ptnCount:95,  ptsCount:180 },
  { key:"pend-eng",   nama:"Pendidikan Bahasa Inggris",  deskripsi:"Mencetak pendidik bahasa Inggris yang komunikatif dan kompeten",      emoji:"📝", kategori:"Pendidikan",             ptnCount:88,  ptsCount:175 },
  { key:"pend-bio",   nama:"Pendidikan Biologi",         deskripsi:"Membekali calon guru Biologi dengan ilmu dan metode terbaik",         emoji:"🌿", kategori:"Pendidikan",             ptnCount:72,  ptsCount:140 },
  { key:"pgsd",       nama:"PGSD",                       deskripsi:"Mendidik guru SD yang kreatif, sabar, dan berdedikasi",               emoji:"🏫", kategori:"Pendidikan",             ptnCount:110, ptsCount:200 },
  { key:"pend-ips",   nama:"Pendidikan IPS",             deskripsi:"Menyiapkan pendidik yang membangun kesadaran sosial siswa",           emoji:"🗺️", kategori:"Pendidikan",             ptnCount:65,  ptsCount:130 },
  { key:"kedokteran", nama:"Kedokteran",                 deskripsi:"Menyembuhkan penyakit dan meningkatkan kesehatan masyarakat",         emoji:"🩺", kategori:"Kedokteran & Kesehatan", ptnCount:23,  ptsCount:45  },
  { key:"gigi",       nama:"Kedokteran Gigi",            deskripsi:"Merawat kesehatan gigi dan mulut untuk kualitas hidup lebih baik",    emoji:"🦷", kategori:"Kedokteran & Kesehatan", ptnCount:18,  ptsCount:32  },
  { key:"farmasi",    nama:"Farmasi",                    deskripsi:"Mengembangkan dan memastikan keamanan penggunaan obat-obatan",         emoji:"💊", kategori:"Kedokteran & Kesehatan", ptnCount:35,  ptsCount:75  },
  { key:"keperawatan",nama:"Keperawatan",                deskripsi:"Memberikan perawatan profesional kepada pasien dengan empati",         emoji:"🏥", kategori:"Kedokteran & Kesehatan", ptnCount:48,  ptsCount:120 },
  { key:"gizi",       nama:"Ilmu Gizi",                  deskripsi:"Mengoptimalkan kesehatan masyarakat melalui ilmu nutrisi",             emoji:"🥗", kategori:"Kedokteran & Kesehatan", ptnCount:38,  ptsCount:80  },
  { key:"sipil",      nama:"Teknik Sipil",               deskripsi:"Merancang dan membangun infrastruktur yang kokoh dan berkelanjutan",   emoji:"🏗️", kategori:"Teknik",                 ptnCount:88,  ptsCount:160 },
  { key:"mesin",      nama:"Teknik Mesin",               deskripsi:"Merancang mesin dan sistem mekanik untuk berbagai industri",           emoji:"🔧", kategori:"Teknik",                 ptnCount:75,  ptsCount:140 },
  { key:"elektro",    nama:"Teknik Elektro",             deskripsi:"Mengembangkan sistem kelistrikan, elektronika, dan otomasi",           emoji:"⚡", kategori:"Teknik",                 ptnCount:70,  ptsCount:130 },
  { key:"kimia-tek",  nama:"Teknik Kimia",               deskripsi:"Merancang proses produksi bahan kimia dan material industri",          emoji:"🧪", kategori:"Teknik",                 ptnCount:45,  ptsCount:80  },
  { key:"industri",   nama:"Teknik Industri",            deskripsi:"Mengoptimalkan sistem produksi dan operasional di dunia industri",     emoji:"🏭", kategori:"Teknik",                 ptnCount:55,  ptsCount:110 },
  { key:"manajemen",  nama:"Manajemen",                  deskripsi:"Mengelola organisasi dan sumber daya untuk mencapai tujuan bisnis",    emoji:"📈", kategori:"Bisnis",                 ptnCount:120, ptsCount:280 },
  { key:"akuntansi",  nama:"Akuntansi",                  deskripsi:"Mencatat dan menganalisis informasi keuangan organisasi",              emoji:"🧾", kategori:"Bisnis",                 ptnCount:105, ptsCount:250 },
  { key:"ekonomi",    nama:"Ilmu Ekonomi",               deskripsi:"Memahami mekanisme pasar, kebijakan, dan perilaku ekonomi",            emoji:"💹", kategori:"Bisnis",                 ptnCount:80,  ptsCount:160 },
  { key:"bisnis-int", nama:"Bisnis Internasional",       deskripsi:"Mengelola strategi bisnis di pasar global yang kompetitif",            emoji:"🌐", kategori:"Bisnis",                 ptnCount:40,  ptsCount:90  },
  { key:"hukum",      nama:"Ilmu Hukum",                 deskripsi:"Memahami sistem hukum dan keadilan yang mengatur masyarakat",          emoji:"⚖️", kategori:"Hukum",                  ptnCount:72,  ptsCount:150 },
  { key:"hukum-bis",  nama:"Hukum Bisnis",               deskripsi:"Menguasai regulasi dan perjanjian di dunia bisnis dan korporasi",      emoji:"📜", kategori:"Hukum",                  ptnCount:35,  ptsCount:80  },
  { key:"notariat",   nama:"Kenotariatan",               deskripsi:"Menyelenggarakan akta otentik dan layanan hukum kenotariatan",          emoji:"🏛️", kategori:"Hukum",                  ptnCount:22,  ptsCount:55  },
  { key:"ilkom",      nama:"Ilmu Komunikasi",            deskripsi:"Mengembangkan strategi komunikasi efektif di berbagai media",           emoji:"📡", kategori:"Sosial Humaniora",        ptnCount:68,  ptsCount:145 },
  { key:"psikologi",  nama:"Psikologi",                  deskripsi:"Memahami perilaku manusia dan memberikan layanan kesehatan mental",    emoji:"🧠", kategori:"Sosial Humaniora",        ptnCount:55,  ptsCount:130 },
  { key:"hub-int",    nama:"Hubungan Internasional",     deskripsi:"Menganalisis diplomasi, kebijakan luar negeri, dan isu global",        emoji:"🌍", kategori:"Sosial Humaniora",        ptnCount:42,  ptsCount:90  },
  { key:"sosiologi",  nama:"Sosiologi",                  deskripsi:"Mengkaji fenomena sosial, budaya, dan perubahan masyarakat",           emoji:"👥", kategori:"Sosial Humaniora",        ptnCount:38,  ptsCount:75  },
  { key:"desain",     nama:"Desain Komunikasi Visual",   deskripsi:"Merancang komunikasi visual yang efektif dan berdampak tinggi",        emoji:"🎨", kategori:"Seni & Desain",          ptnCount:32,  ptsCount:85  },
  { key:"arsitektur", nama:"Arsitektur",                 deskripsi:"Merancang bangunan yang fungsional, estetis, dan berkelanjutan",       emoji:"🏛️", kategori:"Seni & Desain",          ptnCount:45,  ptsCount:100 },
  { key:"musik",      nama:"Seni Musik",                 deskripsi:"Mengembangkan kemampuan bermusik dan apresiasi seni secara mendalam",  emoji:"🎵", kategori:"Seni & Desain",          ptnCount:28,  ptsCount:60  },
  { key:"film",       nama:"Film & Televisi",            deskripsi:"Memproduksi karya audiovisual yang kreatif dan bermakna",              emoji:"🎬", kategori:"Seni & Desain",          ptnCount:22,  ptsCount:55  },
  { key:"agro",       nama:"Agroteknologi",              deskripsi:"Mengembangkan teknologi pertanian untuk ketahanan pangan",             emoji:"🌾", kategori:"Pertanian",              ptnCount:62,  ptsCount:110 },
  { key:"agribis",    nama:"Agribisnis",                 deskripsi:"Mengelola usaha pertanian secara modern dan menguntungkan",            emoji:"🚜", kategori:"Pertanian",              ptnCount:55,  ptsCount:100 },
  { key:"peternakan", nama:"Peternakan",                 deskripsi:"Mengembangkan teknologi budidaya ternak yang berkelanjutan",           emoji:"🐄", kategori:"Pertanian",              ptnCount:40,  ptsCount:70  },
  { key:"perikanan",  nama:"Perikanan",                  deskripsi:"Mengelola sumber daya perairan dan industri kelautan",                 emoji:"🐟", kategori:"Pertanian",              ptnCount:38,  ptsCount:65  },
];

const KAT_CONFIG = [
  { key:"Semua",                  emoji:"🎓", color:BLUE         },
  { key:"Teknologi",              emoji:"💻", color:"#0965fa"    },
  { key:"Pendidikan",             emoji:"📚", color:"#22c55e"    },
  { key:"Kedokteran & Kesehatan", emoji:"🩺", color:"#ef4444"    },
  { key:"Teknik",                 emoji:"🔧", color:"#f59e0b"    },
  { key:"Bisnis",                 emoji:"💼", color:"#8b5cf6"    },
  { key:"Hukum",                  emoji:"⚖️", color:"#f1ad00"    },
  { key:"Sosial Humaniora",       emoji:"🌍", color:"#00b2dd"    },
  { key:"Seni & Desain",          emoji:"🎨", color:"#ec4899"    },
  { key:"Pertanian",              emoji:"🌾", color:"#10b981"    },
];

const AI_RECS_PTN = ALL_JURUSAN.filter(j => ["si","informatika","ds"].includes(j.key));
const AI_ALASAN_PTN: Record<string,string[]> = {
  si:          ["Kemampuan Analitik","Problem Solving","Tech & Business"],
  informatika: ["Logika Tinggi","Pemrograman","Tech Enthusiast"],
  ds:          ["Matematika Kuat","Data Driven","Analitik"],
};

// ═══════════════════════════════════════════════════════════════════════════════
// KEDINASAN DATA
// ═══════════════════════════════════════════════════════════════════════════════

type KdCard = { key: string; nama: string; singkatan: string; deskripsi: string; emoji: string; kategori: string; jumlahProdi: number; ikatanDinas: boolean; durasi?: string; };

type KdDetail = {
  key: string; nama: string; singkatan: string; emoji: string;
  color: string; light: string; deskripsi: string; durasi: string;
  ikatanDinas: boolean; lokasi: string;
  prodi: string[];
  kompetensi: { label: string; val: number }[]; kompetensiAI: string;
  mapelPendukung: { nama: string; bintang: number }[]; mapelAI: string;
  seleksi: string[];
  karier: { nama: string; instansi: string }[];
  whyChooseAI: string;
  serupa: { key: string; nama: string; alasan: string[] }[]; serupaAI: string;
  evidenceCards: { icon: string; title: string; desc: string }[];
};

const ALL_KEDINASAN: KdCard[] = [
  { key:"stan",    nama:"Politeknik Keuangan Negara STAN",       singkatan:"PKN STAN",  deskripsi:"Mencetak aparatur keuangan negara yang profesional dan berintegritas",          emoji:"🏦", kategori:"Keuangan Negara", jumlahProdi:7,  ikatanDinas:true  },
  { key:"stis",    nama:"Politeknik Statistika STIS",            singkatan:"STIS",      deskripsi:"Mendidik ahli statistik dan data untuk kebutuhan data nasional",                emoji:"📊", kategori:"Statistika",       jumlahProdi:2,  ikatanDinas:true  },
  { key:"stmkg",   nama:"Sekolah Tinggi Meteorologi Klimatologi dan Geofisika", singkatan:"STMKG", deskripsi:"Mempersiapkan ahli cuaca, iklim, dan geofisika untuk BMKG",      emoji:"🌦️", kategori:"Meteorologi",       jumlahProdi:4,  ikatanDinas:true  },
  { key:"poltekim",nama:"Politeknik Imigrasi",                   singkatan:"Poltekim",  deskripsi:"Mendidik petugas imigrasi yang profesional untuk pengawasan perbatasan",       emoji:"🛂", kategori:"Imigrasi",          jumlahProdi:3,  ikatanDinas:true  },
  { key:"ipdn",    nama:"Institut Pemerintahan Dalam Negeri",    singkatan:"IPDN",      deskripsi:"Mencetak aparatur pemerintahan daerah yang kompeten dan berintegritas",        emoji:"🏛️", kategori:"Pemerintahan",      jumlahProdi:5,  ikatanDinas:true  },
  { key:"sttd",    nama:"Sekolah Tinggi Transportasi Darat",     singkatan:"STTD",      deskripsi:"Mendidik ahli transportasi darat dan manajemen lalu lintas",                   emoji:"🚌", kategori:"Transportasi",      jumlahProdi:3,  ikatanDinas:true  },
  { key:"ptik",    nama:"Perguruan Tinggi Ilmu Kepolisian",      singkatan:"PTIK",      deskripsi:"Mendidik perwira polisi yang profesional dan berwawasan akademis",             emoji:"👮", kategori:"Kepolisian",        jumlahProdi:1,  ikatanDinas:true  },
  { key:"akpol",   nama:"Akademi Kepolisian",                    singkatan:"AKPOL",     deskripsi:"Mendidik taruna menjadi perwira polisi yang berdedikasi",                      emoji:"🚓", kategori:"Kepolisian",        jumlahProdi:1,  ikatanDinas:true  },
  { key:"akmil",   nama:"Akademi Militer",                       singkatan:"AKMIL",     deskripsi:"Mendidik taruna menjadi perwira TNI AD yang tangguh dan berwibawa",           emoji:"🎖️", kategori:"Militer",           jumlahProdi:1,  ikatanDinas:true  },
  { key:"polkes",  nama:"Politeknik Kesehatan Kemenkes",         singkatan:"Poltekkes", deskripsi:"Mendidik tenaga kesehatan profesional untuk pelayanan publik",                 emoji:"🏥", kategori:"Kesehatan",         jumlahProdi:12, ikatanDinas:false },
];

const KD_KAT_CONFIG = [
  { key:"Semua",          emoji:"🏛️", color:GREEN      },
  { key:"Keuangan Negara",emoji:"🏦", color:"#059669"  },
  { key:"Statistika",     emoji:"📊", color:"#0d9488"  },
  { key:"Meteorologi",    emoji:"🌦️", color:"#0891b2"  },
  { key:"Imigrasi",       emoji:"🛂", color:"#7c3aed"  },
  { key:"Pemerintahan",   emoji:"🏛️", color:"#b45309"  },
  { key:"Transportasi",   emoji:"🚌", color:"#0284c7"  },
  { key:"Kepolisian",     emoji:"👮", color:"#1d4ed8"  },
  { key:"Militer",        emoji:"🎖️", color:"#92400e"  },
  { key:"Kesehatan",      emoji:"🏥", color:"#be185d"  },
];

const KD_DETAIL_DB: KdDetail[] = [
  {
    key:"stan", nama:"Politeknik Keuangan Negara STAN", singkatan:"PKN STAN", emoji:"🏦",
    color:"#059669", light:"#ecfdf5", deskripsi:"PKN STAN adalah sekolah kedinasan di bawah Kementerian Keuangan yang mendidik aparatur keuangan negara berkualitas tinggi. Lulusan langsung ditempatkan di instansi Kemenkeu dan lembaga terkait.",
    durasi:"3–4 Tahun", ikatanDinas:true, lokasi:"Bintaro, Tangerang Selatan",
    prodi:["D-IV Akuntansi","D-IV Manajemen Keuangan","D-IV Manajemen Aset","D-III Akuntansi","D-III Pajak","D-III Kepabeanan & Cukai","D-III Kebendaharaan Negara"],
    kompetensi:[{label:"Berpikir Logis",val:95},{label:"Numerik",val:93},{label:"Kedisiplinan",val:90},{label:"Komunikasi",val:75},{label:"Integritas",val:95}],
    kompetensiAI:"PKN STAN membutuhkan kemampuan numerik dan analitik yang kuat, serta komitmen tinggi pada integritas karena lulusan mengelola keuangan negara.",
    mapelPendukung:[{nama:"Matematika",bintang:5},{nama:"Ekonomi",bintang:5},{nama:"Bahasa Inggris",bintang:4},{nama:"Akuntansi",bintang:4}],
    mapelAI:"Penguasaan Matematika dan Ekonomi akan sangat membantu dalam mengikuti proses pembelajaran di PKN STAN yang padat hitungan dan analisis keuangan.",
    seleksi:["Registrasi Online","Seleksi Administrasi","SKD (Seleksi Kompetensi Dasar)","Tes Akademik","Tes Kesehatan & Kebugaran","Wawancara","Pengumuman Final"],
    karier:[{nama:"Direktorat Jenderal Pajak",instansi:"Kementerian Keuangan"},{nama:"Direktorat Jenderal Bea & Cukai",instansi:"Kementerian Keuangan"},{nama:"DJPB / Perbendaharaan",instansi:"Kementerian Keuangan"},{nama:"DJKN / Kekayaan Negara",instansi:"Kementerian Keuangan"},{nama:"BPK RI",instansi:"Badan Pemeriksa Keuangan"}],
    whyChooseAI:"PKN STAN adalah pilihan ideal jika kamu tertarik bidang keuangan negara, memiliki kemampuan numerik yang baik, dan ingin berkarier di instansi pemerintah dengan jaminan kerja langsung setelah lulus.",
    serupa:[{key:"stis",nama:"STIS",alasan:["Analitik Data","Matematika","Pemerintahan"]},{key:"ipdn",nama:"IPDN",alasan:["Pelayanan Publik","Kepemimpinan","Pemerintahan"]},{key:"stmkg",nama:"STMKG",alasan:["Sains","Teknikal","Pemerintahan"]}],
    serupaAI:"Jika kamu tertarik dengan karier di pemerintahan tetapi ingin eksplorasi bidang lain, sekolah-sekolah ini menawarkan prospek serupa dengan fokus berbeda.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan numerik dan analitikmu selaras dengan tuntutan akademik PKN STAN yang berfokus pada keuangan negara."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Matematika dan Ekonomi yang solid adalah fondasi utama untuk sukses di PKN STAN."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada pengelolaan keuangan dan pelayanan negara cocok dengan misi PKN STAN."}],
  },
  {
    key:"stis", nama:"Politeknik Statistika STIS", singkatan:"STIS", emoji:"📊",
    color:"#0d9488", light:"#f0fdfa", deskripsi:"STIS adalah sekolah kedinasan di bawah BPS (Badan Pusat Statistik) yang mendidik ahli statistik dan data untuk mendukung kebutuhan data nasional Indonesia.",
    durasi:"4 Tahun", ikatanDinas:true, lokasi:"Jakarta Timur",
    prodi:["D-IV Statistika","D-IV Komputasi Statistik"],
    kompetensi:[{label:"Matematika",val:95},{label:"Statistika",val:95},{label:"Pemrograman",val:80},{label:"Analitik",val:92},{label:"Kedisiplinan",val:88}],
    kompetensiAI:"STIS sangat cocok untuk siswa yang mencintai angka, statistika, dan analisis data. Lulusan akan bekerja langsung di BPS dan instansi pemerintah yang membutuhkan data.",
    mapelPendukung:[{nama:"Matematika",bintang:5},{nama:"Statistika",bintang:5},{nama:"Informatika",bintang:4},{nama:"Bahasa Inggris",bintang:3}],
    mapelAI:"Matematika adalah kunci utama di STIS. Penguasaan konsep statistik dasar di SMA akan sangat membantu adaptasi di perkuliahan.",
    seleksi:["Registrasi Online","Seleksi Administrasi","Ujian Tulis (Matematika & Bahasa Inggris)","Tes Kesehatan","Wawancara","Pengumuman Final"],
    karier:[{nama:"Fungsional Statistisi",instansi:"Badan Pusat Statistik (BPS)"},{nama:"Analis Data Nasional",instansi:"Kementerian/Lembaga"},{nama:"Data Scientist Pemerintah",instansi:"Instansi Pusat & Daerah"},{nama:"Peneliti Statistik",instansi:"Lembaga Riset Pemerintah"}],
    whyChooseAI:"STIS adalah pilihan terbaik jika kamu ingin berkarier sebagai ahli data di pemerintahan. Ikatan dinas langsung ke BPS memberi kepastian karier yang jelas dengan tunjangan kompetitif.",
    serupa:[{key:"stan",nama:"PKN STAN",alasan:["Keuangan","Numerik","Pemerintahan"]},{key:"stmkg",nama:"STMKG",alasan:["Sains","Analitik","Pemerintahan"]},{key:"ipdn",nama:"IPDN",alasan:["Pelayanan Publik","Kepemimpinan","Pemerintahan"]}],
    serupaAI:"Jika kamu tertarik pada karier di pemerintahan dengan nuansa yang berbeda, sekolah-sekolah ini layak untuk dijelajahi lebih lanjut.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan matematika dan analitikmu sangat sesuai dengan kurikulum STIS yang padat statistika dan komputasi."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Matematika tinggi adalah indikator kuat kesiapanmu untuk menjalani perkuliahan di STIS."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada data dan analisis mendalam selaras dengan misi STIS dalam menyediakan data nasional."}],
  },
  {
    key:"stmkg", nama:"Sekolah Tinggi Meteorologi Klimatologi dan Geofisika", singkatan:"STMKG", emoji:"🌦️",
    color:"#0891b2", light:"#ecfeff", deskripsi:"STMKG di bawah BMKG mendidik ahli cuaca, iklim, dan geofisika yang bertugas memantau kondisi atmosfer, gempa bumi, dan potensi bencana alam di Indonesia.",
    durasi:"4 Tahun", ikatanDinas:true, lokasi:"Jakarta Pusat",
    prodi:["D-IV Meteorologi","D-IV Klimatologi","D-IV Geofisika","D-IV Instrumentasi"],
    kompetensi:[{label:"Fisika",val:95},{label:"Matematika",val:92},{label:"Analitik",val:88},{label:"Ketelitian",val:90},{label:"Teknologi",val:85}],
    kompetensiAI:"STMKG ideal untuk siswa yang mencintai sains alam, khususnya fisika atmosfer dan bumi. Lulusan berperan penting dalam sistem peringatan dini bencana nasional.",
    mapelPendukung:[{nama:"Fisika",bintang:5},{nama:"Matematika",bintang:5},{nama:"Geografi",bintang:4},{nama:"Kimia",bintang:3}],
    mapelAI:"Fisika adalah fondasi utama di STMKG. Semakin kuat penguasaan fisika dan matematikamu, semakin mudah mengikuti kuliah di sini.",
    seleksi:["Registrasi Online","Seleksi Administrasi","SKD (TKD & TPA)","Tes Kemampuan Akademik (Matematika & Fisika)","Tes Kesehatan & Kebugaran","Wawancara","Pengumuman Final"],
    karier:[{nama:"Prakirawan Cuaca",instansi:"BMKG"},{nama:"Analis Gempa Bumi",instansi:"BMKG"},{nama:"Ahli Klimatologi",instansi:"BMKG / Lembaga Riset"},{nama:"Teknisi Instrumentasi Meteorologi",instansi:"BMKG"},{nama:"Peneliti Geofisika",instansi:"BRIN"}],
    whyChooseAI:"STMKG adalah pilihan unik yang menggabungkan sains murni dengan pengabdian negara. Lulusannya berkontribusi langsung pada keselamatan jutaan warga melalui sistem prakiraan cuaca dan peringatan bencana.",
    serupa:[{key:"stan",nama:"PKN STAN",alasan:["Keuangan","Numerik","Pemerintahan"]},{key:"stis",nama:"STIS",alasan:["Data","Analitik","Pemerintahan"]},{key:"poltekim",nama:"Poltekim",alasan:["Kedinasan","Pelayanan","Kedisiplinan"]}],
    serupaAI:"Jika kamu menyukai sains tetapi ingin eksplorasi jalur kedinasan lain, sekolah-sekolah ini menawarkan karier pemerintahan yang sama menariknya.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Kemampuan analitik dan kecintaanmu pada sains alam sangat selaras dengan kurikulum STMKG."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Fisika dan Matematika yang kuat adalah prasyarat utama keberhasilan di STMKG."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada fenomena alam dan teknologi pemantauan cocok sempurna dengan misi BMKG."}],
  },
  {
    key:"poltekim", nama:"Politeknik Imigrasi", singkatan:"Poltekim", emoji:"🛂",
    color:"#7c3aed", light:"#f5f3ff", deskripsi:"Poltekim di bawah Kemenkumham mendidik petugas imigrasi yang profesional untuk mengawasi pergerakan orang dan dokumen keimigrasian di perbatasan negara.",
    durasi:"4 Tahun", ikatanDinas:true, lokasi:"Depok, Jawa Barat",
    prodi:["D-IV Hukum Keimigrasian","D-IV Administrasi Keimigrasian","D-IV Manajemen Teknologi Keimigrasian"],
    kompetensi:[{label:"Kedisiplinan",val:95},{label:"Komunikasi",val:88},{label:"Hukum & Regulasi",val:85},{label:"Teknologi",val:78},{label:"Integritas",val:95}],
    kompetensiAI:"Poltekim cocok untuk siswa yang disiplin, tegas, dan tertarik pada hukum keimigrasian serta pengawasan perbatasan. Dibutuhkan komitmen tinggi pada integritas.",
    mapelPendukung:[{nama:"Bahasa Inggris",bintang:5},{nama:"PKn",bintang:5},{nama:"Bahasa Indonesia",bintang:4},{nama:"Matematika",bintang:3}],
    mapelAI:"Kemampuan berbahasa Inggris dan pemahaman hukum dasar sangat penting karena petugas imigrasi berinteraksi dengan warga negara asing setiap harinya.",
    seleksi:["Registrasi Online","Seleksi Administrasi","SKD","Tes Kemampuan Bahasa Inggris","Tes Kesehatan & Kebugaran Jasmani","Psikotes & Wawancara","Pengumuman Final"],
    karier:[{nama:"Petugas Imigrasi",instansi:"Direktorat Jenderal Imigrasi"},{nama:"Penyidik Keimigrasian",instansi:"Kemenkumham"},{nama:"Pengelola Paspor & Visa",instansi:"Kantor Imigrasi"},{nama:"Analis Teknologi Imigrasi",instansi:"Pusat TI Imigrasi"}],
    whyChooseAI:"Poltekim adalah pilihan yang tepat jika kamu ingin berkarier di bidang keamanan negara, suka berinteraksi dengan berbagai bangsa, dan memiliki jiwa yang disiplin serta tegas.",
    serupa:[{key:"ipdn",nama:"IPDN",alasan:["Pelayanan Publik","Kepemimpinan","Pemerintahan"]},{key:"stan",nama:"PKN STAN",alasan:["Keuangan","Numerik","Pemerintahan"]},{key:"ptik",nama:"PTIK",alasan:["Keamanan","Hukum","Kedisiplinan"]}],
    serupaAI:"Jika kamu tertarik pada aspek keamanan dan pelayanan publik yang lebih luas, sekolah-sekolah ini menawarkan jalur karier yang setara.",
    evidenceCards:[{icon:"🧠",title:"Kesesuaian Kekuatan",desc:"Jiwa disiplin dan kemampuan komunikasimu selaras dengan tuntutan profesi petugas imigrasi."},{icon:"📚",title:"Kesesuaian Akademik",desc:"Nilai Bahasa Inggris dan PKn yang baik menunjukkan kesiapan untuk memahami regulasi keimigrasian."},{icon:"🎯",title:"Kesesuaian Minat",desc:"Ketertarikanmu pada keamanan negara dan interaksi lintas budaya sangat cocok dengan misi Poltekim."}],
  },
];

const AI_RECS_KD = ALL_KEDINASAN.filter(k => ["stan","stis","stmkg"].includes(k.key));
const AI_ALASAN_KD: Record<string,string[]> = {
  stan:    ["Analitik Kuat","Matematika","Financial Interest"],
  stis:    ["Data & Statistik","Matematika","Analytical Thinking"],
  stmkg:   ["Fisika Kuat","Sains","Problem Solving"],
};

// ─── Extended University Database (PTN + PTS per jurusan) ─────────────────────
type UniEntry = { nama: string; kota: string; tipe: "PTN" | "PTS" };
const UNI_DB: Record<string, UniEntry[]> = {
  si: [
    { nama:"Universitas Indonesia",     kota:"Depok",      tipe:"PTN" },
    { nama:"Universitas Gadjah Mada",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Institut Teknologi Sepuluh Nopember", kota:"Surabaya", tipe:"PTN" },
    { nama:"Universitas Padjadjaran",   kota:"Bandung",    tipe:"PTN" },
    { nama:"Universitas Brawijaya",     kota:"Malang",     tipe:"PTN" },
    { nama:"Universitas Airlangga",     kota:"Surabaya",   tipe:"PTN" },
    { nama:"BINUS University",          kota:"Jakarta",    tipe:"PTS" },
    { nama:"Universitas Telkom",        kota:"Bandung",    tipe:"PTS" },
    { nama:"Universitas Ciputra",       kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Surabaya",      kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Atma Jaya",     kota:"Jakarta",    tipe:"PTS" },
  ],
  informatika: [
    { nama:"Institut Teknologi Bandung",kota:"Bandung",    tipe:"PTN" },
    { nama:"Universitas Indonesia",     kota:"Depok",      tipe:"PTN" },
    { nama:"Universitas Gadjah Mada",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Institut Teknologi Sepuluh Nopember", kota:"Surabaya", tipe:"PTN" },
    { nama:"Universitas Brawijaya",     kota:"Malang",     tipe:"PTN" },
    { nama:"Universitas Airlangga",     kota:"Surabaya",   tipe:"PTN" },
    { nama:"Universitas Telkom",        kota:"Bandung",    tipe:"PTS" },
    { nama:"BINUS University",          kota:"Jakarta",    tipe:"PTS" },
    { nama:"Universitas Ciputra",       kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Petra",         kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Surabaya",      kota:"Surabaya",   tipe:"PTS" },
  ],
  ds: [
    { nama:"Universitas Indonesia",     kota:"Depok",      tipe:"PTN" },
    { nama:"Institut Teknologi Bandung",kota:"Bandung",    tipe:"PTN" },
    { nama:"Institut Teknologi Sepuluh Nopember", kota:"Surabaya", tipe:"PTN" },
    { nama:"Universitas Airlangga",     kota:"Surabaya",   tipe:"PTN" },
    { nama:"Universitas Gadjah Mada",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Universitas Telkom",        kota:"Bandung",    tipe:"PTS" },
    { nama:"BINUS University",          kota:"Jakarta",    tipe:"PTS" },
    { nama:"Universitas Ciputra",       kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Surabaya",      kota:"Surabaya",   tipe:"PTS" },
  ],
  kedokteran: [
    { nama:"Universitas Indonesia",     kota:"Jakarta",    tipe:"PTN" },
    { nama:"Universitas Gadjah Mada",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Universitas Airlangga",     kota:"Surabaya",   tipe:"PTN" },
    { nama:"Universitas Brawijaya",     kota:"Malang",     tipe:"PTN" },
    { nama:"Universitas Diponegoro",    kota:"Semarang",   tipe:"PTN" },
    { nama:"Universitas Katolik Widya Mandala", kota:"Surabaya", tipe:"PTS" },
    { nama:"Universitas Hang Tuah",     kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Wijaya Kusuma", kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Atma Jaya",     kota:"Jakarta",    tipe:"PTS" },
  ],
  hukum: [
    { nama:"Universitas Indonesia",     kota:"Depok",      tipe:"PTN" },
    { nama:"Universitas Gadjah Mada",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Universitas Airlangga",     kota:"Surabaya",   tipe:"PTN" },
    { nama:"Universitas Brawijaya",     kota:"Malang",     tipe:"PTN" },
    { nama:"Universitas Diponegoro",    kota:"Semarang",   tipe:"PTN" },
    { nama:"Universitas Surabaya",      kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Petra",         kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Atmajaya",      kota:"Jakarta",    tipe:"PTS" },
    { nama:"Universitas Pelita Harapan",kota:"Tangerang",  tipe:"PTS" },
  ],
  dkv: [
    { nama:"Institut Teknologi Bandung",kota:"Bandung",    tipe:"PTN" },
    { nama:"Institut Seni Indonesia",   kota:"Yogyakarta", tipe:"PTN" },
    { nama:"Universitas Negeri Surabaya",kota:"Surabaya",  tipe:"PTN" },
    { nama:"Universitas Sebelas Maret", kota:"Solo",       tipe:"PTN" },
    { nama:"BINUS University",          kota:"Jakarta",    tipe:"PTS" },
    { nama:"Universitas Ciputra",       kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Petra",         kota:"Surabaya",   tipe:"PTS" },
    { nama:"Universitas Telkom",        kota:"Bandung",    tipe:"PTS" },
    { nama:"Universitas Surabaya",      kota:"Surabaya",   tipe:"PTS" },
  ],
};

// ─── Extended Alumni Database ──────────────────────────────────────────────────
type AlumniEntry = { nama: string; univ: string; bidang: string };
const ALUMNI_DB: Record<string, AlumniEntry[]> = {
  si: [
    { nama:"Nadiem Makarim",    univ:"Harvard Business School",    bidang:"Teknologi & Wirausaha" },
    { nama:"William Tanuwijaya",univ:"Universitas Bina Nusantara", bidang:"E-Commerce" },
    { nama:"Achmad Zaky",       univ:"Institut Teknologi Bandung", bidang:"Teknologi" },
    { nama:"Ferry Unardi",      univ:"Purdue University",          bidang:"Travel Tech" },
    { nama:"Diajeng Lestari",   univ:"Universitas Indonesia",      bidang:"Fashion Tech" },
    { nama:"Aldi Adrian Hartanto",univ:"Universitas Gadjah Mada",  bidang:"Fintech" },
    { nama:"Gibran Huzaifah",   univ:"Institut Teknologi Bandung", bidang:"AgriTech" },
  ],
  informatika: [
    { nama:"Kevin Aluwi",       univ:"University of Southern California", bidang:"Transportasi Digital" },
    { nama:"Aldi Haryopratomo", univ:"Universitas Indonesia",             bidang:"Fintech" },
    { nama:"Andre Soelistyo",   univ:"Monash University",                 bidang:"Investasi Teknologi" },
    { nama:"Yansen Kamto",      univ:"Universitas Indonesia",             bidang:"Startup Ekosistem" },
    { nama:"Rio Haryanto",      univ:"Institut Teknologi Bandung",        bidang:"Teknologi Olahraga" },
    { nama:"Hans Kwee",         univ:"Universitas Bina Nusantara",        bidang:"Keamanan Siber" },
  ],
  ds: [
    { nama:"Dian Siswarini",    univ:"Institut Teknologi Bandung",  bidang:"Telekomunikasi" },
    { nama:"Andi Silalahi",     univ:"Universitas Indonesia",       bidang:"Data & Analytics" },
    { nama:"Rinaldi Firmansyah",univ:"Universitas Gadjah Mada",     bidang:"Keuangan Digital" },
    { nama:"Wishnutama",        univ:"Universitas Trisakti",         bidang:"Media & Digital" },
    { nama:"Novi Widiastuti",   univ:"Institut Pertanian Bogor",    bidang:"Data Pertanian" },
  ],
  kedokteran: [
    { nama:"dr. Terawan Agus P.",univ:"Universitas Gadjah Mada",   bidang:"Radiologi & Kesehatan Publik" },
    { nama:"dr. Reisa Broto",   univ:"Universitas Indonesia",      bidang:"Komunikasi Kesehatan" },
    { nama:"dr. Boyke Dian",    univ:"Universitas Indonesia",      bidang:"Obstetri & Ginekologi" },
    { nama:"dr. Ari Fahrial",   univ:"Universitas Indonesia",      bidang:"Gastroenterologi" },
    { nama:"dr. Nadia Alaydrus",univ:"Universitas Airlangga",      bidang:"Dermatologi" },
  ],
  hukum: [
    { nama:"Mahfud MD",         univ:"Universitas Islam Indonesia", bidang:"Hukum Tata Negara" },
    { nama:"Yusril Ihza M.",    univ:"Universitas Indonesia",       bidang:"Hukum Konstitusi" },
    { nama:"Anis Baswedan",     univ:"Universitas Gadjah Mada",     bidang:"Kebijakan Publik" },
    { nama:"Todung M. Lubis",   univ:"Universitas Indonesia",       bidang:"Hukum HAM" },
    { nama:"Hotman Paris H.",   univ:"Universitas Sumatera Utara",  bidang:"Hukum Perdata" },
  ],
  dkv: [
    { nama:"Yorris Raweyai",    univ:"Institut Teknologi Bandung",  bidang:"Desain Grafis" },
    { nama:"Eka Gustiwana",     univ:"Institut Kesenian Jakarta",   bidang:"Musik & Visual" },
    { nama:"Reza Mustar",       univ:"Institut Teknologi Bandung",  bidang:"Animasi" },
    { nama:"Tita Larasati",     univ:"Institut Seni Indonesia",     bidang:"Ilustrasi" },
    { nama:"Arief Budiman",     univ:"Universitas Trisakti",        bidang:"Brand Design" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function JurusanPage() {
  const [mainTab, setMainTab] = useState<"ptn-pts"|"kedinasan">("ptn-pts");

  // PTN states
  const [ptnView, setPtnView]               = useState<"main"|"detail">("main");
  const [activeJurusan, setActiveJurusan]   = useState<JurusanCard|null>(null);
  const [ptnSearch, setPtnSearch]           = useState("");
  const [activeKat, setActiveKat]           = useState("Semua");
  const [savedKeys, setSavedKeys]           = useState<Set<string>>(new Set(["si"]));
  const [ptnAlumniIdx, setPtnAlumniIdx]     = useState(0);
  const [showCompare, setShowCompare]       = useState(false);
  const [uniFilter, setUniFilter]           = useState<"ptn"|"pts"|"surabaya">("ptn");
  const [showAllUni, setShowAllUni]         = useState(false);
  const [showAllAlumni, setShowAllAlumni]   = useState(false);

  // Kedinasan states
  const [kdView, setKdView]                 = useState<"main"|"detail">("main");
  const [activeKd, setActiveKd]             = useState<KdCard|null>(null);
  const [kdSearch, setKdSearch]             = useState("");
  const [kdKat, setKdKat]                   = useState("Semua");
  const [savedKdKeys, setSavedKdKeys]       = useState<Set<string>>(new Set());
  const [kdSeleksiStep, setKdSeleksiStep]   = useState(0);

  function toggleSave(key: string) { setSavedKeys(p => { const s=new Set(p); s.has(key)?s.delete(key):s.add(key); return s; }); }
  function toggleKdSave(key: string) { setSavedKdKeys(p => { const s=new Set(p); s.has(key)?s.delete(key):s.add(key); return s; }); }

  function openPtnDetail(card: JurusanCard) { setActiveJurusan(card); setPtnAlumniIdx(0); setPtnView("detail"); setUniFilter("ptn"); setShowAllUni(false); setShowAllAlumni(false); }
  function openKdDetail(card: KdCard) { setActiveKd(card); setKdSeleksiStep(0); setKdView("detail"); }

  const kdDisplayGroups = KD_KAT_CONFIG
    .filter(k => k.key !== "Semua")
    .filter(k => kdKat === "Semua" || k.key === kdKat)
    .map(kat => ({ ...kat, items: ALL_KEDINASAN.filter(j => {
      const q = kdSearch.toLowerCase();
      return j.kategori === kat.key && (!q || j.nama.toLowerCase().includes(q) || j.singkatan.toLowerCase().includes(q));
    })}))
    .filter(g => g.items.length > 0);

  const ptnDisplayGroups = KAT_CONFIG
    .filter(k => k.key !== "Semua")
    .filter(k => activeKat === "Semua" || k.key === activeKat)
    .map(kat => ({ ...kat, items: ALL_JURUSAN.filter(j => {
      const q = ptnSearch.toLowerCase();
      return j.kategori === kat.key && (!q || j.nama.toLowerCase().includes(q) || j.deskripsi.toLowerCase().includes(q));
    })}))
    .filter(g => g.items.length > 0);

  // ── KEDINASAN DETAIL ─────────────────────────────────────────────────────────
  if (mainTab === "kedinasan" && kdView === "detail" && activeKd) {
    const d = KD_DETAIL_DB.find(x => x.key === activeKd.key) ?? null;
    const saved = savedKdKeys.has(activeKd.key);
    const kat = KD_KAT_CONFIG.find(k => k.key === activeKd.kategori) ?? KD_KAT_CONFIG[0];

    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => setKdView("main")} className="w-8 h-8 rounded-xl bg-[#f0fdf4] flex items-center justify-center hover:bg-[#dcfce7]" style={{outline:"none"}}>
            <ArrowLeft size={14} className="text-[#374151]"/>
          </button>
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-[10px] text-[#9ca3af]" style={{fontFamily:PP}}>Kedinasan</span>
            <ChevronRight size={10} className="text-[#9ca3af]"/>
            <span className="text-[10px] font-medium" style={{color:kat.color,fontFamily:PP}}>{activeKd.singkatan}</span>
          </div>
          <button onClick={() => toggleKdSave(activeKd.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${saved?"bg-[#fef2f2] border-[#fecaca] text-[#ef4444]":"border-[rgba(0,0,0,0.1)] text-[#9ca3af] hover:border-[#ef4444]"}`}
            style={{fontFamily:PP,outline:"none"}}>
            <Heart size={12} fill={saved?"currentColor":"none"}/> {saved?"Tersimpan":"Simpan"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f0fdf4]">
          <div className="px-6 py-5 max-w-4xl mx-auto flex flex-col gap-5">

            {/* Overview */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-6 py-6 border-b border-[rgba(0,0,0,0.05)]" style={{background:`linear-gradient(135deg,${d?.light??"#f0fdf4"},white)`}}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{background:d?.light??"#f0fdf4"}}>
                    {activeKd.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black mb-0.5" style={{color:d?.color??GREEN,fontFamily:PP}}>{activeKd.singkatan}</p>
                    <p className="text-[18px] font-black text-[#1a1d2e] leading-snug" style={{fontFamily:PP}}>{activeKd.nama}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{background:(d?.color??GREEN)+"18",color:d?.color??GREEN,fontFamily:PP}}>{kat.emoji} {activeKd.kategori}</span>
                      {d && <span className="text-[10px] font-semibold text-[#9ca3af] px-2.5 py-0.5 rounded-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>🕐 {d.durasi}</span>}
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#ef4444]" style={{fontFamily:PP}}>⚡ Ikatan Dinas</span>
                      {d && <span className="text-[10px] font-semibold text-[#9ca3af] px-2.5 py-0.5 rounded-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>📍 {d.lokasi}</span>}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d?.deskripsi ?? activeKd.deskripsi}</p>

                {d && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {d.evidenceCards.map((e,i) => (
                      <div key={i} className="bg-white/70 rounded-xl px-4 py-3 border border-[rgba(0,0,0,0.06)]">
                        <p className="text-[16px] mb-1">{e.icon}</p>
                        <p className="text-[11px] font-bold text-[#1a1d2e] mb-1" style={{fontFamily:PP}}>{e.title}</p>
                        <p className="text-[10px] text-[#6b7280] leading-relaxed" style={{fontFamily:PP}}>{e.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Program Studi */}
              {d && (
                <div className="px-6 py-5">
                  <p className="text-[14px] font-bold text-[#1a1d2e] mb-3" style={{fontFamily:PP}}>📋 Program Studi</p>
                  <div className="flex flex-col gap-2">
                    {d.prodi.map((p,i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#f0fdf4]">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{background:d.color}}>{i+1}</div>
                        <span className="text-[12px] font-semibold text-[#1a1d2e]" style={{fontFamily:PP}}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kompetensi */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>🎯 Kompetensi yang Dibutuhkan</p>
                </div>
                <div className="px-6 py-5 grid grid-cols-[auto_1fr] gap-6 items-center">
                  <SvgRadar axes={d.kompetensi.map(k=>k.label)} values={d.kompetensi.map(k=>k.val)} color={d.color}/>
                  <div className="flex flex-col gap-3">
                    {d.kompetensi.map(k => (
                      <div key={k.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{k.label}</span>
                          <span className="text-[12px] font-black" style={{color:d.color,fontFamily:PP}}>{k.val}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${k.val}%`,background:d.color}}/>
                        </div>
                      </div>
                    ))}
                    <div className="mt-1 p-3 rounded-xl bg-[#f0fdf4] border border-[rgba(0,0,0,0.06)]">
                      <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>Catatan Analisis</p>
                      <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.kompetensiAI}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mata Pelajaran Pendukung */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>📚 Mata Pelajaran Pendukung</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex flex-col gap-2.5 mb-4">
                    {d.mapelPendukung.map(m => (
                      <div key={m.nama} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f0fdf4] border border-[rgba(0,0,0,0.05)]">
                        <span className="text-[13px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>{m.nama}</span>
                        <Stars n={m.bintang}/>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[rgba(0,0,0,0.06)]">
                    <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>🤖 AI berkata</p>
                    <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.mapelAI}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Seleksi Timeline */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>📋 Proses Seleksi</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                    {d.seleksi.map((s,i) => (
                      <button key={i} onClick={() => setKdSeleksiStep(i)}
                        className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all min-w-[100px] ${kdSeleksiStep===i?"text-white border-transparent":"border-[rgba(0,0,0,0.08)] bg-[#f0fdf4] text-[#374151] hover:border-green-300"}`}
                        style={{background:kdSeleksiStep===i?d.color:undefined,fontFamily:PP,outline:"none"}}>
                        <span className="text-lg font-black" style={{color:kdSeleksiStep===i?"white":d.color}}>{i+1}</span>
                        <span className="text-[10px] font-semibold text-center leading-tight">{s}</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      {d.seleksi.map((_,i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{background:i<=kdSeleksiStep?d.color:"#e5e7eb"}}/>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#6b7280]" style={{fontFamily:PP}}>Tahap {kdSeleksiStep+1} dari {d.seleksi.length}</p>
                    <div className="mt-3 p-4 rounded-xl bg-[#f0fdf4] border border-[rgba(0,0,0,0.06)]">
                      <p className="text-[14px] font-black mb-1" style={{color:d.color,fontFamily:PP}}>📌 {d.seleksi[kdSeleksiStep]}</p>
                      <p className="text-[11px] text-[#6b7280]" style={{fontFamily:PP}}>
                        {kdSeleksiStep===0 && "Daftar melalui portal resmi. Siapkan dokumen — rapor, KTP, pas foto, dan surat keterangan dari sekolah."}
                        {kdSeleksiStep===1 && "Verifikasi dokumen administratif. Pastikan semua persyaratan terpenuhi sebelum melanjutkan."}
                        {kdSeleksiStep===2 && "Tes Kompetensi Dasar (SKD) meliputi TWK, TIU, dan TKP. Persiapkan diri dengan latihan soal CPNS."}
                        {kdSeleksiStep===3 && "Tes akademik sesuai bidang studi. Fokus pada mata pelajaran pendukung yang direkomendasikan."}
                        {kdSeleksiStep===4 && "Pemeriksaan kesehatan dan kebugaran jasmani. Jaga kondisi fisik dan pola hidup sehat."}
                        {kdSeleksiStep===5 && "Wawancara untuk menilai motivasi, kepribadian, dan kesiapan berkarier di instansi terkait."}
                        {kdSeleksiStep===6 && "Pengumuman hasil seleksi akhir. Peserta yang lolos akan mengikuti proses penempatan."}
                        {kdSeleksiStep>6 && "Ikuti tahap ini dengan persiapan matang dan rasa percaya diri."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Karier */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>💼 Peluang Karier Setelah Lulus</p>
                </div>
                <div className="divide-y divide-[rgba(0,0,0,0.04)]">
                  {d.karier.map((k,i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{background:d.light}}>🏢</div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>{k.nama}</p>
                        <p className="text-[11px] text-[#9ca3af]" style={{fontFamily:PP}}>{k.instansi}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background:d.color}}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>🤖 Mengapa Sekolah Ini?</p>
                </div>
                <div className="px-6 py-5">
                  <div className="p-4 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#f0fdf4]">
                    <p className="text-[13px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.whyChooseAI}</p>
                  </div>
                </div>
              </div>
            )}

            {/* School Discovery */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>🧭 Jelajahi Karier Pemerintahan</p>
                  <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>Jika kamu tertarik dengan {activeKd.singkatan}, kamu mungkin juga cocok dengan:</p>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {d.serupa.map(s => {
                      const sc = ALL_KEDINASAN.find(k => k.key === s.key);
                      const sd = KD_DETAIL_DB.find(x => x.key === s.key);
                      return (
                        <div key={s.key} className="rounded-xl border border-[rgba(0,0,0,0.07)] p-4 bg-[#f0fdf4] flex flex-col gap-2">
                          <p className="text-[20px]">{sc?.emoji ?? "🏛️"}</p>
                          <p className="text-[12px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{s.nama}</p>
                          <div className="flex flex-col gap-1">
                            {s.alasan.map((a,i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <Check size={10} className="text-[#22c55e] shrink-0"/>
                                <span className="text-[10px] text-[#374151]" style={{fontFamily:PP}}>{a}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => { if (sc) openKdDetail(sc); }}
                            className="mt-1 py-1.5 rounded-lg text-[10px] font-bold text-white hover:opacity-90 transition-all"
                            style={{background:sd?.color??GREEN,fontFamily:PP,outline:"none"}}>
                            Eksplorasi →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[rgba(0,0,0,0.06)]">
                    <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>🤖 AI berkata</p>
                    <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.serupaAI}</p>
                  </div>
                </div>
              </div>
            )}

            {/* No detail fallback */}
            {!d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-8 flex flex-col items-center gap-3 text-center">
                <p className="text-3xl">{activeKd.emoji}</p>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>Informasi Lengkap Segera Hadir</p>
                <p className="text-[12px] text-[#9ca3af] max-w-xs" style={{fontFamily:PP}}>Kami sedang menyiapkan profil lengkap {activeKd.singkatan}. Kunjungi kembali dalam waktu dekat!</p>
                <span className="px-4 py-2 rounded-full text-[12px] font-bold border" style={{background:GREEN+"18",color:GREEN,borderColor:GREEN+"30",fontFamily:PP}}>🕐 {activeKd.durasi ?? "3–4 Tahun"} · {activeKd.jumlahProdi} Program Studi</span>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ── PTN DETAIL ────────────────────────────────────────────────────────────────
  if (mainTab === "ptn-pts" && ptnView === "detail" && activeJurusan) {
    const d = DETAIL_DB.find(x => x.key === activeJurusan.key) ?? null;
    const saved = savedKeys.has(activeJurusan.key);
    const katCfg = KAT_CONFIG.find(k => k.key === activeJurusan.kategori) ?? KAT_CONFIG[0];

    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => setPtnView("main")} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]" style={{outline:"none"}}>
            <ArrowLeft size={14} className="text-[#374151]"/>
          </button>
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-[10px] text-[#9ca3af]" style={{fontFamily:PP}}>Eksplor Jurusan</span>
            <ChevronRight size={10} className="text-[#9ca3af]"/>
            <span className="text-[10px] font-medium" style={{color:katCfg.color,fontFamily:PP}}>{activeJurusan.nama}</span>
          </div>
          <button onClick={() => toggleSave(activeJurusan.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${saved?"bg-[#fef2f2] border-[#fecaca] text-[#ef4444]":"border-[rgba(0,0,0,0.1)] text-[#9ca3af] hover:border-[#ef4444]"}`}
            style={{fontFamily:PP,outline:"none"}}>
            <Heart size={12} fill={saved?"currentColor":"none"}/> {saved?"Tersimpan":"Simpan"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
          <div className="px-6 py-5 max-w-4xl mx-auto flex flex-col gap-5">

            {/* Overview */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-6 py-6 border-b border-[rgba(0,0,0,0.05)]" style={{background:`linear-gradient(135deg,${d?.light??"#f5f6fb"},white)`}}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{background:d?.light??"#f5f6fb"}}>{activeJurusan.emoji}</div>
                  <div className="flex-1">
                    <p className="text-[22px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{activeJurusan.nama}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{background:katCfg.color+"18",color:katCfg.color,fontFamily:PP}}>{katCfg.emoji} {activeJurusan.kategori}</span>
                      <span className="text-[10px] font-semibold text-[#9ca3af] px-2.5 py-0.5 rounded-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>🕐 {d?.durasi??"4 Tahun"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className="px-3 py-2 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-center">
                      <p className="text-[9px] text-[#6b7280] mb-0.5" style={{fontFamily:PP}}>PTN</p>
                      <p className="text-[16px] font-black text-[#0965fa]" style={{fontFamily:PP}}>{activeJurusan.ptnCount}</p>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] text-center">
                      <p className="text-[9px] text-[#6b7280] mb-0.5" style={{fontFamily:PP}}>PTS</p>
                      <p className="text-[16px] font-black text-[#8b5cf6]" style={{fontFamily:PP}}>{activeJurusan.ptsCount}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d?.deskripsi ?? activeJurusan.deskripsi}</p>
                {d && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {d.evidenceCards.map((e,i) => (
                      <div key={i} className="bg-white/70 rounded-xl px-4 py-3 border border-[rgba(0,0,0,0.06)]">
                        <p className="text-[16px] mb-1">{e.icon}</p>
                        <p className="text-[11px] font-bold text-[#1a1d2e] mb-1" style={{fontFamily:PP}}>{e.title}</p>
                        <p className="text-[10px] text-[#6b7280] leading-relaxed" style={{fontFamily:PP}}>{e.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {d && (
                <div className="px-6 py-5">
                  <p className="text-[14px] font-bold text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>📖 Apa yang Akan Kamu Pelajari?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {d.pelajari.map((p,i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#f8faff]">
                        <span className="text-[20px]">{p.icon}</span>
                        <span className="text-[12px] font-semibold text-[#1a1d2e]" style={{fontFamily:PP}}>{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kompetensi */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>🎯 Kompetensi yang Dibutuhkan</p>
                </div>
                <div className="px-6 py-5 grid grid-cols-[auto_1fr] gap-6 items-center">
                  <SvgRadar axes={d.kompetensi.map(k=>k.label)} values={d.kompetensi.map(k=>k.val)} color={d.color}/>
                  <div className="flex flex-col gap-3">
                    {d.kompetensi.map(k => (
                      <div key={k.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{k.label}</span>
                          <span className="text-[12px] font-black" style={{color:d.color,fontFamily:PP}}>{k.val}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${k.val}%`,background:d.color}}/>
                        </div>
                      </div>
                    ))}
                    <div className="mt-1 p-3 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.06)]">
                      <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>Catatan Analisis</p>
                      <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.kompetensiAI}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mapel */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>📚 Mata Pelajaran Pendukung</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex flex-col gap-2.5 mb-4">
                    {d.mapelPendukung.map(m => (
                      <div key={m.nama} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.05)]">
                        <span className="text-[13px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>{m.nama}</span>
                        <Stars n={m.bintang}/>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.06)]">
                    <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>🤖 AI berkata</p>
                    <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.mapelAI}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Karier */}
            {d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>Peluang Karier</p>
                    <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>{d.karier.length} profesi tersedia</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:d.light}}>
                    <span className="text-base">💼</span>
                  </div>
                </div>
                <div className="px-6 py-4 grid grid-cols-2 gap-2.5">
                  {d.karier.map((k,i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-[rgba(0,0,0,0.07)] hover:border-opacity-0 hover:shadow-md transition-all group"
                      style={{borderColor: d.color+"20"}}>
                      {/* color accent bar */}
                      <div className="h-1 w-full" style={{background:`linear-gradient(90deg,${d.color},${d.color}80)`}}/>
                      <div className="p-3.5" style={{background:d.light+"60"}}>
                        <p className="text-[12px] font-black text-[#1a1d2e] mb-1.5 leading-tight" style={{fontFamily:PP}}>{k.nama}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{background:d.color}}/>
                          <p className="text-[10px] font-semibold" style={{color:d.color,fontFamily:PP}}>{k.gaji}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Universitas Terkait */}
            {d && (() => {
              const allUnis = UNI_DB[d.key] ?? d.universitas.map(u => ({ nama: u.nama, kota: u.kota, tipe: "PTN" as const }));
              const filtered = uniFilter === "surabaya"
                ? allUnis.filter(u => u.kota.toLowerCase().includes("surabaya"))
                : allUnis.filter(u => u.tipe === (uniFilter === "ptn" ? "PTN" : "PTS"));
              const visible = showAllUni ? filtered : filtered.slice(0, 5);
              const counts = { ptn: allUnis.filter(u=>u.tipe==="PTN").length, pts: allUnis.filter(u=>u.tipe==="PTS").length, surabaya: allUnis.filter(u=>u.kota.toLowerCase().includes("surabaya")).length };
              return (
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                  <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>Universitas Terkait</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>{allUnis.length} universitas tersedia</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:d.light}}>
                      <span className="text-base">🏛️</span>
                    </div>
                  </div>
                  {/* Filter pills */}
                  <div className="px-6 pt-4 flex gap-2">
                    {([
                      { key:"ptn",    label:"PTN",              count: counts.ptn      },
                      { key:"pts",    label:"PTS",              count: counts.pts      },
                      { key:"surabaya",label:"Sekitar Surabaya",count: counts.surabaya },
                    ] as const).map(f => (
                      <button key={f.key} onClick={() => { setUniFilter(f.key); setShowAllUni(false); }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all"
                        style={{
                          background: uniFilter===f.key ? d.color : "white",
                          color: uniFilter===f.key ? "white" : "#6b7280",
                          borderColor: uniFilter===f.key ? d.color : "rgba(0,0,0,0.1)",
                          fontFamily:PP, outline:"none"
                        }}>
                        {f.label}
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black"
                          style={{background: uniFilter===f.key ? "rgba(255,255,255,0.25)" : d.color+"15", color: uniFilter===f.key ? "white" : d.color}}>
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* List */}
                  <div className="px-6 pt-3 pb-2">
                    {visible.length === 0 ? (
                      <div className="py-8 flex flex-col items-center gap-2">
                        <span className="text-2xl">🔍</span>
                        <p className="text-[12px] text-[#9ca3af]" style={{fontFamily:PP}}>Belum ada data untuk filter ini</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {visible.map((u,i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm"
                            style={{background: i===0 ? d.light+"80" : "#f8faff", borderColor: i===0 ? d.color+"30" : "rgba(0,0,0,0.06)"}}>
                            {/* Rank number */}
                            <span className="text-[11px] font-black w-5 shrink-0 text-center"
                              style={{color: i===0 ? d.color : "#9ca3af", fontFamily:PP}}>
                              {i+1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-[#1a1d2e] truncate" style={{fontFamily:PP}}>{u.nama}</p>
                              <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>{u.kota}</p>
                            </div>
                            <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-lg"
                              style={{background: u.tipe==="PTN" ? d.color+"15" : "#f5f3ff", color: u.tipe==="PTN" ? d.color : "#8b5cf6", fontFamily:PP}}>
                              {u.tipe}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {!showAllUni && filtered.length > 5 && (
                    <div className="px-6 pb-5 pt-2">
                      <button onClick={() => setShowAllUni(true)}
                        className="w-full py-2.5 rounded-xl text-[12px] font-bold border transition-all hover:shadow-sm"
                        style={{borderColor: d.color+"40", color: d.color, background: d.light+"60", fontFamily:PP, outline:"none"}}>
                        Lihat Semua {filtered.length} Universitas
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Jalur Karier Alumni (General Career Pathways) */}
            {d && (() => {
              const pathways = [
                { bidang: "Teknologi & Digital", desc: "Software engineering, product development, data analytics, IT consulting", icon: "💻" },
                { bidang: "Manajemen & Bisnis", desc: "Business analyst, project manager, digital transformation specialist", icon: "📊" },
                { bidang: "Riset & Akademisi", desc: "Peneliti, dosen, pakar analisis sistem informasi dan riset kecerdasan buatan", icon: "🔬" },
                { bidang: "Birokrasi & BUMN", desc: "Pengembang sistem publik di kementerian, spesialis TI di BUMN", icon: "🏛️" }
              ];
              return (
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                  <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>Jalur Sektor Industri & Karier</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>Sektor industri utama yang biasa ditempuh lulusan</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:d.light}}>
                      <span className="text-base">💼</span>
                    </div>
                  </div>
                  <div className="px-6 pt-4 pb-5 flex flex-col gap-2.5">
                    {pathways.map((p, i) => (
                      <div key={i} className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl border bg-[#f8faff] border-[rgba(0,0,0,0.06)]">
                        <span className="text-xl shrink-0 mt-0.5">{p.icon}</span>
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>{p.bidang}</p>
                          <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed" style={{fontFamily:PP}}>{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {!d && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-8 flex flex-col items-center gap-3 text-center">
                <p className="text-3xl">{activeJurusan.emoji}</p>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>Informasi Lengkap Segera Hadir</p>
                <p className="text-[12px] text-[#9ca3af] max-w-xs" style={{fontFamily:PP}}>Kami sedang menyiapkan profil lengkap jurusan {activeJurusan.nama}.</p>
                <div className="flex gap-3 mt-2">
                  <div className="px-4 py-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-center">
                    <p className="text-[9px] text-[#6b7280] mb-0.5" style={{fontFamily:PP}}>PTN</p>
                    <p className="text-[20px] font-black text-[#0965fa]" style={{fontFamily:PP}}>{activeJurusan.ptnCount}</p>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] text-center">
                    <p className="text-[9px] text-[#6b7280] mb-0.5" style={{fontFamily:PP}}>PTS</p>
                    <p className="text-[20px] font-black text-[#8b5cf6]" style={{fontFamily:PP}}>{activeJurusan.ptsCount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showCompare && d && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowCompare(false)}>
            <div className="bg-white w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>⚖️ Bandingkan Universitas</p>
                <button onClick={() => setShowCompare(false)} className="w-7 h-7 rounded-full bg-[#f5f6fb] flex items-center justify-center" style={{outline:"none"}}><X size={13}/></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{fontFamily:PP}}>
                  <thead><tr>
                    <th className="text-[11px] text-[#9ca3af] font-semibold pb-3 pr-4">Kriteria</th>
                    {d.universitas.map((u,i) => <th key={i} className="text-[11px] font-bold text-[#1a1d2e] pb-3 pr-4 whitespace-nowrap">{u.nama}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                    {([["Kecocokan",d.universitas.map(u=>`${u.match}%`)],["Akreditasi",d.universitas.map(u=>u.akreditasi)],["Kota",d.universitas.map(u=>u.kota)],["Jalur",d.universitas.map(u=>u.jalur.join(" · "))]] as [string,string[]][]).map(([lbl,vals]) => (
                      <tr key={lbl}><td className="text-[11px] font-semibold text-[#9ca3af] py-3 pr-4 whitespace-nowrap">{lbl}</td>{vals.map((v,i) => <td key={i} className="text-[12px] font-bold text-[#1a1d2e] py-3 pr-4">{v}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3.5 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-bold mb-1" style={{color:d.color,fontFamily:PP}}>🤖 AI berkata</p>
                <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{d.uniAI}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN VIEW
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Top Nav */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)]">
        <div className="px-6 pt-4 flex items-end justify-between">
          <p className="text-[17px] font-black text-[#1a1d2e] pb-3" style={{fontFamily:PP}}>🎓 Eksplor Jurusan</p>
          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold mb-3 transition-all ${savedKeys.size>0?"bg-[#fef2f2] border-[#fecaca] text-[#ef4444]":"border-[rgba(0,0,0,0.1)] text-[#9ca3af]"}`}
            style={{fontFamily:PP,outline:"none"}}>
            <Heart size={11} fill={savedKeys.size>0?"currentColor":"none"}/> Tersimpan {savedKeys.size>0&&`(${savedKeys.size})`}
          </button>
        </div>
        <div className="flex px-6">
          {([["ptn-pts","PTN & PTS","bg-[#eff6ff]"],["kedinasan","Kedinasan","bg-[#f0fdf4]"]] as const).map(([key,label,_bg]) => (
            <button key={key} onClick={() => setMainTab(key)}
              className={`px-6 py-3 text-[13px] font-bold border-b-2 transition-all ${mainTab===key?(key==="kedinasan"?"border-[#059669] text-[#059669]":"border-[#0965fa] text-[#0965fa]"):"border-transparent text-[#9ca3af] hover:text-[#374151]"}`}
              style={{fontFamily:PP,outline:"none"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PTN & PTS ─────────────────────────────────────────────────────────── */}
      {mainTab === "ptn-pts" && (
        <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
          <div className="bg-white px-6 pt-5 pb-5 border-b border-[rgba(0,0,0,0.05)]">
            <p className="text-[13px] text-[#6b7280] mb-4 max-w-lg" style={{fontFamily:PP}}>Temukan jurusan yang sesuai dengan minat, potensi, dan tujuan kariermu.</p>
            <div className="flex items-center gap-2 bg-[#f5f6fb] rounded-xl px-4 py-2.5 border border-[rgba(0,0,0,0.07)]">
              <Search size={15} className="text-[#9ca3af]"/>
              <input value={ptnSearch} onChange={e => setPtnSearch(e.target.value)} placeholder="Cari jurusan..."
                className="bg-transparent text-[13px] placeholder:text-[#9ca3af] outline-none flex-1 text-[#1a1d2e]" style={{fontFamily:PP}}/>
              {ptnSearch && <button onClick={() => setPtnSearch("")} style={{outline:"none"}}><X size={13} className="text-[#9ca3af]"/></button>}
            </div>
          </div>

          <div className="px-6 py-6 max-w-6xl mx-auto flex flex-col gap-8">
            {/* AI Recs */}
            {!ptnSearch && activeKat === "Semua" && (
              <div>
                <div className="flex items-center gap-2 mb-1"><Sparkles size={15} className="text-[#0965fa]"/><p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Rekomendasi Untukmu</p></div>
                <p className="text-[11px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Berdasarkan Orbita Compass, Data Akademik, dan Student Profiling.</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {AI_RECS_PTN.map((j,idx) => (
                    <div key={j.key} onClick={() => openPtnDetail(j)}
                      className="shrink-0 rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      style={{width:272,background:idx===0?(DETAIL_DB.find(d=>d.key===j.key)?.color??BLUE):"white"}}>
                      <div className="px-5 py-5">
                        {idx===0 && <p className="text-[10px] font-black mb-3" style={{color:"rgba(255,255,255,0.7)",fontFamily:PP}}>🥇 Paling Cocok</p>}
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{background:idx===0?"rgba(255,255,255,0.2)":(DETAIL_DB.find(d=>d.key===j.key)?.light??"#f5f6fb")}}>
                          {j.emoji}
                        </div>
                        <p className="text-[17px] font-black mb-3" style={{color:idx===0?"white":"#1a1d2e",fontFamily:PP}}>{j.nama}</p>
                        <div className="border-t pt-3 mb-3" style={{borderColor:idx===0?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.06)"}}>
                          <p className="text-[9px] font-bold mb-2" style={{color:idx===0?"rgba(255,255,255,0.55)":"#9ca3af",fontFamily:PP}}>Kenapa direkomendasikan?</p>
                          {(AI_ALASAN_PTN[j.key]??[]).map((a,i) => (
                            <div key={i} className="flex items-center gap-1.5 mb-1">
                              <Check size={10} style={{color:idx===0?"white":"#22c55e"}}/>
                              <span className="text-[11px] font-semibold" style={{color:idx===0?"rgba(255,255,255,0.85)":"#374151",fontFamily:PP}}>{a}</span>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-2.5 rounded-xl text-[12px] font-bold hover:opacity-90 transition-all text-white"
                          style={{background:idx===0?"rgba(255,255,255,0.25)":(DETAIL_DB.find(d=>d.key===j.key)?.color??BLUE),fontFamily:PP,outline:"none"}}>
                          Lihat Jurusan →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Semua Jurusan */}
            <div>
              <p className="text-[16px] font-black text-[#1a1d2e] mb-0.5" style={{fontFamily:PP}}>🎓 Semua Jurusan</p>
              <p className="text-[11px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Jelajahi berbagai jurusan berdasarkan bidang ilmu untuk menemukan jurusan yang paling menarik bagimu.</p>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {KAT_CONFIG.map(k => (
                  <button key={k.key} onClick={() => setActiveKat(k.key)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${activeKat===k.key?"text-white border-transparent shadow-sm":"border-[rgba(0,0,0,0.1)] bg-white text-[#374151] hover:border-[#0965fa] hover:text-[#0965fa]"}`}
                    style={{background:activeKat===k.key?k.color:undefined,fontFamily:PP,outline:"none"}}>
                    <span>{k.emoji}</span> {k.key}
                  </button>
                ))}
              </div>
              {ptnSearch && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[12px] text-[#9ca3af]" style={{fontFamily:PP}}>Hasil untuk "{ptnSearch}" — {ptnDisplayGroups.reduce((s,g)=>s+g.items.length,0)} jurusan</span>
                  <button onClick={() => setPtnSearch("")} className="text-[11px] font-bold text-[#0965fa] hover:underline" style={{fontFamily:PP,outline:"none"}}>Hapus</button>
                </div>
              )}
              {ptnDisplayGroups.length===0
                ? <div className="flex flex-col items-center gap-3 py-12"><p className="text-3xl">🔍</p><p className="text-[14px] font-semibold text-[#374151]" style={{fontFamily:PP}}>Jurusan tidak ditemukan</p></div>
                : <div className="flex flex-col gap-8">
                    {ptnDisplayGroups.map(grp => (
                      <div key={grp.key}>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-[14px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{grp.emoji} {grp.key}</p>
                          <span className="text-[10px] font-semibold text-[#9ca3af] px-2 py-0.5 rounded-full bg-white border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>{grp.items.length} jurusan</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {grp.items.map(j => {
                            const isSaved = savedKeys.has(j.key);
                            return (
                              <div key={j.key} onClick={() => openPtnDetail(j)}
                                className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-[#0965fa] group">
                                <div className="px-4 pt-4 pb-3">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{background:grp.color+"12"}}>{j.emoji}</div>
                                    <button onClick={e=>{e.stopPropagation();toggleSave(j.key);}} className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-[#fef2f2] transition-all" style={{outline:"none"}}>
                                      <Heart size={12} fill={isSaved?"#ef4444":"none"} className={isSaved?"text-[#ef4444]":"text-[#d1d5db]"}/>
                                    </button>
                                  </div>
                                  <p className="text-[13px] font-black text-[#1a1d2e] mb-1 leading-snug" style={{fontFamily:PP}}>{j.nama}</p>
                                  <p className="text-[10px] text-[#9ca3af] leading-snug line-clamp-1 mb-3" style={{fontFamily:PP}}>{j.deskripsi}</p>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#eff6ff] text-[#0965fa] border border-[#bfdbfe]" style={{fontFamily:PP}}>🎓 {j.ptnCount} PTN</span>
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#f5f3ff] text-[#8b5cf6] border border-[#ddd6fe]" style={{fontFamily:PP}}>🏛 {j.ptsCount} PTS</span>
                                  </div>
                                  <p className="text-[9px] text-[#c4c9d4]" style={{fontFamily:PP}}>Tersedia di berbagai universitas di Indonesia.</p>
                                </div>
                                <div className="px-4 py-2.5 bg-[#f8faff] border-t border-[rgba(0,0,0,0.04)] flex items-center justify-between group-hover:bg-[#eff6ff] transition-colors">
                                  <span className="text-[9px] font-semibold text-[#c4c9d4] group-hover:text-[#93c5fd] transition-colors" style={{fontFamily:PP}}>Lihat detail</span>
                                  <ChevronRight size={12} className="text-[#c4c9d4] group-hover:text-[#0965fa] transition-colors"/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* ── KEDINASAN ─────────────────────────────────────────────────────────── */}
      {mainTab === "kedinasan" && (
        <div className="flex-1 overflow-y-auto bg-[#f0fdf4]">
          {/* Hero */}
          <div className="bg-white px-6 pt-5 pb-5 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[18px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>🏛️ Eksplor Sekolah Kedinasan</p>
                <p className="text-[12px] text-[#6b7280] mt-1 max-w-md" style={{fontFamily:PP}}>Kenali sekolah kedinasan, prospek karier, serta jalur seleksi yang sesuai dengan potensi dan minatmu.</p>
              </div>
              <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${savedKdKeys.size>0?"bg-[#fef2f2] border-[#fecaca] text-[#ef4444]":"border-[rgba(0,0,0,0.1)] text-[#9ca3af]"}`}
                style={{fontFamily:PP,outline:"none"}}>
                <Heart size={11} fill={savedKdKeys.size>0?"currentColor":"none"}/> Tersimpan {savedKdKeys.size>0&&`(${savedKdKeys.size})`}
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 bg-[#f0fdf4] rounded-xl px-4 py-2.5 border border-[rgba(5,150,105,0.2)]">
              <Search size={15} className="text-[#6b7280]"/>
              <input value={kdSearch} onChange={e => setKdSearch(e.target.value)} placeholder="Cari sekolah kedinasan..."
                className="bg-transparent text-[13px] placeholder:text-[#9ca3af] outline-none flex-1 text-[#1a1d2e]" style={{fontFamily:PP}}/>
              {kdSearch && <button onClick={() => setKdSearch("")} style={{outline:"none"}}><X size={13} className="text-[#9ca3af]"/></button>}
            </div>
          </div>

          <div className="px-6 py-6 max-w-6xl mx-auto flex flex-col gap-8">

            {/* AI Recs Kedinasan */}
            {!kdSearch && kdKat === "Semua" && (
              <div>
                <div className="flex items-center gap-2 mb-1"><Sparkles size={15} style={{color:GREEN}}/><p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Rekomendasi Untukmu</p></div>
                <p className="text-[11px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Berdasarkan kemampuan akademik, minat, dan profil siswa.</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {AI_RECS_KD.map((k,idx) => {
                    const dd = KD_DETAIL_DB.find(x => x.key===k.key);
                    const baseColor = dd?.color ?? GREEN;
                    return (
                      <div key={k.key} onClick={() => openKdDetail(k)}
                        className="shrink-0 rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        style={{width:272,background:idx===0?baseColor:"white"}}>
                        <div className="px-5 py-5">
                          {idx===0 && <p className="text-[10px] font-black mb-3" style={{color:"rgba(255,255,255,0.7)",fontFamily:PP}}>🥇 Paling Cocok</p>}
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{background:idx===0?"rgba(255,255,255,0.2)":(dd?.light??"#f0fdf4")}}>
                            {k.emoji}
                          </div>
                          <p className="text-[13px] font-black mb-0.5" style={{color:idx===0?"rgba(255,255,255,0.6)":"#9ca3af",fontFamily:PP}}>{k.singkatan}</p>
                          <p className="text-[15px] font-black mb-3 leading-snug" style={{color:idx===0?"white":"#1a1d2e",fontFamily:PP}}>{k.nama}</p>
                          <div className="border-t pt-3 mb-3" style={{borderColor:idx===0?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.06)"}}>
                            <p className="text-[9px] font-bold mb-2" style={{color:idx===0?"rgba(255,255,255,0.55)":"#9ca3af",fontFamily:PP}}>Kenapa direkomendasikan?</p>
                            {(AI_ALASAN_KD[k.key]??[]).map((a,i) => (
                              <div key={i} className="flex items-center gap-1.5 mb-1">
                                <Check size={10} style={{color:idx===0?"white":"#22c55e"}}/>
                                <span className="text-[11px] font-semibold" style={{color:idx===0?"rgba(255,255,255,0.85)":"#374151",fontFamily:PP}}>{a}</span>
                              </div>
                            ))}
                          </div>
                          <button className="w-full py-2.5 rounded-xl text-[12px] font-bold hover:opacity-90 transition-all text-white"
                            style={{background:idx===0?"rgba(255,255,255,0.25)":baseColor,fontFamily:PP,outline:"none"}}>
                            Eksplorasi →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Semua Kedinasan */}
            <div>
              <p className="text-[16px] font-black text-[#1a1d2e] mb-0.5" style={{fontFamily:PP}}>🏛️ Semua Sekolah Kedinasan</p>
              <p className="text-[11px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Jelajahi sekolah kedinasan berdasarkan bidang dan instansi pemerintah terkait.</p>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {KD_KAT_CONFIG.map(k => (
                  <button key={k.key} onClick={() => setKdKat(k.key)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${kdKat===k.key?"text-white border-transparent shadow-sm":"border-[rgba(0,0,0,0.1)] bg-white text-[#374151] hover:border-[#059669] hover:text-[#059669]"}`}
                    style={{background:kdKat===k.key?k.color:undefined,fontFamily:PP,outline:"none"}}>
                    <span>{k.emoji}</span> {k.key}
                  </button>
                ))}
              </div>

              {kdDisplayGroups.length===0
                ? <div className="flex flex-col items-center gap-3 py-12"><p className="text-3xl">🔍</p><p className="text-[14px] font-semibold text-[#374151]" style={{fontFamily:PP}}>Sekolah tidak ditemukan</p></div>
                : <div className="flex flex-col gap-8">
                    {kdDisplayGroups.map(grp => (
                      <div key={grp.key}>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-[14px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{grp.emoji} {grp.key}</p>
                          <span className="text-[10px] font-semibold text-[#9ca3af] px-2 py-0.5 rounded-full bg-white border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>{grp.items.length} sekolah</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {grp.items.map(k => {
                            const dd = KD_DETAIL_DB.find(x => x.key===k.key);
                            const isSaved = savedKdKeys.has(k.key);
                            const accentColor = dd?.color ?? GREEN;
                            const accentLight = dd?.light ?? "#f0fdf4";
                            return (
                              <div key={k.key} onClick={() => openKdDetail(k)}
                                className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
                                style={{"--hover-border": accentColor} as React.CSSProperties}
                                onMouseEnter={e => (e.currentTarget.style.borderColor=accentColor)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor="rgba(0,0,0,0.07)")}>
                                <div className="px-4 pt-4 pb-3">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{background:accentLight}}>{k.emoji}</div>
                                    <button onClick={e=>{e.stopPropagation();toggleKdSave(k.key);}} className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-[#fef2f2] transition-all" style={{outline:"none"}}>
                                      <Heart size={12} fill={isSaved?"#ef4444":"none"} className={isSaved?"text-[#ef4444]":"text-[#d1d5db]"}/>
                                    </button>
                                  </div>
                                  <p className="text-[11px] font-bold mb-0.5" style={{color:accentColor,fontFamily:PP}}>{k.singkatan}</p>
                                  <p className="text-[13px] font-black text-[#1a1d2e] mb-1.5 leading-snug" style={{fontFamily:PP}}>{k.nama}</p>
                                  <p className="text-[10px] text-[#9ca3af] leading-snug line-clamp-2 mb-3" style={{fontFamily:PP}}>{k.deskripsi}</p>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold border" style={{background:accentLight,color:accentColor,borderColor:accentColor+"30",fontFamily:PP}}>📋 {k.jumlahProdi} Prodi</span>
                                    {k.ikatanDinas && <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]" style={{fontFamily:PP}}>⚡ Ikatan Dinas</span>}
                                  </div>
                                  <p className="text-[9px] text-[#c4c9d4] mt-1.5" style={{fontFamily:PP}}>Sekolah kedinasan resmi di bawah kementerian terkait.</p>
                                </div>
                                <div className="px-4 py-2.5 bg-[#f0fdf4] border-t border-[rgba(0,0,0,0.04)] flex items-center justify-between transition-colors"
                                  style={{background:"#f0fdf4"}}>
                                  <span className="text-[9px] font-semibold text-[#c4c9d4]" style={{fontFamily:PP}}>Lihat detail</span>
                                  <ChevronRight size={12} className="text-[#c4c9d4]"/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
