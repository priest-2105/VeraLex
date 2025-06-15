import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserSession, selectAuthStatus, selectCurrentUser } from './store/authSlice'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))

// Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))

// Auth Pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage'))
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const CheckEmailPage = lazy(() => import('./pages/auth/CheckEmailPage'))
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))

// Client Pages
const ClientDashboardPage = lazy(() => import('./pages/client/DashboardPage'))
const CreateCasePage = lazy(() => import('./pages/client/CreateCasePage'))
const MyCasesPage = lazy(() => import('./pages/client/MyCasesPage'))
const FindLawyerPage = lazy(() => import('./pages/client/FindLawyerPage'))
const ClientCaseDetailPage = lazy(() => import('./pages/client/CaseDetailPage'))


// Lawyer Pages
const LawyerDashboardPage = lazy(() => import('./pages/lawyer/DashboardPage'))
const AvailableCasesPage = lazy(() => import('./pages/lawyer/AvailableCasesPage'))
const MyApplicationsPage = lazy(() => import('./pages/lawyer/MyApplicationsPage'))
const MyClientsPage = lazy(() => import('./pages/lawyer/MyClientsPage'))
const LawyerMyCasesPage = lazy(() => import('./pages/lawyer/MyCasesPage'))
const LawyerCaseDetailPage = lazy(() => import('./pages/lawyer/CaseDetailPage'))


// Shared Pages
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage'))
const LawyerProfilePage = lazy(() => import('./pages/shared/LawyerProfilePage'))
const SettingsPage = lazy(() => import('./pages/shared/SettingsPage'))

function App() {
  const dispatch = useDispatch()
  const authStatus = useSelector(selectAuthStatus)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    if (authStatus === 'idle') {
      dispatch(checkUserSession())
    }
  }, [authStatus, dispatch])

  if (authStatus === 'loading' || authStatus === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={
              currentUser ? <Navigate to={`/${currentUser.profile.role}/dashboard`} replace /> : <SignInPage />
            } />
            <Route path="signup" element={
              currentUser ? <Navigate to={`/${currentUser.profile.role}/dashboard`} replace /> : <SignUpPage />
            } />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="check-email" element={<CheckEmailPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Client Routes - Protected */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="create-case" element={<CreateCasePage />} />
            <Route path="my-cases" element={<MyCasesPage />} />
            <Route path="find-lawyer" element={<FindLawyerPage />} />
            <Route path="case/:id" element={<ClientCaseDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="lawyer/:lawyerId" element={<LawyerProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Lawyer Routes - Protected */}
          <Route path="/lawyer" element={
            <ProtectedRoute allowedRoles={['lawyer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<LawyerDashboardPage />} />
            <Route path="available-cases" element={<AvailableCasesPage />} />
            <Route path="my-cases" element={<LawyerMyCasesPage />} />
            <Route path="my-applications" element={<MyApplicationsPage />} />
            <Route path="my-clients" element={<MyClientsPage />} />
            <Route path="case/:id" element={<LawyerCaseDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path=":lawyerId" element={<LawyerProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
