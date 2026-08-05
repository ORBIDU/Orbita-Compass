import { useState, useEffect } from 'react'
import { getProfileApi } from '../services/api'

export default function PotensiDiriPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfileApi()
      .then(res => {
        if (res.profile) setProfile(res.profile)
      })
      .catch(err => console.warn('PotensiDiri load note:', err.message))
      .finally(() => setLoading(false))
  }, [])

  const assessment = profile?.assessment || { technology: 88, research: 82, creativity: 75, leadership: 70, communication: 78 }

  const traits = [
    { label: 'Teknologi & Algoritma', score: assessment.technology, color: '#0965fa', bg: '#eff6ff', desc: 'Kemampuan berpikir logis, komputasi, dan penyelesaian masalah analitis.' },
    { label: 'Riset & Metodologi Data', score: assessment.research, color: '#059669', bg: '#f0fdf4', desc: 'Kemampuan melakukan penelusuran ilmiah, eksplorasi data, dan riset.' },
    { label: 'Kreativitas & Desain', score: assessment.creativity, color: '#7c3aed', bg: '#f5f3ff', desc: 'Kemampuan memvisualisasikan ide, inovasi media, dan berpikir out-of-the-box.' },
    { label: 'Kepemimpinan & Manajemen', score: assessment.leadership, color: '#f59e0b', bg: '#fffbeb', desc: 'Kemampuan mengorganisir tim, mengambil keputusan, dan mengelola agenda.' },
    { label: 'Komunikasi Publik', score: assessment.communication, color: '#0d9488', bg: '#f0fdfa', desc: 'Kemampuan menyampaikan gagasan secara tertulis maupun lisan dengan baik.' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Potensi Diri Real</h1>
        <p className="text-[13px] text-white/80 mt-1 relative z-10">Kenali 5 dimensi potensi diri kamu yang tersimpan di database sistem</p>
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
