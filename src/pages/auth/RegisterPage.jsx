import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)

  const canSubmit = name && email && password.length >= 8

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/onboarding/1')
  }

  return (
    <div className="flex flex-col h-full px-5 bg-surface-subtle">
      {/* Logo */}
      <div className="flex-shrink-0 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <LogoMark />
          <span className="text-2xl font-extrabold text-ink tracking-tight">PairUp</span>
        </div>
        <p className="text-sm text-ink-secondary">Create your account</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-extrabold text-ink mb-2">Get started</h1>

          <div>
            <label className="text-xs font-bold text-ink-secondary mb-1.5 block">Full name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Alex Chen"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <label className="text-xs font-bold text-ink-secondary mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
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
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-danger mt-1">At least 8 characters required</p>
            )}
          </div>

          <button type="submit" className="btn-primary mt-2" disabled={!canSubmit}>
            Create account
          </button>
        </form>
      </div>

      <div className="flex-shrink-0 pb-8 text-center">
        <p className="text-sm text-ink-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Sign in
          </Link>
        </p>
      </div>
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
