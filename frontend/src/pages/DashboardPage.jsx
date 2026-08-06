import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfileApi, getCompassResultApi, getActionPlansApi } from '../services/api'

// ── Mini Radar Chart (SVG) ──
function MiniRadar({ values, labels, size = 108 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 14
  const axes = labels.length

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / axes - Math.PI / 2
    const dist = (value / 100) * r
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={size} height={size} className="mx-auto">
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: axes }, (_, i) => {
            const p = getPoint(i, level * 100)
            return `${p.x},${p.y}`
          }).join(' ')}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: axes }, (_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} />
      })}
      <polygon
        points={values.map((v, i) => {
          const p = getPoint(i, v)
          return `${p.x},${p.y}`
        }).join(' ')}
        fill="rgba(9,101,250,0.15)"
        stroke="#0965fa"
        strokeWidth={2}
      />
      {values.map((v, i) => {
        const p = getPoint(i, v)
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#0965fa" />
      })}
      {labels.map((label, i) => {
        const p = getPoint(i, 120)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-[#64748b] font-semibold">
            {label}
          </text>
        )
      })}
    </svg>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const today = new Date()
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const [profile, setProfile] = useState(null)
  const [compassAnalysis, setCompassAnalysis] = useState(null)
  const [actionPlans, setActionPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, compRes, planRes] = await Promise.allSettled([
          getProfileApi(),
          getCompassResultApi(),
          getActionPlansApi(),
        ])
        if (profRes.status === 'fulfilled' && profRes.value.profile) {
          setProfile(profRes.value.profile)
        }
        if (compRes.status === 'fulfilled' && compRes.value.analysis) {
          setCompassAnalysis(compRes.value.analysis)
        }
        if (planRes.status === 'fulfilled' && planRes.value.actionPlans) {
          setActionPlans(planRes.value.actionPlans)
        }
      } catch (err) {
        console.warn('Dashboard API load note:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const assessment = profile?.assessment || { technology: 88, research: 82, creativity: 75, leadership: 70, communication: 78 }
  const radarValues = [assessment.technology, assessment.research, assessment.creativity, assessment.leadership, assessment.communication]

  const timelines = [
    { id: 'snbp', label: 'SNBP', subtitle: 'Seleksi Nasional Berdasarkan Prestasi', color: '#0965fa', bg: '#eff6ff', days: '14', date: '15 Feb 2026', dateColor: '#0965fa', dateBg: '#eff6ff' },
    { id: 'snbt', label: 'SNBT', subtitle: 'Seleksi Nasional Berdasarkan Tes', color: '#7c3aed', bg: '#f5f3ff', days: '64', date: '28 Jul 2026', dateColor: '#7c3aed', dateBg: '#f5f3ff' },
    { id: 'skd', label: 'SKD Kedinasan', subtitle: 'Seleksi Kompetensi Dasar', color: '#0d9488', bg: '#f0fdfa', days: '82', date: '15 Agt 2026', dateColor: '#0d9488', dateBg: '#f0fdfa' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">

      {/* ① HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.05]" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-white/70">{dateStr}</p>
            <h2 className="text-[22px] font-black text-white mt-1">Selamat Pagi, {user?.name || 'Siswa'} 👋</h2>
            <p className="text-[12px] text-white/80 mt-1 max-w-md">
              {profile?.schoolName ? `${profile.schoolName} (${profile.majorTrack})` : 'Target PTN Impianmu sudah semakin dekat!'}
            </p>
          </div>
          <button
            onClick={() => navigate('/compass')}
            className="hidden sm:inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-2xl text-[12px] transition-all backdrop-blur-md"
          >
            <span>🧭 Analisis Compass AI</span>
          </button>
        </div>
      </div>

      {/* ② MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT 2 COLS: TARGET PTN & ACTION PLAN */}
        <div className="lg:col-span-2 space-y-6">

          {/* TARGET PTN & PRODI CARD */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="text-[15px] font-bold text-[#0f172a]">Target PTN Impian</h3>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#eff6ff] text-[#0965fa]">
                {profile?.targetMajor?.category || 'Saintek'}
              </span>
            </div>

            <div className="flex items-center gap-4 bg-[#f8fafc] rounded-2xl p-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                🏛️
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#0f172a]">
                  {profile?.targetPtn?.name || 'Universitas Indonesia (UI)'}
                </h4>
                <p className="text-[12px] font-semibold text-[#0965fa]">
                  {profile?.targetMajor?.name || 'Teknik Informatika'}
                </p>
                <p className="text-[11px] text-[#64748b]">
                  Kota {profile?.targetPtn?.city || 'Depok'} • Akreditasi {profile?.targetPtn?.accreditation || 'Unggul'}
                </p>
              </div>
            </div>

            {/* QUOTA BREAKDOWN REAL */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-[#eff6ff] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#0965fa] font-bold uppercase">Kuota SNBP</p>
                <p className="text-[16px] font-black text-[#0965fa]">{profile?.targetMajor?.capacitySnbp || 45} Kursi</p>
              </div>
              <div className="bg-[#f5f3ff] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#7c3aed] font-bold uppercase">Kuota SNBT</p>
                <p className="text-[16px] font-black text-[#7c3aed]">{profile?.targetMajor?.capacitySnbt || 68} Kursi</p>
              </div>
              <div className="bg-[#f0fdfa] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#0d9488] font-bold uppercase">Kuota Mandiri</p>
                <p className="text-[16px] font-black text-[#0d9488]">{profile?.targetMajor?.capacityMandiri || 37} Kursi</p>
              </div>
            </div>
          </div>

          {/* ACTION PLAN CALENDAR LIST */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h3 className="text-[15px] font-bold text-[#0f172a]">Agenda & Action Plan</h3>
              </div>
              <button onClick={() => navigate('/action-plan')} className="text-[11px] text-[#0965fa] font-bold hover:underline">
                Lihat Kalender →
              </button>
            </div>

            <div className="space-y-3">
              {actionPlans.length > 0 ? (
                actionPlans.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className={`text-[13px] font-bold ${item.completed ? 'line-through text-slate-400' : 'text-[#0f172a]'}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500">Tenggat: {new Date(item.dueDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 uppercase">
                      {item.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[12px] text-slate-400">Belum ada agenda aktif</div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COL: RADAR RADAR & TIMELINE */}
        <div className="space-y-6">

          {/* COMPASS RADAR CARD */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 text-center">
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-2">Radar Keselarasan Potensi</h3>
            <MiniRadar values={radarValues} labels={['Tech', 'Research', 'Creative', 'Lead', 'Comm']} />
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">Skor Kepercayaan AI: </span>
              <span className="text-[14px] font-extrabold text-[#0965fa]">{compassAnalysis?.confidenceScore || 88.5}%</span>
            </div>
          </div>

          {/* TIMELINES SELEKSI */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-3">
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-2">Jadwal Seleksi PTN</h3>
            {timelines.map((t) => (
              <div key={t.id} className="p-3 rounded-2xl flex items-center justify-between" style={{ backgroundColor: t.bg }}>
                <div>
                  <h4 className="text-[13px] font-bold" style={{ color: t.color }}>{t.label}</h4>
                  <p className="text-[10px] text-slate-600">{t.date}</p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl" style={{ backgroundColor: t.dateBg, color: t.dateColor }}>
                  {t.days} Hari lagi
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}
