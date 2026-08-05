import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo accounts
const ACCOUNTS = [
  { email: 'siswa@orbita.id', password: 'siswa123', role: 'siswa', name: 'Ahmad Rizki', kelas: 'XII IPA 1', initials: 'AR' },
  { email: 'wali@orbita.id', password: 'wali123', role: 'wali', name: 'Ibu Sari Dewi', kelas: 'Wali Kelas XII IPA 1', initials: 'SD' },
  { email: 'gurubk@orbita.id', password: 'gurubk123', role: 'gurubk', name: 'Bapak Ahmad', kelas: 'Guru BK', initials: 'BA' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password, selectedRole) => {
    const account = ACCOUNTS.find(
      a => a.email === email && a.password === password && a.role === selectedRole
    )
    if (account) {
      setUser(account)
      return { success: true }
    }
    // Also try matching just email + password (role auto-detected)
    const byCredentials = ACCOUNTS.find(a => a.email === email && a.password === password)
    if (byCredentials) {
      setUser(byCredentials)
      return { success: true }
    }
    return { success: false, error: 'Email, password, atau role tidak sesuai.' }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
