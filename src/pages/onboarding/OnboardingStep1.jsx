import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import ProgressBar from '../../components/ProgressBar'
import SelectChip from '../../components/SelectChip'

const SDE_FOCUS  = ['Coding', 'Concepts', 'Behavioral']
const PM_FOCUS   = ['Product Sense', 'Analytical', 'Behavioral']
const TIERS      = ['FAANG', 'Mid-size tech', 'Startup', 'Any']
const TIMELINES  = ['< 1 month', '1–3 months', '3–6 months', 'Just practicing']

export default function OnboardingStep1() {
  const navigate = useNavigate()
  const { onboardingData, updateOnboarding } = useApp()
  const { displayName, role, practiceFocus, targetTier, timeline } = onboardingData

  const focusOptions = role === 'SDE' ? SDE_FOCUS : role === 'PM' ? PM_FOCUS : []

  function setRole(r) {
    updateOnboarding({ role: r, practiceFocus: [] })
  }

  function toggleFocus(f) {
    const next = practiceFocus.includes(f)
      ? practiceFocus.filter(x => x !== f)
      : [...practiceFocus, f]
    updateOnboarding({ practiceFocus: next })
  }

  function setTier(t) {
    updateOnboarding({ targetTier: targetTier === t ? '' : t })
  }

  const canNext = displayName.trim() && role && practiceFocus.length > 0 && targetTier && timeline

  return (
    <div className="flex flex-col h-full">
      <ProgressBar step={1} />

      <div className="page-scroll px-5 pb-8">
        <h1 className="text-2xl font-extrabold text-ink mt-2 mb-1">
          What are you preparing for?
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          This helps us find partners with the same focus
        </p>

        {/* MOD-03 — Display name (first field) */}
        <FieldBlock
          label="Display name"
          why="Your real name — helps partners recognize you"
          required
        >
          <input
            type="text"
            className="input-field"
            placeholder="Your real name — helps partners recognize you"
            value={displayName}
            onChange={e => updateOnboarding({ displayName: e.target.value })}
            maxLength={40}
            autoFocus
          />
        </FieldBlock>

        {/* Role */}
        <FieldBlock label="Target role" why="So we match you with people practicing the same interview format" required>
          <div className="flex gap-3">
            {['SDE', 'PM'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                  role === r
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

        {/* Practice focus — only after role chosen */}
        {role && (
          <FieldBlock label="Practice focus" why="We'll match you with people practicing the same areas" required>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map(f => (
                <SelectChip
                  key={f}
                  label={f}
                  selected={practiceFocus.includes(f)}
                  onClick={() => toggleFocus(f)}
                />
              ))}
            </div>
          </FieldBlock>
        )}

        {/* Target tier */}
        <FieldBlock label="Target company tier" why="Helps us prioritize partners with similar ambitions" required>
          <div className="flex flex-wrap gap-2">
            {TIERS.map(t => (
              <SelectChip
                key={t}
                label={t}
                selected={targetTier === t}
                onClick={() => setTier(t)}
              />
            ))}
          </div>
        </FieldBlock>

        {/* Timeline */}
        <FieldBlock label="Timeline" why="We'll surface people with the same urgency" required>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map(t => (
              <SelectChip
                key={t}
                label={t}
                selected={timeline === t}
                onClick={() => updateOnboarding({ timeline: t })}
              />
            ))}
          </div>
        </FieldBlock>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-surface-subtle border-t border-border">
        <button
          className="btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/onboarding/2')}
        >
          Next
        </button>
      </div>
    </div>
  )
}

function FieldBlock({ label, why, required, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-sm font-bold text-ink">{label}</span>
        {required && <span className="text-danger text-xs">*</span>}
      </div>
      <p className="text-xs text-ink-muted mb-2.5">{why}</p>
      {children}
    </div>
  )
}
