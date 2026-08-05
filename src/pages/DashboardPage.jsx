import { useMemo } from 'react'

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
      {/* Grid */}
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
      {/* Axes */}
      {Array.from({ length: axes }, (_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} />
      })}
      {/* Data polygon */}
      <polygon
        points={values.map((v, i) => {
          const p = getPoint(i, v)
          return `${p.x},${p.y}`
        }).join(' ')}
        fill="rgba(9,101,250,0.15)"
        stroke="#0965fa"
        strokeWidth={2}
      />
      {/* Vertices */}
      {values.map((v, i) => {
        const p = getPoint(i, v)
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#0965fa" />
      })}
      {/* Labels */}
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
  const today = new Date()
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const missions = [
    { id: 1, title: '20 soal Penalaran Matematika', status: 'progress', current: 12, max: 20 },
    { id: 2, title: 'Review TO #4', status: 'pending', current: 0, max: 1 },
    { id: 3, title: 'Latihan Soal UTBK', status: 'done', current: 1, max: 1 },
  ]

  const timelines = [
    { id: 'snbp', label: 'SNBP', subtitle: 'Seleksi Nasional Berdasarkan Prestasi', color: '#0965fa', bg: '#eff6ff', days: '-', date: 'Belum tersedia', dateColor: '#94a3b8', dateBg: '#f1f5f9' },
    { id: 'snbt', label: 'SNBT', subtitle: 'Seleksi Nasional Berdasarkan Tes', color: '#7c3aed', bg: '#f5f3ff', days: '9', date: '28 Jul 2026', dateColor: '#7c3aed', dateBg: '#f5f3ff' },
    { id: 'skd', label: 'SKD Kedinasan', subtitle: 'Seleksi Kompetensi Dasar', color: '#0d9488', bg: '#f0fdfa', days: '27', date: '15 Agt 2026', dateColor: '#0d9488', dateBg: '#f0fdfa' },
  ]

  return (
    <div className="px-4 py-5 max-w-[640px] mx-auto space-y-4">

      {/* ① HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.05]" />
        <div className="relative z-10">
          <p className="text-[12px] text-white/70">{dateStr}</p>
          <h2 className="text-[22px] font-black text-white mt-1">Selamat Pagi, Dhiya 👋</h2>
          <p className="text-[13px] text-white/70 mt-1">Yuk, lanjutkan perjalananmu bersama Orbita!</p>
        </div>
      </div>

      {/* ② RINGKASAN HARIAN */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#0f172a]">Ringkasan Harian</h3>
        </div>
        <p className="text-[13px] text-[#64748b] leading-relaxed">
          Hari ini kamu telah menyelesaikan dua sesi latihan dengan akurasi 84%. Penalaran Matematika masih menjadi kekuatanmu, sedangkan Literasi Bahasa Indonesia dapat menjadi prioritas belajar berikutnya.
        </p>
      </div>

      {/* ③ TODAY'S ACTION PLAN */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#f1ad00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
            </svg>
            <h3 className="text-[15px] font-black text-[#0f172a]">Today&apos;s Action Plan</h3>
          </div>
          <button className="text-[11px] font-bold text-[#0965fa] hover:text-[#0755d0] transition-colors cursor-pointer">
            View All →
          </button>
        </div>

        <div className="divide-y divide-[rgba(0,0,0,0.05)]">
          {missions.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3">
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                m.status === 'done' ? 'bg-[#f0fdf4]' : m.status === 'progress' ? 'bg-[#eff6ff]' : 'bg-[#f8faff]'
              }`}>
                {m.status === 'done' ? (
                  <svg className="w-4 h-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : m.status === 'progress' ? (
                  <svg className="w-4 h-4 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1a1d2e]">{m.title}</p>
                {m.status === 'progress' && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(m.current / m.max) * 100}%`,
                          background: 'linear-gradient(90deg, #0965fa, #00b2dd)',
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[#94a3b8] shrink-0">{m.current}/{m.max}</span>
                  </div>
                )}
                {m.status === 'pending' && (
                  <p className="text-[10px] text-[#94a3b8] mt-1">Belum dimulai</p>
                )}
                {m.status === 'done' && (
                  <p className="text-[10px] text-[#22c55e] mt-1">✔ Selesai</p>
                )}
              </div>

              {/* Action button or check */}
              {m.status === 'done' ? (
                <div className="w-7 h-7 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <button className="px-3 py-1.5 rounded-lg bg-[#0965fa] text-white text-[11px] font-black hover:bg-[#0755d0] transition-colors shrink-0 cursor-pointer">
                  {m.status === 'progress' ? 'Lanjut' : 'Mulai'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <button className="w-full mt-3 py-2.5 border border-[rgba(0,0,0,0.08)] rounded-xl text-[12px] font-bold text-[#0965fa] hover:bg-[#f8faff] transition-colors cursor-pointer">
          View All Action Plan →
        </button>
      </div>

      {/* ④ TIMELINE SELEKSI */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-[15px] font-black text-[#0f172a]">Timeline Seleksi</h3>
        </div>

        <div className="flex gap-3">
          {timelines.map((t) => (
            <div key={t.id} className="flex-1 rounded-2xl border border-[rgba(0,0,0,0.06)] p-3.5 flex flex-col items-center gap-2 text-center">
              {/* Icon */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.color }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Label */}
              <p className="text-[11px] font-bold text-[#0f172a]">{t.label}</p>
              <p className="text-[9px] text-[#94a3b8] leading-tight">{t.subtitle}</p>
              {/* Days */}
              <p className="text-3xl font-bold" style={{ color: t.color }}>{t.days}</p>
              {/* Countdown badge */}
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-black text-white"
                style={{ backgroundColor: t.days === '-' ? '#94a3b8' : t.color }}
              >
                {t.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ⑤ GRID 2 KOLOM */}
      <div className="grid grid-cols-2 gap-3">
        {/* Orbita Kompas Card */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h4 className="text-[12px] font-black text-[#0f172a]">Orbita Kompas</h4>
          </div>
          <p className="text-[9px] font-bold text-[#9ca3af] mb-3">Jurusan yang sangat direkomendasikan</p>

          {/* Top match */}
          <div className="bg-[#eff6ff] border-[1.5px] border-[#0965fa20] rounded-xl px-3 py-2.5 mb-2">
            <p className="text-[13px] font-black text-[#0f172a]">🥇 Sistem Informasi</p>
          </div>
          {/* Other recs */}
          <div className="space-y-1.5 mb-3">
            <div className="bg-[#f8faff] rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-[#0f172a]">🥈 Teknik Informatika</p>
            </div>
            <div className="bg-[#f8faff] rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-[#0f172a]">🥉 Ilmu Komputer</p>
            </div>
          </div>

          <button
            className="w-full py-2 rounded-xl text-[10px] font-black text-white hover:opacity-90 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #0965fa, #00b2dd)' }}
          >
            Lihat Orbita Kompas →
          </button>
        </div>

        {/* Performa Card */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h4 className="text-[12px] font-black text-[#0f172a]">Performa</h4>
          </div>

          {/* Score + Rank */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[9px] text-[#94a3b8]">Rata-Rata Skor Tryout</p>
              <p className="text-[28px] font-black text-[#0965fa] leading-tight">624</p>
              <div className="flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-[10px] font-black text-[#22c55e]">+18 poin</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-[#94a3b8]">Peringkat</p>
              <p className="text-[16px] font-black text-[#ff7000]">#67</p>
            </div>
          </div>

          {/* Radar */}
          <MiniRadar
            values={[88, 74, 71, 80, 91]}
            labels={['PU', 'PK', 'LI', 'LE', 'PM']}
            size={108}
          />

          <button className="w-full mt-2 py-2 rounded-xl border border-[rgba(0,0,0,0.08)] text-[10px] font-black text-[#0965fa] hover:bg-[#f8faff] transition-colors cursor-pointer">
            Lihat Performa →
          </button>
        </div>
      </div>
    </div>
  )
}
