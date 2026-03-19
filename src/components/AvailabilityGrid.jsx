import { useState } from 'react'
import { BAND_DEFS, DAYS, getBrowserTZ, tzKey, tzLabel } from '../utils/timezone'

/**
 * 7 × 3 availability grid.
 *
 * Props
 * ─────
 * value      {Mon: ['AM','Evening'], …}   current selections
 * onChange   (newValue) => void           omit for readOnly
 * readOnly   bool                         default false
 * showToggle bool                         show ET/PT toggle (default true)
 * forceTzKey string                       override detected timezone ('et'|'pt'|'ct'|'mt')
 */
export default function AvailabilityGrid({
  value = {},
  onChange,
  readOnly = false,
  showToggle = true,
  forceTzKey,
}) {
  const detectedTz = tzKey(getBrowserTZ())
  const [activeTz, setActiveTz] = useState(forceTzKey || detectedTz)

  const displayTz = forceTzKey || activeTz

  function isOn(day, band) {
    return (value[day] || []).includes(band)
  }

  function toggle(day, band) {
    if (readOnly || !onChange) return
    const current = value[day] || []
    const next = isOn(day, band)
      ? current.filter(b => b !== band)
      : [...current, band]
    onChange({ ...value, [day]: next })
  }

  const TZ_OPTIONS = [
    { key: 'et', label: 'ET' },
    { key: 'pt', label: 'PT' },
    { key: 'ct', label: 'CT' },
    { key: 'mt', label: 'MT' },
  ]

  return (
    <div className="w-full">
      {/* Timezone toggle */}
      {showToggle && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-ink-muted">Timezone:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {TZ_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setActiveTz(opt.key)}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  displayTz === opt.key
                    ? 'bg-brand text-white'
                    : 'bg-surface text-ink-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {detectedTz === displayTz && (
            <span className="text-[10px] text-ink-muted">(your timezone)</span>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 280 }}>
          <thead>
            <tr>
              {/* Day-label column */}
              <th className="pb-1.5 w-10" />
              {BAND_DEFS.map(band => {
                const sub = (band[displayTz] || band.et).range
                return (
                  <th key={band.key} className="pb-1.5 text-center">
                    <div className="text-xs font-bold text-ink-secondary leading-tight">
                      {band.label}
                    </div>
                    <div className="text-[9px] font-medium text-ink-muted leading-tight mt-0.5 whitespace-nowrap">
                      {sub}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="text-xs font-semibold text-ink-secondary pr-2 py-0.5 w-10">
                  {day}
                </td>
                {BAND_DEFS.map(band => {
                  const on = isOn(day, band.key)
                  return (
                    <td key={band.key} className="p-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(day, band.key)}
                        disabled={readOnly}
                        aria-label={`${day} ${band.label} — ${on ? 'selected' : 'not selected'}`}
                        className={`avail-cell w-full h-8 text-xs font-semibold ${
                          on ? 'avail-cell-on' : 'avail-cell-off'
                        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {on && (
                          <svg
                            width="10" height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="mx-auto"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Count total selected cells across the grid */
export function countCells(availability) {
  let n = 0
  for (const bands of Object.values(availability || {})) {
    n += (bands || []).length
  }
  return n
}
