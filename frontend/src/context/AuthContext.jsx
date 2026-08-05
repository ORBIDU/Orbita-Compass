import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, setAuthToken, removeAuthToken, getMeApi } from '../services/api'

const AuthContext = createContext(null)

// Demo fallback accounts for instant 1-click quick login preview
const ACCOUNTS = [
  { email: 'siswa@orbita.id', password: 'password123', role: 'siswa', name: 'Ahmad Rizki (Saintek)', kelas: 'XII IPA 1', initials: 'AR' },
  { email: 'budi@orbita.id', password: 'password123', role: 'siswa', name: 'Budi Pratama (Soshum)', kelas: 'XII IPS 2', initials: 'BP' },
  { email: 'gurubk@orbita.id', password: 'password123', role: 'gurubk', name: 'Bapak Ahmad, S.Pd.', kelas: 'Guru BK Konselor', initials: 'BA' },
  { email: 'admin@orbita.id', password: 'password123', role: 'admin', name: 'Administrator Orbita', kelas: 'System Admin', initials: 'AD' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on app load
    getMeApi()
      .then(res => {
        if (res.user) {
          setUser({
            id: res.user.id,
            email: res.user.email,
            name: res.user.name,
            role: res.user.role.toLowerCase(),
            profile: res.user.profile,
            initials: res.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          })
        }
      })
      .catch(() => {
        removeAuthToken()
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password, selectedRole) => {
    try {
      // 1. Try Backend API Login
      const res = await loginApi(email, password)
      if (res.token && res.user) {
        setAuthToken(res.token)
        const loggedUser = {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          role: res.user.role.toLowerCase(),
          profile: res.user.profile,
          initials: res.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        }
        setUser(loggedUser)
        return { success: true }
      }
    } catch (err) {
      console.warn('Backend login attempt note:', err.message)
    }

    // 2. Local Demo Accounts Fallback
    const account = ACCOUNTS.find(
      a => a.email === email && a.password === password && (selectedRole ? a.role === selectedRole : true)
    )
    if (account) {
      setUser(account)
      return { success: true }
    }

    return { success: false, error: 'Email, password, atau role tidak sesuai.' }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
