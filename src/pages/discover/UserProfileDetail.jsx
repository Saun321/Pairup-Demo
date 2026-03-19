import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { MOCK_USERS } from '../../data/mockData'
import Avatar from '../../components/Avatar'
import MatchBadge from '../../components/MatchBadge'
import AvailabilityGrid from '../../components/AvailabilityGrid'
import SendInviteModal from './SendInviteModal'

const LEVEL_PIPS = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export default function UserProfileDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sentInviteIds, userTzKey } = useApp()
  const [showInvite, setShowInvite] = useState(false)

  const user = MOCK_USERS.find(u => u.id === id)
  if (!user) return <NotFound onBack={() => navigate('/discover')} />

  const isNew     = user.sessionsCompleted < 3
  const invited   = sentInviteIds.has(user.id)
  const pips      = LEVEL_PIPS[user.level] || 1

  return (
    <div className="flex flex-col h-full">
      {/* Back bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-3 bg-surface-subtle">
        <button
          onClick={() => navigate('/discover')}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-secondary active:text-ink"
        >
          <ArrowLeft size={18} />
          Discover
        </button>
        <MatchBadge percent={user.matchPercent} />
      </div>

      <div className="page-scroll">
        {/* Hero */}
        <div className="px-5 pt-4 pb-5 bg-surface-subtle border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} initials={user.initials} size="xl" />
            <div>
              <h1 className="text-xl font-extrabold text-ink">{user.name}</h1>
              <span className="chip-ink text-xs mt-1">{user.background}</span>
              {user.linkedIn && (
                <a
                  href={`https://${user.linkedIn.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 mt-1.5 text-xs text-brand font-semibold"
                >
                  <ExternalLink size={12} /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Trust metrics */}
          <div className="flex items-center gap-2 mt-4">
            {isNew ? (
              <span className="chip-teal">New to PairUp</span>
            ) : (
              <>
                <StatChip label="Sessions" value={user.sessionsCompleted} />
                <StatChip label="Show-up" value={`${user.showUpRate}%`} />
              </>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="px-5 pt-4 pb-32 space-y-6">

          {/* Goal */}
          <Section title="Goal">
            <InfoRow label="Role" value={<span className="chip-brand">{user.role}</span>} />
            <InfoRow
              label="Practice focus"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {user.practiceFocus.map(f => <span key={f} className="chip-ink">{f}</span>)}
                </div>
              }
            />
            <InfoRow label="Target tier" value={<span className="chip-ink">{user.targetTier}</span>} />
            <InfoRow label="Timeline" value={<span className="text-sm text-ink">{user.timeline}</span>} />
          </Section>

          {/* Level */}
          <Section title="Level">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-bold text-ink">{user.level}</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className="w-2 h-2 rounded-full"
                    style={{ background: n <= pips ? '#1a5f7a' : '#dde6ed' }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-ink-secondary mb-2">{user.levelDesc}</p>
            {user.weakestArea && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted">Wants to improve:</span>
                <span className="chip chip-danger">{user.weakestArea}</span>
              </div>
            )}
          </Section>

          {/* About */}
          {user.bio && (
            <Section title="About">
              <p className="text-sm text-ink leading-relaxed">{user.bio}</p>
            </Section>
          )}

          {/* Weekly availability */}
          <Section title="Weekly availability">
            <AvailabilityGrid value={user.availability} readOnly forceTzKey={userTzKey} />
          </Section>

          {/* Session preferences */}
          <Section title="Session preferences">
            <InfoRow
              label="Who goes first"
              value={<span className="text-sm text-ink">{user.whoGoesFirst}</span>}
            />
            <InfoRow
              label="Feedback style"
              value={<span className="chip-ink">{user.feedbackStyle}</span>}
            />
          </Section>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-surface-subtle to-transparent"
        style={{ maxWidth: 430, margin: '0 auto' }}
      >
        <button
          className={`btn-primary ${invited ? 'bg-success' : ''}`}
          disabled={invited}
          onClick={() => setShowInvite(true)}
        >
          {invited ? '✓ Invite sent' : `Send invite to ${user.name}`}
        </button>
      </div>

      {showInvite && (
        <SendInviteModal
          user={user}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-ink-secondary flex-shrink-0 w-28">{label}</span>
      <div className="flex-1 flex justify-end">{value}</div>
    </div>
  )
}

function StatChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-raised text-xs font-semibold text-ink-secondary">
      <span className="font-bold text-ink">{value}</span> {label}
    </span>
  )
}

function NotFound({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
      <p className="font-bold text-ink">User not found</p>
      <button className="btn-secondary w-auto px-6" onClick={onBack}>Back to Discover</button>
    </div>
  )
}
