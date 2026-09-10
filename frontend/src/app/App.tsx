import React, { useState, useRef, useEffect } from "react";
import {
  Bell, Search, ChevronDown, Camera, Save, CheckCircle2, AlertCircle,
  FileText, ExternalLink, Clock, ChevronRight, Check, Sparkles, Brain,
  ArrowLeft, Info, Zap, BookOpen, AlertTriangle, Plus, Trash2, Calendar, TrendingUp, TrendingDown, Download, Target, ChevronUp, Compass, User, Shield, MessageSquare,
  Eye, EyeOff, Loader2, X,
} from "lucide-react";
import NilaiRaporPage from "./RaporPage";
import OrbitaCompassPage from "./CompassPage";
import JurusanPage from "./JurusanPage";
import ActionPlanPage from "./ActionPlanPage";
import DashboardPage from "./DashboardPage";
import SiapPTNPage from "./SiapPTNPage";
import LatihanTKAPage from "./LatihanTKAPage";
import SiapSKDPage from "./SiapSKDPage";
import SiapMandiriPage from "./SiapMandiriPage";
import LandingPage from "./LandingPage";
import KonsulasiPage, { type Booking } from "./KonsulasiPage";
import { loginApi, getMeApi, setAuthToken, getAuthToken, removeAuthToken } from "../services/api";

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface OrbitaUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  kelas: string;
  role: string;
  avatarUrl?: string;
}

function mapUser(backendUser: any): OrbitaUser {
  const names = (backendUser.name || "").split(" ");
  const initials = names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : (names[0] || "U").slice(0, 2).toUpperCase();
  const profile = backendUser.profile;
  const kelas = profile
    ? `Kelas ${profile.grade || "XII"} ${profile.majorTrack || "IPA"}`
    : backendUser.role === "BK_TEACHER" ? "Guru BK" : "Administrator";
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    initials,
    kelas,
    role: backendUser.role,
    avatarUrl: backendUser.avatarUrl,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function LoginModal({ onSuccess, onClose }: { onSuccess: (user: OrbitaUser) => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setAuthToken(data.token);
      onSuccess(mapUser(data.user));
    } catch (err: any) {
      // Fallback demo mode jika backend offline
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        setAuthToken("mock_demo_token");
        onSuccess({
          id: "demo-1",
          email: email || "siswa@orbita.id",
          name: "Ahmad Rizki",
          initials: "AR",
          kelas: "Kelas XII IPA 1",
          role: "STUDENT",
        });
      } else {
        setError(err.message || "Email atau password salah.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" style={{ fontFamily: PP }}>
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)" }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors" style={{ outline: "none" }}>
            <X size={16} />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: PP }}>O</span>
          </div>
          <h2 className="text-xl font-bold text-white">Masuk ke ORBITA</h2>
          <p className="text-sm text-white/80 mt-1">Bangun masa depanmu, mulai bersama Orbita.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="siswa@orbita.id"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0965fa] transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0965fa] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                style={{ outline: "none" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-98 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #0965fa, #00b2dd)", outline: "none" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Masuk...
              </span>
            ) : "Masuk ke ORBITA"}
          </button>

          {/* Hint */}
          <p className="text-center text-xs text-slate-400">
            Demo: <span className="font-semibold text-slate-600">siswa@orbita.id</span> / <span className="font-semibold text-slate-600">password123</span>
          </p>
        </form>
      </div>
    </div>
  );
}

const PP = "Poppins, sans-serif";

const ICONS = {
  dashboard: "M10 6V0H18V6H10V6M0 10V0H8V10H0V10M10 18V8H18V18H10V18M0 18V12H8V18H0V18M2 8H6V2H2V8V8M12 16H16V10H12V16V16M12 4H16V2H12V4V4M2 16H6V14H2V16V16",
  profile: "M8.42105 16.8421C7.4386 16.8421 6.5 16.9956 5.60526 17.3026C4.71053 17.6096 3.89474 18.0702 3.15789 18.6842V18.6842C3.15789 18.7193 3.15789 18.7632 3.15789 18.8158C3.15789 18.8684 3.15789 18.9123 3.15789 18.9474H13.6842C13.6842 18.9123 13.6842 18.8684 13.6842 18.8158C13.6842 18.7632 13.6842 18.7193 13.6842 18.6842V18.6842C12.9474 18.0702 12.1316 17.6096 11.2368 17.3026C10.3421 16.9956 9.40351 16.8421 8.42105 16.8421V16.8421M8.42105 14.7368C9.63158 14.7368 10.7632 14.9211 11.8158 15.2895C12.8684 15.6579 13.8421 16.1754 14.7368 16.8421V2.10526H2.10526V16.8421C3 16.1754 3.97368 15.6579 5.02632 15.2895C6.07895 14.9211 7.21053 14.7368 8.42105 14.7368V14.7368M8.42105 10.5263C7.98246 10.5263 7.60965 10.3728 7.30263 10.0658C6.99561 9.75877 6.84211 9.38597 6.84211 8.94737C6.84211 8.50877 6.99561 8.13597 7.30263 7.82895C7.60965 7.52193 7.98246 7.36842 8.42105 7.36842C8.85965 7.36842 9.23246 7.52193 9.53947 7.82895C9.84649 8.13597 10 8.50877 10 8.94737C10 9.38597 9.84649 9.75877 9.53947 10.0658C9.23246 10.3728 8.85965 10.5263 8.42105 10.5263V10.5263M2.10526 21.0526C1.52632 21.0526 1.0307 20.8465 0.618421 20.4342C0.20614 20.0219 0 19.5263 0 18.9474V2.10526C0 1.52632 0.20614 1.0307 0.618421 0.618421C1.0307 0.20614 1.52632 0 2.10526 0H14.7368C15.3158 0 15.8114 0.20614 16.2237 0.618421C16.636 1.0307 16.8421 1.52632 16.8421 2.10526V18.9474C16.8421 19.5263 16.636 20.0219 16.2237 20.4342C15.8114 20.8465 15.3158 21.0526 14.7368 21.0526H2.10526V21.0526",
  snbp: "M1.625 13.025L0 11.85L5 3.85L8 7.35L12 0.85L15 5.35L18.375 0L20 1.175L15.05 9.025L12.075 4.55L8.275 10.725L5.25 7.2L1.625 13.025V13.025M13.5 17C14.2 17 14.7917 16.7583 15.275 16.275C15.7583 15.7917 16 15.2 16 14.5C16 13.8 15.7583 13.2083 15.275 12.725C14.7917 12.2417 14.2 12 13.5 12C12.8 12 12.2083 12.2417 11.725 12.725C11.2417 13.2083 11 13.8 11 14.5C11 15.2 11.2417 15.7917 11.725 16.275C12.2083 16.7583 12.8 17 13.5 17V17M18.6 21L15.9 18.3C15.55 18.5333 15.1708 18.7083 14.7625 18.825C14.3542 18.9417 13.9333 19 13.5 19C12.25 19 11.1875 18.5625 10.3125 17.6875C9.4375 16.8125 9 15.75 9 14.5C9 13.25 9.4375 12.1875 10.3125 11.3125C11.1875 10.4375 12.25 10 13.5 10C14.75 10 15.8125 10.4375 16.6875 11.3125C17.5625 12.1875 18 13.25 18 14.5C18 14.9333 17.9417 15.3542 17.825 15.7625C17.7083 16.1708 17.5333 16.55 17.3 16.9L20 19.6L18.6 21V21",
  utbk: "M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V9H16V8H2V18H9V20H2V20M2 6H16V4H2V6M11 20V16.925L16.525 11.425C16.675 11.275 16.8417 11.1667 17.025 11.1C17.2083 11.0333 17.3917 11 17.575 11C17.775 11 17.9667 11.0375 18.15 11.1125C18.3333 11.1875 18.5 11.3 18.65 11.45L19.575 12.375C19.7083 12.525 19.8125 12.6917 19.8875 12.875C19.9625 13.0583 20 13.2417 20 13.425C20 13.6083 19.9667 13.7958 19.9 13.9875C19.8333 14.1792 19.725 14.35 19.575 14.5L14.075 20H11V20",
  kampus: "M11 18L4 14.2V8.2L0 6L11 0L22 6V14H20V7.1L18 8.2V14.2L11 18V18M11 9.7L17.85 6L11 2.3L4.15 6L11 9.7V9.7M11 15.725L16 13.025V9.25L11 12L6 9.25V13.025L11 15.725V15.725",
  action: "M7.6 15.05L14.65 8L13.25 6.6L7.6 12.25L4.75 9.4L3.35 10.8L7.6 15.05V15.05M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2V20",
  settings: "M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3V20",
  compass: "M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12A6 6 0 0010 4zm0 10a4 4 0 110-8 4 4 0 010 8zm3.536-7.536L9.293 10.707a1 1 0 01-1.414-1.414l4.243-4.243a1 1 0 011.414 1.414z",
  konsultasi: "M2 0C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14L18 20V2C18 0.9 17.1 0 16 0H2ZM9 13H5V11H9V13ZM13 9H5V7H13V9ZM13 5H5V3H13V5Z",
  help: "M9.95 16C10.3 16 10.5958 15.8792 10.8375 15.6375C11.0792 15.3958 11.2 15.1 11.2 14.75C11.2 14.4 11.0792 14.1042 10.8375 13.8625C10.5958 13.6208 10.3 13.5 9.95 13.5C9.6 13.5 9.30417 13.6208 9.0625 13.8625C8.82083 14.1042 8.7 14.4 8.7 14.75C8.7 15.1 8.82083 15.3958 9.0625 15.6375C9.30417 15.8792 9.6 16 9.95 16V16M9.05 12.15H10.9C10.9 11.6 10.9625 11.1667 11.0875 10.85C11.2125 10.5333 11.5667 10.1 12.15 9.55C12.5833 9.11667 12.925 8.70417 13.175 8.3125C13.425 7.92083 13.55 7.45 13.55 6.9C13.55 5.96667 13.2083 5.25 12.525 4.75C11.8417 4.25 11.0333 4 10.1 4C9.15 4 8.37917 4.25 7.7875 4.75C7.19583 5.25 6.78333 5.85 6.55 6.55L8.2 7.2C8.28333 6.9 8.47083 6.575 8.7625 6.225C9.05417 5.875 9.5 5.7 10.1 5.7C10.6333 5.7 11.0333 5.84583 11.3 6.1375C11.5667 6.42917 11.7 6.75 11.7 7.1C11.7 7.43333 11.6 7.74583 11.4 8.0375C11.2 8.32917 10.95 8.6 10.65 8.85C9.91667 9.5 9.46667 9.99167 9.3 10.325C9.13333 10.6583 9.05 11.2667 9.05 12.15V12.15M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20V20M10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18V18",
};

type ActivePage = "landing" | "dashboard" | "profil" | "snbp" | "utbk" | "kampus" | "action" | "compass" | "ptn" | "konsultasi" | "skd" | "tka" | "mandiri";
type ProfileTab = "minat-bakat" | "prestasi" | "nilai-rapor";
type InfoPribadiTab = "data-diri" | "prestasi" | "nilai-rapor";
type MinatSubTab = "tes" | "refleksi";
type RefleksiView = "form" | "analyzing" | "results";
type ResultTab = "refleksi" | "gabungan";
type ConfidenceState = "high" | "medium" | "low";

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════════════════
function OrbLogo() {
  return (
    <div className="flex items-center gap-1">
      <div className="relative w-9 h-9 shrink-0">
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
          <rect x="2" y="2" width="32" height="32" rx="8" fill="url(#lg)" opacity="0.15" />
          <path d="M18 6C11.373 6 6 11.373 6 18s5.373 12 12 12 12-5.373 12-12S24.627 6 18 6zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="url(#lg)" />
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0965fa" /><stop offset="1" stopColor="#00b2dd" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-[28px] font-bold leading-none" style={{ fontFamily: PP }}>
        <span className="bg-gradient-to-r from-[#0965fa] to-[#00b2dd] bg-clip-text text-transparent">ORB</span>
        <span className="bg-gradient-to-r from-[#ff7000] to-[#f1ad00] bg-clip-text text-transparent">ITA</span>
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOP NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════
function TopNav({
  activePage,
  setActivePage,
  onProfileClick,
  onProfileTabClick,
  currentUser,
  onLogout,
}: {
  activePage: ActivePage;
  setActivePage: (p: ActivePage) => void;
  onProfileClick?: () => void;
  onProfileTabClick?: (tab: string) => void;
  currentUser?: OrbitaUser | null;
  onLogout?: () => void;
}) {
  const [tryoutOpen, setTryoutOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  const tryoutPages: ActivePage[] = ["snbp", "tka", "utbk", "skd", "mandiri", "ptn"];
  const tryoutActive = tryoutPages.includes(activePage);

  const notifs = [
    { title: "Streak 9 Hari Tercapai! 🔥", time: "2 jam yang lalu", desc: "Kamu mempertahankan ritme belajar 9 hari berturut-turut." },
    { title: "Hasil Tryout #4 Selesai 📊", time: "Kemarin, 14:30", desc: "Skor akhirmu 624 (Top 28% peserta nasional)." },
    { title: "Sesi BK Terjadwal 💬", time: "18 Juli, 10:00", desc: "Jadwal konsultasi jurusan bersama Guru BK telah dikonfirmasi." },
  ];

  function closeAll() {
    setTryoutOpen(false);
    setNotifOpen(false);
    setProfileMenuOpen(false);
  }

  function navigate(p: ActivePage) {
    closeAll();
    setActivePage(p);
  }

  return (
    <header className="bg-white border-b border-slate-100 shrink-0 sticky top-0 z-40"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.04)" }}>

      {/* ── Row 1: brand + user ── */}
      <div className="px-6 md:px-10 py-3 flex items-center justify-between border-b border-slate-100/70">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <OrbLogo />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <p className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase hidden sm:block" style={{ fontFamily: PP }}>
            Student Portal
          </p>
        </div>

        {/* Right: notif + profile */}
        <div className="flex items-center gap-2 relative">

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(v => !v); setProfileMenuOpen(false); }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              style={{ outline: "none" }}
            >
              <Bell size={17} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff7000] ring-2 ring-white" />
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-[#0965fa]" />
                      <p className="text-sm font-bold text-slate-900" style={{ fontFamily: PP }}>Notifikasi</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0965fa]">3 Baru</span>
                  </div>
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                    {notifs.map((n, i) => (
                      <div key={i} className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-900" style={{ fontFamily: PP }}>{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={closeAll} className="w-full mt-3 py-2 text-center text-xs font-bold text-[#0965fa] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors" style={{ fontFamily: PP, outline: "none" }}>
                    Tandai Semua Dibaca
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileMenuOpen(v => !v); setNotifOpen(false); }}
              className={`flex items-center gap-2.5 border rounded-xl px-3 py-1.5 transition-all ${profileMenuOpen ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" : "hover:bg-slate-50 border-slate-200"}`}
              style={{ outline: "none" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)", fontFamily: PP }}>
                {currentUser?.initials || "AR"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[12px] font-bold text-slate-900 leading-tight" style={{ fontFamily: PP }}>{currentUser?.name || "Ahmad Rizki"}</p>
                <p className="text-[10px] text-slate-500 font-medium" style={{ fontFamily: PP }}>{currentUser?.kelas || "Kelas XII IPA 1"}</p>
              </div>
              <ChevronDown size={13} className={`text-slate-400 transition-transform ${profileMenuOpen ? "rotate-180 text-[#0965fa]" : ""}`} />
            </button>
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="absolute right-0 top-12 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-50">
                  <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-[#0965fa] text-white font-bold text-xs flex items-center justify-center">
                        {currentUser?.initials || "AR"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight" style={{ fontFamily: PP }}>{currentUser?.name || "Ahmad Rizki"}</p>
                        <p className="text-[10px] text-slate-500">{currentUser?.email || "siswa@orbita.id"}</p>
                      </div>
                    </div>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● {currentUser?.role === "BK_TEACHER" ? "Guru BK" : currentUser?.role === "ADMIN" ? "Administrator" : "Siswa Aktif"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => { closeAll(); onProfileClick?.(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0965fa] transition-colors text-left" style={{ fontFamily: PP, outline: "none" }}>
                      <User size={14} className="text-slate-500" /><span>Informasi & Profil Siswa</span>
                    </button>
                    <button onClick={() => navigate("konsultasi")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0965fa] transition-colors text-left" style={{ fontFamily: PP, outline: "none" }}>
                      <MessageSquare size={14} className="text-slate-500" /><span>Konsultasi Guru BK</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button onClick={() => { closeAll(); onLogout ? onLogout() : setActivePage("landing"); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left" style={{ fontFamily: PP, outline: "none" }}>
                      <ArrowLeft size={14} className="text-rose-500" /><span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: navigation pills ── */}
      <div className="hidden md:flex items-center gap-1 px-6 md:px-10 py-2.5">

        {/* Dashboard */}
        <button
          onClick={() => navigate("dashboard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activePage === "dashboard" ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          style={{ fontFamily: PP, outline: "none" }}
        >
          <span>🏠</span> Dashboard
        </button>

        {/* Analisis Potensi (direct) */}
        <button
          onClick={() => navigate("profil")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activePage === "profil" ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          style={{ fontFamily: PP, outline: "none" }}
        >
          <span>🧠</span> Analisis Potensi
        </button>

        {/* Orbita Compass (direct) */}
        <button
          onClick={() => navigate("compass")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activePage === "compass" ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          style={{ fontFamily: PP, outline: "none" }}
        >
          <span>🧭</span> Orbita Compass
        </button>

        {/* Action Plan */}
        <button
          onClick={() => navigate("action")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activePage === "action" ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          style={{ fontFamily: PP, outline: "none" }}
        >
          <span>🎯</span> Action Plan
        </button>

        {/* Tryout dropdown */}
        <div className="relative">
          <button
            onClick={() => { setTryoutOpen(v => !v); setNotifOpen(false); setProfileMenuOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${tryoutActive ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : tryoutOpen ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            style={{ fontFamily: PP, outline: "none" }}
          >
            <span>🎓</span> Tryout
            <ChevronDown size={13} className={`transition-transform ${tryoutOpen ? "rotate-180" : ""}`} />
          </button>
          {tryoutOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute top-11 left-0 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-50">
                {[
                  { page: "snbp" as ActivePage, icon: "📚", label: "Siap SNBP", sub: "Cek peluang & strategi SNBP" },
                  { page: "tka" as ActivePage, icon: "🎯", label: "Siap TKA", sub: "Latihan soal TKA kamu" },
                  { page: "utbk" as ActivePage, icon: "📝", label: "Siap UTBK", sub: "Gas latihan & ukur skor" },
                  { page: "skd" as ActivePage, icon: "🏛️", label: "Siap SKD", sub: "Latihan soal kedinasan" },
                  { page: "mandiri" as ActivePage, icon: "🚀", label: "Siap Mandiri", sub: "Persiapan ujian kampus" },
                ].map(item => (
                  <button key={item.page} onClick={() => navigate(item.page)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${activePage === item.page ? "bg-blue-50 text-[#0965fa]" : "hover:bg-slate-50 text-slate-700"}`}
                    style={{ fontFamily: PP, outline: "none" }}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Explore Jurusan */}
        <button
          onClick={() => navigate("kampus")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activePage === "kampus" ? "bg-[#0965fa] text-white shadow-sm shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          style={{ fontFamily: PP, outline: "none" }}
        >
          <span>🔍</span> Explore Jurusan
        </button>

      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAVIGATION BAR
// ═══════════════════════════════════════════════════════════════════════════════
function MobileBottomNav({ activePage, setActivePage }: { activePage: ActivePage; setActivePage: (p: ActivePage) => void }) {
  const [showMore, setShowMore] = React.useState(false);
  const mainItems = [
    { id: "dashboard", label: "Home",    icon: "🏠" },
    { id: "profil",    label: "Analisis",icon: "🧠" },
    { id: "action",    label: "Misi",    icon: "📝" },
    { id: "compass",   label: "Compass", icon: "🧭" },
  ];
  const moreItems = [
    { id: "snbp",      label: "Siap SNBP",  icon: "📚" },
    { id: "utbk",      label: "Siap UTBK",  icon: "📝" },
    { id: "skd",       label: "Siap SKD",   icon: "🏛️" },
    { id: "mandiri",   label: "Siap Mandiri",icon: "🚀" },
    { id: "kampus",    label: "Eksplor",    icon: "🔍" },
    { id: "konsultasi",label: "BK",         icon: "💬" },
  ];

  return (
    <>
      {/* More drawer overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-[64px] left-0 right-0 bg-white border-t border-slate-100 shadow-2xl px-4 py-3 grid grid-cols-4 gap-2">
            {moreItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={e => { e.stopPropagation(); setActivePage(item.id as ActivePage); setShowMore(false); }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                    isActive ? "text-[#0965fa] bg-blue-50" : "text-slate-600 hover:bg-slate-50"
                  }`}
                  style={{ fontFamily: PP }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[9px] font-bold text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg">
        {mainItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id as ActivePage); setShowMore(false); }}
              className={`flex flex-col items-center gap-0.5 text-xs font-bold py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#0965fa] bg-blue-50" : "text-slate-500"
              }`}
              style={{ fontFamily: PP }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowMore(v => !v)}
          className={`flex flex-col items-center gap-0.5 text-xs font-bold py-1 px-3 rounded-xl transition-all ${
            showMore ? "text-[#0965fa] bg-blue-50" : "text-slate-500"
          }`}
          style={{ fontFamily: PP }}
        >
          <span className="text-base">⋯</span>
          <span className="text-[10px]">Lainnya</span>
        </button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE TABS
// ═══════════════════════════════════════════════════════════════════════════════
const PROFILE_TABS: { key: ProfileTab; label: string; desc: string }[] = [
  { key: "minat-bakat", label: "Gambaran Minat Bakat", desc: "Eksplorasi potensi diri" },
  { key: "prestasi", label: "Prestasi", desc: "Riwayat prestasi akademik" },
  { key: "nilai-rapor", label: "Nilai Rapor", desc: "Data nilai akademik" },
];

function ProfileTabs({ active, onChange }: { active: ProfileTab; onChange: (t: ProfileTab) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {PROFILE_TABS.map((t) => {
        const on = active === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`flex flex-col items-start px-5 py-3 rounded-xl border transition-all duration-200 shrink-0 ${on ? "border-[#0965fa] bg-white shadow-sm" : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[#0965fa]/30"}`}
            style={{ outline: "none" }}>
            <span className={`text-[13px] font-semibold leading-tight ${on ? "text-[#0965fa]" : "text-[#374151]"}`} style={{ fontFamily: PP }}>{t.label}</span>
            <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{t.desc}</span>
            {on && <div className="mt-2 h-0.5 w-full rounded-full" style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)" }} />}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] text-[#1a1d2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0965fa]/30 focus:border-[#0965fa] transition-all ${className}`} style={{ fontFamily: PP }} />;
}

function Sel({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] text-[#1a1d2e] focus:outline-none focus:ring-2 focus:ring-[#0965fa]/30 focus:border-[#0965fa] transition-all appearance-none cursor-pointer ${className}`} style={{ fontFamily: PP }}>{children}</select>;
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] text-[#1a1d2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0965fa]/30 focus:border-[#0965fa] transition-all resize-none ${className}`} style={{ fontFamily: PP }} />;
}

function SectionHeading({ title, subtitle, accent }: { title: string; subtitle?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {accent && <div className="w-1 h-8 rounded-full shrink-0" style={{ background: accent }} />}
      <div>
        <h3 className="text-[15px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{title}</h3>
        {subtitle && <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function LikertScale({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: [string, string] }) {
  const COLORS = ["#ef4444", "#f97316", "#f1ad00", "#22c55e", "#0965fa"];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)}
            className={`flex-1 h-11 rounded-xl text-[13px] font-bold border-2 transition-all active:scale-95 ${value === n ? "text-white border-transparent shadow-md" : "text-[#9ca3af] border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/30 bg-[#f5f6fb]"}`}
            style={{ background: value === n ? COLORS[n - 1] : undefined }}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between px-0.5">
        <span className="text-[11px] text-[#9ca3af] max-w-[45%]" style={{ fontFamily: PP }}>{labels[0]}</span>
        <span className="text-[11px] text-[#9ca3af] max-w-[45%] text-right" style={{ fontFamily: PP }}>{labels[1]}</span>
      </div>
      {value > 0 && (
        <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(value / 5) * 100}%`, background: COLORS[value - 1] }} />
        </div>
      )}
    </div>
  );
}

function SingleChoice({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${active ? "border-[#0965fa] bg-[#eff6ff]" : "border-[rgba(0,0,0,0.08)] bg-[#f5f6fb] hover:border-[#0965fa]/30"}`}
            style={{ outline: "none" }}>
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-[#0965fa]" : "border-[#d1d5db]"}`}>
              {active && <div className="w-2 h-2 rounded-full bg-[#0965fa]" />}
            </div>
            <span className={`text-[13px] ${active ? "font-semibold text-[#0965fa]" : "text-[#374151]"}`} style={{ fontFamily: PP }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiChoice({ options, value, onChange, max }: { options: string[]; value: string[]; onChange: (v: string[]) => void; max: number }) {
  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else if (value.length < max) onChange([...value, opt]);
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);
          const disabled = !active && value.length >= max;
          return (
            <button key={opt} onClick={() => toggle(opt)} disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[13px] transition-all ${active ? "border-[#0965fa] text-white font-semibold" : disabled ? "border-[rgba(0,0,0,0.05)] text-[#c4c5d5] bg-[#fafafa] cursor-not-allowed" : "border-[rgba(0,0,0,0.08)] text-[#374151] bg-[#f5f6fb] hover:border-[#0965fa]/40"}`}
              style={{ background: active ? "linear-gradient(90deg,#0965fa,#00b2dd)" : undefined, fontFamily: PP }}>
              {active && <Check size={12} />}{opt}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>
        {value.length}/{max} dipilih{value.length >= max ? " — maks. tercapai" : ""}
      </p>
    </div>
  );
}

function RankingQuestion({ items, ranked, onChange }: { items: string[]; ranked: string[]; onChange: (v: string[]) => void }) {
  function handleClick(item: string) {
    if (ranked.includes(item)) onChange(ranked.filter(r => r !== item));
    else onChange([...ranked, item]);
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>Klik untuk mengurutkan dari yang paling sering (1) ke paling jarang</p>
      {items.map((item) => {
        const rank = ranked.indexOf(item) + 1;
        return (
          <button key={item} onClick={() => handleClick(item)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${rank > 0 ? "border-[#0965fa] bg-[#eff6ff]" : "border-[rgba(0,0,0,0.08)] bg-[#f5f6fb] hover:border-[#0965fa]/30"}`}
            style={{ outline: "none" }}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${rank > 0 ? "text-white" : "text-[#9ca3af] bg-white border border-[rgba(0,0,0,0.1)]"}`}
              style={{ background: rank > 0 ? "linear-gradient(135deg,#0965fa,#00b2dd)" : undefined }}>
              {rank > 0 ? rank : "·"}
            </div>
            <span className={`text-[13px] ${rank > 0 ? "font-semibold text-[#1a1d2e]" : "text-[#6b7280]"}`} style={{ fontFamily: PP }}>{item}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionBlock({ no, question, children, note }: { no: string; question: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-bold text-[#9ca3af] bg-[#f0f2f8] px-2 py-0.5 rounded-md shrink-0 mt-0.5" style={{ fontFamily: PP }}>{no}</span>
        <p className="text-[13px] font-semibold text-[#1a1d2e] leading-relaxed" style={{ fontFamily: PP }}>{question}</p>
      </div>
      <div className="pl-9">{children}</div>
      {note && <p className="pl-9 text-[11px] text-[#9ca3af] italic" style={{ fontFamily: PP }}>{note}</p>}
    </div>
  );
}

function AccordionSection({ no, title, subtitle, icon, accentColor, badge, children, defaultOpen = false }: {
  no: string; title: string; subtitle: string; icon: React.ReactNode;
  accentColor: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#fafafa] transition-colors" onClick={() => setOpen(!open)} style={{ outline: "none" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: accentColor + "15", border: `1.5px solid ${accentColor}30` }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-[#9ca3af]" style={{ fontFamily: PP }}>BAGIAN {no}</span>
            {badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: accentColor + "18", color: accentColor, fontFamily: PP }}>{badge}</span>}
          </div>
          <p className="text-[14px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{title}</p>
          <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{subtitle}</p>
        </div>
        <ChevronRight size={16} className={`text-[#9ca3af] shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="border-t border-[rgba(0,0,0,0.05)] px-6 pt-5 pb-6">{children}</div>}
    </div>
  );
}

function Divider() { return <div className="border-t border-[rgba(0,0,0,0.06)] my-5" />; }

// ═══════════════════════════════════════════════════════════════════════════════
// REFLEKSI DIRI
// ═══════════════════════════════════════════════════════════════════════════════
interface RefleksiData {
  s1q1: number; s1q2: number; s1q3: number;
  s2q1: string; s2q2: string[]; s2q3: number;
  s3q1: number; s3q2: number; s3q3: number;
  s4q1: string; s4q2: string; s4q3: number;
  s5q1: string[]; s5q2: string; s5q3: string[]; s5q4: string;
  s6q1: string[];
  s7_1_q1: string; s7_1_q2: string[];
  s7_2_q1: string[]; s7_3_q1: string; s7_4_q1: string[]; s7_5_q1: string;
}

const INIT_REFLEKSI: RefleksiData = {
  s1q1: 4, s1q2: 3, s1q3: 3,
  s2q1: "Saya mencari informasi melalui internet.", s2q2: ["Website universitas", "YouTube atau Podcast"], s2q3: 4,
  s3q1: 4, s3q2: 3, s3q3: 5,
  s4q1: "Menentukan pilihan sendiri setelah mencari berbagai informasi.", s4q2: "Saya mengevaluasi semua informasi sebelum memutuskan.", s4q3: 3,
  s5q1: ["Memecahkan soal atau tantangan logika", "Membuat program atau teknologi"], s5q2: "Saya memang menikmatinya.", s5q3: [], s5q4: "Berhasil memecahkan masalah",
  s6q1: ["Praktik langsung atau eksperimen.", "Mengerjakan latihan soal."],
  s7_1_q1: "Menyelesaikan proyek pribadi", s7_1_q2: ["Saya berhasil mengatasi tantangan", "Saya belajar hal baru"],
  s7_2_q1: ["Kesempatan belajar", "Inovasi", "Dampak sosial"], s7_3_q1: "Mengembangkan teknologi",
  s7_4_q1: ["Bingung menentukan tujuan"], s7_5_q1: "Rekomendasi jurusan",
};

function RefleksiDiriForm({ onSave, onAnalyze }: { onSave: () => void; onAnalyze: () => void }) {
  const [data, setData] = useState<RefleksiData>(INIT_REFLEKSI);

  function set<K extends keyof RefleksiData>(k: K, v: RefleksiData[K]) {
    setData(prev => ({ ...prev, [k]: v }));
  }

  const answered = [
    data.s1q1 > 0 && data.s1q2 > 0 && data.s1q3 > 0,
    data.s2q1 !== "" && data.s2q2.length > 0 && data.s2q3 > 0,
    data.s3q1 > 0 && data.s3q2 > 0 && data.s3q3 > 0,
    data.s4q1 !== "" && data.s4q2 !== "" && data.s4q3 > 0,
    data.s5q1.length > 0 && data.s5q2 !== "" && data.s5q4 !== "",
    data.s6q1.length > 0,
    data.s7_1_q1 !== "" && data.s7_2_q1.length > 0 && data.s7_3_q1 !== "",
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Progress Refleksi Diri</p>
            <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>Career Adaptability · SDT · Self-Efficacy · OECD Learning Compass</p>
          </div>
          <span className="text-[13px] font-bold text-[#0965fa]" style={{ fontFamily: PP }}>{answered}/7 bagian</span>
        </div>
        <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(answered / 7) * 100}%`, background: "linear-gradient(90deg,#0965fa,#00b2dd)" }} />
        </div>
      </div>

      <AccordionSection no="01" title="Career Concern" subtitle="Mengukur seberapa jauh kamu memikirkan dan merencanakan masa depan" icon={<Target size={16} className="text-[#0965fa]"/>} accentColor="#0965fa" badge={data.s1q1 > 0 && data.s1q2 > 0 && data.s1q3 > 0 ? "✓ Selesai" : undefined} defaultOpen>
        <div className="flex flex-col gap-6">
          <QuestionBlock no="Q1" question="Seberapa sering kamu memikirkan tujuan pendidikan atau karier yang ingin kamu capai setelah lulus SMA?">
            <LikertScale value={data.s1q1} onChange={v => set("s1q1", v)} labels={["Tidak Pernah", "Sangat Sering"]} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q2" question="Seberapa sering kamu mencari informasi mengenai jurusan kuliah, profesi, atau peluang karier yang sesuai dengan minatmu?">
            <LikertScale value={data.s1q2} onChange={v => set("s1q2", v)} labels={["Tidak Pernah", "Sangat Sering"]} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q3" question="Seberapa sering kamu mulai mempertimbangkan langkah-langkah yang perlu dilakukan untuk mencapai tujuan masa depanmu?">
            <LikertScale value={data.s1q3} onChange={v => set("s1q3", v)} labels={["Tidak Pernah", "Sangat Sering"]} />
          </QuestionBlock>
        </div>
      </AccordionSection>

      <AccordionSection no="02" title="Career Curiosity" subtitle="Eksplorasi dan rasa ingin tahu terhadap dunia karier dan studi" icon={<Search size={16} className="text-[#00b2dd]"/>} accentColor="#00b2dd" badge={data.s2q1 && data.s2q2.length > 0 && data.s2q3 > 0 ? "✓ Selesai" : undefined}>
        <div className="flex flex-col gap-6">
          <QuestionBlock no="Q1" question="Ketika menemukan profesi atau bidang studi yang menarik, apa yang biasanya kamu lakukan?">
            <SingleChoice options={["Saya mencari informasi melalui internet.", "Saya menonton video atau webinar terkait.", "Saya berdiskusi dengan guru atau Guru BK.", "Saya bertanya kepada seseorang yang bekerja di bidang tersebut.", "Saya belum melakukan apa pun."]} value={data.s2q1} onChange={v => set("s2q1", v)} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q2" question="Sumber informasi apa yang paling sering kamu gunakan?">
            <MultiChoice options={["Website universitas", "Media sosial", "YouTube atau Podcast", "Guru atau Guru BK", "Orang tua", "Alumni atau profesional", "Teman", "Saya belum pernah mencari"]} value={data.s2q2} onChange={v => set("s2q2", v)} max={2} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q3" question="Seberapa tertarik kamu untuk mencoba pengalaman baru guna mengenal berbagai bidang karier?">
            <LikertScale value={data.s2q3} onChange={v => set("s2q3", v)} labels={["Sangat Tidak Tertarik", "Sangat Tertarik"]} />
          </QuestionBlock>
        </div>
      </AccordionSection>

      <AccordionSection no="03" title="Career Confidence" subtitle="Keyakinan diri dalam meraih tujuan pendidikan dan karier" icon={<TrendingUp size={16} className="text-[#22c55e]"/>} accentColor="#22c55e" badge={data.s3q1 > 0 && data.s3q2 > 0 && data.s3q3 > 0 ? "✓ Selesai" : undefined}>
        <div className="flex flex-col gap-6">
          <QuestionBlock no="Q1" question="Seberapa yakin kamu dapat mencapai jurusan atau pekerjaan yang kamu inginkan apabila terus berusaha?">
            <LikertScale value={data.s3q1} onChange={v => set("s3q1", v)} labels={["Sangat Tidak Yakin", "Sangat Yakin"]} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q2" question="Seberapa yakin kamu dapat mengatasi kesulitan yang mungkin muncul saat mengejar tujuanmu?">
            <LikertScale value={data.s3q2} onChange={v => set("s3q2", v)} labels={["Sangat Tidak Yakin", "Sangat Yakin"]} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q3" question="Seberapa yakin kamu mampu mempelajari keterampilan baru untuk mencapai cita-citamu?">
            <LikertScale value={data.s3q3} onChange={v => set("s3q3", v)} labels={["Sangat Tidak Yakin", "Sangat Yakin"]} />
          </QuestionBlock>
        </div>
      </AccordionSection>

      <AccordionSection no="04" title="Career Control" subtitle="Kemampuan mengelola keputusan dan arah perjalanan kariermu" icon={<Compass size={16} className="text-[#f1ad00]"/>} accentColor="#f1ad00" badge={data.s4q1 && data.s4q2 && data.s4q3 > 0 ? "✓ Selesai" : undefined}>
        <div className="flex flex-col gap-6">
          <QuestionBlock no="Q1" question="Ketika harus memilih antara dua pilihan karier yang sama-sama menarik, apa yang biasanya kamu lakukan?">
            <SingleChoice options={["Menentukan pilihan sendiri setelah mencari berbagai informasi.", "Berdiskusi dengan orang tua sebelum mengambil keputusan.", "Berkonsultasi dengan guru atau Guru BK.", "Mengikuti pilihan teman atau lingkungan sekitar.", "Saya masih merasa bingung menentukan pilihan."]} value={data.s4q1} onChange={v => set("s4q1", v)} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q2" question="Ketika menerima banyak saran mengenai pilihan jurusan, bagaimana kamu mengambil keputusan?">
            <SingleChoice options={["Saya mengevaluasi semua informasi sebelum memutuskan.", "Saya lebih mempertimbangkan pendapat orang tua.", "Saya lebih percaya pada saran guru atau Guru BK.", "Saya mengikuti pilihan teman atau lingkungan.", "Saya sering menunda karena sulit menentukan pilihan."]} value={data.s4q2} onChange={v => set("s4q2", v)} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q3" question="Seberapa sering kamu menetapkan target belajar untuk mendukung tujuan masa depanmu?">
            <LikertScale value={data.s4q3} onChange={v => set("s4q3", v)} labels={["Tidak Pernah", "Sangat Sering"]} />
          </QuestionBlock>
        </div>
      </AccordionSection>

      <AccordionSection no="05" title="Intrinsic Motivation" subtitle="Aktivitas dan dorongan yang datang murni dari dalam dirimu" icon={<Sparkles size={16} className="text-[#8b5cf6]"/>} accentColor="#8b5cf6" badge={data.s5q1.length > 0 && data.s5q2 && data.s5q4 ? "✓ Selesai" : undefined}>
        <div className="flex flex-col gap-6">
          <QuestionBlock no="Q1" question="Jika tidak ada nilai atau hadiah, aktivitas mana yang tetap ingin kamu lakukan?">
            <MultiChoice options={["Membuat karya atau desain", "Membantu orang lain", "Memecahkan soal atau tantangan logika", "Membaca buku atau mencari informasi baru", "Membuat program atau teknologi", "Mengikuti organisasi atau memimpin tim", "Melakukan eksperimen", "Berolahraga", "Membuat konten", "Mengajar atau menjelaskan sesuatu kepada orang lain"]} value={data.s5q1} onChange={v => set("s5q1", v)} max={3} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q2" question="Alasan utama kamu memilih aktivitas tersebut adalah...">
            <SingleChoice options={["Saya memang menikmatinya.", "Saya ingin terus berkembang.", "Saya merasa aktivitas tersebut bermanfaat bagi orang lain.", "Saya tertantang untuk menjadi lebih baik.", "Aktivitas tersebut membuat saya merasa percaya diri."]} value={data.s5q2} onChange={v => set("s5q2", v)} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q3" question="Ketika memiliki waktu luang seharian, aktivitas apa yang kamu pilih?" note="AI akan melihat pola pilihan, bukan hanya pilihan pertama.">
            <RankingQuestion items={["Mengikuti workshop atau kelas online", "Membuat proyek pribadi", "Membaca buku", "Mengikuti kegiatan sosial", "Bermain game", "Membuat konten", "Berolahraga", "Berkumpul dengan teman"]} ranked={data.s5q3} onChange={v => set("s5q3", v)} />
          </QuestionBlock>
          <Divider />
          <QuestionBlock no="Q4" question="Hal apa yang paling membuatmu puas setelah menyelesaikan suatu aktivitas?">
            <SingleChoice options={["Berhasil memecahkan masalah", "Mendapatkan pengetahuan baru", "Membantu orang lain", "Menghasilkan karya yang bisa dibanggakan", "Mendapatkan apresiasi dari orang lain", "Berhasil mencapai target yang saya tetapkan sendiri"]} value={data.s5q4} onChange={v => set("s5q4", v)} />
          </QuestionBlock>
        </div>
      </AccordionSection>

      <AccordionSection no="06" title="Learning Preference" subtitle="Gaya dan metode belajar yang paling efektif untukmu" icon={<BookOpen size={16} className="text-[#ec4899]"/>} accentColor="#ec4899" badge={data.s6q1.length > 0 ? "✓ Selesai" : undefined}>
        <QuestionBlock no="Q1" question="Metode belajar apa yang paling membantumu memahami materi baru?">
          <MultiChoice options={["Menonton video pembelajaran.", "Membaca buku atau artikel.", "Praktik langsung atau eksperimen.", "Diskusi dengan guru atau teman.", "Mengerjakan latihan soal.", "Mengerjakan proyek atau studi kasus."]} value={data.s6q1} onChange={v => set("s6q1", v)} max={2} />
        </QuestionBlock>
      </AccordionSection>

      <AccordionSection no="07" title="Personal Reflection" subtitle="Refleksi mendalam tentang pengalaman, nilai, dan harapan masa depanmu" icon={<User size={16} className="text-[#14b8a6]"/>} accentColor="#14b8a6" badge={data.s7_1_q1 && data.s7_2_q1.length > 0 && data.s7_3_q1 ? "✓ Selesai" : undefined}>
        <div className="flex flex-col gap-6">
          {[
            { id: "7.1", name: "Proudest Experience" },
            { id: "7.2", name: "Future Values" },
            { id: "7.3", name: "Future Lifestyle" },
            { id: "7.4", name: "Biggest Challenge" },
            { id: "7.5", name: "Support Preference" },
          ].map(({ id, name }, idx) => (
            <div key={id}>
              {idx > 0 && <Divider />}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-md" style={{ background: "#14b8a6", fontFamily: PP }}>{id}</span>
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{name}</p>
              </div>
              {id === "7.1" && (
                <div className="flex flex-col gap-5">
                  <QuestionBlock no="Q1" question="Aktivitas atau pengalaman mana yang paling membuatmu bangga?">
                    <SingleChoice options={["Menjadi juara lomba", "Menjadi pengurus organisasi", "Membantu orang lain", "Menyelesaikan proyek pribadi", "Berhasil meningkatkan nilai", "Mengikuti volunteer", "Membuat karya", "Mengembangkan bisnis kecil", "Lainnya"]} value={data.s7_1_q1} onChange={v => set("s7_1_q1", v)} />
                  </QuestionBlock>
                  <QuestionBlock no="Q2" question="Apa yang membuat pengalaman tersebut berkesan bagimu?">
                    <MultiChoice options={["Saya berhasil mengatasi tantangan", "Saya belajar hal baru", "Saya membantu orang lain", "Saya bekerja sama dalam tim", "Saya menjadi lebih percaya diri", "Saya menemukan minat baru"]} value={data.s7_1_q2} onChange={v => set("s7_1_q2", v)} max={2} />
                  </QuestionBlock>
                </div>
              )}
              {id === "7.2" && (
                <QuestionBlock no="Q1" question="Hal apa yang paling penting bagimu ketika memilih pekerjaan di masa depan?">
                  <MultiChoice options={["Membantu banyak orang", "Gaji tinggi", "Kesempatan belajar", "Fleksibilitas kerja", "Kreativitas", "Stabilitas", "Kepemimpinan", "Inovasi", "Dampak sosial", "Work-life balance"]} value={data.s7_2_q1} onChange={v => set("s7_2_q1", v)} max={3} />
                </QuestionBlock>
              )}
              {id === "7.3" && (
                <QuestionBlock no="Q1" question="Bayangkan dirimu 10 tahun lagi. Aktivitas seperti apa yang paling ingin kamu lakukan setiap hari?">
                  <SingleChoice options={["Memimpin sebuah tim", "Mengembangkan teknologi", "Mengajar", "Melakukan penelitian", "Mendesain sesuatu", "Menjalankan bisnis", "Membantu masyarakat", "Membuat karya kreatif"]} value={data.s7_3_q1} onChange={v => set("s7_3_q1", v)} />
                </QuestionBlock>
              )}
              {id === "7.4" && (
                <QuestionBlock no="Q1" question="Apa tantangan terbesar yang saat ini paling menghambat perkembanganmu?">
                  <MultiChoice options={["Sulit mengatur waktu", "Kurang percaya diri", "Bingung menentukan tujuan", "Kurang memahami materi", "Kurang motivasi belajar", "Tidak memiliki teman belajar", "Tidak tahu langkah selanjutnya", "Lainnya"]} value={data.s7_4_q1} onChange={v => set("s7_4_q1", v)} max={8} />
                </QuestionBlock>
              )}
              {id === "7.5" && (
                <QuestionBlock no="Q1" question="Jika mengalami kesulitan menentukan masa depan, bantuan apa yang paling ingin kamu dapatkan?">
                  <SingleChoice options={["Rekomendasi jurusan", "Rekomendasi profesi", "Roadmap belajar", "Konsultasi Guru BK", "Tryout", "Mentor", "Alumni"]} value={data.s7_5_q1} onChange={v => set("s7_5_q1", v)} />
                </QuestionBlock>
              )}
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Action row */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] px-6 py-4 shadow-sm sticky bottom-4">
        <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{answered}/7 bagian selesai</p>
        <div className="flex gap-3">
          <button onClick={onSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#0965fa]/30 text-[13px] font-semibold text-[#0965fa] hover:bg-[#eff6ff] transition-all"
            style={{ fontFamily: PP, outline: "none" }}>
            <Save size={14} />Simpan
          </button>
          <button onClick={onAnalyze}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, boxShadow: "0 4px 16px rgba(9,101,250,0.3)", outline: "none" }}>
            <Sparkles size={14} />Simpan & Analisis
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI PROCESSING ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════
const AI_STEPS = [
  { pct: 15, msg: "Memproses jawaban refleksi diri..." },
  { pct: 32, msg: "Menganalisis pola minat dan motivasi..." },
  { pct: 54, msg: "Mencocokkan profil dengan database karier..." },
  { pct: 73, msg: "Menyusun rekomendasi personal..." },
  { pct: 91, msg: "Menghitung confidence score..." },
  { pct: 100, msg: "Analisis selesai! ✓" },
];

function AIProcessingView({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepMsg, setStepMsg] = useState("Memulai analisis...");

  useEffect(() => {
    const delays = [400, 1100, 1900, 2700, 3500, 4300];
    const timers = AI_STEPS.map((s, i) => setTimeout(() => { setProgress(s.pct); setStepMsg(s.msg); }, delays[i]));
    const done = setTimeout(onComplete, 5200);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [onComplete]);

  const bar = Array.from({ length: 20 }, (_, i) => i < Math.floor(progress / 5) ? "█" : "░").join("");

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full animate-ping opacity-10" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }} />
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>
          <span className="text-5xl">🤖</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[22px] font-bold text-[#1a1d2e] mb-2" style={{ fontFamily: PP }}>AI sedang memahami profilmu...</p>
        <p className="text-[14px] text-[#6b7280]" style={{ fontFamily: PP }}>{stepMsg}</p>
      </div>
      <div className="bg-[#1a1d2e] rounded-2xl px-8 py-5 w-full max-w-md">
        <p className="text-[#00b2dd] text-[13px] font-mono mb-3 tracking-wide">ORBITA AI · NLP Analysis</p>
        <p className="text-[#f0f2f8] text-[18px] font-mono tracking-wider mb-2">{bar} {progress}%</p>
        <p className="text-[#6b7280] text-[11px] font-mono">{stepMsg}</p>
      </div>
      <div className="flex gap-2">
        {AI_STEPS.map((s, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${progress >= s.pct ? "bg-[#0965fa]" : "bg-[#e5e7eb]"}`} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT CARD PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════
function ResultCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden ${className}`}>{children}</div>;
}

function CardHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-lg">{emoji}</span>
        <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{title}</p>
      </div>
      {subtitle && <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{subtitle}</p>}
    </div>
  );
}

function BarStat({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[13px] font-medium text-[#374151]" style={{ fontFamily: PP }}>{label}</span>
        <span className="text-[15px] font-bold" style={{ color, fontFamily: PP }}>{pct}%</span>
      </div>
      <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function CirclePct({ pct, size = 88, color }: { pct: number; size?: number; color: string }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0f2f8" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[17px] font-bold" style={{ color, fontFamily: PP }}>{pct}%</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI RESULT CARDS
// ═══════════════════════════════════════════════════════════════════════════════
function SelfReflectionResult({ onUpdate }: { onUpdate: () => void }) {
  const [confState, setConfState] = useState<ConfidenceState>("high");

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header card */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Hasil Analisis Refleksi Diri</h3>
          <p className="text-xs text-slate-400 mt-0.5">Analisis minat, kecocokan jurusan, dan skor kesiapan karier</p>
        </div>
        <button 
          onClick={onUpdate}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#0965fa] border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all"
        >
          Edit Refleksi
        </button>
      </div>

      {/* Grid of Rich Original Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CareerInterestCard />
      </div>

      <RecommendedMajorCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CareerReadinessCard />
        <ConfidenceScoreCard state={confState} onStateChange={setConfState} />
      </div>

    
    </div>
  );
}

// ── Kept for Analisis Gabungan tab ───────────────────────────────────────────
function CareerInterestCard() {
  const interests = [
    { field: "Teknologi", pct: 98, color: "#0965fa" },
    { field: "Riset & Analisis", pct: 94, color: "#00b2dd" },
    { field: "Rekayasa", pct: 88, color: "#8b5cf6" },
    { field: "Bisnis", pct: 72, color: "#f1ad00" },
    { field: "Sosial", pct: 58, color: "#22c55e" },
  ];
  return (
    <ResultCard>
      <CardHeader emoji="🎯" title="Bidang yang Paling Sesuai" subtitle="Berdasarkan hasil profilmu, berikut bidang yang paling sesuai untuk dieksplorasi lebih lanjut." />
      <div className="px-6 py-5 flex flex-col gap-4">
        {interests.map(item => <BarStat key={item.field} label={item.field} pct={item.pct} color={item.color} />)}
      </div>
    </ResultCard>
  );
}

const MAJOR_EVIDENCE: Record<string, { category: string; value: string }[]> = {
  "Sistem Informasi": [
    { category: "Interest Assessment", value: "Technology 98%" },
    { category: "Academic Performance", value: "Matematika ↑ Tinggi" },
    { category: "Achievement", value: "Programming Competition" },
    { category: "Career Curiosity", value: "High" },
    { category: "Motivation", value: "Problem Solving" },
  ],
  "Teknik Informatika": [
    { category: "Interest Assessment", value: "Technology + Engineering" },
    { category: "Academic Performance", value: "Fisika ↑ Tinggi" },
    { category: "Intrinsic Motivation", value: "Membuat program/teknologi" },
    { category: "Future Lifestyle", value: "Mengembangkan teknologi" },
  ],
  "Data Science": [
    { category: "Interest Assessment", value: "Research 94%" },
    { category: "Intrinsic Motivation", value: "Tantangan logika" },
    { category: "Future Values", value: "Inovasi + Belajar" },
    { category: "Learning Preference", value: "Analitis & Eksperimen" },
  ],
};

function RecommendedMajorCard() {
  const majors = [
    { name: "Sistem Informasi", pct: 96, university: "UI, ITB, ITS, Binus" },
    { name: "Teknik Informatika", pct: 93, university: "ITB, UI, ITS, UGM" },
    { name: "Data Science", pct: 91, university: "UI, IPB, ITS, Binus" },
    { name: "Teknik Elektro", pct: 86, university: "ITB, UI, ITS, UGM" },
  ];
  const [selected, setSelected] = useState<string | null>("Sistem Informasi");
  return (
    <ResultCard>
      <CardHeader emoji="🎓" title="Recommended Major" subtitle="Klik untuk melihat alasan AI" />
      <div className="px-6 py-5">
        <div className="flex flex-col gap-2 mb-4">
          {majors.map((m, i) => {
            const active = selected === m.name;
            return (
              <button key={m.name} onClick={() => setSelected(active ? null : m.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all w-full ${active ? "border-[#0965fa] bg-[#eff6ff]" : "border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/30"}`}
                style={{ outline: "none" }}>
                <span className="text-[12px] font-bold text-[#9ca3af] w-5 shrink-0" style={{ fontFamily: PP }}>{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold ${active ? "text-[#0965fa]" : "text-[#1a1d2e]"}`} style={{ fontFamily: PP }}>{m.name}</p>
                  <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{m.university}</p>
                </div>
                <span className="text-[14px] font-bold shrink-0" style={{ color: active ? "#0965fa" : "#374151", fontFamily: PP }}>{m.pct}%</span>
                <ChevronRight size={13} className={`shrink-0 text-[#9ca3af] transition-transform ${active ? "rotate-90" : ""}`} />
              </button>
            );
          })}
        </div>
        {selected && MAJOR_EVIDENCE[selected] && (
          <div className="bg-gradient-to-br from-[#f8faff] to-[#eff6ff] rounded-xl border border-[#bfdbfe] p-4">
            <p className="text-[12px] font-bold text-[#1a1d2e] mb-2" style={{ fontFamily: PP }}>💡 Mengapa {selected}?</p>
            <div className="flex flex-col gap-2 mb-3">
              {MAJOR_EVIDENCE[selected].map(e => (
                <div key={e.category} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#22c55e] shrink-0" />
                  <span className="text-[12px] text-[#374151]" style={{ fontFamily: PP }}>
                    <span className="font-semibold">{e.category}</span> · {e.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[#dbeafe]">
              <span className="text-[12px] text-[#6b7280]" style={{ fontFamily: PP }}>Confidence</span>
              <div className="flex-1 h-2 bg-[#dbeafe] rounded-full overflow-hidden"><div className="h-full bg-[#0965fa] rounded-full" style={{ width: "96%" }} /></div>
              <span className="text-[13px] font-bold text-[#0965fa]" style={{ fontFamily: PP }}>96%</span>
            </div>
          </div>
        )}
      </div>
    </ResultCard>
  );
}

function CareerRecommendationCard() {
  const careers = [
    { name: "Data Scientist", pct: 95, icon: "📊", color: "#0965fa" },
    { name: "AI Engineer", pct: 92, icon: "🤖", color: "#8b5cf6" },
    { name: "Business Analyst", pct: 90, icon: "📈", color: "#00b2dd" },
    { name: "Software Engineer", pct: 87, icon: "💻", color: "#22c55e" },
    { name: "Systems Architect", pct: 84, icon: "🏗️", color: "#f1ad00" },
  ];
  return (
    <ResultCard>
      <CardHeader emoji="💼" title="Career Recommendation" subtitle="Profesi yang sesuai dengan profilmu" />
      <div className="px-6 py-5 flex flex-col gap-3">
        {careers.map(c => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0 bg-[#f5f6fb]">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{c.name}</span>
                <span className="text-[13px] font-bold" style={{ color: c.color, fontFamily: PP }}>{c.pct}%</span>
              </div>
              <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}

function CareerReadinessCard() {
  const subs = [
    { label: "Academic Readiness", pct: 85, color: "#0965fa" },
    { label: "Career Exploration", pct: 70, color: "#00b2dd" },
    { label: "Learning Consistency", pct: 88, color: "#22c55e" },
    { label: "Decision Making", pct: 76, color: "#f1ad00" },
  ];
  return (
    <ResultCard>
      <CardHeader emoji="📈" title="Tingkat Kesiapan Karir" subtitle="Kesiapan menyeluruh dalam merencanakan karier" />
      <div className="px-6 py-5">
        <div className="flex items-center gap-5 mb-6">
          <CirclePct pct={82} color="#0965fa" size={88} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f1ad00]" />
              <span className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Developing</span>
            </div>
            <p className="text-[12px] text-[#9ca3af] leading-relaxed" style={{ fontFamily: PP }}>Kesadaran karier sudah baik. Tingkatkan eksplorasi dan keputusan mandiri.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {subs.map(s => <BarStat key={s.label} label={s.label} pct={s.pct} color={s.color} />)}
        </div>
      </div>
    </ResultCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE SCORE CARD
// ═══════════════════════════════════════════════════════════════════════════════
const CONF: Record<ConfidenceState, { score: number; status: string; color: string; emoji: string; insight: string; alignments: { label: string; pct: number; ok: boolean }[]; tesMB: string; refleksi: string; aligned: boolean }> = {
  high: {
    score: 92, status: "Highly Consistent", color: "#22c55e", emoji: "🟢",
    insight: "Hasil Tes Minat Bakat dan Self Reflection menunjukkan konsistensi tinggi. AI memiliki keyakinan kuat dalam memberikan rekomendasi.",
    alignments: [{ label: "Kesesuaian Minat", pct: 95, ok: true }, { label: "Kesesuaian Motivasi", pct: 88, ok: true }, { label: "Kesesuaian Tujuan Karier", pct: 91, ok: true }, { label: "Kesesuaian Aktivitas yang Disukai", pct: 86, ok: true }],
    tesMB: "Technology", refleksi: "Technology", aligned: true,
  },
  medium: {
    score: 74, status: "Still Exploring", color: "#f1ad00", emoji: "🟡",
    insight: "AI menemukan beberapa minat yang cukup konsisten, namun masih ada aspek yang perlu dieksplorasi lebih lanjut.",
    alignments: [{ label: "Kesesuaian Minat", pct: 78, ok: true }, { label: "Kesesuaian Motivasi", pct: 65, ok: false }, { label: "Kesesuaian Tujuan Karier", pct: 72, ok: true }, { label: "Kesesuaian Aktivitas yang Disukai", pct: 58, ok: false }],
    tesMB: "Technology", refleksi: "Business", aligned: false,
  },
  low: {
    score: 48, status: "Need More Exploration", color: "#ef4444", emoji: "🔴",
    insight: "Kami menemukan perbedaan antara Tes Minat Bakat dan Self Reflection. Hal ini bukan salah — minatmu masih berkembang. Kami sarankan eksplorasi karier atau diskusi dengan Guru BK.",
    alignments: [{ label: "Kesesuaian Minat", pct: 45, ok: false }, { label: "Kesesuaian Motivasi", pct: 52, ok: false }, { label: "Kesesuaian Tujuan Karier", pct: 38, ok: false }, { label: "Kesesuaian Aktivitas yang Disukai", pct: 61, ok: true }],
    tesMB: "Technology", refleksi: "Psychology", aligned: false,
  },
};

function ConfidenceScoreCard({ state, onStateChange }: { state: ConfidenceState; onStateChange: (s: ConfidenceState) => void }) {
  const d = CONF[state];
  return (
    <ResultCard>
      <CardHeader emoji="🤖" title="Tingkat Konsistensi Profil" subtitle="Menunjukkan seberapa konsisten hasil Tes Minat Bakat dan Refleksi Diri dalam menggambarkan profilmu." />
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>Demo:</span>
          {(["high", "medium", "low"] as ConfidenceState[]).map(s => (
            <button key={s} onClick={() => onStateChange(s)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${state === s ? "text-white border-transparent" : "bg-[#f5f6fb] border-[rgba(0,0,0,0.08)] text-[#6b7280]"}`}
              style={{ background: state === s ? CONF[s].color : undefined, fontFamily: PP, outline: "none" }}>
              {CONF[s].emoji} {CONF[s].status}
            </button>
          ))}
        </div>
        <div className="flex items-start gap-5 mb-5">
          <CirclePct pct={d.score} color={d.color} size={90} />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{d.emoji}</span>
              <span className="text-[15px] font-bold" style={{ color: d.color, fontFamily: PP }}>{d.status}</span>
            </div>
            <p className="text-[12px] text-[#6b7280] leading-relaxed max-w-sm" style={{ fontFamily: PP }}>{d.insight}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          {d.alignments.map(a => (
            <div key={a.label} className="flex items-center gap-3">
              {a.ok ? <CheckCircle2 size={15} className="text-[#22c55e] shrink-0" /> : <AlertTriangle size={15} className="text-[#f1ad00] shrink-0" />}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#374151]" style={{ fontFamily: PP }}>{a.label}</span>
                  <span className="text-[12px] font-bold" style={{ color: a.ok ? "#22c55e" : "#f1ad00", fontFamily: PP }}>{a.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.ok ? "#22c55e" : "#f1ad00" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {!d.aligned && (
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-4 mb-4">
            <p className="text-[12px] font-semibold text-[#c2410c] mb-2" style={{ fontFamily: PP }}>⚠️ Interest Mismatch</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-[rgba(0,0,0,0.08)] text-center">
                <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Tes Minat Bakat</p>
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{d.tesMB}</p>
              </div>
              <span className="text-[16px] text-[#f97316]">↔</span>
              <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-[rgba(0,0,0,0.08)] text-center">
                <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Self Reflection</p>
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{d.refleksi}</p>
              </div>
            </div>
          </div>
        )}
        {state !== "high" && (
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP }}>Explore Career</button>
            <button className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-[#0965fa] border-2 border-[#0965fa]/30 hover:bg-[#eff6ff]"
              style={{ fontFamily: PP }}>Book BK Session</button>
          </div>
        )}
      </div>
    </ResultCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOW AI KNOWS YOU
// ═══════════════════════════════════════════════════════════════════════════════
const HOW_NODES = [
  { id: "orbita", emoji: "🧠", label: "ORBITA AI", sub: "Core Analysis Engine", color: "#0965fa", explanation: null },
  { id: "tes", emoji: "🎯", label: "Tes Minat Bakat", sub: "78% kontribusi", color: "#00b2dd", explanation: "78% dari rekomendasi ini dipengaruhi oleh hasil Tes Minat Bakat. Data psikometri objektif dari lembaga mitra mengonfirmasi kecenderungan minat pada bidang Technology dan Research secara terstruktur." },
  { id: "refleksi", emoji: "📝", label: "Refleksi Diri", sub: "22% kontribusi", color: "#8b5cf6", explanation: "22% dari rekomendasi ini dipengaruhi oleh hasil refleksi diri. Jawabanmu menunjukkan motivasi kuat pada problem solving, eksplorasi teknologi, dan tujuan masa depan yang spesifik." },
  { id: "analysis", emoji: "⚙️", label: "AI Analysis", sub: "NLP + Similarity", color: "#f1ad00", explanation: "AI memproses kedua sumber data menggunakan NLP analysis dan menghitung similarity score antar dimensi untuk menghasilkan rekomendasi yang objektif dan personal." },
  { id: "output", emoji: "💡", label: "Recommendation", sub: "Personalized output", color: "#22c55e", explanation: "Output akhir berupa rekomendasi jurusan, karier, dan career readiness score yang disesuaikan dengan profil unikmu berdasarkan gabungan dua sumber data." },
];

function HowAIKnowsYou() {
  const [selected, setSelected] = useState<string | null>(null);
  const selNode = HOW_NODES.find(n => n.id === selected);
  return (
    <ResultCard>
      <CardHeader emoji="🔬" title="How AI Knows You" subtitle="Klik setiap node untuk melihat peran data dalam rekomendasimu" />
      <div className="px-6 py-5">
        <div className="flex flex-col items-center">
          {HOW_NODES.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center w-full">
              <button onClick={() => setSelected(selected === node.id ? null : node.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all active:scale-95 w-72 ${selected === node.id ? "shadow-lg" : "hover:shadow-md bg-white"}`}
                style={{ borderColor: selected === node.id ? node.color : "rgba(0,0,0,0.08)", background: selected === node.id ? node.color + "10" : "white", outline: "none" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: node.color + "15" }}>{node.emoji}</div>
                <div className="text-left flex-1">
                  <p className="text-[13px] font-bold" style={{ fontFamily: PP, color: selected === node.id ? node.color : "#1a1d2e" }}>{node.label}</p>
                  <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{node.sub}</p>
                </div>
                {node.explanation && <Info size={14} style={{ color: node.color + "70" }} className="shrink-0" />}
              </button>
              {i < HOW_NODES.length - 1 && <div className="w-0.5 h-5 bg-[#e5e7eb] my-1" />}
            </div>
          ))}
        </div>
        {selNode?.explanation && (
          <div className="mt-4 rounded-xl p-4 border" style={{ background: selNode.color + "08", borderColor: selNode.color + "25" }}>
            <div className="flex items-start gap-2">
              <span className="text-base shrink-0">{selNode.emoji}</span>
              <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>
                <span className="font-bold" style={{ color: selNode.color }}>{selNode.label}</span> — {selNode.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </ResultCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI RESULTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AIResultsPage({ onBack }: { tesCompleted: boolean; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[rgba(0,0,0,0.08)] text-[13px] font-medium text-[#374151] hover:bg-[#f5f6fb] transition-colors"
          style={{ fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={14} />Edit Refleksi
        </button>
        <div>
          <p className="text-[16px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Hasil Analisis AI</p>
          <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <Sparkles size={13} className="text-green-600" />
          <span className="text-[12px] font-semibold text-green-700" style={{ fontFamily: PP }}>Analisis Selesai</span>
        </div>
      </div>
      <SelfReflectionResult onUpdate={onBack} />
      <div className="flex items-start gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-2xl px-5 py-4">
        <span className="text-lg shrink-0">💡</span>
        <div>
          <p className="text-[13px] font-semibold text-[#92400e] mb-0.5" style={{ fontFamily: PP }}>Keep in mind</p>
          <p className="text-[13px] text-[#78350f] leading-relaxed" style={{ fontFamily: PP }}>
            Hasil ini hanya jadi gambaran awal tentang dirimu, ya! Untuk mengetahui minat dan bakat secara lebih akurat, kamu bisa konsultasi langsung dengan psikolog.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TES MB SECTION A
// ═══════════════════════════════════════════════════════════════════════════════
function TesMBSection({ showCompleted, setShowCompleted }: { showCompleted: boolean; setShowCompleted: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-r from-[#eff6ff] to-[#e0f2fe] rounded-2xl border border-[#bfdbfe] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0965fa]/10 flex items-center justify-center shrink-0"><FileText size={20} className="text-[#0965fa]" /></div>
        <div>
          <p className="text-[13px] font-semibold text-[#1a1d2e] mb-1" style={{ fontFamily: PP }}>Tentang Tes Minat Bakat</p>
          <p className="text-[12px] text-[#4b5563] leading-relaxed" style={{ fontFamily: PP }}>Tes ini dilaksanakan bekerja sama dengan lembaga resmi. Hasil tes diunggah oleh tim ke sistem setelah sesi selesai.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-1">
        <span className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Demo:</span>
        <button onClick={() => setShowCompleted(!showCompleted)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium border ${showCompleted ? "bg-green-50 border-green-200 text-green-700" : "bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]"}`}
          style={{ fontFamily: PP, outline: "none" }}>
          <span className={`w-2 h-2 rounded-full ${showCompleted ? "bg-green-500" : "bg-orange-400"}`} />
          {showCompleted ? "Status: Completed" : "Status: Belum Tes"}
        </button>
      </div>

      {showCompleted ? (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 size={16} className="text-green-600" /></div>
            <div>
              <p className="text-[14px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>Tes Minat Bakat</p>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>oleh Lembaga Psikologi Talenta</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold" style={{ fontFamily: PP }}>✓ Completed</span>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-4 bg-[#f5f6fb] rounded-xl p-4 mb-5">
              <div className="w-12 h-14 bg-red-500/10 rounded-lg flex flex-col items-center justify-center shrink-0 border border-red-200">
                <FileText size={18} className="text-red-500" /><span className="text-[9px] font-bold text-red-500 mt-0.5">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1a1d2e] truncate" style={{ fontFamily: PP }}>Hasil_Tes_Minat_Bakat_Ahmad_Rizki.pdf</p>
                <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>Diunggah 12 Maret 2025 · 2.4 MB</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white shrink-0"
                style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP }}>
                <ExternalLink size={13} />Lihat Detail
              </button>
            </div>
            <p className="text-[12px] font-semibold text-[#374151] mb-3" style={{ fontFamily: PP }}>Ringkasan Hasil Tes</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "Tipe Kepribadian", value: "ENFJ – The Teacher", color: "#0965fa" }, { label: "Kluster Minat Utama", value: "Sosial & Enterprising", color: "#00b2dd" }, { label: "Bidang Bakat Dominan", value: "Komunikasi & Kepemimpinan", color: "#ff7000" }].map(r => (
                <div key={r.label} className="rounded-xl border p-4" style={{ borderColor: r.color + "30", background: r.color + "08" }}>
                  <p className="text-[10px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>{r.label}</p>
                  <p className="text-[13px] font-bold leading-tight" style={{ color: r.color, fontFamily: PP }}>{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(0,0,0,0.05)]">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><Clock size={16} className="text-orange-500" /></div>
            <div>
              <p className="text-[14px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>Tes Minat Bakat</p>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Belum ada hasil tes yang tercatat</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[11px] font-semibold" style={{ fontFamily: PP }}>Menunggu</span>
          </div>
          <div className="px-6 py-5">
            <div className="bg-gradient-to-br from-[#eff6ff] to-[#faf5ff] rounded-2xl p-5 mb-5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0"><span className="text-3xl">🧩</span></div>
              <div>
                <p className="text-[14px] font-bold text-[#1a1d2e] mb-1" style={{ fontFamily: PP }}>Kamu belum mengikuti Tes Minat Bakat</p>
                <p className="text-[12px] text-[#6b7280] leading-relaxed" style={{ fontFamily: PP }}>Tes ini membantu mengidentifikasi potensi dan minatmu secara objektif.</p>
              </div>
            </div>
            {[{ step: "01", title: "Jadwalkan Tes", desc: "Hubungi guru BK untuk mendaftar.", done: true }, { step: "02", title: "Ikuti Sesi Tes", desc: "Hadir pada jadwal tes bersama lembaga mitra.", done: false }, { step: "03", title: "Tunggu Hasil", desc: "Tim mengunggah PDF setelah tes diproses.", done: false }, { step: "04", title: "Lihat Hasil", desc: "Hasil muncul di sini dan diintegrasikan ke rekomendasimu.", done: false }].map(s => (
              <div key={s.step} className="flex items-start gap-4 mb-3 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold border-2 ${s.done ? "text-white border-transparent" : "border-[rgba(0,0,0,0.1)] text-[#9ca3af] bg-white"}`}
                  style={{ background: s.done ? "linear-gradient(135deg,#0965fa,#00b2dd)" : undefined }}>
                  {s.done ? <Check size={13} /> : s.step}
                </div>
                <div className="flex-1 pb-3 border-b border-[rgba(0,0,0,0.05)] last:border-0">
                  <p className={`text-[13px] font-semibold ${s.done ? "text-[#0965fa]" : "text-[#374151]"}`} style={{ fontFamily: PP }}>{s.title}</p>
                  <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <button className="mt-4 w-full py-3 rounded-xl text-[13px] font-semibold text-[#0965fa] border-2 border-[#0965fa]/30 hover:bg-[#eff6ff]"
              style={{ fontFamily: PP, outline: "none" }}>
              Hubungi Guru BK untuk Daftar Tes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINAT BAKAT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function MinatBakatPage() {
  const [subTab, setSubTab] = useState<MinatSubTab>("refleksi");
  const [showCompleted, setShowCompleted] = useState(false);
  const [refleksiView, setRefleksiView] = useState<RefleksiView>("form");

  return (
    <div className="flex flex-col">
      {refleksiView !== "results" && (
        <div className="flex gap-1 bg-[#f0f2f8] p-1 rounded-xl w-fit mb-6">
          {([{ key: "tes" as MinatSubTab, emoji: "📄", label: "Gambaran Minat Bakat" }, { key: "refleksi" as MinatSubTab, emoji: "🪞", label: "Refleksi Diri" }]).map(tab => (
            <button key={tab.key} onClick={() => setSubTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all ${subTab === tab.key ? "bg-white text-[#1a1d2e] shadow-sm" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
              style={{ fontFamily: PP, outline: "none" }}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      )}
      {subTab === "tes" && <TesMBSection showCompleted={showCompleted} setShowCompleted={setShowCompleted} />}
      {subTab === "refleksi" && refleksiView === "form" && <RefleksiDiriForm onSave={() => {}} onAnalyze={() => setRefleksiView("analyzing")} />}
      {subTab === "refleksi" && refleksiView === "analyzing" && <AIProcessingView onComplete={() => setRefleksiView("results")} />}
      {subTab === "refleksi" && refleksiView === "results" && <AIResultsPage tesCompleted={showCompleted} onBack={() => setRefleksiView("form")} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESTASI PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type PrestasiSubTab = "akademik" | "non-akademik";

interface AcademicItem {
  id: string; nama: string; kategori: string; penyelenggara: string;
  tingkat: string; bidang: string; peran: string; hasil: string; tanggal: string;
}

interface NonAcademicItem {
  id: string; jenis: string; nama: string; peran: string;
  durasi: string; tingkat: string; bidang: string; deskripsi: string;
}

const SAMPLE_ACADEMIC: AcademicItem[] = [
  { id: "1", nama: "Olimpiade Matematika", kategori: "Olimpiade", penyelenggara: "Kemendikbud", tingkat: "Nasional", bidang: "Matematika", peran: "Peserta", hasil: "Juara 1", tanggal: "2024-03" },
  { id: "2", nama: "Kompetisi Data Science ITB", kategori: "Kompetisi", penyelenggara: "Institut Teknologi Bandung", tingkat: "Nasional", bidang: "Teknologi", peran: "Peserta", hasil: "Finalis", tanggal: "2024-01" },
  { id: "3", nama: "Lomba Fisika Tingkat Kota", kategori: "Lomba", penyelenggara: "Dinas Pendidikan DKI", tingkat: "Kota", bidang: "Sains", peran: "Peserta", hasil: "Juara 2", tanggal: "2023-11" },
  { id: "4", nama: "Robotika Competition", kategori: "Kompetisi", penyelenggara: "BRIN", tingkat: "Provinsi", bidang: "Teknologi", peran: "Ketua Tim", hasil: "Juara 3", tanggal: "2023-09" },
];

const SAMPLE_NON_ACADEMIC: NonAcademicItem[] = [
  { id: "1", jenis: "Organisasi", nama: "OSIS SMA Negeri 1", peran: "Ketua", durasi: "2023–2024", tingkat: "Sekolah", bidang: "Kepemimpinan", deskripsi: "Memimpin OSIS dengan 30+ anggota aktif" },
  { id: "2", jenis: "Volunteer", nama: "Volunteer Pendidikan Cerdas", peran: "Pengajar", durasi: "6 bulan", tingkat: "Kota", bidang: "Pendidikan", deskripsi: "Mengajar anak-anak kurang mampu di daerah pinggiran" },
  { id: "3", jenis: "Kepanitiaan", nama: "Pesta Sains Nasional 2024", peran: "PIC Event", durasi: "3 bulan", tingkat: "Nasional", bidang: "STEM", deskripsi: "Koordinator utama acara sains pelajar tingkat nasional" },
  { id: "4", jenis: "Kepelatihan", nama: "Mentoring Olimpiade Junior", peran: "Mentor", durasi: "4 bulan", tingkat: "Sekolah", bidang: "Akademik", deskripsi: "Membimbing 8 siswa kelas X dalam persiapan olimpiade matematika" },
];

const TINGKAT_COLORS: Record<string, string> = {
  Sekolah: "#6b7280", Kota: "#0284c7", Provinsi: "#7c3aed", Nasional: "#0965fa", Internasional: "#ff7000",
};

function TingkatBadge({ tingkat }: { tingkat: string }) {
  const color = TINGKAT_COLORS[tingkat] ?? "#9ca3af";
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: color + "18", color, fontFamily: PP }}>{tingkat}</span>
  );
}

function HasilBadge({ hasil }: { hasil: string }) {
  const isJuara = hasil.toLowerCase().includes("juara");
  const isFinalis = hasil.toLowerCase().includes("finalis");
  const color = isJuara ? "#f1ad00" : isFinalis ? "#00b2dd" : "#6b7280";
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: color + "18", color, fontFamily: PP }}>
      {isJuara && "🥇 "}{hasil}
    </span>
  );
}

// ─── Academic Input ────────────────────────────────────────────────────────────
const KATEGORI_OPTS = ["Olimpiade", "Kompetisi", "Lomba", "Festival", "Pameran", "Riset", "Lainnya"];
const TINGKAT_OPTS = ["Sekolah", "Kota", "Provinsi", "Nasional", "Internasional"];
const BIDANG_AKADEMIK_OPTS = ["Matematika", "Fisika", "Kimia", "Biologi", "Informatika / IT", "Teknologi", "Sains", "Ekonomi", "Bahasa", "Sosial", "Seni & Budaya", "Lainnya"];

function AcademicInputPanel({ items, onAdd, onDelete }: {
  items: AcademicItem[]; onAdd: (item: AcademicItem) => void; onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<AcademicItem>>({ tingkat: "Nasional", kategori: "Olimpiade" });

  function handleSubmit() {
    if (!form.nama || !form.hasil) return;
    onAdd({ ...form, id: Date.now().toString() } as AcademicItem);
    setForm({ tingkat: "Nasional", kategori: "Olimpiade" });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{items.length} prestasi tercatat</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
          <Plus size={13} />Tambah
        </button>
      </div>

      {showForm && (
        <div className="bg-[#f8faff] border-2 border-[#bfdbfe] rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-[13px] font-bold text-[#0965fa]" style={{ fontFamily: PP }}>📋 Tambah Prestasi Akademik</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Field label="Nama Kegiatan" required><Input value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Olimpiade Matematika Nasional" /></Field></div>
            <Field label="Kategori"><Sel value={form.kategori ?? ""} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>{KATEGORI_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <Field label="Tingkat" required><Sel value={form.tingkat ?? ""} onChange={e => setForm(f => ({ ...f, tingkat: e.target.value }))}>{TINGKAT_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <Field label="Penyelenggara"><Input value={form.penyelenggara ?? ""} onChange={e => setForm(f => ({ ...f, penyelenggara: e.target.value }))} placeholder="Kemendikbud" /></Field>
            <Field label="Bidang"><Sel value={form.bidang ?? ""} onChange={e => setForm(f => ({ ...f, bidang: e.target.value }))}><option value="">Pilih Bidang</option>{BIDANG_AKADEMIK_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <Field label="Peran"><Input value={form.peran ?? ""} onChange={e => setForm(f => ({ ...f, peran: e.target.value }))} placeholder="Peserta / Ketua Tim" /></Field>
            <Field label="Hasil / Prestasi" required><Input value={form.hasil ?? ""} onChange={e => setForm(f => ({ ...f, hasil: e.target.value }))} placeholder="Juara 1 / Finalis" /></Field>
            <Field label="Tanggal"><Input type="month" value={form.tanggal ?? ""} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} /></Field>
          </div>
          <div className="border-t border-[#dbeafe] pt-3">
            <div className="flex items-center gap-2 bg-white border border-dashed border-[#93c5fd] rounded-xl p-3 cursor-pointer hover:bg-[#eff6ff] transition-colors">
              <FileText size={16} className="text-[#0965fa]" />
              <span className="text-[12px] text-[#6b7280]" style={{ fontFamily: PP }}>Upload Sertifikat (PDF/JPG) — klik untuk memilih file</span>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-[#6b7280] border border-[rgba(0,0,0,0.1)] hover:bg-[#f5f6fb]" style={{ fontFamily: PP }}>Batal</button>
            <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white" style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP }}>Simpan Prestasi</button>
          </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="bg-white rounded-xl border border-[rgba(0,0,0,0.07)] p-4 hover:border-[#0965fa]/30 transition-all group">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-[13px] font-semibold text-[#1a1d2e] leading-tight" style={{ fontFamily: PP }}>{item.nama}</p>
            <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-[#9ca3af] hover:text-red-400" style={{ outline: "none" }}>
              <Trash2 size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <TingkatBadge tingkat={item.tingkat} />
            <HasilBadge hasil={item.hasil} />
            {item.bidang && <span className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>{item.bidang}</span>}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>
            {item.penyelenggara && <span>{item.penyelenggara}</span>}
            {item.tanggal && <span>· {new Date(item.tanggal + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalysisInviteCard({ onAnalyze, emoji, title, desc, accentColor }: {
  onAnalyze: () => void; emoji: string; title: string; desc: string; accentColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm flex flex-col items-center justify-center py-16 px-8 text-center gap-5">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: accentColor + "14" }}>
        {emoji}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[16px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{title}</p>
        <p className="text-[13px] text-[#9ca3af] leading-relaxed max-w-xs" style={{ fontFamily: PP }}>{desc}</p>
      </div>
      <button onClick={onAnalyze}
        className="flex items-center gap-2 px-7 py-3 rounded-xl text-[13px] font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`, fontFamily: PP, outline: "none" }}>
        <Sparkles size={15} />
        Analisis dengan AI
      </button>
      <p className="text-[11px] text-[#c4c9d4]" style={{ fontFamily: PP }}>AI akan menganalisis data yang sudah kamu masukkan</p>
    </div>
  );
}

function AcademicAIPanel({ items, analyzed, onAnalyze }: { items: AcademicItem[]; analyzed: boolean; onAnalyze: () => void }) {
  const hasData = items.length > 0;
  const competencies = [
    { name: "Problem Solving", pct: Math.min(99, 80 + items.filter(i => i.bidang?.includes("Mat") || i.bidang?.includes("Fisika") || i.bidang?.includes("Informatika")).length * 4 + 10), desc: "Kemampuan menyelesaikan tantangan secara sistematis.", color: "#0965fa" },
    { name: "Analytical Thinking", pct: Math.min(99, 78 + items.filter(i => i.tingkat === "Nasional" || i.tingkat === "Internasional").length * 4), desc: "Kemampuan menganalisis informasi dan menyelesaikan persoalan secara logis.", color: "#00b2dd" },
    { name: "Learning Agility", pct: Math.min(99, 75 + items.length * 3), desc: "Kemampuan mempelajari hal baru dengan cepat.", color: "#8b5cf6" },
    { name: "Critical Thinking", pct: Math.min(99, 74 + items.filter(i => i.kategori === "Riset" || i.hasil.toLowerCase().includes("juara")).length * 5 + 10), desc: "Kemampuan mengevaluasi informasi dan mengambil keputusan berdasarkan bukti.", color: "#22c55e" },
    { name: "Research & Inquiry", pct: Math.min(99, 70 + items.filter(i => i.bidang?.includes("Sains") || i.kategori === "Riset").length * 5 + 10), desc: "Kemampuan mencari informasi, investigasi, dan memahami konsep mendalam.", color: "#f1ad00" },
  ];

  const nationalOrHigher = items.filter(i => i.tingkat === "Nasional" || i.tingkat === "Internasional");
  const winners = items.filter(i => i.hasil.toLowerCase().includes("juara 1") || i.hasil.toLowerCase().includes("juara i"));

  if (!analyzed) {
    return <AnalysisInviteCard onAnalyze={onAnalyze} emoji="🧠" title="Siap dianalisis oleh AI!" desc="Klik tombol di bawah untuk menganalisis prestasi akademikmu dan mendapatkan Academic Competency Profile yang personal." accentColor="#0965fa" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {!hasData ? (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-10 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">🧠</span>
          <p className="text-[14px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Tambahkan prestasi untuk melihat analisis AI</p>
          <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>AI akan menganalisis pola kompetensi akademik dari riwayat prestasimu.</p>
        </div>
      ) : (
        <>
          {/* Competency Profile Card */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">🧠</span>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Academic Competency Profile</p>
              </div>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Dianalisis dari {items.length} prestasi akademik</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-0">
              {competencies.map((c, i) => (
                <div key={c.name}>
                  <div className="py-3.5">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{c.name}</span>
                      <span className="text-[15px] font-bold" style={{ color: c.color, fontFamily: PP }}>{c.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                    <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{c.desc}</p>
                  </div>
                  {i < competencies.length - 1 && <div className="border-t border-[rgba(0,0,0,0.05)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Card */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">📈</span>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Evidence</p>
              </div>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Mengapa AI menyimpulkan demikian?</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-2">
              {items.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{item.hasil} {item.nama}</span>
                    <span className="text-[11px] text-[#9ca3af] ml-1.5" style={{ fontFamily: PP }}>· {item.tingkat}</span>
                  </div>
                </div>
              ))}
              {winners.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#0965fa] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>
                      {winners.length > 1 ? `${winners.length}× Juara 1` : "Juara 1"} di kompetisi bergengsi
                    </span>
                  </div>
                </div>
              )}
              {nationalOrHigher.length > 0 && (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-[#0965fa] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>
                    {nationalOrHigher.length} prestasi tingkat Nasional / Internasional
                  </span>
                </div>
              )}
              <div className="mt-4 bg-gradient-to-r from-[#eff6ff] to-[#e0f2fe] rounded-xl p-4">
                <p className="text-[11px] font-bold text-[#0965fa] mb-1.5" style={{ fontFamily: PP }}>Analisis AI</p>
                <p className="text-[12px] text-[#374151] leading-relaxed italic" style={{ fontFamily: PP }}>
                  "Pola prestasi menunjukkan kompetensi akademik kuat khususnya pada bidang STEM. Kemampuan problem solving dan analytical thinking berada di atas rata-rata berdasarkan tingkat kompetisi yang diikuti."
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Non-Academic Input ────────────────────────────────────────────────────────
const JENIS_NON_OPTS = ["Organisasi", "Volunteer", "Kepanitiaan", "Kepelatihan", "Komunitas", "UKM", "Sertifikat"];
const BIDANG_NON_OPTS = ["Kepemimpinan", "Pendidikan", "Lingkungan", "Sosial", "Kesehatan", "STEM", "Seni & Budaya", "Olahraga", "Akademik", "Bisnis", "Lainnya"];
const JENIS_COLORS: Record<string, string> = {
  Organisasi: "#0965fa", Volunteer: "#22c55e", Kepanitiaan: "#f1ad00",
  Kepelatihan: "#8b5cf6", Komunitas: "#00b2dd", UKM: "#ec4899", Sertifikat: "#6b7280",
};

function NonAcademicInputPanel({ items, onAdd, onDelete }: {
  items: NonAcademicItem[]; onAdd: (item: NonAcademicItem) => void; onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<NonAcademicItem>>({ jenis: "Organisasi", tingkat: "Sekolah" });

  function handleSubmit() {
    if (!form.nama || !form.peran) return;
    onAdd({ ...form, id: Date.now().toString() } as NonAcademicItem);
    setForm({ jenis: "Organisasi", tingkat: "Sekolah" });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{items.length} kegiatan tercatat</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(90deg,#ff7000,#f1ad00)", fontFamily: PP, outline: "none" }}>
          <Plus size={13} />Tambah
        </button>
      </div>

      {showForm && (
        <div className="bg-[#fffbf5] border-2 border-[#fed7aa] rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-[13px] font-bold text-[#ff7000]" style={{ fontFamily: PP }}>📋 Tambah Kegiatan Non-Akademik</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jenis Kegiatan"><Sel value={form.jenis ?? ""} onChange={e => setForm(f => ({ ...f, jenis: e.target.value }))}>{JENIS_NON_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <Field label="Tingkat"><Sel value={form.tingkat ?? ""} onChange={e => setForm(f => ({ ...f, tingkat: e.target.value }))}>{TINGKAT_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <div className="col-span-2"><Field label="Nama Kegiatan" required><Input value={form.nama ?? ""} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="OSIS, Paskibraka, dst." /></Field></div>
            <Field label="Peran" required><Input value={form.peran ?? ""} onChange={e => setForm(f => ({ ...f, peran: e.target.value }))} placeholder="Ketua, Anggota, PIC" /></Field>
            <Field label="Durasi"><Input value={form.durasi ?? ""} onChange={e => setForm(f => ({ ...f, durasi: e.target.value }))} placeholder="2023–2024 / 6 bulan" /></Field>
            <Field label="Bidang"><Sel value={form.bidang ?? ""} onChange={e => setForm(f => ({ ...f, bidang: e.target.value }))}><option value="">Pilih Bidang</option>{BIDANG_NON_OPTS.map(o => <option key={o}>{o}</option>)}</Sel></Field>
            <div className="col-span-2"><Field label="Deskripsi Singkat"><Input value={form.deskripsi ?? ""} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Ceritakan singkat peran dan kontribusimu..." /></Field></div>
          </div>
          <div className="border-t border-[#fed7aa] pt-3">
            <div className="flex items-center gap-2 bg-white border border-dashed border-[#fbbf24] rounded-xl p-3 cursor-pointer hover:bg-[#fffbf5] transition-colors">
              <FileText size={16} className="text-[#ff7000]" />
              <span className="text-[12px] text-[#6b7280]" style={{ fontFamily: PP }}>Upload Sertifikat (PDF/JPG) — opsional</span>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-[#6b7280] border border-[rgba(0,0,0,0.1)] hover:bg-[#f5f6fb]" style={{ fontFamily: PP }}>Batal</button>
            <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white" style={{ background: "linear-gradient(90deg,#ff7000,#f1ad00)", fontFamily: PP }}>Simpan Kegiatan</button>
          </div>
        </div>
      )}

      {items.map(item => {
        const color = JENIS_COLORS[item.jenis] ?? "#9ca3af";
        return (
          <div key={item.id} className="bg-white rounded-xl border border-[rgba(0,0,0,0.07)] p-4 hover:border-[#ff7000]/30 transition-all group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{item.nama}</p>
                <p className="text-[12px] font-medium mt-0.5" style={{ color, fontFamily: PP }}>{item.peran}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: color + "18", color, fontFamily: PP }}>{item.jenis}</span>
                <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-[#9ca3af] hover:text-red-400" style={{ outline: "none" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>
              {item.durasi && <span>{item.durasi}</span>}
              {item.tingkat && <TingkatBadge tingkat={item.tingkat} />}
              {item.bidang && <span>· {item.bidang}</span>}
            </div>
            {item.deskripsi && <p className="text-[12px] text-[#6b7280] mt-2 leading-relaxed" style={{ fontFamily: PP }}>{item.deskripsi}</p>}
          </div>
        );
      })}
    </div>
  );
}

function NonAcademicAIPanel({ items, analyzed, onAnalyze }: { items: NonAcademicItem[]; analyzed: boolean; onAnalyze: () => void }) {
  const hasData = items.length > 0;

  const leaderCount = items.filter(i => ["Ketua", "Koordinator", "PIC"].some(r => i.peran?.includes(r))).length;
  const volunteerCount = items.filter(i => i.jenis === "Volunteer" || i.jenis === "Komunitas").length;
  const orgCount = items.filter(i => i.jenis === "Organisasi" || i.jenis === "UKM").length;
  const eventCount = items.filter(i => i.jenis === "Kepanitiaan").length;

  const skills = [
    { name: "Leadership", pct: Math.min(99, 70 + leaderCount * 10 + orgCount * 5), desc: "Kemampuan memimpin dan mengambil keputusan.", color: "#0965fa" },
    { name: "Collaboration", pct: Math.min(99, 72 + items.length * 4), desc: "Kemampuan bekerja dalam tim secara efektif.", color: "#22c55e" },
    { name: "Responsibility", pct: Math.min(99, 75 + items.length * 3 + eventCount * 4), desc: "Kemampuan menyelesaikan tugas secara konsisten.", color: "#8b5cf6" },
    { name: "Initiative", pct: Math.min(99, 70 + leaderCount * 6 + volunteerCount * 5), desc: "Kemampuan mengambil tindakan secara mandiri.", color: "#f1ad00" },
    { name: "Communication", pct: Math.min(99, 70 + eventCount * 6 + orgCount * 4), desc: "Kemampuan menyampaikan ide secara efektif.", color: "#00b2dd" },
    { name: "Adaptability", pct: Math.min(99, 68 + items.length * 3 + volunteerCount * 4), desc: "Kemampuan beradaptasi pada lingkungan baru.", color: "#ec4899" },
  ];

  const radarData = skills.map(s => ({ subject: s.name, value: s.pct }));

  if (!analyzed) {
    return <AnalysisInviteCard onAnalyze={onAnalyze} emoji="🤝" title="Siap dianalisis oleh AI!" desc="Klik tombol di bawah untuk menganalisis kegiatan non-akademikmu dan mendapatkan Soft Skill Profile yang dipetakan secara personal." accentColor="#ff7000" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {!hasData ? (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-10 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">🤝</span>
          <p className="text-[14px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Tambahkan kegiatan untuk melihat analisis AI</p>
          <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>AI akan memetakan soft skill dari riwayat kegiatan non-akademik.</p>
        </div>
      ) : (
        <>
          {/* Soft Skill Profile */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">🤝</span>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Soft Skill Profile</p>
              </div>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Dianalisis dari {items.length} kegiatan non-akademik</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-0">
              {skills.map((s, i) => (
                <div key={s.name}>
                  <div className="py-3">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{s.name}</span>
                      <span className="text-[15px] font-bold" style={{ color: s.color, fontFamily: PP }}>{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                    <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{s.desc}</p>
                  </div>
                  {i < skills.length - 1 && <div className="border-t border-[rgba(0,0,0,0.05)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Soft Skill Radar</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: PP, fill: "#6b7280" }} />
                  <Radar name="Skills" dataKey="value" stroke="#0965fa" fill="#0965fa" fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">📈</span>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Evidence</p>
              </div>
              <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Mengapa AI menyimpulkan demikian?</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-2">
              {items.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>
                    {item.peran} — {item.nama}
                    <span className="font-normal text-[#9ca3af] ml-1.5 text-[11px]">· {item.jenis} · {item.tingkat}</span>
                  </span>
                </div>
              ))}
              <div className="mt-4 bg-gradient-to-r from-[#fff7ed] to-[#fef3c7] rounded-xl p-4">
                <p className="text-[11px] font-bold text-[#ff7000] mb-1.5" style={{ fontFamily: PP }}>Analisis AI</p>
                <p className="text-[12px] text-[#374151] leading-relaxed italic" style={{ fontFamily: PP }}>
                  "Profil non-akademik menunjukkan kemampuan kepemimpinan dan kolaborasi yang kuat. Aktif dalam berbagai kegiatan sosial dan organisasi mencerminkan inisiatif tinggi dan tanggung jawab yang baik."
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PrestasiPage() {
  const [activeTab, setActiveTab] = useState<PrestasiSubTab>("akademik");
  const [academicItems, setAcademicItems] = useState<AcademicItem[]>(SAMPLE_ACADEMIC);
  const [nonAcademicItems, setNonAcademicItems] = useState<NonAcademicItem[]>(SAMPLE_NON_ACADEMIC);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1 bg-[#f0f2f8] p-1 rounded-xl w-fit">
        {([
          { key: "akademik" as PrestasiSubTab, label: "Prestasi Akademik", emoji: "🏆" },
          { key: "non-akademik" as PrestasiSubTab, label: "Prestasi Non-Akademik", emoji: "🤝" },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all ${activeTab === tab.key ? "bg-white text-[#1a1d2e] shadow-sm" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
            style={{ fontFamily: PP, outline: "none" }}>
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "akademik" && (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🏆</span>
            <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Prestasi Akademik</p>
          </div>
          <p className="text-[12px] text-[#9ca3af] mb-5" style={{ fontFamily: PP }}>Olimpiade, kompetisi, lomba sains, dan prestasi akademik lainnya</p>
          <AcademicInputPanel items={academicItems} onAdd={item => setAcademicItems(p => [item, ...p])} onDelete={id => setAcademicItems(p => p.filter(i => i.id !== id))} />
        </div>
      )}

      {activeTab === "non-akademik" && (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🤝</span>
            <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Prestasi Non-Akademik</p>
          </div>
          <p className="text-[12px] text-[#9ca3af] mb-5" style={{ fontFamily: PP }}>Organisasi, volunteer, kepanitiaan, komunitas, UKM, dan sertifikat</p>
          <NonAcademicInputPanel items={nonAcademicItems} onAdd={item => setNonAcademicItems(p => [item, ...p])} onDelete={id => setNonAcademicItems(p => p.filter(i => i.id !== id))} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NILAI RAPOR PAGE
// ═══════════════════════════════════════════════════════════════════════════════
// Mata pelajaran untuk chart tren
const MATA_PELAJARAN = [
  { key: "b_indo",    label: "Bhs. Indonesia", color: "#f1ad00" },
  { key: "matematika",label: "Matematika",     color: "#0965fa" },
  { key: "fisika",    label: "Fisika",         color: "#00b2dd" },
  { key: "kimia",     label: "Kimia",          color: "#8b5cf6" },
  { key: "biologi",   label: "Biologi",        color: "#22c55e" },
  { key: "b_ing",     label: "Bhs. Inggris",   color: "#ff7000" },
];


// ═══════════════════════════════════════════════════════════════════════════════
// BIODATA FORM
// ═══════════════════════════════════════════════════════════════════════════════
interface FormData {
  namaLengkap: string; namaPanggilan: string; nis: string; nisn: string;
  tempatLahir: string; tanggalLahir: string; jenisKelamin: string; agama: string;
  golonganDarah: string; kelas: string; jurusan: string; angkatan: string;
  alamatLengkap: string; rt: string; rw: string; kelurahan: string;
  kecamatan: string; kota: string; provinsi: string; kodePos: string;
  noHP: string; email: string; asalSekolah: string;
  namaAyah: string; namaIbu: string; pekerjaanAyah: string; pekerjaanIbu: string; noHPOrangtua: string;
  // Kondisi Keluarga
  statusOrangtua: string; tinggalBersama: string;
  pendidikanAyah: string; pendidikanIbu: string;
  kondisiSosialEkonomi: string;
  anakKe: string; jumlahSaudaraKandung: string;
  // Kondisi Khusus
  berkebutuhanKhusus: string;
  riwayatPenyakit: string; catatanTambahan: string;
}

const INIT_FORM: FormData = {
  namaLengkap: "Ahmad Rizki Pratama", namaPanggilan: "Rizki", nis: "2425001234", nisn: "0087654321",
  tempatLahir: "Jakarta", tanggalLahir: "2007-05-15", jenisKelamin: "Laki-laki", agama: "Islam",
  golonganDarah: "O", kelas: "XII", jurusan: "IPA", angkatan: "2022",
  alamatLengkap: "Jl. Mawar No. 12", rt: "003", rw: "005", kelurahan: "Kelapa Gading Barat",
  kecamatan: "Kelapa Gading", kota: "Jakarta Utara", provinsi: "DKI Jakarta", kodePos: "14240",
  noHP: "081234567890", email: "ahmad.rizki@student.orbita.sch.id", asalSekolah: "SMP Negeri 5 Jakarta",
  namaAyah: "Budi Pratama", namaIbu: "Siti Rahma", pekerjaanAyah: "Wiraswasta", pekerjaanIbu: "Ibu Rumah Tangga", noHPOrangtua: "081298765432",
  statusOrangtua: "Orang tua lengkap", tinggalBersama: "Ayah & Ibu",
  pendidikanAyah: "Sarjana", pendidikanIbu: "Sarjana",
  kondisiSosialEkonomi: "Baik",
  anakKe: "1", jumlahSaudaraKandung: "2",
  berkebutuhanKhusus: "tidak",
  riwayatPenyakit: "", catatanTambahan: "",
};

function BiodataForm({ formData, onChange, onSave, saved }: { formData: FormData; onChange: (k: keyof FormData, v: string) => void; onSave: () => void; saved: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [penerimaProgram, setPenerimaProgram] = useState<string[]>([]);
  const [jenisKebutuhan, setJenisKebutuhan] = useState<string[]>([]);

  function toggleArr(arr: string[], setArr: (a: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  const PENDIDIKAN_OPT = ["Tidak Sekolah", "SD", "SMP", "SMA/SMK", "Diploma", "Sarjana", "Pascasarjana", "Tidak diketahui"];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading title="Data Diri Siswa" subtitle="Informasi identitas resmi siswa" accent="linear-gradient(180deg,#0965fa,#00b2dd)" />
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border-2 border-[#0965fa]/20 cursor-pointer group" onClick={() => fileRef.current?.click()}>
              {avatarUrl ? <img src={avatarUrl} alt="foto" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl font-bold text-[#0965fa]" style={{ fontFamily: PP }}>AR</span></div>}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={20} className="text-white" /></div>
            </div>
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setAvatarUrl(URL.createObjectURL(f)); }} />
            <button onClick={() => fileRef.current?.click()} className="text-[11px] text-[#0965fa] font-medium hover:underline" style={{ fontFamily: PP, outline: "none" }}>Ubah Foto</button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Nama Lengkap" required><Input value={formData.namaLengkap} onChange={e => onChange("namaLengkap", e.target.value)} /></Field></div>
            <Field label="Nama Panggilan"><Input value={formData.namaPanggilan} onChange={e => onChange("namaPanggilan", e.target.value)} /></Field>
            <Field label="Jenis Kelamin" required><Sel value={formData.jenisKelamin} onChange={e => onChange("jenisKelamin", e.target.value)}><option>Laki-laki</option><option>Perempuan</option></Sel></Field>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="NIS" required><Input value={formData.nis} onChange={e => onChange("nis", e.target.value)} /></Field>
          <Field label="NISN" required><Input value={formData.nisn} onChange={e => onChange("nisn", e.target.value)} /></Field>
          <Field label="Agama" required><Sel value={formData.agama} onChange={e => onChange("agama", e.target.value)}>{["Islam","Kristen Protestan","Kristen Katolik","Hindu","Buddha","Konghucu"].map(a => <option key={a}>{a}</option>)}</Sel></Field>
          <Field label="Golongan Darah"><Sel value={formData.golonganDarah} onChange={e => onChange("golonganDarah", e.target.value)}>{["A","B","AB","O","Tidak diketahui"].map(g => <option key={g}>{g}</option>)}</Sel></Field>
          <Field label="Kelas" required><Sel value={formData.kelas} onChange={e => onChange("kelas", e.target.value)}>{["X","XI","XII"].map(k => <option key={k}>{k}</option>)}</Sel></Field>
          <Field label="Jurusan" required><Sel value={formData.jurusan} onChange={e => onChange("jurusan", e.target.value)}>{["IPA","IPS","Bahasa","Teknik","Kesehatan","Seni"].map(j => <option key={j}>{j}</option>)}</Sel></Field>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading title="Informasi Kelahiran" accent="linear-gradient(180deg,#00b2dd,#0965fa)" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tempat Lahir" required><Input value={formData.tempatLahir} onChange={e => onChange("tempatLahir", e.target.value)} /></Field>
          <Field label="Tanggal Lahir" required><Input type="date" value={formData.tanggalLahir} onChange={e => onChange("tanggalLahir", e.target.value)} /></Field>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading title="Alamat Tempat Tinggal" accent="linear-gradient(180deg,#ff7000,#f1ad00)" />
        <div className="flex flex-col gap-4">
          <Field label="Alamat Lengkap" required><Textarea value={formData.alamatLengkap} onChange={e => onChange("alamatLengkap", e.target.value)} rows={2} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="RT"><Input value={formData.rt} onChange={e => onChange("rt", e.target.value)} /></Field>
            <Field label="RW"><Input value={formData.rw} onChange={e => onChange("rw", e.target.value)} /></Field>
            <Field label="Kelurahan / Desa" required><Input value={formData.kelurahan} onChange={e => onChange("kelurahan", e.target.value)} /></Field>
            <Field label="Kecamatan" required><Input value={formData.kecamatan} onChange={e => onChange("kecamatan", e.target.value)} /></Field>
            <Field label="Kota / Kabupaten" required><Input value={formData.kota} onChange={e => onChange("kota", e.target.value)} /></Field>
            <Field label="Provinsi" required><Sel value={formData.provinsi} onChange={e => onChange("provinsi", e.target.value)}>{["DKI Jakarta","Jawa Barat","Jawa Tengah","Jawa Timur","Banten","DI Yogyakarta","Sumatera Utara","Kalimantan Timur","Sulawesi Selatan","Bali","Lainnya"].map(p => <option key={p}>{p}</option>)}</Sel></Field>
            <Field label="Kode Pos"><Input value={formData.kodePos} onChange={e => onChange("kodePos", e.target.value)} maxLength={5} /></Field>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading title="Informasi Kontak" accent="linear-gradient(180deg,#0965fa,#00b2dd)" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="No. HP / WhatsApp" required><Input value={formData.noHP} onChange={e => onChange("noHP", e.target.value)} type="tel" /></Field>
          <Field label="Email Siswa" required><Input value={formData.email} onChange={e => onChange("email", e.target.value)} type="email" /></Field>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading title="Data Orang Tua / Wali" accent="linear-gradient(180deg,#ff7000,#f1ad00)" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama Ayah"><Input value={formData.namaAyah} onChange={e => onChange("namaAyah", e.target.value)} /></Field>
          <Field label="Pekerjaan Ayah"><Input value={formData.pekerjaanAyah} onChange={e => onChange("pekerjaanAyah", e.target.value)} /></Field>
          <Field label="Nama Ibu"><Input value={formData.namaIbu} onChange={e => onChange("namaIbu", e.target.value)} /></Field>
          <Field label="Pekerjaan Ibu"><Input value={formData.pekerjaanIbu} onChange={e => onChange("pekerjaanIbu", e.target.value)} /></Field>
          <div className="col-span-2"><Field label="No. HP Orang Tua / Wali" required><Input value={formData.noHPOrangtua} onChange={e => onChange("noHPOrangtua", e.target.value)} type="tel" /></Field></div>
        </div>
      </div>
      {/* ── Section 6: Kondisi Keluarga ── */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading
          title="Kondisi Keluarga"
          subtitle="Informasi ini membantu Guru BK dan Wali Kelas memahami latar belakang siswa secara lebih menyeluruh. Data akan dijaga kerahasiaannya dan hanya dapat diakses oleh pihak sekolah yang berwenang."
          accent="linear-gradient(180deg,#8b5cf6,#0965fa)"
        />
        <div className="grid grid-cols-2 gap-4">
          {/* A. Status Orang Tua */}
          <Field label="Status Orang Tua">
            <Sel value={formData.statusOrangtua} onChange={e => onChange("statusOrangtua", e.target.value)}>
              {["Orang tua lengkap","Tinggal dengan Ayah","Tinggal dengan Ibu","Tinggal dengan Wali","Orang tua bercerai","Ayah meninggal","Ibu meninggal","Yatim Piatu"].map(o => <option key={o}>{o}</option>)}
            </Sel>
          </Field>

          {/* B. Tinggal Bersama */}
          <Field label="Tinggal Bersama">
            <Sel value={formData.tinggalBersama} onChange={e => onChange("tinggalBersama", e.target.value)}>
              {["Ayah & Ibu","Ayah","Ibu","Wali","Saudara","Asrama","Lainnya"].map(o => <option key={o}>{o}</option>)}
            </Sel>
          </Field>

          {/* C. Pendidikan Orang Tua */}
          <Field label="Pendidikan Ayah">
            <Sel value={formData.pendidikanAyah} onChange={e => onChange("pendidikanAyah", e.target.value)}>
              {PENDIDIKAN_OPT.map(o => <option key={o}>{o}</option>)}
            </Sel>
          </Field>
          <Field label="Pendidikan Ibu">
            <Sel value={formData.pendidikanIbu} onChange={e => onChange("pendidikanIbu", e.target.value)}>
              {PENDIDIKAN_OPT.map(o => <option key={o}>{o}</option>)}
            </Sel>
          </Field>

          {/* D. Pekerjaan Orang Tua — already in section 5, skip */}

          {/* E. Kondisi Sosial Ekonomi */}
          <div className="col-span-2">
            <Field label="Kondisi Sosial Ekonomi Keluarga">
              <Sel value={formData.kondisiSosialEkonomi} onChange={e => onChange("kondisiSosialEkonomi", e.target.value)}>
                {["Sangat Baik","Baik","Cukup","Membutuhkan Dukungan"].map(o => <option key={o}>{o}</option>)}
              </Sel>
            </Field>
            <div className="mt-3 flex flex-wrap gap-3">
              {["Penerima PIP","Penerima KIP","Penerima Beasiswa","Tidak Ada"].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => toggleArr(penerimaProgram, setPenerimaProgram, opt)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${penerimaProgram.includes(opt) ? "border-[#0965fa] bg-[#0965fa]" : "border-[#d1d5db] bg-white"}`}
                  >
                    {penerimaProgram.includes(opt) && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* F. Informasi Saudara */}
          <Field label="Anak ke-">
            <Input type="number" min={1} max={20} value={formData.anakKe} onChange={e => onChange("anakKe", e.target.value)} placeholder="1" />
          </Field>
          <Field label="Jumlah Saudara Kandung">
            <Input type="number" min={0} max={20} value={formData.jumlahSaudaraKandung} onChange={e => onChange("jumlahSaudaraKandung", e.target.value)} placeholder="0" />
          </Field>
        </div>
      </div>

      {/* ── Section 7: Kondisi Khusus ── */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
        <SectionHeading
          title="Kondisi Khusus"
          subtitle="Informasi ini membantu sekolah memberikan pendampingan dan layanan belajar yang sesuai dengan kebutuhan siswa."
          accent="linear-gradient(180deg,#22c55e,#00b2dd)"
        />
        <div className="flex flex-col gap-5">
          {/* A. Berkebutuhan Khusus */}
          <Field label="Berkebutuhan Khusus">
            <div className="flex gap-6 mt-1">
              {["tidak", "ya"].map(opt => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => onChange("berkebutuhanKhusus", opt)}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${formData.berkebutuhanKhusus === opt ? "border-[#0965fa]" : "border-[#d1d5db]"}`}
                  >
                    {formData.berkebutuhanKhusus === opt && <div className="w-2 h-2 rounded-full bg-[#0965fa]" />}
                  </div>
                  <span className="text-[13px] text-[#374151] capitalize" style={{ fontFamily: PP }}>{opt === "tidak" ? "Tidak" : "Ya"}</span>
                </label>
              ))}
            </div>
          </Field>

          {/* Collapsible jenis kebutuhan */}
          {formData.berkebutuhanKhusus === "ya" && (
            <div className="rounded-xl border border-[rgba(0,0,0,0.07)] p-4 bg-[#f8fafc]">
              <p className="text-[12px] font-semibold text-[#374151] mb-3" style={{ fontFamily: PP }}>Jenis Kebutuhan</p>
              <div className="grid grid-cols-2 gap-2.5">
                {["Disleksia","ADHD","Gangguan Penglihatan","Gangguan Pendengaran","Autism Spectrum","Disabilitas Fisik","Lainnya"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => toggleArr(jenisKebutuhan, setJenisKebutuhan, opt)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${jenisKebutuhan.includes(opt) ? "border-[#0965fa] bg-[#0965fa]" : "border-[#d1d5db] bg-white"}`}
                    >
                      {jenisKebutuhan.includes(opt) && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[12px] text-[#374151]" style={{ fontFamily: PP }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* B. Riwayat Penyakit */}
          <Field label="Riwayat Penyakit (Opsional)">
            <Textarea
              rows={3}
              value={formData.riwayatPenyakit}
              onChange={e => onChange("riwayatPenyakit", e.target.value)}
              placeholder="Tuliskan riwayat penyakit atau kondisi kesehatan yang perlu diketahui sekolah."
            />
          </Field>

          {/* C. Catatan Tambahan */}
          <Field label="Catatan Tambahan (Opsional)">
            <Textarea
              rows={3}
              value={formData.catatanTambahan}
              onChange={e => onChange("catatanTambahan", e.target.value)}
              placeholder="Tambahkan informasi lain yang perlu diketahui Guru BK atau Wali Kelas."
            />
          </Field>
        </div>
      </div>

      {/* ── Privacy Notice ── */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-[#f8fafc] border border-[rgba(0,0,0,0.06)]">
        <Shield size={15} className="shrink-0 mt-0.5 text-[#94a3b8]" />
        <div>
          <p className="text-[12px] font-semibold text-[#374151] mb-0.5" style={{ fontFamily: PP }}>Privasi Data</p>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed" style={{ fontFamily: PP }}>
            Informasi pada bagian Kondisi Keluarga dan Kondisi Khusus bersifat rahasia dan hanya dapat diakses oleh Guru BK serta Wali Kelas untuk keperluan pendampingan siswa.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] px-6 py-4 shadow-sm sticky bottom-4">
        <div className="flex items-center gap-2">
          {saved ? <><CheckCircle2 size={16} className="text-green-500" /><span className="text-[13px] text-green-600 font-medium" style={{ fontFamily: PP }}>Data berhasil disimpan</span></> : <><AlertCircle size={16} className="text-[#f1ad00]" /><span className="text-[13px] text-[#9ca3af]" style={{ fontFamily: PP }}>Ada perubahan yang belum disimpan</span></>}
        </div>
        <button onClick={onSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
          style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
          <Save size={14} />Simpan Data
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT PROFILING
// ═══════════════════════════════════════════════════════════════════════════════
function CompletionBadge({ pct }: { pct: number }) {
  const color = pct === 100 ? "#22c55e" : pct >= 60 ? "#0965fa" : "#f1ad00";
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] px-5 py-3 shadow-sm">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#f0f2f8" strokeWidth="4" />
          <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${(pct / 100) * 100.53} 100.53`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color, fontFamily: PP }}>{pct}%</span>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Kelengkapan Profil</p>
        <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{pct < 100 ? "Lengkapi untuk analisis terbaik" : "Profil sudah lengkap!"}</p>
      </div>
    </div>
  );
}

// ─── SNBP Planner ─────────────────────────────────────────────────────────────
function StudentProfiling({ activeTab, setActiveTab }: { activeTab: ProfileTab; setActiveTab: (t: ProfileTab) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-5 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Dashboard</span>
              <span className="text-[12px] text-[#9ca3af]">/</span>
              <span className="text-[12px] font-medium text-[#0965fa]" style={{ fontFamily: PP }}>Analisis Potensi</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Analisis Potensi</h1>
            <p className="text-[13px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Gambaran minat, prestasi, dan nilai akademikmu</p>
          </div>
          <CompletionBadge pct={78} />
        </div>
        <ProfileTabs active={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        {activeTab === "minat-bakat" && <MinatBakatPage />}
        {activeTab === "prestasi" && <PrestasiPage />}
        {activeTab === "nilai-rapor" && <NilaiRaporPage />}
      </div>
    </div>
  );
}

function InformasiPribadiPage({ onClose, defaultTab = "data-diri" }: { onClose: () => void; defaultTab?: InfoPribadiTab }) {
  const [formData, setFormData] = useState<FormData>(INIT_FORM);
  const [saved, setSaved] = useState(true);
  const [activeTab, setActiveTab] = useState<InfoPribadiTab>(defaultTab);

  const TABS: { key: InfoPribadiTab; label: string; emoji: string }[] = [
    { key: "data-diri", label: "Data Diri", emoji: "👤" },
    { key: "prestasi", label: "Prestasi", emoji: "🏆" },
    { key: "nilai-rapor", label: "Nilai Rapor", emoji: "📊" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Dashboard</span>
              <span className="text-[12px] text-[#9ca3af]">/</span>
              <span className="text-[12px] font-medium text-[#0965fa]" style={{ fontFamily: PP }}>Informasi & Profil Siswa</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Informasi & Profil Siswa</h1>
            <p className="text-[13px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Data diri, prestasi, dan nilai rapor</p>
          </div>
          <button onClick={onClose} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-[#f5f6fb] transition-colors" style={{ color: "#6b7280", fontFamily: PP, outline: "none" }}>
            ← Kembali
          </button>
        </div>
        <div className="flex gap-1 bg-[#f0f2f8] p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${activeTab === t.key ? "bg-white text-[#1a1d2e] shadow-sm" : "text-[#9ca3af] hover:text-[#6b7280]"}`}
              style={{ fontFamily: PP, outline: "none" }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        {activeTab === "data-diri" && (
          <BiodataForm formData={formData} onChange={(k, v) => { setFormData(p => ({ ...p, [k]: v })); setSaved(false); }} onSave={() => setSaved(true)} saved={saved} />
        )}
        {activeTab === "prestasi" && <PrestasiPage />}
        {activeTab === "nilai-rapor" && <NilaiRaporPage />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>("landing");
  const [activeTab, setActiveTab] = useState<ProfileTab>("minat-bakat");
  const [showInfoPribadi, setShowInfoPribadi] = useState(false);
  const [infoPribadiTab, setInfoPribadiTab] = useState<InfoPribadiTab>("data-diri");
  const [currentUser, setCurrentUser] = useState<OrbitaUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      hari: "Selasa",
      tanggal: "2026-07-08",
      jam: "10.00",
      topik: "Pemilihan Jurusan",
      status: "selesai",
      catatanHasil: "Siswa telah mendiskusikan pilihan jurusan Teknik Informatika dan Sistem Informasi. Berdasarkan minat dan nilai rapor, Teknik Informatika dinilai lebih sesuai. Siswa disarankan untuk mempersiapkan portofolio dan meningkatkan nilai Matematika.",
      rekomendasiGuru: [
        "Ikuti lomba pemrograman untuk memperkuat portofolio.",
        "Tingkatkan nilai Matematika agar nilai rapor lebih kompetitif.",
        "Kunjungi open day kampus tujuan untuk mengenal lingkungan kampus.",
      ],
    },
    {
      id: "2",
      hari: "Kamis",
      tanggal: "2026-07-17",
      jam: "09.00",
      topik: "Motivasi Belajar",
      status: "selesai",
      catatanHasil: "Siswa mengalami penurunan semangat belajar menjelang ujian. Diberikan teknik manajemen waktu dan strategi belajar yang lebih efektif. Siswa diminta untuk membuat jadwal belajar harian dan melaporkan perkembangannya.",
      rekomendasiGuru: [
        "Buat jadwal belajar harian yang realistis dan konsisten.",
        "Gunakan teknik Pomodoro untuk menjaga fokus belajar.",
        "Lakukan konsultasi lanjutan jika tekanan belajar berlanjut.",
      ],
    },
    {
      id: "3",
      hari: "Senin",
      tanggal: "2026-07-28",
      jam: "11.00",
      topik: "Perencanaan Karir",
      status: "menunggu",
    },
  ]);

  // Restore session on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      getMeApi()
        .then(data => {
          setCurrentUser(mapUser(data.user));
          setActivePage("dashboard");
        })
        .catch(() => {
          // token mungkin expired atau backend offline — clear saja
          removeAuthToken();
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  function handleLoginSuccess(user: OrbitaUser) {
    setCurrentUser(user);
    setShowLoginModal(false);
    setActivePage("dashboard");
  }

  function handleLogout() {
    removeAuthToken();
    setCurrentUser(null);
    setActivePage("landing");
  }

  function addBooking(b: Booking) {
    setBookings(prev => [b, ...prev]);
  }

  // Loading screen saat cek token
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-white" />
          <p className="text-white/80 text-sm font-medium" style={{ fontFamily: PP }}>Memuat ORBITA...</p>
        </div>
      </div>
    );
  }

  // Landing page + login modal
  if (activePage === "landing" || !currentUser) {
    return (
      <>
        <LandingPage onMasuk={() => setShowLoginModal(true)} />
        {showLoginModal && (
          <LoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f6fb] overflow-hidden" style={{ fontFamily: PP }}>
      <TopNav
        activePage={activePage}
        setActivePage={(p) => { setShowInfoPribadi(false); setActivePage(p); }}
        onProfileClick={() => setShowInfoPribadi(true)}
        onProfileTabClick={(tab) => { setInfoPribadiTab(tab as InfoPribadiTab); setShowInfoPribadi(true); }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          {showInfoPribadi ? (
            <InformasiPribadiPage key={infoPribadiTab} onClose={() => setShowInfoPribadi(false)} defaultTab={infoPribadiTab} />
          ) : activePage === "konsultasi" ? (
            <KonsulasiPage bookings={bookings} onBookingCreated={addBooking} />
          ) : activePage === "dashboard" ? (
            <DashboardPage onNavigate={(p) => setActivePage(p as any)} onBookingCreated={addBooking} currentUser={currentUser} />
          ) : activePage === "profil" ? (
            <StudentProfiling activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : activePage === "compass" ? (
            <OrbitaCompassPage onNavigate={(p) => setActivePage(p as ActivePage)} />
          ) : activePage === "snbp" ? (
            <SiapPTNPage onNavigate={(p) => setActivePage(p as ActivePage)} defaultTab="snbp" />
          ) : activePage === "ptn" ? (
            <SiapPTNPage onNavigate={(p) => setActivePage(p as ActivePage)} />
          ) : activePage === "utbk" ? (
            <SiapPTNPage onNavigate={(p) => setActivePage(p as ActivePage)} defaultTab="snbt" />
          ) : activePage === "action" ? (
            <ActionPlanPage onNavigate={(p) => setActivePage(p as any)} />
          ) : activePage === "kampus" ? (
            <JurusanPage />
          ) : activePage === "skd" ? (
            <SiapSKDPage />
          ) : activePage === "tka" ? (
            <LatihanTKAPage onBack={() => setActivePage("snbp")} />
          ) : activePage === "mandiri" ? (
            <SiapMandiriPage onNavigate={(p) => setActivePage(p as any)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>🚧</div>
              <p className="text-[15px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Halaman dalam pengembangan</p>
            </div>
          )}
        </main>
      </div>
      <MobileBottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
