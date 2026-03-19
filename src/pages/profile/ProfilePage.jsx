import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Avatar from '../../components/Avatar'
import { Settings, Edit, ExternalLink, LogOut } from 'lucide-react'
import AvailabilityGrid from '../../components/AvailabilityGrid'

const LEVEL_PIPS = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export default function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, onboardingData, userTzKey } = useApp()

  const u = currentUser || {
    displayName:   onboardingData.displayName   || 'Your Profile',
    initials:      'YP',
    role:          onboardingData.role          || '—',
    background:    onboardingData.background    || '—',
    practiceFocus: onboardingData.practiceFocus || [],
    targetTier:    onboardingData.targetTier    || '—',
    timeline:      onboardingData.timeline      || '—',
    level:         onboardingData.level         || '—',
    bio:           onboardingData.bio           || '',
    linkedIn:      onboardingData.linkedIn      || '',
    whoGoesFirst:  onboardingData.whoGoesFirst  || '—',
    feedbackStyle: onboardingData.feedbackStyle || '—',
    availability:  onboardingData.availability  || {},
    weakestArea:   onboardingData.weakestArea   || null,
  }

  const pips = LEVEL_PIPS[u.level] || 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3 bg-surface-subtle">
        <h1 className="text-xl font-extrabold text-ink">Profile</h1>
        <button
          className="btn-ghost gap-1.5"
          onClick={() => navigate('/profile/settings')}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      <div className="page-scroll pb-8">
        {/* Hero */}
        <div className="px-5 pt-4 pb-5 bg-surface-subtle border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar name={u.displayName} initials={u.initials} size="xl" />
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-ink">{u.displayName}</h2>
              {u.background && u.background !== '—' && (
                <span className="chip-ink text-xs mt-1 inline-block">{u.background}</span>
              )}
              {u.linkedIn && (
                <a
                  href={`https://${u.linkedIn.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 mt-1.5 text-xs text-brand font-semibold"
                >
                  <ExternalLink size={12} /> LinkedIn
                </a>
              )}
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-surface-raised flex items-center justify-center text-ink-secondary active:bg-surface transition-all"
              aria-label="Edit profile"
            >
              <Edit size={16} />
            </button>
          </div>

          {u.bio && (
            <p className="text-sm text-ink-secondary mt-3 leading-relaxed">{u.bio}</p>
          )}
        </div>

        {/* Sections */}
        <div className="px-5 pt-5 space-y-6">

          {/* Goal */}
          <Section title="Goal">
            <InfoRow label="Role"          value={<span className="chip-brand">{u.role}</span>} />
            <InfoRow
              label="Practice focus"
              value={
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {(u.practiceFocus || []).map(f => (
                    <span key={f} className="chip-ink">{f}</span>
                  ))}
                </div>
              }
            />
            <InfoRow label="Target tier"   value={<span className="chip-ink">{u.targetTier}</span>} />
            <InfoRow label="Timeline"      value={<span className="text-sm text-ink">{u.timeline}</span>} />
          </Section>

          {/* Level */}
          <Section title="Level">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-bold text-ink">{u.level}</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                  <div key={n} className="w-2 h-2 rounded-full"
                    style={{ background: n <= pips ? '#1a5f7a' : '#dde6ed' }} />
                ))}
              </div>
            </div>
            {u.weakestArea && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-ink-muted">Wants to improve:</span>
                <span className="chip chip-danger">{u.weakestArea}</span>
              </div>
            )}
          </Section>

          {/* Availability */}
          <Section title="Weekly availability">
            <AvailabilityGrid
              value={u.availability}
              readOnly
              forceTzKey={userTzKey}
            />
          </Section>

          {/* Preferences */}
          <Section title="Session preferences">
            <InfoRow label="Who goes first"  value={<span className="text-sm text-ink">{u.whoGoesFirst}</span>} />
            <InfoRow label="Feedback style"  value={<span className="chip-ink">{u.feedbackStyle}</span>} />
          </Section>

          {/* Danger zone */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              className="flex items-center gap-2 text-sm font-semibold text-ink-secondary py-2"
              onClick={() => navigate('/profile/settings')}
            >
              <Settings size={16} />
              Account &amp; notification settings
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-danger py-2">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-2.5">{children}</div>
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
