import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { account } from '../../lib/appwrite'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { AppwriteException } from 'appwrite'

// Zod schema for password change validation
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'], // Set error on confirmPassword field
})

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  const onSubmit = async (data) => {
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      await account.updatePassword(data.newPassword, data.currentPassword)
      setSuccessMessage('Password updated successfully!')
      reset() // Clear form fields on success
    } catch (error) {
      console.error('Password update failed:', error)
      let errorMsg = 'An unexpected error occurred while updating your password.'
      if (error instanceof AppwriteException) {
         if (error.code === 401) { // Unauthorized (likely wrong current password)
           errorMsg = 'Incorrect current password.'
         } else {
           errorMsg = error.message || 'Failed to update password. Please try again.'
         }
      } else if (error instanceof Error) {
        errorMsg = error.message
      }
      setServerError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {/* Server Messages */}
        {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        
        {/* Validation Errors */}
        {(errors.currentPassword || errors.newPassword || errors.confirmPassword) && (
           <Alert type="error" message={errors.currentPassword?.message || errors.newPassword?.message || errors.confirmPassword?.message} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
              className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
              placeholder="Minimum 8 characters"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Retype new password"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary py-2 px-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Add other settings sections here later if needed */}
      {/* 
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
        <p className="text-gray-600">More settings options can be added here.</p>
      </div> 
      */}
    </div>
  )
}

export default SettingsPage 