export default function MatchBadge({ percent }) {
  const color = percent >= 90 ? '#059669' : percent >= 75 ? '#1a5f7a' : '#7a95a3'
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: `${color}18`, color }}
    >
      {percent}% match
    </span>
  )
}
