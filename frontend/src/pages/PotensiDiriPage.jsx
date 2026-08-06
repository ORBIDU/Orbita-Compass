export default function PotensiDiriPage() {
  const traits = [
    { label: 'Logis-Matematis', score: 88, color: '#0965fa', bg: '#eff6ff', desc: 'Kemampuan berpikir logis dan menyelesaikan masalah matematika' },
    { label: 'Linguistik', score: 72, color: '#059669', bg: '#f0fdf4', desc: 'Kemampuan berbahasa dan komunikasi tertulis' },
    { label: 'Visual-Spasial', score: 80, color: '#7c3aed', bg: '#f5f3ff', desc: 'Kemampuan memvisualisasikan dan berpikir dalam gambar' },
    { label: 'Interpersonal', score: 75, color: '#f59e0b', bg: '#fffbeb', desc: 'Kemampuan memahami dan berinteraksi dengan orang lain' },
    { label: 'Naturalis', score: 65, color: '#0d9488', bg: '#f0fdfa', desc: 'Kemampuan mengenali dan memahami alam sekitar' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Potensi Diri</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">Kenali kekuatan dan area pengembanganmu berdasarkan analisis AI</p>
      </div>

      {/* Traits */}
      {traits.map(t => (
        <div key={t.label} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0f172a]">{t.label}</h3>
            <span className="text-[18px] font-bold" style={{ color: t.color }}>{t.score}%</span>
          </div>
          <p className="text-[12px] text-[#64748b] mb-3">{t.desc}</p>
          <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.score}%`, backgroundColor: t.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}
