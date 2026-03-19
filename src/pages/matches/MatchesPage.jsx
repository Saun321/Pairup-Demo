import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Avatar from '../../components/Avatar'
import { MOCK_USERS } from '../../data/mockData'

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('received')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-0 bg-surface-subtle">
        <h1 className="text-xl font-extrabold text-ink mb-4">Matches</h1>
        {/* Tabs */}
        <div className="flex border-b border-border">
          {['received', 'invited'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand -mb-px'
                  : 'text-ink-muted'
              }`}
            >
              {tab === 'received' ? 'Received' : 'Invited & Waiting'}
            </button>
          ))}
        </div>
      </div>

      <div className="page-scroll px-5 py-4 flex flex-col gap-3">
        {activeTab === 'received' ? <ReceivedTab /> : <InvitedTab />}
        <div className="h-4" />
      </div>
    </div>
  )
}

function ReceivedTab() {
  const { receivedInvites, acceptInvite, declineInvite } = useApp()
  const navigate = useNavigate()
  const [celebrating, setCelebrating] = useState(null)

  function handleAccept(inviteId) {
    setCelebrating(inviteId)
    setTimeout(() => {
      acceptInvite(inviteId)
      setCelebrating(null)
      navigate('/partner')
    }, 1000)
  }

  if (receivedInvites.length === 0) {
    return <EmptyState message="No pending invites right now" sub="Check back later — great matches are on their way." />
  }

  return receivedInvites.map(invite => (
    <div
      key={invite.id}
      className={`card fade-in ${celebrating === invite.id ? 'celebrate' : ''}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={invite.from.name} initials={invite.from.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-ink text-sm">{invite.from.name}</span>
            <span className="chip-ink text-xs">{invite.from.background}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="chip-brand text-xs">{invite.from.role}</span>
            {invite.from.practiceFocus.map(f => (
              <span key={f} className="chip-ink text-xs">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {invite.message && (
        <div className="bg-surface-raised rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-ink-secondary italic">"{invite.message}"</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="btn-primary flex-1 py-2.5 text-sm"
          onClick={() => handleAccept(invite.id)}
          disabled={!!celebrating}
        >
          {celebrating === invite.id ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Matched!
            </>
          ) : 'Accept'}
        </button>
        <button
          className="btn-secondary flex-shrink-0 w-auto px-4 py-2.5 text-sm"
          onClick={() => declineInvite(invite.id)}
          disabled={!!celebrating}
        >
          Decline
        </button>
      </div>
    </div>
  ))
}

function InvitedTab() {
  const { sentInvites, setSentInvites } = useApp()
  const navigate = useNavigate()

  function handleDismiss(id) {
    setSentInvites(prev => prev.filter(i => i.id !== id))
  }

  if (sentInvites.length === 0) {
    return <EmptyState message="No pending invites sent" sub="Browse Discover to send your first invite." />
  }

  return sentInvites.map(invite => {
    const declined = invite.status === 'declined'
    return (
      <div key={invite.id} className={`card fade-in ${declined ? 'opacity-75' : ''}`}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar name={invite.to.name} initials={invite.to.initials} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-ink text-sm">{invite.to.name}</span>
              <span className="chip-ink text-xs">{invite.to.background}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="chip-brand text-xs">{invite.to.role}</span>
              {invite.to.practiceFocus.map(f => (
                <span key={f} className="chip-ink text-xs">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {invite.message && (
          <div className="bg-surface-raised rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-ink-secondary italic">"{invite.message}"</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          {declined ? (
            <span className="text-xs text-ink-muted font-medium">
              {invite.to.name.split(' ')[0]} isn't available right now
            </span>
          ) : (
            <span className="text-xs text-ink-muted font-medium flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              Waiting for response · {invite.timestamp}
            </span>
          )}
          {declined && (
            <button
              className="text-xs text-ink-muted font-semibold underline"
              onClick={() => handleDismiss(invite.id)}
            >
              Dismiss
            </button>
          )}
        </div>

        {/* Inline suggestions after decline */}
        {declined && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-bold text-ink-secondary mb-2">Here are 2 similar matches</p>
            <div className="flex gap-2">
              {MOCK_USERS.filter(u => u.role === invite.to.role && u.id !== invite.to.id)
                .slice(0, 2)
                .map(u => (
                  <div key={u.id} className="flex-1 bg-surface-raised rounded-xl p-3 flex items-center gap-2">
                    <Avatar name={u.name} initials={u.initials} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{u.name}</p>
                      <p className="text-xs text-ink-muted">{u.matchPercent}% match</p>
                    </div>
                    <button
                      className="text-xs text-brand font-bold flex-shrink-0 ml-auto"
                      onClick={() => navigate(`/discover/profile/${u.id}`)}
                    >
                      View
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  })
}

function EmptyState({ message, sub }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0c7d1" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p className="font-bold text-ink mb-1">{message}</p>
      <p className="text-sm text-ink-secondary">{sub}</p>
    </div>
  )
}
