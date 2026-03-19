import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import ProgressBar from '../../components/ProgressBar'
import SelectChip from '../../components/SelectChip'
import AvailabilityGrid, { countCells } from '../../components/AvailabilityGrid'
import { getBrowserTZ } from '../../utils/timezone'

const WHO_FIRST  = ['Go first as interviewee', 'Go first as interviewer', 'No preference']
const FEEDBACK   = ['Direct and critical', 'Balanced', 'Encouraging']

const TZ_DISPLAY = getBrowserTZ()

export default function OnboardingStep3() {
  const navigate = useNavigate()
  const { onboardingData, updateOnboarding, completeOnboarding, userTzKey } = useApp()
  const { availability, whoGoesFirst, feedbackStyle } = onboardingData

  const cellCount = countCells(availability)
  const canNext = cellCount >= 3 && whoGoesFirst && feedbackStyle

  function handleFinish() {
    completeOnboarding()
    navigate('/onboarding/loading')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 pt-4 gap-2">
        <button
          onClick={() => navigate('/onboarding/2')}
          className="btn-ghost px-0"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar step={3} />
        </div>
      </div>

      <div className="page-scroll px-5 pb-8">
        <h1 className="text-2xl font-extrabold text-ink mt-2 mb-1">
          When are you free?
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          We'll show your availability to potential partners
        </p>

        {/* Availability grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-ink">
              Weekly availability <span className="text-danger">*</span>
            </span>
            <span className={`text-xs font-semibold ${cellCount >= 3 ? 'text-success' : 'text-ink-muted'}`}>
              {cellCount} selected {cellCount < 3 && '(min 3)'}
            </span>
          </div>
          <p className="text-xs text-ink-muted mb-1">Select at least 3 time slots</p>
          <p className="text-[11px] text-ink-faint mb-3 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            Detected: {TZ_DISPLAY}
          </p>
          <AvailabilityGrid
            value={availability}
            onChange={v => updateOnboarding({ availability: v })}
            forceTzKey={userTzKey}
          />
        </div>

        {/* Preferences label */}
        <div className="mb-2 text-xs font-bold text-ink-muted uppercase tracking-widest">
          Shown to your matches
        </div>

        <FieldBlock label="Who goes first" why="Your preferred interview order" required>
          <div className="flex flex-col gap-2">
            {WHO_FIRST.map(w => (
              <SelectChip
                key={w}
                label={w}
                selected={whoGoesFirst === w}
                onClick={() => updateOnboarding({ whoGoesFirst: w })}
              />
            ))}
          </div>
        </FieldBlock>

        <FieldBlock label="Feedback style" why="So your partner knows how to give you feedback" required>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK.map(f => (
              <SelectChip
                key={f}
                label={f}
                selected={feedbackStyle === f}
                onClick={() => updateOnboarding({ feedbackStyle: f })}
              />
            ))}
          </div>
        </FieldBlock>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-surface-subtle border-t border-border">
        <button className="btn-primary" disabled={!canNext} onClick={handleFinish}>
          Find my matches
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
