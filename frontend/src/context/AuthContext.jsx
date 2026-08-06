import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, getMeApi, setAuthToken, getAuthToken, removeAuthToken } from '../services/api'

const AuthContext = createContext(null)

// Map backend role to frontend role label used by RoleSelector
const ROLE_MAP = {
  STUDENT: 'siswa',
  BK_TEACHER: 'gurubk',
  ADMIN: 'admin',
}

// Build a frontend-friendly user object from backend response
function mapBackendUser(backendUser) {
  const names = (backendUser.name || '').split(' ')
  const initials = names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : (names[0] || 'U').slice(0, 2).toUpperCase()

  const profile = backendUser.profile
  const kelas = profile
    ? `${profile.grade ? 'Kelas ' + profile.grade : ''} ${profile.majorTrack || ''}`.trim()
    : backendUser.role === 'BK_TEACHER' ? 'Guru BK' : 'Administrator'

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    role: ROLE_MAP[backendUser.role] || 'siswa',
    backendRole: backendUser.role,
    initials,
    kelas: kelas || 'Siswa',
    avatarUrl: backendUser.avatarUrl,
    profile: backendUser.profile,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Auto-restore session from token on mount
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      getMeApi()
        .then((data) => {
          setUser(mapBackendUser(data.user))
        })
        .catch(() => {
          removeAuthToken()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, _selectedRole) => {
    try {
      const data = await loginApi(email, password)
      setAuthToken(data.token)
      setUser(mapBackendUser(data.user))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Email atau password salah.' }
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-1">
        <div className="animate-spin w-8 h-8 border-4 border-orbit-2 border-t-transparent rounded-full" />
      </div>
    )
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
