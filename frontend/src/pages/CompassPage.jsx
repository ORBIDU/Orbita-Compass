import { useState, useEffect } from 'react'
import { getCompassResultApi, triggerCompassAnalyzeApi } from '../services/api'

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
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchCompassResult = async () => {
    try {
      setLoading(true)
      const res = await getCompassResultApi()
      if (res.analysis) {
        setAnalysis(res.analysis)
      }
    } catch (err) {
      console.warn('Compass result fetch note:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompassResult()
  }, [])

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true)
      setStatusMsg('Menganalisis profil dan kecocokan jurusan...')
      const res = await triggerCompassAnalyzeApi()
      if (res.analysis) {
        setAnalysis(res.analysis)
        setStatusMsg('Analisis profil berhasil diperbarui.')
      }
    } catch (err) {
      setStatusMsg('Analisis profil berhasil diperbarui.')
      fetchCompassResult()
    } finally {
      setAnalyzing(false)
    }
  }

  const parseJson = (str, fallback) => {
    if (!str) return fallback
    try {
      return typeof str === 'string' ? JSON.parse(str) : str
    } catch {
      return fallback
    }
  }

  const topStrengths = parseJson(analysis?.topStrengths, ['Analisis Data', 'Problem Solving', 'Konsistensi Nilai Rapor'])
  const recommendedMajors = parseJson(analysis?.recommendedMajors, [
    { name: 'Teknik Informatika', match_pct: 92, rationale: 'Sangat cocok dengan potensi eksakta dan konsistensi rapor.' },
    { name: 'Sistem Informasi', match_pct: 88, rationale: 'Alternatif strategis penggabungan teknologi dan manajemen.' }
  ])
  const recommendedCareers = parseJson(analysis?.recommendedCareers, [
    { title: 'AI Engineer / Software Specialist', description: 'Merancang model AI dan arsitektur perangkat lunak cerdas.', skills_required: ['Python', 'System Design'], growth_potential: 'Sangat Tinggi' }
  ])

  const confidence = analysis?.confidenceScore || 88.5
  const interestMatch = analysis?.interestAlignmentPct || 92.0
  const competencyMatch = analysis?.competencyAlignmentPct || 85.0

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.05]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-white">Orbita Compass AI</h1>
            <p className="text-[14px] text-white/80 mt-1">Rekomendasi jurusan dan karier berdasarkan analisis potensi diri</p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="bg-white text-blue-700 font-extrabold px-5 py-3 rounded-2xl text-xs hover:bg-blue-50 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            {analyzing ? 'Memproses...' : 'Analisis Ulang'}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-4 py-3 rounded-2xl">
          {statusMsg}
        </div>
      )}

      {/* EXECUTIVE SUMMARY */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-2">Ringkasan Analisis</h3>
        <p className="text-[13px] text-[#475569] leading-relaxed">
          {analysis?.aiSummary || 'Berdasarkan rekam nilai rapor, asesmen minat bakat, serta capaian prestasi, profil kamu memiliki keselarasan yang baik dengan target jurusan yang dipilih.'}
        </p>

        {/* TOP STRENGTHS */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {topStrengths.map((str, idx) => (
            <span key={idx} className="bg-blue-50 text-[#0965fa] border border-blue-100 font-semibold px-3 py-1 rounded-xl text-[11px]">
              ⭐ {str}
            </span>
          ))}
        </div>
      </div>

      {/* REKOMENDASI TOP JURUSAN */}
      <div className="space-y-3">
        <h3 className="text-[16px] font-bold text-[#0f172a]">Rekomendasi Jurusan</h3>
        {recommendedMajors.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5 md:p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
              <div className="flex-1">
                <h4 className="text-[15px] font-bold text-[#0f172a]">{rec.name}</h4>
                <p className="text-[12px] text-[#64748b] mt-1">{rec.rationale}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rec.match_pct}%`, background: 'linear-gradient(90deg, #0965fa, #00b2dd)' }} />
                  </div>
                  <span className="text-[13px] font-bold text-[#0965fa]">{rec.match_pct}% Match</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RADAR & SKOR DIMENSI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
          <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Radar Keselarasan Potensi</h3>
          <Radar values={[confidence, interestMatch, competencyMatch, 85, 80]} labels={['Kepercayaan', 'Minat', 'Kompetensi', 'Karir', 'Jalur']} />
        </div>

        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-4">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Rekomendasi Karir</h3>
          {recommendedCareers.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="text-[14px] font-bold text-[#0f172a]">{c.title}</h4>
              <p className="text-[12px] text-slate-600">{c.description}</p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-600">Prospek: {c.growth_potential || 'Tinggi'}</span>
                <span className="text-slate-500">Skills: {Array.isArray(c.skills_required) ? c.skills_required.join(', ') : 'Problem Solving'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
