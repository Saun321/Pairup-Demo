import { createContext, useContext, useState } from 'react'
import {
  MOCK_USERS,
  MOCK_RECEIVED_INVITES,
  MOCK_SENT_INVITES,
  MOCK_PARTNERS,
  MOCK_CURRENT_USER,
} from '../data/mockData'
import { getBrowserTZ, tzKey } from '../utils/timezone'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [onboarded, setOnboarded] = useState(false)

  // Detected timezone (set once on mount)
  const [userTzKey] = useState(() => tzKey(getBrowserTZ()))

  // Onboarding form state
  const [onboardingData, setOnboardingData] = useState({
    // MOD-03: display name
    displayName: '',
    // Step 1
    role: '',
    practiceFocus: [],
    targetTier: '',
    timeline: '',
    // Step 2
    level: '',
    weakestArea: '',
    background: '',
    bio: '',
    linkedIn: '',
    // Step 3
    availability: {},
    whoGoesFirst: '',
    feedbackStyle: '',
  })

  // Current user (set after onboarding completes)
  const [currentUser, setCurrentUser] = useState(null)

  // Discover — sentInviteIds tracks cards already invited
  const [sentInviteIds, setSentInviteIds] = useState(new Set())

  // Matches
  const [receivedInvites, setReceivedInvites] = useState(MOCK_RECEIVED_INVITES)
  const [sentInvites, setSentInvites] = useState(MOCK_SENT_INVITES)

  // Partners
  const [partners, setPartners] = useState(MOCK_PARTNERS)

  // Discover filters
  const [discoverFilters, setDiscoverFilters] = useState({ type: '', level: '' })

  // Notification preferences (MOD-04)
  const [notifPrefs, setNotifPrefs] = useState({
    newInvitation:       true,
    inviteAccepted:      true,
    sessionReminder:     true,
    // bookingConfirmation always on — not stored as user-togglable
  })

  function updateOnboarding(fields) {
    setOnboardingData(prev => ({ ...prev, ...fields }))
  }

  function completeOnboarding() {
    const user = {
      ...MOCK_CURRENT_USER,
      displayName: onboardingData.displayName || 'Your Name',
      initials: onboardingData.displayName
        ? onboardingData.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'YN',
      role: onboardingData.role,
      practiceFocus: onboardingData.practiceFocus,
      targetTier: onboardingData.targetTier,
      timeline: onboardingData.timeline,
      level: onboardingData.level,
      background: onboardingData.background,
      bio: onboardingData.bio,
      linkedIn: onboardingData.linkedIn,
      whoGoesFirst: onboardingData.whoGoesFirst,
      feedbackStyle: onboardingData.feedbackStyle,
      availability: onboardingData.availability,
    }
    setCurrentUser(user)
    setOnboarded(true)
  }

  function updateCurrentUser(fields) {
    setCurrentUser(prev => ({ ...prev, ...fields }))
    // also keep onboardingData in sync (for profile page reads)
    setOnboardingData(prev => ({ ...prev, ...fields }))
  }

  function sendInvite(userId, message) {
    setSentInviteIds(prev => new Set([...prev, userId]))
    const user = MOCK_USERS.find(u => u.id === userId)
    if (!user) return
    setSentInvites(prev => [
      ...prev,
      {
        id: `sent_${Date.now()}`,
        to: user,
        message,
        timestamp: 'just now',
        status: 'waiting',
      },
    ])
  }

  function acceptInvite(inviteId) {
    const invite = receivedInvites.find(i => i.id === inviteId)
    if (!invite) return
    setReceivedInvites(prev => prev.filter(i => i.id !== inviteId))
    setPartners(prev => [
      ...prev,
      {
        id: `partner_${Date.now()}`,
        user: invite.from,
        sharedFocus: invite.from.practiceFocus,
        lastMessage: null,
        lastMessageTime: null,
        upcomingSession: null,
        sessionProposal: null,
        messages: [
          {
            id: 'm_intro',
            sender: 'system',
            text: `You're now prepping partners! You both focus on ${invite.from.practiceFocus.join(' + ')} and are targeting ${invite.from.timeline}.`,
            time: 'just now',
          },
        ],
        pastSessions: [],
        isNew: true,
      },
    ])
  }

  function declineInvite(inviteId) {
    setReceivedInvites(prev => prev.filter(i => i.id !== inviteId))
  }

  function sendMessage(partnerId, text) {
    setPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p
        const msg = { id: `m_${Date.now()}`, sender: 'me', text, time: 'just now' }
        return {
          ...p,
          messages: [...p.messages, msg],
          lastMessage: text,
          lastMessageTime: 'just now',
        }
      })
    )
  }

  // MOD-02: send a session proposal (3 slots)
  function sendSessionProposal(partnerId, proposal) {
    setPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p
        const sysMsg = {
          id: `m_proposal_${Date.now()}`,
          sender: 'me',
          text: `Session proposal sent: ${proposal.type} · ${proposal.level} — waiting for ${p.user.name.split(' ')[0]} to pick a time.`,
          time: 'just now',
        }
        return {
          ...p,
          sessionProposal: { ...proposal, direction: 'sent', status: 'pending' },
          messages: [...p.messages, sysMsg],
          lastMessage: 'Session proposal sent',
          lastMessageTime: 'just now',
        }
      })
    )
  }

  // MOD-02: accept a slot from a received proposal
  function acceptProposalSlot(partnerId, slot) {
    setPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p
        const sysMsg = {
          id: `m_confirmed_${Date.now()}`,
          sender: 'system',
          text: `Session confirmed: ${p.sessionProposal?.type} on ${slot.date} at ${slot.time}. You'll both receive an email confirmation.`,
          time: 'just now',
        }
        return {
          ...p,
          upcomingSession: {
            date: `${slot.date} · ${slot.time}`,
            type: p.sessionProposal?.type || 'Session',
            whoFirst: `${p.user.name.split(' ')[0]} goes first as interviewee`,
          },
          sessionProposal: { ...p.sessionProposal, status: 'confirmed' },
          messages: [...p.messages, sysMsg],
          lastMessage: `Session booked for ${slot.date}`,
          lastMessageTime: 'just now',
        }
      })
    )
  }

  // MOD-02: decline all slots — counter-propose
  function declineProposalSlots(partnerId) {
    setPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p
        const round = (p.sessionProposal?.round || 1) + 1
        if (round > 2) {
          // max rounds exceeded
          const sysMsg = {
            id: `m_notime_${Date.now()}`,
            sender: 'system',
            text: "Having trouble finding a time? Update your availability in Settings.",
            time: 'just now',
          }
          return { ...p, sessionProposal: null, messages: [...p.messages, sysMsg] }
        }
        return {
          ...p,
          sessionProposal: { ...p.sessionProposal, status: 'counter', round },
        }
      })
    )
  }

  // MOD-06: dismiss feedback prompt for a past session
  function dismissFeedback(partnerId, sessionId) {
    setPartners(prev =>
      prev.map(p => {
        if (p.id !== partnerId) return p
        return {
          ...p,
          pastSessions: p.pastSessions.map(s =>
            s.id === sessionId ? { ...s, feedbackPending: false } : s
          ),
        }
      })
    )
  }

  function scheduleSession(partnerId, session) {
    setPartners(prev =>
      prev.map(p => p.id !== partnerId ? p : { ...p, upcomingSession: session })
    )
  }

  const discoverUsers = MOCK_USERS

  return (
    <AppContext.Provider
      value={{
        onboarded,
        onboardingData,
        updateOnboarding,
        completeOnboarding,
        currentUser,
        updateCurrentUser,
        userTzKey,
        sentInviteIds,
        sendInvite,
        receivedInvites,
        sentInvites,
        setSentInvites,
        partners,
        acceptInvite,
        declineInvite,
        sendMessage,
        sendSessionProposal,
        acceptProposalSlot,
        declineProposalSlots,
        dismissFeedback,
        scheduleSession,
        discoverUsers,
        discoverFilters,
        setDiscoverFilters,
        notifPrefs,
        setNotifPrefs,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
