// export default SignUpPage 
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { account, databases } from '../../lib/appwrite'
import { AppwriteException, ID } from 'appwrite'
import Alert from '../../components/common/Alert'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '../../store/authSlice'

// Define Zod Schema for validation
const baseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Extend base schema for lawyer specific fields
const lawyerSchema = baseSchema.extend({
  barId: z.string().min(1, 'Bar Association ID is required'),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization'),
})

// Extend base schema for client specific fields (if any needed beyond base)
const clientSchema = baseSchema.extend({
  // Add any client-specific required fields here if needed
  // preferredCaseTypes: z.array(z.string()).optional(), // Example if needed
})

const RoleSelectionStep = ({ 
  selectedRole, 
  setSelectedRole, 
  nextStep 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">I am a...</h2>
        <p className="text-gray-600 mt-2">Select your role to continue</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`border rounded-lg p-6 cursor-pointer hover:border-primary ${
            selectedRole === 'client' ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onClick={() => setSelectedRole('client')}
        >
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Client</h3>
            <p className="text-gray-600 text-sm">I need to connect with a lawyer for legal services</p>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-6 cursor-pointer hover:border-primary ${
            selectedRole === 'lawyer' ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onClick={() => setSelectedRole('lawyer')}
        >
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Lawyer</h3>
            <p className="text-gray-600 text-sm">I am a legal professional looking to offer services</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button 
          onClick={nextStep} 
          disabled={!selectedRole}
          className={`btn btn-primary py-2 px-6 ${!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

const BasicInfoStep = ({ nextStep, prevStep }) => {
  const { register, formState: { errors }, trigger } = useFormContext()

  const handleContinue = async () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password']
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      console.log("Basic Info Step Validated")
      nextStep()
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Basic Information</h1>
        <p className="text-gray-600 mt-2">Tell us a bit about yourself</p>
      </div>

      {Object.keys(errors).length > 0 && (errors.firstName || errors.lastName || errors.email || errors.password) && (
        <Alert type="error" message={errors.firstName?.message || errors.lastName?.message || errors.email?.message || errors.password?.message || "Please fix the errors above"} />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className={`input ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className={`input ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900">
            Back
          </button>
          <button type="button" onClick={handleContinue} className="btn btn-primary py-2 px-6">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

const LawyerDetailsStep = ({ nextStep, prevStep }) => {
  const { register, formState: { errors }, watch, setValue, trigger } = useFormContext()
  const specializationsList = [
    'Criminal Defense', 'Family Law', 'Corporate Law', 'Intellectual Property',
    'Immigration Law', 'Personal Injury', 'Tax Law', 'Employment Law',
    'Environmental Law', 'Real Estate Law', 'Bankruptcy Law', 'Estate Planning'
  ]
  const selectedSpecializations = watch('specializations') || []

  const toggleSpecialization = (specialization) => {
    const updated = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter(item => item !== specialization)
      : [...selectedSpecializations, specialization]
    setValue('specializations', updated, { shouldValidate: true, shouldDirty: true })
  }

  const handleContinue = async () => {
    const fieldsToValidate = ['barId', 'specializations']
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      console.log("Lawyer Details Step Validated")
      nextStep()
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lawyer Details</h1>
        <p className="text-gray-600 mt-2">Tell us about your legal practice</p>
      </div>

      {(errors.barId || errors.specializations) && (
        <Alert type="error" message={errors.barId?.message || errors.specializations?.message || "Please fix the errors above"} />
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="barId" className="block text-sm font-medium text-gray-700 mb-1">
            Bar Association ID / Number
          </label>
          <input
            id="barId"
            type="text"
            {...register('barId')}
            className={`input ${errors.barId ? 'border-red-500' : ''}`}
            placeholder="e.g., NY1234567"
          />
          <p className="text-xs text-gray-500 mt-1">Your ID will be verified before you can apply to cases</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Specializations <span className="text-gray-500">(Select at least one)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specializationsList.map((spec) => (
              <button
                type="button"
                key={spec}
                onClick={() => toggleSpecialization(spec)}
                className={`p-3 border rounded-md text-sm text-center transition-colors ${
                  selectedSpecializations.includes(spec)
                    ? 'bg-primary/10 border-primary text-primary font-medium ring-2 ring-primary/50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900">Back</button>
          <button type="button" onClick={handleContinue} className="btn btn-primary py-2 px-6">Continue</button>
        </div>
      </div>
    </div>
  )
}

const ConfirmationStep = ({ role, prevStep, isLoading }) => {
  const { getValues } = useFormContext()
  const formData = getValues()
  
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Confirm Details</h1>
        <p className="text-gray-600 mt-2">Please review your information before creating your account.</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3 text-sm">
        <p><strong>Role:</strong> <span className="capitalize">{role}</span></p>
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        {role === 'lawyer' && (
          <>
            <p><strong>Bar ID:</strong> {formData.barId}</p>
            <p><strong>Specializations:</strong> {formData.specializations?.join(', ') || 'None selected'}</p>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-6">
        <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900" disabled={isLoading}>
          Back
        </button>
        <button 
          type="submit" 
          className={`btn btn-primary py-2 px-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
             <div className="flex items-center justify-center">
               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Creating Account...
             </div>
           ) : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const currentSchema = selectedRole === 'lawyer' ? lawyerSchema : clientSchema
  const methods = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onTouched', // Validate on blur
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      // Lawyer specific
      barId: '',
      specializations: [],
    }
  })

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleFinalSubmit = async (data) => {
    setServerError('')
    setIsLoading(true)
    console.log('Submitting final data:', data)

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
    const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
    const LAWYER_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LAWYER_DETAILS_COLLECTION_ID || '680ebc0b0032f06423db'
    const CLIENT_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLIENT_DETAILS_COLLECTION_ID || '680ebbd4000f3c29edf1'

    if (!DATABASE_ID || !PROFILE_COLLECTION_ID) {
      setServerError("Appwrite Database/Collection IDs not configured in .env")
      setIsLoading(false)
      return
    }

    let createdUser = null // Store created user to delete if profile creation fails
    try {
      // 1. Create Appwrite User Account
      const userFullName = `${data.firstName} ${data.lastName}`.trim()
      createdUser = await account.create(
        ID.unique(), // Generate unique ID
        data.email,
        data.password,
        userFullName
      )
      console.log('Appwrite user created:', createdUser)

      // 2. Create Profile Document in Database
      const profileData = {
        userId: createdUser.$id,
        role: selectedRole,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: '',
        address: '',
        bio: '',
        profileImage: ''
      }

      await databases.createDocument(
        DATABASE_ID,
        PROFILE_COLLECTION_ID,
        createdUser.$id, // Use the user ID as the document ID for easy linking
        profileData
      )
      console.log('Profile document created.')

      // 2b. Create details document based on role
      if (selectedRole === 'lawyer') {
        const lawyerDetails = {
          userId: createdUser.$id,
          barId: data.barId,
          specializations: data.specializations,
          isVerified: false
        }
        await databases.createDocument(
          DATABASE_ID,
          LAWYER_DETAILS_COLLECTION_ID,
          createdUser.$id,
          lawyerDetails
        )
        console.log('Lawyer details document created.')
      } else if (selectedRole === 'client') {
        const clientDetails = { userId: createdUser.$id }
        await databases.createDocument(
          DATABASE_ID,
          CLIENT_DETAILS_COLLECTION_ID,
          createdUser.$id,
          clientDetails
        )
        console.log('Client details document created.')
      }

      // 3. Create a session for the new user so we can send a verification email
      await account.createEmailPasswordSession(data.email, data.password)
      console.log('User session created for verification.');
      // 4. Send Verification Email
      // Use your frontend URL where the verification page will live
      const verificationUrl = `${window.location.origin}/auth/verify-email`
      console.log(`Requesting email verification with URL: ${verificationUrl}`)
      await account.createVerification(verificationUrl)
      console.log('Verification email request sent.')

      // 5. Redirect to Check Email Page
      // Optionally pass email in state to display on the check email page
      navigate('/auth/check-email', { state: { email: data.email } })

      // Optional: Login user immediately (requires authSlice/setUser)
      // If implementing immediate login, ensure verification is still handled.
      // Maybe show a banner "Please verify your email" in the dashboard.
      // const session = await account.createEmailPasswordSession(data.email, data.password)
      // const loggedInUserData = await account.get()
      // const fullUserData = { ...loggedInUserData, profile: profileData } // Combine
      // dispatch(setUser(fullUserData))
      // navigate(`/${selectedRole}/dashboard`)

    } catch (error) {
      console.error('Signup failed:', error)
      let errorMsg = 'An unexpected error occurred during signup.'
      if (error instanceof AppwriteException) {
        if (error.code === 409) { // Conflict - User already exists
           errorMsg = 'An account with this email already exists. Please sign in.'
        } else if (error.code === 400 && error.message.includes('Password')) {
          errorMsg = 'Password is too weak. Please choose a stronger one.'
        } else {
          errorMsg = error.message || 'Signup failed. Please try again.'
        }
      } else if (error instanceof Error) {
        errorMsg = error.message
      }
      setServerError(errorMsg)
      
      // Rollback: Delete user if profile creation failed (optional but good practice)
      if (createdUser && error.message.includes('profile')) { // Check if error was during profile step
        try {
          await account.delete(createdUser.$id); 
          console.log('Rolled back user creation due to profile error.')
        } catch (deleteError) {
          console.error('Failed to rollback user creation:', deleteError)
          // Log this issue, as we might have an orphaned user account
        }
      }

    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <RoleSelectionStep selectedRole={selectedRole} setSelectedRole={setSelectedRole} nextStep={nextStep} />
      case 2:
        return <BasicInfoStep nextStep={nextStep} prevStep={prevStep} />
      case 3:
        if (selectedRole === 'lawyer') {
          return <LawyerDetailsStep nextStep={nextStep} prevStep={prevStep} />
        } else {
          // If client has no extra step, skip to confirmation
          return <ConfirmationStep role={selectedRole} prevStep={prevStep} isLoading={isLoading} />
        }
      case 4: // Confirmation Step (only reached if lawyer step exists)
         return <ConfirmationStep role={selectedRole} prevStep={prevStep} isLoading={isLoading} />
      default:
        return <div>Unknown Step</div>
    }
  }
  
  // Determine which step is the final data input step before confirmation
  const lastInputStep = selectedRole === 'lawyer' ? 3 : 2
  // Determine which step is the confirmation step
  const confirmationStepNumber = selectedRole === 'lawyer' ? 4 : 3

  return (
    <div className="max-w-md mx-auto p-4 md:p-8">
      <FormProvider {...methods}>
        <motion.div
          key={step} // Trigger animation on step change
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Display Server Errors */}
          {serverError && <Alert type="error" message={serverError} onClose={() => setServerError('')} className="mb-4" />}
          
          {/* Use RHF handleSubmit for the final step */} 
          <form onSubmit={methods.handleSubmit(handleFinalSubmit)}>
            {renderStep()}
            {/* Submit button is rendered within the ConfirmationStep */} 
          </form>
        </motion.div>
        
        {step > 1 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </FormProvider>
    </div>
  )
}

export default SignUpPage 