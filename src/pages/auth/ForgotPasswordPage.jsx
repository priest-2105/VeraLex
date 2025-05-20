import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { account } from '../../lib/appwrite'
import Alert from '../../components/common/Alert'
import { AppwriteException } from 'appwrite'

// Zod schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset form after successful submission
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // Define the URL for the password reset page
  const resetUrl = `${window.location.origin}/auth/reset-password` // Adjust if needed

  const onSubmit = async (data) => {
    setServerMessage({ type: '', text: '' })
    setIsLoading(true)

    try {
      await account.createRecovery(data.email, resetUrl)
      setServerMessage({ type: 'success', text: 'Password reset email sent! Please check your inbox.' })
      reset() // Clear the form
    } catch (error) {
      console.error('Forgot password failed:', error)
      let errorMsg = 'Failed to send reset email. Please try again.'
      if (error instanceof AppwriteException) {
        if (error.code === 404) { // User not found
          errorMsg = 'No account found with that email address.'
        } else {
          errorMsg = error.message || errorMsg
        }
      } else {
        errorMsg = error.message || errorMsg
      }
      setServerMessage({ type: 'error', text: errorMsg })
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
        <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
        <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
      </div>

      {/* Display Server Messages */}
      {serverMessage.text && (
        <Alert 
          type={serverMessage.type} 
          message={serverMessage.text} 
          onClose={() => setServerMessage({ type: '', text: '' })} 
        />
      )}
      
      {/* Display Validation Errors */}
      {errors.email && (
        <Alert type="error" message={errors.email.message} />
      )}

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

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Remembered your password?{' '}
          <Link to="/auth/signin" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordPage 