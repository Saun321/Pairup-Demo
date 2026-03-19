import { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const PLACEHOLDER_HINTS = [
  "I noticed you're also grinding System Design — same weak spot for me",
  'We have the same target timeline which means same urgency',
  'Your Behavioral focus is exactly what I need to practice more',
]

export default function SendInviteModal({ user, onClose }) {
  const { currentUser, sendInvite } = useApp()
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const profile = currentUser || {
    name: 'You',
    role: 'SDE',
    practiceFocus: ['Coding'],
    timeline: '1–3 months',
  }

  function handleSend() {
    setSent(true)
    sendInvite(user.id, note)
    setTimeout(() => {
      onClose(true) // true = sent
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => !sent && onClose(false)}
      />

      {/* Sheet */}
      <div className="relative z-10 bg-surface rounded-t-2xl sheet-enter shadow-modal px-5 pt-5 pb-8">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-extrabold text-ink">Send invite to {user.name}</h2>
          <button onClick={() => onClose(false)} className="text-ink-muted p-1 -mr-1">
            <X size={20} />
          </button>
        </div>

        {/* Message preview */}
        <div className="bg-brand-xlight border border-brand-light rounded-xl p-4 mb-4 text-sm text-ink leading-relaxed">
          <span>Hi </span>
          <LockedChip>{user.name}</LockedChip>
          <span>, I'm preparing for </span>
          <LockedChip>{profile.role}</LockedChip>
          <span> interviews focusing on </span>
          <LockedChip>{(profile.practiceFocus || []).join(', ')}</LockedChip>
          <span>, targeting </span>
          <LockedChip>{profile.timeline}</LockedChip>
          <span>. </span>
          {note && <span className="text-ink">{note} </span>}
          <span className="text-ink-secondary">Would you be open to a single 45-min session to see if our styles mesh?</span>
        </div>

        <p className="text-xs text-ink-muted mb-1">
          Your profile info is used automatically.{' '}
          <span className="text-brand font-semibold cursor-pointer">Edit profile →</span>
        </p>

        {/* Optional note */}
        <div className="mt-4">
          <label className="text-xs font-bold text-ink-secondary mb-1.5 block">
            What caught your eye about this person? <span className="font-normal">(optional)</span>
          </label>
          <textarea
            className="input-field resize-none h-20 text-sm"
            placeholder={PLACEHOLDER_HINTS[Math.floor(Math.random() * PLACEHOLDER_HINTS.length)]}
            maxLength={80}
            value={note}
            onChange={e => setNote(e.target.value)}
            disabled={sent}
          />
          <div className="text-right text-xs text-ink-muted mt-1">{note.length}/80</div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            className="btn-secondary flex-shrink-0 w-auto px-5"
            onClick={() => onClose(false)}
            disabled={sent}
          >
            Cancel
          </button>
          <button
            className={`btn-primary transition-all ${sent ? 'bg-success border-success' : ''}`}
            onClick={handleSend}
            disabled={sent}
          >
            {sent ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Sent
              </>
            ) : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

function LockedChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-semibold mx-0.5 border border-brand/20">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {children}
    </span>
  )
}
