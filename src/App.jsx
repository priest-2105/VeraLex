import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))

// Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))

// Auth Pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage.sx'))
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))

// Client Pages
const ClientDashboardPage = lazy(() => import('./pages/client/DashboardPage'))
const CreateCasePage = lazy(() => import('./pages/client/CreateCasePage'))
const MyCasesPage = lazy(() => import('./pages/client/MyCasesPage'))
const FindLawyerPage = lazy(() => import('./pages/client/FindLawyerPage'))

// Lawyer Pages
const LawyerDashboardPage = lazy(() => import('./pages/lawyer/DashboardPage'))
const AvailableCasesPage = lazy(() => import('./pages/lawyer/AvailableCasesPage'))
const MyApplicationsPage = lazy(() => import('./pages/lawyer/MyApplicationsPage'))
const MyClientsPage = lazy(() => import('./pages/lawyer/MyClientsPage'))

// Shared Pages
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'))
const CaseDetailPage = lazy(() => import('./pages/client/CaseDetailPage'))

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
)

function App() {
  
  const isAuthenticated = false
  const userRole = null 

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
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
              isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <SignInPage />
            } />
            <Route path="signup" element={
              isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <SignUpPage />
            } />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Client Routes - Protected */}
          <Route path="/client" element={
            isAuthenticated && userRole === 'client' 
              ? <DashboardLayout /> 
              : <Navigate to="/auth/signin" />
          }>
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="create-case" element={<CreateCasePage />} />
            <Route path="my-cases" element={<MyCasesPage />} />
            <Route path="find-lawyer" element={<FindLawyerPage />} />
            <Route path="case/:id" element={<CaseDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Lawyer Routes - Protected */}
          <Route path="/lawyer" element={
            isAuthenticated && userRole === 'lawyer' 
              ? <DashboardLayout /> 
              : <Navigate to="/auth/signin" />
          }>
            <Route path="dashboard" element={<LawyerDashboardPage />} />
            <Route path="available-cases" element={<AvailableCasesPage />} />
            <Route path="my-applications" element={<MyApplicationsPage />} />
            <Route path="my-clients" element={<MyClientsPage />} />
            <Route path="case/:id" element={<CaseDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
