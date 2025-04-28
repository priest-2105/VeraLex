import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { account, databases } from '../../lib/appwrite'
import { setUser } from '../../store/authSlice'
import Alert from '../../components/common/Alert'
import { AppwriteException } from 'appwrite'

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showResend, setShowResend] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  // Determine redirect path after login
  const from = location.state?.from?.pathname || "/"; // Default to home

  const onSubmit = async (data) => {
    setServerError('')
    setCredentials(data) // store for resend
    setIsLoading(true)
    
    try {
      // 1. Create Appwrite Session
      await account.createEmailPasswordSession(data.email, data.password)
      console.log('Login successful, session created.')

      // 2. Fetch logged-in user data (Auth)
      const loggedInUserData = await account.get()
      console.log('Logged in user data:', loggedInUserData)

      // --- Fetch Profile Data (including role) --- 
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
      const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
      
      if (!DATABASE_ID || !PROFILE_COLLECTION_ID) {
        throw new Error("Appwrite Database/Collection IDs not configured for profile fetching.")
      }
      
      let userProfile = null
      try {
        userProfile = await databases.getDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          loggedInUserData.$id
        )
        console.log("User profile data:", userProfile)
      } catch (dbError) {
        console.error("Failed to fetch user profile from DB:", dbError)
        // Decide how to handle missing profile - maybe default role or show error?
        // For now, let's throw an error to indicate incomplete setup
        throw new Error("User profile not found or could not be fetched.")
      }

      // Combine auth data and profile data
      const fullUserData = { 
        ...loggedInUserData, 
        profile: userProfile // Embed profile data
      }

      // 3. Dispatch user data to Redux
      dispatch(setUser(fullUserData))

      // 4. Navigate based on role (fetched from profile)
      const userRole = userProfile?.role
      const redirectPath = 
        from !== "/" ? from // If user was trying to reach a specific page
        : userRole === 'lawyer' ? '/lawyer/dashboard' 
        : userRole === 'client' ? '/client/dashboard' 
        : '/' // Fallback to home if role unknown
        
      console.log(`Navigating to: ${redirectPath}`)
      navigate(redirectPath, { replace: true })

    } catch (error) {
      console.error('Login failed:', error)
      let errorMsg = 'An unexpected error occurred.'
      if (error instanceof AppwriteException) {
        if (error.code === 401) { // Unauthorized
          errorMsg = 'Invalid email or password.'
        } else if (error.code === 403 && error.message.toLowerCase().includes('verify')) {
          errorMsg = 'Please verify your email address before logging in.'
          setShowResend(true)
        } else {
          errorMsg = error.message || 'Login failed. Please try again.'
        }
      } else {
        errorMsg = error.message || 'Login failed. Please try again.'
      }
      setServerError(errorMsg)
      if (!(error instanceof AppwriteException && error.code === 403 && error.message.toLowerCase().includes('verify'))) {
        setShowResend(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Resend verification handler
  const handleResend = async () => {
    setResendMessage('')
    setIsLoading(true)
    const { email, password } = credentials
    try {
      // Attempt login to get session (may fail but might set cookie)
      try {
        await account.createEmailPasswordSession(email, password)
      } catch (e) {
        console.log('Resend session error (ignored):', e)
      }
      // Send verification email
      const verificationUrl = `${window.location.origin}/auth/verify-email`
      await account.createVerification(verificationUrl)
      setResendMessage('Verification email sent. Please check your inbox.')
    } catch (err) {
      console.error('Resend verification failed:', err)
      setResendMessage('Failed to resend verification. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to access your account</p>
      </div>

      {/* Display Server Errors */} 
      {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}
      
      {/* Display Validation Errors */} 
      {(errors.email || errors.password) && (
         <Alert type="error" message={errors.email?.message || errors.password?.message} />
       )}

      {/* Use RHF handleSubmit */} 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')} 
            required
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            {...register('password')} 
            required
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
        </div>

        {/* Remember me is optional, remove if not needed */}
        {/* <div className="flex items-center">
          <input id="remember-me" type="checkbox" className="..." />
          <label htmlFor="remember-me" className="...">Remember me</label>
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Resend Verification Button */}
      {showResend && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend Email Verification
          </button>
          {resendMessage && <p className="text-sm mt-2 text-green-600">{resendMessage}</p>}
        </div>
      )}
    </motion.div>
  )
}

export default SignInPage 