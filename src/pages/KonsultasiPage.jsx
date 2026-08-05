import { useState } from 'react'

export default function KonsultasiPage() {
  const [message, setMessage] = useState('')

  const sessions = [
    { id: 1, guru: 'Ibu Sari Dewi, S.Pd', topik: 'Konsultasi Pemilihan Jurusan', date: 'Rabu, 6 Agt 2026 · 10:00', status: 'scheduled', color: '#0965fa' },
    { id: 2, guru: 'Bapak Ahmad, M.Pd', topik: 'Review Rapor & Portofolio SNBP', date: 'Kamis, 7 Agt 2026 · 13:00', status: 'scheduled', color: '#7c3aed' },
    { id: 3, guru: 'Ibu Sari Dewi, S.Pd', topik: 'Evaluasi Progress Belajar', date: 'Senin, 28 Jul 2026 · 10:00', status: 'done', color: '#22c55e' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Konsultasi Guru BK</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">Jadwalkan konsultasi dan dapatkan bimbingan langsung</p>
      </div>

      {/* Quick Message */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Kirim Pesan Cepat</h3>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tulis pertanyaan atau keperluan konsultasi..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-[13px] placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
        <button className="mt-3 px-5 py-2.5 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer">
          Kirim Pesan
        </button>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <h3 className="text-[14px] font-bold text-[#0f172a] mb-4">Jadwal Konsultasi</h3>
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s.id} className="rounded-2xl border border-[rgba(0,0,0,0.06)] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-bold text-[#0f172a]">{s.topik}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{s.guru}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-1">{s.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  s.status === 'scheduled' ? 'bg-[#eff6ff] text-[#0965fa]' : 'bg-[#f0fdf4] text-[#22c55e]'
                }`}>
                  {s.status === 'scheduled' ? 'Terjadwal' : 'Selesai'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Schedule */}
      <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#0965fa30] text-[13px] font-bold text-[#0965fa] hover:bg-[#f0f6ff] transition-colors cursor-pointer">
        + Jadwalkan Konsultasi Baru
      </button>
    </div>
  )
}
