export default function SelectChip({ label, selected, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all select-none ${
        selected
          ? 'border-brand bg-brand text-white shadow-sm'
          : 'border-border bg-surface text-ink-secondary hover:border-brand-mid'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
    >
      {label}
    </button>
  )
}
