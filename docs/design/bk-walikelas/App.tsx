import { useState, useId, useEffect } from "react"
import avatarImg from "./imports/HeaderTopAppBar/01204aa9c0991be1255e7abf0cf70f82bcb6c52f.png"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
} from "recharts"

// ─── Design tokens (mirrors CSS vars) ────────────────────────────────────────
const C = {
  navy: "#0F1E36",
  navyMid: "#162844",
  navySoft: "#1E3A5F",
  sky: "#00A3E0",
  cyan: "#00B4D8",
  cyanLight: "#00C8E8",
  orange: "#FF8C00",
  yellow: "#FFB700",
  green: "#00C46A",
  red: "#FF4D4D",
  ice: "#F8FAFC",
  border: "#E2E8F0",
  textMain: "#0F1E36",
  textMid: "#475569",
  textMuted: "#94A3B8",
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "beranda" | "data" | "tryout"
type Student = typeof STUDENTS[0]
type TryoutStudent = typeof TRYOUT_STUDENTS[0]

// ─── Mock data ────────────────────────────────────────────────────────────────
const TREND = [
  { sem: "Sem 5 (Ganjil)", avg: 87.6 },
  { sem: "Sem 6 (Genap)", avg: 89.2 },
]
const DISTRIBUSI = [
  { label: "Tinggi\n(90–100)", count: 12, color: C.sky },
  { label: "Sedang\n(75–89)", count: 18, color: C.yellow },
  { label: "Rendah\n(<75)", count: 6, color: C.red },
]
const PERBANDINGAN = [
  { kelas: "XI IPA 1", avg: 88.2 },
  { kelas: "XI IPA 2", avg: 87.6 },
  { kelas: "XI IPA 3", avg: 85.1 },
  { kelas: "XI IPA 4", avg: 83.4 },
]
const KELAS_LIST = ["X IPA 1","X IPA 2","XI IPA 1","XI IPA 2","XII IPA 1","XII IPA 2"] as const
type KelasName = typeof KELAS_LIST[number]

const STUDENTS: {
  id: number
  nama: string
  nis: string
  jk: string
  kelas: KelasName
  alamat: string
  noOrtu: string
  profil: string
  rekap: string
  prestasi: number
  status: string
  avg: number
  tren: string
}[] = [
  {
    id: 1,
    nama: "Andi Maulana",
    nis: "2024001",
    jk: "L",
    kelas: "X IPA 1",
    alamat: "Jl. Mawar No.12",
    noOrtu: "081234567890",
    profil: "lengkap",
    rekap: "Semester 5",
    prestasi: 3,
    status: "lengkap",
    avg: 91.2,
    tren: "naik",
  },
  {
    id: 2,
    nama: "Bela Saputri",
    nis: "2024002",
    jk: "P",
    kelas: "X IPA 2",
    alamat: "Jl. Melati No.5",
    noOrtu: "082345678901",
    profil: "lengkap",
    rekap: "Semester 5",
    prestasi: 1,
    status: "lengkap",
    avg: 88.4,
    tren: "naik",
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    nis: "2024003",
    jk: "L",
    kelas: "XI IPA 1",
    alamat: "Jl. Anggrek No.8",
    noOrtu: "083456789012",
    profil: "sebagian",
    rekap: "Semester 4",
    prestasi: 0,
    status: "sebagian",
    avg: 74.1,
    tren: "turun",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    nis: "2024004",
    jk: "P",
    kelas: "XI IPA 2",
    alamat: "Jl. Dahlia No.3",
    noOrtu: "084567890123",
    profil: "lengkap",
    rekap: "Semester 5",
    prestasi: 2,
    status: "lengkap",
    avg: 85.7,
    tren: "stabil",
  },
  {
    id: 5,
    nama: "Eka Pratama",
    nis: "2024005",
    jk: "L",
    kelas: "XII IPA 1",
    alamat: "Jl. Bougenville No.17",
    noOrtu: "085678901234",
    profil: "belum",
    rekap: "—",
    prestasi: 0,
    status: "belum",
    avg: 72.3,
    tren: "turun",
  },
  {
    id: 6,
    nama: "Farah Nadia",
    nis: "2024006",
    jk: "P",
    kelas: "XII IPA 2",
    alamat: "Jl. Kenanga No.21",
    noOrtu: "086789012345",
    profil: "lengkap",
    rekap: "Semester 5",
    prestasi: 4,
    status: "lengkap",
    avg: 93.8,
    tren: "naik",
  },
  {
    id: 7,
    nama: "Galih Santoso",
    nis: "2024007",
    jk: "L",
    kelas: "XI IPA 1",
    alamat: "Jl. Teratai No.9",
    noOrtu: "087890123456",
    profil: "sebagian",
    rekap: "Semester 5",
    prestasi: 1,
    status: "sebagian",
    avg: 79.5,
    tren: "naik",
  },
  {
    id: 8,
    nama: "Hana Pertiwi",
    nis: "2024008",
    jk: "P",
    kelas: "X IPA 1",
    alamat: "Jl. Flamboyan No.6",
    noOrtu: "088901234567",
    profil: "lengkap",
    rekap: "Semester 5",
    prestasi: 2,
    status: "lengkap",
    avg: 89.1,
    tren: "naik",
  },
]
// Per-student subject scores for Data Akademik Siswa page
const REKAP_NILAI: Record<number, {
  mat: number
  bind: number
  bing: number
  fis: number
  kim: number
  bio: number
  inf: number
  sej: number
  eko: number
}> = {
  1: {
    mat: 90,
    bind: 88,
    bing: 78,
    fis: 92,
    kim: 87,
    bio: 85,
    inf: 94,
    sej: 82,
    eko: 80,
  },
  2: {
    mat: 85,
    bind: 90,
    bing: 82,
    fis: 80,
    kim: 88,
    bio: 87,
    inf: 88,
    sej: 86,
    eko: 84,
  },
  3: {
    mat: 72,
    bind: 75,
    bing: 68,
    fis: 74,
    kim: 71,
    bio: 73,
    inf: 75,
    sej: 71,
    eko: 70,
  },
  4: {
    mat: 86,
    bind: 86,
    bing: 83,
    fis: 87,
    kim: 86,
    bio: 85,
    inf: 88,
    sej: 84,
    eko: 84,
  },
  5: {
    mat: 72,
    bind: 74,
    bing: 68,
    fis: 71,
    kim: 70,
    bio: 71,
    inf: 73,
    sej: 70,
    eko: 70,
  },
  6: {
    mat: 95,
    bind: 93,
    bing: 89,
    fis: 96,
    kim: 93,
    bio: 92,
    inf: 96,
    sej: 91,
    eko: 89,
  },
  7: {
    mat: 80,
    bind: 80,
    bing: 75,
    fis: 81,
    kim: 79,
    bio: 80,
    inf: 83,
    sej: 78,
    eko: 75,
  },
  8: {
    mat: 89,
    bind: 89,
    bing: 85,
    fis: 90,
    kim: 88,
    bio: 87,
    inf: 91,
    sej: 87,
    eko: 86,
  },
}

const MAPEL = [
  { m: "Matematika", n: 90 },
  { m: "Bahasa Indonesia", n: 88 },
  { m: "Bahasa Inggris", n: 78 },
  { m: "Fisika", n: 92 },
  { m: "Kimia", n: 87 },
  { m: "Biologi", n: 85 },
  { m: "Informatika", n: 94 },
  { m: "Sejarah", n: 82 },
  { m: "Ekonomi", n: 80 },
  { m: "PJOK", n: 88 },
  { m: "Seni Budaya", n: 86 },
  { m: "PKn", n: 83 },
  { m: "Agama", n: 90 },
]

// ─── Shared primitives ────────────────────────────────────────────────────────
function P(
  props: React.CSSProperties & {
    children?: React.ReactNode
    style?: React.CSSProperties
  },
) {
  const { children, style, ...rest } = props
  return (
    <div style={{ fontFamily: "'Poppins',sans-serif", ...rest, ...style }}>
      {children}
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const M: Record<string, { label: string bg: string color: string }> = {
    lengkap: { label: "● Lengkap", bg: "rgba(0,196,106,.1)", color: "#00A36B" },
    sebagian: {
      label: "● Sebagian",
      bg: "rgba(255,183,0,.12)",
      color: "#B5780A",
    },
    belum: {
      label: "● Belum Lengkap",
      bg: "rgba(255,77,77,.1)",
      color: "#CC2E2E",
    },
    naik: { label: "↑ Naik", bg: "rgba(0,196,106,.1)", color: "#00A36B" },
    turun: { label: "↓ Turun", bg: "rgba(255,77,77,.1)", color: "#CC2E2E" },
    stabil: { label: "→ Stabil", bg: "rgba(0,163,224,.1)", color: C.sky },
  }
  const s = M[status] ?? M.belum
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Poppins',sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  )
}

function SectionHead({
  title,
  sub,
  action,
}: {
  title: string
  sub?: string
  action?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: C.textMain,
          }}
        >
          {title}
        </div>
        {sub && (
          <div
            className="font-pecita"
            style={{ fontSize: 13, color: C.orange, marginTop: 2 }}
          >
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  )
}

// ─── Gradient Card (matches design guide) ────────────────────────────────────
function GradCard({
  variant = "sky",
  title,
  desc,
  linkLabel = "Explore Analysis →",
  onClick,
}: {
  variant?: "sky" | "orange"
  title: string
  desc: string
  linkLabel?: string
  onClick?: () => void
}) {
  const [lHov, setLHov] = useState(false)
  const grad =
    variant === "sky"
      ? "linear-gradient(135deg,#00A3E0 0%,#00B4D8 60%,#00C8E8 100%)"
      : "linear-gradient(135deg,#FF8C00 0%,#FFB700 100%)"
  return (
    <div
      style={{
        borderRadius: 16,
        background: grad,
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow:
          variant === "sky"
            ? "0 6px 24px rgba(0,163,224,.35)"
            : "0 6px 24px rgba(255,140,0,.3)",
        cursor: onClick ? "pointer" : "default",
      }}
      className="card-lift"
      onClick={onClick}
    >
      {/* Orbital deco rings */}
      <div
        style={{
          position: "absolute",
          top: -44,
          right: -44,
          width: 148,
          height: 148,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,.16)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -18,
          right: -18,
          width: 88,
          height: 88,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -10,
          left: -10,
          width: 160,
          height: 100,
          background:
            "radial-gradient(ellipse,rgba(255,255,255,.13) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: "rgba(255,255,255,.2)",
          border: "1px solid rgba(255,255,255,.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          backdropFilter: "blur(4px)",
        }}
      >
        {variant === "sky" ? <IcoBrain /> : <IcoStar />}
      </div>

      {/* Tag */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(255,255,255,.15)",
          border: "1px solid rgba(255,255,255,.22)",
          borderRadius: 20,
          padding: "3px 10px",
          width: "fit-content",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 9, color: "rgba(255,255,255,.9)" }}>✦</span>
        <span
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,.92)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {variant === "sky" ? "AI-Powered" : "Aksi Cepat"}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "white",
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 400,
          fontSize: 12.5,
          color: "rgba(255,255,255,.82)",
          margin: "0 0 20px",
          lineHeight: 1.65,
        }}
      >
        {desc}
      </p>

      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,.15)",
          marginBottom: 14,
        }}
      />

      <button
        onMouseEnter={() => setLHov(true)}
        onMouseLeave={() => setLHov(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 600,
          fontSize: 12.5,
          color: lHov ? "white" : "rgba(255,255,255,.75)",
          letterSpacing: "0.01em",
          transition: "color .18s",
        }}
      >
        {linkLabel}
        <span
          style={{
            display: "inline-block",
            transform: lHov ? "translateX(4px)" : "translateX(0)",
            transition: "transform .2s",
            fontSize: 15,
          }}
        >
          →
        </span>
      </button>
    </div>
  )
}

// ─── Circular progress ────────────────────────────────────────────────────────
function RingProgress({ value, size = 110 }: { value: number size?: number }) {
  const uid = useId().replace(/:/g, "")
  const gradId = `rg-${uid}`
  const r = (size - 14) / 2,
    c = 2 * Math.PI * r
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00A3E0" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EFF6FF"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: C.textMain,
            lineHeight: 1,
          }}
        >
          {value}%
        </div>
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 10,
            color: C.textMuted,
          }}
        >
          Lengkap
        </div>
      </div>
    </div>
  )
}

// ─── Tryout mock data ─────────────────────────────────────────────────────────
const TO_TREND = [
  { to: "TO1", avg: 598 },
  { to: "TO2", avg: 612 },
  { to: "TO3", avg: 624 },
  { to: "TO4", avg: 619 },
  { to: "TO5", avg: 635 },
  { to: "TO6", avg: 641 },
  { to: "TO7", avg: 638 },
  { to: "TO8", avg: 648 },
]
const SUBTEST_AVG = [
  { sub: "Penalaran Umum", avg: 72, full: 100 },
  { sub: "Pengetahuan Kuantitatif", avg: 69, full: 100 },
  { sub: "Literasi Bahasa Indonesia", avg: 80, full: 100 },
  { sub: "Literasi Bahasa Inggris", avg: 65, full: 100 },
]
const RADAR_DATA = SUBTEST_AVG.map((d) => ({
  sub: d.sub.replace(/ /g, ""),
  label: d.sub,
  A: d.avg,
}))
const DISTRIBUSI_SKOR = [
  { range: "750+", count: 3, color: "#00C46A" },
  { range: "700–749", count: 7, color: "#00A3E0" },
  { range: "650–699", count: 9, color: "#00B4D8" },
  { range: "600–649", count: 6, color: "#FFB700" },
  { range: "<600", count: 5, color: "#FF4D4D" },
]
const TRYOUT_STUDENTS = [
  {
    id: 1,
    nama: "Andi Maulana",
    kelas: "XI IPA 2",
    target: "Teknik Informatika UI",
    to: "TO 8",
    skor: 712,
    ranking: 3,
    tren: "naik",
    status: "excellent",
    history: [580, 612, 638, 660, 672, 690, 700, 712],
    subTO: [
      [78, 72, 68, 75],
      [82, 76, 70, 78],
      [85, 80, 73, 80],
      [87, 82, 76, 82],
    ],
  },
  {
    id: 2,
    nama: "Bela Saputri",
    kelas: "XI IPA 2",
    target: "Kedokteran UNPAD",
    to: "TO 8",
    skor: 665,
    ranking: 8,
    tren: "stabil",
    status: "good",
    history: [620, 630, 625, 640, 635, 648, 660, 665],
    subTO: [
      [76, 68, 62, 70],
      [78, 70, 64, 72],
      [79, 71, 65, 73],
      [80, 72, 64, 74],
    ],
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    kelas: "XI IPA 2",
    target: "Ekonomi UI",
    to: "TO 8",
    skor: 543,
    ranking: 28,
    tren: "turun",
    status: "perhatian",
    history: [580, 570, 565, 558, 550, 545, 548, 543],
    subTO: [
      [72, 65, 55, 68],
      [70, 63, 52, 66],
      [68, 61, 50, 64],
      [67, 60, 49, 63],
    ],
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    kelas: "XI IPA 2",
    target: "Farmasi ITB",
    to: "TO 8",
    skor: 631,
    ranking: 14,
    tren: "naik",
    status: "good",
    history: [590, 600, 608, 615, 620, 624, 628, 631],
    subTO: [
      [74, 70, 62, 72],
      [76, 72, 64, 74],
      [77, 73, 65, 75],
      [78, 74, 66, 76],
    ],
  },
  {
    id: 5,
    nama: "Eka Pratama",
    kelas: "XI IPA 2",
    target: "Hukum UI",
    to: "TO 8",
    skor: 490,
    ranking: 34,
    tren: "turun",
    status: "improvement",
    history: [520, 510, 505, 500, 495, 490, 488, 490],
    subTO: [
      [65, 58, 48, 60],
      [63, 56, 46, 58],
      [62, 55, 45, 57],
      [62, 55, 45, 57],
    ],
  },
  {
    id: 6,
    nama: "Farah Nadia",
    kelas: "XI IPA 2",
    target: "Matematika UI",
    to: "TO 8",
    skor: 785,
    ranking: 1,
    tren: "naik",
    status: "excellent",
    history: [700, 718, 732, 748, 756, 768, 776, 785],
    subTO: [
      [88, 82, 78, 85],
      [90, 84, 80, 87],
      [92, 86, 82, 88],
      [94, 88, 84, 90],
    ],
  },
  {
    id: 7,
    nama: "Galih Santoso",
    kelas: "XI IPA 2",
    target: "Teknik Sipil ITS",
    to: "TO 8",
    skor: 598,
    ranking: 22,
    tren: "stabil",
    status: "good",
    history: [580, 588, 592, 596, 598, 594, 596, 598],
    subTO: [
      [72, 66, 58, 68],
      [73, 67, 59, 69],
      [74, 68, 60, 70],
      [74, 68, 60, 70],
    ],
  },
  {
    id: 8,
    nama: "Hana Pertiwi",
    kelas: "XI IPA 2",
    target: "Psikologi UGM",
    to: "TO 8",
    skor: 648,
    ranking: 10,
    tren: "naik",
    status: "good",
    history: [600, 615, 622, 630, 635, 640, 644, 648],
    subTO: [
      [75, 70, 63, 73],
      [77, 72, 65, 75],
      [78, 73, 66, 76],
      [79, 74, 67, 77],
    ],
  },
]
// ─── TKA data ────────────────────────────────────────────────────────────────
const TKA_TREND = [
  { to: "TKA 1", avg: 74 },
  { to: "TKA 2", avg: 77 },
  { to: "TKA 3", avg: 75 },
  { to: "TKA 4", avg: 79 },
  { to: "TKA 5", avg: 82 },
  { to: "TKA 6", avg: 80 },
  { to: "TKA 7", avg: 83 },
  { to: "TKA 8", avg: 86 },
]
const TKA_SUBTEST_AVG = [
  { sub: "Bahasa Indonesia", avg: 84, full: 100 },
  { sub: "Bahasa Inggris", avg: 76, full: 100 },
  { sub: "Matematika", avg: 61, full: 100 },
  { sub: "Mapel Pilihan", avg: 72, full: 100 },
]
const TKA_RADAR_DATA = TKA_SUBTEST_AVG.map((d) => ({
  sub: d.sub.replace(" ", ""),
  label: d.sub,
  A: d.avg,
}))
const TKA_DISTRIBUSI = [
  { range: "90–100", count: 4, color: "#00C46A" },
  { range: "80–89", count: 9, color: "#00A3E0" },
  { range: "70–79", count: 10, color: "#00B4D8" },
  { range: "60–69", count: 8, color: "#FFB700" },
  { range: "<60", count: 5, color: "#FF4D4D" },
]
const TKA_STUDENTS = [
  {
    id: 1,
    nama: "Andi Maulana",
    kelas: "XI IPA 2",
    target: "Teknik Informatika UI",
    to: "TKA 8",
    skor: 88,
    ranking: 2,
    tren: "naik",
    status: "excellent",
    history: [72, 75, 74, 78, 80, 82, 85, 88],
    subTO: [
      [85, 80, 70, 82],
      [87, 82, 72, 84],
      [88, 84, 74, 86],
      [90, 86, 76, 88],
    ],
  },
  {
    id: 2,
    nama: "Bela Saputri",
    kelas: "XI IPA 2",
    target: "Kedokteran UNPAD",
    to: "TKA 8",
    skor: 82,
    ranking: 5,
    tren: "stabil",
    status: "good",
    history: [78, 79, 78, 80, 81, 80, 82, 82],
    subTO: [
      [82, 76, 64, 78],
      [83, 77, 65, 79],
      [84, 78, 66, 80],
      [84, 78, 66, 80],
    ],
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    kelas: "XI IPA 2",
    target: "Ekonomi UI",
    to: "TKA 8",
    skor: 61,
    ranking: 30,
    tren: "turun",
    status: "perhatian",
    history: [70, 68, 67, 66, 64, 62, 60, 61],
    subTO: [
      [72, 65, 52, 68],
      [70, 63, 50, 66],
      [68, 61, 48, 64],
      [67, 60, 47, 63],
    ],
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    kelas: "XI IPA 2",
    target: "Farmasi ITB",
    to: "TKA 8",
    skor: 79,
    ranking: 10,
    tren: "naik",
    status: "good",
    history: [72, 74, 75, 76, 77, 77, 78, 79],
    subTO: [
      [80, 74, 62, 76],
      [81, 75, 63, 77],
      [82, 76, 64, 78],
      [82, 76, 65, 78],
    ],
  },
  {
    id: 5,
    nama: "Eka Pratama",
    kelas: "XI IPA 2",
    target: "Hukum UI",
    to: "TKA 8",
    skor: 58,
    ranking: 34,
    tren: "turun",
    status: "improvement",
    history: [65, 63, 62, 61, 60, 59, 57, 58],
    subTO: [
      [68, 60, 46, 62],
      [66, 58, 44, 60],
      [65, 57, 43, 59],
      [65, 57, 43, 59],
    ],
  },
  {
    id: 6,
    nama: "Farah Nadia",
    kelas: "XI IPA 2",
    target: "Matematika UI",
    to: "TKA 8",
    skor: 96,
    ranking: 1,
    tren: "naik",
    status: "excellent",
    history: [86, 88, 90, 91, 92, 93, 95, 96],
    subTO: [
      [92, 86, 80, 90],
      [93, 87, 82, 91],
      [94, 88, 84, 92],
      [95, 90, 86, 93],
    ],
  },
  {
    id: 7,
    nama: "Galih Santoso",
    kelas: "XI IPA 2",
    target: "Teknik Sipil ITS",
    to: "TKA 8",
    skor: 75,
    ranking: 16,
    tren: "stabil",
    status: "good",
    history: [72, 73, 74, 74, 75, 74, 75, 75],
    subTO: [
      [78, 72, 60, 74],
      [79, 73, 61, 75],
      [80, 74, 62, 76],
      [80, 74, 62, 76],
    ],
  },
  {
    id: 8,
    nama: "Hana Pertiwi",
    kelas: "XI IPA 2",
    target: "Psikologi UGM",
    to: "TKA 8",
    skor: 84,
    ranking: 4,
    tren: "naik",
    status: "excellent",
    history: [76, 78, 79, 80, 81, 82, 83, 84],
    subTO: [
      [82, 76, 66, 80],
      [83, 77, 67, 81],
      [84, 78, 68, 82],
      [85, 79, 69, 83],
    ],
  },
]

// ─── SKD data ────────────────────────────────────────────────────────────────
const SKD_TREND = [
  { to: "SKD 1", avg: 286 },
  { to: "SKD 2", avg: 293 },
  { to: "SKD 3", avg: 299 },
  { to: "SKD 4", avg: 296 },
  { to: "SKD 5", avg: 306 },
  { to: "SKD 6", avg: 312 },
  { to: "SKD 7", avg: 310 },
  { to: "SKD 8", avg: 318 },
]
// avg = raw score out of each subtest max; full = subtest max
const SKD_SUBTEST_AVG = [
  { sub: "TWK", avg: 84, full: 150 },
  { sub: "TIU", avg: 98, full: 175 },
  { sub: "TKP", avg: 156, full: 225 },
]
// normalise to 0–100 for radar
const SKD_RADAR_DATA = SKD_SUBTEST_AVG.map((d) => ({
  sub: d.sub,
  label: d.sub,
  A: Math.round((d.avg / d.full) * 100),
}))
const SKD_DISTRIBUSI = [
  { range: "350+", count: 5, color: "#00C46A" },
  { range: "310–349", count: 9, color: "#00A3E0" },
  { range: "280–309", count: 11, color: "#00B4D8" },
  { range: "260–279", count: 7, color: "#FFB700" },
  { range: "<260", count: 4, color: "#FF4D4D" },
]
// subTO: [TWK, TIU, TKP] per session (4 most recent)
const SKD_STUDENTS = [
  {
    id: 1,
    nama: "Andi Maulana",
    kelas: "XII IPA 2",
    target: "STAN / Akuntansi",
    to: "SKD 8",
    skor: 358,
    ranking: 2,
    tren: "naik",
    status: "excellent",
    history: [300, 312, 320, 330, 338, 344, 352, 358],
    subTO: [
      [82, 102, 122],
      [86, 105, 128],
      [90, 107, 135],
      [96, 110, 152],
    ],
  },
  {
    id: 2,
    nama: "Bela Saputri",
    kelas: "XII IPA 2",
    target: "IPDN / Pemerintahan",
    to: "SKD 8",
    skor: 322,
    ranking: 7,
    tren: "stabil",
    status: "good",
    history: [308, 312, 310, 316, 318, 318, 320, 322],
    subTO: [
      [76, 98, 134],
      [78, 99, 136],
      [79, 100, 138],
      [80, 101, 141],
    ],
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    kelas: "XII IPA 2",
    target: "STAN / Kebendaharaan",
    to: "SKD 8",
    skor: 251,
    ranking: 32,
    tren: "turun",
    status: "perhatian",
    history: [272, 268, 264, 260, 258, 255, 252, 251],
    subTO: [
      [60, 72, 118],
      [58, 70, 116],
      [57, 69, 114],
      [56, 68, 127],
    ],
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    kelas: "XII IPA 2",
    target: "IPDN / Pemerintahan",
    to: "SKD 8",
    skor: 308,
    ranking: 12,
    tren: "naik",
    status: "good",
    history: [286, 292, 296, 298, 302, 304, 306, 308],
    subTO: [
      [74, 94, 130],
      [76, 96, 132],
      [78, 97, 134],
      [80, 98, 130],
    ],
  },
  {
    id: 5,
    nama: "Eka Pratama",
    kelas: "XII IPA 2",
    target: "STAN / Manajemen Aset",
    to: "SKD 8",
    skor: 262,
    ranking: 30,
    tren: "turun",
    status: "improvement",
    history: [278, 274, 270, 268, 266, 265, 263, 262],
    subTO: [
      [62, 78, 124],
      [61, 77, 122],
      [60, 76, 120],
      [62, 74, 126],
    ],
  },
  {
    id: 6,
    nama: "Farah Nadia",
    kelas: "XII IPA 2",
    target: "STAN / Akuntansi",
    to: "SKD 8",
    skor: 374,
    ranking: 1,
    tren: "naik",
    status: "excellent",
    history: [336, 344, 350, 355, 358, 362, 368, 374],
    subTO: [
      [96, 112, 148],
      [99, 114, 152],
      [102, 115, 155],
      [105, 116, 153],
    ],
  },
  {
    id: 7,
    nama: "Galih Santoso",
    kelas: "XII IPA 2",
    target: "IPDN / Administrasi",
    to: "SKD 8",
    skor: 315,
    ranking: 9,
    tren: "stabil",
    status: "good",
    history: [308, 310, 312, 312, 314, 314, 315, 315],
    subTO: [
      [78, 98, 136],
      [79, 99, 137],
      [80, 100, 138],
      [80, 100, 135],
    ],
  },
  {
    id: 8,
    nama: "Hana Pertiwi",
    kelas: "XII IPA 2",
    target: "STAN / Pajak",
    to: "SKD 8",
    skor: 348,
    ranking: 3,
    tren: "naik",
    status: "excellent",
    history: [318, 326, 332, 336, 340, 342, 345, 348],
    subTO: [
      [88, 106, 142],
      [90, 108, 144],
      [92, 109, 146],
      [94, 110, 144],
    ],
  },
]

const STATUS_CFG: Record<string, { label: string bg: string color: string }> = {
  excellent: {
    label: "Sangat Baik",
    bg: "rgba(0,196,106,.1)",
    color: "#00A36B",
  },
  good: { label: "Baik", bg: "rgba(0,163,224,.1)", color: "#0089BD" },
  improvement: {
    label: "Perlu Peningkatan",
    bg: "rgba(255,183,0,.12)",
    color: "#B5780A",
  },
  perhatian: {
    label: "Perlu Perhatian",
    bg: "rgba(255,77,77,.1)",
    color: "#CC2E2E",
  },
}
const TREN_CFG: Record<string, { icon: string color: string }> = {
  naik: { icon: "⬆", color: "#00A36B" },
  stabil: { icon: "➡", color: "#0089BD" },
  turun: { icon: "⬇", color: "#CC2E2E" },
}

// ─── Icon set (must be defined before NAV which uses them as JSX values) ──────
function IcoTryout() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
function IcoDash() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
function IcoDb() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  )
}
function IcoWave() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
function IcoSearch() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
function IcoBell() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
function IcoPlus() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IcoBrain() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2 6-4 8l-3 3-3-3C7 15 5 12.5 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
    </svg>
  )
}
function IcoStar() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function ChevUD() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,.3)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 3 18 9" />
      <polyline points="6 15 12 21 18 15" />
    </svg>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function IcoTable() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  )
}

const NAV = [
  { id: "beranda", label: "Beranda", sub: "Gambaran Kelas", icon: <IcoDash /> },
  {
    id: "data",
    label: "Data Siswa",
    sub: "Profil & Status Siswa",
    icon: <IcoDb />,
  },
] as const

type Role = 'wali' | 'bk'

const ROLE_CFG = {
  wali: { label:'Wali Kelas', sub:'XI IPA 2', avatar:'DS', avatarBg:'linear-gradient(135deg,#FF8C00,#FFB700)', name:'Dewi Sartika', badge:'🏠 Wali Kelas', badgeBg:'rgba(9,101,250,.08)', badgeColor:'#0965fa', badgeBorder:'rgba(9,101,250,.2)' },
  bk:   { label:'Guru BK',    sub:'Konselor', avatar:'HR', avatarBg:'linear-gradient(135deg,#7C3AED,#A855F7)', name:'Hendra Raharjo', badge:'💬 Guru BK', badgeBg:'rgba(124,58,237,.08)', badgeColor:'#7C3AED', badgeBorder:'rgba(124,58,237,.2)' },
} as const

function TopNav({ page, setPage, role, setRole }: { page: Page; setPage: (p: Page) => void; role: Role; setRole: (r: Role) => void }) {
  const F = { fontFamily:"'Poppins',sans-serif" } as const
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const rc = ROLE_CFG[role] ?? ROLE_CFG.wali
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      boxShadow: '0 1px 12px rgba(15,30,54,.07)',
    }}>
      {/* ── Brand row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Left — logo + subtitle */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <OrbLogo />
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:0 }}>
              <span style={{ ...F, fontWeight:800, fontSize:22, lineHeight:1, background:'linear-gradient(to right,#0965fa,#00b2dd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>ORBI</span>
              <span style={{ ...F, fontWeight:800, fontSize:22, lineHeight:1, background:'linear-gradient(to right,#ff7000,#f1ad00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>TA</span>
            </div>
            <div style={{ ...F, fontSize:11, fontWeight:500, color:'#94A3B8', letterSpacing:'0.04em', marginTop:1 }}>Teacher Portal</div>
          </div>
        </div>

        {/* Right — bell + role switcher + profile */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Bell */}
          <button style={{ position:'relative', width:36, height:36, borderRadius:'50%', background:'#F8FAFC', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:C.orange, border:'1.5px solid white' }} />
          </button>

          {/* Role switcher */}
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setShowRoleMenu(v => !v)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', background: rc.badgeBg, border:`1px solid ${rc.badgeBorder}`, borderRadius:10, cursor:'pointer', transition:'all .2s' }}
            >
              <span style={{ ...F, fontSize:12, fontWeight:700, color: rc.badgeColor }}>{rc.badge}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={rc.badgeColor} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showRoleMenu && (
              <>
                <div onClick={() => setShowRoleMenu(false)} style={{ position:'fixed', inset:0, zIndex:198 }} />
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white', borderRadius:14, border:`1px solid ${C.border}`, boxShadow:'0 12px 40px rgba(15,30,54,.14)', zIndex:199, minWidth:220, overflow:'hidden', padding:6 }}>
                  <div style={{ ...F, fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.08em', padding:'8px 12px 4px' }}>Ganti Role</div>
                  {(['wali','bk'] as Role[]).map(r => {
                    const cfg = ROLE_CFG[r]
                    const isActive = role === r
                    return (
                      <button key={r} onClick={() => { setRole(r); setPage('beranda'); setShowRoleMenu(false) }}
                        style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'10px 12px', background:isActive?cfg.badgeBg:'transparent', border:'none', borderRadius:10, cursor:'pointer', textAlign:'left' as const, transition:'background .15s' }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background=C.ice }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent' }}
                      >
                        <div style={{ width:32, height:32, borderRadius:'50%', background:cfg.avatarBg, display:'flex', alignItems:'center', justifyContent:'center', ...F, fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>{cfg.avatar}</div>
                        <div>
                          <div style={{ ...F, fontSize:13, fontWeight:700, color: isActive ? cfg.badgeColor : C.textMain }}>{cfg.name}</div>
                          <div style={{ ...F, fontSize:11, color: isActive ? cfg.badgeColor : C.textMuted }}>{cfg.label} · {cfg.sub}</div>
                        </div>
                        {isActive && <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:cfg.badgeColor, flexShrink:0 }} />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ width:1, height:24, background:C.border }} />
          {/* Avatar + name */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:rc.avatarBg, display:'flex', alignItems:'center', justifyContent:'center', ...F, fontWeight:700, fontSize:12, color:'white', flexShrink:0 }}>{rc.avatar}</div>
            <div>
              <div style={{ ...F, fontWeight:700, fontSize:13, color:C.textMain, lineHeight:1.2 }}>{rc.name}</div>
              <div style={{ ...F, fontSize:10, color:'#94A3B8', marginTop:1 }}>{rc.label} · {rc.sub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation row ── */}
      <div style={{ display:'flex', alignItems:'center', gap:4, padding:'10px 32px' }}>
        {NAV.map(item => {
          const active = page === item.id
          return (
            <TopNavItem key={item.id} item={item} active={active} onClick={() => setPage(item.id as Page)} />
          )
        })}
      </div>
    </div>
  )
}

function TopNavItem({ item, active, onClick }: { item: typeof NAV[number]; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const F = { fontFamily:"'Poppins',sans-serif" } as const
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 18px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        transition: 'all .2s ease',
        background: active
          ? 'linear-gradient(135deg,#0965fa,#00b2dd)'
          : hov ? '#F1F5F9' : 'transparent',
        boxShadow: active ? '0 3px 12px rgba(9,101,250,.28)' : 'none',
        transform: active ? 'translateY(-1px)' : 'none',
      }}
    >
      <span style={{ color: active ? 'white' : '#64748B', display:'flex', transition:'color .2s', fontSize:16 }}>{item.icon}</span>
      <span style={{ ...F, fontSize:13, fontWeight: active ? 600 : 500, color: active ? 'white' : '#64748B', letterSpacing:'0.01em', whiteSpace:'nowrap', transition:'color .2s' }}>{item.label}</span>
    </button>
  )
}

/** @deprecated kept for reference only — replaced by TopNav */
function Sidebar({ page, setPage }: { page: Page setPage: (p: Page) => void }) {
  return (
    <aside
      style={{
        width: 279,
        minHeight: "100vh",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        overflowY: "auto",
        borderRight: "1px solid #C4C5D5",
        padding: "24px 16px 24px 16px",
      }}
    >
      {/* ── Top: Logo + Nav ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 180,
              height: 67,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Mascot (flat, no SVG gradient refs) */}
            <div style={{ width: 67, height: 67, flexShrink: 0 }}>
              <OrbLogo />
            </div>
            {/* Brand text beside mascot */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  lineHeight: 1,
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(to right,#0965fa,#00b2dd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ORBI
                </span>
                <span
                  style={{
                    background: "linear-gradient(to right,#ff7000,#f1ad00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  TA
                </span>
              </div>
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#444653",
              letterSpacing: "0.02em",
              lineHeight: "20px",
              textAlign: "center",
              margin: "0 0 20px",
              paddingTop: 4,
            }}
          >
            Wali Kelas Portal
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={page === item.id}
              onClick={() => setPage(item.id as Page)}
            />
          ))}
        </nav>
      </div>

      {/* ── Bottom: Settings + Help + User ── */}
      <div
        style={{
          borderTop: "1px solid #C4C5D5",
          paddingTop: 25,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
              transition: "background .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#444653">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.74-.07-1.08l2.32-1.82c.21-.16.27-.46.13-.71l-2.2-3.81c-.12-.22-.37-.3-.59-.22l-2.74 1.1c-.57-.44-1.18-.81-1.86-1.08L14.22 2.1C14.16 1.85 13.93 1.67 13.67 1.67h-4.4c-.26 0-.49.18-.55.43L8.2 4.49c-.68.27-1.29.64-1.86 1.08L3.6 4.47c-.22-.08-.47 0-.59.22L.81 8.5c-.14.25-.08.55.13.71l2.32 1.82C3.22 11.37 3.19 11.74 3.19 12s.03.63.07.97l-2.32 1.82c-.21.16-.27.46-.13.71l2.2 3.81c.12.22.37.3.59.22l2.74-1.1c.57.44 1.18.81 1.86 1.08l.42 2.82c.06.25.29.43.55.43h4.4c.26 0 .49-.18.55-.43l.42-2.82c.68-.27 1.29-.64 1.86-1.08l2.74 1.1c.22.08.47 0 .59-.22l2.2-3.81c.14-.25.08-.55-.13-.71l-2.32-1.82z" />
            </svg>
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: "#444653",
                lineHeight: "20px",
              }}
            >
              Settings
            </span>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
              transition: "background .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#444653">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: "#444653",
                lineHeight: "20px",
              }}
            >
              Help Center
            </span>
          </button>
        </div>

        {/* User profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 8,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FF8C00,#FFB700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "white",
              flexShrink: 0,
            }}
          >
            DS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#0B1C30",
                lineHeight: "24px",
                whiteSpace: "nowrap",
              }}
            >
              Dewi Sartika
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 400,
                fontSize: 10,
                color: "#444653",
                lineHeight: "24px",
              }}
            >
              Senior Counselor
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: typeof NAV[number]
  active: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "8px 16px",
        height: 50,
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        transition: "background .18s",
        background: active
          ? "linear-gradient(to right,#0965fa,#00b2dd)"
          : hov
            ? "#F1F5F9"
            : "transparent",
        boxShadow: active ? "0 4px 14px rgba(9,101,250,.25)" : "none",
      }}
    >
      {/* Active right border accent */}
      {active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            borderRight: "4px solid #15234d",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          color: active ? "white" : "#444653",
          display: "flex",
          flexShrink: 0,
          transition: "color .18s",
        }}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: active ? "white" : "#444653",
          lineHeight: "20px",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color .18s",
        }}
      >
        {item.label}
      </span>
    </button>
  )
}

function Chip({ label, color }: { label: string color: string }) {
  return (
    <span
      style={{
        fontFamily: "'Poppins',sans-serif",
        fontSize: 10,
        fontWeight: 600,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: "2px 9px",
      }}
    >
      {label}
    </span>
  )
}

// ─── HEADER BAR ──────────────────────────────────────────────────────────────
function Header({ page }: { page: Page setPage: (p: Page) => void }) {
  const titles: Record<Page, { title: string crumb: string }> = {
    beranda: {
      title: "Beranda",
      crumb: "Gambaran menyeluruh kondisi akademik kelas",
    },
    data: { title: "Data Siswa", crumb: "Kelola data siswa XI IPA 2" },
    tryout: { title: "Monitoring Tryout", crumb: "Pantau hasil tryout siswa" },
  }
  const t = titles[page] ?? { title: page, crumb: "" }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 32px",
        background: "white",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 6px rgba(15,30,54,.06)",
      }}
    >
      {/* Left — title + subtitle */}
      <div>
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: 22,
            background: "linear-gradient(to right,#0965fa,#00b2dd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          {t.title}
        </div>
        <div
          className="font-pecita"
          style={{ fontSize: 13, color: C.orange, marginTop: 3 }}
        >
          {t.crumb}
        </div>
      </div>
      {/* Right — search + bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F8FAFC",
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: "8px 16px",
            width: 210,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontSize: 12,
              color: "#94A3B8",
            }}
          >
            Search students...
          </span>
        </div>
        {/* Bell */}
        <button
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#F8FAFC",
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.orange,
              border: "1.5px solid white",
            }}
          />
        </button>
        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: `2px solid ${C.border}`,
          }}
        >
          <img
            src={avatarImg}
            alt="Dewi Sartika"
            style={{
              width: "183.51%",
              height: "100%",
              objectFit: "cover",
              marginLeft: "-41.76%",
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── BERANDA ──────────────────────────────────────────────────────────────────
function Beranda({
  setPage,
  goToStudent,
}: {
  setPage: (p: Page) => void
  goToStudent: (id: number, tab: MainTab) => void
}) {
  const kpis = [
    {
      label: "Rata-rata Nilai",
      value: "87,6",
      sub: "↑ +2,3 vs sem lalu",
      color: C.sky,
    },
    {
      label: "Nilai Tertinggi",
      value: "96,4",
      sub: "Farah Nadia",
      color: C.green,
    },
    {
      label: "Nilai Terendah",
      value: "72,3",
      sub: "Perlu perhatian: 2 siswa",
      color: C.red,
    },
    {
      label: "Ketuntasan",
      value: "83%",
      sub: "30 dari 36 siswa tuntas",
      color: C.orange,
    },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Welcome banner ── */}
      <div
        style={{
          borderRadius: 20,
          background: "linear-gradient(135deg,#0F1E36 0%,#1E3A5F 100%)",
          padding: "26px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 32px rgba(15,30,54,.2)",
        }}
      >
        {[200, 300, 420].map((r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              right: -r / 2 + 80,
              top: "50%",
              transform: "translateY(-50%)",
              width: r,
              height: r,
              borderRadius: "50%",
              border: "1.5px solid rgba(0,163,224,.1)",
              pointerEvents: "none",
            }}
          />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="font-pecita"
            style={{ fontSize: 15, color: C.cyan, marginBottom: 8 }}
          >
            Selamat Datang,
          </div>
          <h1
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: "white",
              margin: "0 0 4px",
              lineHeight: 1.2,
            }}
          >
            Dewi Sartika
          </h1>
          <div
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,.5)",
              fontWeight: 500,
            }}
          >
            Wali Kelas · XI IPA 2
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Chip label="Semester Ganjil" color={C.sky} />
            <Chip label="2026 / 2027" color={C.yellow} />
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            className="card"
            style={{ padding: "18px 20px", borderTop: `3px solid ${k.color}` }}
          >
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: k.color,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {k.value}
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.textMain,
                marginBottom: 4,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Distribusi Nilai — full width ── */}
      <div className="card" style={{ padding: "22px 24px" }}>
        <SectionHead
          title="Distribusi Nilai"
          sub="Berdasarkan kategori capaian"
        />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={DISTRIBUSI}
            margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F5F9"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: C.textMuted, fontFamily: "Poppins" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: C.textMuted, fontFamily: "Poppins" }}
            />
            <Tooltip
              contentStyle={{
                background: C.navy,
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 12,
                fontFamily: "Poppins",
              }}
              formatter={(v: number) => [v + " siswa", "Jumlah"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {DISTRIBUSI.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Informasi Penting AI ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg,rgba(0,163,224,.07),rgba(0,180,216,.04))",
          border: "1px solid rgba(0,163,224,.18)",
          borderRadius: 16,
          padding: "22px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "linear-gradient(135deg,#00A3E0,#00B4D8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            🤖
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.textMain,
                marginBottom: 8,
              }}
            >
              Orbita AI
            </div>
            <p
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Sebagian besar siswa menunjukkan perkembangan akademik yang
              stabil. Sebanyak{" "}
              <strong style={{ color: C.textMain }}>18 siswa</strong> mengalami
              peningkatan lebih dari 5 poin, sedangkan{" "}
              <strong style={{ color: C.red }}>4 siswa</strong> mengalami
              penurunan selama dua semester berturut-turut sehingga disarankan
              mendapatkan pendampingan lebih lanjut dari Guru BK.
            </p>
          </div>
        </div>
      </div>

      {/* ── Kelengkapan + Tren sejajar ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14 }}
      >
        {/* Kelengkapan Data Profil */}
        <div
          className="card"
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SectionHead
            title="Kelengkapan Data Profil Siswa"
            sub="Status profil XI IPA 2"
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <RingProgress value={86} size={130} />
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.green,
                  }}
                >
                  31
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  Lengkap
                </div>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.red,
                  }}
                >
                  5
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  Belum
                </div>
              </div>
            </div>
            <BtnPrimary label="Lihat Detail" onClick={() => setPage("data")} />
          </div>
        </div>

        {/* Tren Perkembangan */}
        <div className="card" style={{ padding: "22px 24px" }}>
          <SectionHead
            title="Tren Perkembangan"
            sub="Rata-rata kelas per semester"
          />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={TREND}
              margin={{ top: 4, right: 8, left: -22, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                vertical={false}
              />
              <XAxis
                dataKey="sem"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
                domain={[78, 92]}
              />
              <Tooltip
                contentStyle={{
                  background: C.navy,
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Poppins",
                }}
                formatter={(v: number) => [v.toFixed(1), "Rata-rata"]}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke={C.sky}
                strokeWidth={2.5}
                dot={{ fill: C.sky, r: 4, strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Notifikasi Guru BK ── */}
      {(() => {
        const F = { fontFamily: "'Poppins',sans-serif" } as const
        const notifs = [
          {
            id: 3,
            nama: "Candra Wijaya",
            pesan: "Catatan konseling baru ditambahkan",
            prioritas: "Tinggi",
            waktu: "2 jam lalu",
            dot: "#FF4D4D",
            clr: "#CC2E2E",
            bg: "rgba(255,77,77,.08)",
            border: "rgba(255,77,77,.18)",
          },
          {
            id: 2,
            nama: "Bela Saputri",
            pesan: "Rekomendasi pendampingan diperbarui",
            prioritas: "Sedang",
            waktu: "Kemarin",
            dot: "#FFB700",
            clr: "#B5780A",
            bg: "rgba(255,183,0,.08)",
            border: "rgba(255,183,0,.2)",
          },
          {
            id: 1,
            nama: "Andi Maulana",
            pesan: "Status pendampingan berubah menjadi Normal",
            prioritas: "Rendah",
            waktu: "3 hari lalu",
            dot: "#00C46A",
            clr: "#00875A",
            bg: "rgba(0,196,106,.07)",
            border: "rgba(0,196,106,.18)",
          },
        ]
        return (
          <div className="card" style={{ overflow: "hidden" }}>
            {/* Header */}
            <div
              style={{
                padding: "16px 22px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>📝</span>
                <div
                  style={{
                    ...F,
                    fontWeight: 700,
                    fontSize: 15,
                    color: C.textMain,
                  }}
                >
                  Notifikasi Guru BK
                </div>
              </div>
              <button
                style={{
                  ...F,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.sky,
                  background: "rgba(0,163,224,.08)",
                  border: "1px solid rgba(0,163,224,.2)",
                  borderRadius: 8,
                  padding: "5px 12px",
                  cursor: "pointer",
                }}
              >
                Lihat Semua
              </button>
            </div>
            {/* List */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {notifs.map((n, i) => {
                const initials = n.nama
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                const avatarColor = AVATAR_COLORS[n.id] ?? C.sky
                return (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 22px",
                      borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                      background: "white",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.ice)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    {/* Priority dot + avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...F,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {initials}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: n.dot,
                          border: "2px solid white",
                        }}
                      />
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            ...F,
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.textMain,
                          }}
                        >
                          {n.nama}
                        </span>
                        <span
                          style={{
                            ...F,
                            fontSize: 10,
                            fontWeight: 700,
                            color: n.clr,
                            background: n.bg,
                            borderRadius: 20,
                            padding: "2px 9px",
                            border: `1px solid ${n.border}`,
                          }}
                        >
                          Prioritas {n.prioritas}
                        </span>
                      </div>
                      <div style={{ ...F, fontSize: 12, color: C.textMid }}>
                        {n.pesan}
                      </div>
                      <div
                        style={{
                          ...F,
                          fontSize: 11,
                          color: C.textMuted,
                          marginTop: 2,
                        }}
                      >
                        {n.waktu}
                      </div>
                    </div>
                    {/* Action */}
                    <button
                      onClick={() => goToStudent(n.id, "bk")}
                      style={{
                        ...F,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 14px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(9,101,250,.25)",
                        flexShrink: 0,
                      }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Detail Analisis Siswa table ── */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <SectionHead title="Detail Analisis Siswa" />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.ice }}>
              {["Nama", "Rata-rata", "Tren", "Ranking", "Detail"].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "10px 16px",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...STUDENTS]
              .sort((a, b) => b.avg - a.avg)
              .map((s, i) => (
                <tr
                  key={s.id}
                  className="tr-hover"
                  style={{ borderTop: i > 0 ? `1px solid #F8FAFC` : "none" }}
                >
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textMain,
                    }}
                  >
                    {s.nama}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color:
                        s.avg >= 85 ? C.green : s.avg >= 75 ? "#D4900A" : C.red,
                    }}
                  >
                    {s.avg}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <Badge status={s.tren} />
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          i === 0
                            ? "rgba(255,183,0,.15)"
                            : i === 1
                              ? "rgba(148,163,184,.15)"
                              : i === 2
                                ? "rgba(255,140,0,.12)"
                                : C.ice,
                        color:
                          i === 0
                            ? "#B5780A"
                            : i === 1
                              ? "#64748B"
                              : i === 2
                                ? C.orange
                                : C.textMid,
                      }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
                      onClick={() => setPage("data")}
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(0,163,224,.08)",
                        color: C.sky,
                        border: "1px solid rgba(0,163,224,.2)",
                        borderRadius: 8,
                        padding: "5px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── BERANDA GURU BK ─────────────────────────────────────────────────────────
type PotensiFiler = 'semua' | 'x' | 'xi' | 'xii'

const POTENSI_DATA: Record<PotensiFiler, { label: string; pct: number; color: string }[]> = {
  semua: [
    { label:'Teknik',    pct:40, color:'#0965fa' },
    { label:'Humaniora', pct:30, color:'#00B4D8'  },
    { label:'Medis',     pct:20, color:'#00C46A'  },
    { label:'Seni',      pct:10, color:'#FFB700'  },
  ],
  x: [
    { label:'Teknik',    pct:35, color:'#0965fa' },
    { label:'Humaniora', pct:28, color:'#00B4D8'  },
    { label:'Medis',     pct:25, color:'#00C46A'  },
    { label:'Seni',      pct:12, color:'#FFB700'  },
  ],
  xi: [
    { label:'Teknik',    pct:42, color:'#0965fa' },
    { label:'Humaniora', pct:30, color:'#00B4D8'  },
    { label:'Medis',     pct:18, color:'#00C46A'  },
    { label:'Seni',      pct:10, color:'#FFB700'  },
  ],
  xii: [
    { label:'Teknik',    pct:44, color:'#0965fa' },
    { label:'Humaniora', pct:28, color:'#00B4D8'  },
    { label:'Medis',     pct:20, color:'#00C46A'  },
    { label:'Seni',      pct:8,  color:'#FFB700'  },
  ],
}

const POTENSI_TOTAL: Record<PotensiFiler, number> = { semua:325, x:108, xi:110, xii:107 }

const BK_AKTIVITAS = [
  { nama:'Ahmad Fauzi',  aksi:'Konseling selesai',         waktu:'09:20', icon:'✅', color:'#00A36B' },
  { nama:'Sarah Amelia', aksi:'Catatan diperbarui',        waktu:'11:00', icon:'📝', color:'#00A3E0' },
  { nama:'ORBITA AI',    aksi:'Analisis 12 siswa selesai', waktu:'12:15', icon:'🤖', color:'#7C3AED' },
  { nama:'Dewi Kusuma',  aksi:'Pengajuan konseling baru',  waktu:'13:30', icon:'🔔', color:'#FF8C00' },
]

function BerandaBK({ goToStudent: _goToStudent }: { goToStudent: (id: number, tab: MainTab) => void }) {
  const F = { fontFamily:"'Poppins',sans-serif" } as const
  const [potensiFilter, setPotensiFilter] = useState<PotensiFiler>('semua')

  const kpis = [
    { icon:'👥', label:'Total Siswa',     value:325, sub:'Siswa aktif semester ini', color:'#00A3E0', accent:'rgba(0,163,224,.1)'  },
    { icon:'⚠️', label:'Siswa Prioritas', value:15,  sub:'Membutuhkan pendampingan', color:'#FF4D4D', accent:'rgba(255,77,77,.1)'  },
    { icon:'📋', label:'Belum Tes Minat', value:24,  sub:'Belum mengisi asesmen',    color:'#FF8C00', accent:'rgba(255,183,0,.1)'  },
  ]

  const potensiOptions: { id: PotensiFiler; label: string }[] = [
    { id:'semua', label:'Semua'    },
    { id:'x',     label:'Kelas X'  },
    { id:'xi',    label:'Kelas XI' },
    { id:'xii',   label:'Kelas XII'},
  ]
  const activePotensi = POTENSI_DATA[potensiFilter]
  const activeTotal   = POTENSI_TOTAL[potensiFilter]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Page header */}
      <div>
        <h2 style={{ ...F, fontSize:22, fontWeight:700, color:C.textMain, margin:0, lineHeight:1.2 }}>Dashboard Guru BK</h2>
        <div style={{ ...F, fontSize:13, color:C.orange, marginTop:4, fontStyle:'italic' }}>Pantau perkembangan dan kebutuhan konseling siswa di seluruh sekolah.</div>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {kpis.map(k=>(
          <div key={k.label} className="card" style={{ padding:'20px 22px', borderTop:`3px solid ${k.color}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:k.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{k.icon}</div>
              <span style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', lineHeight:1.3 }}>{k.label}</span>
            </div>
            <div style={{ ...F, fontSize:32, fontWeight:800, color:k.color, lineHeight:1 }}>{k.value}</div>
            <div style={{ ...F, fontSize:12, color:C.textMuted, marginTop:6 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ORBITA AI Monitoring */}
      <div style={{ background:'linear-gradient(135deg,rgba(9,101,250,.06),rgba(0,178,221,.04))', border:'1px solid rgba(9,101,250,.18)', borderRadius:18, padding:'26px 30px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:20 }}>
          <div style={{ width:54, height:54, borderRadius:14, background:'linear-gradient(135deg,#0965fa,#00b2dd)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:26, boxShadow:'0 4px 16px rgba(9,101,250,.3)' }}>🤖</div>
          <div style={{ flex:1 }}>
            <div style={{ ...F, fontSize:16, fontWeight:700, color:C.textMain, marginBottom:4 }}>ORBITA AI Monitoring</div>
            <div style={{ ...F, fontSize:13, color:C.textMuted, marginBottom:16 }}>Berdasarkan analisis AI minggu ini:</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
              {[
                { text:<><strong style={{ color:'#FF4D4D' }}>8 siswa</strong> mengalami penurunan performa akademik.</>, dot:'#FF4D4D' },
                { text:<><strong style={{ color:'#FF8C00' }}>4 siswa kelas XII</strong> belum mengikuti Tes Minat Bakat.</>, dot:'#FF8C00' },
                { text:<><strong style={{ color:'#7C3AED' }}>12 siswa</strong> memiliki ketidaksesuaian antara minat dan performa akademik.</>, dot:'#7C3AED' },
              ].map((item,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:item.dot, flexShrink:0, marginTop:6 }} />
                  <span style={{ ...F, fontSize:13, color:C.textMid, lineHeight:1.7 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ ...F, fontSize:12, color:C.textMid, fontStyle:'italic', marginBottom:20 }}>
              AI merekomendasikan siswa-siswa tersebut menjadi prioritas pendampingan.
            </div>
            <button
              style={{ ...F, fontSize:13, fontWeight:700, color:'#0965fa', background:'white', border:'1.5px solid #0965fa', borderRadius:10, padding:'10px 22px', cursor:'pointer', boxShadow:'0 2px 8px rgba(9,101,250,.12)', transition:'all .18s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(9,101,250,.06)' }}
              onMouseLeave={e=>{ e.currentTarget.style.background='white' }}>
              Lihat Daftar Prioritas →
            </button>
          </div>
        </div>
      </div>

      {/* 2-col: Peta Potensi + Aktivitas Terkini */}
      <div style={{ display:'grid', gridTemplateColumns:'420px 1fr', gap:14 }}>

        {/* Peta Potensi Siswa */}
        <div className="card" style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:18 }}>
            <div>
              <div style={{ ...F, fontSize:14, fontWeight:700, color:C.textMain }}>Peta Potensi Siswa</div>
              <div style={{ ...F, fontSize:12, color:C.orange, marginTop:2, fontStyle:'italic' }}>{activeTotal} siswa telah dianalisis</div>
            </div>
            <div style={{ display:'flex', background:C.ice, borderRadius:10, padding:3, gap:2, flexShrink:0 }}>
              {potensiOptions.map(opt=>{
                const active = potensiFilter === opt.id
                return (
                  <button key={opt.id} onClick={()=>setPotensiFilter(opt.id)}
                    style={{ ...F, fontSize:11, fontWeight:600, border:'none', borderRadius:8, padding:'6px 12px', cursor:'pointer', transition:'all .18s',
                      background: active ? 'linear-gradient(135deg,#0965fa,#00b2dd)' : 'transparent',
                      color:      active ? 'white' : C.textMuted,
                      boxShadow:  active ? '0 2px 8px rgba(9,101,250,.28)' : 'none',
                    }}>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={activePotensi} dataKey="pct" nameKey="label" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                {activePotensi.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background:C.navy, border:'none', borderRadius:10, color:'white', fontSize:12, fontFamily:'Poppins' }}
                formatter={(v: number, name: string) => [`${v}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px', marginTop:8 }}>
            {activePotensi.map(p=>(
              <div key={p.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:p.color, flexShrink:0 }} />
                <span style={{ ...F, fontSize:12, color:C.textMid, flex:1 }}>{p.label}</span>
                <span style={{ ...F, fontSize:13, fontWeight:700, color:C.textMain }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terkini */}
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'16px 22px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ ...F, fontWeight:700, fontSize:15, color:C.textMain }}>Aktivitas Terkini</div>
              <div style={{ ...F, fontSize:12, color:C.orange, marginTop:2, fontStyle:'italic' }}>Aktivitas hari ini</div>
            </div>
            <span style={{ ...F, fontSize:11, fontWeight:600, color:'#0965fa', background:'rgba(9,101,250,.08)', border:'1px solid rgba(9,101,250,.2)', borderRadius:8, padding:'4px 12px' }}>Hari Ini</span>
          </div>
          <div style={{ padding:'8px 22px' }}>
            {BK_AKTIVITAS.map((a,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 0', borderBottom:i<BK_AKTIVITAS.length-1?`1px solid ${C.border}`:'none' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:`${a.color}18`, border:`1.5px solid ${a.color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ ...F, fontSize:13, fontWeight:700, color:a.nama==='ORBITA AI'?'#7C3AED':C.textMain }}>{a.nama}</div>
                  <div style={{ ...F, fontSize:12, color:C.textMid, marginTop:2 }}>{a.aksi}</div>
                </div>
                <span style={{ ...F, fontSize:12, fontWeight:600, color:C.textMuted, flexShrink:0, background:C.ice, borderRadius:8, padding:'3px 10px' }}>{a.waktu}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

function StatKpi({
  icon,
  label,
  value,
  sub,
  subClr,
  progress,
}: {
  icon: string
  label: string
  value: string
  sub?: string
  subClr?: string
  progress?: number
}) {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Poppins',sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: C.textMain,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {progress !== undefined && (
        <div style={{ marginTop: 10 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontSize: 11,
              color: C.sky,
              fontWeight: 600,
              marginTop: 5,
            }}
          >
            {progress}% Lengkap
          </div>
        </div>
      )}
      {sub && (
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: subClr ?? C.textMuted,
            marginTop: 6,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}

function BtnPrimary({
  label,
  onClick,
  full,
}: {
  label: string
  onClick?: () => void
  full?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: "linear-gradient(135deg,#00A3E0,#00B4D8)",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "10px 20px",
        fontFamily: "'Poppins',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,163,224,.28)",
        transition: "opacity .18s, transform .18s",
        width: full ? "100%" : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = ".9"
        e.currentTarget.style.transform = "scale(1.015)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1"
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      {label}
    </button>
  )
}

function BtnOrange({ label, onClick }: { label: string onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "linear-gradient(135deg,#FF8C00,#FFB700)",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "10px 18px",
        fontFamily: "'Poppins',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(255,140,0,.28)",
        transition: "opacity .18s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = ".9")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </button>
  )
}

function BtnGhost({ label, onClick }: { label: string onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "white",
        color: C.textMid,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "10px 18px",
        fontFamily: "'Poppins',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.ice
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white"
      }}
    >
      {label}
    </button>
  )
}

// ─── PUSAT DATA AKADEMIK ──────────────────────────────────────────────────────
// Avatar colour per student ID — matches the distinct per-row colours in the image
// ── Extended student profile data ─────────────────────────────────────────────
const PROFIL_KELUARGA: Record<number, {
  ayah: string
  ibu: string
  pekerjaan: string
  penghasilan: string
  jumlahSaudara: number
  tinggalDengan: string
  kondisiEkonomi: string
  catatan: string
}> = {
  1: {
    ayah: "Budi Maulana",
    ibu: "Sari Maulana",
    pekerjaan: "Wiraswasta / Guru SD",
    penghasilan: "Rp 5–8 jt/bln",
    jumlahSaudara: 2,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Menengah",
    catatan: "Keluarga harmonis, orang tua aktif memantau perkembangan anak.",
  },
  2: {
    ayah: "Hendra Saputri",
    ibu: "Dewi Saputri",
    pekerjaan: "PNS / Ibu Rumah Tangga",
    penghasilan: "Rp 6–9 jt/bln",
    jumlahSaudara: 1,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Menengah Atas",
    catatan: "Dukungan keluarga sangat kuat, aktif di kegiatan sekolah.",
  },
  3: {
    ayah: "(Almarhum)",
    ibu: "Ratna Wijaya",
    pekerjaan: "— / Pedagang",
    penghasilan: "Rp 2–3 jt/bln",
    jumlahSaudara: 3,
    tinggalDengan: "Ibu & nenek",
    kondisiEkonomi: "Kurang Mampu",
    catatan:
      "Orang tua tunggal. Siswa terkadang membantu ibu berjualan setelah sekolah. Perlu perhatian ekstra.",
  },
  4: {
    ayah: "Agus Lestari",
    ibu: "Nina Lestari",
    pekerjaan: "Karyawan Swasta / Bidan",
    penghasilan: "Rp 8–12 jt/bln",
    jumlahSaudara: 2,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Menengah Atas",
    catatan:
      "Keluarga sangat mendukung pendidikan. Berencana kuliah di PTN terbaik.",
  },
  5: {
    ayah: "Rudi Pratama",
    ibu: "Yeni Pratama",
    pekerjaan: "Buruh / Pedagang kecil",
    penghasilan: "Rp 2–4 jt/bln",
    jumlahSaudara: 4,
    tinggalDengan: "Orang tua kandung + kakek",
    kondisiEkonomi: "Kurang Mampu",
    catatan:
      "Kondisi ekonomi memprihatinkan. Siswa mengalami tekanan untuk bekerja paruh waktu. Disarankan ajukan KIP.",
  },
  6: {
    ayah: "Dr. Ahmad Nadia",
    ibu: "Dr. Siti Nadia",
    pekerjaan: "Dokter / Dosen",
    penghasilan: "Rp 20 jt+/bln",
    jumlahSaudara: 1,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Atas",
    catatan:
      "Latar belakang keluarga akademis sangat kuat. Orang tua sangat involved dalam pendidikan.",
  },
  7: {
    ayah: "Joko Santoso",
    ibu: "Rina Santoso",
    pekerjaan: "Teknisi / Admin",
    penghasilan: "Rp 5–7 jt/bln",
    jumlahSaudara: 2,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Menengah",
    catatan:
      "Keluarga stabil. Orang tua mendukung namun tidak terlalu intensif memantau.",
  },
  8: {
    ayah: "Hasan Pertiwi",
    ibu: "Lilis Pertiwi",
    pekerjaan: "Pegawai Bank / Guru",
    penghasilan: "Rp 10–14 jt/bln",
    jumlahSaudara: 2,
    tinggalDengan: "Orang tua kandung",
    kondisiEkonomi: "Menengah Atas",
    catatan:
      "Keluarga terencana dengan baik. Menyiapkan tabungan pendidikan sejak dini.",
  },
}

const PROFIL_BELAJAR: Record<number, {
  gayaBelajar: string
  kebutuhanKhusus: string | null
  catatan: string
  kekuatan: string[]
  tantangan: string[]
}> = {
  1: {
    gayaBelajar: "Visual — Kinestetik",
    kebutuhanKhusus: null,
    catatan:
      "Belajar terbaik dengan diagram, mind map, dan praktik langsung. Aktif di diskusi kelompok.",
    kekuatan: [
      "Fokus tinggi",
      "Cepat memahami konsep abstrak",
      "Mandiri dalam belajar",
    ],
    tantangan: ["Mudah bosan dengan metode ceramah", "Perlu variasi aktivitas"],
  },
  2: {
    gayaBelajar: "Auditori — Membaca/Menulis",
    kebutuhanKhusus: null,
    catatan:
      "Suka mendengarkan penjelasan guru dan mencatat detail. Performa terbaik saat ada diskusi kelas.",
    kekuatan: [
      "Teliti dan rapi",
      "Kemampuan verbal tinggi",
      "Konsisten dalam belajar",
    ],
    tantangan: [
      "Perlu waktu lebih untuk soal numerik",
      "Kurang percaya diri saat presentasi",
    ],
  },
  3: {
    gayaBelajar: "Kinestetik",
    kebutuhanKhusus: "Diskalkulia ringan (terdeteksi kelas 9)",
    catatan:
      "Butuh pendekatan konkret dan bergerak. Kesulitan pada angka dan urutan logis matematika. Sudah diketahui orang tua.",
    kekuatan: ["Kreativitas tinggi", "Mudah bergaul", "Kemampuan seni baik"],
    tantangan: [
      "Matematika & Fisika",
      "Konsentrasi jangka panjang",
      "Perlu instruksi bertahap",
    ],
  },
  4: {
    gayaBelajar: "Visual — Membaca/Menulis",
    kebutuhanKhusus: null,
    catatan:
      "Suka membaca referensi tambahan. Belajar mandiri sangat efektif. Membuat rangkuman visual sebelum ujian.",
    kekuatan: ["Disiplin", "Kemampuan analisis tinggi", "Terorganisir"],
    tantangan: ["Terlalu perfeksionis", "Kadang overload tugas mandiri"],
  },
  5: {
    gayaBelajar: "Auditori",
    kebutuhanKhusus: "Gangguan kecemasan ujian (mild test anxiety)",
    catatan:
      "Performanya sering di bawah kemampuan sebenarnya saat ujian. Sudah dikonsultasikan ke BK.",
    kekuatan: ["Kemampuan lisan baik", "Empati tinggi", "Kreatif dalam verbal"],
    tantangan: [
      "Kecemasan saat ujian",
      "Motivasi fluktuatif",
      "Lingkungan rumah kurang kondusif",
    ],
  },
  6: {
    gayaBelajar: "Visual — Logis/Matematis",
    kebutuhanKhusus: null,
    catatan:
      "Kemampuan sangat superior. Belajar mandiri dengan kecepatan tinggi. Sering membantu teman belajar.",
    kekuatan: [
      "Pemikiran logis sangat kuat",
      "Kecepatan belajar tinggi",
      "Leadership",
    ],
    tantangan: ["Bisa bosan di kelas reguler", "Perlu tantangan lebih"],
  },
  7: {
    gayaBelajar: "Kinestetik — Visual",
    kebutuhanKhusus: null,
    catatan:
      "Belajar baik lewat praktik dan demonstrasi. Cukup konsisten namun butuh motivasi eksternal.",
    kekuatan: ["Pekerja keras", "Mudah adaptasi", "Senang kerja kelompok"],
    tantangan: ["Kurang inisiatif mandiri", "Perlu dorongan eksternal"],
  },
  8: {
    gayaBelajar: "Membaca/Menulis — Auditori",
    kebutuhanKhusus: null,
    catatan:
      "Sangat rajin membuat catatan. Belajar dengan baik saat ada penjelasan verbal yang jelas dari guru.",
    kekuatan: [
      "Rajin dan konsisten",
      "Catatan sangat rapi",
      "Kemampuan memori baik",
    ],
    tantangan: [
      "Kadang terlalu fokus hafalan vs pemahaman",
      "Kurang eksplorasi mandiri",
    ],
  },
}

const PROFIL_MINAT: Record<number, {
  minat: string[]
  bakat: string[]
  targetPTN: string
  targetJurusan: string
  rekomendasiAI: string[]
  motivasi: string
}> = {
  1: {
    minat: ["Teknologi & Pemrograman", "Matematika", "Gaming"],
    bakat: ["Logika Komputasional", "Problem Solving"],
    targetPTN: "Universitas Indonesia",
    targetJurusan: "Teknik Informatika",
    rekomendasiAI: [
      "Teknik Informatika UI / ITB",
      "Ilmu Komputer UNDIP",
      "Sistem Informasi ITS",
    ],
    motivasi: "Ingin membangun startup teknologi setelah lulus.",
  },
  2: {
    minat: ["Biologi", "Kesehatan", "Memasak"],
    bakat: ["Kemampuan hafalan", "Ketelitian detail"],
    targetPTN: "UNPAD",
    targetJurusan: "Kedokteran",
    rekomendasiAI: [
      "Kedokteran UNPAD / UGM",
      "Farmasi ITB",
      "Kesehatan Masyarakat UI",
    ],
    motivasi:
      "Terinspirasi dari pengalaman sakit semasa kecil, ingin menjadi dokter.",
  },
  3: {
    minat: ["Seni Rupa", "Musik", "Desain"],
    bakat: ["Kreativitas visual", "Bermain gitar"],
    targetPTN: "ISI Yogyakarta",
    targetJurusan: "Desain Komunikasi Visual",
    rekomendasiAI: ["DKV ISI Yogyakarta", "Seni Rupa IKJ", "Desain Produk ITB"],
    motivasi: "Ingin menjadi desainer grafis profesional.",
  },
  4: {
    minat: ["Kimia", "Biologi", "Riset"],
    bakat: ["Analisis laboratorium", "Menulis ilmiah"],
    targetPTN: "ITB",
    targetJurusan: "Farmasi",
    rekomendasiAI: ["Farmasi ITB / UI", "Kimia ITB", "Biokimia UGM"],
    motivasi: "Tertarik pada penelitian obat-obatan herbal Indonesia.",
  },
  5: {
    minat: ["Hukum", "Debat", "Politik"],
    bakat: ["Kemampuan argumentasi", "Public speaking"],
    targetPTN: "Universitas Indonesia",
    targetJurusan: "Hukum",
    rekomendasiAI: [
      "Hukum UI / UGM",
      "Ilmu Politik FISIP UI",
      "Hubungan Internasional UNPAD",
    ],
    motivasi: "Ingin berkontribusi di bidang keadilan sosial.",
  },
  6: {
    minat: ["Matematika", "Fisika", "Olimpiade Sains"],
    bakat: ["Pemikiran matematis tinggi", "Riset independen"],
    targetPTN: "ITB / UI",
    targetJurusan: "Matematika / Fisika",
    rekomendasiAI: ["Matematika ITB", "Fisika UI", "Teknik Fisika ITB"],
    motivasi: "Ingin menjadi peneliti dan dosen di PTN bergengsi.",
  },
  7: {
    minat: ["Teknik Sipil", "Arsitektur", "Olahraga"],
    bakat: ["Kemampuan spasial", "Fisik prima"],
    targetPTN: "ITS Surabaya",
    targetJurusan: "Teknik Sipil",
    rekomendasiAI: [
      "Teknik Sipil ITS / UI",
      "Arsitektur ITB",
      "Teknik Lingkungan ITS",
    ],
    motivasi: "Ingin membangun infrastruktur Indonesia timur.",
  },
  8: {
    minat: ["Psikologi", "Konseling", "Seni"],
    bakat: ["Empati tinggi", "Mendengarkan aktif"],
    targetPTN: "UGM",
    targetJurusan: "Psikologi",
    rekomendasiAI: [
      "Psikologi UGM / UI",
      "Bimbingan Konseling UNY",
      "Ilmu Komunikasi UNPAD",
    ],
    motivasi: "Ingin membantu orang lain mengatasi masalah mental.",
  },
}

const ABSENSI: Record<number, {
  hadir: number
  sakit: number
  izin: number
  alpha: number
  total: number
  bulanan: { bulan: string pct: number }[]
}> = {
  1: {
    hadir: 88,
    sakit: 3,
    izin: 2,
    alpha: 0,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 100 },
      { bulan: "Mar", pct: 96 },
      { bulan: "Apr", pct: 94 },
      { bulan: "Mei", pct: 92 },
      { bulan: "Jun", pct: 95 },
    ],
  },
  2: {
    hadir: 90,
    sakit: 2,
    izin: 1,
    alpha: 0,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 100 },
      { bulan: "Mar", pct: 98 },
      { bulan: "Apr", pct: 97 },
      { bulan: "Mei", pct: 96 },
      { bulan: "Jun", pct: 98 },
    ],
  },
  3: {
    hadir: 74,
    sakit: 8,
    izin: 6,
    alpha: 5,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 88 },
      { bulan: "Mar", pct: 80 },
      { bulan: "Apr", pct: 76 },
      { bulan: "Mei", pct: 72 },
      { bulan: "Jun", pct: 82 },
    ],
  },
  4: {
    hadir: 91,
    sakit: 1,
    izin: 1,
    alpha: 0,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 100 },
      { bulan: "Mar", pct: 98 },
      { bulan: "Apr", pct: 99 },
      { bulan: "Mei", pct: 96 },
      { bulan: "Jun", pct: 98 },
    ],
  },
  5: {
    hadir: 70,
    sakit: 10,
    izin: 8,
    alpha: 5,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 82 },
      { bulan: "Mar", pct: 76 },
      { bulan: "Apr", pct: 72 },
      { bulan: "Mei", pct: 68 },
      { bulan: "Jun", pct: 78 },
    ],
  },
  6: {
    hadir: 93,
    sakit: 0,
    izin: 0,
    alpha: 0,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 100 },
      { bulan: "Mar", pct: 100 },
      { bulan: "Apr", pct: 100 },
      { bulan: "Mei", pct: 100 },
      { bulan: "Jun", pct: 100 },
    ],
  },
  7: {
    hadir: 85,
    sakit: 4,
    izin: 3,
    alpha: 1,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 96 },
      { bulan: "Mar", pct: 92 },
      { bulan: "Apr", pct: 90 },
      { bulan: "Mei", pct: 88 },
      { bulan: "Jun", pct: 94 },
    ],
  },
  8: {
    hadir: 89,
    sakit: 2,
    izin: 2,
    alpha: 0,
    total: 93,
    bulanan: [
      { bulan: "Feb", pct: 98 },
      { bulan: "Mar", pct: 96 },
      { bulan: "Apr", pct: 95 },
      { bulan: "Mei", pct: 94 },
      { bulan: "Jun", pct: 97 },
    ],
  },
}

const SISWA_EXTENDED: Record<number, {
  tempatLahir: string
  tanggalLahir: string
  kewarganegaraan: string
  agama: string
  jurusan: string
  statusSiswa: string
  alamat: string
  provinsi: string
  kota: string
  kecamatan: string
  kelurahan: string
  kodePos: string
  hp: string
  email: string
  kontakDarurat: string
  ayah: { nama: string pendidikan: string pekerjaan: string hp: string }
  ibu: { nama: string pendidikan: string pekerjaan: string hp: string }
  wali?: { nama: string hubungan: string pekerjaan: string hp: string }
  statusOrtu: string
  bantuanPendidikan: string[]
  anakKe: number
  jumlahSaudaraKandung: number
  riwayatPenyakit: string
  nilaiTOTerakhir: number
}> = {
  1: {
    tempatLahir: "Bandung",
    tanggalLahir: "15 Maret 2008",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Merdeka No. 12, Kel. Pasirkaliki",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Cicendo",
    kelurahan: "Pasirkaliki",
    kodePos: "40171",
    hp: "0812-1234-5678",
    email: "ahmad.m@student.sman1bdg.sch.id",
    kontakDarurat: "0821-0001-0001",
    ayah: {
      nama: "Budi Maulana",
      pendidikan: "S1",
      pekerjaan: "PNS",
      hp: "0821-0001-0001",
    },
    ibu: {
      nama: "Sri Rahayu",
      pendidikan: "S1",
      pekerjaan: "Guru",
      hp: "0812-0002-0002",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 1,
    jumlahSaudaraKandung: 2,
    riwayatPenyakit: "Tidak ada",
    nilaiTOTerakhir: 88,
  },
  2: {
    tempatLahir: "Jakarta",
    tanggalLahir: "3 Juli 2007",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Sudirman No. 45, Kel. Setiabudi",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Lengkong",
    kelurahan: "Setiabudi",
    kodePos: "40115",
    hp: "0813-2345-6789",
    email: "bima.s@student.sman1bdg.sch.id",
    kontakDarurat: "0822-0002-0002",
    ayah: {
      nama: "Surya Pratama",
      pendidikan: "S2",
      pekerjaan: "Pengusaha",
      hp: "0822-0002-0002",
    },
    ibu: {
      nama: "Dewi Pratama",
      pendidikan: "S1",
      pekerjaan: "Dokter",
      hp: "0813-0003-0003",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 2,
    jumlahSaudaraKandung: 1,
    riwayatPenyakit: "Tidak ada",
    nilaiTOTerakhir: 91,
  },
  3: {
    tempatLahir: "Cimahi",
    tanggalLahir: "22 Januari 2008",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Cihampelas No. 88, Kel. Cipaganti",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Coblong",
    kelurahan: "Cipaganti",
    kodePos: "40131",
    hp: "0814-3456-7890",
    email: "citra.w@student.sman1bdg.sch.id",
    kontakDarurat: "0823-0003-0003",
    ayah: {
      nama: "Wahyu Santoso",
      pendidikan: "SMA",
      pekerjaan: "Buruh Pabrik",
      hp: "0823-0003-0003",
    },
    ibu: {
      nama: "Rini Santoso",
      pendidikan: "SMP",
      pekerjaan: "Ibu Rumah Tangga",
      hp: "0814-0004-0004",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: ["KIP", "PIP"],
    anakKe: 1,
    jumlahSaudaraKandung: 3,
    riwayatPenyakit: "Maag kronis",
    nilaiTOTerakhir: 72,
  },
  4: {
    tempatLahir: "Sumedang",
    tanggalLahir: "8 Oktober 2007",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Diponegoro No. 23, Kel. Braga",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Sumur Bandung",
    kelurahan: "Braga",
    kodePos: "40111",
    hp: "0815-4567-8901",
    email: "dinda.a@student.sman1bdg.sch.id",
    kontakDarurat: "0824-0004-0004",
    ayah: {
      nama: "Ahmad Fauzi",
      pendidikan: "S1",
      pekerjaan: "Dosen",
      hp: "0824-0004-0004",
    },
    ibu: {
      nama: "Siti Fauzi",
      pendidikan: "S2",
      pekerjaan: "Apoteker",
      hp: "0815-0005-0005",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 1,
    jumlahSaudaraKandung: 0,
    riwayatPenyakit: "Tidak ada",
    nilaiTOTerakhir: 94,
  },
  5: {
    tempatLahir: "Garut",
    tanggalLahir: "17 Mei 2008",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Asia Afrika No. 5, Kel. Balonggede",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Regol",
    kelurahan: "Balonggede",
    kodePos: "40251",
    hp: "0816-5678-9012",
    email: "eko.p@student.sman1bdg.sch.id",
    kontakDarurat: "0825-0005-0005",
    ayah: {
      nama: "Prasetyo Adi",
      pendidikan: "SMA",
      pekerjaan: "Sopir",
      hp: "0825-0005-0005",
    },
    ibu: {
      nama: "Yuni Adi",
      pendidikan: "SMP",
      pekerjaan: "Pedagang",
      hp: "0816-0006-0006",
    },
    statusOrtu: "Cerai",
    bantuanPendidikan: ["PIP", "Beasiswa Daerah"],
    anakKe: 2,
    jumlahSaudaraKandung: 2,
    riwayatPenyakit: "Hipertensi ringan",
    nilaiTOTerakhir: 69,
  },
  6: {
    tempatLahir: "Bandung",
    tanggalLahir: "30 Agustus 2007",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Dago No. 100, Kel. Dago",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Coblong",
    kelurahan: "Dago",
    kodePos: "40135",
    hp: "0817-6789-0123",
    email: "farah.n@student.sman1bdg.sch.id",
    kontakDarurat: "0826-0006-0006",
    ayah: {
      nama: "Nanda Kusuma",
      pendidikan: "S2",
      pekerjaan: "Direktur",
      hp: "0826-0006-0006",
    },
    ibu: {
      nama: "Lia Kusuma",
      pendidikan: "S1",
      pekerjaan: "Notaris",
      hp: "0817-0007-0007",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 1,
    jumlahSaudaraKandung: 1,
    riwayatPenyakit: "Tidak ada",
    nilaiTOTerakhir: 96,
  },
  7: {
    tempatLahir: "Tasikmalaya",
    tanggalLahir: "12 Desember 2007",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. RE Martadinata No. 67, Kel. Kebonwaru",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Batununggal",
    kelurahan: "Kebonwaru",
    kodePos: "40274",
    hp: "0818-7890-1234",
    email: "gilang.r@student.sman1bdg.sch.id",
    kontakDarurat: "0827-0007-0007",
    ayah: {
      nama: "Ridwan Gunawan",
      pendidikan: "S1",
      pekerjaan: "Insinyur",
      hp: "0827-0007-0007",
    },
    ibu: {
      nama: "Ani Gunawan",
      pendidikan: "D3",
      pekerjaan: "Perawat",
      hp: "0818-0008-0008",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 3,
    jumlahSaudaraKandung: 2,
    riwayatPenyakit: "Asma ringan",
    nilaiTOTerakhir: 83,
  },
  8: {
    tempatLahir: "Ciamis",
    tanggalLahir: "25 April 2008",
    kewarganegaraan: "WNI",
    agama: "Islam",
    jurusan: "IPA",
    statusSiswa: "Aktif",
    alamat: "Jl. Buah Batu No. 34, Kel. Burangrang",
    provinsi: "Jawa Barat",
    kota: "Kota Bandung",
    kecamatan: "Lengkong",
    kelurahan: "Burangrang",
    kodePos: "40265",
    hp: "0819-8901-2345",
    email: "hani.s@student.sman1bdg.sch.id",
    kontakDarurat: "0828-0008-0008",
    ayah: {
      nama: "Suherman",
      pendidikan: "S1",
      pekerjaan: "Polisi",
      hp: "0828-0008-0008",
    },
    ibu: {
      nama: "Risa Suherman",
      pendidikan: "S1",
      pekerjaan: "Bidan",
      hp: "0819-0009-0009",
    },
    statusOrtu: "Lengkap",
    bantuanPendidikan: [],
    anakKe: 2,
    jumlahSaudaraKandung: 1,
    riwayatPenyakit: "Tidak ada",
    nilaiTOTerakhir: 87,
  },
}

const CATATAN_BK: Record<number, {
  konselor: string
  tanggal: string
  prioritas: "Tinggi" | "Sedang" | "Rendah"
  topik: string
  catatan: string
  rekomendasi: string
  tindakLanjut: string
}[]> = {
  1: [
    {
      konselor: "Ibu Ratna Dewi, S.Pd",
      tanggal: "12 Mei 2026",
      prioritas: "Rendah",
      topik: "Penjurusan & Target PTN",
      catatan:
        "Siswa menunjukkan motivasi tinggi dan sudah memiliki target PTN yang jelas. Perlu dukungan dalam manajemen waktu belajar mandiri agar konsisten.",
      rekomendasi:
        "Berikan jadwal belajar terstruktur dan dorong bergabung dengan kelompok belajar.",
      tindakLanjut: "Pantau konsistensi nilai setiap TO berikutnya.",
    },
  ],
  2: [
    {
      konselor: "Ibu Ratna Dewi, S.Pd",
      tanggal: "18 Mei 2026",
      prioritas: "Rendah",
      topik: "Pengembangan Diri",
      catatan:
        "Siswa aktif dan memiliki kemampuan kepemimpinan yang baik. Beberapa kali terlihat kurang fokus di kelas karena kelelahan akibat kegiatan OSIS.",
      rekomendasi:
        "Anjurkan siswa untuk lebih menyeimbangkan antara kegiatan organisasi dan belajar.",
      tindakLanjut: "Koordinasi dengan pembina OSIS.",
    },
  ],
  3: [
    {
      konselor: "Pak Hendra Wijaya, M.Pd",
      tanggal: "5 Apr 2026",
      prioritas: "Tinggi",
      topik: "Kehadiran & Motivasi Belajar",
      catatan:
        "Siswa sering tidak masuk tanpa keterangan jelas. Saat dikonseling, mengungkapkan rasa kurang nyaman di kelas dan kesulitan mengikuti materi. Kondisi keluarga juga kurang kondusif.",
      rekomendasi:
        "Perlu pendampingan intensif. Koordinasikan dengan orang tua dan pertimbangkan bantuan beasiswa jika kondisi ekonomi menjadi faktor.",
      tindakLanjut:
        "Jadwalkan pertemuan orang tua bulan depan. Wali kelas perhatikan kehadiran secara berkala.",
    },
    {
      konselor: "Pak Hendra Wijaya, M.Pd",
      tanggal: "2 Mei 2026",
      prioritas: "Tinggi",
      topik: "Tindak Lanjut Kehadiran",
      catatan:
        "Kehadiran sedikit membaik namun belum stabil. Orang tua sudah dihubungi via telepon dan berjanji lebih aktif memantau.",
      rekomendasi: "Lanjutkan pemantauan mingguan.",
      tindakLanjut: "Check-in dengan siswa setiap Senin pagi.",
    },
  ],
  4: [
    {
      konselor: "Ibu Ratna Dewi, S.Pd",
      tanggal: "20 Mei 2026",
      prioritas: "Rendah",
      topik: "Persiapan UTBK",
      catatan:
        "Siswa sangat siap secara akademik. Kecemasan ujian sedikit meningkat menjelang UTBK. Perlu strategi manajemen stres.",
      rekomendasi:
        "Latihan relaksasi dan teknik manajemen kecemasan. Ingatkan untuk istirahat cukup.",
      tindakLanjut: "Pantau kondisi psikologis menjelang ujian.",
    },
  ],
  5: [
    {
      konselor: "Pak Hendra Wijaya, M.Pd",
      tanggal: "10 Apr 2026",
      prioritas: "Tinggi",
      topik: "Kehadiran & Kondisi Kesehatan",
      catatan:
        "Siswa sering absen karena sakit. Dari perbincangan, diduga ada masalah psikosomatis akibat tekanan belajar dan ekspektasi orang tua yang tinggi.",
      rekomendasi:
        "Rujuk ke konselor psikologi jika kondisi berlanjut. Kurangi tekanan dan berikan apresiasi atas usaha, bukan hanya hasil.",
      tindakLanjut:
        "Wali kelas koordinasi dengan orang tua agar tidak memberi tekanan berlebihan.",
    },
  ],
  6: [
    {
      konselor: "Ibu Ratna Dewi, S.Pd",
      tanggal: "25 Mei 2026",
      prioritas: "Rendah",
      topik: "Monitoring Rutin",
      catatan:
        "Siswa dalam kondisi sangat baik. Prestatif, disiplin, dan memiliki hubungan sosial yang sehat dengan teman-teman.",
      rekomendasi: "Pertahankan kondisi. Dorong untuk menjadi tutor sebaya.",
      tindakLanjut: "Tidak ada tindak lanjut khusus.",
    },
  ],
  7: [
    {
      konselor: "Pak Hendra Wijaya, M.Pd",
      tanggal: "8 Mei 2026",
      prioritas: "Sedang",
      topik: "Adaptasi & Kepercayaan Diri",
      catatan:
        "Siswa cenderung pendiam dan kurang aktif berpartisipasi di kelas. Merasa kurang percaya diri dengan kemampuannya meski nilai cukup baik.",
      rekomendasi:
        "Beri kesempatan presentasi dan diskusi kelompok. Apresiasi kontribusi sekecil apapun.",
      tindakLanjut:
        "Wali kelas perhatikan dan beri dorongan positif saat di kelas.",
    },
  ],
  8: [
    {
      konselor: "Ibu Ratna Dewi, S.Pd",
      tanggal: "15 Mei 2026",
      prioritas: "Sedang",
      topik: "Pilihan Jurusan",
      catatan:
        "Siswa bimbang antara mengikuti keinginan orang tua (Kedokteran) atau minat sendiri (Desain Komunikasi Visual). Butuh eksplorasi lebih lanjut.",
      rekomendasi:
        "Fasilitasi siswa untuk mengenal kedua bidang lebih dalam. Libatkan orang tua dalam diskusi terarah.",
      tindakLanjut: "Jadwalkan sesi konseling lanjutan dengan orang tua hadir.",
    },
  ],
}

const AVATAR_COLORS: Record<number, string> = {
  1: "#00B4D8", // AM — teal
  2: "#FF8C00", // BS — orange
  3: "#7C3AED", // CW — purple
  4: "#00A3E0", // DL — sky
  5: "#FF4D4D", // EP — red
  6: "#0F7A6E", // FN — dark teal
  7: "#6366F1", // GS — indigo
  8: "#8B5CF6", // HP — violet
}

function PusatData({
  deepLink,
  clearDeepLink,
  role,
}: {
  deepLink: DeepLink
  clearDeepLink: () => void
  role: Role
}) {
  const [search, setSearch] = useState("")
  const [semester, setSemester] = useState("Semester 5 (Ganjil)")
  const [kelasFilter, setKelasFilter] = useState<KelasName|"">(``)
  const [detail, setDetail] = useState<Student | null>(null)
  const [importing, setImporting] = useState(false)
  const [step, setStep] = useState(1)

  const [pendingTab, setPendingTab] = useState<MainTab | null>(null)
  // Deep-link: open student + tab when navigated from Beranda
  useEffect(() => {
    if (deepLink) {
      const target = STUDENTS.find((s) => s.id === deepLink.studentId) ?? null
      if (target) {
        setPendingTab(deepLink.tab)
        setDetail(target)
        clearDeepLink()
      }
    }
  }, [deepLink]) // eslint-disable-line

  const filtered = STUDENTS.filter((s) => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
    const matchKelas  = kelasFilter === "" || s.kelas === kelasFilter
    return matchSearch && matchKelas
  })

  if (detail)
    return (
      <DetailSiswa
        student={detail}
        initialTab={pendingTab ?? undefined}
        role={role}
        onBack={() => {
          setDetail(null)
          setPendingTab(null)
        }}
      />
    )
  if (importing)
    return (
      <ImportWizard
        step={step}
        setStep={setStep}
        onClose={() => {
          setImporting(false)
          setStep(1)
        }}
      />
    )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Toolbar row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "white",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(15,30,54,.05)",
          }}
        >
          <IcoSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama / NIS..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'Poppins',sans-serif",
              fontSize: 13,
              color: C.textMain,
              padding: "11px 0",
              background: "transparent",
            }}
          />
        </div>

        {role === 'wali' ? (<>
          {/* Unduh Template — ghost outline */}
          <button
            style={{
              display:"flex", alignItems:"center", gap:7,
              fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:600,
              color:"#475569", background:"white", border:`1px solid ${C.border}`,
              borderRadius:10, padding:"10px 18px", cursor:"pointer",
              boxShadow:"0 1px 4px rgba(15,30,54,.05)", whiteSpace:"nowrap",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh Template
          </button>
          {/* Impor Rekap Nilai — orange filled */}
          <button
            onClick={() => setImporting(true)}
            style={{
              display:"flex", alignItems:"center", gap:7,
              fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:700,
              color:"white", background:"linear-gradient(135deg,#FF8C00,#FFB700)",
              border:"none", borderRadius:10, padding:"10px 18px", cursor:"pointer",
              boxShadow:"0 3px 12px rgba(255,140,0,.32)", whiteSpace:"nowrap",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Impor Rekap Nilai
          </button>
        </>) : (<>
          {/* Total Siswa pill (BK only) */}
          <div style={{
            display:"flex", alignItems:"center", gap:7,
            fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:700,
            color:"#0965fa", background:"rgba(9,101,250,.08)", border:"1.5px solid rgba(9,101,250,.2)",
            borderRadius:10, padding:"10px 18px", whiteSpace:"nowrap",
          }}>
            👥 Total Siswa: {filtered.length}
          </div>
          {/* Filter Kelas dropdown (BK only) */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <select
              value={kelasFilter}
              onChange={e => setKelasFilter(e.target.value as KelasName|"")}
              style={{
                fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:600,
                color: kelasFilter ? C.textMain : C.textMuted,
                background:"white", border:`1px solid ${C.border}`,
                borderRadius:10, padding:"10px 36px 10px 14px",
                cursor:"pointer", appearance:"none", WebkitAppearance:"none",
                boxShadow:"0 1px 4px rgba(15,30,54,.05)", whiteSpace:"nowrap",
                outline:"none",
              }}>
              <option value="">Semua Kelas</option>
              {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </>)}
      </div>

      {/* ── Table card ── */}
      <div className="card" style={{ overflow: "hidden" }}>
        {/* Card title */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: C.textMain,
            }}
          >
            Daftar Siswa
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {[
                "Nama",
                "Profil",
                "Rekap Nilai",
                "Prestasi",
                "Prioritas Pendampingan",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "10px 20px",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const avatarColor = AVATAR_COLORS[s.id] ?? C.sky
              const initials = s.nama
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
              const isLengkap = s.profil === "lengkap"

              // Rekap status badge
              const rekapStatus =
                s.rekap === "—"
                  ? {
                      label: "Belum Diunggah",
                      clr: "#94A3B8",
                      bg: "rgba(148,163,184,.12)",
                    }
                  : s.status === "lengkap"
                    ? {
                        label: "Lengkap",
                        clr: "#00875A",
                        bg: "rgba(0,196,106,.1)",
                      }
                    : {
                        label: "Belum Lengkap",
                        clr: "#CC2E2E",
                        bg: "rgba(255,77,77,.1)",
                      }

              // Compute Prioritas Pendampingan
              const ab = ABSENSI[s.id]
              const bk = CATATAN_BK[s.id] ?? []
              const pctHadir = ab
                ? Math.round((ab.hadir / ab.total) * 100)
                : 100
              const topBKPri = bk.length ? bk[0].prioritas : "Rendah"
              let riskScore = 0
              if (s.avg < 75) riskScore += 2
              else if (s.avg < 82) riskScore += 1
              if (s.tren === "turun") riskScore += 2
              if (pctHadir < 80) riskScore += 2
              else if (pctHadir < 90) riskScore += 1
              if (topBKPri === "Tinggi") riskScore += 2
              else if (topBKPri === "Sedang") riskScore += 1
              if (s.status !== "lengkap") riskScore += 1

              const prioritas =
                riskScore >= 4
                  ? {
                      label: "Perlu Pendampingan",
                      clr: "#CC2E2E",
                      bg: "rgba(255,77,77,.1)",
                      dot: "#FF4D4D",
                    }
                  : riskScore >= 2
                    ? {
                        label: "Perlu Dipantau",
                        clr: "#B5780A",
                        bg: "rgba(255,183,0,.12)",
                        dot: "#FFB700",
                      }
                    : {
                        label: "Normal",
                        clr: "#00875A",
                        bg: "rgba(0,196,106,.1)",
                        dot: "#00C46A",
                      }

              return (
                <tr
                  key={s.id}
                  className="tr-hover"
                  style={{ borderTop: i > 0 ? `1px solid #F1F5F9` : "none" }}
                >
                  {/* Nama */}
                  <td style={{ padding: "13px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          flexShrink: 0,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.textMain,
                            lineHeight: 1.3,
                          }}
                        >
                          {s.nama}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 11,
                            color: C.textMuted,
                            marginTop: 1,
                          }}
                        >
                          NIS {s.nis}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Profil */}
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: isLengkap ? "#00875A" : "#CC2E2E",
                        background: isLengkap
                          ? "rgba(0,196,106,.1)"
                          : "rgba(255,77,77,.1)",
                        borderRadius: 20,
                        padding: "4px 11px",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: isLengkap ? "#00C46A" : "#FF4D4D",
                          display: "inline-block",
                        }}
                      />
                      {isLengkap ? "Lengkap" : "Belum Lengkap"}
                    </span>
                  </td>

                  {/* Rekap Nilai — semester + status badge */}
                  <td style={{ padding: "13px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: 12,
                          fontWeight: 500,
                          color: s.rekap === "—" ? C.textMuted : C.textMid,
                        }}
                      >
                        {s.rekap === "—" ? "—" : s.rekap}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: rekapStatus.clr,
                          background: rekapStatus.bg,
                          borderRadius: 20,
                          padding: "2px 9px",
                          alignSelf: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: rekapStatus.clr,
                            display: "inline-block",
                          }}
                        />
                        {rekapStatus.label}
                      </span>
                    </div>
                  </td>

                  {/* Prestasi */}
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: s.prestasi > 0 ? "#B5780A" : C.textMuted,
                      }}
                    >
                      🏆 {s.prestasi}
                    </span>
                  </td>

                  {/* Prioritas Pendampingan */}
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: prioritas.clr,
                        background: prioritas.bg,
                        borderRadius: 20,
                        padding: "4px 12px",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: prioritas.dot,
                          display: "inline-block",
                        }}
                      />
                      {prioritas.label}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td style={{ padding: "13px 20px" }}>
                    <button
                      onClick={() => setDetail(s)}
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        background: "linear-gradient(135deg,#00A3E0,#00B4D8)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 18px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,163,224,.3)",
                        transition: "opacity .18s, transform .18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = ".88"
                        e.currentTarget.style.transform = "scale(1.03)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div
          style={{
            padding: "11px 20px",
            borderTop: `1px solid ${C.border}`,
            fontFamily: "'Poppins',sans-serif",
            fontSize: 11,
            color: C.textMuted,
          }}
        >
          Menampilkan {filtered.length} dari {STUDENTS.length} siswa
        </div>
      </div>
    </div>
  )
}

// ─── DATA AKADEMIK SISWA ──────────────────────────────────────────────────────
const MAPEL_COLS = [
  { key: "mat", label: "Matematika" },
  { key: "bind", label: "B. Indonesia" },
  { key: "bing", label: "B. Inggris" },
  { key: "fis", label: "Fisika" },
  { key: "kim", label: "Kimia" },
  { key: "bio", label: "Biologi" },
  { key: "inf", label: "Informatika" },
  { key: "sej", label: "Sejarah" },
  { key: "eko", label: "Ekonomi" },
] as const

function scoreColor(n: number): string {
  if (n >= 90) return "#00A36B"
  if (n >= 80) return "#00A3E0"
  if (n >= 70) return "#B5780A"
  return "#CC2E2E"
}

function scoreAvg(scores: Record<string, number>): number {
  const vals = Object.values(scores)
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

function DataAkademik() {
  const [search, setSearch] = useState("")
  const [semester, setSemester] = useState("Semester 5 (Ganjil)")
  const [editing, setEditing] = useState<number | null>(null)
  const [importing, setImporting] = useState(false)
  const [impStep, setImpStep] = useState(1)

  const filtered = STUDENTS.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search),
  )

  if (importing)
    return (
      <ImportWizard
        step={impStep}
        setStep={setImpStep}
        onClose={() => {
          setImporting(false)
          setImpStep(1)
        }}
      />
    )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "white",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(15,30,54,.05)",
          }}
        >
          <IcoSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama / NIS..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'Poppins',sans-serif",
              fontSize: 13,
              color: "#0F1E36",
              padding: "11px 0",
              background: "transparent",
            }}
          />
        </div>

        {/* Unduh Template — ghost outline */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "'Poppins',sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#475569",
            background: "white",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(15,30,54,.05)",
            whiteSpace: "nowrap",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Unduh Template
        </button>

        {/* Impor Rekap Nilai — orange filled */}
        <button
          onClick={() => setImporting(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "'Poppins',sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(135deg,#FF8C00,#FFB700)",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(255,140,0,.32)",
            whiteSpace: "nowrap",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Impor Rekap Nilai
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="card" style={{ overflow: "auto" }}>
        {/* Card header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#0F1E36",
            }}
          >
            Rekap Nilai Keseluruhan Siswa
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 12,
                fontWeight: 500,
                background: "white",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "7px 32px 7px 12px",
                color: "#475569",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
              }}
            >
              <option>Semester 5 (Ganjil)</option>
              <option>Semester 4 (Genap)</option>
              <option>Semester 3 (Ganjil)</option>
            </select>
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#94A3B8",
                fontSize: 10,
              }}
            >
              ▼
            </span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: "#F8FAFC",
                }}
              >
                <th
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "10px 20px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Siswa
                </th>
                {MAPEL_COLS.map((m) => (
                  <th
                    key={m.key}
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      padding: "10px 12px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.label}
                  </th>
                ))}
                <th
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#00A3E0",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "10px 12px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rata-rata
                </th>
                <th
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    padding: "10px 16px",
                    textAlign: "center",
                  }}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const scores = REKAP_NILAI[s.id]
                const avg = scores
                  ? scoreAvg(scores as unknown as Record<string, number>)
                  : 0
                const avatarColor = AVATAR_COLORS[s.id] ?? C.sky
                const initials = s.nama
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                const isEditRow = editing === s.id
                return (
                  <tr
                    key={s.id}
                    className="tr-hover"
                    style={{ borderTop: i > 0 ? `1px solid #F1F5F9` : "none" }}
                  >
                    {/* Student cell */}
                    <td style={{ padding: "12px 20px", minWidth: 180 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: avatarColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: "'Poppins',sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0F1E36",
                              lineHeight: 1.3,
                            }}
                          >
                            {s.nama}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Poppins',sans-serif",
                              fontSize: 11,
                              color: "#94A3B8",
                              marginTop: 1,
                            }}
                          >
                            NIS {s.nis}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Score cells */}
                    {scores ? (
                      MAPEL_COLS.map((m) => {
                        const val = (scores as Record<string, number>)[m.key]
                        return (
                          <td
                            key={m.key}
                            style={{
                              padding: "12px 12px",
                              textAlign: "center",
                            }}
                          >
                            {isEditRow ? (
                              <input
                                type="number"
                                defaultValue={val}
                                style={{
                                  width: 52,
                                  textAlign: "center",
                                  fontFamily: "'Poppins',sans-serif",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: scoreColor(val),
                                  border: `1px solid ${C.border}`,
                                  borderRadius: 6,
                                  padding: "3px 4px",
                                  outline: "none",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  fontFamily: "'Poppins',sans-serif",
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: scoreColor(val),
                                }}
                              >
                                {val}
                              </span>
                            )}
                          </td>
                        )
                      })
                    ) : (
                      <td
                        colSpan={9}
                        style={{
                          textAlign: "center",
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: 12,
                          color: "#94A3B8",
                          padding: "12px",
                        }}
                      >
                        —
                      </td>
                    )}
                    {/* Rata-rata */}
                    <td style={{ padding: "12px 12px", textAlign: "center" }}>
                      <span
                        style={{
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: 14,
                          fontWeight: 800,
                          color: scoreColor(avg),
                        }}
                      >
                        {avg}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {isEditRow ? (
                        <button
                          onClick={() => setEditing(null)}
                          style={{
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "white",
                            background:
                              "linear-gradient(135deg,#00C46A,#00A36B)",
                            border: "none",
                            borderRadius: 7,
                            padding: "6px 14px",
                            cursor: "pointer",
                          }}
                        >
                          Simpan
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditing(s.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.textMid,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: 6,
                            transition: "background .15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#F1F5F9"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent"
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "11px 20px",
            borderTop: `1px solid ${C.border}`,
            fontFamily: "'Poppins',sans-serif",
            fontSize: 11,
            color: "#94A3B8",
          }}
        >
          Menampilkan {filtered.length} dari {STUDENTS.length} siswa
        </div>
      </div>
    </div>
  )
}

// ─── IMPORT WIZARD ────────────────────────────────────────────────────────────
function ImportWizard({
  step,
  setStep,
  onClose,
}: {
  step: number
  setStep: (s: number) => void
  onClose: () => void
}) {
  const [semVal, setSemVal] = useState("5 (Ganjil)")
  const [tahun, setTahun] = useState("2026/2027")

  const STEPS = ["Pilih Semester", "Unggah File", "Pratinjau Data", "Selesai"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onClose}
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: C.textMid,
            background: "white",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            boxShadow: "0 1px 4px rgba(15,30,54,.06)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          ← Kembali
        </button>
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: C.textMain,
          }}
        >
          Impor Rekap Nilai
        </div>
      </div>

      {/* ── Step stepper (Figma style) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          background: "white",
          borderRadius: 12,
          padding: "18px 24px",
          boxShadow: "0 1px 6px rgba(15,30,54,.06)",
          border: `1px solid ${C.border}`,
        }}
      >
        {STEPS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          const isLast = i === STEPS.length - 1
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                flex: isLast ? "none" : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 80,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: done
                      ? "#E8F5EF"
                      : active
                        ? "#0965fa"
                        : "#F1F5F9",
                    border: done
                      ? "2px solid #00A36B"
                      : active
                        ? "none"
                        : "2px solid #CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: done ? "#00A36B" : active ? "white" : "#94A3B8",
                    transition: "all .25s",
                    boxShadow: active
                      ? "0 4px 14px rgba(9,101,250,.35)"
                      : "none",
                  }}
                >
                  {done ? "✓" : n}
                </div>
                <span
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#0965fa" : done ? "#00A36B" : "#94A3B8",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? "#00A36B" : "#E2E8F0",
                    marginBottom: 20,
                    borderRadius: 2,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step content card ── */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(15,30,54,.06)",
          padding: "40px 32px",
        }}
      >
        {/* Step 1 — Pilih Semester */}
        {step === 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.textMain,
                  marginBottom: 6,
                }}
              >
                Pilih Semester & Tahun Ajaran
              </div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  color: C.orange,
                  fontWeight: 500,
                }}
              >
                Sesuaikan semester dan tahun ajaran kelas
              </div>
            </div>
            <div
              style={{
                width: "100%",
                maxWidth: 440,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.textMain,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Semester
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={semVal}
                    onChange={(e) => setSemVal(e.target.value)}
                    style={{
                      width: "100%",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 14,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "12px 40px 12px 16px",
                      color: C.textMain,
                      outline: "none",
                      background: "white",
                      cursor: "pointer",
                      appearance: "none",
                      boxShadow: "0 1px 4px rgba(15,30,54,.06)",
                    }}
                  >
                    <option>5 (Ganjil)</option>
                    <option>6 (Genap)</option>
                    <option>4 (Genap)</option>
                    <option>3 (Ganjil)</option>
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: C.textMuted,
                      fontSize: 12,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.textMain,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Tahun Ajaran
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    style={{
                      width: "100%",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 14,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "12px 40px 12px 16px",
                      color: C.textMain,
                      outline: "none",
                      background: "white",
                      cursor: "pointer",
                      appearance: "none",
                      boxShadow: "0 1px 4px rgba(15,30,54,.06)",
                    }}
                  >
                    <option>2026/2027</option>
                    <option>2025/2026</option>
                    <option>2024/2025</option>
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: C.textMuted,
                      fontSize: 12,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <button
                  onClick={() => setStep(2)}
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    background: "linear-gradient(135deg,#FF8C00,#FFB700)",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 40px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(255,140,0,.35)",
                    transition: "opacity .18s, transform .18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = ".9"
                    e.currentTarget.style.transform = "scale(1.02)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  Lanjut →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Unggah File */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.textMain,
                  marginBottom: 6,
                }}
              >
                Unggah File Rekap Nilai
              </div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  color: C.orange,
                  fontWeight: 500,
                }}
              >
                Format: Template resmi e-Rapor (.xlsx)
              </div>
            </div>
            <div
              style={{
                border: `2px dashed #CBD5E1`,
                borderRadius: 14,
                padding: "56px 24px",
                textAlign: "center",
                background: "#F8FAFC",
                cursor: "pointer",
                transition: "border-color .18s, background .18s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  "#0965fa"
                ;(e.currentTarget as HTMLDivElement).style.background =
                  "rgba(9,101,250,.03)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  "#CBD5E1"
                ;(e.currentTarget as HTMLDivElement).style.background =
                  "#F8FAFC"
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 14 }}>📂</div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.textMain,
                  marginBottom: 6,
                }}
              >
                Drag & Drop file di sini
              </div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  color: C.textMuted,
                  marginBottom: 20,
                }}
              >
                atau klik untuk memilih file
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(9,101,250,.07)",
                  border: "1px solid rgba(9,101,250,.18)",
                  borderRadius: 10,
                  padding: "9px 20px",
                }}
              >
                <span style={{ fontSize: 16 }}>📄</span>
                <span
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 13,
                    color: "#0965fa",
                    fontWeight: 600,
                  }}
                >
                  Semester{semVal.split(" ")[0]}_XIIPA2.xlsx
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textMid,
                  background: "white",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 20px",
                  cursor: "pointer",
                }}
              >
                ← Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg,#FF8C00,#FFB700)",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 36px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255,140,0,.3)",
                }}
              >
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Pratinjau Data */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: C.textMain,
                  marginBottom: 6,
                }}
              >
                Pratinjau Data
              </div>
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  color: C.orange,
                  fontWeight: 500,
                }}
              >
                AI membaca dan menguraikan file rekap nilai…
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                ["36", "Siswa Terdeteksi"],
                ["9", "Mata Pelajaran"],
                ["Sem " + semVal.split(" ")[0], "Periode"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(9,101,250,.05)",
                    border: "1px solid rgba(9,101,250,.12)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: C.textMain,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 12,
                      color: C.textMuted,
                      marginTop: 3,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 12,
                }}
              >
                <thead style={{ background: "#F8FAFC" }}>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                      "Nama",
                      "Matematika",
                      "B. Indonesia",
                      "B. Inggris",
                      "Fisika",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          color: C.textMuted,
                          fontWeight: 700,
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Andi Maulana", 90, 88, 78, 92],
                    ["Bela Saputri", 85, 90, 82, 80],
                    ["Candra Wijaya", 72, 75, 68, 74],
                  ].map(([n, ...vs]) => (
                    <tr
                      key={String(n)}
                      className="tr-hover"
                      style={{ borderTop: `1px solid #F1F5F9` }}
                    >
                      <td
                        style={{
                          padding: "10px 14px",
                          color: C.textMain,
                          fontWeight: 500,
                        }}
                      >
                        {n}
                      </td>
                      {(vs as number[]).map((v, i) => (
                        <td
                          key={i}
                          style={{
                            padding: "10px 14px",
                            color: scoreColor(v),
                            fontWeight: 700,
                          }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ borderTop: `1px solid #F1F5F9` }}>
                    <td
                      colSpan={5}
                      style={{
                        padding: "10px 14px",
                        color: C.textMuted,
                        fontStyle: "italic",
                        fontSize: 11,
                      }}
                    >
                      + 33 siswa lainnya…
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setStep(2)}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textMid,
                  background: "white",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 20px",
                  cursor: "pointer",
                }}
              >
                ← Kembali
              </button>
              <button
                onClick={() => setStep(4)}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 36px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(9,101,250,.3)",
                }}
              >
                Simpan Data →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Selesai */}
        {step === 4 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(0,196,106,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                marginBottom: 20,
              }}
            >
              🎉
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: C.textMain,
                marginBottom: 8,
              }}
            >
              Import Berhasil!
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 14,
                color: C.textMid,
                marginBottom: 28,
              }}
            >
              Data rekap nilai Semester {semVal} berhasil diimpor ke sistem
              Orbita.
            </div>
            <div
              style={{
                display: "flex",
                gap: 28,
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              {[
                ["36", "Siswa"],
                ["324", "Nilai diimpor"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    background: "rgba(0,163,224,.07)",
                    borderRadius: 12,
                    padding: "16px 28px",
                    border: "1px solid rgba(0,163,224,.15)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 32,
                      fontWeight: 800,
                      color: C.sky,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 12,
                      color: C.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(9,101,250,.3)",
                }}
              >
                Lihat Data Akademik
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── DETAIL SISWA ─────────────────────────────────────────────────────────────
function nilaiKet(n: number): { label: string color: string } {
  if (n >= 90) return { label: "Sangat Baik", color: "#00A36B" }
  if (n >= 80) return { label: "Baik", color: C.sky }
  if (n >= 70) return { label: "Cukup", color: "#B5780A" }
  return { label: "Kurang", color: C.red }
}

type MainTab = "profil" | "akademik" | "prestasi" | "bk"

function DetailSiswa({
  student,
  onBack,
  initialTab,
  role,
}: {
  student: Student
  onBack: () => void
  initialTab?: MainTab
  role?: Role
}) {
  const [mainTab, setMainTab] = useState<MainTab>(initialTab ?? "profil")
  const [semTab, setSemTab] = useState(5)
  const [tryoutTab, setTryoutTab] = useState<'TKA'|'SNBT'|'SKD'>('SNBT')
  const [rekTab, setRekTab] = useState<'ptn'|'kedinasan'>('ptn')
  const [showBKModal, setShowBKModal] = useState(false)
  const [bkForm, setBkForm] = useState({ topik:'', catatan:'', rekomendasi:'', tindakLanjut:'', prioritas:'Rendah', konselor:'', tanggalInput: new Date().toISOString().slice(0,10) })
  const [localBKNotes, setLocalBKNotes] = useState<{tanggal:string;topik:string;konselor:string;catatan:string;rekomendasi:string;tindakLanjut:string;prioritas:string}[]>([])
  const avatarColor = AVATAR_COLORS[student.id] ?? C.sky
  const initials = student.nama
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
  const scores = REKAP_NILAI[student.id]
  const ext = SISWA_EXTENDED[student.id]
  const keluarga = PROFIL_KELUARGA[student.id]
  const belajar = PROFIL_BELAJAR[student.id]
  const minat = PROFIL_MINAT[student.id]
  const absensi = ABSENSI[student.id]
  const catatanBK = CATATAN_BK[student.id] ?? []
  const allBKNotes = [...localBKNotes, ...catatanBK]

  const tabMapel = MAPEL_COLS

  const scoreForTab = (key: string, t: number): number => {
    if (!scores) return 0
    const base = (scores as Record<string, number>)[key]
    const delta = [-6, -4, -2, -1, 0, 2]
    return Math.max(60, Math.min(100, base + (delta[t - 1] ?? 0)))
  }
  const avgForTab = (t: number): number => {
    if (!scores) return 0
    const vals = tabMapel.map((m) => scoreForTab(m.key, t))
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
  }

  const pctHadir = absensi
    ? Math.round((absensi.hadir / absensi.total) * 100)
    : 0
  const abColor = pctHadir >= 90 ? C.green : pctHadir >= 75 ? C.orange : C.red
  const priColor = (p: string) =>
    p === "Tinggi" ? C.red : p === "Sedang" ? C.orange : C.green
  const topPri = allBKNotes.length ? allBKNotes[0].prioritas : "Rendah"

  const chartData = [1, 2, 3, 4, 5, 6].map((s) => ({
    sem: `Sem ${s}`,
    avg: avgForTab(s),
  }))

  const F = { fontFamily: "'Poppins',sans-serif" } as const
  const Label = ({ children }: { children: string }) => (
    <div
      style={{
        ...F,
        fontSize: 10,
        fontWeight: 700,
        color: C.textMuted,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  )
  const Field = ({ label, value }: { label: string value?: string | null }) => (
    <div>
      <Label>{label}</Label>
      <div style={{ ...F, fontSize: 13, color: C.textMain, fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  )

  const TABS: { id: MainTab label: string }[] = [
    { id: "profil", label: "👤 Profil Siswa" },
    { id: "akademik", label: "📊 Akademik" },
    { id: "prestasi", label: "🏆 Prestasi" },
    { id: "bk", label: "💬 Bimbingan BK" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Back row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BtnGhost label="← Kembali" onClick={onBack} />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            ...F,
            fontSize: 12,
            fontWeight: 600,
            color: student.status === "lengkap" ? "#00875A" : "#CC2E2E",
            background:
              student.status === "lengkap"
                ? "rgba(0,196,106,.1)"
                : "rgba(255,77,77,.1)",
            borderRadius: 20,
            padding: "4px 12px",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: student.status === "lengkap" ? "#00C46A" : "#FF4D4D",
              display: "inline-block",
            }}
          />
          {student.status === "lengkap" ? "Lengkap" : "Belum Lengkap"}
        </span>
      </div>

      {/* ── Hero card ── */}
      <div
        style={{
          borderRadius: 20,
          background: "linear-gradient(135deg,#0F1E36,#1E3A5F)",
          padding: "26px 30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[180, 300, 440].map((r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              right: -r / 2 + 80,
              top: "50%",
              transform: "translateY(-50%)",
              width: r,
              height: r,
              borderRadius: "50%",
              border: "1px solid rgba(0,163,224,.07)",
              pointerEvents: "none",
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...F,
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              border: "3px solid rgba(255,255,255,.15)",
            }}
          >
            {initials}
          </div>
          {/* Identity */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                ...F,
                fontWeight: 800,
                fontSize: 22,
                color: "white",
                lineHeight: 1.15,
              }}
            >
              {student.nama}
            </div>
            <div
              style={{
                ...F,
                fontSize: 12,
                color: "rgba(255,255,255,.5)",
                marginTop: 3,
              }}
            >
              NIS {student.nis} · NISN{" "}
              {"0067" + student.id.toString().padStart(6, "0")}
            </div>
            <div
              style={{
                display: "flex",
                gap: 7,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  ...F,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.sky,
                  background: "rgba(0,163,224,.2)",
                  borderRadius: 20,
                  padding: "3px 11px",
                }}
              >
                XI IPA 2
              </span>
              <span
                style={{
                  ...F,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,.7)",
                  background: "rgba(255,255,255,.1)",
                  borderRadius: 20,
                  padding: "3px 11px",
                }}
              >
                Sem 6 · 2025/2026
              </span>
              <span
                style={{
                  ...F,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,.7)",
                  background: "rgba(255,255,255,.08)",
                  borderRadius: 20,
                  padding: "3px 11px",
                }}
              >
                {student.jk === "L" ? "Laki-laki" : "Perempuan"}
              </span>
            </div>
          </div>
          {/* Quick stats */}
          <div
            style={{
              display: "flex",
              gap: 0,
              flexShrink: 0,
              background: "rgba(255,255,255,.05)",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            {[
              {
                label: "Rata-rata Nilai",
                value: String(student.avg),
                color: "white",
              },
              {
                label: "Nilai TO Terakhir",
                value: String(ext?.nilaiTOTerakhir ?? "—"),
                color: "#FFB700",
              },
              { label: "Kehadiran", value: `${pctHadir}%`, color: abColor },
              {
                label: "Prestasi",
                value: String(student.prestasi),
                color: C.cyan,
              },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "16px 22px",
                  textAlign: "center",
                  borderLeft:
                    i > 0 ? "1px solid rgba(255,255,255,.08)" : "none",
                }}
              >
                <div
                  style={{
                    ...F,
                    fontSize: 28,
                    fontWeight: 800,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    ...F,
                    fontSize: 10,
                    color: "rgba(255,255,255,.4)",
                    marginTop: 5,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "white",
          borderRadius: 14,
          padding: 5,
          boxShadow: "0 2px 12px rgba(15,30,54,.06)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setMainTab(t.id)}
            style={{
              flex: 1,
              ...F,
              fontSize: 13,
              fontWeight: mainTab === t.id ? 700 : 500,
              border: "none",
              borderRadius: 10,
              padding: "10px 8px",
              cursor: "pointer",
              transition: "all .18s",
              background:
                mainTab === t.id
                  ? "linear-gradient(135deg,#0965fa,#00b2dd)"
                  : "transparent",
              color: mainTab === t.id ? "white" : C.textMid,
              boxShadow:
                mainTab === t.id ? "0 3px 12px rgba(9,101,250,.28)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════ TAB 1 — PROFIL SISWA ══ */}
      {mainTab === "profil" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Data Diri */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <SectionHead title="Data Diri" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
              }}
            >
              <Field label="Nama Lengkap" value={student.nama} />
              <Field label="NIS" value={student.nis} />
              <Field
                label="NISN"
                value={"0067" + student.id.toString().padStart(6, "0")}
              />
              <Field
                label="Jenis Kelamin"
                value={student.jk === "L" ? "Laki-laki" : "Perempuan"}
              />
              <Field label="Agama" value={ext?.agama} />
              <Field label="Kelas" value="XI IPA 2" />
              <Field label="Jurusan" value={ext?.jurusan} />
              <div>
                <Label>Status Siswa</Label>
                <span
                  style={{
                    ...F,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.green,
                    background: "rgba(0,196,106,.1)",
                    borderRadius: 20,
                    padding: "4px 12px",
                  }}
                >
                  ● {ext?.statusSiswa ?? "Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* 2-col row: Informasi Kelahiran + Informasi Kontak */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div className="card" style={{ padding: "22px 24px" }}>
              <SectionHead title="Informasi Kelahiran" />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <Field label="Tempat Lahir" value={ext?.tempatLahir} />
                <Field label="Tanggal Lahir" value={ext?.tanggalLahir} />
                <Field label="Kewarganegaraan" value={ext?.kewarganegaraan} />
              </div>
            </div>
            <div className="card" style={{ padding: "22px 24px" }}>
              <SectionHead title="Informasi Kontak" />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <Field label="Nomor HP" value={ext?.hp} />
                <Field label="Email" value={ext?.email} />
                <Field
                  label="Nomor Kontak Darurat"
                  value={ext?.kontakDarurat}
                />
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <SectionHead title="Alamat" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
              }}
            >
              <div style={{ gridColumn: "1/-1" }}>
                <Field label="Alamat Lengkap" value={ext?.alamat} />
              </div>
              <Field label="Provinsi" value={ext?.provinsi} />
              <Field label="Kabupaten/Kota" value={ext?.kota} />
              <Field label="Kecamatan" value={ext?.kecamatan} />
              <Field label="Kelurahan/Desa" value={ext?.kelurahan} />
              <Field label="Kode Pos" value={ext?.kodePos} />
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <SectionHead title="Data Orang Tua / Wali" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${ext?.wali ? 3 : 2},1fr)`,
                gap: 20,
              }}
            >
              {[
                { role: "Ayah 👨", data: ext?.ayah },
                { role: "Ibu 👩", data: ext?.ibu },
                ...(ext?.wali ? [{ role: "Wali 🏠", data: ext.wali }] : []),
              ].map((p) => (
                <div
                  key={p.role}
                  style={{
                    background: C.ice,
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      ...F,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.sky,
                      marginBottom: 14,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {p.role}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <Field
                      label="Nama"
                      value={(p.data as { nama: string })?.nama}
                    />
                    {"pendidikan" in (p.data || {}) && (
                      <Field
                        label="Pendidikan"
                        value={(p.data as { pendidikan?: string })?.pendidikan}
                      />
                    )}
                    {"hubungan" in (p.data || {}) && (
                      <Field
                        label="Hubungan"
                        value={(p.data as { hubungan?: string })?.hubungan}
                      />
                    )}
                    <Field
                      label="Pekerjaan"
                      value={(p.data as { pekerjaan?: string })?.pekerjaan}
                    />
                    <Field
                      label="Nomor HP"
                      value={(p.data as { hp?: string })?.hp}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kondisi Keluarga */}
          {keluarga && (
            <div className="card" style={{ padding: "22px 24px" }}>
              <SectionHead title="Kondisi Keluarga" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <Label>Status Orang Tua</Label>
                    <span
                      style={{
                        ...F,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.textMain,
                        background: C.ice,
                        borderRadius: 20,
                        padding: "4px 14px",
                      }}
                    >
                      {ext?.statusOrtu ?? "—"}
                    </span>
                  </div>
                  <div>
                    <Label>Tinggal Bersama</Label>
                    <span
                      style={{
                        ...F,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.sky,
                        background: "rgba(0,163,224,.1)",
                        borderRadius: 20,
                        padding: "4px 14px",
                      }}
                    >
                      {keluarga.tinggalDengan}
                    </span>
                  </div>
                  <div>
                    <Label>Kondisi Ekonomi</Label>
                    {(() => {
                      const ec =
                        keluarga.kondisiEkonomi === "Atas"
                          ? C.green
                          : keluarga.kondisiEkonomi === "Menengah Atas"
                            ? C.sky
                            : keluarga.kondisiEkonomi === "Menengah"
                              ? C.orange
                              : C.red
                      return (
                        <span
                          style={{
                            ...F,
                            fontSize: 12,
                            fontWeight: 700,
                            color: ec,
                            background: `${ec}18`,
                            borderRadius: 20,
                            padding: "4px 14px",
                          }}
                        >
                          ● {keluarga.kondisiEkonomi}
                        </span>
                      )
                    })()}
                  </div>
                  <div>
                    <Label>Estimasi Penghasilan Keluarga</Label>
                    <div
                      style={{
                        ...F,
                        fontSize: 13,
                        color: C.textMain,
                        fontWeight: 500,
                      }}
                    >
                      {keluarga.penghasilan}
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <Label>Bantuan Pendidikan</Label>
                    {ext && ext.bantuanPendidikan.length > 0 ? (
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
                      >
                        {ext.bantuanPendidikan.map((b) => (
                          <span
                            key={b}
                            style={{
                              ...F,
                              fontSize: 12,
                              fontWeight: 600,
                              color: C.orange,
                              background: "rgba(255,140,0,.1)",
                              borderRadius: 20,
                              padding: "4px 12px",
                            }}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          ...F,
                          fontSize: 12,
                          color: C.textMuted,
                          fontStyle: "italic",
                        }}
                      >
                        Tidak menerima bantuan pendidikan
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <Label>Anak ke-</Label>
                      <div
                        style={{
                          ...F,
                          fontSize: 20,
                          fontWeight: 700,
                          color: C.textMain,
                        }}
                      >
                        {ext?.anakKe ?? "—"}
                      </div>
                    </div>
                    <div>
                      <Label>Jumlah Saudara Kandung</Label>
                      <div
                        style={{
                          ...F,
                          fontSize: 20,
                          fontWeight: 700,
                          color: C.textMain,
                        }}
                      >
                        {ext
                          ? ext.jumlahSaudaraKandung
                          : keluarga.jumlahSaudara}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gaya Belajar & Kondisi Khusus */}
          {belajar && (
            <div className="card" style={{ padding: "22px 24px" }}>
              <SectionHead title="Gaya Belajar & Kondisi Khusus" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <Label>Gaya Belajar</Label>
                    <span
                      style={{
                        ...F,
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.sky,
                        background: "rgba(0,163,224,.1)",
                        borderRadius: 20,
                        padding: "6px 16px",
                      }}
                    >
                      🧠 {belajar.gayaBelajar}
                    </span>
                  </div>
                  <div>
                    <Label>Kondisi Khusus</Label>
                    {belajar.kebutuhanKhusus ? (
                      <span
                        style={{
                          ...F,
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.orange,
                          background: "rgba(255,140,0,.1)",
                          borderRadius: 20,
                          padding: "5px 14px",
                        }}
                      >
                        ⚠ {belajar.kebutuhanKhusus}
                      </span>
                    ) : (
                      <span
                        style={{
                          ...F,
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.green,
                          background: "rgba(0,196,106,.1)",
                          borderRadius: 20,
                          padding: "5px 14px",
                        }}
                      >
                        ✓ Tidak ada kondisi khusus
                      </span>
                    )}
                  </div>
                  <Field
                    label="Riwayat Penyakit"
                    value={ext?.riwayatPenyakit}
                  />
                  <div>
                    <Label>Catatan Tambahan</Label>
                    <div
                      style={{
                        background: C.ice,
                        borderRadius: 10,
                        padding: "10px 14px",
                        ...F,
                        fontSize: 12,
                        color: C.textMid,
                        lineHeight: 1.65,
                      }}
                    >
                      {belajar.catatan}
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <Label>Kekuatan Belajar</Label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                        marginTop: 2,
                      }}
                    >
                      {belajar.kekuatan.map((k) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            ...F,
                            fontSize: 12,
                            color: C.textMain,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: C.green,
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          {k}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Tantangan Belajar</Label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                        marginTop: 2,
                      }}
                    >
                      {belajar.tantangan.map((t) => (
                        <div
                          key={t}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            ...F,
                            fontSize: 12,
                            color: C.textMain,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: C.orange,
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════ TAB 2 — AKADEMIK ══ */}
      {mainTab === "akademik" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* AI Ringkasan */}
          <div
            style={{
              background:
                "linear-gradient(135deg,rgba(9,101,250,.06),rgba(0,178,221,.04))",
              border: "1px solid rgba(9,101,250,.15)",
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                ...F,
                fontSize: 14,
                fontWeight: 700,
                color: C.textMain,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🤖 Orbita AI
            </div>
            <p
              style={{
                ...F,
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.75,
                margin: "0 0 14px",
              }}
            >
              Siswa menunjukkan perkembangan akademik yang{" "}
              <strong style={{ color: C.textMain }}>konsisten</strong> dengan
              rata-rata nilai{" "}
              <strong style={{ color: C.sky }}>{student.avg}</strong> dan tren{" "}
              <strong
                style={{
                  color:
                    student.tren === "naik"
                      ? C.green
                      : student.tren === "turun"
                        ? C.red
                        : C.sky,
                }}
              >
                {student.tren}
              </strong>
              . Nilai tryout terakhir mencapai{" "}
              <strong style={{ color: C.textMain }}>
                {ext?.nilaiTOTerakhir}
              </strong>
              . Kehadiran siswa{" "}
              {pctHadir >= 90 ? "sangat baik" : "perlu perhatian"} di angka{" "}
              <strong style={{ color: abColor }}>{pctHadir}%</strong>.
              Berdasarkan minat, bakat, dan performa akademik, siswa
              direkomendasikan untuk mempersiapkan diri menuju{" "}
              {minat?.targetPTN ?? "PTN pilihan"}.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  l: "Kekuatan",
                  items: [
                    "✔ " + (belajar?.kekuatan[0] ?? "Konsistensi belajar"),
                    "✔ " + (belajar?.kekuatan[1] ?? "Daya analitik"),
                  ],
                  c: C.green,
                  bg: "rgba(0,196,106,.06)",
                  br: "rgba(0,196,106,.2)",
                },
                {
                  l: "Perlu Perhatian",
                  items: [
                    "⚠ " + (belajar?.tantangan[0] ?? "Manajemen waktu"),
                    "⚠ " +
                      (belajar?.tantangan[1] ?? "Konsistensi latihan soal"),
                  ],
                  c: C.orange,
                  bg: "rgba(255,140,0,.06)",
                  br: "rgba(255,140,0,.2)",
                },
                {
                  l: "Rekomendasi",
                  items: [
                    "Konsultasikan strategi belajar dengan guru BK secara berkala.",
                  ],
                  c: C.sky,
                  bg: "rgba(0,163,224,.06)",
                  br: "rgba(0,163,224,.2)",
                },
              ].map((g) => (
                <div
                  key={g.l}
                  style={{
                    background: g.bg,
                    border: `1px solid ${g.br}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      ...F,
                      fontSize: 10,
                      fontWeight: 700,
                      color: g.c,
                      marginBottom: 8,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {g.l}
                  </div>
                  {g.items.map((it) => (
                    <div
                      key={it}
                      style={{
                        ...F,
                        fontSize: 12,
                        color: C.textMid,
                        marginBottom: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {it}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Nilai Rapor */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    ...F,
                    fontWeight: 700,
                    fontSize: 15,
                    color: C.textMain,
                  }}
                >
                  Nilai Rapor
                </div>
                <div
                  className="font-pecita"
                  style={{ fontSize: 13, color: C.orange, marginTop: 2 }}
                >
                  Rekap nilai per mata pelajaran
                </div>
              </div>
              <BtnGhost label="⬇ Unduh PDF Rapor" />
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <button
                  key={s}
                  onClick={() => setSemTab(s)}
                  style={{
                    flex: 1,
                    ...F,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 4px",
                    cursor: "pointer",
                    background:
                      semTab === s
                        ? "linear-gradient(135deg,#0965fa,#00b2dd)"
                        : "#F1F5F9",
                    color: semTab === s ? "white" : C.textMid,
                    transition: "all .18s",
                    boxShadow:
                      semTab === s ? "0 3px 10px rgba(9,101,250,.25)" : "none",
                  }}
                >
                  Sem {s}
                </button>
              ))}
              <button
                onClick={() => setSemTab(0)}
                style={{
                  ...F,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  background:
                    semTab === 0
                      ? "linear-gradient(135deg,#0965fa,#00b2dd)"
                      : "#F1F5F9",
                  color: semTab === 0 ? "white" : C.textMid,
                  transition: "all .18s",
                  boxShadow:
                    semTab === 0 ? "0 3px 10px rgba(9,101,250,.25)" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                Semua
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th
                    style={{
                      ...F,
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.07em",
                      padding: "8px 12px",
                      textAlign: "left",
                    }}
                  >
                    Mata Pelajaran
                  </th>
                  {semTab === 0 ? (
                    [1, 2, 3, 4, 5, 6].map((s) => (
                      <th
                        key={s}
                        style={{
                          ...F,
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.textMuted,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          padding: "8px 12px",
                          textAlign: "center",
                        }}
                      >
                        Sem {s}
                      </th>
                    ))
                  ) : (
                    <>
                      <th
                        style={{
                          ...F,
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.textMuted,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          padding: "8px 12px",
                          textAlign: "center",
                        }}
                      >
                        Nilai
                      </th>
                      <th
                        style={{
                          ...F,
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.textMuted,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          padding: "8px 12px",
                          textAlign: "left",
                        }}
                      >
                        Keterangan
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tabMapel.map((m, i) => (
                  <tr
                    key={m.key}
                    className="tr-hover"
                    style={{ borderTop: i > 0 ? `1px solid #F8FAFC` : "none" }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        ...F,
                        fontSize: 13,
                        color: C.textMain,
                        fontWeight: 500,
                      }}
                    >
                      {m.label}
                    </td>
                    {semTab === 0
                      ? [1, 2, 3, 4, 5, 6].map((s) => {
                          const v = scoreForTab(m.key, s)
                          const { color } = nilaiKet(v)
                          return (
                            <td
                              key={s}
                              style={{
                                padding: "10px 12px",
                                textAlign: "center",
                                ...F,
                                fontSize: 13,
                                fontWeight: 700,
                                color,
                              }}
                            >
                              {v}
                            </td>
                          )
                        })
                      : (() => {
                          const v = scoreForTab(m.key, semTab)
                          const { label, color } = nilaiKet(v)
                          return (
                            <>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  textAlign: "center",
                                  ...F,
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color,
                                }}
                              >
                                {v}
                              </td>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  ...F,
                                  fontSize: 12,
                                  color,
                                }}
                              >
                                {label}
                              </td>
                            </>
                          )
                        })()}
                  </tr>
                ))}
                <tr
                  style={{
                    borderTop: `2px solid ${C.border}`,
                    background: C.ice,
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      ...F,
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.textMain,
                    }}
                  >
                    Rata-rata Sem {semTab === 0 ? "1–6" : semTab}
                  </td>
                  {semTab === 0
                    ? [1, 2, 3, 4, 5, 6].map((s) => {
                        const a = avgForTab(s)
                        const { color } = nilaiKet(a)
                        return (
                          <td
                            key={s}
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              ...F,
                              fontSize: 13,
                              fontWeight: 800,
                              color,
                            }}
                          >
                            {a}
                          </td>
                        )
                      })
                    : (() => {
                        const a = avgForTab(semTab)
                        const { label, color } = nilaiKet(a)
                        return (
                          <>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "center",
                                ...F,
                                fontSize: 14,
                                fontWeight: 800,
                                color,
                              }}
                            >
                              {a}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                ...F,
                                fontSize: 12,
                                color,
                              }}
                            >
                              {label}
                            </td>
                          </>
                        )
                      })()}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grafik Perkembangan Nilai */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <SectionHead
              title="Grafik Perkembangan Nilai"
              sub="Rata-rata nilai rapor Semester 1 hingga Semester 6"
            />
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="sem"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: C.textMuted,
                      fontFamily: "Poppins",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: C.textMuted,
                      fontFamily: "Poppins",
                    }}
                    domain={["dataMin - 5", "dataMax + 3"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: C.navy,
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                      fontSize: 12,
                      fontFamily: "Poppins",
                    }}
                    formatter={(v) => [
                      typeof v === "number" ? v.toFixed(1) : v,
                      "Rata-rata",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke={C.sky}
                    strokeWidth={2.5}
                    dot={{ fill: C.sky, r: 5, strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Ringkasan Tryout ── */}
          {(() => {
            type TOTab = 'TKA' | 'SNBT' | 'SKD'

            const TO_DATA: Record<TOTab, {
              history: number[]
              labels:  string[]
              scoreLabel: string
              ranking: string
              tren: string
              trenClr: string
              subtests: { name: string; score: number; max: number; status: string; color: string; bg: string }[]
              aiInsight: React.ReactNode
            }> = {
              SNBT: {
                history:    [620, 638, 655, 670, 682, 688],
                labels:     ['TO1','TO2','TO3','TO4','TO5','TO6'],
                scoreLabel: 'TO 6',
                ranking:    '18 / 145',
                tren:       '📈 Meningkat',
                trenClr:    '#00A36B',
                subtests: [
                  { name:'Penalaran Umum',            score:92, max:100, status:'Sangat Baik',       color:'#00A36B', bg:'rgba(0,196,106,.07)'  },
                  { name:'Pengetahuan Kuantitatif',   score:88, max:100, status:'Baik',              color:C.sky,     bg:'rgba(0,163,224,.07)'  },
                  { name:'Literasi Bahasa Indonesia', score:80, max:100, status:'Baik',              color:C.sky,     bg:'rgba(0,163,224,.07)'  },
                  { name:'Literasi Bahasa Inggris',   score:65, max:100, status:'Perlu Peningkatan', color:C.orange,  bg:'rgba(255,183,0,.07)'  },
                ],
                aiInsight: <>Performa SNBT siswa ini <strong style={{ color:'#00A36B' }}>meningkat 68 poin</strong> dari TO1 (620) hingga TO6 (688). Subtes terkuat adalah <strong style={{ color:'#00A36B' }}>Penalaran Umum</strong> (92). <strong style={{ color:C.orange }}>Literasi Bahasa Inggris</strong> (65) masih perlu ditingkatkan — disarankan latihan soal reading comprehension dan vocabulary intensif sebelum tryout berikutnya.</>,
              },
              TKA: {
                history:    [72, 75, 74, 78, 80, 84],
                labels:     ['TKA1','TKA2','TKA3','TKA4','TKA5','TKA6'],
                scoreLabel: 'TKA 6',
                ranking:    '12 / 145',
                tren:       '📈 Meningkat',
                trenClr:    '#00A36B',
                subtests: [
                  { name:'Bahasa Indonesia', score:88, max:100, status:'Sangat Baik',       color:'#00A36B', bg:'rgba(0,196,106,.07)'  },
                  { name:'Bahasa Inggris',   score:80, max:100, status:'Baik',              color:C.sky,     bg:'rgba(0,163,224,.07)'  },
                  { name:'Matematika',       score:65, max:100, status:'Perlu Peningkatan', color:C.orange,  bg:'rgba(255,183,0,.07)'  },
                  { name:'Mapel Pilihan',    score:76, max:100, status:'Baik',              color:C.sky,     bg:'rgba(0,163,224,.07)'  },
                ],
                aiInsight: <>Nilai TKA siswa ini <strong style={{ color:'#00A36B' }}>meningkat 12 poin</strong> dari TKA1 (72) ke TKA6 (84). <strong style={{ color:'#00A36B' }}>Bahasa Indonesia</strong> (88) menjadi subtes terkuat. <strong style={{ color:C.orange }}>Matematika</strong> (65) perlu perhatian ekstra — disarankan penguatan soal aljabar dan statistika sebelum sesi berikutnya.</>,
              },
              SKD: {
                history:    [286, 298, 305, 312, 320, 328],
                labels:     ['SKD1','SKD2','SKD3','SKD4','SKD5','SKD6'],
                scoreLabel: 'SKD 6',
                ranking:    '22 / 145',
                tren:       '📈 Meningkat',
                trenClr:    '#00A36B',
                subtests: [
                  { name:'TWK (Tes Wawasan Kebangsaan)', score:96,  max:150, status:'Baik',              color:C.sky,    bg:'rgba(0,163,224,.07)'  },
                  { name:'TIU (Tes Intelegensia Umum)',  score:108, max:175, status:'Perlu Peningkatan', color:C.orange, bg:'rgba(255,183,0,.07)'  },
                  { name:'TKP (Tes Karakteristik Pribadi)', score:124, max:225, status:'Baik',           color:C.sky,    bg:'rgba(0,163,224,.07)'  },
                ],
                aiInsight: <>Nilai SKD siswa meningkat <strong style={{ color:'#00A36B' }}>42 poin</strong> dari SKD1 (286) ke SKD6 (328). <strong style={{ color:'#00A36B' }}>TKP</strong> (124/225) sudah di jalur baik. <strong style={{ color:C.orange }}>TIU</strong> (108/175) masih perlu ditingkatkan melalui latihan soal numerik dan penalaran verbal secara konsisten.</>,
              },
            }

            const d = TO_DATA[tryoutTab]
            const toAvg  = Math.round(d.history.reduce((a,b)=>a+b,0)/d.history.length)
            const toLast = d.history[d.history.length-1]
            const toChart = d.labels.map((l,i) => ({ label:l, skor:d.history[i] }))

            const tabAccent = 'linear-gradient(135deg,#0965fa,#00b2dd)'

            return (
              <div className="card" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:24 }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' as const }}>
                  <div>
                    <div style={{ ...F, fontSize:15, fontWeight:700, color:C.textMain }}>📊 Ringkasan Tryout</div>
                    <div style={{ ...F, fontSize:12, color:C.orange, marginTop:3, fontStyle:'italic' }}>Pantau perkembangan performa siswa berdasarkan hasil Tryout yang telah diikuti.</div>
                  </div>
                  {/* Segmented Control */}
                  <div style={{ display:'flex', background:C.ice, borderRadius:12, padding:3, gap:2, flexShrink:0 }}>
                    {(['TKA','SNBT','SKD'] as TOTab[]).map(tab => (
                      <button key={tab} onClick={() => setTryoutTab(tab)}
                        style={{ ...F, fontSize:12, fontWeight:600, border:'none', borderRadius:10, padding:'7px 20px', cursor:'pointer', transition:'all .18s',
                          background: tryoutTab === tab ? tabAccent : 'transparent',
                          color:      tryoutTab === tab ? 'white'   : C.textMuted,
                          boxShadow:  tryoutTab === tab ? '0 2px 10px rgba(9,101,250,.28)' : 'none',
                        }}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                  {[
                    { icon:'📊', label:'Rata-rata Skor',      value: String(toAvg),  sub:`Dari ${d.labels.length} sesi`,    subClr: C.textMuted },
                    { icon:'🎯', label:'Skor Tryout Terakhir', value: String(toLast), sub: d.scoreLabel,                     subClr: C.sky       },
                    { icon:'🏅', label:'Peringkat Kelas',      value: d.ranking,      sub:'Dari total siswa',                subClr: C.orange    },
                    { icon:'📈', label:'Tren Performa',        value: d.tren,         sub:'Berdasarkan histori skor',         subClr: d.trenClr   },
                  ].map(k => (
                    <div key={k.label} style={{ background:C.ice, borderRadius:14, padding:'16px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                        <span style={{ fontSize:16 }}>{k.icon}</span>
                        <span style={{ ...F, fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>{k.label}</span>
                      </div>
                      <div style={{ ...F, fontSize:tryoutTab==='SNBT'?20:18, fontWeight:800, color:C.textMain, lineHeight:1 }}>{k.value}</div>
                      <div style={{ ...F, fontSize:11, fontWeight:500, color:k.subClr, marginTop:6 }}>{k.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Trend Chart */}
                <div>
                  <div style={{ ...F, fontSize:13, fontWeight:600, color:C.textMain, marginBottom:14 }}>Perkembangan Skor {tryoutTab}</div>
                  <div style={{ height:180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={toChart} margin={{ top:8, right:12, left:-16, bottom:0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:C.textMuted, fontFamily:'Poppins' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:C.textMuted, fontFamily:'Poppins' }} domain={['dataMin - 15','dataMax + 15']} />
                        <Tooltip
                          contentStyle={{ background:C.navy, border:'none', borderRadius:10, color:'white', fontSize:12, fontFamily:'Poppins', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}
                          labelStyle={{ color:'rgba(255,255,255,.6)', marginBottom:4 }}
                          formatter={(v) => [v, `Skor ${tryoutTab}`]}
                        />
                        <Line type="monotone" dataKey="skor" stroke={C.orange} strokeWidth={2.5}
                          dot={{ fill:C.orange, r:5, strokeWidth:2, stroke:'white' }}
                          activeDot={{ r:7, fill:C.orange, stroke:'white', strokeWidth:2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subtest Performance */}
                <div>
                  <div style={{ ...F, fontSize:13, fontWeight:600, color:C.textMain, marginBottom:12 }}>Performa Per {tryoutTab === 'SKD' ? 'Tes' : 'Subtes'}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {d.subtests.map(st => {
                      const pct = Math.round(st.score / st.max * 100)
                      return (
                        <div key={st.name} style={{ display:'grid', gridTemplateColumns:'1fr 52px auto', alignItems:'center', gap:14, background:st.bg, borderRadius:12, padding:'13px 16px', border:`1px solid ${st.color}28` }}>
                          <div>
                            <div style={{ ...F, fontSize:12, fontWeight:600, color:C.textMain, marginBottom:7 }}>{st.name}</div>
                            <div style={{ height:7, borderRadius:4, background:'rgba(0,0,0,.07)', overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${pct}%`, borderRadius:4, background:`linear-gradient(90deg,${st.color},${st.color}99)`, transition:'width .5s ease' }} />
                            </div>
                          </div>
                          <div style={{ ...F, fontSize:17, fontWeight:800, color:st.color, textAlign:'right' as const }}>
                            {st.score}{st.max !== 100 && <span style={{ fontSize:10, fontWeight:500, color:C.textMuted }}>/{st.max}</span>}
                          </div>
                          <span style={{ ...F, fontSize:11, fontWeight:600, color:st.color, background:'white', borderRadius:20, padding:'3px 12px', border:`1px solid ${st.color}44`, whiteSpace:'nowrap' as const }}>{st.status}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Orbita AI Insight */}
                <div style={{ background:'rgba(9,101,250,.05)', border:'1px solid rgba(9,101,250,.18)', borderRadius:14, padding:'16px 18px' }}>
                  <div style={{ ...F, fontSize:11, fontWeight:700, color:C.sky, marginBottom:8 }}>🤖 Orbita AI</div>
                  <p style={{ ...F, fontSize:12, color:C.textMid, lineHeight:1.75, margin:0 }}>{d.aiInsight}</p>
                </div>

              </div>
            )
          })()}

          {/* 2-col: Minat & Bakat + Target & Rekomendasi */}
          {minat && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div className="card" style={{ padding: "22px 24px" }}>
                <SectionHead
                  title="Gambaran Minat & Bakat"
                  sub="Bidang yang diminati dan diunggulkan"
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div>
                    <Label>Minat</Label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 7,
                        marginTop: 4,
                      }}
                    >
                      {minat.minat.map((mi) => (
                        <span
                          key={mi}
                          style={{
                            ...F,
                            fontSize: 12,
                            fontWeight: 500,
                            color: C.sky,
                            background: "rgba(0,163,224,.1)",
                            borderRadius: 20,
                            padding: "4px 12px",
                          }}
                        >
                          ✦ {mi}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Bakat</Label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 7,
                        marginTop: 4,
                      }}
                    >
                      {minat.bakat.map((b) => (
                        <span
                          key={b}
                          style={{
                            ...F,
                            fontSize: 12,
                            fontWeight: 500,
                            color: C.orange,
                            background: "rgba(255,140,0,.1)",
                            borderRadius: 20,
                            padding: "4px 12px",
                          }}
                        >
                          ★ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "22px 24px" }}>
                <SectionHead
                  title="Target & Rekomendasi Pendidikan"
                  sub="Target pendidikan dan rekomendasi AI berdasarkan hasil analisis akademik, minat, dan potensi siswa."
                />
                {(()=>{
                  const medalEmoji = ['🥇','🥈','🥉']
                  const tabCfg = {
                    ptn: {
                      bidangIcon: '💻',
                      bidangColor: '#0965fa',
                      bidangAccent: 'rgba(9,101,250,.08)',
                      bidangBorder: 'rgba(9,101,250,.18)',
                      bidangNama: 'Teknologi & Komputasi',
                      bidangDesc: 'Mempelajari pengembangan teknologi digital, sistem informasi, analisis data, kecerdasan buatan, serta solusi berbasis komputer untuk berbagai kebutuhan industri.',
                      targetLabel: 'Target Perguruan Tinggi',
                      targetNama: 'Universitas Indonesia',
                      targetProdi: 'Target Jurusan: Teknik Informatika',
                      recs: [
                        { label:'Teknik Informatika', sub:'UI / ITB',  pct:94 },
                        { label:'Ilmu Komputer',      sub:'UNDIP',     pct:87 },
                        { label:'Sistem Informasi',   sub:'ITS',       pct:79 },
                      ],
                    },
                    kedinasan: {
                      bidangIcon: '🏛️',
                      bidangColor: '#7C3AED',
                      bidangAccent: 'rgba(124,58,237,.08)',
                      bidangBorder: 'rgba(124,58,237,.18)',
                      bidangNama: 'Ekonomi, Keuangan & Tata Kelola Publik',
                      bidangDesc: 'Berfokus pada pengelolaan keuangan negara, perpajakan, akuntansi sektor publik, audit, dan tata kelola pemerintahan untuk mendukung pelayanan publik yang profesional.',
                      targetLabel: 'Target Sekolah Kedinasan',
                      targetNama: 'PKN STAN',
                      targetProdi: 'Program Studi Target: D4 Akuntansi Sektor Publik',
                      recs: [
                        { label:'PKN STAN',   sub:'D4 Akuntansi Sektor Publik',    pct:91 },
                        { label:'Poltek SSN', sub:'D4 Rekayasa Keamanan Siber',    pct:87 },
                        { label:'IPDN',       sub:'Administrasi Pemerintahan',     pct:82 },
                      ],
                    },
                  } as const
                  const cfg = tabCfg[rekTab]
                  return (
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      {/* Segmented control */}
                      <div style={{ display:'flex', background:C.ice, borderRadius:10, padding:3, gap:2, alignSelf:'flex-start' }}>
                        {(['ptn','kedinasan'] as const).map(id => {
                          const active = rekTab === id
                          const label = id === 'ptn' ? 'PTN' : 'Kedinasan'
                          return (
                            <button key={id} onClick={()=>setRekTab(id)}
                              style={{ ...F, fontSize:12, fontWeight:700, border:'none', borderRadius:8,
                                padding:'7px 18px', cursor:'pointer', transition:'all .18s',
                                background: active ? 'linear-gradient(135deg,#0965fa,#00b2dd)' : 'transparent',
                                color:      active ? 'white' : C.textMuted,
                                boxShadow:  active ? '0 2px 8px rgba(9,101,250,.28)' : 'none',
                              }}>
                              {label}
                            </button>
                          )
                        })}
                      </div>

                      {/* Bidang Keilmuan card */}
                      <div style={{ background:cfg.bidangAccent, border:`1.5px solid ${cfg.bidangBorder}`, borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <div style={{ width:34, height:34, borderRadius:9, background:`${cfg.bidangColor}20`, border:`1px solid ${cfg.bidangBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                            {cfg.bidangIcon}
                          </div>
                          <div>
                            <div style={{ ...F, fontSize:10, fontWeight:700, color:cfg.bidangColor, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>Bidang Keilmuan</div>
                            <div style={{ ...F, fontSize:13, fontWeight:700, color:C.textMain, marginTop:1 }}>{cfg.bidangNama}</div>
                          </div>
                        </div>
                        <div style={{ ...F, fontSize:11, color:C.textMid, lineHeight:1.65 }}>{cfg.bidangDesc}</div>
                      </div>

                      {/* Target banner */}
                      <div style={{ background:'linear-gradient(135deg,#0F1E36,#1E3A5F)', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ ...F, fontSize:10, fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:5 }}>
                          {cfg.targetLabel}
                        </div>
                        <div style={{ ...F, fontSize:16, fontWeight:700, color:'white' }}>{cfg.targetNama}</div>
                        <div style={{ ...F, fontSize:12, color:'rgba(255,255,255,.55)', marginTop:3 }}>{cfg.targetProdi}</div>
                      </div>

                      {/* Recommendation list */}
                      <div>
                        <div style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:10 }}>
                          Top 3 Rekomendasi
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          {cfg.recs.map((r,i)=>{
                            const pctColor = r.pct >= 90 ? C.green : r.pct >= 85 ? C.sky : C.orange
                            return (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                                background: i===0 ? 'rgba(0,163,224,.06)' : C.ice,
                                border:     i===0 ? `1px solid rgba(0,163,224,.2)` : 'none',
                                borderRadius:10 }}>
                                <span style={{ fontSize:16, flexShrink:0 }}>{medalEmoji[i]}</span>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ ...F, fontSize:12, fontWeight:700, color:C.textMain }}>{r.label}</div>
                                  <div style={{ ...F, fontSize:11, color:C.textMuted, marginTop:1 }}>— {r.sub}</div>
                                </div>
                                <span style={{ ...F, fontSize:11, fontWeight:700, color:pctColor, background:`${pctColor}18`, borderRadius:20, padding:'3px 10px', flexShrink:0 }}>
                                  {r.pct}% Kesesuaian
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Absensi Kehadiran — removed */}
          {false && absensi && (
            <div className="card" style={{ padding: "22px 24px" }}>
              <SectionHead
                title="Absensi Kehadiran"
                sub="Rekap kehadiran semester berjalan"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  gap: 28,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {[
                      { label: "Hadir", val: absensi.hadir, color: C.green },
                      { label: "Sakit", val: absensi.sakit, color: C.sky },
                      { label: "Izin", val: absensi.izin, color: C.orange },
                      { label: "Alpha", val: absensi.alpha, color: C.red },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: C.ice,
                          borderRadius: 10,
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            ...F,
                            fontSize: 22,
                            fontWeight: 700,
                            color: s.color,
                          }}
                        >
                          {s.val}
                        </div>
                        <div
                          style={{
                            ...F,
                            fontSize: 11,
                            color: C.textMuted,
                            marginTop: 2,
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: `${abColor}14`,
                      border: `1px solid ${abColor}35`,
                      borderRadius: 10,
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        ...F,
                        fontSize: 28,
                        fontWeight: 800,
                        color: abColor,
                      }}
                    >
                      {pctHadir}%
                    </div>
                    <div style={{ ...F, fontSize: 11, color: C.textMuted }}>
                      Persentase Kehadiran
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "#E2E8F0",
                        marginTop: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pctHadir}%`,
                          borderRadius: 3,
                          background: abColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      ...F,
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.07em",
                      marginBottom: 14,
                    }}
                  >
                    Tren Kehadiran per Bulan
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {absensi.bulanan.map((b) => {
                      const bc =
                        b.pct >= 90 ? C.green : b.pct >= 75 ? C.orange : C.red
                      return (
                        <div
                          key={b.bulan}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span
                            style={{
                              ...F,
                              fontSize: 12,
                              fontWeight: 600,
                              color: C.textMid,
                              minWidth: 32,
                            }}
                          >
                            {b.bulan}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              background: "#F1F5F9",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${b.pct}%`,
                                borderRadius: 4,
                                background: bc,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              ...F,
                              fontSize: 12,
                              fontWeight: 700,
                              color: bc,
                              minWidth: 36,
                              textAlign: "right",
                            }}
                          >
                            {b.pct}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {absensi.alpha > 0 && (
                    <div
                      style={{
                        marginTop: 14,
                        background: "rgba(255,77,77,.06)",
                        border: "1px solid rgba(255,77,77,.18)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>⚠</span>
                      <span
                        style={{
                          ...F,
                          fontSize: 12,
                          color: C.red,
                          lineHeight: 1.6,
                        }}
                      >
                        Siswa memiliki{" "}
                        <strong>{absensi.alpha} hari alpha</strong> tanpa
                        keterangan. Segera konfirmasi ke orang tua.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════ TAB 3 — PRESTASI ══ */}
      {mainTab === "prestasi" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {[
            {
              title: "Prestasi Akademik",
              items: [
                {
                  ico: "🏆",
                  nama: "Olimpiade Matematika",
                  tingkat: "Provinsi",
                  tahun: "2025",
                  peringkat: "Juara 1",
                },
                {
                  ico: "🥈",
                  nama: "Lomba Karya Tulis Ilmiah",
                  tingkat: "Kota",
                  tahun: "2024",
                  peringkat: "Juara 2",
                },
              ],
            },
            {
              title: "Prestasi Non Akademik",
              items: [
                {
                  ico: "🏆",
                  nama: "Ketua OSIS",
                  tingkat: "Sekolah",
                  tahun: "2025–2026",
                  peringkat: "Terpilih",
                },
                {
                  ico: "🎭",
                  nama: "Juara Tari Tradisional",
                  tingkat: "Kota",
                  tahun: "2024",
                  peringkat: "Juara 1",
                },
              ],
            },
          ].map((g) => (
            <div
              key={g.title}
              className="card"
              style={{ padding: "22px 24px" }}
            >
              <SectionHead title={g.title} />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {g.items.map((p) => (
                  <div
                    key={p.nama}
                    style={{
                      background: C.ice,
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 26, lineHeight: 1 }}>
                        {p.ico}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            ...F,
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.textMain,
                          }}
                        >
                          {p.nama}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 7,
                            marginTop: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              ...F,
                              fontSize: 11,
                              fontWeight: 600,
                              color: C.sky,
                              background: "rgba(0,163,224,.1)",
                              borderRadius: 20,
                              padding: "2px 10px",
                            }}
                          >
                            Tingkat {p.tingkat}
                          </span>
                          <span
                            style={{
                              ...F,
                              fontSize: 11,
                              fontWeight: 600,
                              color: C.textMuted,
                              background: "#F1F5F9",
                              borderRadius: 20,
                              padding: "2px 10px",
                            }}
                          >
                            {p.tahun}
                          </span>
                          <span
                            style={{
                              ...F,
                              fontSize: 11,
                              fontWeight: 700,
                              color: C.orange,
                              background: "rgba(255,140,0,.1)",
                              borderRadius: 20,
                              padding: "2px 10px",
                            }}
                          >
                            {p.peringkat}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        marginTop: 12,
                        width: "100%",
                        ...F,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.sky,
                        background: "rgba(0,163,224,.08)",
                        border: "1px solid rgba(0,163,224,.2)",
                        borderRadius: 8,
                        padding: "7px",
                        cursor: "pointer",
                      }}
                    >
                      🔗 Lihat Sertifikat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════ TAB 4 — BIMBINGAN BK ══ */}
      {mainTab === "bk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Ringkasan Konseling AI */}
          <div
            style={{
              background:
                "linear-gradient(135deg,rgba(9,101,250,.06),rgba(0,178,221,.04))",
              border: "1px solid rgba(9,101,250,.15)",
              borderRadius: 16,
              padding: "20px 24px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <span
                style={{
                  ...F,
                  fontSize: 11,
                  fontWeight: 700,
                  color: priColor(topPri),
                  background: `${priColor(topPri)}18`,
                  borderRadius: 20,
                  padding: "5px 14px",
                }}
              >
                {topPri === "Tinggi" ? "🔴" : topPri === "Sedang" ? "🟡" : "🟢"}{" "}
                Prioritas {topPri}
              </span>
            </div>
            <div
              style={{
                ...F,
                fontSize: 14,
                fontWeight: 700,
                color: C.textMain,
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🤖 Orbita AI
            </div>
            <div
              style={{
                ...F,
                fontSize: 11,
                color: C.textMuted,
                marginBottom: 14,
              }}
            >
              Ringkasan otomatis berdasarkan seluruh riwayat konseling siswa.
            </div>
            <p
              style={{
                ...F,
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Berdasarkan seluruh riwayat konseling,{" "}
              {allBKNotes.length > 0
                ? `siswa menunjukkan kondisi yang perlu dipantau pada aspek ${allBKNotes[0].topik.toLowerCase()}. ${allBKNotes[0].rekomendasi} Guru BK merekomendasikan agar wali kelas ${allBKNotes[0].tindakLanjut.toLowerCase()}.`
                : "siswa dalam kondisi baik dan tidak memerlukan intervensi khusus saat ini."}
            </p>
          </div>

          {/* Timeline Riwayat Konseling */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ ...F, fontSize:14, fontWeight:700, color:C.textMain }}>Riwayat Konseling</div>
                <div style={{ ...F, fontSize:12, color:C.orange, marginTop:2, fontStyle:'italic' }}>Diurutkan dari terbaru</div>
              </div>
              {role !== 'wali' && (
                <button
                  onClick={() => { setBkForm({ topik:'', catatan:'', rekomendasi:'', tindakLanjut:'', prioritas:'Rendah', konselor:'', tanggalInput: new Date().toISOString().slice(0,10) }); setShowBKModal(true) }}
                  style={{ ...F, fontSize:12, fontWeight:700, background:'linear-gradient(135deg,#0965fa,#00b2dd)', color:'white', border:'none', borderRadius:10, padding:'9px 18px', cursor:'pointer', display:'flex', alignItems:'center', gap:7, boxShadow:'0 2px 10px rgba(9,101,250,.28)', flexShrink:0 }}
                >
                  <span style={{ fontSize:16, lineHeight:1 }}>＋</span> Tambah Catatan
                </button>
              )}
            </div>
            {allBKNotes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  ...F,
                  fontSize: 13,
                  color: C.textMuted,
                }}
              >
                Belum ada riwayat konseling
              </div>
            ) : (
              <div style={{ position: "relative", paddingLeft: 32 }}>
                {/* Timeline line */}
                <div
                  style={{
                    position: "absolute",
                    left: 11,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    background:
                      "linear-gradient(to bottom,#0965fa,rgba(9,101,250,.1))",
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {allBKNotes.map((c, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: -21,
                          top: 14,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: priColor(c.prioritas),
                          border: "2px solid white",
                          boxShadow: `0 0 0 2px ${priColor(c.prioritas)}30`,
                        }}
                      />
                      <div
                        style={{
                          border: `1px solid ${C.border}`,
                          borderRadius: 14,
                          padding: "16px 18px",
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 12,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                ...F,
                                fontSize: 14,
                                fontWeight: 700,
                                color: C.textMain,
                              }}
                            >
                              {c.topik}
                            </div>
                            <div
                              style={{
                                ...F,
                                fontSize: 11,
                                color: C.textMuted,
                                marginTop: 2,
                              }}
                            >
                              {c.konselor} · {c.tanggal}
                            </div>
                          </div>
                          <span
                            style={{
                              ...F,
                              fontSize: 11,
                              fontWeight: 700,
                              color: priColor(c.prioritas),
                              background: `${priColor(c.prioritas)}14`,
                              borderRadius: 20,
                              padding: "4px 12px",
                              flexShrink: 0,
                            }}
                          >
                            ● Prioritas {c.prioritas}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 14,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                ...F,
                                fontSize: 10,
                                fontWeight: 700,
                                color: C.textMuted,
                                textTransform: "uppercase" as const,
                                letterSpacing: "0.07em",
                                marginBottom: 6,
                              }}
                            >
                              Catatan Konselor
                            </div>
                            <div
                              style={{
                                ...F,
                                fontSize: 12,
                                color: C.textMid,
                                lineHeight: 1.7,
                              }}
                            >
                              {c.catatan}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  ...F,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: C.textMuted,
                                  textTransform: "uppercase" as const,
                                  letterSpacing: "0.07em",
                                  marginBottom: 5,
                                }}
                              >
                                Rekomendasi
                              </div>
                              <div
                                style={{
                                  ...F,
                                  fontSize: 12,
                                  color: C.textMain,
                                  lineHeight: 1.65,
                                }}
                              >
                                💡 {c.rekomendasi}
                              </div>
                            </div>
                            <div
                              style={{
                                background: C.ice,
                                borderRadius: 8,
                                padding: "10px 12px",
                              }}
                            >
                              <div
                                style={{
                                  ...F,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: C.textMuted,
                                  textTransform: "uppercase" as const,
                                  letterSpacing: "0.07em",
                                  marginBottom: 4,
                                }}
                              >
                                Tindak Lanjut untuk Wali Kelas
                              </div>
                              <div
                                style={{
                                  ...F,
                                  fontSize: 12,
                                  color: C.textMain,
                                  fontWeight: 600,
                                  lineHeight: 1.6,
                                }}
                              >
                                → {c.tindakLanjut}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Tambah Catatan BK ── */}
      {showBKModal && (
        <div
          onClick={() => setShowBKModal(false)}
          style={{ position:'fixed', inset:0, background:'rgba(15,30,54,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:'white', borderRadius:20, padding:'28px 28px 24px', width:'100%', maxWidth:560, boxShadow:'0 24px 64px rgba(0,0,0,.18)', display:'flex', flexDirection:'column', gap:20 }}
          >
            {/* Modal Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ ...F, fontSize:16, fontWeight:700, color:C.textMain }}>💬 Tambah Catatan BK</div>
                <div style={{ ...F, fontSize:12, color:C.textMuted, marginTop:3 }}>{student.nama} · {new Date().toLocaleDateString('id-ID',{ day:'numeric', month:'long', year:'numeric' })}</div>
              </div>
              <button onClick={() => setShowBKModal(false)} style={{ background:C.ice, border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', ...F, fontSize:18, color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>

            {/* Fields */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Tanggal + Nama Konselor */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Tanggal Konseling</label>
                  <input
                    type="date"
                    value={bkForm.tanggalInput}
                    onChange={e => setBkForm(f=>({...f, tanggalInput:e.target.value}))}
                    style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', boxSizing:'border-box' as const, background:'white' }}
                  />
                </div>
                <div>
                  <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Nama Konselor</label>
                  <input
                    value={bkForm.konselor}
                    onChange={e => setBkForm(f=>({...f, konselor:e.target.value}))}
                    placeholder="cth. Bpk. Hendra, S.Pd..."
                    style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', boxSizing:'border-box' as const, background:'white' }}
                  />
                </div>
              </div>
              {/* Topik */}
              <div>
                <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Topik Konseling</label>
                <input
                  value={bkForm.topik}
                  onChange={e => setBkForm(f=>({...f, topik:e.target.value}))}
                  placeholder="cth. Motivasi Belajar, Persiapan UTBK..."
                  style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', boxSizing:'border-box' as const, background:'white' }}
                />
              </div>
              {/* Catatan */}
              <div>
                <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Catatan Konselor</label>
                <textarea
                  value={bkForm.catatan}
                  onChange={e => setBkForm(f=>({...f, catatan:e.target.value}))}
                  placeholder="Tulis catatan hasil sesi konseling..."
                  rows={3}
                  style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, background:'white', fontFamily:"'Poppins',sans-serif" }}
                />
              </div>
              {/* Rekomendasi */}
              <div>
                <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Rekomendasi</label>
                <input
                  value={bkForm.rekomendasi}
                  onChange={e => setBkForm(f=>({...f, rekomendasi:e.target.value}))}
                  placeholder="Saran atau rekomendasi untuk siswa..."
                  style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', boxSizing:'border-box' as const, background:'white' }}
                />
              </div>
              {/* Tindak Lanjut */}
              <div>
                <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:6 }}>Tindak Lanjut untuk Wali Kelas</label>
                <input
                  value={bkForm.tindakLanjut}
                  onChange={e => setBkForm(f=>({...f, tindakLanjut:e.target.value}))}
                  placeholder="Instruksi atau arahan untuk wali kelas..."
                  style={{ ...F, fontSize:13, width:'100%', border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.textMain, outline:'none', boxSizing:'border-box' as const, background:'white' }}
                />
              </div>
              {/* Prioritas */}
              <div>
                <label style={{ ...F, fontSize:11, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Tingkat Prioritas</label>
                <div style={{ display:'flex', gap:8 }}>
                  {(['Rendah','Sedang','Tinggi'] as const).map(p => (
                    <button key={p} onClick={() => setBkForm(f=>({...f, prioritas:p}))}
                      style={{ ...F, fontSize:12, fontWeight:600, flex:1, border:`2px solid ${bkForm.prioritas===p ? priColor(p) : C.border}`, borderRadius:10, padding:'9px 0', cursor:'pointer', background:bkForm.prioritas===p ? `${priColor(p)}12` : 'white', color:bkForm.prioritas===p ? priColor(p) : C.textMuted, transition:'all .15s' }}>
                      {p === 'Rendah' ? '🟢' : p === 'Sedang' ? '🟡' : '🔴'} {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:10, paddingTop:4 }}>
              <button onClick={() => setShowBKModal(false)}
                style={{ ...F, fontSize:13, fontWeight:600, flex:1, background:C.ice, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 0', cursor:'pointer', color:C.textMid }}>
                Batal
              </button>
              <button
                onClick={() => {
                  if (!bkForm.topik.trim()) return
                  const [y,m,d] = bkForm.tanggalInput.split('-').map(Number)
                  const tgl = new Date(y,m-1,d).toLocaleDateString('id-ID',{ day:'numeric', month:'long', year:'numeric' })
                  setLocalBKNotes(prev => [{
                    tanggal:      tgl,
                    topik:        bkForm.topik,
                    konselor:     bkForm.konselor.trim() || 'Wali Kelas',
                    catatan:      bkForm.catatan || '-',
                    rekomendasi:  bkForm.rekomendasi || '-',
                    tindakLanjut: bkForm.tindakLanjut || '-',
                    prioritas:    bkForm.prioritas,
                  }, ...prev])
                  setShowBKModal(false)
                }}
                style={{ ...F, fontSize:13, fontWeight:700, flex:2, background:'linear-gradient(135deg,#0965fa,#00b2dd)', color:'white', border:'none', borderRadius:10, padding:'11px 0', cursor:'pointer', boxShadow:'0 2px 10px rgba(9,101,250,.28)' }}>
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ANALISIS AKADEMIK ────────────────────────────────────────────────────────
function Analisis({ setPage }: { setPage: (p: Page) => void }) {
  const kpis = [
    {
      label: "Rata-rata Nilai",
      value: "87,6",
      sub: "↑ +2,3 vs sem lalu",
      color: C.sky,
    },
    {
      label: "Nilai Tertinggi",
      value: "96,4",
      sub: "Farah Nadia",
      color: C.green,
    },
    {
      label: "Nilai Terendah",
      value: "72,3",
      sub: "Perlu perhatian: 2 siswa",
      color: C.red,
    },
    {
      label: "Ketuntasan",
      value: "83%",
      sub: "30 dari 36 siswa tuntas",
      color: C.orange,
    },
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: 17,
            color: C.textMain,
          }}
        >
          Analisis Akademik
        </div>
        <div
          className="font-pecita"
          style={{ fontSize: 13, color: C.orange, marginTop: 3 }}
        >
          Statistik & insight AI — XI IPA 2
        </div>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            className="card"
            style={{ padding: "18px 20px", borderTop: `3px solid ${k.color}` }}
          >
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: k.color,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {k.value}
            </div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: C.textMain,
                marginBottom: 4,
              }}
            >
              {k.label}
            </div>
            <div
              className="font-pecita"
              style={{ fontSize: 12, color: C.textMuted }}
            >
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: "22px 24px" }}>
          <SectionHead
            title="Distribusi Nilai"
            sub="Berdasarkan kategori capaian"
          />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={DISTRIBUSI}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: C.navy,
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Poppins",
                }}
                formatter={(v: number) => [v + " siswa", "Jumlah"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {DISTRIBUSI.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: "22px 24px" }}>
          <SectionHead
            title="Tren Perkembangan"
            sub="Rata-rata kelas per semester"
          />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={TREND}
              margin={{ top: 4, right: 8, left: -22, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                vertical={false}
              />
              <XAxis
                dataKey="sem"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: C.textMuted,
                  fontFamily: "Poppins",
                }}
                domain={[78, 92]}
              />
              <Tooltip
                contentStyle={{
                  background: C.navy,
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Poppins",
                }}
                formatter={(v: number) => [v.toFixed(1), "Rata-rata"]}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke={C.sky}
                strokeWidth={2.5}
                dot={{ fill: C.sky, r: 4, strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI */}
      <div
        style={{
          background:
            "linear-gradient(135deg,rgba(0,163,224,.07),rgba(0,180,216,.04))",
          border: "1px solid rgba(0,163,224,.18)",
          borderRadius: 16,
          padding: "22px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "linear-gradient(135deg,#00A3E0,#00B4D8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            🤖
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: C.textMain,
                marginBottom: 8,
              }}
            >
              Orbita AI
            </div>
            <p
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Sebagian besar siswa menunjukkan perkembangan akademik yang
              stabil. Sebanyak{" "}
              <strong style={{ color: C.textMain }}>18 siswa</strong> mengalami
              peningkatan lebih dari 5 poin, sedangkan{" "}
              <strong style={{ color: C.red }}>4 siswa</strong> mengalami
              penurunan selama dua semester berturut-turut sehingga disarankan
              mendapatkan pendampingan lebih lanjut dari Guru BK.
            </p>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <SectionHead title="Detail Analisis Siswa" />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.ice }}>
              {["Nama", "Rata-rata", "Tren", "Ranking", "Detail"].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "10px 16px",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...STUDENTS]
              .sort((a, b) => b.avg - a.avg)
              .map((s, i) => (
                <tr
                  key={s.id}
                  className="tr-hover"
                  style={{ borderTop: i > 0 ? `1px solid #F8FAFC` : "none" }}
                >
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textMain,
                    }}
                  >
                    {s.nama}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color:
                        s.avg >= 85 ? C.green : s.avg >= 75 ? "#D4900A" : C.red,
                    }}
                  >
                    {s.avg}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <Badge status={s.tren} />
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          i === 0
                            ? "rgba(255,183,0,.15)"
                            : i === 1
                              ? "rgba(148,163,184,.15)"
                              : i === 2
                                ? "rgba(255,140,0,.12)"
                                : C.ice,
                        color:
                          i === 0
                            ? "#B5780A"
                            : i === 1
                              ? "#64748B"
                              : i === 2
                                ? C.orange
                                : C.textMid,
                      }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
                      onClick={() => setPage("data")}
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(0,163,224,.08)",
                        color: C.sky,
                        border: "1px solid rgba(0,163,224,.2)",
                        borderRadius: 8,
                        padding: "5px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── MONITORING TRYOUT ───────────────────────────────────────────────────────
function MonitoringTryout() {
  const [detailStudent, setDetailStudent] = useState<TryoutStudent | null>(null)
  const [filterAlert,   setFilterAlert]   = useState<string | null>(null)
  const [toCategory,    setToCategory]    = useState<'TKA'|'UTBK'|'SKD'>('UTBK')
  const [semester,      setSemester]      = useState<'5'|'6'>('6')
  const [sesiIdx,       setSesiIdx]       = useState<number>(7)
  const [isLoading,     setIsLoading]     = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 380)
    return () => clearTimeout(t)
  }, [toCategory, semester, sesiIdx])

  if (detailStudent) return <StudentTryoutDetail student={detailStudent} toCategory={toCategory} onBack={() => setDetailStudent(null)} />

  const isTKA = toCategory === 'TKA'
  const isSKD = toCategory === 'SKD'

  const activeStudents = isTKA ? TKA_STUDENTS : isSKD ? SKD_STUDENTS : TRYOUT_STUDENTS
  const activeTrend    = isTKA ? TKA_TREND    : isSKD ? SKD_TREND    : TO_TREND
  const activeSubtest  = isTKA ? TKA_SUBTEST_AVG : isSKD ? SKD_SUBTEST_AVG : SUBTEST_AVG
  const activeRadar    = isTKA ? TKA_RADAR_DATA  : isSKD ? SKD_RADAR_DATA  : RADAR_DATA

  const clampedIdx   = Math.min(sesiIdx, activeTrend.length - 1)
  const sessionLabel = (idx: number) =>
    isTKA ? `TKA #${idx+1}` : isSKD ? `SKD #${idx+1}` : `TO SNBT #${idx+1}`
  const semSessions: number[] = semester === '5' ? [3,2,1,0] : [7,6,5,4]
  const kpiLabel = sessionLabel(clampedIdx)

  const changeCat = (cat: typeof toCategory) => {
    setToCategory(cat); setFilterAlert(null); setSesiIdx(semester === '5' ? 3 : 7)
  }
  const changeSemester = (sem: '5'|'6') => {
    setSemester(sem); setSesiIdx(sem === '5' ? 3 : 7); setFilterAlert(null)
  }

  const sessionScores = activeStudents.map(s =>
    s.history[Math.min(clampedIdx, s.history.length - 1)] ?? s.skor
  )
  const kpiAvg = Math.round(sessionScores.reduce((a,b)=>a+b,0) / sessionScores.length)
  const kpiMax = Math.max(...sessionScores)
  const kpiMin = Math.min(...sessionScores)
  const kpiMaxStudent = activeStudents[sessionScores.indexOf(kpiMax)]
  const prevScores = clampedIdx > 0
    ? activeStudents.map(s => s.history[Math.min(clampedIdx-1, s.history.length-1)] ?? s.skor)
    : sessionScores
  const avgDelta = kpiAvg - Math.round(prevScores.reduce((a,b)=>a+b,0) / prevScores.length)

  const computeDistrib = (scores: number[]) => {
    if (isTKA) return [
      { range:'90–100', count:scores.filter(s=>s>=90).length,          color:'#00C46A' },
      { range:'80–89',  count:scores.filter(s=>s>=80&&s<90).length,    color:'#00A3E0' },
      { range:'70–79',  count:scores.filter(s=>s>=70&&s<80).length,    color:'#00B4D8' },
      { range:'60–69',  count:scores.filter(s=>s>=60&&s<70).length,    color:'#FFB700' },
      { range:'<60',    count:scores.filter(s=>s<60).length,           color:'#FF4D4D' },
    ]
    if (isSKD) return [
      { range:'350+',    count:scores.filter(s=>s>=350).length,         color:'#00C46A' },
      { range:'310–349', count:scores.filter(s=>s>=310&&s<350).length, color:'#00A3E0' },
      { range:'280–309', count:scores.filter(s=>s>=280&&s<310).length, color:'#00B4D8' },
      { range:'260–279', count:scores.filter(s=>s>=260&&s<280).length, color:'#FFB700' },
      { range:'<260',    count:scores.filter(s=>s<260).length,         color:'#FF4D4D' },
    ]
    return [
      { range:'750+',    count:scores.filter(s=>s>=750).length,         color:'#00C46A' },
      { range:'700–749', count:scores.filter(s=>s>=700&&s<750).length, color:'#00A3E0' },
      { range:'650–699', count:scores.filter(s=>s>=650&&s<700).length, color:'#00B4D8' },
      { range:'600–649', count:scores.filter(s=>s>=600&&s<650).length, color:'#FFB700' },
      { range:'<600',    count:scores.filter(s=>s<600).length,         color:'#FF4D4D' },
    ]
  }
  const activeDistrib = computeDistrib(sessionScores)

  const studentsAtSession = activeStudents.map(s => ({
    ...s,
    skor: s.history[Math.min(clampedIdx, s.history.length-1)] ?? s.skor,
    to:   kpiLabel,
  }))
  const sortedDesc    = [...studentsAtSession].sort((a,b) => b.skor - a.skor)
  const rankedStudents = studentsAtSession.map(s => ({
    ...s,
    ranking: sortedDesc.findIndex(x => x.id === s.id) + 1,
    status: isTKA ? (s.skor>=85?'excellent':s.skor>=75?'good':s.skor>=65?'improvement':'perhatian')
          : isSKD ? (s.skor>=330?'excellent':s.skor>=271?'good':s.skor>=250?'improvement':'perhatian')
                  : (s.skor>=700?'excellent':s.skor>=600?'good':s.skor>=500?'improvement':'perhatian'),
  }))

  const alertedStudents: Record<string, typeof rankedStudents> = {
    'Performa Meningkat': rankedStudents.filter(s => s.tren === 'naik'),
    'Performa Stabil':    rankedStudents.filter(s => s.tren === 'stabil'),
    'Performa Menurun':   rankedStudents.filter(s => s.tren === 'turun'),
    'Belum Ikut Tryout':  rankedStudents.filter(s => s.history.length === 0),
  }
  const displayedStudents = rankedStudents
    .filter(s => !filterAlert || alertedStudents[filterAlert]?.some(a => a.id === s.id))

  const trendChartData = activeTrend.slice(0, clampedIdx + 1)

  const F = { fontFamily:"'Poppins',sans-serif" } as const
  const selStyle = { ...F, fontSize:12, fontWeight:500, background:'white', border:`1px solid ${C.border}`, borderRadius:9, padding:'8px 32px 8px 14px', color:C.textMid, cursor:'pointer', outline:'none', appearance:'none' as const, boxShadow:'0 1px 4px rgba(15,30,54,.05)' }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* ── Global Filter Bar ── */}
      <div className="card" style={{ padding:'16px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', background:C.ice, borderRadius:10, padding:3, gap:2, flexShrink:0 }}>
            {(['TKA','UTBK','SKD'] as const).map(c=>(
              <button key={c} onClick={()=>changeCat(c)}
                style={{ ...F, fontSize:12, fontWeight:600, border:'none', borderRadius:8, padding:'7px 18px', cursor:'pointer', transition:'all .18s',
                  background:toCategory===c?'linear-gradient(135deg,#0965fa,#00b2dd)':'transparent',
                  color:toCategory===c?'white':C.textMuted,
                  boxShadow:toCategory===c?'0 2px 8px rgba(9,101,250,.3)':'none',
                }}>{c}</button>
            ))}
          </div>
          <div style={{ width:1, height:28, background:C.border, flexShrink:0 }} />
          <div style={{ position:'relative', flexShrink:0 }}>
            <select value={semester} onChange={e=>changeSemester(e.target.value as '5'|'6')} style={selStyle}>
              <option value="6">Semester 6 (Genap)</option>
              <option value="5">Semester 5 (Ganjil)</option>
            </select>
            <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', fontSize:10, color:C.textMuted }}>▾</span>
          </div>
          <div style={{ position:'relative', flexShrink:0 }}>
            <select value={clampedIdx} onChange={e=>setSesiIdx(Number(e.target.value))} key={`${toCategory}-${semester}`} style={selStyle}>
              {semSessions.map(idx=>(
                <option key={idx} value={idx}>{sessionLabel(idx)}</option>
              ))}
            </select>
            <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', fontSize:10, color:C.textMuted }}>▾</span>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ ...F, fontSize:11, fontWeight:600, background:'rgba(9,101,250,.08)', color:C.sky, borderRadius:8, padding:'5px 12px', border:'1px solid rgba(9,101,250,.18)' }}>
              {toCategory} · Sem {semester} · {kpiLabel}
            </div>
            {isLoading && (
              <div style={{ display:'flex', alignItems:'center', gap:5, ...F, fontSize:11, color:C.textMuted }}>
                <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${C.sky}`, borderTopColor:'transparent', animation:'spin .6s linear infinite' }} />
                Memuat...
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ display:'flex', flexDirection:'column', gap:20, opacity:isLoading?0.55:1, transition:'opacity .25s', pointerEvents:isLoading?'none':'auto' }}>

      {/* ── Section 1 — KPI cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
        <div style={{ borderRadius:16, background:'linear-gradient(135deg,#0965fa,#00b2dd)', padding:'18px 20px', boxShadow:'0 6px 20px rgba(9,101,250,.3)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
          <div style={{ fontSize:20, marginBottom:8 }}>🎯</div>
          <div style={{ ...F, fontSize:10, fontWeight:600, color:'rgba(255,255,255,.75)', textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:4 }}>{isTKA?'Peserta TKA':isSKD?'Peserta SKD':'Peserta Tryout'}</div>
          <div style={{ ...F, fontSize:28, fontWeight:800, color:'white', lineHeight:1 }}>{activeStudents.length}<span style={{ fontSize:16, opacity:.65 }}> / 36</span></div>
          <div style={{ ...F, fontSize:11, color:'rgba(255,255,255,.6)', marginTop:6 }}>Siswa aktif</div>
        </div>
        {[
          { icon:'📊', label:isTKA?'Rata-rata Nilai TKA':isSKD?'Rata-rata Nilai SKD':'Rata-rata Nilai', value:String(kpiAvg), sub:`${avgDelta>=0?'+':''}${avgDelta} dari sesi sebelumnya`, subClr:avgDelta>=0?C.green:C.red },
          { icon:'🏆', label:'Nilai Tertinggi', value:String(kpiMax), sub:kpiMaxStudent?.nama??'-', subClr:C.orange },
          { icon:'📉', label:'Nilai Terendah',  value:String(kpiMin), sub:'Perlu perhatian', subClr:C.red },
          { icon:'📝', label:isTKA?'Sesi TKA':isSKD?'Sesi SKD':'Sesi Tryout', value:kpiLabel, sub:`Semester ${semester==='5'?'5 (Ganjil)':'6 (Genap)'}`, subClr:C.textMuted },
        ].map(k=>(
          <div key={k.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>{k.icon}</span>
              <span style={{ ...F, fontSize:10, fontWeight:600, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.07em' }}>{k.label}</span>
            </div>
            <div style={{ ...F, fontSize:22, fontWeight:800, color:C.textMain, lineHeight:1 }}>{k.value}</div>
            <div style={{ ...F, fontSize:11, fontWeight:500, color:k.subClr, marginTop:7 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Section 2 — Trend Chart ── */}
      <div className="card" style={{ padding:'22px 24px' }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ ...F, fontWeight:700, fontSize:15, color:C.textMain }}>{isTKA?'Grafik Perkembangan TKA':isSKD?'Grafik Perkembangan SKD':'Grafik Perkembangan Tryout'}</div>
          <div style={{ ...F, fontSize:13, color:C.orange, marginTop:2, fontStyle:'italic' }}>{isTKA?'Rata-rata nilai kelas per sesi TKA':isSKD?'Rata-rata nilai kelas per sesi SKD':'Rata-rata skor kelas per sesi tryout'}</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trendChartData} margin={{ top:8, right:16, left:-16, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="to" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:C.textMuted, fontFamily:'Poppins' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:C.textMuted, fontFamily:'Poppins' }} domain={['auto','auto']} />
            <Tooltip contentStyle={{ background:C.navy, border:'none', borderRadius:10, color:'white', fontSize:12, fontFamily:'Poppins', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }} labelStyle={{ color:'rgba(255,255,255,.6)', marginBottom:4 }} formatter={(v)=>[v, isSKD?'Rata-rata Nilai SKD':isTKA?'Rata-rata Nilai TKA':'Rata-rata Skor UTBK']} />
            <Line type="monotone" dataKey="avg" stroke={C.sky} strokeWidth={2.5} dot={{ fill:C.sky, r:5, strokeWidth:2.5, stroke:'white' }} activeDot={{ r:7, fill:C.sky, stroke:'white', strokeWidth:2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Section 3 — Subtest Analysis ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div className="card" style={{ padding:'22px 24px' }}>
          <SectionHead title="Analisis Per Subtest" sub={isTKA?'Rata-rata kelas · subtes TKA':isSKD?'Rata-rata kelas · subtes SKD':'Rata-rata kelas · subtes UTBK/SNBT'} />
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={activeRadar} margin={{ top:10, right:28, bottom:10, left:28 }}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize:10, fill:C.textMuted, fontFamily:'Poppins' }} />
              <Radar name="Kelas" dataKey="A" stroke={C.sky} fill={C.sky} fillOpacity={0.18} strokeWidth={2} dot={{ fill:C.sky, r:4 }} />
              <Tooltip contentStyle={{ background:C.navy, border:'none', borderRadius:10, color:'white', fontSize:12, fontFamily:'Poppins' }} formatter={(v)=>[v,'Rata-rata']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding:'22px 24px', display:'flex', flexDirection:'column' }}>
          <SectionHead title={isSKD?'Nilai Per Subtes':'Skor Per Subtest'} sub={isSKD?'Skor rata-rata kelas (TWK/150 · TIU/175 · TKP/225)':'Nilai rata-rata kelas (skala 0–100)'} />
          <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
            {activeSubtest.map(d=>{
              const pct = Math.round(d.avg/d.full*100)
              const barClr = pct<55?C.red:pct>=70?C.green:C.orange
              return (
                <div key={d.sub}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ ...F, fontSize:12, fontWeight:500, color:C.textMain }}>{d.sub}</span>
                    <span style={{ ...F, fontSize:14, fontWeight:700, color:barClr }}>{d.avg}{d.full!==100?<span style={{ fontSize:10, fontWeight:500, color:C.textMuted }}>/{d.full}</span>:''}</span>
                  </div>
                  <div style={{ height:10, borderRadius:5, background:'#F1F5F9', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, borderRadius:5, background:pct<55?`linear-gradient(90deg,${C.red},#FF7777)`:pct>=70?`linear-gradient(90deg,${C.green},#33D488)`:`linear-gradient(90deg,${C.orange},${C.yellow})`, transition:'width .6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop:18, background:'rgba(9,101,250,.06)', border:'1px solid rgba(9,101,250,.18)', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ ...F, fontSize:11, fontWeight:700, color:C.sky, marginBottom:6 }}>🤖 Orbita AI</div>
            <p style={{ ...F, fontSize:12, color:C.textMid, lineHeight:1.7, margin:0 }}>
              {isTKA
                ? <>Sebagian besar siswa menunjukkan performa baik pada <strong style={{ color:C.green }}>Bahasa Indonesia</strong> dan <strong style={{ color:C.sky }}>Bahasa Inggris</strong>, namun nilai <strong style={{ color:C.red }}>Matematika</strong> masih berada di bawah rata-rata (61). Disarankan penguatan soal Matematika TKA sebelum sesi berikutnya.</>
                : isSKD
                ? <>Sebagian besar siswa memperoleh nilai baik pada <strong style={{ color:C.green }}>TKP</strong>, namun performa pada <strong style={{ color:C.red }}>TIU</strong> masih berada di bawah rata-rata kelas sehingga perlu ditingkatkan melalui latihan soal numerik, verbal, dan penalaran. Nilai <strong style={{ color:C.orange }}>TWK</strong> juga perlu diperkuat melalui pendalaman materi kebangsaan dan peraturan perundang-undangan.</>
                : <>Sebagian besar siswa menunjukkan performa baik pada <strong style={{ color:C.green }}>Literasi Bahasa Indonesia</strong>, namun <strong style={{ color:C.red }}>Literasi Bahasa Inggris</strong> (rata-rata 65) dan <strong style={{ color:C.orange }}>Penalaran Umum</strong> (rata-rata 72) masih perlu ditingkatkan melalui latihan soal intensif sebelum tryout berikutnya.</>
              }
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 4 — Distribusi Nilai ── */}
      <div className="card" style={{ padding:'22px 24px' }}>
        <SectionHead title={isTKA?'Distribusi Nilai TKA':isSKD?'Distribusi Nilai SKD':'Distribusi Nilai Tryout'} sub={`Histogram ${kpiLabel} — ${activeStudents.length} siswa`} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:24, alignItems:'center' }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activeDistrib} margin={{ top:4, right:8, left:-16, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:C.textMuted, fontFamily:'Poppins' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:C.textMuted, fontFamily:'Poppins' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background:C.navy, border:'none', borderRadius:10, color:'white', fontSize:12, fontFamily:'Poppins' }} formatter={(v)=>[String(v)+' siswa','Jumlah']} />
              <Bar dataKey="count" radius={[6,6,0,0]}>{activeDistrib.map((d,i)=><Cell key={i} fill={d.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {activeDistrib.map(d=>(
              <div key={d.range} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:C.ice, borderRadius:10, padding:'8px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:d.color }} />
                  <span style={{ ...F, fontSize:12, color:C.textMid }}>{d.range}</span>
                </div>
                <span style={{ ...F, fontSize:13, fontWeight:700, color:C.textMain }}>{d.count} siswa</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 5 — Performance Filter cards ── */}
      <div>
        <SectionHead title="Status Performa Siswa" sub="Klik untuk menyaring daftar siswa" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {([
            { key:'Performa Meningkat', icon:'⬆', color:'#00A36B', bg:'rgba(0,196,106,.07)',   border:'rgba(0,196,106,.22)'  },
            { key:'Performa Stabil',    icon:'➡', color:C.sky,     bg:'rgba(0,163,224,.07)',   border:'rgba(0,163,224,.22)'  },
            { key:'Performa Menurun',   icon:'⬇', color:C.red,     bg:'rgba(255,77,77,.07)',   border:'rgba(255,77,77,.2)'   },
            { key:'Belum Ikut Tryout',  icon:'🚫',color:C.textMuted,bg:'rgba(148,163,184,.08)',border:'rgba(148,163,184,.2)' },
          ]).map(cfg=>{
            const count  = alertedStudents[cfg.key]?.length ?? 0
            const active = filterAlert === cfg.key
            return (
              <button key={cfg.key} onClick={()=>setFilterAlert(active?null:cfg.key)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, background:active?cfg.bg:'white', border:active?`2px solid ${cfg.color}`:`1px solid ${C.border}`, borderRadius:16, padding:'20px 14px', cursor:'pointer', textAlign:'center', boxShadow:active?`0 4px 16px ${cfg.border}`:'0 2px 8px rgba(15,30,54,.06)', transition:'all .2s' }}>
                <span style={{ fontSize:28 }}>{cfg.icon}</span>
                <div style={{ ...F, fontSize:30, fontWeight:800, color:active?cfg.color:C.textMain }}>{count}</div>
                <div style={{ ...F, fontSize:11, fontWeight:600, color:active?cfg.color:C.textMuted, lineHeight:1.4 }}>{cfg.key}</div>
                <div style={{ ...F, fontSize:11, color:active?cfg.color:C.textMuted }}>siswa</div>
                {active && <div style={{ ...F, fontSize:10, color:cfg.color, fontWeight:600 }}>× Hapus filter</div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Section 6 — Student Table ── */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ ...F, fontWeight:700, fontSize:15, color:C.textMain }}>
              Detail Monitoring Siswa
              {filterAlert && <span style={{ ...F, fontSize:12, fontWeight:500, color:C.orange, marginLeft:10 }}>· {filterAlert}</span>}
            </div>
            <div style={{ ...F, fontSize:13, color:C.orange, marginTop:2, fontStyle:'italic' }}>{isSKD?'Nilai':'Skor'} & tren per siswa · {kpiLabel}</div>
          </div>
          {filterAlert && <button onClick={()=>setFilterAlert(null)} style={{ ...F, fontSize:11, fontWeight:600, background:C.ice, color:C.textMid, border:`1px solid ${C.border}`, borderRadius:8, padding:'6px 12px', cursor:'pointer' }}>× Hapus Filter</button>}
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:C.ice }}>
              {['Siswa','Target',isTKA?'TKA Terakhir':isSKD?'SKD Terakhir':'TO Terakhir',isSKD?'Nilai':'Skor','Ranking','Tren','Status','Aksi'].map(h=>(
                <th key={h} style={{ ...F, fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase' as const, letterSpacing:'0.07em', padding:'10px 14px', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((s,i)=>{
              const sc = STATUS_CFG[s.status] ?? STATUS_CFG.improvement
              const tc = TREN_CFG[s.tren]    ?? TREN_CFG.stabil
              return (
                <tr key={s.id} className="tr-hover" style={{ borderTop:i>0?'1px solid #F8FAFC':'none' }}>
                  <td style={{ padding:'11px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#00A3E0,#00B4D8)', display:'flex', alignItems:'center', justifyContent:'center', ...F, fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>
                        {s.nama.split(' ').map(w=>w[0]).slice(0,2).join('')}
                      </div>
                      <div style={{ ...F, fontSize:13, fontWeight:600, color:C.textMain }}>{s.nama}</div>
                    </div>
                  </td>
                  <td style={{ padding:'11px 14px', ...F, fontSize:12, color:C.textMid }}>{s.target}</td>
                  <td style={{ padding:'11px 14px', ...F, fontSize:12, color:C.textMid }}>{s.to}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ ...F, fontSize:16, fontWeight:800, color:isTKA?(s.skor>=80?C.green:s.skor>=70?C.sky:C.red):isSKD?(s.skor>=330?C.green:s.skor>=271?C.sky:C.red):(s.skor>=700?C.green:s.skor>=600?C.sky:C.red) }}>{s.skor}</span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ ...F, fontSize:12, fontWeight:700, background:s.ranking<=3?'rgba(255,183,0,.15)':C.ice, color:s.ranking<=3?'#B5780A':C.textMid, borderRadius:8, padding:'3px 10px' }}>
                      {s.ranking<=3?'🥇🥈🥉'[s.ranking-1]+' ':''} #{s.ranking}
                    </span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ ...F, fontSize:20, fontWeight:700, color:tc.color }}>{tc.icon}</span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ display:'inline-block', background:sc.bg, color:sc.color, borderRadius:20, padding:'3px 12px', fontSize:11, fontWeight:600, ...F, whiteSpace:'nowrap' }}>{sc.label}</span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <button onClick={()=>setDetailStudent(s)}
                      style={{ ...F, fontSize:11, fontWeight:700, background:'linear-gradient(135deg,#0965fa,#00b2dd)', color:'white', border:'none', borderRadius:8, padding:'7px 16px', cursor:'pointer', boxShadow:'0 2px 8px rgba(9,101,250,.3)' }}>
                      Detail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ padding:'10px 16px', borderTop:`1px solid ${C.border}`, ...F, fontSize:11, color:C.textMuted }}>
          Menampilkan {displayedStudents.length} dari {activeStudents.length} siswa
        </div>
      </div>

      </div>{/* end loading wrapper */}
    </div>
  )
}

// ─── STUDENT TRYOUT DETAIL ────────────────────────────────────────────────────
function StudentTryoutDetail({
  student,
  toCategory,
  onBack,
}: {
  student: TryoutStudent
  toCategory: "TKA" | "UTBK" | "SKD"
  onBack: () => void
}) {
  const [selectedTO, setSelectedTO] = useState<number | null>(null)
  const F = { fontFamily: "'Poppins',sans-serif" } as const
  const isTKA = toCategory === "TKA"
  const isSKD = toCategory === "SKD"

  const sc = STATUS_CFG[student.status] ?? STATUS_CFG.improvement
  const tc = TREN_CFG[student.tren] ?? TREN_CFG.stabil

  const DATES_UTBK = [
    "5 Jan",
    "2 Feb",
    "2 Mar",
    "6 Apr",
    "4 Mei",
    "1 Jun",
    "6 Jul",
    "20 Jul",
  ]
  const DATES_TKA = [
    "10 Jan",
    "7 Feb",
    "7 Mar",
    "4 Apr",
    "9 Mei",
    "6 Jun",
    "11 Jul",
    "18 Jul",
  ]
  const DATES_SKD = [
    "8 Jan",
    "5 Feb",
    "5 Mar",
    "2 Apr",
    "7 Mei",
    "4 Jun",
    "9 Jul",
    "22 Jul",
  ]
  const activeDates = isTKA ? DATES_TKA : isSKD ? DATES_SKD : DATES_UTBK

  const historyData = student.history.map((v, i) => ({
    to: isTKA ? `TKA ${i + 1}` : isSKD ? `SKD ${i + 1}` : `TO${i + 1}`,
    skor: v,
  }))

  const UTBK_SUBTESTS = [
    "Penalaran Umum",
    "Pengetahuan Kuantitatif",
    "Literasi Bahasa Indonesia",
    "Literasi Bahasa Inggris",
  ]
  const TKA_SUBTESTS = [
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Matematika",
    "Mapel Pilihan",
  ]
  const SKD_SUBTESTS = ["TWK", "TIU", "TKP"]
  const subtests = isTKA ? TKA_SUBTESTS : isSKD ? SKD_SUBTESTS : UTBK_SUBTESTS

  // for SKD, full values differ per subtest; others all 100
  const SKD_MAXES = [150, 175, 225]

  const classAvgActive = isTKA
    ? TKA_SUBTEST_AVG.map((d) => d.avg)
    : isSKD
      ? SKD_SUBTEST_AVG.map((d) => d.avg)
      : SUBTEST_AVG.map((d) => d.avg)

  const toRows = student.history
    .map((skor, i) => ({
      idx: i,
      label: isTKA
        ? `TKA #${i + 1}`
        : isSKD
          ? `SKD #${i + 1}`
          : `TO SNBT #${i + 1}`,
      date: activeDates[i] ?? "-",
      year: "2026",
      skor,
      ranking: Math.max(
        1,
        student.ranking + (student.history.length - 1 - i) * 2,
      ),
      status: isTKA
        ? skor >= 85
          ? "excellent"
          : skor >= 75
            ? "good"
            : skor >= 65
              ? "improvement"
              : "perhatian"
        : isSKD
          ? skor >= 330
            ? "excellent"
            : skor >= 271
              ? "good"
              : skor >= 250
                ? "improvement"
                : "perhatian"
          : skor >= 700
            ? "excellent"
            : skor >= 600
              ? "good"
              : skor >= 500
                ? "improvement"
                : "perhatian",
    }))
    .reverse()

  const skorColor = (s: number) =>
    isTKA
      ? s >= 85
        ? C.green
        : s >= 70
          ? C.sky
          : C.red
      : isSKD
        ? s >= 330
          ? C.green
          : s >= 271
            ? C.sky
            : C.red
        : s >= 700
          ? C.green
          : s >= 600
            ? C.sky
            : C.red

  // ── Detail sub-page ──────────────────────────────────────────────────────────
  if (selectedTO !== null) {
    const toIdx = selectedTO
    const toSkor = student.history[toIdx] ?? student.skor
    const toSubScores =
      student.subTO[Math.min(toIdx, student.subTO.length - 1)] ??
      student.subTO[student.subTO.length - 1]
    const weakestIdx = toSubScores.indexOf(Math.min(...toSubScores))
    const strongestIdx = toSubScores.indexOf(Math.max(...toSubScores))
    const toRanking = Math.max(
      1,
      student.ranking + (student.history.length - 1 - toIdx) * 2,
    )

    // Chance jurusan / instansi
    const skdBase = Math.min(92, Math.round((toSkor / 400) * 100))
    const chanceJurusan = isTKA
      ? [
          {
            jur: "Teknik Informatika UI",
            univ: "Universitas Indonesia",
            pct: Math.min(96, Math.round(toSkor * 1.05)),
          },
          {
            jur: "Sistem Informasi UGM",
            univ: "Universitas Gadjah Mada",
            pct: Math.min(93, Math.round(toSkor * 1.0)),
          },
          {
            jur: "Informatika ITS",
            univ: "Institut Teknologi Sepuluh Nopember",
            pct: Math.min(90, Math.round(toSkor * 0.96)),
          },
        ]
      : isSKD
        ? [
            {
              jur: "Kementerian Keuangan",
              univ: "Formasi Staf Pengelola Keuangan",
              pct: Math.min(95, skdBase + 9),
            },
            {
              jur: "Badan Pusat Statistik",
              univ: "Formasi Statistisi Ahli Pertama",
              pct: Math.min(91, skdBase + 5),
            },
            {
              jur: "Pemprov Jawa Barat",
              univ: "Formasi Analis Kebijakan",
              pct: Math.min(87, skdBase + 1),
            },
          ]
        : [
            {
              jur: "Teknik Informatika UI",
              univ: "Universitas Indonesia",
              pct: 89,
            },
            {
              jur: "Sistem Informasi UGM",
              univ: "Universitas Gadjah Mada",
              pct: 84,
            },
            {
              jur: "Teknik Elektro ITS",
              univ: "Institut Teknologi Sepuluh Nopember",
              pct: 80,
            },
          ]

    const sessionLabel = isTKA
      ? `TKA #${toIdx + 1}`
      : isSKD
        ? `SKD #${toIdx + 1}`
        : `TO SNBT #${toIdx + 1}`
    const prevLabel = isTKA
      ? "TKA sebelumnya"
      : isSKD
        ? "SKD sebelumnya"
        : "TO sebelumnya"

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BtnGhost label="← Kembali" onClick={() => setSelectedTO(null)} />
          <span style={{ ...F, fontSize: 13, color: C.textMuted }}>
            {isTKA ? "Detail TKA" : isSKD ? "Detail SKD" : "Detail Tryout"}
          </span>
        </div>

        {/* Header card */}
        <div
          style={{
            borderRadius: 20,
            background: "linear-gradient(135deg,#0F1E36,#1E3A5F)",
            padding: "24px 28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {[160, 260, 380].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                right: -r / 2 + 80,
                top: "50%",
                transform: "translateY(-50%)",
                width: r,
                height: r,
                borderRadius: "50%",
                border: "1px solid rgba(0,163,224,.07)",
                pointerEvents: "none",
              }}
            />
          ))}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    ...F,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,.4)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  {isTKA ? "Hasil TKA" : isSKD ? "Hasil SKD" : "Hasil Tryout"}
                </div>
                <div
                  style={{
                    ...F,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {sessionLabel}
                </div>
                <div
                  style={{
                    ...F,
                    fontSize: 12,
                    color: "rgba(255,255,255,.5)",
                    marginTop: 4,
                  }}
                >
                  {activeDates[toIdx] ?? "-"} 2026 · {student.nama}
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  ...F,
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.green,
                  background: "rgba(0,196,106,.15)",
                  borderRadius: 20,
                  padding: "5px 14px",
                }}
              >
                ✓ Selesai
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 0,
                marginTop: 20,
                background: "rgba(255,255,255,.06)",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              {[
                {
                  label: isTKA
                    ? "Nilai Total"
                    : isSKD
                      ? "Nilai Total"
                      : "Skor Total",
                  val: String(toSkor),
                  clr: skorColor(toSkor),
                },
                { label: "Ranking", val: `#${toRanking}`, clr: "white" },
                {
                  label: "Persentil",
                  val: `${Math.min(99, Math.round((1 - toRanking / 36) * 100))}%`,
                  clr: C.cyan,
                },
                {
                  label: "Durasi",
                  val: isTKA ? "90 mnt" : isSKD ? "100 mnt" : "120 mnt",
                  clr: "rgba(255,255,255,.7)",
                },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    textAlign: "center",
                    borderLeft:
                      i > 0 ? "1px solid rgba(255,255,255,.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      ...F,
                      fontSize: 22,
                      fontWeight: 800,
                      color: s.clr,
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      ...F,
                      fontSize: 10,
                      color: "rgba(255,255,255,.4)",
                      marginTop: 5,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtest Breakdown */}
        <div>
          <SectionHead
            title="Nilai Per Subtest"
            sub="Perbandingan nilai dengan rata-rata kelas"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${subtests.length},1fr)`,
              gap: 12,
            }}
          >
            {subtests.map((sub, si) => {
              const score = toSubScores[si] ?? 0
              const avg = classAvgActive[si] ?? 0
              const maxVal = isSKD ? SKD_MAXES[si] : 100
              const diff = score - avg
              const pct = Math.round((score / maxVal) * 100)
              const clr = pct >= 70 ? C.green : pct >= 55 ? C.orange : C.red
              const prevArr =
                student.subTO[Math.max(0, toIdx - 1)] ?? student.subTO[0]
              const prevScore = si < prevArr.length ? prevArr[si] : score
              const prog = score - prevScore
              return (
                <div
                  key={sub}
                  className="card"
                  style={{ padding: "18px 20px" }}
                >
                  <div
                    style={{
                      ...F,
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.textMuted,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    {sub}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                      lineHeight: 1,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        ...F,
                        fontSize: 32,
                        fontWeight: 800,
                        color: clr,
                      }}
                    >
                      {score}
                    </span>
                    {isSKD && (
                      <span
                        style={{
                          ...F,
                          fontSize: 13,
                          color: C.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        /{maxVal}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ ...F, fontSize: 11, color: C.textMuted }}>
                      Rata-rata:{" "}
                      <strong style={{ color: C.textMid }}>{avg}</strong>
                    </span>
                    <span
                      style={{
                        ...F,
                        fontSize: 11,
                        fontWeight: 700,
                        color: diff >= 0 ? C.green : C.red,
                      }}
                    >
                      {diff >= 0 ? "+" : ""}
                      {diff}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      ...F,
                      fontSize: 11,
                      color: prog >= 0 ? C.green : C.red,
                      fontWeight: 600,
                    }}
                  >
                    {prog >= 0 ? "▲" : "▼"} {Math.abs(prog)} vs {prevLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chance & Focus */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {/* Chance Jurusan */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div
                  style={{
                    ...F,
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.textMain,
                  }}
                >
                  Orbita AI
                </div>
                <div style={{ ...F, fontSize: 11, color: C.textMuted }}>
                  Berdasarkan hasil {isTKA ? "TKA" : isSKD ? "SKD" : "tryout"}{" "}
                  ini
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chanceJurusan.map((j, i) => {
                const clr =
                  j.pct >= 88 ? C.green : j.pct >= 82 ? C.sky : C.orange
                return (
                  <div
                    key={j.jur}
                    style={{
                      padding: "12px 14px",
                      background: i === 0 ? "rgba(9,101,250,.05)" : C.ice,
                      border:
                        i === 0 ? "1px solid rgba(9,101,250,.18)" : "none",
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            ...F,
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.textMain,
                          }}
                        >
                          {j.jur}
                        </div>
                        <div
                          style={{
                            ...F,
                            fontSize: 11,
                            color: C.textMuted,
                            marginTop: 1,
                          }}
                        >
                          {j.univ}
                          {isSKD && (
                            <span
                              style={{
                                marginLeft: 5,
                                ...F,
                                fontSize: 10,
                                background: "rgba(9,101,250,.1)",
                                color: C.sky,
                                borderRadius: 6,
                                padding: "1px 6px",
                                fontWeight: 600,
                              }}
                            >
                              CPNS
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        style={{
                          ...F,
                          fontSize: 16,
                          fontWeight: 800,
                          color: clr,
                        }}
                      >
                        {j.pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "#E2E8F0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${j.pct}%`,
                          borderRadius: 3,
                          background: `linear-gradient(90deg,${clr},${clr}99)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Focus Recommendation */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <SectionHead title="Subtes yang Harus Difokuskan" sub="Orbita AI" />
            <div
              style={{
                background: "rgba(255,77,77,.05)",
                border: "1px solid rgba(255,77,77,.18)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  ...F,
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.red,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                  marginBottom: 5,
                }}
              >
                🚨 Prioritas Utama
              </div>
              <div
                style={{
                  ...F,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.textMain,
                }}
              >
                {subtests[weakestIdx]}
              </div>
              <div
                style={{
                  ...F,
                  fontSize: 12,
                  color: C.textMid,
                  marginTop: 4,
                  lineHeight: 1.55,
                }}
              >
                Nilai masih berada{" "}
                <strong style={{ color: C.red }}>
                  {Math.abs(
                    toSubScores[weakestIdx] - classAvgActive[weakestIdx],
                  )}{" "}
                  poin
                </strong>{" "}
                di bawah rata-rata kelas. Fokus penguatan sebelum sesi
                berikutnya.
              </div>
            </div>
            <div
              style={{
                ...F,
                fontSize: 11,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase" as const,
                letterSpacing: "0.07em",
                marginBottom: 10,
              }}
            >
              Rekomendasi
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(isSKD
                ? weakestIdx === 0
                  ? [
                      "Pelajari Pancasila, UUD 1945, dan sejarah perjuangan nasional secara mendalam",
                      "Kerjakan 20–30 soal TWK per hari dan pelajari peraturan perundang-undangan",
                      `Target naik ${Math.min(toSubScores[0] + 12, 150)} pada SKD berikutnya`,
                    ]
                  : weakestIdx === 1
                    ? [
                        "Latihan soal numerik, verbal, dan penalaran logis setiap hari",
                        "Kerjakan 30 soal TIU dari berbagai tipe (analogi, deret, aritmetika)",
                        `Target naik ${Math.min(toSubScores[1] + 15, 175)} pada SKD berikutnya`,
                      ]
                    : [
                        "Pelajari pola soal TKP dan karakteristik jawaban bernilai tinggi",
                        "Simulasikan situasi kerja dan pilih respons paling profesional & etis",
                        `Target naik ${Math.min(toSubScores[2] + 18, 225)} pada SKD berikutnya`,
                      ]
                : [
                    `Kerjakan 20–30 soal ${subtests[weakestIdx]} per hari`,
                    `Target naik ${Math.min(toSubScores[weakestIdx] + (isTKA ? 8 : 8), 100)} pada ${
                      isTKA ? "TKA" : "TO"
                    } berikutnya`,
                    "Pelajari kembali materi dan pola soal terkait",
                  ]
              ).map((r, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: "linear-gradient(135deg,#FF8C00,#FFB700)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      ...F,
                      fontSize: 11,
                      color: "white",
                      fontWeight: 700,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      ...F,
                      fontSize: 12,
                      color: C.textMid,
                      lineHeight: 1.55,
                    }}
                  >
                    {r}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(9,101,250,.06),rgba(0,178,221,.04))",
            border: "1px solid rgba(9,101,250,.16)",
            borderRadius: 16,
            padding: "22px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 20,
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...F,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.textMain,
                  marginBottom: 4,
                }}
              >
                Orbita AI
              </div>
              <div
                style={{
                  ...F,
                  fontSize: 11,
                  color: C.textMuted,
                  marginBottom: 12,
                }}
              >
                Analisis otomatis berdasarkan performa{" "}
                {isTKA ? "TKA" : isSKD ? "SKD" : "tryout"} ini
              </div>
              <p
                style={{
                  ...F,
                  fontSize: 13,
                  color: C.textMid,
                  lineHeight: 1.75,
                  margin: "0 0 16px",
                }}
              >
                Performa{" "}
                <strong style={{ color: C.textMain }}>
                  {student.nama.split(" ")[0]}
                </strong>{" "}
                pada {sessionLabel} menunjukkan hasil yang{" "}
                {isSKD
                  ? toSkor >= 330
                    ? "sangat baik"
                    : toSkor >= 271
                      ? "cukup baik"
                      : "perlu ditingkatkan"
                  : (isTKA ? toSkor >= 85 : toSkor >= 700)
                    ? "sangat baik"
                    : (isTKA ? toSkor >= 70 : toSkor >= 600)
                      ? "cukup baik"
                      : "perlu ditingkatkan"}{" "}
                dengan nilai{" "}
                <strong style={{ color: skorColor(toSkor) }}>{toSkor}</strong>.{" "}
                <strong style={{ color: C.green }}>
                  {subtests[strongestIdx]}
                </strong>{" "}
                menjadi kekuatan utama, sementara{" "}
                <strong style={{ color: C.red }}>{subtests[weakestIdx]}</strong>{" "}
                masih menjadi fokus untuk{" "}
                {isSKD
                  ? "lolos seleksi ke instansi tujuan"
                  : "mencapai target di"}{" "}
                <strong>{student.target}</strong>.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    l: "Kekuatan",
                    v: subtests[strongestIdx],
                    clr: C.green,
                    bg: "rgba(0,196,106,.06)",
                    br: "rgba(0,196,106,.2)",
                  },
                  {
                    l: "Fokus",
                    v: subtests[weakestIdx],
                    clr: C.red,
                    bg: "rgba(255,77,77,.06)",
                    br: "rgba(255,77,77,.2)",
                  },
                  {
                    l: `Target ${
                      isTKA ? "TKA" : isSKD ? "SKD" : "TO"
                    } Berikutnya`,
                    v: String(
                      Math.min(
                        toSkor + (isSKD ? 15 : isTKA ? 8 : 25),
                        isSKD ? 550 : isTKA ? 100 : 800,
                      ),
                    ),
                    clr: C.sky,
                    bg: "rgba(9,101,250,.06)",
                    br: "rgba(9,101,250,.2)",
                  },
                ].map((g) => (
                  <div
                    key={g.l}
                    style={{
                      background: g.bg,
                      border: `1px solid ${g.br}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        ...F,
                        fontSize: 10,
                        fontWeight: 700,
                        color: g.clr,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      {g.l}
                    </div>
                    <div
                      style={{
                        ...F,
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.textMain,
                      }}
                    >
                      {g.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main StudentTryoutDetail view ──────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Back */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <BtnGhost label="← Kembali" onClick={onBack} />
        <div>
          <div
            style={{ ...F, fontWeight: 700, fontSize: 17, color: C.textMain }}
          >
            {isTKA
              ? "Detail Monitoring Siswa (TKA)"
              : isSKD
                ? "Detail Monitoring Siswa (SKD)"
                : "Detail Monitoring Siswa"}
          </div>
          <div
            style={{ ...F, fontSize: 13, color: C.orange, fontStyle: "italic" }}
          >
            {isTKA
              ? "Riwayat & analisis per sesi TKA"
              : isSKD
                ? "Riwayat & analisis per sesi SKD"
                : "Riwayat & analisis per sesi tryout"}
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div
        style={{
          borderRadius: 20,
          background: "linear-gradient(135deg,#0F1E36,#1E3A5F)",
          padding: "24px 30px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(15,30,54,.2)",
        }}
      >
        {[180, 300, 440].map((r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              right: -r / 2 + 80,
              top: "50%",
              transform: "translateY(-50%)",
              width: r,
              height: r,
              borderRadius: "50%",
              border: "1px solid rgba(0,163,224,.07)",
              pointerEvents: "none",
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FF8C00,#FFB700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...F,
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              border: "3px solid rgba(255,255,255,.15)",
            }}
          >
            {student.nama
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ ...F, fontWeight: 800, fontSize: 22, color: "white" }}
            >
              {student.nama}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              <Chip label={student.kelas} color={C.sky} />
              <Chip
                label={isSKD ? `🏛️ ${student.target}` : `🎯 ${student.target}`}
                color={C.yellow}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 0,
              background: "rgba(255,255,255,.06)",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.08)",
              flexShrink: 0,
            }}
          >
            {[
              {
                l: isTKA
                  ? "Nilai TKA Terakhir"
                  : isSKD
                    ? "Nilai SKD Terakhir"
                    : "Skor Terakhir",
                v: String(student.skor),
                c: skorColor(student.skor),
              },
              { l: "Ranking", v: `#${student.ranking}`, c: "white" },
              { l: "Tren", v: tc.icon, c: tc.color },
            ].map((k, i) => (
              <div
                key={k.l}
                style={{
                  padding: "14px 20px",
                  textAlign: "center",
                  borderLeft:
                    i > 0 ? "1px solid rgba(255,255,255,.08)" : "none",
                }}
              >
                <div
                  style={{
                    ...F,
                    fontSize: 24,
                    fontWeight: 800,
                    color: k.c,
                    lineHeight: 1,
                  }}
                >
                  {k.v}
                </div>
                <div
                  style={{
                    ...F,
                    fontSize: 10,
                    color: "rgba(255,255,255,.4)",
                    marginTop: 5,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                  }}
                >
                  {k.l}
                </div>
              </div>
            ))}
            <div
              style={{
                padding: "14px 20px",
                textAlign: "center",
                borderLeft: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: sc.bg,
                  color: sc.color,
                  borderRadius: 20,
                  padding: "4px 12px",
                  ...F,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {sc.label}
              </span>
              <div
                style={{
                  ...F,
                  fontSize: 10,
                  color: "rgba(255,255,255,.4)",
                  marginTop: 8,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.06em",
                }}
              >
                Status
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat chart */}
      <div className="card" style={{ padding: "22px 24px" }}>
        <SectionHead
          title={
            isTKA ? "Riwayat TKA" : isSKD ? "Riwayat SKD" : "Riwayat Tryout"
          }
          sub={`Perkembangan nilai dari ${
            isTKA ? "TKA 1" : isSKD ? "SKD 1" : "TO1"
          } sampai ${
            isTKA ? "TKA " : isSKD ? "SKD " : "TO"
          }${student.history.length}`}
        />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={historyData}
            margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F5F9"
              vertical={false}
            />
            <XAxis
              dataKey="to"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: C.textMuted, fontFamily: "Poppins" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: C.textMuted, fontFamily: "Poppins" }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: C.navy,
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 12,
                fontFamily: "Poppins",
              }}
              formatter={(v) => [v, isTKA || isSKD ? "Nilai" : "Skor"]}
            />
            <Line
              type="monotone"
              dataKey="skor"
              stroke={C.sky}
              strokeWidth={2.5}
              dot={{ fill: C.sky, r: 5, strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TKA / UTBK session list */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{ ...F, fontWeight: 700, fontSize: 15, color: C.textMain }}
          >
            {isTKA
              ? "Daftar TKA yang Telah Dikerjakan"
              : isSKD
                ? "Daftar SKD yang Telah Dikerjakan"
                : "Daftar Tryout yang Telah Dikerjakan"}
          </div>
          <div
            style={{
              ...F,
              fontSize: 13,
              color: C.orange,
              marginTop: 2,
              fontStyle: "italic",
            }}
          >
            Klik "Lihat Detail" untuk melihat hasil lengkap
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.ice }}>
              {[
                isTKA ? "TKA" : isSKD ? "SKD" : "Tryout",
                "Tanggal",
                isTKA || isSKD ? "Nilai" : "Skor",
                "Ranking",
                "Status",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    ...F,
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.07em",
                    padding: "10px 16px",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {toRows.map((row, i) => {
              const rsc = STATUS_CFG[row.status] ?? STATUS_CFG.improvement
              return (
                <tr
                  key={row.idx}
                  className="tr-hover"
                  style={{ borderTop: i > 0 ? `1px solid #F8FAFC` : "none" }}
                >
                  <td
                    style={{
                      padding: "11px 16px",
                      ...F,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textMain,
                    }}
                  >
                    {row.label}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      ...F,
                      fontSize: 12,
                      color: C.textMid,
                    }}
                  >
                    {row.date} {row.year}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span
                      style={{
                        ...F,
                        fontSize: 15,
                        fontWeight: 800,
                        color: skorColor(row.skor),
                      }}
                    >
                      {row.skor}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span
                      style={{
                        ...F,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          row.ranking <= 3 ? "rgba(255,183,0,.15)" : C.ice,
                        color: row.ranking <= 3 ? "#B5780A" : C.textMid,
                        borderRadius: 8,
                        padding: "3px 10px",
                      }}
                    >
                      #{row.ranking}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: rsc.bg,
                        color: rsc.color,
                        borderRadius: 20,
                        padding: "3px 12px",
                        fontSize: 11,
                        fontWeight: 600,
                        ...F,
                      }}
                    >
                      {rsc.label}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <button
                      onClick={() => setSelectedTO(row.idx)}
                      style={{
                        ...F,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "linear-gradient(135deg,#0965fa,#00b2dd)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 16px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(9,101,250,.3)",
                      }}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Orbital ring background (SVG, no CSS url() references) ──────────────────
function OrbitalBg() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "70vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "visible",
      }}
      viewBox="0 0 700 800"
      fill="none"
    >
      {[120, 220, 340, 480, 640].map((r, i) => (
        <circle
          key={r}
          cx="560"
          cy="400"
          r={r}
          stroke="#00B4D8"
          strokeWidth="1"
          opacity={0.06 - i * 0.008}
        />
      ))}
    </svg>
  )
}

// ─── App shell ────────────────────────────────────────────────────────────────
type DeepLink = { studentId: number tab: MainTab } | null

export default function App() {
  const [page, setPage] = useState<Page>("beranda")
  const [deepLink, setDeepLink] = useState<DeepLink>(null)
  const [role, setRole] = useState<Role>('wali')

  const goToStudent = (studentId: number, tab: MainTab) => {
    setDeepLink({ studentId, tab })
    setPage("data")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Poppins',sans-serif",
        background: "#F8FAFC",
        position: "relative",
      }}
    >
      <OrbitalBg />
      <div style={{ display:"flex", flexDirection:"column", flex:1, position:"relative", zIndex:1 }}>
        <TopNav page={page} setPage={setPage} role={role} setRole={setRole} />
        <main style={{ flex:1, padding:"28px 32px", overflowY:"auto" }}>
          {page === "beranda" && role === 'wali' && (
            <Beranda setPage={setPage} goToStudent={goToStudent} />
          )}
          {page === "beranda" && role === 'bk' && (
            <BerandaBK goToStudent={goToStudent} />
          )}
          {page === "data" && (
            <PusatData
              deepLink={deepLink}
              clearDeepLink={() => setDeepLink(null)}
              role={role}
            />
          )}

          {page === "tryout" && <MonitoringTryout />}
        </main>
      </div>
    </div>
  )
}

// ─── ORBITA Logo SVG ──────────────────────────────────────────────────────────
function OrbLogo() {
  return (
    <div style={{ width: 42, height: 42, position: "relative", flexShrink: 0 }}>
      {/* Orbital ring bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#00A3E0,#00B4D8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Astronaut body */}
          <ellipse cx="12" cy="14" rx="5" ry="5.5" fill="white" opacity=".95" />
          {/* Helmet */}
          <circle cx="12" cy="9" r="5" fill="white" />
          <circle cx="12" cy="9" r="4" fill="#006FA8" />
          {/* Visor shine */}
          <ellipse
            cx="10.5"
            cy="7.5"
            rx="1.5"
            ry="1"
            fill="rgba(255,255,255,.45)"
            transform="rotate(-15 10.5 7.5)"
          />
          {/* Eyes */}
          <circle cx="10.5" cy="9" r="0.8" fill="white" />
          <circle cx="13.5" cy="9" r="0.8" fill="white" />
          <circle cx="10.7" cy="9.2" r="0.45" fill="#0F1E36" />
          <circle cx="13.7" cy="9.2" r="0.45" fill="#0F1E36" />
          {/* Smile */}
          <path
            d="M10.5 10.5 Q12 11.5 13.5 10.5"
            stroke="#0F1E36"
            strokeWidth=".7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arms */}
          <rect
            x="6.5"
            y="12"
            width="3"
            height="5"
            rx="1.5"
            fill="white"
            opacity=".9"
          />
          <rect
            x="14.5"
            y="12"
            width="3"
            height="5"
            rx="1.5"
            fill="white"
            opacity=".9"
          />
          {/* Legs */}
          <rect
            x="9"
            y="18.5"
            width="2.5"
            height="3"
            rx="1.25"
            fill="white"
            opacity=".85"
          />
          <rect
            x="12.5"
            y="18.5"
            width="2.5"
            height="3"
            rx="1.25"
            fill="white"
            opacity=".85"
          />
          {/* Graduation cap */}
          <rect x="8.5" y="4.5" width="7" height="1.2" rx=".6" fill="#FF8C00" />
          <rect
            x="11.2"
            y="3.2"
            width="1.6"
            height="1.5"
            rx=".3"
            fill="#FF8C00"
          />
          <circle cx="15" cy="4.5" r=".7" fill="#FFB700" />
        </svg>
      </div>
    </div>
  )
}
