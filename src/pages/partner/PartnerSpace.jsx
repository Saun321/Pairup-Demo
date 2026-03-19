import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Calendar, ChevronRight, X, Star, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../../components/Avatar'
import {
  BAND_DEFS, DAYS,
  dateToDayKey, getUpcomingDates, formatShortDate, formatHour, getBandHours,
} from '../../utils/timezone'

/* ─────────────── Main PartnerSpace ─────────────── */

export default function PartnerSpace() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { partners, sendMessage, sendSessionProposal, acceptProposalSlot,
          declineProposalSlots, dismissFeedback, userTzKey } = useApp()

  const [draft, setDraft]               = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [showDisconnect, setShowDisconnect] = useState(false)
  const scrollRef = useRef(null)

  const partner = partners.find(p => p.id === id)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [partner?.messages?.length])

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
        <p className="font-bold text-ink">Partner space not found</p>
        <button className="btn-secondary w-auto px-6" onClick={() => navigate('/partner')}>
          Back to Partners
        </button>
      </div>
    )
  }

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    sendMessage(partner.id, text)
    setDraft('')
  }

  // Pending feedback session (MOD-06)
  const feedbackSession = partner.pastSessions?.find(s => s.feedbackPending)

  // Active proposal
  const proposal = partner.sessionProposal?.status === 'pending' ? partner.sessionProposal : null
  const counterMode = partner.sessionProposal?.status === 'counter'

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-5 pb-3 bg-surface border-b border-border">
        <button onClick={() => navigate('/partner')} className="text-ink-secondary active:text-ink p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => setShowDisconnect(true)} className="flex items-center gap-2.5 flex-1">
          <Avatar name={partner.user.name} initials={partner.user.initials} size="sm" />
          <div className="text-left">
            <p className="text-sm font-bold text-ink leading-tight">{partner.user.name}</p>
            <p className="text-xs text-ink-muted">Tap to manage</p>
          </div>
        </button>
      </div>

      {/* ── Upcoming session pill ── */}
      {partner.upcomingSession && (
        <div className="flex-shrink-0 mx-4 mt-3 bg-brand-xlight border border-brand-light rounded-xl px-4 py-3 flex items-center gap-3">
          <Calendar size={16} className="text-brand flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-brand">{partner.upcomingSession.date}</p>
            <p className="text-xs text-ink-secondary truncate">
              {partner.upcomingSession.type} · {partner.upcomingSession.whoFirst}
            </p>
          </div>
          <ChevronRight size={14} className="text-brand flex-shrink-0" />
        </div>
      )}

      {/* ── MOD-02: Incoming proposal card ── */}
      {proposal && proposal.direction === 'received' && (
        <IncomingProposalCard
          proposal={proposal}
          partnerFirstName={partner.user.name.split(' ')[0]}
          onAccept={slot => acceptProposalSlot(partner.id, slot)}
          onDecline={() => declineProposalSlots(partner.id)}
        />
      )}

      {/* ── MOD-02: Sent proposal — waiting status ── */}
      {proposal && proposal.direction === 'sent' && (
        <div className="flex-shrink-0 mx-4 mt-3 bg-warning-light border border-warning/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse flex-shrink-0" />
          <p className="text-xs text-ink-secondary flex-1">
            Waiting for <span className="font-semibold">{partner.user.name.split(' ')[0]}</span> to pick a time from your proposal.
          </p>
        </div>
      )}

      {/* ── MOD-02: Counter-propose mode ── */}
      {counterMode && (
        <div className="flex-shrink-0 mx-4 mt-3 bg-surface-raised border border-border rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-ink mb-1">None of those times worked</p>
          <p className="text-xs text-ink-secondary mb-2">
            {partner.sessionProposal.round > 2
              ? "Having trouble finding a time? Update your availability in Settings."
              : "Propose your own 3 time slots."}
          </p>
          {(partner.sessionProposal.round || 1) <= 2 && (
            <button
              className="btn-primary py-2 text-xs"
              onClick={() => setShowSchedule(true)}
            >
              Propose 3 new slots
            </button>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div ref={scrollRef} className="page-scroll px-4 py-4 flex flex-col gap-3">
        {partner.messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} partnerUser={partner.user} />
        ))}
        <div className="h-2" />
      </div>

      {/* ── MOD-06: Post-session feedback card (above input) ── */}
      {feedbackSession && (
        <FeedbackCard
          session={feedbackSession}
          partnerName={partner.user.name.split(' ')[0]}
          onDismiss={() => dismissFeedback(partner.id, feedbackSession.id)}
        />
      )}

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t border-border bg-surface px-4 pb-4 pt-2">
        <button
          className="flex items-center gap-2 text-xs font-semibold text-brand mb-2 py-1"
          onClick={() => setShowSchedule(true)}
        >
          <Calendar size={14} />
          + Schedule a session
        </button>
        <div className="flex items-end gap-2">
          <textarea
            className="input-field flex-1 resize-none text-sm"
            style={{ minHeight: 42, maxHeight: 96 }}
            placeholder="Message…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-40"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── Schedule modal (MOD-02) ── */}
      {showSchedule && (
        <ScheduleModal
          partner={partner}
          userTzKey={userTzKey}
          onClose={() => setShowSchedule(false)}
          onSend={proposal => {
            sendSessionProposal(partner.id, proposal)
            setShowSchedule(false)
          }}
        />
      )}

      {/* ── Disconnect confirm ── */}
      {showDisconnect && (
        <DisconnectModal
          partnerName={partner.user.name}
          onCancel={() => setShowDisconnect(false)}
          onConfirm={() => navigate('/partner')}
        />
      )}
    </div>
  )
}

/* ─────────────── Message Bubble ─────────────── */

function MessageBubble({ msg, partnerUser }) {
  if (msg.sender === 'system') {
    return (
      <div className="mx-auto max-w-xs bg-surface-raised rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-ink-secondary leading-relaxed">{msg.text}</p>
      </div>
    )
  }
  const isMe = msg.sender === 'me'
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && <Avatar name={partnerUser.name} initials={partnerUser.initials} size="sm" />}
      <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 ${
        isMe
          ? 'bg-brand text-white rounded-br-sm'
          : 'bg-surface border border-border text-ink rounded-bl-sm'
      }`}>
        <p className="text-sm leading-relaxed">{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-ink-muted'}`}>{msg.time}</p>
      </div>
    </div>
  )
}

/* ─────────────── MOD-02 Incoming Proposal Card ─────────────── */

function IncomingProposalCard({ proposal, partnerFirstName, onAccept, onDecline }) {
  return (
    <div className="flex-shrink-0 mx-4 mt-3 bg-surface border border-border rounded-xl shadow-card p-4 fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-ink">
            {partnerFirstName} proposed 3 times
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            {proposal.type} · {proposal.level} · {proposal.round === 2 ? 'Round 2' : ''}
          </p>
        </div>
        <span className="chip-brand text-xs">{proposal.type}</span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {(proposal.slots || []).map(slot => (
          <button
            key={slot.id}
            onClick={() => onAccept(slot)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-surface-subtle hover:border-brand hover:bg-brand-xlight transition-all active:scale-[0.99] group"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-ink group-hover:text-brand">{slot.date}</p>
              <p className="text-xs text-ink-muted">{slot.time}</p>
            </div>
            <Check size={16} className="text-ink-muted group-hover:text-brand" />
          </button>
        ))}
      </div>

      <button
        onClick={onDecline}
        className="w-full text-center text-xs font-semibold text-ink-muted py-2 hover:text-danger transition-colors"
      >
        None of these work → propose my own slots
      </button>
    </div>
  )
}

/* ─────────────── MOD-06 Feedback Card ─────────────── */

function FeedbackCard({ session, partnerName, onDismiss }) {
  const [step, setStep]       = useState(1) // 1: showup | 2: rating | 3: appfeedback | 4: done
  const [showedUp, setShowedUp] = useState(null)
  const [stars, setStars]     = useState(0)
  const [comment, setComment] = useState('')
  const [appFeedback, setAppFeedback] = useState('')

  function handleShowUp(yes) {
    setShowedUp(yes)
    if (!yes) {
      setStep('noshow')
      setTimeout(() => onDismiss(), 2200)
    } else {
      setStep(2)
    }
  }

  function handleSubmit() {
    setStep(4)
    setTimeout(() => onDismiss(), 1800)
  }

  return (
    <div className="flex-shrink-0 mx-4 mb-2 bg-surface border border-border rounded-xl shadow-card p-4 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">Session feedback</p>
        <span className="text-xs text-ink-muted">{session.date} · {session.type}</span>
      </div>

      {step === 4 && (
        <div className="flex items-center gap-2 py-2">
          <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center">
            <Check size={14} className="text-success" />
          </div>
          <p className="text-sm font-semibold text-ink">Thanks for your feedback.</p>
        </div>
      )}

      {step === 'noshow' && (
        <div className="py-1">
          <p className="text-sm text-ink-secondary">Sorry to hear that. We've recorded this.</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-sm font-semibold text-ink mb-3">
            Did {partnerName} show up to the session?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleShowUp(true)}
              className="flex-1 py-2.5 rounded-xl border-2 border-success bg-success-light text-success text-sm font-bold transition-all active:scale-95"
            >
              Yes
            </button>
            <button
              onClick={() => handleShowUp(false)}
              className="flex-1 py-2.5 rounded-xl border-2 border-border text-ink-secondary text-sm font-semibold transition-all active:scale-95"
            >
              No
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-sm font-semibold text-ink mb-3">How was the session?</p>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setStars(n)}
                className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all active:scale-95"
                style={{
                  borderColor: stars >= n ? '#1a5f7a' : '#d8e8ef',
                  background: stars >= n ? '#e4f4fa' : '#fff',
                }}
              >
                <Star
                  size={22}
                  fill={stars >= n ? '#1a5f7a' : 'none'}
                  stroke={stars >= n ? '#1a5f7a' : '#b0c7d1'}
                />
              </button>
            ))}
          </div>
          <textarea
            className="input-field resize-none h-16 text-sm mb-3"
            placeholder="Anything to add? (optional)"
            maxLength={150}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            className="btn-primary py-2.5 text-sm"
            disabled={!stars}
            onClick={() => setStep(3)}
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Any suggestions for PairUp?</p>
          <p className="text-xs text-ink-muted mb-2">Optional — only seen by our team</p>
          <textarea
            className="input-field resize-none h-16 text-sm mb-3"
            placeholder="What could we do better?"
            maxLength={200}
            value={appFeedback}
            onChange={e => setAppFeedback(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn-ghost text-sm" onClick={handleSubmit}>Skip</button>
            <button className="btn-primary py-2.5 text-sm flex-1" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── MOD-02 Schedule Modal ─────────────── */

const SCHEDULE_TYPES_SDE = ['DSA', 'System Design', 'Behavioral']
const SCHEDULE_TYPES_PM  = ['Product Sense', 'Analytical', 'Behavioral']
const SCHEDULE_LEVELS    = ['Beginner', 'Intermediate', 'Advanced']

function ScheduleModal({ partner, userTzKey, onClose, onSend }) {
  const { onboardingData } = useApp()
  const [step, setStep]         = useState(1)
  const [type, setType]         = useState('')
  const [level, setLevel]       = useState('')
  const [selectedSlots, setSelectedSlots] = useState([]) // [{id, label, date, time}]
  const [expandedDateIdx, setExpandedDateIdx] = useState(null)
  const [meetLink, setMeetLink] = useState('')

  const scheduleTypes = (onboardingData.role === 'PM') ? SCHEDULE_TYPES_PM : SCHEDULE_TYPES_SDE
  const dates = getUpcomingDates(14)

  // Build available time slots for a given date from onboarding availability
  function getSlotsForDate(date) {
    const dayKey  = dateToDayKey(date)
    const bands   = (onboardingData.availability || {})[dayKey] || []
    if (!bands.length) return []
    const slots = []
    for (const band of bands) {
      const hours = getBandHours(band, userTzKey)
      const bandDef = BAND_DEFS.find(b => b.key === band)
      const tzInfo  = (bandDef?.[userTzKey] || bandDef?.et)?.range || ''
      for (const h of hours) {
        slots.push({
          id: `${date.toISOString().slice(0, 10)}-${h}`,
          hour: h,
          label: `${formatShortDate(date)} · ${formatHour(h)} ${tzInfo.split(' ')[1] || 'ET'}`,
          date: formatShortDate(date),
          time: `${formatHour(h)} ${tzInfo.split(' ')[1] || 'ET'}`,
        })
      }
    }
    return slots
  }

  // Fallback: if no availability set, show a default set of demo slots
  function getDemoSlotsForDate(date) {
    const hrs = [9, 12, 17] // AM, PM, Evening representative
    const tz  = { et: 'ET', pt: 'PT', ct: 'CT', mt: 'MT' }[userTzKey] || 'ET'
    return hrs.map(h => ({
      id: `${date.toISOString().slice(0, 10)}-${h}`,
      hour: h,
      label: `${formatShortDate(date)} · ${formatHour(h)} ${tz}`,
      date: formatShortDate(date),
      time: `${formatHour(h)} ${tz}`,
    }))
  }

  function toggleSlot(slot) {
    setSelectedSlots(prev => {
      if (prev.find(s => s.id === slot.id)) {
        return prev.filter(s => s.id !== slot.id)
      }
      if (prev.length >= 3) return prev
      return [...prev, slot]
    })
  }

  function getDateSlots(date) {
    const s = getSlotsForDate(date)
    return s.length ? s : getDemoSlotsForDate(date)
  }

  // Split dates into week 1 and week 2
  const week1 = dates.slice(0, 7)
  const week2  = dates.slice(7, 14)

  function handleSend() {
    onSend({
      direction: 'sent',
      type,
      level,
      meetingLink: meetLink,
      slots: selectedSlots,
      round: 1,
      status: 'pending',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-surface rounded-t-2xl sheet-enter shadow-modal" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Handle */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3">
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Schedule a session</h2>
            <button onClick={onClose}><X size={20} className="text-ink-muted" /></button>
          </div>
          {/* Step indicator */}
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="h-1 flex-1 rounded-full transition-all"
                style={{ background: s <= step ? '#1a5f7a' : '#dde6ed' }} />
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6">
          {/* Step 1 — Interview type */}
          {step === 1 && (
            <StepWrapper title="Interview type">
              <div className="flex flex-wrap gap-2">
                {scheduleTypes.map(t => (
                  <button key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      type === t ? 'bg-brand border-brand text-white' : 'bg-surface border-border text-ink-secondary'
                    }`}
                  >{t}</button>
                ))}
              </div>
              <button className="btn-primary mt-4" disabled={!type} onClick={() => setStep(2)}>Next</button>
            </StepWrapper>
          )}

          {/* Step 2 — Level */}
          {step === 2 && (
            <StepWrapper title="Level for this session">
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_LEVELS.map(l => (
                  <button key={l}
                    onClick={() => setLevel(l)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      level === l ? 'bg-brand border-brand text-white' : 'bg-surface border-border text-ink-secondary'
                    }`}
                  >{l}</button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="btn-secondary flex-shrink-0 w-auto px-4" onClick={() => setStep(1)}>Back</button>
                <button className="btn-primary" disabled={!level} onClick={() => setStep(3)}>Next</button>
              </div>
            </StepWrapper>
          )}

          {/* Step 3 — Propose up to 3 slots */}
          {step === 3 && (
            <StepWrapper title="Propose up to 3 time slots">
              <p className="text-xs text-ink-muted mb-3">
                Tap a day to see time slots. Select up to 3 options for your partner to choose from.
              </p>

              {/* Selected slot chips */}
              {selectedSlots.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedSlots.map(s => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-white text-xs font-semibold"
                    >
                      {s.label}
                      <button onClick={() => toggleSlot(s)} className="ml-0.5 opacity-70 hover:opacity-100">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Counter */}
              <div className="text-xs text-ink-muted mb-3">
                {selectedSlots.length}/3 slots selected (min 1)
              </div>

              {/* Two-week calendar */}
              {[{ label: 'This week', days: week1 }, { label: 'Next week', days: week2 }].map(({ label, days }) => (
                <div key={label} className="mb-4">
                  <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">{label}</p>
                  <div className="flex flex-col gap-1.5">
                    {days.map((date, i) => {
                      const dateIdx = dates.indexOf(date)
                      const slots   = getDateSlots(date)
                      const isOpen  = expandedDateIdx === dateIdx
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                      const dayNum  = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      const hasSlots = slots.length > 0

                      return (
                        <div key={i}>
                          <button
                            onClick={() => setExpandedDateIdx(isOpen ? null : dateIdx)}
                            disabled={!hasSlots}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                              isOpen
                                ? 'border-brand bg-brand-xlight'
                                : hasSlots
                                ? 'border-border bg-surface hover:border-brand-mid'
                                : 'border-border bg-surface-raised opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-sm font-semibold text-ink">
                              {dayName} {dayNum}
                            </span>
                            <span className="text-xs text-ink-muted">
                              {hasSlots ? `${slots.length} slots` : 'Not available'}
                            </span>
                          </button>

                          {isOpen && (
                            <div className="mt-1 ml-2 flex flex-col gap-1 fade-in">
                              {slots.map(slot => {
                                const sel = !!selectedSlots.find(s => s.id === slot.id)
                                const maxed = selectedSlots.length >= 3 && !sel
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => !maxed && toggleSlot(slot)}
                                    disabled={maxed}
                                    className={`flex items-center justify-between px-4 py-2 rounded-xl border text-sm transition-all ${
                                      sel
                                        ? 'border-brand bg-brand text-white'
                                        : maxed
                                        ? 'border-border text-ink-muted opacity-40 cursor-not-allowed'
                                        : 'border-border bg-surface text-ink hover:border-brand'
                                    }`}
                                  >
                                    <span className="font-medium">{formatHour(slot.hour)}</span>
                                    {sel && <Check size={14} />}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-2">
                <button className="btn-secondary flex-shrink-0 w-auto px-4" onClick={() => setStep(2)}>Back</button>
                <button className="btn-primary" disabled={selectedSlots.length < 1} onClick={() => setStep(4)}>Next</button>
              </div>
            </StepWrapper>
          )}

          {/* Step 4 — Confirm + meeting link */}
          {step === 4 && (
            <StepWrapper title="Confirm and send proposal">
              {/* Summary */}
              <div className="bg-surface-raised rounded-xl p-4 space-y-2 mb-4">
                <ConfirmRow label="Type"  value={type} />
                <ConfirmRow label="Level" value={level} />
                <div>
                  <p className="text-xs text-ink-secondary mb-1">Proposed times</p>
                  {selectedSlots.map(s => (
                    <p key={s.id} className="text-sm font-semibold text-ink">{s.label}</p>
                  ))}
                </div>
              </div>

              {/* Meeting link — required */}
              <div className="mb-4">
                <label className="text-xs font-bold text-ink-secondary mb-1.5 block">
                  Meeting link <span className="text-danger">*</span>
                </label>
                <p className="text-xs text-ink-muted mb-2">
                  Paste your Google Meet or Zoom link. Sent to your partner in the email confirmation.
                </p>
                <input
                  type="url"
                  className="input-field"
                  placeholder="meet.google.com/abc-defg-hij"
                  value={meetLink}
                  onChange={e => setMeetLink(e.target.value)}
                />
              </div>

              {/* Email confirmation note */}
              <div className="bg-surface-raised rounded-xl p-3 mb-4 text-xs text-ink-secondary space-y-1">
                <p className="font-semibold text-ink text-xs">Email will include:</p>
                <p>• Date + time (in each user's local timezone)</p>
                <p>• Interview type and level</p>
                <p>• Who asks first</p>
                <p>• Meeting link</p>
                <p>• "Add to calendar" link</p>
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary flex-shrink-0 w-auto px-4" onClick={() => setStep(3)}>Back</button>
                <button
                  className="btn-primary"
                  disabled={!meetLink.trim()}
                  onClick={handleSend}
                >
                  Send proposal
                </button>
              </div>
            </StepWrapper>
          )}
        </div>
      </div>
    </div>
  )
}

function StepWrapper({ title, children }) {
  return (
    <div className="fade-in">
      <p className="text-sm font-bold text-ink mb-4">{title}</p>
      {children}
    </div>
  )
}

function ConfirmRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-secondary">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}

/* ─────────────── Disconnect Modal ─────────────── */

function DisconnectModal({ partnerName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-surface rounded-2xl p-6 shadow-modal w-full fade-in">
        <h3 className="text-base font-extrabold text-ink mb-2">Disconnect from {partnerName}?</h3>
        <p className="text-sm text-ink-secondary mb-5">
          This will remove the Partner Space for both of you. This action can't be undone.
        </p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
          <button
            className="flex-1 py-3.5 rounded-xl bg-danger text-white font-semibold text-sm transition-all active:scale-95"
            onClick={onConfirm}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  )
}
