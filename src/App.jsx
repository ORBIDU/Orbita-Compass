import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ActionPlanPage from './pages/ActionPlanPage'
import CompassPage from './pages/CompassPage'
import SiapPTNPage from './pages/SiapPTNPage'
import SiapSKDPage from './pages/SiapSKDPage'
import SNBPPage from './pages/SNBPPage'
import PotensiDiriPage from './pages/PotensiDiriPage'
import EksplorJurusanPage from './pages/EksplorJurusanPage'
import KonsultasiPage from './pages/KonsultasiPage'

// Help Center page
function HelpCenterPage() {
  return (
    <div className="px-4 py-5 max-w-[640px] mx-auto space-y-4">
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/[0.07]" />
        <h1 className="text-[24px] font-bold text-white relative z-10">Help Center</h1>
        <p className="text-[13px] text-white/70 mt-1 relative z-10">Butuh bantuan? Temukan jawaban di sini.</p>
      </div>
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-4">FAQ</h3>
        {['Bagaimana cara menggunakan Orbita Kompas?', 'Cara mengikuti Tryout SNBT?', 'Bagaimana cara menjadwalkan konsultasi?', 'Apa itu Bintang Belajar?'].map((q, i) => (
          <div key={i} className="py-3 border-b border-[rgba(0,0,0,0.04)] last:border-b-0">
            <p className="text-[13px] font-semibold text-[#0f172a]">{q}</p>
            <p className="text-[11px] text-[#94a3b8] mt-1">Klik untuk melihat jawaban</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Auth Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        }
      />

      {/* App Routes */}
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/action-plan" element={<ActionPlanPage />} />
        <Route path="/potensi-diri" element={<PotensiDiriPage />} />
        <Route path="/orbita-kompas" element={<CompassPage />} />
        <Route path="/siap-ptn" element={<SiapPTNPage />} />
        <Route path="/siap-skd" element={<SiapSKDPage />} />
        <Route path="/eksplor-jurusan" element={<EksplorJurusanPage />} />
        <Route path="/konsultasi" element={<KonsultasiPage />} />
        <Route path="/snbp" element={<SNBPPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
