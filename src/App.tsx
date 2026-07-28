import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RequireAuth } from './layout/RequireAuth'
import { MainContent } from './layout/MainContent'
import { DateTimeShowcasePage } from './pages/DateTimeShowcasePage'
import { ExampleTablePage } from './pages/ExampleTablePage'
import { ClosedInteractionPage } from './pages/ClosedInteractionPage'
import { ExampleSettingsPage } from './pages/ExampleSettingsPage'
import { HomePage } from './pages/HomePage'
import { AIChatPage } from './pages/AIChatPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SignInPage } from './pages/SignInPage'

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/example-table" element={<ExampleTablePage />} />
          <Route path="/closed-interaction" element={<ClosedInteractionPage />} />
          <Route path="/date-time" element={<DateTimeShowcasePage />} />
          <Route path="/example-settings" element={<ExampleSettingsPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/example-node" element={<MainContent label="example node flow" />} />
          <Route path="/example-4/child-1" element={<MainContent label="example 4 child 1" />} />
          <Route path="/example-4/child-2" element={<MainContent label="example 4 child 2" />} />
          <Route path="/app-1" element={<MainContent label="app 1" />} />
          <Route path="/app-2" element={<MainContent label="app 2" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
