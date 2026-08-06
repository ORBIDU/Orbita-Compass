import { useState, useEffect } from 'react'
import { getTeachersApi, getBookingsApi, createBookingApi } from '../services/api'

export default function KonsultasiPage() {
  const [message, setMessage] = useState('')
  const [teachers, setTeachers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sentToast, setSentToast] = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      getTeachersApi().catch(() => ({ teachers: [] })),
      getBookingsApi().catch(() => ({ bookings: [] }))
    ]).then(([tData, bData]) => {
      setTeachers(tData.teachers || [])
      setBookings(bData.bookings || [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      const teacherId = teachers[0]?.id || ''
      const scheduledAt = new Date(Date.now() + 86400000 * 2).toISOString()
      await createBookingApi({ teacherId, topic: message, scheduledAt })
      setMessage('')
      setSentToast(true)
      setTimeout(() => setSentToast(false), 3000)
      loadData()
    } catch (err) {
      console.error('Failed to send booking:', err)
    } finally {
      setSending(false)
    }
  }

  const sessions = bookings.length > 0
    ? bookings.map(b => ({
        id: b.id,
        guru: b.teacher?.name || 'Bapak Ahmad, S.Pd. (BK)',
        topik: b.topic || 'Konsultasi Bimbingan',
        date: new Date(b.scheduledAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: b.status === 'APPROVED' || b.status === 'SCHEDULED' ? 'scheduled' : 'done'
      }))
    : [
        { id: 1, guru: 'Bapak Ahmad, S.Pd.', topik: 'Konsultasi Pemilihan Jurusan PTN', date: 'Rabu, 6 Agt 2026 · 10:00', status: 'scheduled' },
        { id: 2, guru: 'Ibu Sari Dewi, S.Pd', topik: 'Review Rapor & Portofolio SNBP', date: 'Kamis, 7 Agt 2026 · 13:00', status: 'scheduled' },
      ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Konsultasi Guru BK</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">
          {teachers.length > 0 ? `Tersedia ${teachers.length} Guru BK untuk bimbingan langsung` : 'Jadwalkan konsultasi dan dapatkan bimbingan langsung'}
        </p>
      </div>

      {sentToast && (
        <div className="bg-[#f0fdf4] border border-[#22c55e30] rounded-2xl p-4 text-[#15803d] text-[13px] font-semibold flex items-center gap-2">
          <span>✓</span> Permohonan konsultasi berhasil dikirim ke Guru BK!
        </div>
      )}

      {/* Quick Message */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Kirim Pesan / Pengajuan Konsultasi Cepat</h3>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tulis pertanyaan atau keperluan bimbingan jurusan/rapor..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-[13px] placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={sending || !message.trim()}
          className="mt-3 px-5 py-2.5 rounded-2xl bg-[#0965fa] text-white text-[13px] font-bold hover:bg-[#0755d0] transition-colors cursor-pointer disabled:opacity-50"
        >
          {sending ? 'Mengirim...' : 'Kirim Pesan BK'}
        </button>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
        <h3 className="text-[14px] font-bold text-[#0f172a] mb-4">Jadwal Sesi Konsultasi</h3>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin w-6 h-6 border-3 border-[#0965fa] border-t-transparent rounded-full" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
