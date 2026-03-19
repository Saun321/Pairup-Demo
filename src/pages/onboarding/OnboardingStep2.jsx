import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import ProgressBar from '../../components/ProgressBar'
import SelectChip from '../../components/SelectChip'

const LEVELS = [
  {
    value: 'Beginner',
    desc: 'Primarily Easy problems / just getting started',
  },
  {
    value: 'Intermediate',
    desc: 'Medium problems as main focus / a few mocks done',
  },
  {
    value: 'Advanced',
    desc: 'Hard + OA-level / want to keep sharp',
  },
]

const BACKGROUNDS = ['CS undergrad', 'CS grad', 'Non-CS', 'Bootcamp', 'Self-taught']

export default function OnboardingStep2() {
  const navigate = useNavigate()
  const { onboardingData, updateOnboarding } = useApp()
  const { level, weakestArea, background, bio, linkedIn, practiceFocus } = onboardingData

  const canNext = level && background

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 pt-4 gap-2">
        <button
          onClick={() => navigate('/onboarding/1')}
          className="btn-ghost px-0"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1">
          <ProgressBar step={2} />
        </div>
      </div>

      <div className="page-scroll px-5 pb-8">
        <h1 className="text-2xl font-extrabold text-ink mt-2 mb-1">
          Tell us about yourself
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          Helps us match you with someone at the right level
        </p>

        {/* Level */}
        <FieldBlock label="Overall level" why="So your partner knows what to expect" required>
          <div className="flex flex-col gap-2">
            {LEVELS.map(({ value, desc }) => (
              <button
                key={value}
                onClick={() => updateOnboarding({ level: value })}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all active:scale-[0.99] ${
                  level === value
                    ? 'border-brand bg-brand-light'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      level === value ? 'border-brand bg-brand' : 'border-border'
                    }`}
                  >
                    {level === value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${level === value ? 'text-brand' : 'text-ink'}`}>
                      {value}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">{desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </FieldBlock>

        {/* Weakest area — pulled from step 1 focus selections */}
        {practiceFocus.length > 0 && (
          <FieldBlock label="Weakest area" why="Shared honestly so your partner can help you grow (optional)">
            <div className="flex flex-wrap gap-2">
              {practiceFocus.map(f => (
                <SelectChip
                  key={f}
                  label={f}
                  selected={weakestArea === f}
                  onClick={() => updateOnboarding({ weakestArea: weakestArea === f ? '' : f })}
                />
              ))}
            </div>
          </FieldBlock>
        )}

        {/* Background */}
        <FieldBlock label="Background" why="Context helps partners set expectations" required>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map(b => (
              <SelectChip
                key={b}
                label={b}
                selected={background === b}
                onClick={() => updateOnboarding({ background: b })}
              />
            ))}
          </div>
        </FieldBlock>

        {/* Bio */}
        <FieldBlock label="Bio" why="Shown as-is to your potential partners (optional)">
          <textarea
            className="input-field resize-none h-20"
            placeholder="A quick intro — e.g. 'Ex-intern at AWS, grinding LeetCode daily'"
            maxLength={150}
            value={bio}
            onChange={e => updateOnboarding({ bio: e.target.value })}
          />
          <div className="text-right text-xs text-ink-muted mt-1">{bio.length}/150</div>
        </FieldBlock>

        {/* LinkedIn */}
        <FieldBlock label="LinkedIn URL" why="Shown on your profile so partners can verify experience (optional)">
          <input
            type="url"
            className="input-field"
            placeholder="linkedin.com/in/yourprofile"
            value={linkedIn}
            onChange={e => updateOnboarding({ linkedIn: e.target.value })}
          />
        </FieldBlock>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-surface-subtle border-t border-border">
        <button
          className="btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/onboarding/3')}
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
