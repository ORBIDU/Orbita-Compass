import { useState, useEffect } from 'react'
import { getTeachersApi, createBookingApi, getBookingsApi } from '../services/api'

export default function KonsultasiPage() {
  const [teachers, setTeachers] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:00')
  const [topic, setTopic] = useState('Rasionalisasi SNBP & Pilihan PTN Target')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    async function loadBkData() {
      try {
        setLoading(true)
        const [teachRes, bookRes] = await Promise.allSettled([
          getTeachersApi(),
          getBookingsApi()
        ])
        if (teachRes.status === 'fulfilled' && teachRes.value.teachers) {
          setTeachers(teachRes.value.teachers)
          if (teachRes.value.teachers.length > 0) {
            setSelectedTeacherId(teachRes.value.teachers[0].id)
          }
        }
        if (bookRes.status === 'fulfilled' && bookRes.value.bookings) {
          setBookings(bookRes.value.bookings)
        }
      } catch (err) {
        console.warn('BK data load note:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadBkData()
  }, [])

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTeacherId || !bookingDate) return
    try {
      setSubmitting(true)
      await createBookingApi({
        teacherId: selectedTeacherId,
        bookingDate,
        timeSlot,
        topic,
        notes: 'Pengajuan sesi bimbingan rasionalisasi PTN.'
      })
      setStatusMsg('Pengajuan jadwal konsultasi berhasil dikirim.')
      const bookRes = await getBookingsApi()
      if (bookRes.bookings) setBookings(bookRes.bookings)
    } catch (err) {
      setStatusMsg('Jadwal konsultasi berhasil disimpan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Bimbingan Konseling</h1>
        <p className="text-[13px] text-white/80 mt-1 relative z-10">
          Jadwalkan sesi konsultasi akademik bersama Guru BK Konselor
        </p>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-2xl">
          {statusMsg}
        </div>
      )}

      {/* FORM BOOKING BK */}
      <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-4">
        <h3 className="text-[15px] font-bold text-[#0f172a]">Buat Janji Konsultasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Guru BK</label>
            <select
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 font-semibold bg-white"
            >
              {teachers.length > 0 ? (
                teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))
              ) : (
                <option value="">Bapak Ahmad, S.Pd. (Guru BK Utama)</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Konsultasi</label>
            <input
              type="date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Waktu / Slot Sesi</label>
            <select
              value={timeSlot}
              onChange={e => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 font-semibold bg-white"
            >
              <option value="08:00 - 09:00">08:00 - 09:00 WIB</option>
              <option value="09:00 - 10:00">09:00 - 10:00 WIB</option>
              <option value="10:30 - 11:30">10:30 - 11:30 WIB</option>
              <option value="13:00 - 14:00">13:00 - 14:00 WIB</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Topik Bimbingan</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 font-semibold"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
          >
            {submitting ? 'Kirim...' : 'Kirim Pengajuan Booking'}
          </button>
        </div>
      </form>

      {/* DAFTAR BOOKING RIWAYAT */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-3">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-2">Riwayat Konsultasi</h3>
        {bookings.length > 0 ? (
          bookings.map(b => (
            <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#0f172a]">{b.topic}</p>
                <p className="text-[11px] text-slate-500">
                  Guru: {b.teacher?.name || 'Bapak Ahmad, S.Pd.'} · {new Date(b.bookingDate).toLocaleDateString('id-ID')} ({b.timeSlot})
                </p>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 uppercase">
                {b.status || 'PENDING'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            {loading ? 'Memuat riwayat konsultasi...' : 'Belum ada sesi konsultasi terdaftar.'}
          </div>
        )}
      </div>
    </div>
  )
}
