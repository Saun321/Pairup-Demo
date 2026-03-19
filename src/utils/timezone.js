// Timezone utilities for PairUp availability bands
// All bands are anchored to Eastern Time (ET)

export const BAND_DEFS = [
  {
    key: 'AM',
    label: 'AM',
    et: { range: '8–12 ET', short: '8–12',  hours: [8, 9, 10, 11] },
    pt: { range: '5–9 PT',  short: '5–9',   hours: [5, 6, 7, 8] },
    ct: { range: '7–11 CT', short: '7–11',  hours: [7, 8, 9, 10] },
    mt: { range: '6–10 MT', short: '6–10',  hours: [6, 7, 8, 9] },
  },
  {
    key: 'PM',
    label: 'PM',
    et: { range: '12–5 ET', short: '12–5',  hours: [12, 13, 14, 15, 16] },
    pt: { range: '9–2 PT',  short: '9–2',   hours: [9, 10, 11, 12, 13] },
    ct: { range: '11–4 CT', short: '11–4',  hours: [11, 12, 13, 14, 15] },
    mt: { range: '10–3 MT', short: '10–3',  hours: [10, 11, 12, 13, 14] },
  },
  {
    key: 'Evening',
    label: 'Eve',
    et: { range: '5–10 ET', short: '5–10',  hours: [17, 18, 19, 20, 21] },
    pt: { range: '2–7 PT',  short: '2–7',   hours: [14, 15, 16, 17, 18] },
    ct: { range: '4–9 CT',  short: '4–9',   hours: [16, 17, 18, 19, 20] },
    mt: { range: '3–8 MT',  short: '3–8',   hours: [15, 16, 17, 18, 19] },
  },
]

export const BAND_KEYS = ['AM', 'PM', 'Evening']
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Detect the user's browser timezone string */
export function getBrowserTZ() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Map a browser IANA timezone to our simple 2-letter zone key
 * Defaults to ET for anything unrecognised (most NYU users are in NY)
 */
export function tzKey(ianaZone) {
  if (!ianaZone) return 'et'
  const z = ianaZone.toLowerCase()
  if (z.includes('los_angeles') || z.includes('pacific'))  return 'pt'
  if (z.includes('chicago') || z.includes('central'))      return 'ct'
  if (z.includes('denver') || z.includes('mountain'))      return 'mt'
  return 'et' // default — covers America/New_York and unknowns
}

/** Get sub-label for an availability cell, e.g. "8–12 ET" */
export function getBandSubLabel(bandKey, tzKey_ = 'et') {
  const def = BAND_DEFS.find(b => b.key === bandKey)
  if (!def) return ''
  return (def[tzKey_] || def.et).range
}

/** Get short sub-label, e.g. "8–12" */
export function getBandShort(bandKey, tzKey_ = 'et') {
  const def = BAND_DEFS.find(b => b.key === bandKey)
  if (!def) return ''
  return (def[tzKey_] || def.et).short
}

/** Get hourly slots for a band in a given tz */
export function getBandHours(bandKey, tzKey_ = 'et') {
  const def = BAND_DEFS.find(b => b.key === bandKey)
  if (!def) return []
  return (def[tzKey_] || def.et).hours
}

/** Format a 24h hour integer to "9 AM" / "2 PM" */
export function formatHour(h) {
  if (h === 0)  return '12 AM'
  if (h === 12) return '12 PM'
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

/** Get the zone abbreviation string ("ET" / "PT" / "CT" / "MT") */
export function tzLabel(key) {
  return { et: 'ET', pt: 'PT', ct: 'CT', mt: 'MT' }[key] || 'ET'
}

/**
 * Given a Date object, return the short day-of-week name ("Mon", "Tue", …)
 * using the DAYS array that matches the availability keys.
 */
export function dateToDayKey(date) {
  // getDay() returns 0=Sun … 6=Sat; DAYS is Mon-Sun (index 0-6)
  const jsDay = date.getDay() // 0=Sun
  const idx = jsDay === 0 ? 6 : jsDay - 1  // Mon=0 … Sun=6
  return DAYS[idx]
}

/** Return an array of the next `count` Date objects starting from tomorrow */
export function getUpcomingDates(count = 14) {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

/** Format a Date as "Mon Mar 24" */
export function formatShortDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
