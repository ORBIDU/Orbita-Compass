import { useState } from 'react'

function Radar({ values, labels, size = 220 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 30
  const axes = labels.length
  const getPoint = (i, v) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2
    const dist = (v / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }
  return (
    <svg width={size} height={size} className="mx-auto">
      {[0.25, 0.5, 0.75, 1].map(level => (
        <polygon key={level} points={Array.from({ length: axes }, (_, i) => { const p = getPoint(i, level * 100); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="#f1f5f9" strokeWidth={1} />
      ))}
      {Array.from({ length: axes }, (_, i) => { const p = getPoint(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} /> })}
      <polygon points={values.map((v, i) => { const p = getPoint(i, v); return `${p.x},${p.y}` }).join(' ')} fill="rgba(9,101,250,0.15)" stroke="#0965fa" strokeWidth={2} />
      {values.map((v, i) => { const p = getPoint(i, v); return <circle key={i} cx={p.x} cy={p.y} r={4} fill="#0965fa" /> })}
      {labels.map((label, i) => { const p = getPoint(i, 130); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-[#64748b] font-semibold">{label}</text> })}
    </svg>
  )
}

export default function CompassPage() {
  const recommendations = [
    { rank: 1, medal: '🥇', jurusan: 'Sistem Informasi', univ: 'Universitas Indonesia', match: 92, color: '#0965fa' },
    { rank: 2, medal: '🥈', jurusan: 'Teknik Informatika', univ: 'Institut Teknologi Bandung', match: 87, color: '#7c3aed' },
    { rank: 3, medal: '🥉', jurusan: 'Ilmu Komputer', univ: 'Universitas Gadjah Mada', match: 83, color: '#0d9488' },
  ]

  const dimensions = [
    { label: 'Minat', score: 88, color: '#0965fa', bg: '#eff6ff' },
    { label: 'Nilai Akademik', score: 82, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Potensi', score: 90, color: '#0d9488', bg: '#f0fdfa' },
    { label: 'Karir', score: 76, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Jalur Masuk', score: 85, color: '#ef4444', bg: '#fef2f2' },
  ]

  const careers = [
    { name: 'Software Engineer', industry: 'Teknologi', salary: 'Rp 8-25 jt/bulan' },
    { name: 'Data Analyst', industry: 'Teknologi / Keuangan', salary: 'Rp 7-18 jt/bulan' },
    { name: 'System Analyst', industry: 'Konsultan IT', salary: 'Rp 8-20 jt/bulan' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.05]" />
        <div className="relative z-10">
          <h1 className="text-[28px] font-bold text-white">Orbita Kompas</h1>
          <p className="text-[14px] text-white/70 mt-1">Rekomendasi jurusan dan karir berdasarkan analisis AI terhadap profilmu</p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full border border-white/30 text-[10px] text-white/80 font-semibold">✨ Powered by AI</span>
        </div>
      </div>

      {/* Top Recommendations */}
      <div className="space-y-3">
        {recommendations.map(rec => (
          <div key={rec.rank} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5 md:p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">{rec.medal}</span>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#0f172a]">{rec.jurusan}</h3>
                <p className="text-[12px] text-[#64748b] mt-0.5">{rec.univ}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rec.match}%`, background: 'linear-gradient(90deg, #0965fa, #00b2dd)' }} />
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: rec.color }}>{rec.match}%</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl border border-[#0965fa30] text-[11px] font-bold text-[#0965fa] hover:bg-[#f0f6ff] transition-colors shrink-0 cursor-pointer">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Profil Kecocokan</h3>
        <Radar values={[88, 82, 90, 76, 85]} labels={['Minat', 'Akademik', 'Potensi', 'Karir', 'Jalur Masuk']} />
      </div>

      {/* Dimension Scores */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Skor per Dimensi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dimensions.map(d => (
            <div key={d.label} className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4" style={{ backgroundColor: d.bg }}>
              <p className="text-[11px] font-semibold" style={{ color: d.color }}>{d.label}</p>
              <p className="text-[22px] font-bold mt-1" style={{ color: d.color }}>{d.score}%</p>
              <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.score}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Paths */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Prospek Karir</h3>
        <div className="space-y-3">
          {careers.map((c, i) => (
            <div key={i} className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#0f172a]">{c.name}</p>
                <p className="text-[11px] text-[#94a3b8]">{c.industry}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-[#0965fa]">{c.salary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
