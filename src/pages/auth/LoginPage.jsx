import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [forgot, setForgot]     = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const canSubmit = forgot ? email : email && password

  function handleSubmit(e) {
    e.preventDefault()
    if (forgot) {
      setResetSent(true)
    } else {
      navigate('/onboarding/1')
    }
  }

  return (
    <div className="flex flex-col h-full px-5 bg-surface-subtle">
      {/* Logo */}
      <div className="flex-shrink-0 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <LogoMark />
          <span className="text-2xl font-extrabold text-ink tracking-tight">PairUp</span>
        </div>
        <p className="text-sm text-ink-secondary">Find your NYU CS interview partner</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {resetSent ? (
          <div className="text-center fade-in">
            <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-bold text-ink mb-1">Reset email sent</p>
            <p className="text-sm text-ink-secondary mb-6">Check your inbox and follow the instructions.</p>
            <button className="btn-secondary w-auto px-6 mx-auto" onClick={() => { setForgot(false); setResetSent(false) }}>
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-2xl font-extrabold text-ink mb-2">
              {forgot ? 'Reset your password' : 'Welcome back'}
            </h1>

            <div>
              <label className="text-xs font-bold text-ink-secondary mb-1.5 block">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@nyu.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {!forgot && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-ink-secondary">Password</label>
                  <button
                    type="button"
                    className="text-xs text-brand font-semibold"
                    onClick={() => setForgot(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary mt-2" disabled={!canSubmit}>
              {forgot ? 'Send reset link' : 'Sign in'}
            </button>

            {forgot && (
              <button type="button" className="btn-ghost mx-auto" onClick={() => setForgot(false)}>
                Back to login
              </button>
            )}
          </form>
        )}
      </div>

      {!forgot && !resetSent && (
        <div className="flex-shrink-0 pb-8 text-center">
          <p className="text-sm text-ink-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  )
}
