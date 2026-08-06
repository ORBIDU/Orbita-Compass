const roles = [
  { id: 'siswa', label: 'Siswa' },
  { id: 'wali', label: 'Wali Kelas' },
  { id: 'gurubk', label: 'Guru BK' },
]

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="flex gap-2">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onSelect(role.id)}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
            selectedRole === role.id
              ? 'bg-gradient-to-br from-orbit-1 to-orbit-2 text-space-2 font-semibold shadow-lg shadow-orbit-1/20'
              : 'border border-cloud/20 text-cloud/60 hover:border-cloud/40 hover:text-cloud/80'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  )
}
