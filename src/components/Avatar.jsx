// Avatar: shows initials with a hue derived from the name
const HUE_PALETTES = [
  { bg: '#e4f4fa', text: '#1a5f7a' },
  { bg: '#ccfbf1', text: '#0d9488' },
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#ede9fe', text: '#5b21b6' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#d1fae5', text: '#065f46' },
]

function getPalette(name) {
  let sum = 0
  for (const c of name) sum += c.charCodeAt(0)
  return HUE_PALETTES[sum % HUE_PALETTES.length]
}

export default function Avatar({ name, initials, size = 'md', className = '' }) {
  const palette = getPalette(name || initials || 'U')
  const sizes = {
    sm:  'w-8 h-8 text-xs',
    md:  'w-11 h-11 text-sm',
    lg:  'w-16 h-16 text-xl',
    xl:  'w-20 h-20 text-2xl',
  }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
      style={{ background: palette.bg, color: palette.text }}
    >
      {(initials || name?.slice(0, 2) || 'U').toUpperCase()}
    </div>
  )
}
