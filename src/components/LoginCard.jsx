import { useState } from 'react'
import RoleSelector from './RoleSelector'
import { useAuth } from '../context/AuthContext'

export default function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('siswa')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    setTimeout(() => {
      const result = login(email, password, selectedRole)
      if (!result.success) {
        setError(result.error)
      }
      setLoading(false)
    }, 600) // Small delay for UX
  }

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <div className="bg-cloud/10 backdrop-blur-xl border border-cloud/20 rounded-2xl p-9">
        {/* Logo Mark + Wordmark */}
        <div className="flex items-center justify-center mb-4">
          <img src="/logo-kepala.png" alt="ORBITA" className="h-16 object-contain" />
        </div>

        {/* Headline */}
        <h1 className="text-xl font-bold text-cloud mb-2">Selamat Datang!</h1>
        <p className="text-xs text-cloud/50 mb-8 leading-relaxed">
          Bangun masa depanmu, mulai bersama Orbita.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-cloud/60 tracking-wide uppercase">
              Email
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cloud/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full bg-cloud/10 border border-cloud/20 rounded-lg pl-11 pr-4 py-3 text-cloud placeholder:text-cloud/40 focus:border-orbit-2 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-cloud/60 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cloud/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full bg-cloud/10 border border-cloud/20 rounded-lg pl-11 pr-12 py-3 text-cloud placeholder:text-cloud/40 focus:border-orbit-2 outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cloud/40 hover:text-cloud/70 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-cloud/60 tracking-wide uppercase">
              Masuk sebagai
            </label>
            <RoleSelector selectedRole={selectedRole} onSelect={(role) => { setSelectedRole(role); setError(''); }} />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-br from-sun-1 to-sun-2 text-space-2 font-semibold rounded-lg py-3.5 shadow-lg shadow-sun-1/25 hover:shadow-xl hover:shadow-sun-1/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Masuk...
              </span>
            ) : 'Masuk ke ORBITA'}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-cloud/50 mt-6">
          Belum punya akun?{' '}
          <a href="#" className="text-orbit-2 hover:text-orbit-1 transition-colors font-medium">
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  )
}
