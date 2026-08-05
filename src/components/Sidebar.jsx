import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const menuGroups = [
  {
    label: 'UTAMA',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'home' },
      { id: 'action-plan', label: 'Action Plan', path: '/action-plan', icon: 'target' },
    ],
  },
  {
    label: 'PROFIL & ANALISIS',
    items: [
      { id: 'potensi-diri', label: 'Potensi Diri', path: '/potensi-diri', icon: 'user' },
      { id: 'orbita-kompas', label: 'Orbita Kompas', path: '/orbita-kompas', icon: 'compass' },
    ],
  },
  {
    label: 'PERSIAPAN PTN',
    items: [
      { id: 'siap-ptn', label: 'Siap PTN', path: '/siap-ptn', icon: 'graduation' },
      { id: 'siap-skd', label: 'Siap SKD', path: '/siap-skd', icon: 'shield' },
      { id: 'eksplor-jurusan', label: 'Eksplor Jurusan', path: '/eksplor-jurusan', icon: 'search' },
      { id: 'konsultasi', label: 'Konsultasi Guru BK', path: '/konsultasi', icon: 'chat' },
    ],
  },
]

const icons = {
  home: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  target: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  user: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  compass: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  graduation: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  shield: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  search: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  chat: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNav = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-[#f1f5f9] shadow-[1px_0_8px_rgba(0,0,0,0.03)] z-50
          transform transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="pt-4 pb-4 flex justify-center">
            <img src="/logo-kepala.png" alt="ORBITA" className="h-16 object-contain" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 pb-6">
            {menuGroups.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#94a3af] px-4 mb-2">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-[14px] rounded-xl text-[14px] transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0965fa] to-[#00b2dd] text-white font-semibold tracking-[0.28px] border-r-4 border-[#00288e] shadow-lg shadow-orbit-1/20'
                            : 'text-[#444653] hover:bg-[#f5f6fb]'
                        }`}
                      >
                        {icons[item.icon]}
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="px-4 py-4 border-t border-[#f1f5f9]">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-[#444653] hover:bg-[#f5f6fb] transition-all cursor-pointer">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help Center
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
