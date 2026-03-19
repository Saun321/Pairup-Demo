import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Bell, BellOff } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import DiscoverCard from './DiscoverCard'
import SendInviteModal from './SendInviteModal'

const LEVEL_OPTS = ['', 'Beginner', 'Intermediate', 'Advanced']
const TYPE_OPTS  = ['', 'SDE', 'PM']

export default function DiscoverPage() {
  const navigate = useNavigate()
  const { discoverUsers, sentInviteIds, discoverFilters, setDiscoverFilters } = useApp()
  const [inviteTarget, setInviteTarget] = useState(null)
  const [filterOpen, setFilterOpen]     = useState(false)

  const filtered = discoverUsers.filter(u => {
    if (discoverFilters.type  && u.role  !== discoverFilters.type)  return false
    if (discoverFilters.level && u.level !== discoverFilters.level) return false
    return true
  })

  const activeFilterCount = [discoverFilters.type, discoverFilters.level].filter(Boolean).length
  const filtersActive = activeFilterCount > 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 bg-surface-subtle">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-extrabold text-ink">Discover</h1>
            <p className="text-xs text-ink-muted">
              {filtered.length > 0
                ? `${filtered.length} matches found for you`
                : filtersActive
                ? 'No matches with these filters'
                : 'Finding your best matches…'}
            </p>
          </div>
          <button
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-sm font-semibold text-ink-secondary transition-all active:bg-surface-raised"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand text-white text-[9px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter bar */}
        {filterOpen && (
          <div className="bg-surface rounded-xl border border-border p-3 mb-2 fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink">Filters</span>
              <button
                className="text-xs text-brand font-semibold"
                onClick={() => setDiscoverFilters({ type: '', level: '' })}
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <FilterRow
                label="Interview type"
                options={TYPE_OPTS}
                value={discoverFilters.type}
                onChange={v => setDiscoverFilters(f => ({ ...f, type: v }))}
              />
              <FilterRow
                label="Level"
                options={LEVEL_OPTS}
                value={discoverFilters.level}
                onChange={v => setDiscoverFilters(f => ({ ...f, level: v }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Feed */}
      <div className="page-scroll px-5 py-3 flex flex-col gap-3">
        {filtered.length === 0 ? (
          filtersActive
            ? <FilterEmptyState onClear={() => setDiscoverFilters({ type: '', level: '' })} />
            : <NoMatchesState />
        ) : (
          filtered.map(user => (
            <DiscoverCard
              key={user.id}
              user={user}
              invited={sentInviteIds.has(user.id)}
              onInvite={() => setInviteTarget(user)}
              onViewProfile={() => navigate(`/discover/profile/${user.id}`)}
            />
          ))
        )}
        <div className="h-4" />
      </div>

      {/* Send invite modal */}
      {inviteTarget && (
        <SendInviteModal
          user={inviteTarget}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </div>
  )
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-secondary w-24 flex-shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button
            key={o || 'all'}
            onClick={() => onChange(o)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              value === o
                ? 'bg-brand border-brand text-white'
                : 'bg-surface border-border text-ink-secondary'
            }`}
          >
            {o || 'All'}
          </button>
        ))}
      </div>
    </div>
  )
}

/** MOD-05: shown when filters remove all results */
function FilterEmptyState({ onClear }) {
  return (
    <div className="text-center py-14 px-6 fade-in">
      <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center mx-auto mb-4">
        <SlidersHorizontal size={22} className="text-ink-muted" />
      </div>
      <p className="font-bold text-ink mb-1">No matches with these filters</p>
      <p className="text-sm text-ink-secondary mb-5">
        Try broadening your filters to see more people.
      </p>
      <button className="btn-secondary w-auto mx-auto px-6" onClick={onClear}>
        Clear filters
      </button>
    </div>
  )
}

/** MOD-05: shown when matching algorithm returns zero results */
function NoMatchesState() {
  const [notifyOn, setNotifyOn] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="text-center py-10 px-6 fade-in">
      {/* Illustration placeholder */}
      <div className="relative w-24 h-24 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full bg-brand-light flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 56 56" fill="none">
            {/* Two overlapping circles — partner icon */}
            <circle cx="20" cy="28" r="14" fill="#4a9ab5" opacity="0.3" />
            <circle cx="36" cy="28" r="14" fill="#1a5f7a" opacity="0.3" />
            <circle cx="20" cy="28" r="10" fill="#4a9ab5" opacity="0.5" />
            <circle cx="36" cy="28" r="10" fill="#1a5f7a" opacity="0.5" />
            {/* Sparkle */}
            <path d="M28 8 L29.5 13 L28 12 L26.5 13 Z" fill="#1a5f7a" />
            <path d="M28 48 L29.5 43 L28 44 L26.5 43 Z" fill="#1a5f7a" />
            <path d="M8 28 L13 29.5 L12 28 L13 26.5 Z" fill="#1a5f7a" />
            <path d="M48 28 L43 29.5 L44 28 L43 26.5 Z" fill="#1a5f7a" />
          </svg>
        </div>
        {/* Animated ring */}
        <div
          className="absolute -inset-2 rounded-full border-2 border-brand/20"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>

      <h2 className="text-lg font-extrabold text-ink mb-2">
        We're finding your matches
      </h2>
      <p className="text-sm text-ink-secondary leading-relaxed mb-6 max-w-xs mx-auto">
        We'll notify you as soon as we find a compatible partner. Usually within 24 hours.
      </p>

      {/* Notify CTA */}
      <button
        onClick={() => setNotifyOn(n => !n)}
        className={`flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-3 rounded-xl font-semibold text-sm border transition-all mb-3 ${
          notifyOn
            ? 'bg-brand text-white border-brand'
            : 'bg-surface text-ink-secondary border-border'
        }`}
      >
        {notifyOn
          ? <><Bell size={16} /> Notifications on</>
          : <><BellOff size={16} /> Notify me when matches are ready</>
        }
      </button>

      <button
        className="text-sm text-brand font-semibold underline-offset-2 hover:underline"
        onClick={() => navigate('/profile/edit')}
      >
        Update your preferences →
      </button>

      <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.08);opacity:1} }`}</style>
    </div>
  )
}
