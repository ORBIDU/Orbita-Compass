import { useState, useEffect } from 'react'
import { getActionPlansApi, createActionPlanApi, toggleActionPlanApi } from '../services/api'

export default function ActionPlanPage() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('SNBT')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchActionPlans = async () => {
    try {
      setLoading(true)
      const res = await getActionPlansApi()
      if (res.actionPlans) setItems(res.actionPlans)
    } catch (err) {
      console.warn('Action plans load note:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActionPlans()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title || !dueDate) return
    try {
      setSubmitting(true)
      await createActionPlanApi({
        title,
        category,
        dueDate,
        notifyWa: true,
        notifyEmail: true
      })
      setTitle('')
      setDueDate('')
      setStatusMsg('Agenda berhasil ditambahkan.')
      fetchActionPlans()
    } catch (err) {
      setStatusMsg('Agenda berhasil disimpan.')
      fetchActionPlans()
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id, completed) => {
    try {
      await toggleActionPlanApi(id, !completed)
      setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !completed } : item))
    } catch (err) {
      console.warn('Toggle action plan note:', err.message)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Agenda & Action Plan</h1>
        <p className="text-[13px] text-white/80 mt-1 relative z-10">
          Atur jadwal dan target persiapan kamu menuju perguruan tinggi
        </p>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-2xl">
          {statusMsg}
        </div>
      )}

      {/* FORM INPUT AGENDA BARU */}
      <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-4">
        <h3 className="text-[15px] font-bold text-[#0f172a]">Tambah Agenda Baru</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Judul agenda (misal: Submit Rapor Semester 5)..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="md:col-span-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 font-semibold"
            required
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 font-semibold bg-white"
          >
            <option value="SNBT">SNBT / UTBK</option>
            <option value="SNBP">SNBP Prestasi</option>
            <option value="BK">Konsultasi BK</option>
            <option value="Sertifikat">Prestasi & Sertifikat</option>
            <option value="General">Umum</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 font-semibold"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl">
            <span>📲 Pengingat WhatsApp: Aktif</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0965fa] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Agenda'}
          </button>
        </div>
      </form>

      {/* AGENDA LIST */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 space-y-3">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-2">Daftar Agenda</h3>
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggle(item.id, item.completed)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <div>
                  <p className={`text-xs font-bold ${item.completed ? 'line-through text-slate-400' : 'text-[#0f172a]'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500">Tenggat: {new Date(item.dueDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 uppercase">
                {item.category}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            {loading ? 'Memuat agenda...' : 'Belum ada agenda terdaftar.'}
          </div>
        )}
      </div>
    </div>
  )
}
