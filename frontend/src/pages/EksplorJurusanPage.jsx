import { useState, useEffect } from 'react'
import { getMajorsApi } from '../services/api'

export default function EksplorJurusanPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('semua')
  const [majors, setMajors] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const categories = ['Semua', 'SAINTEK', 'SOSHUM', 'Teknik', 'Kesehatan', 'Kedinasan']

  useEffect(() => {
    let isSubscribed = true
    setLoading(true)

    const catQuery = category === 'semua' ? '' : category
    getMajorsApi(catQuery, search, 1, 40)
      .then((data) => {
        if (isSubscribed) {
          setMajors(data.majors || [])
          setTotalCount(data.pagination?.totalCount || (data.majors || []).length)
        }
      })
      .catch((err) => {
        console.error('Failed to load majors:', err)
      })
      .finally(() => {
        if (isSubscribed) setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [search, category])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Eksplor Jurusan</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">
          Temukan jurusan dari {totalCount > 0 ? `${totalCount} program studi PTN & Kedinasan` : '146 PTN & Sekolah Kedinasan di Indonesia'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <input
          type="text"
          placeholder="Cari jurusan (misal: Komputer, Kedokteran, Hukum)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-[13px] placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all mb-3"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c.toLowerCase())}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                category === c.toLowerCase() ? 'bg-[#0965fa] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#0965fa] border-t-transparent rounded-full" />
        </div>
      ) : majors.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[rgba(0,0,0,0.06)] text-[#94a3b8]">
          Tidak ada jurusan yang ditemukan. Coba ubah kata kunci pencarian.
        </div>
      ) : (
        <div className="space-y-3">
          {majors.map(j => (
            <div key={j.id} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff6ff]">
                  <svg className="w-5 h-5 text-[#0965fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0f172a]">{j.name}</p>
                  <p className="text-[11px] text-[#94a3b8]">
                    {j.university?.name || 'PTN Official'} · {j.category || 'SAINTEK'} {j.capacity ? `· Kuota: ${j.capacity}` : ''}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[10px] font-bold text-[#64748b] shrink-0">
                {j.isVokasi ? 'Vokasi/D4' : 'S1'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
