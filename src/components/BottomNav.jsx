import { useLocation, useNavigate } from 'react-router-dom'
import { Compass, Inbox, Users, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

const TABS = [
  { path: '/discover', label: 'Discover', Icon: Compass },
  { path: '/matches',  label: 'Matches',  Icon: Inbox },
  { path: '/partner',  label: 'Partner',  Icon: Users },
  { path: '/profile',  label: 'Profile',  Icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { receivedInvites } = useApp()

  return (
    <nav className="flex-shrink-0 bg-surface shadow-nav" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {TABS.map(({ path, label, Icon }) => {
          const active = location.pathname.startsWith(path)
          const badge = path === '/matches' && receivedInvites.length > 0

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
              style={{ color: active ? '#1a5f7a' : '#7a95a3' }}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-danger" />
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? '#1a5f7a' : '#7a95a3' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
