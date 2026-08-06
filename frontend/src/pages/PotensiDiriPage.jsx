import { useState, useEffect } from 'react'
import { getProfileApi } from '../services/api'

export default function PotensiDiriPage() {
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfileApi()
      .then((data) => {
        if (data?.profile?.assessment) {
          setAssessment(data.profile.assessment)
        }
      })
      .catch((err) => console.error('Failed to load assessment:', err))
      .finally(() => setLoading(false))
  }, [])

  const traits = [
    { label: 'Teknologi & Digital', score: assessment?.technology || 88, color: '#0965fa', desc: 'Kemampuan adaptasi teknologi, pemrograman, dan pemecahan masalah digital' },
    { label: 'Riset & Analisis', score: assessment?.research || 82, color: '#059669', desc: 'Kemampuan bernalar analitis, meneliti data, dan berpikir saintifik' },
    { label: 'Kreativitas & Inovasi', score: assessment?.creativity || 75, color: '#7c3aed', desc: 'Kemampuan berpikir out-of-the-box dan menciptakan ide-ide solutif' },
    { label: 'Kepemimpinan (Leadership)', score: assessment?.leadership || 70, color: '#f59e0b', desc: 'Kemampuan mengarahkan tim, mengambil keputusan, dan manajemen waktu' },
    { label: 'Komunikasi & Interpersonal', score: assessment?.communication || 78, color: '#0d9488', desc: 'Kemampuan menyampaikan gagasan dan berkolaborasi dengan pihak lain' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Potensi Diri</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">Kenali kekuatan dan area pengembanganmu berdasarkan penilaian profil database</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#0965fa] border-t-transparent rounded-full" />
        </div>
      ) : (
        traits.map(t => (
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
        ))
      )}
    </div>
  )
}
