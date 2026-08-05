import { useState } from 'react'

const categories = {
  twk: {
    label: 'TWK',
    full: 'Tes Wawasan Kebangsaan',
    color: '#0965fa',
    bg: '#eff6ff',
    materials: [
      { id: 1, title: 'Pancasila', subs: ['Sejarah Pancasila', 'Nilai-Nilai Pancasila', 'Penerapan Pancasila'], progress: 75 },
      { id: 2, title: 'UUD 1945', subs: ['Batang Tubuh UUD', 'Amandemen UUD', 'Hak dan Kewajiban WN'], progress: 40 },
      { id: 3, title: 'NKRI & Bhineka Tunggal Ika', subs: ['Wawasan Nusantara', 'Keberagaman Budaya'], progress: 20 },
    ],
  },
  tiu: {
    label: 'TIU',
    full: 'Tes Intelegensi Umum',
    color: '#0d9488',
    bg: '#f0fdfa',
    materials: [
      { id: 4, title: 'Verbal', subs: ['Sinonim & Antonim', 'Analogi', 'Penalaran Analitis'], progress: 60 },
      { id: 5, title: 'Numerik', subs: ['Deret Angka', 'Aritmatika', 'Perbandingan Kuantitatif'], progress: 35 },
      { id: 6, title: 'Figural', subs: ['Pola Gambar', 'Keruangan'], progress: 10 },
    ],
  },
  tkp: {
    label: 'TKP',
    full: 'Tes Karakteristik Pribadi',
    color: '#7c3aed',
    bg: '#f5f3ff',
    materials: [
      { id: 7, title: 'Pelayanan Publik', subs: ['Prinsip Pelayanan', 'Etika Pelayanan'], progress: 50 },
      { id: 8, title: 'Jejaring Kerja', subs: ['Komunikasi Efektif', 'Kerja Tim'], progress: 25 },
      { id: 9, title: 'Sosial Budaya', subs: ['Kepekaan Sosial', 'Toleransi'], progress: 0 },
    ],
  },
}

export default function SiapSKDPage() {
  const [activeTab, setActiveTab] = useState('twk')
  const [expandedMaterial, setExpandedMaterial] = useState(null)

  const tabs = [
    { value: 'twk', label: 'TWK' },
    { value: 'tiu', label: 'TIU' },
    { value: 'tkp', label: 'TKP' },
    { value: 'tryout', label: 'Tryout' },
  ]

  const cat = categories[activeTab]

  return (
    <div className="px-4 py-5 max-w-[640px] mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0965fa, #00b2dd)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#0f172a]">Siap SKD</h1>
            <p className="text-[12px] text-[#64748b]">Persiapan Seleksi Kompetensi Dasar</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex bg-[#f1f5f9] rounded-xl p-1 gap-1 w-full">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-white text-[#0f172a] shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tryout' ? (
        /* Tryout tab */
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0965fa] to-[#00b2dd] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-[#0f172a] mb-2">Tryout SKD</h2>
          <p className="text-[13px] text-[#64748b] mb-4">Simulasi SKD lengkap dengan 100 soal (TWK + TIU + TKP)</p>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#f8fafc] border border-slate-100 p-3 mb-5">
            {[{ label: 'Soal', value: '100' }, { label: 'Durasi', value: '90 Min' }, { label: 'Passing', value: '311' }].map((info, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] text-[#94a3b8] uppercase font-semibold">{info.label}</p>
                <p className="text-[14px] font-bold text-[#0f172a]">{info.value}</p>
              </div>
            ))}
          </div>
          <button className="px-6 py-3 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer">
            Mulai Tryout SKD →
          </button>
        </div>
      ) : cat && (
        /* Learning materials */
        <div className="space-y-4">
          {/* Category header */}
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: cat.bg }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color }}>
              <span className="text-white text-[11px] font-bold">{cat.label}</span>
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: cat.color }}>{cat.label}</p>
              <p className="text-[11px] text-[#64748b]">{cat.full}</p>
            </div>
          </div>

          {/* Materials */}
          {cat.materials.map(mat => (
            <div key={mat.id} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              {/* Material header */}
              <button
                onClick={() => setExpandedMaterial(expandedMaterial === mat.id ? null : mat.id)}
                className="w-full px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{ backgroundColor: cat.color }}>
                    {mat.id}
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-[#0f172a]">{mat.title}</p>
                    <p className="text-[11px] text-[#94a3b8]">{mat.subs.length} sub-materi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mat.progress}%`, backgroundColor: cat.color }} />
                    </div>
                    <p className="text-[9px] text-[#94a3b8] text-right mt-0.5">{mat.progress}%</p>
                  </div>
                  <svg className={`w-4 h-4 text-[#94a3b8] transition-transform ${expandedMaterial === mat.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Sub-materials */}
              {expandedMaterial === mat.id && (
                <div className="border-t border-[rgba(0,0,0,0.04)]">
                  {mat.subs.map((sub, idx) => {
                    const subProgress = Math.max(0, mat.progress - idx * 25)
                    const isDone = subProgress >= 100
                    const isStarted = subProgress > 0
                    return (
                      <div key={idx} className="px-6 py-4 flex items-center justify-between border-b border-[rgba(0,0,0,0.03)] last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isDone ? 'bg-[#f0fdf4] text-[#22c55e]' : 'bg-[#f8fafc] text-[#94a3b8]'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[13px] ${isDone ? 'text-[#94a3b8] line-through' : 'text-[#0f172a] font-medium'}`}>{sub}</span>
                        </div>
                        <button className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-[#f0fdf4] text-[#22c55e]'
                            : isStarted
                              ? 'bg-[#0965fa] text-white hover:bg-[#0755d0]'
                              : 'border border-[rgba(0,0,0,0.1)] text-[#64748b] hover:border-[#0965fa] hover:text-[#0965fa]'
                        }`}>
                          {isDone ? 'Selesai' : isStarted ? 'Lanjutkan' : 'Mulai'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
