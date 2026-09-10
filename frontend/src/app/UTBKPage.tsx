import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, BookOpen, FileText, BarChart3, Brain, Clock, Target, Trophy, TrendingUp, ChevronRight, Check, Lock, Play, X, Zap, Star, CheckCircle, Sparkles, Calendar, ChevronDown } from "lucide-react";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";
const GREEN = "#059669";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab    = "utbk" | "kedinasan";
type View   = "landing" | "planner";
type Sect      = "latihan" | "tryout" | "laporan";
type LS        = "home" | "exam" | "results";
type TS        = "home" | "exam" | "report";
type MatStatus = "not-started" | "continue" | "completed";

type Q = { id:number; sub:string; q:string; opts:string[]; ans:number; exp:string; topic:string; diff:"Mudah"|"Sedang"|"Sulit" };

// ─── Question Banks ───────────────────────────────────────────────────────────
const UTBK_QS: Q[] = [
  // PU
  { id:1,  sub:"PU", q:"Semua pelajar rajin. Rudi adalah pelajar. Maka Rudi...",                                         opts:["Mungkin tidak rajin","Pasti rajin","Mungkin rajin","Tidak dapat disimpulkan"], ans:1, exp:"Silogisme: Semua pelajar rajin + Rudi pelajar = Rudi pasti rajin.", topic:"Silogisme", diff:"Mudah" },
  { id:2,  sub:"PU", q:"Lanjutkan deret: 2, 4, 8, 16, ...",                                                              opts:["24","30","32","36"], ans:2, exp:"Pola dikali 2. 16 × 2 = 32.", topic:"Deret Angka", diff:"Mudah" },
  { id:3,  sub:"PU", q:"BUKU : PERPUSTAKAAN = LUKISAN : ...",                                                             opts:["Kanvas","Museum","Galeri","Seniman"], ans:2, exp:"Buku disimpan di perpustakaan; lukisan dipajang di galeri.", topic:"Analogi", diff:"Sedang" },
  { id:4,  sub:"PU", q:"Jika P→Q dan Q→R, maka kesimpulan yang paling tepat adalah...",                                  opts:["R→P","P→R","Q→P","R→Q"], ans:1, exp:"Silogisme hipotetis: P→Q dan Q→R ∴ P→R.", topic:"Logika", diff:"Sedang" },
  { id:5,  sub:"PU", q:"Dari 5 siswa (A,B,C,D,E) hanya 2 yang lolos. Berapa kemungkinan kombinasi berbeda?",             opts:["8","10","12","15"], ans:1, exp:"C(5,2) = 10.", topic:"Kombinasi", diff:"Sulit" },
  { id:6,  sub:"PU", q:"Tidak semua mahasiswa lulus tepat waktu. Yang paling tepat disimpulkan adalah...",                opts:["Semua mahasiswa tidak lulus tepat waktu","Ada mahasiswa yang tidak lulus tepat waktu","Tidak ada mahasiswa yang lulus tepat waktu","Semua mahasiswa lulus tepat waktu"], ans:1, exp:"'Tidak semua' berarti ada yang tidak, bukan semuanya tidak.", topic:"Logika", diff:"Sedang" },
  // PK
  { id:7,  sub:"PK", q:"Harga sepatu naik 20% menjadi Rp 120.000. Berapa harga awalnya?",                                opts:["Rp 90.000","Rp 96.000","Rp 100.000","Rp 104.000"], ans:2, exp:"120.000 / 1,2 = 100.000.", topic:"Persentase", diff:"Mudah" },
  { id:8,  sub:"PK", q:"Umur Ani : Budi = 3 : 5. Jika total umur mereka 48 tahun, umur Budi adalah...",                  opts:["18","24","30","36"], ans:2, exp:"Budi = 5/8 × 48 = 30.", topic:"Rasio", diff:"Mudah" },
  { id:9,  sub:"PK", q:"2x + 3 = 15. Nilai x adalah...",                                                                  opts:["4","5","6","7"], ans:2, exp:"2x = 12 → x = 6.", topic:"Aljabar", diff:"Mudah" },
  { id:10, sub:"PK", q:"Luas segitiga dengan alas 12 cm dan tinggi 8 cm adalah...",                                       opts:["48 cm²","96 cm²","64 cm²","24 cm²"], ans:0, exp:"½ × 12 × 8 = 48 cm².", topic:"Geometri", diff:"Mudah" },
  { id:11, sub:"PK", q:"Rata-rata 6 siswa = 75. Satu siswa bernilai 90. Rata-rata 5 siswa lainnya adalah...",             opts:["72","73","74","75"], ans:0, exp:"Total 6 = 450. Lima siswa = 360. 360/5 = 72.", topic:"Statistika", diff:"Sedang" },
  { id:12, sub:"PK", q:"Sebuah kran mengisi bak dalam 6 menit. Kran lain mengisinya dalam 3 menit. Bersama, berapa menit?",opts:["2","2,5","3","4"], ans:0, exp:"1/6 + 1/3 = 1/2 per menit → 2 menit.", topic:"Laju", diff:"Sulit" },
  // LI
  { id:13, sub:"LI", q:"'Revolusi industri 4.0 membawa perubahan besar dalam dunia kerja. Banyak pekerjaan kini dilakukan mesin.' Gagasan utama paragraf adalah...", opts:["Mesin menggantikan manusia","Revolusi industri membawa perubahan besar di dunia kerja","Manusia tak dibutuhkan lagi","Teknologi berkembang pesat"], ans:1, exp:"Gagasan utama ada di kalimat pertama.", topic:"Gagasan Utama", diff:"Mudah" },
  { id:14, sub:"LI", q:"Kata 'signifikan' dalam 'Penurunan kasus sangat signifikan' bermakna...",                         opts:["Kecil","Bertahap","Besar dan berarti","Tidak terduga"], ans:2, exp:"Signifikan = bermakna dan cukup besar untuk diperhatikan.", topic:"Kosakata", diff:"Mudah" },
  { id:15, sub:"LI", q:"Kalimat efektif yang tepat adalah...",                                                             opts:["Kami telah berhasil menyelesaikan tugas ini dengan selesai","Kami telah menyelesaikan tugas ini","Kami telah berhasil untuk menyelesaikan tugas ini","Tugas ini telah berhasil selesai oleh kami"], ans:1, exp:"Kalimat efektif tidak menggunakan kata mubazir.", topic:"Kalimat Efektif", diff:"Sedang" },
  { id:16, sub:"LI", q:"Paragraf yang kalimat utamanya di awal disebut paragraf...",                                       opts:["Induktif","Deduktif","Campuran","Deskriptif"], ans:1, exp:"Deduktif = kalimat utama di awal, diikuti penjelas.", topic:"Jenis Paragraf", diff:"Mudah" },
  { id:17, sub:"LI", q:"Penggunaan tanda baca yang benar terdapat pada...",                                                opts:["Ibu membeli; apel, jeruk, dan mangga.","Ibu membeli apel, jeruk, dan mangga.","Ibu membeli: apel jeruk dan mangga.","Ibu membeli apel jeruk, dan mangga."], ans:1, exp:"Tanda koma memisahkan unsur rincian tanpa tanda titik koma atau titik dua.", topic:"Tanda Baca", diff:"Sedang" },
  { id:18, sub:"LI", q:"'Para petani bekerja keras demi hasil panen yang melimpah.' Kata 'demi' bermakna...",              opts:["Karena","Untuk","Dengan","Oleh"], ans:1, exp:"'Demi' menyatakan tujuan, bermakna 'untuk'.", topic:"Konjungsi", diff:"Mudah" },
  // LE
  { id:19, sub:"LE", q:"'Despite the heavy rain, the students continued their activity.' The word 'despite' means...",     opts:["Because of","Although","Therefore","Unless"], ans:1, exp:"Despite = although, menunjukkan kontras.", topic:"Vocabulary", diff:"Mudah" },
  { id:20, sub:"LE", q:"'The scientist discovered a new species in the Amazon.' 'Discovered' is in...",                   opts:["Simple Present","Simple Past","Present Perfect","Past Perfect"], ans:1, exp:"Discovered = bentuk simple past dari discover.", topic:"Grammar", diff:"Mudah" },
  { id:21, sub:"LE", q:"'Students who study consistently tend to perform better.' The main idea is...",                    opts:["Exams are important","Consistent studying leads to better performance","Students should study daily","Talent determines success"], ans:1, exp:"Main idea: consistent studying leads to better results.", topic:"Main Idea", diff:"Mudah" },
  { id:22, sub:"LE", q:"Choose the grammatically correct sentence:",                                                       opts:["She don't like coffee.","She doesn't likes coffee.","She doesn't like coffee.","She not like coffee."], ans:2, exp:"Subject 'She' (3rd person singular) + doesn't + base verb.", topic:"Grammar", diff:"Mudah" },
  { id:23, sub:"LE", q:"'Although technology has advanced rapidly, some communities still lack basic amenities.' What is implied?", opts:["Technology benefits everyone","Not all benefit equally from technology","Amenities are unimportant","Technology has no problems"], ans:1, exp:"'Although' creates contrast — unequal distribution of benefits.", topic:"Inference", diff:"Sulit" },
  { id:24, sub:"LE", q:"'The report was submitted by the team before the deadline.' This sentence is in...",               opts:["Active Voice","Passive Voice","Reported Speech","Direct Speech"], ans:1, exp:"'Was submitted by' = passive voice construction.", topic:"Grammar", diff:"Sedang" },
  // PM
  { id:25, sub:"PM", q:"f(x) = 2x² − 3x + 1. Nilai f(2) adalah...",                                                      opts:["3","5","7","9"], ans:0, exp:"f(2) = 2(4) − 3(2) + 1 = 8 − 6 + 1 = 3.", topic:"Fungsi", diff:"Sedang" },
  { id:26, sub:"PM", q:"Dalam kotak terdapat 4 bola merah dan 3 bola biru. Peluang mengambil 1 bola biru adalah...",      opts:["3/7","4/7","1/3","1/4"], ans:0, exp:"P(biru) = 3/7.", topic:"Peluang", diff:"Mudah" },
  { id:27, sub:"PM", q:"Nilai mean dari data: 5, 7, 8, 6, 9 adalah...",                                                   opts:["6","7","8","9"], ans:1, exp:"(5+7+8+6+9)/5 = 35/5 = 7.", topic:"Statistika", diff:"Mudah" },
  { id:28, sub:"PM", q:"Suku ke-10 dari barisan 3, 7, 11, 15, ... adalah...",                                              opts:["39","41","43","45"], ans:0, exp:"a=3, b=4. U10 = 3 + 9×4 = 39.", topic:"Barisan Aritmetik", diff:"Sedang" },
  { id:29, sub:"PM", q:"Penyelesaian dari 2x − 5 > 9 adalah...",                                                          opts:["x > 2","x > 5","x > 7","x > 14"], ans:2, exp:"2x > 14 → x > 7.", topic:"Pertidaksamaan", diff:"Sedang" },
  { id:30, sub:"PM", q:"Jika log 2 = 0,301, nilai log 8 adalah...",                                                       opts:["0,602","0,699","0,903","1,204"], ans:2, exp:"log 8 = log 2³ = 3 × 0,301 = 0,903.", topic:"Logaritma", diff:"Sulit" },
];

const SKD_QS: Q[] = [
  // TWK
  { id:31, sub:"TWK", q:"Pancasila sebagai dasar negara pertama kali dirumuskan oleh...",                                  opts:["Ir. Soekarno","Mohammad Hatta","Soepomo","Mohammad Yamin"], ans:0, exp:"Ir. Soekarno merumuskan Pancasila dalam pidatonya 1 Juni 1945.", topic:"Pancasila", diff:"Mudah" },
  { id:32, sub:"TWK", q:"Pasal yang mengatur Hak Asasi Manusia dalam UUD 1945 adalah...",                                  opts:["Pasal 26","Pasal 27","Pasal 28","Pasal 29"], ans:2, exp:"Pasal 28A–28J UUD 1945 mengatur HAM.", topic:"UUD 1945", diff:"Mudah" },
  { id:33, sub:"TWK", q:"Semboyan 'Bhinneka Tunggal Ika' berasal dari kitab...",                                           opts:["Mahabharata","Sutasoma","Ramayana","Negarakertagama"], ans:1, exp:"Kakawin Sutasoma karangan Mpu Tantular.", topic:"Bhinneka Tunggal Ika", diff:"Mudah" },
  { id:34, sub:"TWK", q:"NKRI adalah singkatan dari...",                                                                   opts:["Negara Kesatuan Republik Indonesia","Negara Kesejahteraan Republik Indonesia","Negara Konstitusi Republik Indonesia","Negara Keadilan Republik Indonesia"], ans:0, exp:"NKRI = Negara Kesatuan Republik Indonesia (UUD 1945 Pasal 1).", topic:"NKRI", diff:"Mudah" },
  { id:35, sub:"TWK", q:"Wawasan Nusantara adalah...",                                                                     opts:["Kebijakan pertahanan militer","Cara pandang bangsa Indonesia tentang diri dan lingkungan","Kebijakan luar negeri Indonesia","Sistem pemerintahan daerah"], ans:1, exp:"Wawasan Nusantara = cara pandang bangsa Indonesia berdasarkan Pancasila dan UUD 1945.", topic:"Wawasan Nusantara", diff:"Sedang" },
  { id:36, sub:"TWK", q:"Sila ke-3 Pancasila adalah...",                                                                  opts:["Kemanusiaan yang Adil dan Beradab","Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan","Persatuan Indonesia","Keadilan Sosial bagi Seluruh Rakyat"], ans:2, exp:"Sila ke-3: Persatuan Indonesia.", topic:"Pancasila", diff:"Mudah" },
  // TIU
  { id:37, sub:"TIU", q:"PANAS : DINGIN = GELAP : ...",                                                                   opts:["Malam","Lampu","Terang","Siang"], ans:2, exp:"Antonim: panas-dingin, gelap-terang.", topic:"Analogi", diff:"Mudah" },
  { id:38, sub:"TIU", q:"Semua pegawai negeri disiplin. Pak Ahmad pegawai negeri. Maka Pak Ahmad...",                     opts:["Mungkin tidak disiplin","Pasti disiplin","Mungkin disiplin","Tidak diketahui"], ans:1, exp:"Silogisme: Semua A=B, Pak Ahmad=A → Pak Ahmad=B.", topic:"Silogisme", diff:"Mudah" },
  { id:39, sub:"TIU", q:"Lanjutkan deret: 3, 6, 12, 24, ...",                                                             opts:["36","42","48","54"], ans:2, exp:"Dikali 2. 24 × 2 = 48.", topic:"Deret Angka", diff:"Mudah" },
  { id:40, sub:"TIU", q:"Jika 3x + 6 = 24, maka x adalah...",                                                            opts:["4","5","6","7"], ans:2, exp:"3x = 18 → x = 6.", topic:"Aljabar", diff:"Mudah" },
  { id:41, sub:"TIU", q:"Antonim kata 'efisien' adalah...",                                                               opts:["Efektif","Hemat","Boros","Produktif"], ans:2, exp:"Efisien = hemat; antonimnya = boros.", topic:"Verbal", diff:"Mudah" },
  { id:42, sub:"TIU", q:"36 : 6 = 49 : ...",                                                                              opts:["6","7","8","9"], ans:1, exp:"36/6 = 6; 49/7 = 7.", topic:"Analogi Numerik", diff:"Mudah" },
  // TKP
  { id:43, sub:"TKP", q:"Atasan meminta Anda menyelesaikan tugas singkat di tengah beban kerja yang banyak. Yang terbaik...", opts:["Menolak karena tidak sanggup","Menerima dan meminta bantuan rekan jika perlu","Menerima namun seadanya","Meminta atasan tunjuk orang lain"], ans:1, exp:"Menerima tanggung jawab dengan komitmen dan proaktif mencari solusi.", topic:"Pelayanan Publik", diff:"Sedang" },
  { id:44, sub:"TKP", q:"Rekan kerja sering terlambat dan mengganggu tim. Yang sebaiknya dilakukan...",                    opts:["Membiarkan saja","Langsung lapor atasan","Ajak bicara baik-baik dan pahami situasinya","Bergosip dengan rekan lain"], ans:2, exp:"Pendekatan empati dan komunikasi terbuka sebelum eskalasi.", topic:"Sosial Budaya", diff:"Mudah" },
  { id:45, sub:"TKP", q:"Dalam rapat, pendapat Anda berbeda dari mayoritas. Yang tepat dilakukan...",                      opts:["Diam saja agar tidak konflik","Sampaikan pendapat sopan dengan argumen kuat","Marah karena tidak didengar","Keluar dari rapat"], ans:1, exp:"Asertif + argumen kuat = cerminan integritas dan profesionalisme.", topic:"Integritas", diff:"Sedang" },
];

// ─── Config ───────────────────────────────────────────────────────────────────
type SubMeta = { key:string; label:string; color:string; light:string };

const UTBK_SUBS: SubMeta[] = [
  { key:"PU", label:"Penalaran Umum",          color:"#0965fa", light:"#eff6ff" },
  { key:"PK", label:"Pengetahuan Kuantitatif", color:"#8b5cf6", light:"#f5f3ff" },
  { key:"LI", label:"Literasi Indonesia",      color:"#00b2dd", light:"#e0f8ff" },
  { key:"LE", label:"Literasi Inggris",        color:"#f1ad00", light:"#fffbeb" },
  { key:"PM", label:"Penalaran Matematika",    color:"#ef4444", light:"#fef2f2" },
];
const SKD_SUBS: SubMeta[] = [
  { key:"TWK", label:"Tes Wawasan Kebangsaan",   color:"#059669", light:"#f0fdf4" },
  { key:"TIU", label:"Tes Intelegensia Umum",    color:"#0891b2", light:"#ecfeff" },
  { key:"TKP", label:"Tes Karakteristik Pribadi",color:"#7c3aed", light:"#f5f3ff" },
];

const UTBK_PERF = [
  { key:"PU",label:"Penalaran Umum",          acc:88, trend:"up",   color:"#0965fa" },
  { key:"PK",label:"Pengetahuan Kuantitatif", acc:74, trend:"down", color:"#8b5cf6" },
  { key:"LI",label:"Literasi Indonesia",      acc:71, trend:"down", color:"#00b2dd" },
  { key:"LE",label:"Literasi Inggris",        acc:80, trend:"stable",color:"#f1ad00" },
  { key:"PM",label:"Penalaran Matematika",    acc:91, trend:"up",   color:"#ef4444" },
];
const SKD_PERF = [
  { key:"TWK",label:"Wawasan Kebangsaan",    acc:82, trend:"up",   color:"#059669" },
  { key:"TIU",label:"Intelegensia Umum",     acc:75, trend:"stable",color:"#0891b2" },
  { key:"TKP",label:"Karakteristik Pribadi", acc:88, trend:"up",   color:"#7c3aed" },
];

const UTBK_WEAK_TOPICS: Record<string,string[]> = {
  PM:["Fungsi","Peluang","Statistika"],
  LI:["Kalimat Efektif","Tanda Baca"],
  PK:["Statistika","Geometri"],
};
const SKD_WEAK_TOPICS: Record<string,string[]> = {
  TWK:["Pancasila","Wawasan Nusantara"],
  TIU:["Aljabar","Analogi"],
};

const UTBK_ACTION = [
  { day:"Senin",  act:"20 soal Peluang (PM)" },
  { day:"Selasa", act:"Review Fungsi & Logaritma" },
  { day:"Rabu",   act:"Mini Tryout (3 subtest)" },
  { day:"Kamis",  act:"20 soal Literasi Indonesia" },
  { day:"Jumat",  act:"Review Statistika & Barisan" },
];
const SKD_ACTION = [
  { day:"Senin",  act:"20 soal TWK Pancasila" },
  { day:"Selasa", act:"Review UUD 1945 & NKRI" },
  { day:"Rabu",   act:"Mini SKD Tryout" },
  { day:"Kamis",  act:"20 soal TIU Aljabar" },
  { day:"Jumat",  act:"Review TKP Karakteristik" },
];

const UTBK_TARGETS = [
  { univ:"UI",    jurusan:"Sistem Informasi", score:685 },
  { univ:"ITB",   jurusan:"Informatika",      score:720 },
  { univ:"UGM",   jurusan:"Ilmu Hukum",       score:675 },
  { univ:"UNPAD", jurusan:"Kedokteran",        score:740 },
];
const SKD_TARGETS = [
  { univ:"PKN STAN", jurusan:"D4 Akuntansi",           score:490 },
  { univ:"STIS",     jurusan:"D4 Statistika",           score:400 },
  { univ:"STMKG",    jurusan:"D4 Meteorologi",          score:380 },
  { univ:"Poltekim", jurusan:"D4 Hukum Keimigrasian",  score:360 },
];

const TRYOUT_LIST = [
  { id:1, label:"TO #1", status:"done",      score:618, chance:62, date:"12 Jan 2026" },
  { id:2, label:"TO #2", status:"available", score:null, chance:null, date:null },
  { id:3, label:"TO #3", status:"locked",    score:null, chance:null, date:null },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60); const sec = s % 60;
  return `${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
}

// ─── SVG Components ───────────────────────────────────────────────────────────
function SvgRadar({ axes, values, color }: { axes:string[]; values:number[]; color:string }) {
  const N=axes.length; const CX=110; const CY=110; const R=80;
  const pt  = (i:number,v:number) => { const a=(Math.PI*2*i)/N-Math.PI/2; return {x:CX+R*(v/100)*Math.cos(a),y:CY+R*(v/100)*Math.sin(a)}; };
  const ptR = (i:number)          => { const a=(Math.PI*2*i)/N-Math.PI/2; return {x:CX+R*Math.cos(a),y:CY+R*Math.sin(a)}; };
  const poly=values.map((v,i)=>pt(i,v)); const web=Array.from({length:N},(_,i)=>ptR(i));
  return (
    <svg width={220} height={220} viewBox="0 0 220 220">
      {[.25,.5,.75,1].map(r=><polygon key={r} points={web.map(p=>`${CX+(p.x-CX)*r},${CY+(p.y-CY)*r}`).join(" ")} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>)}
      {web.map((p,i)=><line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>)}
      <polygon points={poly.map(p=>`${p.x},${p.y}`).join(" ")} fill={color+"28"} stroke={color} strokeWidth={2} strokeLinejoin="round"/>
      {poly.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={4} fill={color}/>)}
      {web.map((p,i)=>{const lx=CX+(p.x-CX)*1.22;const ly=CY+(p.y-CY)*1.22;return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#6b7280" fontFamily={PP} fontWeight={600}>{axes[i]}</text>;})}
    </svg>
  );
}

function TrendLine({ data, labels, color, target, width=460, height=120 }: { data:number[]; labels:string[]; color:string; target?:number; width?:number; height?:number }) {
  const pad=30; const allVals = target ? [...data, target] : data;
  const mn=Math.min(...allVals)-30; const mx=Math.max(...allVals)+20;
  const px=(v:number)=>pad+((v-mn)/(mx-mn))*(width-2*pad);
  const py=(v:number)=>height-pad-((v-mn)/(mx-mn))*(height-2*pad);
  // Flip x for horizontal trend (left=old, right=new)
  const pts=data.map((v,i)=>({x:pad+(i/(data.length-1))*(width-2*pad),y:py(v)}));
  const path=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  const area=`${path} L ${pts[pts.length-1].x} ${height-pad} L ${pts[0].x} ${height-pad} Z`;
  const _ = px; // suppress unused warning
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      {[.25,.5,.75].map(r=><line key={r} x1={pad} y1={pad+(height-2*pad)*r} x2={width-pad} y2={pad+(height-2*pad)*r} stroke="rgba(0,0,0,0.05)" strokeWidth={1} strokeDasharray="4,3"/>)}
      {target && <line x1={pad} y1={py(target)} x2={width-pad} y2={py(target)} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="6,4"/>}
      {target && <text x={width-pad+4} y={py(target)} fontSize={9} fill="#22c55e" fontFamily={PP} fontWeight={700} dominantBaseline="middle">목표</text>}
      <path d={area} fill={`${color}15`}/>
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill={color}/>
          <text x={p.x} y={p.y-10} textAnchor="middle" fontSize={10} fill={color} fontFamily={PP} fontWeight={700}>{data[i]}</text>
          <text x={p.x} y={height-8} textAnchor="middle" fontSize={9} fill="#9ca3af" fontFamily={PP}>{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function ProjectionChart({ past, future, target, pastLabels, futureLabels, color, width=460, height=140 }: {
  past:number[]; future:number[]; target:number; pastLabels:string[]; futureLabels:string[]; color:string; width?:number; height?:number
}) {
  const pad=32; const all=[...past,...future,target];
  const mn=Math.min(...all)-30; const mx=Math.max(...all)+20;
  const totalPts=[...past,...future];
  const totalLabels=[...pastLabels,...futureLabels];
  const py=(v:number)=>height-pad-((v-mn)/(mx-mn))*(height-2*pad);
  const pts=totalPts.map((v,i)=>({x:pad+(i/(totalPts.length-1))*(width-2*pad),y:py(v)}));
  const pastPath=pts.slice(0,past.length).map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  const futurePath=pts.slice(past.length-1).map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      <line x1={pad} y1={py(target)} x2={width-pad} y2={py(target)} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="6,4"/>
      <text x={width-pad+4} y={py(target)} fontSize={9} fill="#22c55e" fontFamily={PP} fontWeight={700} dominantBaseline="middle">Target</text>
      <path d={pastPath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={futurePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" opacity={0.6}/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill={i<past.length?color:"white"} stroke={color} strokeWidth={2}/>
          <text x={p.x} y={p.y-10} textAnchor="middle" fontSize={10} fill={i<past.length?color:color+"99"} fontFamily={PP} fontWeight={700}>{totalPts[i]}</text>
          <text x={p.x} y={height-8} textAnchor="middle" fontSize={9} fill={i<past.length?"#6b7280":"#9ca3af"} fontFamily={PP}>{totalLabels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Guided Material Lists ────────────────────────────────────────────────────
const GUIDED_MATS: Record<string, {cat:string; items:{icon:string; name:string}[]}[]> = {
  PU: [
    { cat:"Penalaran Verbal",   items:[{icon:"🧠",name:"Gagasan Utama"},{icon:"💡",name:"Inti Kalimat"},{icon:"📝",name:"Kesimpulan Paragraf"},{icon:"🎯",name:"Makna Kata"}] },
    { cat:"Penalaran Analitis", items:[{icon:"🔍",name:"Hubungan Antar Kalimat"},{icon:"⚖️",name:"Silogisme"},{icon:"🔗",name:"Analogi"},{icon:"🌀",name:"Logika Deduktif"}] },
  ],
  PK: [
    { cat:"Aritmetika", items:[{icon:"💰",name:"Persentase"},{icon:"⚖️",name:"Rasio & Proporsi"},{icon:"🕐",name:"Laju & Waktu"}] },
    { cat:"Aljabar",    items:[{icon:"📐",name:"Persamaan Linear"},{icon:"📊",name:"Pertidaksamaan"},{icon:"🔢",name:"Fungsi"}] },
  ],
  LI: [
    { cat:"Pemahaman Bacaan", items:[{icon:"📖",name:"Gagasan Utama Teks"},{icon:"🎯",name:"Simpulan Paragraf"},{icon:"🔎",name:"Informasi Tersurat"}] },
    { cat:"Kebahasaan",       items:[{icon:"✍️",name:"Kalimat Efektif"},{icon:"📌",name:"Tanda Baca"},{icon:"📚",name:"Kosakata"}] },
  ],
  LE: [
    { cat:"Reading Comprehension", items:[{icon:"📖",name:"Main Idea"},{icon:"🔍",name:"Detail Finding"},{icon:"💭",name:"Inference"}] },
    { cat:"Grammar",                items:[{icon:"🔤",name:"Tenses"},{icon:"⚡",name:"Passive Voice"},{icon:"🔗",name:"Conjunctions"}] },
  ],
  PM: [
    { cat:"Aljabar & Fungsi", items:[{icon:"📐",name:"Persamaan Kuadrat"},{icon:"📊",name:"Fungsi & Grafik"},{icon:"🔢",name:"Logaritma"}] },
    { cat:"Statistika",       items:[{icon:"📈",name:"Mean, Median, Modus"},{icon:"🎲",name:"Peluang"},{icon:"📉",name:"Barisan Aritmetik"}] },
  ],
  TWK: [
    { cat:"Pancasila & Konstitusi", items:[{icon:"🇮🇩",name:"Pancasila"},{icon:"📜",name:"UUD 1945"},{icon:"🏛️",name:"Amandemen UUD"}] },
    { cat:"Nasionalisme",           items:[{icon:"🌟",name:"Wawasan Nusantara"},{icon:"🤝",name:"Bela Negara"},{icon:"🎯",name:"NKRI"}] },
  ],
  TIU: [
    { cat:"Verbal",  items:[{icon:"🔤",name:"Silogisme"},{icon:"🔗",name:"Analogi Verbal"},{icon:"📚",name:"Antonim & Sinonim"}] },
    { cat:"Numerik", items:[{icon:"🔢",name:"Deret Angka"},{icon:"➗",name:"Aljabar Dasar"},{icon:"📐",name:"Geometri"}] },
  ],
  TKP: [
    { cat:"Pelayanan Publik", items:[{icon:"👥",name:"Orientasi Pelayanan"},{icon:"🎯",name:"Integritas"},{icon:"💡",name:"Komitmen"}] },
    { cat:"Sosial Budaya",    items:[{icon:"🤝",name:"Kerjasama Tim"},{icon:"💬",name:"Komunikasi"},{icon:"🌟",name:"Kepemimpinan"}] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function UTBKPage({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  // ── Top-level view ────────────────────────────────────────────────────────
  const [view, setView] = useState<View>("landing");

  // ── Tab & Navigation ──────────────────────────────────────────────────────
  const [tab,  setTab]  = useState<Tab>("utbk");
  const [sect, setSect] = useState<Sect>("latihan");
  const [ls,   setLs]   = useState<LS>("home");
  const [ts,   setTs]   = useState<TS>("home");

  // ── Guided Practice Config ────────────────────────────────────────────────
  const [gSubs,     setGSubs]     = useState<string[]>(["PU","PM"]);
  const [gNumQ,     setGNumQ]     = useState(20);
  const [gTimer,    setGTimer]    = useState(false);
  const [gTimerMin, setGTimerMin] = useState(30);
  const [gReview,   setGReview]   = useState<"each"|"after">("after");

  // ── Custom Practice Config ────────────────────────────────────────────────
  const [cName,     setCName]     = useState("");
  const [cSubs,     setCSubs]     = useState<string[]>([]);
  const [cNumQ,     setCNumQ]     = useState(20);
  const [cTimer,    setCTimer]    = useState(false);
  const [cTimerMin, setCTimerMin] = useState(30);
  const [cReview,   setCReview]   = useState<"each"|"after">("after");

  // ── Exam State ────────────────────────────────────────────────────────────
  const [examQs,     setExamQs]    = useState<Q[]>([]);
  const [examAns,    setExamAns]   = useState<(number|null)[]>([]);
  const [examIdx,    setExamIdx]   = useState(0);
  const [elapsed,    setElapsed]   = useState(0);
  const [timerMax,   setTimerMax]  = useState(1800);
  const [timerOn,    setTimerOn]   = useState(false);
  const [reviewMode, setReviewMode]= useState<"each"|"after">("after");
  const [examSrc,    setExamSrc]   = useState<"latihan"|"tryout">("latihan");
  const [examMode,   setExamMode]  = useState<"guided"|"custom">("guided");
  const [showExpl,   setShowExpl]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  // ── Tryout Wizard ─────────────────────────────────────────────────────────
  const [toTargetIdx, setToTargetIdx] = useState(0);
  const [toTryoutId,  setToTryoutId]  = useState<number|null>(null);

  // ── Analysis ──────────────────────────────────────────────────────────────
  const [anaTab,    setAnaTab]    = useState<"trend"|"radar"|"weak"|"plan">("trend");
  const [hovTOIdx,  setHovTOIdx]  = useState<number|null>(null);
  const [expandSub, setExpandSub] = useState<string|null>(null);

  // ── Guided Learning (new) ─────────────────────────────────────────────────
  const [lsMode,        setLsMode]        = useState<"guided"|"custom">("guided");
  const [guidedSub,     setGuidedSub]     = useState("PU");
  const [showSubPicker, setShowSubPicker] = useState(false);
  const [matConfig,     setMatConfig]     = useState<string|null>(null);
  const [matNumQ,       setMatNumQ]       = useState(20);
  const [matCustomMode, setMatCustomMode] = useState(false);
  const [cCustomMode,   setCCustomMode]   = useState(false);
  const [matTimer,      setMatTimer]      = useState(false);
  const [matReview,     setMatReview]     = useState<"each"|"after">("after");
  const [matStatus,     setMatStatus]     = useState<Record<string, MatStatus>>({
    "Gagasan Utama": "completed", "Inti Kalimat": "continue",
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  const subs       = tab === "utbk" ? UTBK_SUBS    : SKD_SUBS;
  const allQs      = tab === "utbk" ? UTBK_QS      : SKD_QS;
  const perfData   = tab === "utbk" ? UTBK_PERF    : SKD_PERF;
  const weakTopics = tab === "utbk" ? UTBK_WEAK_TOPICS : SKD_WEAK_TOPICS;
  const actionPlan = tab === "utbk" ? UTBK_ACTION  : SKD_ACTION;
  const targets    = tab === "utbk" ? UTBK_TARGETS : SKD_TARGETS;
  const accentColor= tab === "utbk" ? BLUE         : GREEN;
  const accentLight= tab === "utbk" ? "#eff6ff"    : "#f0fdf4";
  const bgColor    = tab === "utbk" ? "#f5f6fb"    : "#f0fdf4";
  const curTarget  = targets[toTargetIdx];
  const aiWeakSub  = tab === "utbk" ? "PM" : "TIU";
  const aiWeakPct  = tab === "utbk" ? 68   : 72;
  const aiWeakLabel= subs.find(s=>s.key===aiWeakSub)?.label ?? aiWeakSub;
  const scoreHist  = tab === "utbk" ? [580,598,612,618] : [410,425,438,452];
  const scoreLabels= tab === "utbk" ? ["TO 1","TO 2","TO 3","TO 4"] : ["SKD 1","SKD 2","SKD 3","SKD 4"];
  const futurePred = tab === "utbk" ? [638,654,683]      : [462,475,492];
  const futureLabels= tab === "utbk" ? ["TO 5","TO 6","TO 7"] : ["SKD 5","SKD 6","SKD 7"];
  const curScore   = scoreHist[scoreHist.length-1];
  const tgtScore   = curTarget.score;
  const predEstim  = tab === "utbk" ? 672 : 480;

  // ── Timer Effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    const inExam = ls === "exam" || ts === "exam";
    if (!inExam) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [ls, ts]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (timerOn && elapsed >= timerMax) finishExam();
  }, [elapsed, timerOn, timerMax]);

  // ── Functions ─────────────────────────────────────────────────────────────
  function switchTab(t: Tab) {
    setTab(t); setSect("latihan"); setLs("home"); setTs("home");
    setGuidedSub(t === "utbk" ? "PU" : "TWK");
  }

  function generateQs(selSubs: string[], num: number): Q[] {
    const pool: Q[] = [];
    selSubs.forEach(sk => {
      const subQs = allQs.filter(q => q.sub === sk);
      pool.push(...shuffle(subQs));
    });
    const result: Q[] = [];
    let i = 0;
    while (result.length < num && i < num * 2) {
      result.push(pool[i % pool.length]);
      i++;
    }
    return result.slice(0, num);
  }

  function startGuidedExam() {
    const qs = generateQs(gSubs.length ? gSubs : [subs[0].key], gNumQ);
    setExamQs(qs); setExamAns(Array(qs.length).fill(null));
    setExamIdx(0); setElapsed(0); setTimerOn(gTimer); setTimerMax(gTimerMin*60);
    setReviewMode(gReview); setExamSrc("latihan"); setExamMode("guided"); setShowExpl(false);
    setLs("exam");
  }

  function startCustomExam() {
    const useSubs = cSubs.length ? cSubs : [subs[0].key];
    const qs = generateQs(useSubs, cNumQ);
    setExamQs(qs); setExamAns(Array(qs.length).fill(null));
    setExamIdx(0); setElapsed(0); setTimerOn(cTimer); setTimerMax(cTimerMin*60);
    setReviewMode(cReview); setExamSrc("latihan"); setExamMode("custom"); setShowExpl(false);
    setLs("exam");
  }

  function startTryoutExam() {
    const qs = generateQs(subs.map(s=>s.key), Math.min(20, allQs.length));
    setExamQs(qs); setExamAns(Array(qs.length).fill(null));
    setExamIdx(0); setElapsed(0); setTimerOn(true); setTimerMax(45*60);
    setReviewMode("after"); setExamSrc("tryout"); setExamMode("guided"); setShowExpl(false);
    setTs("exam");
  }

  function startMatExam() {
    const currentMat = matConfig;
    const qs = generateQs([guidedSub], matNumQ);
    setExamQs(qs); setExamAns(Array(qs.length).fill(null));
    setExamIdx(0); setElapsed(0); setTimerOn(matTimer); setTimerMax(30*60);
    setReviewMode(matReview); setExamSrc("latihan"); setExamMode("guided"); setShowExpl(false);
    setLs("exam");
    setMatConfig(null);
    if (currentMat) setMatStatus(prev => ({...prev, [currentMat]: "continue"}));
  }

  function selectAnswer(i: number) {
    const updated = [...examAns]; updated[examIdx] = i;
    setExamAns(updated); setShowExpl(reviewMode === "each");
  }

  function finishExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (examSrc === "latihan") setLs("results");
    else setTs("report");
  }

  function getResults() {
    let correct=0; let wrong=0; let blank=0;
    examAns.forEach((a,i)=>{ if(a===null) blank++; else if(a===examQs[i]?.ans) correct++; else wrong++; });
    const total=examQs.length; const acc=total?Math.round((correct/total)*100):0;
    const score=Math.round(200+(acc/100)*600);
    const perSub: Record<string,{correct:number;total:number}> = {};
    examQs.forEach((q,i) => {
      if (!perSub[q.sub]) perSub[q.sub]={correct:0,total:0};
      perSub[q.sub].total++;
      if(examAns[i]===q.ans) perSub[q.sub].correct++;
    });
    return {correct,wrong,blank,total,acc,score,perSub};
  }

  // ─── EXAM VIEW ─────────────────────────────────────────────────────────────
  if (ls === "exam" || ts === "exam") {
    const q = examQs[examIdx];
    const chosen = examAns[examIdx];
    const answered = chosen !== null;
    const isTimerMode = timerOn;
    const remaining = timerMax - elapsed;
    const timerStr = isTimerMode ? formatTime(Math.max(0,remaining)) : formatTime(elapsed);
    const timerColor = isTimerMode && remaining < 120 ? "#ef4444" : accentColor;
    const prog = examQs.filter((_,i)=>examAns[i]!==null).length;
    const subMeta = subs.find(s=>s.key===q?.sub);

    return (
      <div className="flex flex-col flex-1 overflow-hidden" style={{background:bgColor}}>
        {/* Header */}
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3 flex items-center gap-3">
          <button onClick={() => { if(timerRef.current) clearInterval(timerRef.current); examSrc==="latihan"?setLs("home"):setTs("home"); }} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]" style={{outline:"none"}}><X size={14}/></button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#1a1d2e]" style={{fontFamily:PP}}>{prog}/{examQs.length} soal</span>
              <div className="flex items-center gap-2">
                <Clock size={13} style={{color:timerColor}}/>
                <span className="text-[13px] font-black" style={{color:timerColor,fontFamily:PP}}>{timerStr}</span>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{width:`${(prog/examQs.length)*100}%`,background:accentColor}}/>
            </div>
          </div>
        </div>

        {/* Question dots */}
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.05)] px-6 py-2 flex gap-1 overflow-x-auto">
          {examQs.map((_,i) => (
            <button key={i} onClick={() => { if(reviewMode==="after"||examAns[i]!==null) setExamIdx(i); }}
              className="w-5 h-5 rounded-md shrink-0 transition-all"
              style={{background: examIdx===i ? accentColor : examAns[i]!==null ? accentColor+"60" : "#e5e7eb", outline:"none"}}/>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {q && (
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              {/* Subtest badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{background:subMeta?.light,color:subMeta?.color,fontFamily:PP}}>{subMeta?.label ?? q.sub}</span>
                <span className="text-[10px] font-semibold text-[#9ca3af] px-2 py-1 rounded-lg bg-white border border-[rgba(0,0,0,0.07)]" style={{fontFamily:PP}}>📚 {q.topic}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${q.diff==="Mudah"?"bg-[#f0fdf4] text-[#059669]":q.diff==="Sedang"?"bg-[#fffbeb] text-[#f1ad00]":"bg-[#fef2f2] text-[#ef4444]"}`} style={{fontFamily:PP}}>{q.diff}</span>
              </div>

              {/* Question */}
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                <p className="text-[13px] font-medium text-[#1a1d2e] leading-relaxed" style={{fontFamily:PP}}>
                  <span className="font-black" style={{color:accentColor}}>{examIdx+1}. </span>{q.q}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.opts.map((opt,i) => {
                  const isSelected = chosen === i;
                  const isCorrect  = i === q.ans;
                  const showResult = showExpl && answered;
                  let bg = "white"; let border = "rgba(0,0,0,0.08)"; let textColor = "#374151";
                  if (showResult) {
                    if (isCorrect) { bg="#f0fdf4"; border="#86efac"; textColor="#059669"; }
                    else if (isSelected) { bg="#fef2f2"; border="#fca5a5"; textColor="#ef4444"; }
                  } else if (isSelected) { bg=accentLight; border=accentColor; textColor=accentColor; }
                  return (
                    <button key={i} onClick={() => { if(!showExpl) selectAnswer(i); }}
                      className="w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-3"
                      style={{background:bg,borderColor:border,color:textColor,fontFamily:PP,outline:"none"}}>
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 border" style={{borderColor:border,color:textColor,background:"rgba(0,0,0,0.03)"}}>
                        {["A","B","C","D"][i]}
                      </span>
                      <span className="text-[13px] font-medium">{opt}</span>
                      {showResult && isCorrect && <CheckCircle size={14} className="ml-auto shrink-0 text-[#059669]"/>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExpl && answered && (
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-4">
                  <p className="text-[10px] font-bold mb-1" style={{color:accentColor,fontFamily:PP}}>📖 Pembahasan</p>
                  <p className="text-[12px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>{q.exp}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-2">
                <button onClick={() => { setExamIdx(i=>Math.max(0,i-1)); setShowExpl(false); }}
                  disabled={examIdx===0}
                  className="flex-1 py-3 rounded-xl border text-[13px] font-bold disabled:opacity-30 hover:bg-white transition-all"
                  style={{fontFamily:PP,outline:"none",borderColor:"rgba(0,0,0,0.1)",color:"#374151"}}>← Soal Sebelumnya</button>
                {examIdx < examQs.length-1
                  ? <button onClick={() => { setExamIdx(i=>i+1); setShowExpl(false); }}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                      style={{background:accentColor,fontFamily:PP,outline:"none"}}>Soal Berikutnya →</button>
                  : <button onClick={finishExam}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                      style={{background:"#22c55e",fontFamily:PP,outline:"none"}}>Selesai ✓</button>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LATIHAN RESULTS ──────────────────────────────────────────────────────
  if (sect === "latihan" && ls === "results") {
    const res = getResults();
    const { correct, wrong, blank, total, acc, score, perSub } = res;
    const prevAcc = 76; const diff = acc - prevAcc;
    const subKeys = Object.keys(perSub);

    return (
      <div className="flex flex-col flex-1 overflow-hidden" style={{background:bgColor}}>
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => setLs("home")} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center" style={{outline:"none"}}><ArrowLeft size={14}/></button>
          <p className="text-[15px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Hasil Latihan</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">

            {/* Card 1: Score */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-6 py-6 text-center" style={{background:`linear-gradient(135deg,${accentLight},white)`}}>
                <p className="text-[12px] font-bold text-[#9ca3af] mb-2" style={{fontFamily:PP}}>✅ Latihan Selesai</p>
                <div className="flex items-center justify-center gap-8 mb-2">
                  <div className="text-center">
                    <p className="text-[11px] text-[#9ca3af] mb-1" style={{fontFamily:PP}}>Score</p>
                    <p className="text-[48px] font-black leading-none" style={{color:accentColor,fontFamily:PP}}>{score}</p>
                  </div>
                  <div className="w-px h-12 bg-[rgba(0,0,0,0.08)]"/>
                  <div className="text-center">
                    <p className="text-[11px] text-[#9ca3af] mb-1" style={{fontFamily:PP}}>Akurasi</p>
                    <p className="text-[48px] font-black leading-none" style={{color:acc>=80?"#22c55e":acc>=60?"#f1ad00":"#ef4444",fontFamily:PP}}>{acc}%</p>
                  </div>
                  <div className="w-px h-12 bg-[rgba(0,0,0,0.08)]"/>
                  <div className="text-center">
                    <p className="text-[11px] text-[#9ca3af] mb-1" style={{fontFamily:PP}}>Durasi</p>
                    <p className="text-[22px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{formatTime(elapsed)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Correct / Wrong / Blank */}
            <div className="grid grid-cols-3 gap-3">
              {[{lbl:"Benar",val:correct,c:"#22c55e",bg:"#f0fdf4"},{lbl:"Salah",val:wrong,c:"#ef4444",bg:"#fef2f2"},{lbl:"Kosong",val:blank,c:"#9ca3af",bg:"#f5f6fb"}].map(({lbl,val,c,bg}) => (
                <div key={lbl} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{background:bg}}>
                    <span className="text-[18px]">{lbl==="Benar"?"✅":lbl==="Salah"?"❌":"⬜"}</span>
                  </div>
                  <p className="text-[28px] font-black" style={{color:c,fontFamily:PP}}>{val}</p>
                  <p className="text-[11px] text-[#9ca3af]" style={{fontFamily:PP}}>{lbl} / {total}</p>
                </div>
              ))}
            </div>

            {/* Card 3: AI Insight */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{color:accentColor}}/>
                <p className="text-[13px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>AI Insight</p>
              </div>
              <div className="p-4 rounded-xl" style={{background:accentLight}}>
                <p className="text-[14px] font-black mb-1" style={{color:accentColor,fontFamily:PP}}>{acc>=80?"🎉 Great Job!":acc>=60?"💪 Tetap Semangat!":"📚 Perlu Lebih Banyak Latihan"}</p>
                <p className="text-[12px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                  {diff>=0
                    ? `Kamu mengalami peningkatan +${diff}% dibanding sesi sebelumnya. ${acc<80?"Namun beberapa subtest masih perlu perhatian lebih.":""}`
                    : `Akurasimu turun ${Math.abs(diff)}% dari sesi sebelumnya. Jangan menyerah — identifikasi topik lemah dan latihan lebih terfokus.`
                  }
                </p>
              </div>
            </div>

            {/* Card 4: Per Subtest */}
            {subKeys.length > 0 && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>📊 Performa per Subtest</p>
                <div className="flex flex-col gap-3">
                  {subKeys.map(sk => {
                    const meta = subs.find(s=>s.key===sk);
                    const d = perSub[sk];
                    const pct = d.total ? Math.round((d.correct/d.total)*100) : 0;
                    return (
                      <div key={sk}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{meta?.label??sk}</span>
                          <span className="text-[12px] font-black" style={{color:meta?.color??accentColor,fontFamily:PP}}>{pct}%</span>
                        </div>
                        <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:meta?.color??accentColor}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card 5: AI Recommendation */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-3" style={{fontFamily:PP}}>🤖 AI Recommendation</p>
              <p className="text-[11px] text-[#9ca3af] mb-3" style={{fontFamily:PP}}>Selanjutnya, AI menyarankan:</p>
              {[`Review pembahasan soal yang salah`,`Kerjakan latihan ${aiWeakLabel}`,`Ikuti Tryout Mingguan`].map((r,i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <Check size={12} style={{color:"#22c55e"}} className="shrink-0"/>
                  <span className="text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{r}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setLs("exam")} className="flex-1 py-2.5 rounded-xl border text-[12px] font-bold text-[#374151] hover:bg-[#f5f6fb] transition-all" style={{fontFamily:PP,outline:"none",borderColor:"rgba(0,0,0,0.1)"}}>Kerjakan Lagi</button>
                <button onClick={() => setLs("home")}  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all" style={{background:accentColor,fontFamily:PP,outline:"none"}}>Latihan Lain →</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─── TRYOUT REPORT ────────────────────────────────────────────────────────
  if (sect === "tryout" && ts === "report") {
    const res = getResults();
    const { correct, wrong, blank, acc, perSub } = res;
    const toScore = Math.round(200+(acc/100)*600);
    const toChance = Math.round(acc * 0.72);
    const subKeys = Object.keys(perSub);
    const weakSubKeys = Object.keys(weakTopics);

    return (
      <div className="flex flex-col flex-1 overflow-hidden" style={{background:bgColor}}>
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3.5 flex items-center gap-3">
          <button onClick={()=>{setTs("home");}} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center" style={{outline:"none"}}><ArrowLeft size={14}/></button>
          <p className="text-[15px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Laporan Tryout</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">

            {/* Hero */}
            <div className="rounded-3xl overflow-hidden text-white" style={{background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`}}>
              <div className="px-6 py-8 text-center">
                <p className="text-[13px] font-bold opacity-70 mb-1" style={{fontFamily:PP}}>🎉 Congratulations</p>
                <p className="text-[64px] font-black leading-none mb-1" style={{fontFamily:PP}}>{toScore}</p>
                <p className="text-[13px] opacity-70" style={{fontFamily:PP}}>{curTarget.univ} — {curTarget.jurusan}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="px-4 py-2 rounded-xl bg-white/20 text-center">
                    <p className="text-[10px] opacity-70" style={{fontFamily:PP}}>Peluang Lolos</p>
                    <p className="text-[22px] font-black" style={{fontFamily:PP}}>{toChance}%</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 text-center">
                    <p className="text-[10px] opacity-70" style={{fontFamily:PP}}>Benar</p>
                    <p className="text-[22px] font-black" style={{fontFamily:PP}}>{correct}/{correct+wrong+blank}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 text-center">
                    <p className="text-[10px] opacity-70" style={{fontFamily:PP}}>Akurasi</p>
                    <p className="text-[22px] font-black" style={{fontFamily:PP}}>{acc}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Projection */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-1" style={{fontFamily:PP}}>📈 Score Projection</p>
              <p className="text-[10px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Proyeksi skor jika tren peningkatan konsisten</p>
              <ProjectionChart
                past={[...scoreHist.slice(-2), toScore]}
                future={futurePred}
                target={curTarget.score}
                pastLabels={[...scoreLabels.slice(-2), "TO #2"]}
                futureLabels={futureLabels}
                color={accentColor}/>
              <div className="mt-3 p-3.5 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-bold mb-1" style={{color:accentColor,fontFamily:PP}}>🤖 AI berkata</p>
                <p className="text-[11px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                  Apabila tren peningkatanmu tetap konsisten, target <strong>{curTarget.univ}</strong> diperkirakan tercapai dalam <strong>3 Tryout lagi</strong>.
                </p>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>🎯 Gap Analisis</p>
              <div className="grid grid-cols-3 gap-3">
                {[{lbl:"Target",val:curTarget.score,c:"#22c55e"},{lbl:"Current",val:toScore,c:accentColor},{lbl:"Gap",val:curTarget.score-toScore,c:"#ef4444"}].map(({lbl,val,c})=>(
                  <div key={lbl} className="text-center p-4 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.06)]">
                    <p className="text-[10px] text-[#9ca3af] mb-1" style={{fontFamily:PP}}>{lbl}</p>
                    <p className="text-[28px] font-black" style={{color:c,fontFamily:PP}}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar */}
            {subKeys.length > 0 && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>🕸️ Performa Subtest</p>
                <div className="flex justify-center">
                  <SvgRadar axes={subKeys.map(k=>subs.find(s=>s.key===k)?.key??k)} values={subKeys.map(k=>{ const d=perSub[k]; return d.total?Math.round((d.correct/d.total)*100):0; })} color={accentColor}/>
                </div>
              </div>
            )}

            {/* Performance Ranking */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>🏆 Performance Ranking</p>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0" style={{background:accentLight}}>
                  <p className="text-[24px] font-black" style={{color:accentColor,fontFamily:PP}}>Top</p>
                  <p className="text-[14px] font-black" style={{color:accentColor,fontFamily:PP}}>28%</p>
                </div>
                <div>
                  <p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Kamu berada di Top 28% Peserta</p>
                  <p className="text-[11px] text-[#6b7280] mt-1" style={{fontFamily:PP}}>Terus tingkatkan skor untuk masuk ke Top 15% — zona aman untuk {curTarget.univ}.</p>
                </div>
              </div>
            </div>

            {/* Time Analysis */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>⏱️ Time Analysis</p>
              <div className="flex flex-col gap-2.5">
                {[{icon:"🟢",lbl:"Cepat & Benar",val:15,c:"#22c55e"},{icon:"🟡",lbl:"Lambat tapi Benar",val:8,c:"#f1ad00"},{icon:"🔴",lbl:"Cepat tapi Salah",val:6,c:"#ef4444"},{icon:"⚪",lbl:"Kosong",val:4,c:"#9ca3af"}].map(({icon,lbl,val,c})=>(
                  <div key={lbl} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8faff] border border-[rgba(0,0,0,0.05)]">
                    <span className="text-lg">{icon}</span>
                    <span className="flex-1 text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{lbl}</span>
                    <span className="text-[16px] font-black" style={{color:c,fontFamily:PP}}>{val} soal</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topics */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4"><Star size={14} className="text-[#f1ad00]"/><p className="text-[13px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>⭐ Weak Topics</p></div>
              <div className="flex flex-col gap-3">
                {weakSubKeys.map(sk => {
                  const meta = subs.find(s=>s.key===sk);
                  const isOpen = expandSub === sk;
                  return (
                    <div key={sk} className="rounded-xl border border-[rgba(0,0,0,0.06)] overflow-hidden">
                      <button onClick={() => setExpandSub(isOpen?null:sk)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#f8faff]" style={{outline:"none"}}>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{background:meta?.color??accentColor}}/>
                          <span className="text-[12px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{meta?.label??sk}</span>
                        </div>
                        <ChevronDown size={14} className={`text-[#9ca3af] transition-transform ${isOpen?"rotate-180":""}`}/>
                      </button>
                      {isOpen && (
                        <div className="px-4 py-3 bg-white">
                          <p className="text-[10px] font-bold mb-2" style={{color:meta?.color??accentColor,fontFamily:PP}}>Materi yang masih lemah:</p>
                          <div className="flex flex-col gap-1.5 mb-3">
                            {weakTopics[sk].map(t => (
                              <div key={t} className="flex items-center gap-2">
                                <Check size={11} className="text-[#ef4444] shrink-0"/>
                                <span className="text-[11px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{t}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={()=>{setSect("latihan"); setLsMode("guided"); setGuidedSub(sk);}}
                            className="w-full py-2 rounded-xl text-[11px] font-bold text-white hover:opacity-90 transition-all"
                            style={{background:meta?.color??accentColor,fontFamily:PP,outline:"none"}}>
                            Review Materi →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Action Plan */}
            <div className="rounded-2xl overflow-hidden" style={{background:`linear-gradient(135deg,${accentColor}18,${accentColor}08)`,border:`1px solid ${accentColor}25`}}>
              <div className="px-5 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={15} style={{color:accentColor}}/>
                  <p className="text-[13px] font-black" style={{color:accentColor,fontFamily:PP}}>Action Plan AI</p>
                </div>
                <p className="text-[13px] text-[#374151] leading-relaxed mb-4" style={{fontFamily:PP}}>
                  Berdasarkan hasil tryout ini, AI telah menyiapkan rencana belajar personal untukmu. Mulai sekarang dan capai target {tab==="utbk"?"PTN":"kedinasan"} impianmu!
                </p>
                <button onClick={()=>onNavigate?.("action")}
                  className="w-full py-3.5 rounded-xl text-[13px] font-black text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{background:accentColor,fontFamily:PP,outline:"none"}}>
                  Lihat Action Plan →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN HOME ────────────────────────────────────────────────────────────
  // ─── Landing Page ──────────────────────────────────────────────────────────
  if (view === "landing") {
    const PTN_JALUR = [
      { key:"SNBP", color:"#0965fa", points:["Seleksi berdasarkan prestasi akademik.","Tanpa tes.","Hanya siswa eligible."] },
      { key:"SNBT", color:"#00b2dd", points:["Seleksi berdasarkan nilai UTBK.","Menggunakan hasil TPS dan Tes Literasi.",""] },
      { key:"Mandiri", color:"#8b5cf6", points:["Jalur yang diselenggarakan masing-masing universitas.","Mekanisme berbeda setiap kampus.",""] },
    ];
    const UTBK_MATERI = [
      { icon:"🧠", label:"Penalaran Umum",           color:"#0965fa" },
      { icon:"📐", label:"Pengetahuan Kuantitatif",   color:"#8b5cf6" },
      { icon:"📖", label:"Literasi Bahasa Indonesia", color:"#00b2dd" },
      { icon:"🌏", label:"Literasi Bahasa Inggris",   color:"#f1ad00" },
      { icon:"📊", label:"Penalaran Matematika",      color:"#ef4444" },
    ];
    const SKD_TAHAPAN = ["Administrasi","SKD","SKB","Pengumuman"];
    const SKD_KEUNGGULAN = [
      { icon:"🎯", label:"Ikatan Dinas" },
      { icon:"💰", label:"Biaya Pendidikan" },
      { icon:"🚀", label:"Prospek Karier" },
      { icon:"🏛", label:"Penempatan Instansi" },
    ];
    const SKD_MATERI = [
      { key:"TWK", full:"Tes Wawasan Kebangsaan",    color:"#059669" },
      { key:"TIU", full:"Tes Intelegensi Umum",      color:"#0891b2" },
      { key:"TKP", full:"Tes Karakteristik Pribadi", color:"#7c3aed" },
    ];

    return (
      <div className="flex flex-col flex-1 overflow-hidden" style={{background:"#f5f6fb"}}>
        {/* Page header */}
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-4">
          <p className="text-[17px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>📚 UTBK & SKD Planner</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto px-5 py-5 flex flex-col gap-5">

            {/* ── 1. Hero ──────────────────────────────────────────── */}
            <div className="rounded-3xl overflow-hidden shadow-sm" style={{background:`linear-gradient(135deg,${BLUE},#00b2dd)`}}>
              <div className="px-6 py-7">
                <p className="text-[22px] font-black text-white leading-snug mb-2" style={{fontFamily:PP}}>
                  Prepare Today,<br/>Achieve Tomorrow
                </p>
                <p className="text-[13px] text-white/80 leading-relaxed mb-6" style={{fontFamily:PP}}>
                  Mulailah persiapan masuk Perguruan Tinggi Negeri maupun Sekolah Kedinasan sejak sekarang. Pelajari sistem seleksi, pahami materi ujian, dan tingkatkan kemampuanmu melalui latihan yang dipersonalisasi oleh AI.
                </p>
                {/* Illustration */}
                <div className="flex items-center justify-center gap-0 py-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🎓</div>
                    <p className="text-[10px] font-black text-white" style={{fontFamily:PP}}>PTN</p>
                    <div className="w-0.5 h-6 bg-white/40 rounded"/>
                  </div>
                  <div className="flex flex-col items-center mx-8">
                    <div className="w-1 h-6 bg-white/40 rounded mb-0"/>
                    <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-3xl border-2 border-white/40">👩‍🎓</div>
                    <div className="w-1 h-6 bg-white/40 rounded mt-0"/>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-6 bg-white/40 rounded"/>
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🏛</div>
                    <p className="text-[10px] font-black text-white" style={{fontFamily:PP}}>Kedinasan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. PTN Information ───────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                <p className="text-[17px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>🎓 Persiapan Perguruan Tinggi Negeri</p>
              </div>

              {/* Apa itu PTN */}
              <div className="px-6 py-3">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-1.5" style={{fontFamily:PP}}>Apa itu PTN?</p>
                <p className="text-[13px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                  Perguruan Tinggi Negeri adalah institusi pendidikan tinggi milik pemerintah yang menawarkan berbagai program studi unggulan. Masuk PTN melalui seleksi nasional yang kompetitif dengan ribuan peminat setiap tahunnya.
                </p>
              </div>

              {/* Jalur Masuk timeline */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-4" style={{fontFamily:PP}}>Jalur Masuk PTN</p>
                <div className="flex items-start gap-0">
                  {PTN_JALUR.map((j,i) => (
                    <div key={j.key} className="flex-1 flex flex-col items-center">
                      <div className="flex items-center w-full">
                        {i > 0 && <div className="flex-1 h-0.5 bg-[#e8ecf8]"/>}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0" style={{background:j.color,fontFamily:PP}}>{j.key[0]}</div>
                        {i < PTN_JALUR.length-1 && <div className="flex-1 h-0.5 bg-[#e8ecf8]"/>}
                      </div>
                      <p className="text-[12px] font-black mt-1.5 text-center" style={{color:j.color,fontFamily:PP}}>{j.key}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {PTN_JALUR.map(j => (
                    <div key={j.key} className="p-3 rounded-xl" style={{background:j.color+"10",border:`1.5px solid ${j.color}25`}}>
                      <p className="text-[11px] font-black mb-1.5" style={{color:j.color,fontFamily:PP}}>{j.key}</p>
                      {j.points.filter(Boolean).map(p => (
                        <p key={p} className="text-[10px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>• {p}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Materi UTBK */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-3" style={{fontFamily:PP}}>Materi UTBK</p>
                <div className="flex flex-col gap-2">
                  {UTBK_MATERI.map(m => (
                    <div key={m.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:m.color+"10"}}>
                      <span className="text-lg shrink-0">{m.icon}</span>
                      <span className="text-[13px] font-bold" style={{color:m.color,fontFamily:PP}}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tips */}
              <div className="mx-6 mb-6 p-4 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe]">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <p className="text-[12px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                    AI menyarankan mulai berlatih sejak kelas 10 agar perkembangan kemampuan dapat dipantau secara bertahap melalui Action Plan.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. SKD Information ───────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                <p className="text-[17px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>🏛 Sekolah Kedinasan</p>
              </div>

              {/* Apa itu */}
              <div className="px-6 py-3">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-1.5" style={{fontFamily:PP}}>Apa itu Sekolah Kedinasan?</p>
                <p className="text-[13px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                  Sekolah Kedinasan adalah perguruan tinggi yang diselenggarakan oleh kementerian atau lembaga pemerintah. Lulusan mendapatkan ikatan dinas dan langsung bekerja sebagai ASN setelah lulus.
                </p>
              </div>

              {/* Keunggulan */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-3" style={{fontFamily:PP}}>Keunggulan Kedinasan</p>
                <div className="grid grid-cols-2 gap-2">
                  {SKD_KEUNGGULAN.map(k => (
                    <div key={k.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f0fdf4] border border-[#86efac]">
                      <span className="text-xl shrink-0">{k.icon}</span>
                      <span className="text-[12px] font-black text-[#15803d]" style={{fontFamily:PP}}>{k.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tahapan Seleksi */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-4" style={{fontFamily:PP}}>Tahapan Seleksi</p>
                <div className="flex items-center gap-0">
                  {SKD_TAHAPAN.map((t,i) => (
                    <div key={t} className="flex-1 flex flex-col items-center">
                      <div className="flex items-center w-full">
                        {i > 0 && <div className="flex-1 h-0.5 bg-[#86efac]"/>}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{background:GREEN}}>
                          {i+1}
                        </div>
                        {i < SKD_TAHAPAN.length-1 && <div className="flex-1 h-0.5 bg-[#86efac]"/>}
                      </div>
                      <p className="text-[9px] font-black text-[#374151] mt-1 text-center" style={{fontFamily:PP}}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materi SKD */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wider mb-3" style={{fontFamily:PP}}>Materi SKD</p>
                <div className="flex flex-col gap-2">
                  {SKD_MATERI.map(m => (
                    <div key={m.key} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:m.color+"10"}}>
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-lg text-white shrink-0" style={{background:m.color,fontFamily:PP}}>{m.key}</span>
                      <span className="text-[12px] font-bold" style={{color:m.color,fontFamily:PP}}>{m.full}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tips */}
              <div className="mx-6 mb-6 p-4 rounded-2xl bg-[#f0fdf4] border border-[#86efac]">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <p className="text-[12px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                    Latihan secara konsisten sejak kelas 10 akan membantu meningkatkan kecepatan berpikir dan akurasi dalam menghadapi SKD.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 4. Choose Your Preparation ───────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <p className="text-[20px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Start Your Preparation</p>
                <p className="text-[13px] text-[#6b7280] mt-1 leading-relaxed" style={{fontFamily:PP}}>
                  Pilih jalur persiapan yang sesuai dengan targetmu. Kamu dapat mempelajari keduanya apabila masih dalam tahap eksplorasi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* PTN Card */}
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden flex flex-col">
                  <div className="px-4 py-4" style={{background:`linear-gradient(135deg,#eff6ff,white)`}}>
                    <p className="text-[16px] mb-1">🎓</p>
                    <p className="text-[14px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>PTN Preparation</p>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    {["Guided Practice","Custom Practice","Tryout UTBK","Performance Analysis"].map(f => (
                      <div key={f} className="flex items-center gap-2 py-1">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:BLUE}}/>
                        <span className="text-[11px] text-[#374151]" style={{fontFamily:PP}}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <button onClick={() => { setView("planner"); setTab("utbk"); setSect("latihan"); }}
                      className="w-full py-2.5 rounded-xl text-[12px] font-black text-white hover:opacity-90 active:scale-95 transition-all"
                      style={{background:`linear-gradient(90deg,${BLUE},#00b2dd)`,fontFamily:PP,outline:"none"}}>
                      Start PTN Preparation
                    </button>
                  </div>
                </div>
                {/* SKD Card */}
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden flex flex-col">
                  <div className="px-4 py-4" style={{background:`linear-gradient(135deg,#f0fdf4,white)`}}>
                    <p className="text-[16px] mb-1">🏛</p>
                    <p className="text-[14px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>SKD Preparation</p>
                  </div>
                  <div className="px-4 py-3 flex-1">
                    {["Guided Practice","Custom Practice","Tryout SKD","Performance Analysis"].map(f => (
                      <div key={f} className="flex items-center gap-2 py-1">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:GREEN}}/>
                        <span className="text-[11px] text-[#374151]" style={{fontFamily:PP}}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <button onClick={() => { setView("planner"); setTab("kedinasan"); setSect("latihan"); }}
                      className="w-full py-2.5 rounded-xl text-[12px] font-black text-white hover:opacity-90 active:scale-95 transition-all"
                      style={{background:`linear-gradient(90deg,${GREEN}cc,${GREEN})`,fontFamily:PP,outline:"none"}}>
                      Start SKD Preparation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4"/>
          </div>
        </div>
      </div>
    );
  }

  // ─── Planner (existing UI) ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)]">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setView("landing")} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]" style={{outline:"none"}}>
            <ArrowLeft size={14}/>
          </button>
          <div className="flex-1">
            <p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>
              {tab==="utbk" ? "🎓 PTN Preparation" : "🏛️ SKD Preparation"}
            </p>
            <p className="text-[11px] text-[#9ca3af]" style={{fontFamily:PP}}>
              {tab==="utbk" ? "Persiapan UTBK / SNBT" : "Persiapan SKD Kedinasan"}
            </p>
          </div>
        </div>
        {/* Segmented control */}
        <div className="px-5 pb-3 pt-2">
          <div className="flex p-1 rounded-2xl" style={{background:"#f0f2f8"}}>
            {(["latihan","tryout","laporan"] as const).map((key) => (
              <button key={key} onClick={()=>setSect(key)}
                className="flex-1 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{
                  background: sect===key ? "white" : "transparent",
                  color: sect===key ? "#1a1d2e" : "#9ca3af",
                  boxShadow: sect===key ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  fontFamily: PP, outline: "none",
                }}>
                {key==="latihan" ? "Latihan Soal" : key==="tryout" ? "Tryout" : "Laporan"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{background:bgColor}}>

        {/* ── LATIHAN SOAL TAB ── */}
        {sect === "latihan" && (
          <div className="px-5 py-5 max-w-xl mx-auto flex flex-col gap-4">
            {/* Mode toggle */}
            <div className="flex p-1 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm">
              {(["guided","custom"] as const).map((m) => (
                <button key={m} onClick={()=>setLsMode(m)}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all"
                  style={{background:lsMode===m?accentColor:"transparent",color:lsMode===m?"white":"#9ca3af",fontFamily:PP,outline:"none"}}>
                  {m==="guided"?"Guided Learning":"Custom Practice"}
                </button>
              ))}
            </div>

            {/* ── GUIDED LEARNING ── */}
            {lsMode === "guided" && (
              <>
                {/* Progress card */}
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                  <div className="px-5 py-4" style={{background:`linear-gradient(135deg,${accentLight},white)`}}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-[#9ca3af] mb-1" style={{fontFamily:PP}}>Subtest aktif</p>
                        <p className="text-[18px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>
                          {subs.find(s=>s.key===guidedSub)?.label ?? guidedSub}
                        </p>
                      </div>
                      <button onClick={()=>setShowSubPicker(true)}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold border bg-white"
                        style={{borderColor:accentColor,color:accentColor,fontFamily:PP,outline:"none"}}>
                        Ganti Subtes
                      </button>
                    </div>
                    {/* Progress bar */}
                    {(() => {
                      const mats = (GUIDED_MATS[guidedSub] ?? []).flatMap(c=>c.items);
                      const done = mats.filter(m=>matStatus[m.name]==="completed").length;
                      const pct = mats.length ? Math.round((done/mats.length)*100) : 0;
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-[#9ca3af]" style={{fontFamily:PP}}>Progress materi</span>
                            <span className="text-[10px] font-bold" style={{color:accentColor,fontFamily:PP}}>{done}/{mats.length}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.5)"}}>
                            <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:accentColor}}/>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Material list grouped by category */}
                {(GUIDED_MATS[guidedSub] ?? []).map(({cat, items}) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-[rgba(0,0,0,0.04)]">
                      <p className="text-[12px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{cat}</p>
                    </div>
                    <div className="divide-y divide-[rgba(0,0,0,0.04)]">
                      {items.map(({icon, name}) => {
                        const st: MatStatus = matStatus[name] ?? "not-started";
                        return (
                          <button key={name} onClick={()=>setMatConfig(name)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#f8faff] transition-colors text-left"
                            style={{outline:"none"}}>
                            <span className="text-xl shrink-0">{icon}</span>
                            <span className="flex-1 text-[13px] font-semibold text-[#1a1d2e]" style={{fontFamily:PP}}>{name}</span>
                            {st==="completed" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#f0fdf4] text-[#059669]" style={{fontFamily:PP}}>Selesai ✓</span>}
                            {st==="continue"  && <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#fffbeb] text-[#f1ad00]" style={{fontFamily:PP}}>Lanjutkan</span>}
                            {st==="not-started"&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#f5f6fb] text-[#9ca3af]" style={{fontFamily:PP}}>Belum</span>}
                            <ChevronRight size={14} className="text-[#d1d5db] shrink-0"/>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── CUSTOM PRACTICE ── */}
            {lsMode === "custom" && (
              <>
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                  <p className="text-[13px] font-black text-[#1a1d2e] mb-3" style={{fontFamily:PP}}>Nama Latihan</p>
                  <input value={cName} onChange={e=>setCName(e.target.value)} placeholder="Contoh: Latihan PM + LI intensif"
                    className="w-full px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.1)] text-[13px] bg-[#f8faff] outline-none"
                    style={{fontFamily:PP}}/>
                </div>
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                  <p className="text-[13px] font-black text-[#1a1d2e] mb-3" style={{fontFamily:PP}}>Pilih Subtest</p>
                  <div className="flex flex-col gap-2">
                    {subs.map(s => {
                      const on = cSubs.includes(s.key);
                      return (
                        <button key={s.key} onClick={()=>setCSubs(prev=>on?prev.filter(k=>k!==s.key):[...prev,s.key])}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                          style={{background:on?s.light:"white",borderColor:on?s.color:"rgba(0,0,0,0.08)",outline:"none"}}>
                          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{borderColor:on?s.color:"#d1d5db",background:on?s.color:"transparent"}}>
                            {on && <Check size={11} className="text-white"/>}
                          </div>
                          <span className="flex-1 text-left text-[12px] font-bold" style={{color:on?s.color:"#374151",fontFamily:PP}}>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Jumlah Soal</p>
                    <span className="text-[20px] font-black" style={{color:accentColor,fontFamily:PP}}>{cNumQ}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {[10,20,30,40].map(n=>(
                      <button key={n} onClick={()=>{setCNumQ(n); setCCustomMode(false);}}
                        className="flex-1 py-2 rounded-xl border text-[12px] font-bold transition-all"
                        style={{background:(!cCustomMode&&cNumQ===n)?accentColor:"white",color:(!cCustomMode&&cNumQ===n)?"white":"#374151",borderColor:(!cCustomMode&&cNumQ===n)?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                        {n}
                      </button>
                    ))}
                    <button onClick={()=>setCCustomMode(true)}
                      className="flex-1 py-2 rounded-xl border text-[12px] font-bold transition-all"
                      style={{background:cCustomMode?accentColor:"white",color:cCustomMode?"white":"#374151",borderColor:cCustomMode?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                      Lain
                    </button>
                  </div>
                  {cCustomMode && (
                    <input type="number" min={1} max={100}
                      value={cNumQ} onChange={e=>setCNumQ(Math.max(1, Math.min(100, parseInt(e.target.value)||1)))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.1)] text-[13px] bg-[#f8faff] outline-none mt-1"
                      placeholder="Masukkan jumlah (1–100)" style={{fontFamily:PP}}/>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
                    <p className="text-[12px] font-black text-[#1a1d2e] mb-2" style={{fontFamily:PP}}>Timer</p>
                    <div className="flex gap-2">
                      {([["OFF",false],["ON",true]] as const).map(([lbl,v])=>(
                        <button key={lbl} onClick={()=>setCTimer(v as boolean)}
                          className="flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all"
                          style={{background:cTimer===(v as boolean)?accentColor:"white",color:cTimer===(v as boolean)?"white":"#374151",borderColor:cTimer===(v as boolean)?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
                    <p className="text-[12px] font-black text-[#1a1d2e] mb-2" style={{fontFamily:PP}}>Koreksi</p>
                    <div className="flex gap-2">
                      {([["Setiap","each"],["Setelah","after"]] as const).map(([lbl,v])=>(
                        <button key={lbl} onClick={()=>setCReview(v as "each"|"after")}
                          className="flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all"
                          style={{background:cReview===v?accentColor:"white",color:cReview===v?"white":"#374151",borderColor:cReview===v?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={startCustomExam} disabled={cSubs.length===0}
                  className="w-full py-4 rounded-2xl text-[14px] font-black text-white hover:opacity-90 transition-all disabled:opacity-40"
                  style={{background:accentColor,fontFamily:PP,outline:"none"}}>
                  Start Practice →
                </button>
              </>
            )}
          </div>
        )}

        {/* ── TRYOUT TAB ── */}
        {sect === "tryout" && (
          <div className="px-5 py-5 max-w-xl mx-auto flex flex-col gap-4">
            <div>
              <p className="text-[18px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Available Tryout</p>
              <p className="text-[12px] text-[#9ca3af] mt-0.5" style={{fontFamily:PP}}>
                Simulasi penuh {tab==="utbk"?"UTBK":"SKD"} dengan laporan analisis mendalam
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {TRYOUT_LIST.map(t => (
                <div key={t.id} className={`bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden${t.status==="locked"?" opacity-60":""}`}>
                  <div className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{background:accentLight}}>📝</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[15px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{t.label}</p>
                        {t.status==="done"   && <CheckCircle size={14} className="text-[#22c55e]"/>}
                        {t.status==="locked" && <Lock size={14} className="text-[#9ca3af]"/>}
                      </div>
                      <p className="text-[11px] text-[#9ca3af]" style={{fontFamily:PP}}>
                        {t.status==="done" ? `Skor: ${t.score ?? "-"}` : t.status==="locked" ? "Belum tersedia" : "Belum dikerjakan · 20 soal · 45 menit"}
                      </p>
                    </div>
                    {t.status !== "locked" && (
                      <button onClick={()=>t.status==="done" ? setTs("report") : startTryoutExam()}
                        className="px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all shrink-0"
                        style={{background:t.status==="done"?accentLight:accentColor,color:t.status==="done"?accentColor:"white",fontFamily:PP,outline:"none"}}>
                        {t.status==="done" ? "Lihat Laporan" : "Kerjakan"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LAPORAN TAB ── */}
        {sect === "laporan" && (
          <div className="px-5 py-5 max-w-xl mx-auto flex flex-col gap-4">

            {/* Overall Score Hero */}
            <div className="rounded-3xl overflow-hidden" style={{background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`}}>
              <div className="px-6 py-7">
                <p className="text-[11px] font-bold text-white/70 mb-2" style={{fontFamily:PP}}>Overall Score</p>
                <div className="flex items-end gap-3 mb-1">
                  <p className="text-[64px] font-black text-white leading-none" style={{fontFamily:PP}}>640</p>
                  <div className="mb-3">
                    <span className="text-[14px] font-black bg-white/20 px-2.5 py-1 rounded-xl text-[#4ade80]" style={{fontFamily:PP}}>↑ +35</span>
                  </div>
                </div>
                <p className="text-[12px] text-white/60 mb-4" style={{fontFamily:PP}}>
                  {curTarget.univ} — Target {curTarget.score}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[{lbl:"Tryout",val:"TO #4"},{lbl:"Peringkat",val:"Top 22%"},{lbl:"Prediksi",val:"672"}].map(({lbl,val})=>(
                    <div key={lbl} className="px-3 py-2.5 rounded-2xl text-center" style={{background:"rgba(255,255,255,0.15)"}}>
                      <p className="text-[9px] text-white/60 mb-0.5" style={{fontFamily:PP}}>{lbl}</p>
                      <p className="text-[14px] font-black text-white" style={{fontFamily:PP}}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Trend */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-1" style={{fontFamily:PP}}>📈 Progress Trend</p>
              <p className="text-[10px] text-[#9ca3af] mb-4" style={{fontFamily:PP}}>Riwayat skor tryout terakhir</p>
              <TrendLine data={[...scoreHist, 640]} labels={[...scoreLabels, "TO #4"]} color={accentColor}/>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>🕸️ Performa Subtest</p>
              <div className="flex justify-center">
                <SvgRadar axes={perfData.map(d=>d.key)} values={perfData.map(d=>d.acc)} color={accentColor}/>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {perfData.map(({key, label, acc, color}) => (
                  <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f8faff]">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{background:color}}/>
                    <span className="text-[11px] font-semibold text-[#374151] flex-1 truncate" style={{fontFamily:PP}}>{key}</span>
                    <span className="text-[12px] font-black shrink-0" style={{color,fontFamily:PP}}>{acc}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SKD: Passing Requirement */}
            {tab === "kedinasan" && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>🎯 Passing Requirement</p>
                  <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.05)]">
                    {[
                      {sub:"TWK", label:"Tes Wawasan Kebangsaan",    score:68, passing:65, color:"#059669"},
                      {sub:"TIU", label:"Tes Intelegensia Umum",     score:84, passing:80, color:"#0891b2"},
                      {sub:"TKP", label:"Tes Karakteristik Pribadi", score:152,passing:156,color:"#7c3aed"},
                    ].map(({sub, label, score, passing, color}) => {
                      const lulus = score >= passing;
                      return (
                        <div key={sub} className="py-4">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-[12px] font-black" style={{color,fontFamily:PP}}>{sub}</span>
                              <span className="text-[10px] text-[#9ca3af] ml-2" style={{fontFamily:PP}}>{label}</span>
                            </div>
                            <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl ${lulus ? "bg-[#f0fdf4] text-[#059669]" : "bg-[#fef2f2] text-[#ef4444]"}`} style={{fontFamily:PP}}>
                              {lulus ? "✅ Lulus" : "❌ Belum Lulus"}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-[28px] font-black" style={{color:lulus?"#059669":"#ef4444",fontFamily:PP}}>{score}</span>
                            <span className="text-[13px] text-[#9ca3af]" style={{fontFamily:PP}}>/ {passing}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{
                              width:`${Math.min(100, Math.round((score/passing)*100))}%`,
                              background: lulus ? "#059669" : "#ef4444",
                            }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Overall status */}
                <div className="mx-5 mb-5 px-4 py-3.5 rounded-2xl flex items-center gap-3" style={{background:"#fffbeb",border:"1px solid #fde68a"}}>
                  <span className="text-xl shrink-0">🟡</span>
                  <div>
                    <p className="text-[13px] font-black text-[#92400e]" style={{fontFamily:PP}}>Belum Memenuhi Passing Grade SKD</p>
                    <p className="text-[11px] text-[#92400e]/70 mt-0.5" style={{fontFamily:PP}}>TKP masih di bawah ambang batas yang disyaratkan</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Performance Summary */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <p className="text-[13px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>AI Performance Summary</p>
              </div>
              <p className="text-[12px] text-[#374151] leading-relaxed" style={{fontFamily:PP}}>
                {tab==="utbk"
                  ? <>Performa kamu mengalami peningkatan yang konsisten dari TO #1 hingga TO #4, dengan kenaikan total +60 poin. Penalaran Umum dan Penalaran Matematika menjadi kekuatanmu, sementara Literasi Indonesia dan Pengetahuan Kuantitatif masih perlu perhatian ekstra. Berdasarkan tren ini, AI memprediksi kamu dapat mencapai skor <strong>672</strong> di tryout berikutnya apabila fokus berlatih di topik-topik terlemah.</>
                  : <>Kamu sudah memenuhi passing grade pada TWK dan TIU. Fokus latihan berikutnya sebaiknya diarahkan pada TKP, khususnya materi Orientasi Pelayanan, Integritas, dan Kerja Sama karena ketiga materi tersebut memberikan kontribusi terbesar terhadap skor TKP-mu. Berdasarkan tren latihan saat ini, AI memprediksi target passing grade dapat dicapai dalam <strong>2–3 kali tryout</strong> berikutnya apabila rekomendasi latihan diikuti secara konsisten.</>
                }
              </p>
            </div>

            {/* Weakest Topics */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-black text-[#1a1d2e] mb-4" style={{fontFamily:PP}}>📉 Topik Terlemah</p>
              <div className="flex flex-col gap-4">
                {(tab==="utbk"
                  ? [{name:"Penalaran Logika",sub:"PU",pct:58,color:"#0965fa"},{name:"Bacaan Ilmiah",sub:"LI",pct:61,color:"#00b2dd"},{name:"Persamaan Kuadrat",sub:"PM",pct:55,color:"#ef4444"}]
                  : [{name:"Analogi Verbal",sub:"TIU",pct:60,color:"#0891b2"},{name:"Wawasan Nusantara",sub:"TWK",pct:64,color:"#059669"},{name:"Kepemimpinan",sub:"TKP",pct:62,color:"#7c3aed"}]
                ).map(({name,sub,pct,color}) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{background:color+"20",color,fontFamily:PP}}>{sub}</span>
                        <span className="text-[12px] font-semibold text-[#374151]" style={{fontFamily:PP}}>{name}</span>
                      </div>
                      <span className="text-[13px] font-black text-[#ef4444]" style={{fontFamily:PP}}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${pct}%`,background:color}}/>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{setSect("latihan"); setLsMode("guided");}}
                className="w-full py-3 rounded-xl text-[13px] font-black text-white mt-5 hover:opacity-90 transition-all"
                style={{background:accentColor,fontFamily:PP,outline:"none"}}>
                Review Materi →
              </button>
            </div>

            <div className="h-4"/>
          </div>
        )}
      </div>

      {/* Subtest picker bottom sheet */}
      {showSubPicker && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShowSubPicker(false)}/>
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>Pilih Subtes</p>
              <button onClick={()=>setShowSubPicker(false)} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center" style={{outline:"none"}}><X size={14}/></button>
            </div>
            <div className="flex flex-col gap-2">
              {subs.map(s => (
                <button key={s.key} onClick={()=>{setGuidedSub(s.key);setShowSubPicker(false);}}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all"
                  style={{background:guidedSub===s.key?s.light:"white",borderColor:guidedSub===s.key?s.color:"rgba(0,0,0,0.08)",outline:"none"}}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{background:s.color}}/>
                  <span className="flex-1 text-left text-[13px] font-bold" style={{color:guidedSub===s.key?s.color:"#374151",fontFamily:PP}}>{s.label}</span>
                  {guidedSub===s.key && <Check size={14} style={{color:s.color}}/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Material config bottom sheet */}
      {matConfig !== null && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setMatConfig(null)}/>
          <div className="relative w-full bg-white rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[16px] font-black text-[#1a1d2e]" style={{fontFamily:PP}}>{matConfig}</p>
              <button onClick={()=>setMatConfig(null)} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center" style={{outline:"none"}}><X size={14}/></button>
            </div>
            <p className="text-[11px] text-[#9ca3af] mb-5" style={{fontFamily:PP}}>Konfigurasi sesi latihan untuk materi ini</p>

            <p className="text-[12px] font-black text-[#1a1d2e] mb-2" style={{fontFamily:PP}}>Jumlah Soal</p>
            <div className="flex gap-2 mb-2">
              {[10,20,30].map(n=>(
                <button key={n} onClick={()=>{setMatNumQ(n); setMatCustomMode(false);}}
                  className="flex-1 py-2.5 rounded-xl border text-[13px] font-bold transition-all"
                  style={{background:(!matCustomMode&&matNumQ===n)?accentColor:"white",color:(!matCustomMode&&matNumQ===n)?"white":"#374151",borderColor:(!matCustomMode&&matNumQ===n)?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                  {n}
                </button>
              ))}
              <button onClick={()=>setMatCustomMode(true)}
                className="flex-1 py-2.5 rounded-xl border text-[13px] font-bold transition-all"
                style={{background:matCustomMode?accentColor:"white",color:matCustomMode?"white":"#374151",borderColor:matCustomMode?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                Lain
              </button>
            </div>
            {matCustomMode && (
              <input type="number" min={1} max={100}
                value={matNumQ} onChange={e=>setMatNumQ(Math.max(1, Math.min(100, parseInt(e.target.value)||1)))}
                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.1)] text-[13px] bg-[#f8faff] outline-none mb-1"
                placeholder="Masukkan jumlah (1–100)" style={{fontFamily:PP}}/>
            )}
            <div className="mb-5"/>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-[12px] font-black text-[#1a1d2e] mb-2" style={{fontFamily:PP}}>Timer</p>
                <div className="flex gap-2">
                  {([["OFF",false],["ON",true]] as const).map(([lbl,v])=>(
                    <button key={lbl} onClick={()=>setMatTimer(v as boolean)}
                      className="flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all"
                      style={{background:matTimer===(v as boolean)?accentColor:"white",color:matTimer===(v as boolean)?"white":"#374151",borderColor:matTimer===(v as boolean)?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-black text-[#1a1d2e] mb-2" style={{fontFamily:PP}}>Pembahasan</p>
                <div className="flex gap-2">
                  {([["Setiap","each"],["Setelah","after"]] as const).map(([lbl,v])=>(
                    <button key={lbl} onClick={()=>setMatReview(v as "each"|"after")}
                      className="flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all"
                      style={{background:matReview===v?accentColor:"white",color:matReview===v?"white":"#374151",borderColor:matReview===v?accentColor:"rgba(0,0,0,0.1)",fontFamily:PP,outline:"none"}}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={startMatExam}
              className="w-full py-4 rounded-2xl text-[14px] font-black text-white hover:opacity-90 transition-all"
              style={{background:accentColor,fontFamily:PP,outline:"none"}}>
              Mulai Latihan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
