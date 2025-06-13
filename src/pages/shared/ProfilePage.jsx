import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { selectCurrentUser, setUser } from '../../store/authSlice'
import { account, databases, storage } from '../../lib/appwrite'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { AppwriteException, ID } from 'appwrite'
import defaultAvatar from '../../assets/user_person_black.jpg'

// Appwrite collection IDs from environment variables
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
const LAWYER_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LAWYER_DETAILS_COLLECTION_ID
const AVATAR_BUCKET_ID = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET_ID
const API_ENDPOINT = import.meta.env.VITE_APPWRITE_API_ENDPOINT

// Available specializations for lawyers
const specializations = [
  'Corporate Law',
  'Contract Law',
  'Intellectual Property',
  'Technology Law',
  'Real Estate',
  'Property Law',
  'Family Law',
  'Divorce',
  'Employment Law',
  'Labor Relations',
  'Criminal Defense',
  'Civil Rights',
  'Personal Injury',
  'Medical Malpractice',
  'Tax Law',
  'Immigration',
  'Environmental Law',
  'Bankruptcy'
]

// Zod schema for profile validation
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  // Lawyer specific fields
  specializations: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  yearsOfExperience: z.number().min(0).optional(),
  location: z.string().optional(),
  barId: z.string().optional(),
})

const ProfilePage = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const isLawyer = currentUser?.profile?.role === 'lawyer'
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [lawyerDetails, setLawyerDetails] = useState(null)

  // Avatar file state and preview
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.profile?.profileImage || '')

  // Fetch lawyer details if user is a lawyer
  useEffect(() => {
    const fetchLawyerDetails = async () => {
      if (isLawyer && currentUser?.$id) {
        try {
          const details = await databases.getDocument(
            DATABASE_ID,
            LAWYER_DETAILS_COLLECTION_ID,
            currentUser.$id
          )
          setLawyerDetails(details)
        } catch (error) {
          console.error('Error fetching lawyer details:', error)
        }
      }
    }
    fetchLawyerDetails()
  }, [isLawyer, currentUser?.$id])

  // Update preview when currentUser changes
  useEffect(() => {
    setAvatarPreview(currentUser?.profile?.profileImage || '')
  }, [currentUser?.profile?.profileImage])

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const defaultValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.profile?.phone || '',
    address: currentUser?.profile?.address || '',
    bio: currentUser?.profile?.bio || '',
    // Lawyer specific fields
    specializations: lawyerDetails?.specializations || [],
    hourlyRate: lawyerDetails?.hourlyRate || 0,
    yearsOfExperience: lawyerDetails?.yearsOfExperience || 0,
    location: lawyerDetails?.location || '',
    barId: lawyerDetails?.barId || '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  // Reset form when editing is cancelled or currentUser/lawyerDetails changes
  useEffect(() => {
    if (currentUser) {
      reset(defaultValues)
    }
  }, [currentUser, lawyerDetails, reset, isEditing])

  const onSubmit = async (data) => {
    if (!currentUser) return
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // 0. Upload new avatar if selected
      const profileDataToUpdate = {}
      const lawyerDataToUpdate = {
        email: currentUser.email // Always include email for lawyer details
      }
      
      if (avatarFile) {
        try {
          setUploadingAvatar(true)
          const fileId = ID.unique()
          const uploaded = await storage.createFile(
            AVATAR_BUCKET_ID,
            fileId,
            avatarFile
          )
          const imageUrl = `${API_ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${uploaded.$id}/view`
          profileDataToUpdate.profileImage = imageUrl
          lawyerDataToUpdate.profileImage = imageUrl // Update both collections
          console.log('Avatar uploaded:', imageUrl)
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError)
        } finally {
          setUploadingAvatar(false)
        }
      }

      // 1. Update name
      if (data.name !== currentUser.name) {
        await account.updateName(data.name)
        console.log("Name updated successfully.")
      }

      // 2. Prepare profile data for database update
      if (data.phone !== currentUser.profile?.phone) profileDataToUpdate.phone = data.phone
      if (data.address !== currentUser.profile?.address) profileDataToUpdate.address = data.address
      if (data.bio !== currentUser.profile?.bio) profileDataToUpdate.bio = data.bio

      // 3. Prepare lawyer-specific data if user is a lawyer
      if (isLawyer) {
        if (data.specializations !== lawyerDetails?.specializations) lawyerDataToUpdate.specializations = data.specializations
        if (data.hourlyRate !== lawyerDetails?.hourlyRate) lawyerDataToUpdate.hourlyRate = data.hourlyRate
        if (data.yearsOfExperience !== lawyerDetails?.yearsOfExperience) lawyerDataToUpdate.yearsOfExperience = data.yearsOfExperience
        if (data.location !== lawyerDetails?.location) lawyerDataToUpdate.location = data.location
        if (data.barId !== lawyerDetails?.barId) lawyerDataToUpdate.barId = data.barId
        if (data.phone !== lawyerDetails?.phone) lawyerDataToUpdate.phone = data.phone
        if (data.bio !== lawyerDetails?.bio) lawyerDataToUpdate.bio = data.bio
      }
      
      // 4. Update Profile Document
      if (Object.keys(profileDataToUpdate).length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          currentUser.$id,
          profileDataToUpdate
        )
        console.log("Profile document updated successfully.")
      }

      // 5. Update Lawyer Details Document if needed
      if (isLawyer) {
        await databases.updateDocument(
          DATABASE_ID,
          LAWYER_DETAILS_COLLECTION_ID,
          currentUser.$id,
          lawyerDataToUpdate
        )
        console.log("Lawyer details updated successfully.")
      }

      // 6. Fetch updated data
      const updatedAuthData = await account.get()
      let updatedProfileData = currentUser.profile
      let updatedLawyerData = lawyerDetails

      if (Object.keys(profileDataToUpdate).length > 0) {
        updatedProfileData = await databases.getDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          updatedAuthData.$id
        )
      }

      if (isLawyer && Object.keys(lawyerDataToUpdate).length > 0) {
        updatedLawyerData = await databases.getDocument(
          DATABASE_ID,
          LAWYER_DETAILS_COLLECTION_ID,
          updatedAuthData.$id
        )
      }

      // 7. Update Redux Store
      const fullUpdatedUserData = {
        ...updatedAuthData,
        profile: {
          ...updatedProfileData,
          ...(isLawyer && updatedLawyerData ? { lawyerDetails: updatedLawyerData } : {})
        }
      }
      dispatch(setUser(fullUpdatedUserData))
      
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)

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
    return <LoadingSpinner />
  }

  const userAvatar = currentUser.profile?.profileImage || defaultAvatar
  const joinDate = currentUser?.$createdAt ? new Date(currentUser.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section - Unchanged */}
          <div className="flex flex-col items-center">
            <img 
              src={avatarPreview || userAvatar}
              alt={currentUser.name} 
              className="w-40 h-40 rounded-full object-cover mb-4 bg-gray-200"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2"
              />
            )}
            {!isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(true)
                  setServerError('')
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
                {Object.keys(errors).length > 0 && (
                  <Alert type="error" message={Object.values(errors).map(e => e.message).join(', ')} />
                )}
                
                {/* Basic Information */}
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
                      {...register('email')}
                      className="input bg-gray-100 cursor-not-allowed"
                      readOnly
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

                {/* Lawyer Specific Fields */}
                {isLawyer && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {specializations.map((spec) => (
                          <label key={spec} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={spec}
                              {...register('specializations')}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                        <input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('hourlyRate', { valueAsNumber: true })}
                          className={`input ${errors.hourlyRate ? 'border-red-500' : ''}`}
                        />
                      </div>

                      <div>
                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          {...register('yearsOfExperience', { valueAsNumber: true })}
                          className={`input ${errors.yearsOfExperience ? 'border-red-500' : ''}`}
                        />
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          id="location"
                          type="text"
                          {...register('location')}
                          className={`input ${errors.location ? 'border-red-500' : ''}`}
                          placeholder="City, State"
                        />
                      </div>

                      <div>
                        <label htmlFor="barId" className="block text-sm font-medium text-gray-700 mb-1">Bar ID</label>
                        <input
                          id="barId"
                          type="text"
                          {...register('barId')}
                          className={`input ${errors.barId ? 'border-red-500' : ''}`}
                          placeholder="Bar Association ID"
                        />
                      </div>
                    </div>
                  </>
                )}
                
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
                      reset()
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
                    disabled={isLoading || !isDirty}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Basic Information Display */}
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

                {/* Lawyer Specific Information Display */}
                {isLawyer && lawyerDetails && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Specializations</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {lawyerDetails.specializations?.map((spec) => (
                            <span key={spec} className="badge bg-primary/10 text-primary">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Hourly Rate</h4>
                        <p className="text-base">${lawyerDetails.hourlyRate || 0}/hr</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Years of Experience</h4>
                        <p className="text-base">{lawyerDetails.yearsOfExperience || 0} years</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p className="text-base">{lawyerDetails.location || 'Not specified'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Bar ID</h4>
                        <p className="text-base">{lawyerDetails.barId || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
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