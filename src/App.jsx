import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import BottomNav from './components/BottomNav'

// Auth
import LoginPage     from './pages/auth/LoginPage'
import RegisterPage  from './pages/auth/RegisterPage'

// Onboarding
import OnboardingStep1   from './pages/onboarding/OnboardingStep1'
import OnboardingStep2   from './pages/onboarding/OnboardingStep2'
import OnboardingStep3   from './pages/onboarding/OnboardingStep3'
import OnboardingLoading from './pages/onboarding/OnboardingLoading'

// Discover
import DiscoverPage      from './pages/discover/DiscoverPage'
import UserProfileDetail from './pages/discover/UserProfileDetail'

// Matches
import MatchesPage from './pages/matches/MatchesPage'

// Partner
import PartnerTab   from './pages/partner/PartnerTab'
import PartnerSpace from './pages/partner/PartnerSpace'

// Profile
import ProfilePage    from './pages/profile/ProfilePage'
import EditProfilePage from './pages/profile/EditProfilePage'
import SettingsPage   from './pages/profile/SettingsPage'

// Tabs that show the bottom nav
const TAB_ROOTS = ['/discover', '/matches', '/partner', '/profile']

// Routes that hide the bottom nav entirely (full-screen views)
const NO_NAV_PATTERNS = [
  /^\/partner\/.+/,         // partner space
  /^\/profile\/edit/,       // edit profile
  /^\/profile\/settings/,   // settings
  /^\/discover\/profile\//  // user profile detail
]

export default function App() {
  const { onboarded } = useApp()
  const location = useLocation()

  const isTabRoute = onboarded && TAB_ROOTS.some(t => location.pathname.startsWith(t))
  const hideNav    = NO_NAV_PATTERNS.some(re => re.test(location.pathname))
  const showNav    = isTabRoute && !hideNav

  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding */}
          <Route path="/onboarding/1"       element={<OnboardingStep1 />} />
          <Route path="/onboarding/2"       element={<OnboardingStep2 />} />
          <Route path="/onboarding/3"       element={<OnboardingStep3 />} />
          <Route path="/onboarding/loading" element={<OnboardingLoading />} />

          {/* Discover */}
          <Route path="/discover"              element={<DiscoverPage />} />
          <Route path="/discover/profile/:id"  element={<UserProfileDetail />} />

          {/* Matches */}
          <Route path="/matches" element={<MatchesPage />} />

          {/* Partner */}
          <Route path="/partner"     element={<PartnerTab />} />
          <Route path="/partner/:id" element={<PartnerSpace />} />

          {/* Profile */}
          <Route path="/profile"          element={<ProfilePage />} />
          <Route path="/profile/edit"     element={<EditProfilePage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      {showNav && <BottomNav />}
    </div>
  )
}
