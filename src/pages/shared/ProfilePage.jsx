import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { selectCurrentUser, setUser } from '../../store/authSlice'
import { account, databases } from '../../lib/appwrite'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { AppwriteException } from 'appwrite'

// Zod schema for profile validation
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(), // Email is usually read-only or changed via verification
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})

// Fetch Appwrite IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID

const ProfilePage = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const defaultValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '', // Display current email
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
    bio: currentUser?.profile?.bio || '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }, // Use isDirty to enable save button only on changes
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  // Reset form when editing is cancelled or currentUser changes
  useEffect(() => {
    if (currentUser) {
      reset(defaultValues)
    }
  }, [currentUser, reset, isEditing]) // Add isEditing dependency

  const onSubmit = async (data) => {
    if (!currentUser) return
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // 1. Update Name (if changed)
      if (data.name !== currentUser.name) {
        await account.updateName(data.name)
        console.log("Name updated successfully.")
      }
      
      // Note: Email updates usually require verification and are handled separately.
      // We won't update email here.

      // 2. Prepare profile data for database update (only changed fields)
      const profileDataToUpdate = {}
      if (data.phone !== currentUser.profile?.phone) profileDataToUpdate.phone = data.phone
      if (data.address !== currentUser.profile?.address) profileDataToUpdate.address = data.address
      if (data.bio !== currentUser.profile?.bio) profileDataToUpdate.bio = data.bio
      
      // 3. Update Profile Document (if there's data to update)
      if (Object.keys(profileDataToUpdate).length > 0) {
        if (!DATABASE_ID || !PROFILE_COLLECTION_ID) {
          throw new Error("Appwrite Database/Collection IDs not configured.")
        }
        await databases.updateDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          currentUser.$id,
          profileDataToUpdate
        )
        console.log("Profile document updated successfully.")
      }

      // 4. Fetch updated user data to refresh Redux store
      // Combine auth data and potentially updated profile data
      const updatedAuthData = await account.get()
      let updatedProfileData = currentUser.profile // Assume profile hasn't changed unless updated
      if (Object.keys(profileDataToUpdate).length > 0) {
         // Refetch profile if it was updated
         try {
           updatedProfileData = await databases.getDocument(
             DATABASE_ID,
             PROFILE_COLLECTION_ID,
             updatedAuthData.$id
           )
         } catch (dbError) {
           console.error("Failed to refetch updated profile:", dbError)
           // Handle error - maybe keep old profile data or show specific error
         }
      }
       
      const fullUpdatedUserData = { 
         ...updatedAuthData, 
         profile: updatedProfileData 
      }

      // 5. Update Redux Store
      dispatch(setUser(fullUpdatedUserData))
      
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false) // Exit edit mode

    } catch (error) {
      console.error('Profile update failed:', error)
      let errorMsg = 'An unexpected error occurred while updating your profile.'
      if (error instanceof AppwriteException) {
        errorMsg = error.message || 'Failed to update profile. Please try again.'
      } else if (error instanceof Error) {
        errorMsg = error.message
      }
      setServerError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return <LoadingSpinner /> // Or a message indicating user not found
  }

  const userAvatar = currentUser.profile?.profileImage || 'https://via.placeholder.com/150' // Use placeholder if no image
  const joinDate = currentUser?.$createdAt ? new Date(currentUser.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {/* Server Messages */}
      {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img 
              src={userAvatar} 
              alt={currentUser.name} 
              className="w-40 h-40 rounded-full object-cover mb-4 bg-gray-200"
            />
            {!isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(true)
                  setServerError('') // Clear errors on entering edit mode
                  setSuccessMessage('')
                }}
                className="btn btn-primary w-full"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {/* Profile Details */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Validation Errors */}
                {Object.keys(errors).length > 0 && (
                   <Alert type="error" message={errors.name?.message || errors.email?.message || errors.phone?.message || errors.address?.message || errors.bio?.message} />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Read-only)</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')} // Register but make read-only
                      className="input bg-gray-100 cursor-not-allowed"
                      readOnly // Email change usually needs separate verification flow
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      id="address"
                      type="text"
                      {...register('address')}
                      className={`input ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="123 Main St, Anytown, USA"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    rows="4"
                    className={`input ${errors.bio ? 'border-red-500' : ''}`}
                    placeholder="Tell us a bit about yourself..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false)
                      reset() // Reset form changes on cancel
                      setServerError('')
                      setSuccessMessage('')
                    }}
                    className="btn btn-outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className={`btn btn-primary ${isLoading || !isDirty ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading || !isDirty} // Disable if loading or no changes made
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="text-base">{currentUser.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-base">{currentUser.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="text-base capitalize">{currentUser.profile?.role || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-base">{currentUser.profile?.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-base">{currentUser.profile?.address || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="text-base">{joinDate}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="text-base whitespace-pre-wrap">{currentUser.profile?.bio || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 