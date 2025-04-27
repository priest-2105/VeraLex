import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { account } from '../../lib/appwrite'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Alert from '../../components/common/Alert'
import { AppwriteException } from 'appwrite'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!userId || !secret) {
        setErrorMessage('Invalid verification link. Missing parameters.')
        setStatus('error')
        return
      }

      try {
        setStatus('verifying')
        await account.updateVerification(userId, secret)
        setStatus('success')
        
        // Redirect to sign-in after a short delay
        setTimeout(() => {
          navigate('/auth/signin', { state: { verificationSuccess: true } })
        }, 3000) // 3-second delay

      } catch (error) {
        console.error('Email verification failed:', error)
        let errorMsg = 'An unexpected error occurred during verification.'
        if (error instanceof AppwriteException) {
           // Customize based on Appwrite error codes if needed
           if (error.code === 401 && error.message.includes('secret')) {
             errorMsg = 'Invalid or expired verification link.'
           } else {
             errorMsg = error.message || 'Failed to verify email. Please try again or request a new link.'
           }
        } else if (error instanceof Error) {
          errorMsg = error.message
        }
        setErrorMessage(errorMsg)
        setStatus('error')
      }
    }

    verifyEmail()
  }, [userId, secret, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <LoadingSpinner size="lg" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Verifying Your Email...</h1>
            <p className="text-gray-600 mt-2">Please wait a moment.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </motion.div>
            <h1 className="text-2xl font-bold text-green-600">Email Verified Successfully!</h1>
            <p className="text-gray-600 mt-2 mb-4">Your account is now active. Redirecting you to the sign-in page...</p>
            <Link to="/auth/signin" className="text-primary hover:underline">Sign in now</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <Alert type="error" message={errorMessage || 'Could not verify your email.'} className="mt-4" />
            <p className="text-gray-600 mt-4">
              Please check the link or try signing in to request a new verification email.
            </p>
            <Link to="/auth/signin" className="mt-4 inline-block btn btn-primary">Go to Sign In</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage 