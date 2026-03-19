export default function ProgressBar({ step, total = 3 }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < step ? '#1a5f7a' : '#dde6ed' }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-ink-muted flex-shrink-0">
        Step {step} of {total}
      </span>
    </div>
  )
}
