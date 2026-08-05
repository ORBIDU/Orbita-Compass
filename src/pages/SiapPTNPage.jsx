import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function SegCtrl({ options, value, onChange, variant = 'default' }) {
  return (
    <div className="inline-flex bg-[#f1f5f9] rounded-xl p-1 gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
            value === opt.value
              ? variant === 'colored'
                ? 'text-white shadow-md'
                : 'bg-white text-[#0f172a] shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
              : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
          style={value === opt.value && variant === 'colored' ? { background: 'linear-gradient(135deg, #0965fa, #00b2dd)' } : {}}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg shadow-lg px-3 py-2">
        <p className="text-[11px] text-[#94a3b8]">{label}</p>
        <p className="text-[13px] font-bold text-[#0965fa]">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function SiapPTNPage() {
  const [mainTab, setMainTab] = useState('snbt')
  const [subTab, setSubTab] = useState('tryout')
  const [step, setStep] = useState(1)
  const [univ, setUniv] = useState('')
  const [prodi, setProdi] = useState('')

  const univs = ['Universitas Indonesia', 'Institut Teknologi Bandung', 'Universitas Gadjah Mada', 'Universitas Airlangga', 'Universitas Diponegoro', 'Institut Teknologi Sepuluh Nopember', 'Universitas Padjadjaran', 'Universitas Sebelas Maret', 'Universitas Hasanuddin', 'Universitas Sriwijaya', 'Universitas Jember', 'Universitas Negeri Semarang', 'UIN Jakarta', 'Universitas Jenderal Soedirman', 'UPN Veteran Yogyakarta', 'Universitas Lampung', 'Universitas Bengkulu', 'Universitas Jambi', 'Universitas Pendidikan Ganesha', 'Politeknik Negeri Semarang']
  const prodis = ['Sistem Informasi', 'Teknik Informatika', 'Ilmu Komputer', 'Matematika', 'Teknik Kimia', 'Teknik Elektro', 'Teknik Mesin', 'Kedokteran', 'Farmasi', 'Akuntansi', 'Manajemen', 'Hukum', 'Psikologi', 'Ilmu Komunikasi', 'Hubungan Internasional', 'Teknik Sipil', 'Arsitektur', 'Biologi', 'Kimia', 'Fisika']

  const trendData = [
    { name: 'TO 1', score: 520 }, { name: 'TO 2', score: 548 }, { name: 'TO 3', score: 570 },
    { name: 'TO 4', score: 595 }, { name: 'TO 5', score: 610 }, { name: 'TO 6', score: 624 },
  ]

  return (
    <div className="px-4 py-5 max-w-[640px] mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0965fa, #00b2dd)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <h1 className="text-[18px] font-bold text-[#0f172a]">Siap PTN</h1>
          </div>
          <div className="flex items-center gap-2">
            <SegCtrl
              options={[{ value: 'snbp', label: 'SNBP' }, { value: 'snbt', label: 'SNBT' }]}
              value={mainTab}
              onChange={setMainTab}
              variant="colored"
            />
            <button className="px-3 py-2 rounded-xl border border-[#0965fa40] text-[12px] font-bold text-[#0965fa] hover:bg-[#f0f6ff] transition-colors cursor-pointer" style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)' }}>
              Panduan PTN
            </button>
          </div>
        </div>
      </div>

      {mainTab === 'snbt' && (
        <>
          {/* Sub-tabs */}
          <div className="flex justify-center">
            <SegCtrl
              options={[{ value: 'tryout', label: 'Tryout' }, { value: 'performa', label: 'Performa' }]}
              value={subTab}
              onChange={setSubTab}
            />
          </div>

          {subTab === 'tryout' && (
            <>
              {step === 1 && (
                <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
                  <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">Pilih Target Universitas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748b] mb-1.5 block">Universitas</label>
                      <div className="relative">
                        <select value={univ} onChange={e => setUniv(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer pr-10">
                          <option value="">Pilih universitas...</option>
                          {univs.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748b] mb-1.5 block">Program Studi</label>
                      <div className="relative">
                        <select value={prodi} onChange={e => setProdi(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-[#0f172a] appearance-none bg-white cursor-pointer pr-10">
                          <option value="">Pilih program studi...</option>
                          {prodis.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {univ && prodi && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#eff6ff] border border-[#0965fa30]">
                        <svg className="w-3.5 h-3.5 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[11px] font-semibold text-[#0965fa]">{univ} — {prodi}</span>
                      </div>
                    )}

                    <button
                      onClick={() => univ && prodi && setStep(2)}
                      disabled={!univ || !prodi}
                      className={`w-full py-3 rounded-2xl text-[13px] font-bold transition-all cursor-pointer ${
                        univ && prodi ? 'bg-[#0965fa] text-white hover:bg-[#0755d0]' : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                      }`}
                    >
                      Lanjut ke Analisis →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[12px] text-[#0965fa] font-semibold mb-4 hover:text-[#0755d0] transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                  </button>
                  <h3 className="text-[15px] font-bold text-[#0f172a]">Analisis Skor</h3>
                  <p className="text-[12px] text-[#94a3b8] mt-1">Passing Grade {prodi} di {univ}</p>

                  <div className="mt-5 rounded-2xl bg-[#eff6ff] border border-[#0965fa20] p-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0965fa]">PASSING GRADE</p>
                    <p className="text-[48px] font-black text-[#0965fa] leading-tight mt-1">645</p>
                  </div>

                  <button className="w-full mt-5 py-3 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer">
                    Mulai Tryout →
                  </button>
                </div>
              )}
            </>
          )}

          {subTab === 'performa' && (
            <div className="space-y-4">
              {/* Trend Skor */}
              <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
                <h3 className="text-[14px] font-bold text-[#0f172a] mb-4">Trend Skor</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="#0965fa" strokeWidth={2.5} dot={{ fill: '#0965fa', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Prediksi Skor */}
              <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 text-center">
                <h3 className="text-[12px] font-bold text-[#0f172a] mb-2">Prediksi Skor</h3>
                <p className="text-[36px] font-black text-[#0965fa]">648</p>
                <p className="text-[10px] text-[#94a3b8]">Estimasi berdasarkan tren</p>
              </div>
            </div>
          )}
        </>
      )}

      {mainTab === 'snbp' && (
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0965fa] to-[#00b2dd] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-[#0f172a] mb-2">Rasionalisasi SNBP</h2>
          <p className="text-[13px] text-[#64748b] mb-4">Analisis peluang seleksi berdasarkan data akademikmu</p>
          <button
            onClick={() => {
              // Navigate to SNBP page - for now just show alert
              window.location.href = '/snbp'
            }}
            className="px-6 py-3 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer"
          >
            Mulai Rasionalisasi →
          </button>
        </div>
      )}
    </div>
  )
}
