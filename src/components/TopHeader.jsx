import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function TopHeader({ onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const { user, logout } = useAuth()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, title: 'Tryout SNBT #5 Tersedia', desc: 'Simulasi baru telah dibuka', time: '10 menit yang lalu' },
    { id: 2, title: 'Target Misi Tercapai', desc: 'Kamu menyelesaikan 20 soal MTK', time: '1 jam yang lalu' },
    { id: 3, title: 'Rekomendasi Baru dari Guru BK', desc: 'Cek menu Konsultasi', time: '3 jam yang lalu' },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.06)] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Title / Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-[#64748b] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? 'text-[#0965fa]' : 'text-[#94a3b8]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari jurusan, kampus, atau misi..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#f8fafc] border border-slate-200 text-[13px] text-[#0f172a] placeholder:text-slate-400 outline-none focus:border-[#0965fa] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Icon */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
              className="w-10 h-10 rounded-2xl bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff7000]" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-[#0f172a]">Notifikasi</h3>
                  <span className="text-[10px] font-bold text-[#0965fa] bg-[#eff6ff] px-2 py-0.5 rounded-md">3 Baru</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-[280px] overflow-y-auto">
                  {notifications.map(notif => (
                    <button
                      key={notif.id}
                      className="w-full text-left px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#0965fa] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#0f172a] truncate">{notif.title}</p>
                          <p className="text-[11px] text-[#64748b] mt-0.5">{notif.desc}</p>
                          <p className="text-[10px] text-[#94a3b8] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0965fa] to-[#00b2dd] flex items-center justify-center">
                <span className="text-[12px] font-bold text-white">{user?.initials || 'AR'}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-bold text-[#0f172a] leading-tight">{user?.name || 'Ahmad Rizki'}</p>
                <p className="text-[11px] text-[#64748b] leading-tight">{user?.kelas || 'Kelas XII IPA 1'}</p>
              </div>
              <svg className="w-3.5 h-3.5 text-[#94a3b8] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Menu */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-[12px] font-bold text-[#0f172a]">{user?.name}</p>
                  <p className="text-[11px] text-[#64748b]">{user?.kelas}</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-[#0f172a] hover:bg-slate-50 transition-colors cursor-pointer">
                  Informasi Profil
                </button>
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-[#0f172a] hover:bg-slate-50 transition-colors cursor-pointer">
                  Refleksi & Rapor
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setShowProfile(false)
                    logout()
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
