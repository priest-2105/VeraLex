import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    if (!email) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }
    
    try {
      // Here you would implement actual password reset logic
      // For now we'll just simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
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
        <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
        <p className="text-gray-600 mt-2">
          {!isSubmitted ? 
            "Enter your email and we'll send you a link to reset your password" : 
            "Check your email for password reset instructions"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      ) : (
        <div className="bg-green-50 text-green-800 p-6 rounded-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Reset Link Sent!</h3>
          <p className="mb-4">We've sent a password reset link to <strong>{email}</strong></p>
          <p className="text-sm text-gray-600">
            If you don't see the email, check your spam folder or
            <button 
              onClick={handleSubmit} 
              className="text-primary hover:underline ml-1 focus:outline-none">
              click here to resend
            </button>
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Remember your password?{' '}
          <Link to="/auth/signin" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordPage 