import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { notifPrefs, setNotifPrefs } = useApp()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-5 pb-3 bg-surface border-b border-border">
        <button onClick={() => navigate('/profile')} className="text-ink-secondary active:text-ink p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-ink">Settings</h1>
      </div>

      <div className="page-scroll pb-8">
        {/* ── Account ── */}
        <SectionHeader title="Account" />

        <SettingsRow
          label="Change display name"
          sub="Update the name shown to partners"
          onPress={() => navigate('/profile/edit')}
          showArrow
        />

        <ChangeEmailRow />
        <ChangePasswordRow />
        <DeleteAccountRow />

        {/* ── Notifications (MOD-04) ── */}
        <SectionHeader title="Notifications" />

        <ToggleRow
          label="New invitation received"
          sub="When someone sends you a match invite"
          value={notifPrefs.newInvitation}
          onChange={v => setNotifPrefs(p => ({ ...p, newInvitation: v }))}
        />
        <ToggleRow
          label="Invite accepted"
          sub="When your invite is accepted and a match is confirmed"
          value={notifPrefs.inviteAccepted}
          onChange={v => setNotifPrefs(p => ({ ...p, inviteAccepted: v }))}
        />
        <ToggleRow
          label="Session reminder"
          sub="30 minutes before a scheduled session"
          value={notifPrefs.sessionReminder}
          onChange={v => setNotifPrefs(p => ({ ...p, sessionReminder: v }))}
        />
        {/* Session booking confirmation — always on, toggle hidden per MOD-04 */}
        <div className="px-5 py-3 border-b border-border flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">Session booking confirmation</p>
            <p className="text-xs text-ink-muted mt-0.5">Sent automatically when a session is booked — always on</p>
          </div>
          <span className="text-xs font-semibold text-ink-muted bg-surface-raised px-2.5 py-1 rounded-full">Always on</span>
        </div>

        {/* ── About ── */}
        <SectionHeader title="About" />

        <SettingsRow label="Version" sub="1.0.0-demo" />
        <SettingsRow
          label="Community guidelines"
          sub="How we expect everyone to behave on PairUp"
          onPress={() => {}}
          showArrow
        />
        <SettingsRow
          label="Privacy policy"
          sub="How we handle your data"
          onPress={() => {}}
          showArrow
        />
      </div>
    </div>
  )
}

/* ── Section Header ── */
function SectionHeader({ title }) {
  return (
    <div className="px-5 pt-6 pb-2">
      <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">{title}</p>
    </div>
  )
}

/* ── Plain row with arrow ── */
function SettingsRow({ label, sub, onPress, showArrow }) {
  const content = (
    <div className={`px-5 py-3.5 border-b border-border flex items-center gap-3 ${onPress ? 'active:bg-surface-raised cursor-pointer' : ''}`}>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
      </div>
      {showArrow && <ChevronRight size={16} className="text-ink-muted flex-shrink-0" />}
    </div>
  )
  return onPress ? <button className="w-full text-left" onClick={onPress}>{content}</button> : content
}

/* ── Toggle row ── */
function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="px-5 py-3.5 border-b border-border flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-brand' : 'bg-border-strong'}`}
        role="switch"
        aria-checked={value}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}

/* ── Change email (inline expand) ── */
function ChangeEmailRow() {
  const [open, setOpen]   = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [done, setDone]   = useState(false)

  return (
    <div className="border-b border-border">
      <button
        className="w-full text-left px-5 py-3.5 flex items-center gap-3 active:bg-surface-raised"
        onClick={() => { setOpen(o => !o); setDone(false) }}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Change email</p>
          <p className="text-xs text-ink-muted mt-0.5">Requires your current password</p>
        </div>
        <ChevronRight
          size={16}
          className="text-ink-muted flex-shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && !done && (
        <div className="px-5 pb-4 flex flex-col gap-3 fade-in">
          <input type="email" className="input-field" placeholder="New email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="input-field" placeholder="Current password" value={pass} onChange={e => setPass(e.target.value)} />
          <button
            className="btn-primary py-2.5 text-sm"
            disabled={!email || !pass}
            onClick={() => setDone(true)}
          >
            Update email
          </button>
        </div>
      )}
      {open && done && (
        <p className="px-5 pb-4 text-sm text-success font-semibold fade-in">Email updated successfully.</p>
      )}
    </div>
  )
}

/* ── Change password (inline expand) ── */
function ChangePasswordRow() {
  const [open, setOpen]     = useState(false)
  const [curr, setCurr]     = useState('')
  const [next_, setNext]    = useState('')
  const [showCurr, setShowCurr] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [done, setDone]     = useState(false)

  return (
    <div className="border-b border-border">
      <button
        className="w-full text-left px-5 py-3.5 flex items-center gap-3 active:bg-surface-raised"
        onClick={() => { setOpen(o => !o); setDone(false) }}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Change password</p>
          <p className="text-xs text-ink-muted mt-0.5">Requires your current password</p>
        </div>
        <ChevronRight size={16} className="text-ink-muted flex-shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
      </button>
      {open && !done && (
        <div className="px-5 pb-4 flex flex-col gap-3 fade-in">
          <PwInput label="Current password" value={curr} onChange={setCurr} show={showCurr} onToggle={() => setShowCurr(s => !s)} />
          <PwInput label="New password (min 8 chars)" value={next_} onChange={setNext} show={showNext} onToggle={() => setShowNext(s => !s)} />
          {next_.length > 0 && next_.length < 8 && (
            <p className="text-xs text-danger">At least 8 characters required</p>
          )}
          <button
            className="btn-primary py-2.5 text-sm"
            disabled={!curr || next_.length < 8}
            onClick={() => setDone(true)}
          >
            Update password
          </button>
        </div>
      )}
      {open && done && (
        <p className="px-5 pb-4 text-sm text-success font-semibold fade-in">Password updated successfully.</p>
      )}
    </div>
  )
}

function PwInput({ label, value, onChange, show, onToggle }) {
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="input-field pr-12"
        placeholder={label}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

/* ── Delete account ── */
function DeleteAccountRow() {
  const [open, setOpen]     = useState(false)
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  const canDelete = confirm === 'DELETE'

  return (
    <div className="border-b border-border">
      <button
        className="w-full text-left px-5 py-3.5 flex items-center gap-3 active:bg-surface-raised"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-danger">Delete account</p>
          <p className="text-xs text-ink-muted mt-0.5">Permanently removes all your data</p>
        </div>
        <ChevronRight size={16} className="text-ink-muted flex-shrink-0" />
      </button>
      {open && (
        <div className="px-5 pb-4 flex flex-col gap-3 fade-in">
          <div className="bg-danger-light rounded-xl p-3">
            <p className="text-xs font-semibold text-danger mb-1">This is permanent and irreversible.</p>
            <p className="text-xs text-ink-secondary">All your profile data, matches, and partner history will be deleted.</p>
          </div>
          <label className="text-xs font-bold text-ink-secondary">
            Type <span className="font-bold text-danger">DELETE</span> to confirm
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="DELETE"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          <button
            className="py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: canDelete ? '#dc2626' : '#fee2e2', color: canDelete ? '#fff' : '#dc2626' }}
            disabled={!canDelete}
            onClick={() => navigate('/login')}
          >
            Permanently delete account
          </button>
        </div>
      )}
    </div>
  )
}
