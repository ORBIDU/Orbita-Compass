import { useState, useEffect } from 'react'
import { getMajorsApi, getUniversitiesApi } from '../services/api'

export default function EksplorJurusanPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [majors, setMajors] = useState([])
  const [universities, setUniversities] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const categories = ['Semua', 'Saintek', 'Soshum', 'Vokasi', 'Kedinasan']

  // Initial & Filter Reset Load
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        setPage(1)
        const [majRes, univRes] = await Promise.allSettled([
          getMajorsApi(category === 'Semua' ? '' : category, search, 1, 25),
          getUniversitiesApi('', '', 1, 30),
        ])

        if (majRes.status === 'fulfilled' && majRes.value.majors) {
          setMajors(majRes.value.majors)
          if (majRes.value.pagination) {
            setHasMore(majRes.value.pagination.hasMore)
            setTotalCount(majRes.value.pagination.totalCount)
          }
        }

        if (univRes.status === 'fulfilled' && univRes.value.universities) {
          setUniversities(univRes.value.universities)
        }
      } catch (err) {
        console.warn('EksplorJurusan load note:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [category, search])

  // Lazy Load More Pages
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return
    const nextPage = page + 1
    try {
      setLoadingMore(true)
      const majRes = await getMajorsApi(category === 'Semua' ? '' : category, search, nextPage, 25)
      if (majRes.majors) {
        setMajors(prev => [...prev, ...majRes.majors])
        setPage(nextPage)
        if (majRes.pagination) {
          setHasMore(majRes.pagination.hasMore)
        }
      }
    } catch (err) {
      console.warn('Lazy load error note:', err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Eksplor Jurusan & PTN</h1>
        <p className="text-[13px] text-white/80 mt-1 relative z-10">
          Daftar lengkap 1.895 jurusan & 149 kampus resmi dengan sistem Lazy Load cepat
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <input
          type="text"
          placeholder="Cari jurusan (misal: Komputer, Kedokteran, Akuntansi, STAN)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-[13px] placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all mb-3 font-semibold"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                category === c ? 'bg-[#0965fa] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl text-center">
          <p className="text-[10px] font-bold text-blue-600 uppercase">Institusi PTN & Kedinasan</p>
          <p className="text-[18px] font-black text-blue-700">149 Kampus</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl text-center">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Total Jurusan Terdaftar</p>
          <p className="text-[18px] font-black text-emerald-700">{totalCount || 1895} Prodi</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-amber-600 uppercase">Status Load</p>
          <p className="text-[18px] font-black text-amber-700">Terbuka {majors.length} Item</p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {majors.length > 0 ? (
          majors.map((j, idx) => (
            <div key={j.id || idx} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  🎓
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]">{j.name}</p>
                  <p className="text-[11px] text-[#64748b]">
                    {j.university?.name || 'Perguruan Tinggi'} ({j.university?.city || 'Indonesia'}) · {j.category} · Akreditasi {j.accreditation || 'Unggul'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700">
                  SNBP: {j.capacitySnbp || 0}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700">
                  SNBT: {j.capacitySnbt || 0}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-teal-100 text-teal-700">
                  Mandiri: {j.capacityMandiri || 0}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500 text-xs">
            {loading ? 'Memuat data jurusan...' : 'Tidak ada jurusan yang cocok dengan pencarian.'}
          </div>
        )}
      </div>

      {/* LAZY LOAD MORE BUTTON */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold px-8 py-3 rounded-2xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loadingMore ? 'Memuat data tambahan...' : '👇 Muat Lebih Banyak (Lazy Load)'}
          </button>
        </div>
      )}
    </div>
  )
}
