import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingLoading() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/discover', { replace: true }), 2000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 bg-surface-subtle px-8 text-center">
      {/* Animated logo mark */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(#1a5f7a 0%, #0d9488 60%, #e4f4fa 60%)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div className="absolute inset-2 rounded-full bg-surface-subtle flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a5f7a" strokeWidth="2.2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      </div>

      <div>
        <p className="text-lg font-bold text-ink">All set!</p>
        <p className="text-sm text-ink-secondary mt-1">Finding your matches…</p>
      </div>

      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </div>
  )
}
