import { useState } from 'react'

export default function EksplorJurusanPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('semua')

  const categories = ['Semua', 'Teknik', 'Sains', 'Sosial', 'Kesehatan', 'Seni']

  const jurusans = [
    { name: 'Sistem Informasi', rumpun: 'Teknik', univ: 12, akreditasi: 'A', color: '#0965fa' },
    { name: 'Teknik Informatika', rumpun: 'Teknik', univ: 45, akreditasi: 'A', color: '#0965fa' },
    { name: 'Kedokteran', rumpun: 'Kesehatan', univ: 30, akreditasi: 'A', color: '#ef4444' },
    { name: 'Psikologi', rumpun: 'Sosial', univ: 25, akreditasi: 'A', color: '#f59e0b' },
    { name: 'Ilmu Komputer', rumpun: 'Teknik', univ: 18, akreditasi: 'A', color: '#0965fa' },
    { name: 'Farmasi', rumpun: 'Kesehatan', univ: 22, akreditasi: 'A', color: '#ef4444' },
    { name: 'Matematika', rumpun: 'Sains', univ: 28, akreditasi: 'A', color: '#7c3aed' },
    { name: 'Akuntansi', rumpun: 'Sosial', univ: 40, akreditasi: 'A', color: '#f59e0b' },
    { name: 'Arsitektur', rumpun: 'Seni', univ: 15, akreditasi: 'A', color: '#0d9488' },
  ]

  const filtered = jurusans.filter(j => {
    const matchSearch = j.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'semua' || j.rumpun.toLowerCase() === category
    return matchSearch && matchCat
  })

  return (
    <div className="px-4 py-5 max-w-[640px] mx-auto space-y-4">
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Eksplor Jurusan</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">Temukan jurusan yang sesuai dengan minat dan bakatmu</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <input
          type="text"
          placeholder="Cari jurusan..."
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
      <div className="space-y-3">
        {filtered.map(j => (
          <div key={j.name} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: j.color + '15' }}>
                <svg className="w-5 h-5" style={{ color: j.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0f172a]">{j.name}</p>
                <p className="text-[11px] text-[#94a3b8]">{j.rumpun} · {j.univ} universitas · Akreditasi {j.akreditasi}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-[#0965fa30] text-[11px] font-bold text-[#0965fa] hover:bg-[#f0f6ff] transition-colors cursor-pointer shrink-0">
              Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
