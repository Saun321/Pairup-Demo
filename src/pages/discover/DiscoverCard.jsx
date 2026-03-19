import Avatar from '../../components/Avatar'
import MatchBadge from '../../components/MatchBadge'

export default function DiscoverCard({ user, invited, onInvite, onViewProfile }) {
  const isNew = user.sessionsCompleted < 3

  return (
    <div
      className={`card fade-in transition-all duration-300 ${
        invited ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={user.name} initials={user.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink text-sm truncate">{user.name}</span>
            <span className="chip-ink flex-shrink-0">{user.background}</span>
          </div>
          <div className="mt-1">
            <MatchBadge percent={user.matchPercent} />
          </div>
        </div>
        {invited && (
          <span className="chip text-xs font-semibold px-3 py-1 rounded-full bg-surface-raised text-ink-muted border border-border flex-shrink-0">
            Invite sent
          </span>
        )}
      </div>

      {/* Trust metrics / new badge */}
      {isNew ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="chip-teal">New to PairUp</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-3">
          <StatChip label="Sessions" value={user.sessionsCompleted} />
          <StatChip label="Show-up" value={`${user.showUpRate}%`} />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="chip-brand">{user.role}</span>
        {user.practiceFocus.map(f => (
          <span key={f} className="chip-ink">{f}</span>
        ))}
        <span className="chip-ink">{user.level}</span>
        <span className="chip-ink">{user.targetTier}</span>
      </div>

      {/* Shared goals */}
      <div className="bg-brand-xlight rounded-lg p-3 mb-4">
        <p className="text-xs font-bold text-brand mb-1.5">
          {user.sharedGoals.length} shared {user.sharedGoals.length === 1 ? 'goal' : 'goals'}
        </p>
        <ul className="space-y-1">
          {user.sharedGoals.map((g, i) => (
            <li key={i} className="text-xs text-ink-secondary flex items-start gap-1.5">
              <span className="text-brand mt-0.5">•</span> {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="btn-primary flex-1 py-2.5"
          onClick={onInvite}
          disabled={invited}
        >
          Send invite
        </button>
        <button
          className="btn-secondary flex-shrink-0 w-auto px-4 py-2.5"
          onClick={onViewProfile}
        >
          View profile
        </button>
      </div>
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
