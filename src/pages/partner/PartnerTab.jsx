import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Avatar from '../../components/Avatar'
import { Calendar } from 'lucide-react'

export default function PartnerTab() {
  const navigate = useNavigate()
  const { partners } = useApp()

  if (partners.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          <h1 className="text-xl font-extrabold text-ink">Partners</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0c7d1" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-ink mb-1">No partners yet</p>
            <p className="text-sm text-ink-secondary">Accept a match in your Matches tab to start prepping.</p>
          </div>
          <button className="btn-primary w-auto px-6" onClick={() => navigate('/matches')}>
            View Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-5 pt-5 pb-3 bg-surface-subtle">
        <h1 className="text-xl font-extrabold text-ink">Partners</h1>
        <p className="text-xs text-ink-muted">{partners.length} active prep {partners.length === 1 ? 'partnership' : 'partnerships'}</p>
      </div>

      <div className="page-scroll px-5 py-3 flex flex-col gap-3">
        {partners.map(p => (
          <PartnerCard key={p.id} partner={p} onClick={() => navigate(`/partner/${p.id}`)} />
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

function PartnerCard({ partner, onClick }) {
  const { user, sharedFocus, lastMessage, lastMessageTime, upcomingSession } = partner

  return (
    <button
      onClick={onClick}
      className="card w-full text-left transition-all active:scale-[0.99] active:shadow-none"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={user.name} initials={user.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink text-sm">{user.name}</span>
            <span className="chip-ink text-xs">{user.background}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {sharedFocus.map(f => (
              <span key={f} className="chip-brand text-xs">{f}</span>
            ))}
          </div>
        </div>
        {lastMessageTime && (
          <span className="text-xs text-ink-muted flex-shrink-0">{lastMessageTime}</span>
        )}
      </div>

      {/* Last message preview */}
      {lastMessage && (
        <p className="text-xs text-ink-secondary truncate mb-2">
          {lastMessage}
        </p>
      )}

      {/* Upcoming session */}
      {upcomingSession && (
        <div className="flex items-center gap-2 bg-brand-xlight rounded-lg px-3 py-2 mt-1">
          <Calendar size={13} className="text-brand flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-brand">{upcomingSession.date}</span>
            <span className="text-ink-secondary ml-1.5">· {upcomingSession.type}</span>
          </div>
        </div>
      )}
    </button>
  )
}
