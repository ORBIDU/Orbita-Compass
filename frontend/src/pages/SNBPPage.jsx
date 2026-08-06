import { useState, useEffect } from 'react'
import { getRaporApi, getRationalizationApi } from '../services/api'

const stepLabels = ['Input Data', 'Review Data', 'Analisis', 'Hasil']

function Stepper({ current }) {
  return (
    <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                i < current ? 'bg-[#10b981] text-white' : i === current ? 'bg-[#0965fa] text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'
              }`}>
                {i < current ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold ${i <= current ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>{label}</span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`w-8 sm:w-12 h-[2px] mx-1 sm:mx-2 rounded-full mb-5 ${i < current ? 'bg-[#10b981]' : 'bg-[#f1f5f9]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Radar({ values, labels, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 28
  const axes = labels.length
  const getPoint = (i, v) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2
    const dist = (v / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }
  return (
    <svg width={size} height={size} className="mx-auto">
      {[0.25, 0.5, 0.75, 1].map(l => (
        <polygon key={l} points={Array.from({ length: axes }, (_, i) => { const p = getPoint(i, l * 100); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="#f1f5f9" strokeWidth={1} />
      ))}
      {Array.from({ length: axes }, (_, i) => { const p = getPoint(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} /> })}
      <polygon points={values.map((v, i) => { const p = getPoint(i, v); return `${p.x},${p.y}` }).join(' ')} fill="rgba(9,101,250,0.15)" stroke="#0965fa" strokeWidth={2} />
      {values.map((v, i) => { const p = getPoint(i, v); return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#0965fa" /> })}
      {labels.map((label, i) => { const p = getPoint(i, 125); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[9px] fill-[#64748b] font-semibold">{label}</text> })}
    </svg>
  )
}

export default function SNBPPage() {
  const [step, setStep] = useState(0)
  const [academicScores, setAcademicScores] = useState({ s1: 88, s2: 90, s3: 92, s4: 94, s5: 95 })
  const [rationalization, setRationalization] = useState(null)
  const [tkaWajib, setTkaWajib] = useState({ bin: 88, mtk: 92, big: 85 })
  const [tkaPilihan, setTkaPilihan] = useState(['Fisika'])
  const [prestasi, setPrestasi] = useState([])
  const [target1Univ, setTarget1Univ] = useState('Universitas Indonesia')
  const [target1Prodi, setTarget1Prodi] = useState('Sistem Informasi')
  const [target2Univ, setTarget2Univ] = useState('Universitas Gadjah Mada')
  const [target2Prodi, setTarget2Prodi] = useState('Teknik Informatika')
  const [processingStep, setProcessingStep] = useState(0)

  useEffect(() => {
    // Load academic records from DB
    getRaporApi()
      .then((data) => {
        if (data?.academicRecords && data.academicRecords.length > 0) {
          const semMap = { s1: [], s2: [], s3: [], s4: [], s5: [] }
          data.academicRecords.forEach(r => {
            const key = `s${r.semester}`
            if (semMap[key]) semMap[key].push(r.score)
          })
          const newScores = {}
          Object.keys(semMap).forEach(k => {
            if (semMap[k].length > 0) {
              newScores[k] = Math.round(semMap[k].reduce((a, b) => a + b, 0) / semMap[k].length)
            }
          })
          setAcademicScores(prev => ({ ...prev, ...newScores }))
        }
      })
      .catch((err) => console.error('Failed to load rapor:', err))

    // Load rationalization calculation from backend API
    getRationalizationApi()
      .then((data) => {
        if (data) {
          setRationalization(data)
          if (data.targetPtn) setTarget1Univ(data.targetPtn)
          if (data.targetMajor) setTarget1Prodi(data.targetMajor)
        }
      })
      .catch((err) => console.error('Failed to load rationalization:', err))
  }, [])

  const avg = Object.values(academicScores).reduce((a, b) => a + b, 0) / 5

  const pilihanMapel = ['Fisika', 'Kimia', 'Biologi', 'Ekonomi', 'Geografi', 'Sosiologi']
  const prestasiOptions = ['Olimpiade Sains', 'Programming/IT', 'OSIS/MPK', 'Volunteer/Sosial']

  const univs = ['Universitas Indonesia', 'Institut Teknologi Bandung', 'Universitas Gadjah Mada', 'Universitas Airlangga', 'Universitas Diponegoro', 'Institut Teknologi Sepuluh Nopember']
  const prodis = ['Sistem Informasi', 'Teknik Informatika', 'Ilmu Komputer', 'Matematika', 'Kedokteran', 'Farmasi', 'Akuntansi']

  useEffect(() => {
    if (step === 2) {
      const steps = ['Menganalisis data akademik...', 'Menghitung kompatibilitas jurusan...', 'Membandingkan dengan data historis...', 'Menghasilkan rekomendasi...']
      let i = 0
      const interval = setInterval(() => {
        i++
        setProcessingStep(i)
        if (i >= steps.length) {
          clearInterval(interval)
          setTimeout(() => setStep(3), 1000)
        }
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [step])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <Stepper current={step} />

      {/* Step 0: Input Data */}
      {step === 0 && (
        <div className="space-y-4">
          {/* Data Akademik */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Data Akademik</h3>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {['s1', 's2', 's3', 's4', 's5'].map((s, i) => (
                <div key={s} className="text-center">
                  <label className="text-[10px] text-[#94a3b8] font-semibold block mb-1">Sem {i + 1}</label>
                  <input
                    type="number"
                    value={academicScores[s]}
                    onChange={e => setAcademicScores(prev => ({ ...prev, [s]: +e.target.value }))}
                    className="w-full px-2 py-2 text-center rounded-xl border border-slate-200 text-[14px] font-bold text-[#0f172a] outline-none focus:border-[#0965fa] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
            <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-3 text-center">
              <p className="text-[10px] text-[#0965fa] font-semibold uppercase">Rata-rata</p>
              <p className="text-[21px] font-extrabold text-[#0965fa]">{avg.toFixed(1)}</p>
            </div>
          </div>

          {/* Nilai TKA */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Nilai TKA</h3>
            <p className="text-[11px] font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">Wajib</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{ key: 'bin', label: 'B. Indonesia' }, { key: 'mtk', label: 'Matematika' }, { key: 'big', label: 'B. Inggris' }].map(m => (
                <div key={m.key}>
                  <label className="text-[10px] text-[#94a3b8] font-semibold block mb-1">{m.label}</label>
                  <input
                    type="number"
                    value={tkaWajib[m.key]}
                    onChange={e => setTkaWajib(prev => ({ ...prev, [m.key]: +e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] font-bold text-[#0f172a] outline-none focus:border-[#0965fa] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">Pilihan (maks. 2)</p>
            <div className="grid grid-cols-3 gap-2">
              {pilihanMapel.map(m => {
                const active = tkaPilihan.includes(m)
                const disabled = !active && tkaPilihan.length >= 2
                return (
                  <button
                    key={m}
                    onClick={() => {
                      if (active) setTkaPilihan(prev => prev.filter(x => x !== m))
                      else if (tkaPilihan.length < 2) setTkaPilihan(prev => [...prev, m])
                    }}
                    disabled={disabled}
                    className={`px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                      active ? 'bg-[#eff6ff]/80 border-[#0965fa] text-[#0965fa]' :
                      disabled ? 'bg-[#f8fafc] text-[#94a3b8] border-slate-100 cursor-not-allowed' :
                      'bg-white text-[#374151] border-[rgba(0,0,0,0.08)] hover:border-[#0965fa30]'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prestasi */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Prestasi (maks. 3)</h3>
            <div className="grid grid-cols-2 gap-2">
              {prestasiOptions.map(p => {
                const active = prestasi.includes(p)
                const disabled = !active && prestasi.length >= 3
                return (
                  <button
                    key={p}
                    onClick={() => {
                      if (active) setPrestasi(prev => prev.filter(x => x !== p))
                      else if (prestasi.length < 3) setPrestasi(prev => [...prev, p])
                    }}
                    disabled={disabled}
                    className={`px-3 py-2.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer text-left ${
                      active ? 'bg-[#f0fdf4]/70 border-[#10b981] text-emerald-700' :
                      disabled ? 'bg-[#f8fafc] text-[#94a3b8] border-slate-100 cursor-not-allowed' :
                      'bg-white text-[#374151] border-[rgba(0,0,0,0.08)] hover:border-emerald-300'
                    }`}
                  >
                    {active && '✓ '}{p}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Target SNBP */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Target SNBP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Pilihan 1', univ: target1Univ, setUniv: setTarget1Univ, prodi: target1Prodi, setProdi: setTarget1Prodi },
                { label: 'Pilihan 2', univ: target2Univ, setUniv: setTarget2Univ, prodi: target2Prodi, setProdi: setTarget2Prodi },
              ].map((t, i) => (
                <div key={i} className="bg-[#f8fafc] p-5 rounded-2xl">
                  <p className="text-[11px] font-bold text-[#94a3b8] uppercase mb-3">{t.label}</p>
                  <div className="space-y-3">
                    <select value={t.univ} onChange={e => t.setUniv(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] appearance-none bg-white cursor-pointer">
                      {univs.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <select value={t.prodi} onChange={e => t.setProdi(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] appearance-none bg-white cursor-pointer">
                      {prodis.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(1)} className="w-full py-3.5 rounded-2xl bg-[#0965fa] text-white text-[14px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer">
            Lanjut ke Review →
          </button>
        </div>
      )}

      {/* Step 1: Review */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Review Data</h3>
            <div className="space-y-3">
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[11px] text-[#94a3b8] font-semibold uppercase">Rata-rata Akademik</p>
                <p className="text-[18px] font-bold text-[#0965fa] mt-1">{avg.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[11px] text-[#94a3b8] font-semibold uppercase">Target Pilihan 1</p>
                <p className="text-[13px] font-bold text-[#0f172a] mt-1">{target1Prodi}</p>
                <p className="text-[11px] text-[#64748b]">{target1Univ}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[11px] text-[#94a3b8] font-semibold uppercase">Target Pilihan 2</p>
                <p className="text-[13px] font-bold text-[#0f172a] mt-1">{target2Prodi}</p>
                <p className="text-[11px] text-[#64748b]">{target2Univ}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-2xl border border-slate-200 text-[13px] text-[#64748b] hover:bg-slate-50 transition-colors cursor-pointer">
              ← Kembali
            </button>
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer">
              Mulai Analisis →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-8 text-center">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #0965fa, #00b2dd)' }}>
            <div className="absolute inset-0 rounded-3xl animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #0965fa, #00b2dd)' }} />
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <div className="bg-[#1a1d2e] rounded-2xl px-6 md:px-8 py-5 text-left mb-5">
            <p className="text-[#00b2dd] text-[11px] font-mono font-semibold mb-3">ORBITA AI · NLP Analysis</p>
            {['Menganalisis data akademik...', 'Menghitung kompatibilitas jurusan...', 'Membandingkan dengan data historis...', 'Menghasilkan rekomendasi...'].map((text, i) => (
              <div key={i} className={`flex items-center gap-2 py-1 ${i <= processingStep ? 'opacity-100' : 'opacity-30'}`}>
                {i < processingStep ? (
                  <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : i === processingStep ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00b2dd] border-t-transparent animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-[#94a3b8]/30" />
                )}
                <span className="text-[12px] text-slate-300 font-mono">{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Pilihan 1</p>
              <p className="text-[15px] font-bold text-[#0f172a] mt-1">{target1Prodi}</p>
              <p className="text-[11px] text-[#64748b]">{target1Univ}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] text-[11px] font-bold">Peluang: Tinggi</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Pilihan 2</p>
              <p className="text-[15px] font-bold text-[#0f172a] mt-1">{target2Prodi}</p>
              <p className="text-[11px] text-[#64748b]">{target2Univ}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#fffbeb] text-[#92400e] text-[11px] font-bold">Peluang: Sedang</span>
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Profil Akademik</h3>
            <Radar values={[87, 82, 78, 85, 80]} labels={['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5']} />
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Hal yang Perlu Diperhatikan</h3>
            <div className="space-y-3">
              {['Rata-rata nilaimu berada di atas passing grade umum untuk kedua pilihan jurusan.', 'Trend nilai menunjukkan peningkatan konsisten — ini menjadi poin positif di mata penilaian SNBP.', 'Perbanyak prestasi non-akademik untuk memperkuat portofolio.'].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-[#f8fafc] p-4">
                  <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-[#0965fa]">{i + 1}</span>
                  </div>
                  <p className="text-[12px] text-[#0f172a] leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #0965fa, #00b2dd)' }}>
            <h3 className="text-[15px] font-bold text-white mb-2">Kesimpulan</h3>
            <p className="text-[13px] text-white/80 leading-relaxed">
              Berdasarkan analisis komprehensif, peluangmu untuk diterima di {target1Prodi} ({target1Univ}) melalui jalur SNBP cukup <strong className="text-white">tinggi</strong>. Pertahankan konsistensi nilai dan tingkatkan portofolio prestasimu.
            </p>
          </div>

          <button onClick={() => { setStep(0); }} className="w-full py-3 rounded-2xl border border-slate-200 text-[13px] text-[#64748b] hover:bg-slate-50 transition-colors cursor-pointer">
            Mulai Analisis Baru
          </button>
        </div>
      )}
    </div>
  )
}
