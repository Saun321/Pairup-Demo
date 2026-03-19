import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SelectChip from '../../components/SelectChip'
import AvailabilityGrid from '../../components/AvailabilityGrid'

const SDE_FOCUS   = ['Coding', 'Concepts', 'Behavioral']
const PM_FOCUS    = ['Product Sense', 'Analytical', 'Behavioral']
const TIERS       = ['FAANG', 'Mid-size tech', 'Startup', 'Any']
const TIMELINES   = ['< 1 month', '1–3 months', '3–6 months', 'Just practicing']
const LEVELS      = [
  { value: 'Beginner',     desc: 'Primarily Easy problems / just getting started' },
  { value: 'Intermediate', desc: 'Medium problems as main focus / a few mocks done' },
  { value: 'Advanced',     desc: 'Hard + OA-level / want to keep sharp' },
]
const BACKGROUNDS = ['CS undergrad', 'CS grad', 'Non-CS', 'Bootcamp', 'Self-taught']
const WHO_FIRST   = ['Go first as interviewee', 'Go first as interviewer', 'No preference']
const FEEDBACK    = ['Direct and critical', 'Balanced', 'Encouraging']

export default function EditProfilePage() {
  const navigate  = useNavigate()
  const { currentUser, onboardingData, updateCurrentUser } = useApp()

  // Pull current values from either currentUser or onboardingData
  const base = currentUser || {}
  const od   = onboardingData

  const [form, setForm] = useState({
    displayName:   base.displayName  || od.displayName  || '',
    role:          base.role         || od.role         || '',
    practiceFocus: base.practiceFocus || od.practiceFocus || [],
    targetTier:    base.targetTier   || od.targetTier   || '',
    timeline:      base.timeline     || od.timeline     || '',
    level:         base.level        || od.level        || '',
    weakestArea:   base.weakestArea  || od.weakestArea  || '',
    background:    base.background   || od.background   || '',
    bio:           base.bio          || od.bio          || '',
    linkedIn:      base.linkedIn     || od.linkedIn     || '',
    availability:  base.availability || od.availability || {},
    whoGoesFirst:  base.whoGoesFirst  || od.whoGoesFirst  || '',
    feedbackStyle: base.feedbackStyle || od.feedbackStyle || '',
  })

  const [dirty, setDirty]   = useState(false)
  const [saved, setSaved]   = useState(false)
  const [showDiscard, setShowDiscard] = useState(false)

  function update(fields) {
    setForm(prev => ({ ...prev, ...fields }))
    setDirty(true)
    setSaved(false)
  }

  function handleRoleChange(r) {
    update({ role: r, practiceFocus: [], weakestArea: '' })
  }

  function toggleFocus(f) {
    const next = form.practiceFocus.includes(f)
      ? form.practiceFocus.filter(x => x !== f)
      : [...form.practiceFocus, f]
    const weakest = next.includes(form.weakestArea) ? form.weakestArea : ''
    update({ practiceFocus: next, weakestArea: weakest })
  }

  function handleSave() {
    const initials = form.displayName
      ? form.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : 'YN'
    updateCurrentUser({ ...form, initials })
    setDirty(false)
    setSaved(true)
    // brief success flash then go back
    setTimeout(() => navigate('/profile'), 800)
  }

  function handleBack() {
    if (dirty) {
      setShowDiscard(true)
    } else {
      navigate('/profile')
    }
  }

  const focusOptions = form.role === 'SDE' ? SDE_FOCUS : form.role === 'PM' ? PM_FOCUS : []

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-5 pb-3 bg-surface border-b border-border">
        <button onClick={handleBack} className="text-ink-secondary active:text-ink p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-ink flex-1">Edit Profile</h1>
        {dirty && <span className="text-xs text-ink-muted">Unsaved</span>}
      </div>

      <div className="page-scroll px-5 py-5 pb-32 space-y-7">

        {/* 1. Display name */}
        <FieldBlock label="Display name" why="Your real name — helps partners recognize you" required>
          <input
            type="text"
            className="input-field"
            placeholder="Your real name — helps partners recognize you"
            value={form.displayName}
            onChange={e => update({ displayName: e.target.value })}
            maxLength={40}
          />
        </FieldBlock>

        {/* 2. Role */}
        <FieldBlock label="Target role" required>
          <div className="flex gap-3">
            {['SDE', 'PM'].map(r => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                  form.role === r
                    ? 'border-brand bg-brand text-white'
                    : 'border-border bg-surface text-ink-secondary'
                }`}
              >
                {r === 'SDE' ? 'Software Engineer' : 'Product Manager'}
                <br />
                <span className="text-xs font-normal opacity-70">{r}</span>
              </button>
            ))}
          </div>
        </FieldBlock>

        {/* 3. Practice focus */}
        {form.role && (
          <FieldBlock label="Practice focus" required>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map(f => (
                <SelectChip key={f} label={f} selected={form.practiceFocus.includes(f)} onClick={() => toggleFocus(f)} />
              ))}
            </div>
          </FieldBlock>
        )}

        {/* 4. Target tier */}
        <FieldBlock label="Target company tier" required>
          <div className="flex flex-wrap gap-2">
            {TIERS.map(t => (
              <SelectChip key={t} label={t} selected={form.targetTier === t} onClick={() => update({ targetTier: t })} />
            ))}
          </div>
        </FieldBlock>

        {/* 5. Timeline */}
        <FieldBlock label="Timeline" required>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map(t => (
              <SelectChip key={t} label={t} selected={form.timeline === t} onClick={() => update({ timeline: t })} />
            ))}
          </div>
        </FieldBlock>

        {/* 6. Overall level */}
        <FieldBlock label="Overall level" required>
          <div className="flex flex-col gap-2">
            {LEVELS.map(({ value, desc }) => (
              <button
                key={value}
                onClick={() => update({ level: value })}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all active:scale-[0.99] ${
                  form.level === value ? 'border-brand bg-brand-light' : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    form.level === value ? 'border-brand bg-brand' : 'border-border'
                  }`}>
                    {form.level === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${form.level === value ? 'text-brand' : 'text-ink'}`}>{value}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </FieldBlock>

        {/* 7. Weakest area */}
        {form.practiceFocus.length > 0 && (
          <FieldBlock label="Weakest area" why="Optional — so your partner can help you improve">
            <div className="flex flex-wrap gap-2">
              {form.practiceFocus.map(f => (
                <SelectChip
                  key={f} label={f}
                  selected={form.weakestArea === f}
                  onClick={() => update({ weakestArea: form.weakestArea === f ? '' : f })}
                />
              ))}
            </div>
          </FieldBlock>
        )}

        {/* 8. Background */}
        <FieldBlock label="Background" required>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map(b => (
              <SelectChip key={b} label={b} selected={form.background === b} onClick={() => update({ background: b })} />
            ))}
          </div>
        </FieldBlock>

        {/* 9. Bio */}
        <FieldBlock label="Bio" why="Shown as-is to potential partners (optional)">
          <textarea
            className="input-field resize-none h-20"
            placeholder="A quick intro about yourself"
            maxLength={150}
            value={form.bio}
            onChange={e => update({ bio: e.target.value })}
          />
          <div className="text-right text-xs text-ink-muted mt-1">{form.bio.length}/150</div>
        </FieldBlock>

        {/* 10. LinkedIn */}
        <FieldBlock label="LinkedIn URL" why="Displayed on your profile (optional)">
          <input
            type="url"
            className="input-field"
            placeholder="linkedin.com/in/yourprofile"
            value={form.linkedIn}
            onChange={e => update({ linkedIn: e.target.value })}
          />
        </FieldBlock>

        {/* 11. Availability */}
        <FieldBlock label="Weekly availability" required>
          <AvailabilityGrid
            value={form.availability}
            onChange={v => update({ availability: v })}
          />
        </FieldBlock>

        {/* 12. Who goes first */}
        <FieldBlock label="Who goes first" why="Shown to your matches" required>
          <div className="flex flex-col gap-2">
            {WHO_FIRST.map(w => (
              <SelectChip key={w} label={w} selected={form.whoGoesFirst === w} onClick={() => update({ whoGoesFirst: w })} />
            ))}
          </div>
        </FieldBlock>

        {/* 13. Feedback style */}
        <FieldBlock label="Feedback style" why="Shown to your matches" required>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK.map(f => (
              <SelectChip key={f} label={f} selected={form.feedbackStyle === f} onClick={() => update({ feedbackStyle: f })} />
            ))}
          </div>
        </FieldBlock>
      </div>

      {/* Pinned save button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-surface to-transparent"
        style={{ maxWidth: 430, margin: '0 auto' }}>
        <button
          className={`btn-primary transition-all ${saved ? 'bg-success' : ''}`}
          onClick={handleSave}
          disabled={!dirty}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      {/* Discard dialog */}
      {showDiscard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowDiscard(false)} />
          <div className="relative z-10 bg-surface rounded-2xl p-6 shadow-modal w-full fade-in">
            <h3 className="text-base font-extrabold text-ink mb-2">Discard changes?</h3>
            <p className="text-sm text-ink-secondary mb-5">
              Your unsaved edits will be lost.
            </p>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setShowDiscard(false)}>Keep editing</button>
              <button
                className="flex-1 py-3.5 rounded-xl bg-danger text-white font-semibold text-sm transition-all active:scale-95"
                onClick={() => { setShowDiscard(false); navigate('/profile') }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldBlock({ label, why, required, children }) {
  return (
    <div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-sm font-bold text-ink">{label}</span>
        {required && <span className="text-danger text-xs">*</span>}
      </div>
      {why && <p className="text-xs text-ink-muted mb-2.5">{why}</p>}
      {children}
    </div>
  )
}
