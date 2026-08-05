import { useState, useEffect } from 'react'

// ── Toast Component ──
function Toast({ message, stars, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2800)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease-out]">
      <div className="rounded-2xl bg-[#0f172a] shadow-xl flex items-center gap-3 px-5 py-3.5 min-w-[260px]">
        <div className="w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">{message}</p>
          <p className="text-[11px] text-[#94a3b8]">+{stars} Bintang Belajar</p>
        </div>
      </div>
    </div>
  )
}

// ── Logo Mapping ──
const LOGOS = {
  'Universitas Gadjah Mada': '/logos/ugm.png',
  'Institut Teknologi Bandung': '/logos/itb.png',
  'Universitas Sriwijaya': '/logos/unsri.png',
  'PKN STAN': '/logos/stan.png',
  'Institut Pemerintahan Dalam Negeri': '/logos/ipdn.jpg',
}

// ── Ubah Target Modal ──
function UbahTargetModal({ isOpen, onClose, ptnTarget, kedinasanTarget, onSave }) {
  const [ptnEnabled, setPtnEnabled] = useState(true)
  const [kedinasanEnabled, setKedinasanEnabled] = useState(true)
  const [ptnUniv, setPtnUniv] = useState(ptnTarget.univ)
  const [ptnProdi, setPtnProdi] = useState(ptnTarget.prodi)
  const [kedSekolah, setKedSekolah] = useState(kedinasanTarget.sekolah)
  const [kedProdi, setKedProdi] = useState(kedinasanTarget.prodi)

  if (!isOpen) return null

  const univs = ['Universitas Gadjah Mada', 'Institut Teknologi Bandung', 'Universitas Sriwijaya']
  const prodis = ['Sistem Informasi', 'Teknik Informatika', 'Ilmu Komputer', 'Matematika', 'Teknik Kimia', 'Teknik Elektro', 'Kedokteran', 'Farmasi', 'Akuntansi', 'Manajemen']
  const sekolahKed = ['PKN STAN', 'Institut Pemerintahan Dalam Negeri']
  const prodiKed = ['D4 Akuntansi Sektor Publik', 'D4 Manajemen Keuangan', 'D3 Pajak', 'D3 Kepabeanan', 'D3 Kebendaharaan Negara']

  const handleSave = () => {
    onSave({
      ptn: { univ: ptnUniv, prodi: ptnProdi },
      kedinasan: { sekolah: kedSekolah, prodi: kedProdi }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-7 pt-7 pb-4 border-b border-slate-100 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-[#0f172a]">Target Persiapan</h3>
              <p className="text-[12px] text-[#64748b] mt-0.5">Tentukan target universitas & sekolah kedinasan</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">
          {/* PTN Section */}
          <div className={`rounded-2xl border-2 p-5 transition-colors ${ptnEnabled ? 'border-[#0965fa]' : 'border-[rgba(0,0,0,0.08)]'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setPtnEnabled(!ptnEnabled)} className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${ptnEnabled ? 'bg-[#0965fa]' : 'border-[1.5px] border-[#d1d5db]'}`}>
                {ptnEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0f172a]">PTN</p>
                <p className="text-[11px] text-[#94a3b8]">Persiapan SNBP & SNBT</p>
              </div>
            </label>
            {ptnEnabled && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748b] mb-1 block">Universitas</label>
                  <select value={ptnUniv} onChange={e => setPtnUniv(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer">
                    {univs.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748b] mb-1 block">Program Studi</label>
                  <select value={ptnProdi} onChange={e => setPtnProdi(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer">
                    {prodis.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Kedinasan Section */}
          <div className={`rounded-2xl border-2 p-5 transition-colors ${kedinasanEnabled ? 'border-[#0965fa]' : 'border-[rgba(0,0,0,0.08)]'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setKedinasanEnabled(!kedinasanEnabled)} className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${kedinasanEnabled ? 'bg-[#0965fa]' : 'border-[1.5px] border-[#d1d5db]'}`}>
                {kedinasanEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0f172a]">Sekolah Kedinasan</p>
                <p className="text-[11px] text-[#94a3b8]">Persiapan SKD</p>
              </div>
            </label>
            {kedinasanEnabled && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748b] mb-1 block">Sekolah Kedinasan</label>
                  <select value={kedSekolah} onChange={e => setKedSekolah(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer">
                    {sekolahKed.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748b] mb-1 block">Program Studi</label>
                  <select value={kedProdi} onChange={e => setKedProdi(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer">
                    {prodiKed.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-[13px] text-[#64748b] border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            Batal
          </button>
          <button onClick={handleSave} className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white bg-[#0965fa] hover:bg-[#0755d0] transition-colors cursor-pointer">
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Circular Progress ──
function CircularProgress({ value, size = 48 }) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke="#0965fa"
        strokeWidth={5} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        className="transition-all duration-500"
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold fill-[#0965fa]">
        {value}%
      </text>
    </svg>
  )
}

export default function ActionPlanPage() {
  const [showLb, setShowLb] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [ptnTarget, setPtnTarget] = useState({ univ: 'Universitas Gadjah Mada', prodi: 'Sistem Informasi' })
  const [kedinasanTarget, setKedinasanTarget] = useState({ sekolah: 'PKN STAN', prodi: 'D4 Akuntansi Sektor Publik' })
  const [toast, setToast] = useState({ show: false, message: '', stars: 0 })
  const [focusFilters, setFocusFilters] = useState(['snbt'])
  const [completedTasks, setCompletedTasks] = useState({ 3: true })
  const [weeklyChecks, setWeeklyChecks] = useState({ 0: true, 3: true })

  const totalStars = 127

  const allTasks = [
    { id: 1, title: 'Guided Practice: Penalaran Matematika', desc: '20 soal latihan terbimbing', stars: 5, badge: 'snbt', focus: ['snbt'] },
    { id: 2, title: 'Mini Tryout SNBT', desc: 'Simulasi ujian 30 menit', stars: 8, badge: 'snbt', focus: ['snbt'] },
    { id: 3, title: 'Review Pembahasan TO #4', desc: 'Pelajari pembahasan soal', stars: 3, badge: 'general', focus: ['snbt', 'snbp'] },
    { id: 4, title: 'Latihan TKA: Biologi', desc: '15 soal biologi dasar', stars: 5, badge: 'snbp', focus: ['snbp'] },
    { id: 5, title: 'Tryout Lengkap SKD', desc: 'Simulasi SKD 100 soal', stars: 15, badge: 'skd', focus: ['skd'] },
  ]

  const filteredTasks = allTasks.filter(t => t.focus.some(f => focusFilters.includes(f)))
  const doneCount = filteredTasks.filter(t => completedTasks[t.id]).length
  const pct = filteredTasks.length > 0 ? Math.round((doneCount / filteredTasks.length) * 100) : 0

  const toggleFocus = (f) => {
    setFocusFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const completeTask = (task) => {
    setCompletedTasks(prev => ({ ...prev, [task.id]: true }))
    setToast({ show: true, message: 'Aktivitas berhasil diselesaikan', stars: task.stars })
  }

  const badgeStyles = {
    snbp: 'bg-[#eff6ff] text-[#1d4ed8]',
    snbt: 'bg-[#f0fdf4] text-[#15803d]',
    skd: 'bg-[#fff7ed] text-[#c2410c]',
    general: 'bg-[#f8faff] text-[#475569]',
  }

  const weeklyItems = [
    'Ikuti 1 Tryout SNBT',
    'Selesaikan 2 Guided Practice',
    'Latihan TKA sebanyak 2 sesi',
    'Guided Learning TWK',
    'Review seluruh pembahasan minggu ini',
  ]

  const monthlyGoals = [
    { label: 'Tryout Lengkap', cur: 2, max: 4 },
    { label: 'Latihan Soal', cur: 18, max: 30 },
    { label: 'Guided Learning', cur: 12, max: 20 },
    { label: 'Review Materi', cur: 8, max: 12 },
  ]

  if (showLb) return <LeaderboardView onBack={() => setShowLb(false)} totalStars={totalStars} />

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* A1 — Hero/Header */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-[#0f172a]">Action Plan</h1>
            <p className="text-[13px] text-[#64748b] leading-relaxed max-w-md mt-1">
              Rencana belajarmu disusun berdasarkan target yang ingin kamu capai.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors shrink-0 cursor-pointer">
            Ubah Target
          </button>
        </div>

        {/* Targets */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#94a3b8] mb-3">TARGET PERSIAPAN</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
            {/* PTN TARGET */}
            <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[9px] uppercase text-[#94a3b8] font-semibold">PTN TARGET</p>
                  {LOGOS[ptnTarget.univ] && (
                    <img src={LOGOS[ptnTarget.univ]} alt={ptnTarget.univ} className="w-8 h-8 object-contain shrink-0" />
                  )}
                </div>
                <p className="text-[14px] font-bold text-[#0f172a]">{ptnTarget.prodi}</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{ptnTarget.univ}</p>
              </div>
            </div>

            {/* KEDINASAN */}
            <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[9px] uppercase text-[#94a3b8] font-semibold">KEDINASAN</p>
                  {LOGOS[kedinasanTarget.sekolah] && (
                    <img src={LOGOS[kedinasanTarget.sekolah]} alt={kedinasanTarget.sekolah} className="w-8 h-8 object-contain shrink-0" />
                  )}
                </div>
                <p className="text-[14px] font-bold text-[#0f172a]">{kedinasanTarget.sekolah}</p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{kedinasanTarget.prodi}</p>
              </div>
            </div>

            {/* BINTANG BELAJAR */}
            <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">⭐</span>
                  <span className="text-[11px] font-bold text-[#0f172a]">Bintang Belajar</span>
                  <div className="relative group ml-auto">
                    <div className="w-4 h-4 rounded-md bg-[#f1f5f9] flex items-center justify-center cursor-default">
                      <span className="text-[9px] font-bold text-[#94a3b8]">i</span>
                    </div>
                    <div className="absolute bottom-full right-0 mb-2 w-52 bg-[#0f172a] rounded-xl p-3 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      Setiap aktivitas yang diselesaikan memberikan Bintang Belajar. Bintang menentukan peringkat Leaderboard.
                    </div>
                  </div>
                </div>
                <p className="text-[26px] font-bold text-[#0f172a] mt-1">{totalStars}</p>
              </div>
              <button onClick={() => setShowLb(true)} className="mt-3 w-full py-2 rounded-xl border border-[#0965fa30] text-[11px] font-bold text-[#0965fa] hover:bg-[#f0f6ff] transition-colors cursor-pointer">
                Lihat Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* A2 — Fokus Hari Ini */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a]">Fokus Hari Ini</h3>
        <p className="text-[12px] text-[#94a3b8] leading-relaxed mt-1 mb-4">
          Pilih target yang ingin kamu fokuskan hari ini. Daftar aktivitas akan disesuaikan secara otomatis.
        </p>
        <div className="flex gap-2 flex-wrap">
          {[{ id: 'snbp', label: 'Persiapan SNBP' }, { id: 'snbt', label: 'Persiapan SNBT' }, { id: 'skd', label: 'Persiapan SKD' }].map(f => (
            <button
              key={f.id}
              onClick={() => toggleFocus(f.id)}
              className={`px-4 py-2 rounded-2xl text-[12px] font-semibold border transition-all cursor-pointer ${
                focusFilters.includes(f.id)
                  ? 'bg-[#0965fa] text-white border-[#0965fa]'
                  : 'bg-white text-[#374151] border-[rgba(0,0,0,0.1)] hover:border-[#0965fa30]'
              }`}
            >
              {focusFilters.includes(f.id) && (
                <svg className="w-[11px] h-[11px] inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* A3 — Today's Mission */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#0f172a]">Today&apos;s Mission</h3>
            <p className="text-[12px] text-[#94a3b8]">{doneCount} / {filteredTasks.length} selesai</p>
          </div>
          <CircularProgress value={pct} />
        </div>

        {focusFilters.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[13px] text-[#94a3b8]">Pilih fokus belajar di atas untuk melihat misi hari ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(0,0,0,0.04)]">
            {filteredTasks.map(task => {
              const done = completedTasks[task.id]
              return (
                <div key={task.id} className="px-6 py-4 flex items-center gap-4">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center ${done ? 'bg-[#0965fa]' : 'border-[1.5px] border-[#d1d5db]'}`}>
                    {done && <svg className="w-[11px] h-[11px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeStyles[task.badge]}`}>
                        {task.badge.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">⭐ +{task.stars}</span>
                    </div>
                    <p className={`text-[13px] font-bold ${done ? 'line-through text-[#94a3b8]' : 'text-[#0f172a]'}`}>{task.title}</p>
                    <p className="text-[11px] text-[#94a3b8]">{task.desc}</p>
                  </div>
                  {/* Action */}
                  {!done && (
                    <button
                      onClick={() => completeTask(task)}
                      className="px-4 py-1.5 rounded-xl bg-[#0965fa] text-white text-[11px] font-bold hover:bg-[#0755d0] transition-colors shrink-0 cursor-pointer"
                    >
                      Mulai
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* A4 — Target Minggu Ini */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-5">Target Minggu Ini</h3>
        <div className="space-y-0">
          {weeklyItems.map((item, i) => {
            const checked = weeklyChecks[i]
            return (
              <div key={i} className="flex items-center gap-3 py-2">
                <div
                  onClick={() => setWeeklyChecks(prev => ({ ...prev, [i]: !prev[i] }))}
                  className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center cursor-pointer transition-colors ${checked ? 'bg-[#0965fa]' : 'border-[1.5px] border-[#d1d5db]'}`}
                >
                  {checked && <svg className="w-[11px] h-[11px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-[13px] font-semibold ${checked ? 'line-through text-[#94a3b8]' : 'text-[#0f172a]'}`}>{item}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* A5 — Target Bulan Ini */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-5">Target Bulan Ini</h3>
        <div className="grid grid-cols-2 gap-3">
          {monthlyGoals.map((g, i) => (
            <div key={i} className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4">
              <p className="text-[11px] text-[#94a3b8]">{g.label}</p>
              <p className="text-[18px] font-bold text-[#0f172a] mt-1">{g.cur} / {g.max}</p>
              <div className="mt-2 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#0965fa] rounded-full transition-all duration-500" style={{ width: `${(g.cur / g.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A6 — Progress Belajar */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Progress Belajar</h3>
        <div className="space-y-4">
          {[{ label: 'SNBP', pct: 72 }, { label: 'SNBT', pct: 64 }, { label: 'SKD', pct: 58 }].map(p => (
            <div key={p.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-[#0f172a]">{p.label}</span>
                <span className="text-[12px] font-bold text-[#0965fa]">{p.pct}%</span>
              </div>
              <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.pct}%`, background: 'linear-gradient(90deg, #0965fa, #00b2dd)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <UbahTargetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ptnTarget={ptnTarget}
        kedinasanTarget={kedinasanTarget}
        onSave={({ ptn, kedinasan }) => {
          setPtnTarget(ptn)
          setKedinasanTarget(kedinasan)
        }}
      />

      {/* Toast */}
      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} />

      {/* Global animation for toast */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}


// ══════════════════════════════════════
// ═══ LEADERBOARD VIEW ═══
// ══════════════════════════════════════
function LeaderboardView({ onBack, totalStars }) {
  const [searchTerm, setSearchTerm] = useState('')

  const top3 = [
    { rank: 1, name: 'Sarah Aulia', initials: 'SA', stars: 312, trend: 'up' },
    { rank: 2, name: 'Budi Santoso', initials: 'BS', stars: 289, trend: 'up' },
    { rank: 3, name: 'Citra Dewi', initials: 'CD', stars: 265, trend: 'down' },
  ]

  const leaderboard = [
    { rank: 1, name: 'Sarah Aulia', initials: 'SA', stars: 312, trend: 'up', bgColor: '#fef9c3', textColor: '#92400e' },
    { rank: 2, name: 'Budi Santoso', initials: 'BS', stars: 289, trend: 'up', bgColor: '#e2e8f0', textColor: '#64748b' },
    { rank: 3, name: 'Citra Dewi', initials: 'CD', stars: 265, trend: 'down', bgColor: '#fee2e2', textColor: '#991b1b' },
    { rank: 4, name: 'Dani Pratama', initials: 'DP', stars: 241, trend: 'up', bgColor: '#dbeafe', textColor: '#1d4ed8' },
    { rank: 5, name: 'Eka Fitri', initials: 'EF', stars: 220, trend: '-', bgColor: '#f0fdf4', textColor: '#15803d' },
    { rank: 6, name: 'Fajar Rahman', initials: 'FR', stars: 198, trend: 'down', bgColor: '#fef3c7', textColor: '#92400e' },
    { rank: 7, name: 'Gita Purnama', initials: 'GP', stars: 176, trend: 'up', bgColor: '#fce7f3', textColor: '#9d174d' },
    { rank: 8, name: 'Ahmad Rizki', initials: 'AR', stars: totalStars, trend: 'up', bgColor: '#dbeafe', textColor: '#1d4ed8', isCurrentUser: true },
    { rank: 9, name: 'Indah Sari', initials: 'IS', stars: 115, trend: '-', bgColor: '#e0e7ff', textColor: '#4338ca' },
    { rank: 10, name: 'Joko Widodo', initials: 'JW', stars: 102, trend: 'down', bgColor: '#dcfce7', textColor: '#166534' },
  ]

  const filtered = leaderboard.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const starActivities = [
    { activity: 'Guided Practice', stars: '+5', bg: '#eff6ff', text: '#1d4ed8' },
    { activity: 'Custom Practice', stars: '+5', bg: '#f0fdf4', text: '#15803d' },
    { activity: 'Review Pembahasan', stars: '+3', bg: '#fff7ed', text: '#c2410c' },
    { activity: 'Mini Tryout', stars: '+8', bg: '#fdf4ff', text: '#7e22ce' },
    { activity: 'Tryout Lengkap', stars: '+15', bg: '#fefce8', text: '#854d0e' },
    { activity: 'Selesaikan seluruh misi harian', stars: 'Bonus +5', bg: '#f0fdfa', text: '#0f766e' },
  ]

  const konsistensi = [
    { bulan: 'September', winner: 'Sarah Aulia', reward: 'Mentoring Eksklusif', bg: '#fef9c3', border: '#fde68a' },
    { bulan: 'Agustus', winner: 'Budi Santoso', reward: 'Akses Premium', bg: '#e0f2fe', border: '#bae6fd' },
    { bulan: 'Juli', winner: 'Ahmad Rizki', reward: 'Sertifikat Digital', bg: '#f0fdf4', border: '#bbf7d0' },
  ]

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumConfig = [
    { height: 48, barColor: '#e2e8f0', medal: '🥈', avatarBg: '#e2e8f0', avatarText: '#64748b' },
    { height: 68, barColor: '#fbbf24', medal: '🥇', avatarBg: '#fef9c3', avatarText: '#92400e' },
    { height: 34, barColor: '#fb923c', medal: '🥉', avatarBg: '#fee2e2', avatarText: '#991b1b' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-semibold text-[#0965fa] hover:text-[#0755d0] transition-colors cursor-pointer mb-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Action Plan
      </button>

      {/* B1 — Hero */}
      <div className="rounded-3xl px-5 md:px-7 pt-5 md:pt-7 pb-5 md:pb-6" style={{ background: 'linear-gradient(135deg, #0965fa, #0ea5e9)' }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">ORBITA COMPASS</p>
        <h2 className="text-[24px] font-bold text-white mt-1 mb-4">Leaderboard</h2>

        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] uppercase text-white/50 font-semibold">PERIODE</p>
            <p className="text-[13px] font-bold text-white">September 2026</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] uppercase text-white/50 font-semibold">RESET DALAM</p>
            <div className="flex gap-1.5 mt-1">
              {[{ val: '12', unit: 'H' }, { val: '08', unit: 'J' }, { val: '45', unit: 'M' }, { val: '30', unit: 'D' }].map((t, i) => (
                <div key={i} className="bg-white/10 rounded-lg px-2 py-1 text-center">
                  <p className="text-[13px] font-bold text-white leading-tight">{t.val}</p>
                  <p className="text-[7px] text-white/50">{t.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-2xl px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">PERINGKATMU</p>
            <p className="text-[36px] font-bold text-white leading-tight">#8</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">TOTAL BINTANG</p>
            <div className="flex items-center gap-1.5">
              <span className="text-base">⭐</span>
              <span className="text-[24px] font-bold text-white leading-tight">{totalStars}</span>
            </div>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] text-[10px] font-semibold">
              ↑ Naik 3 peringkat
            </span>
          </div>
        </div>
      </div>

      {/* B2 — Top 3 */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <h3 className="text-[13px] font-bold text-[#0f172a] mb-4">Orbita Top 3</h3>
        <div className="flex items-end justify-center gap-2">
          {podiumOrder.map((person, idx) => {
            const config = podiumConfig[idx]
            return (
              <div key={person.rank} className="flex flex-col items-center w-[72px]">
                <span className="text-lg mb-1">{config.medal}</span>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-bold border-2 border-white shadow-md mb-1"
                  style={{ backgroundColor: config.avatarBg, color: config.avatarText }}
                >
                  {person.initials}
                </div>
                <p className="text-[11px] font-bold text-[#0f172a] text-center truncate w-full">{person.name}</p>
                <p className="text-[10px] text-[#94a3b8] font-semibold">⭐ {person.stars}</p>
                <div className="w-16 rounded-t-xl flex items-center justify-center mt-2" style={{ height: config.height, backgroundColor: config.barColor }}>
                  <span className="text-white/90 text-[12px] font-bold">#{person.rank}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* B3 — Full Leaderboard */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Peringkat Kelas XII</h3>
          <input
            type="text"
            placeholder="Cari teman sekelas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-[12px] bg-[#f8fafc] border border-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="divide-y divide-[rgba(0,0,0,0.04)]">
          {filtered.map(person => (
            <div key={person.rank} className={`px-4 py-3 flex items-center gap-3 ${person.isCurrentUser ? 'bg-[#eff6ff]' : ''}`}>
              <span className={`text-[12px] font-bold w-7 text-center ${
                person.rank <= 3 ? 'text-[#f59e0b]' : person.isCurrentUser ? 'text-[#0965fa]' : 'text-[#94a3b8]'
              }`}>#{person.rank}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold" style={{ backgroundColor: person.bgColor, color: person.textColor }}>
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-[#0f172a]">
                  {person.name} {person.isCurrentUser && <span className="text-[#0965fa]">(Kamu)</span>}
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#0f172a]">⭐ {person.stars}</span>
              <span className={`text-[12px] ${
                person.trend === 'up' ? 'text-[#22c55e]' : person.trend === 'down' ? 'text-[#ef4444]' : 'text-[#94a3b8]'
              }`}>
                {person.trend === 'up' ? '↑' : person.trend === 'down' ? '↓' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* B4 — Cara Mendapatkan Bintang */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[13px] font-bold text-[#0f172a] mb-3">Cara Mendapatkan Bintang Belajar</h3>
        <div className="grid grid-cols-2 gap-2">
          {starActivities.map((a, i) => (
            <div key={i} className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: a.bg }}>
              <span className="text-[11px] font-semibold" style={{ color: a.text }}>{a.activity}</span>
              <span className="text-[11px] font-bold" style={{ color: a.text }}>{a.stars}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#94a3b8] mt-3">Bintang hanya diberikan setelah aktivitas berhasil diselesaikan.</p>
      </div>

      {/* B5 — Papan Konsistensi */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-bold text-[#0f172a]">Papan Konsistensi Orbita</h3>
          <button className="text-[11px] font-semibold text-[#0965fa] border border-[#0965fa30] px-3 py-1 rounded-lg hover:bg-[#f0f6ff] transition-colors cursor-pointer">
            Lihat Arsip
          </button>
        </div>
        <p className="text-[11px] text-[#94a3b8] leading-relaxed mb-3">Siswa dengan konsistensi belajar terbaik setiap bulan.</p>
        <div className="flex gap-2">
          {konsistensi.map((k, i) => (
            <div key={i} className="flex-1 rounded-2xl overflow-hidden" style={{ backgroundColor: k.bg, border: `1px solid ${k.border}` }}>
              <div className="px-3 py-2 text-[10px] font-bold text-[#94a3b8]" style={{ borderBottom: `1px solid ${k.border}` }}>{k.bulan}</div>
              <div className="px-3 py-3">
                <p className="text-[13px] font-bold text-[#0f172a]">🥇 {k.winner}</p>
                <p className="text-[10px] text-[#94a3b8] mt-0.5">{k.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B6 — Monthly Reward */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="h-28 flex items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #fef9c3, #fde68a)', borderBottom: '1px solid #fde68a' }}>
          <span className="text-3xl">🏆</span>
          <span className="text-[11px] font-bold text-[#92400e]">Reward Eksklusif Top 3</span>
        </div>
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#94a3b8] font-semibold">REWARD BULAN INI</p>
          <h4 className="text-[16px] font-bold text-[#0f172a] mt-1">Live Session SNBT & SKD</h4>
          <p className="text-[12px] text-[#64748b] leading-relaxed mt-1">Sesi live bersama mentor berpengalaman untuk membahas strategi SNBT dan SKD.</p>
          <div className="grid grid-cols-3 gap-2 mt-4 rounded-xl bg-[#f8fafc] border border-slate-100 p-2.5">
            {[{ label: 'Peserta', value: 'Top 3' }, { label: 'Durasi', value: '120 Menit' }, { label: 'Tanggal', value: '28 Sep' }].map((info, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] text-[#94a3b8]">{info.label}</p>
                <p className="text-[12px] font-bold text-[#0f172a]">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
