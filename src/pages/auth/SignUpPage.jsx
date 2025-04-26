// export default SignUpPage 
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { account, databases } from '../../lib/appwrite'
import { AppwriteException } from 'appwrite'

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
  const { register, handleSubmit, formState: { errors } } = useFormContext()

  const onSubmit = (data) => {
    console.log("Basic Info Data Validated:", data)
    nextStep()
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Basic Information</h1>
        <p className="text-gray-600 mt-2">Tell us a bit about yourself</p>
      </div>

      {Object.keys(errors).length > 0 && !errors.barId && !errors.specializations && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {errors.firstName?.message || errors.lastName?.message || errors.email?.message || errors.password?.message || "Please fix the errors above"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
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
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
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
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900">
            Back
          </button>
          <button type="submit" className="btn btn-primary py-2 px-6">
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

const LawyerDetailsStep = ({ nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useFormContext()
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

  const onSubmit = (data) => {
    console.log("Lawyer Details Data Validated:", data)
    nextStep()
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lawyer Details</h1>
        <p className="text-gray-600 mt-2">Tell us about your legal practice</p>
      </div>

      {(errors.barId || errors.specializations) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {errors.barId?.message || errors.specializations?.message || "Please fix the errors above"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          {errors.barId && <p className="text-red-500 text-xs mt-1">{errors.barId.message}</p>}
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
          {errors.specializations && <p className="text-red-500 text-xs mt-1">{errors.specializations.message}</p>}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900">Back</button>
          <button type="submit" className="btn btn-primary py-2 px-6">Continue</button>
        </div>
      </form>
    </div>
  )
}

const ConfirmationStep = ({ role, prevStep, isLoading }) => {
  const { getValues } = useFormContext()
  const formData = getValues()
  
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold">Review Your Information</h2>
        <p className="text-gray-600 mt-1">Please review your information before submitting</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-sm font-medium text-gray-500">First Name</p><p className="mt-1">{formData.firstName}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Last Name</p><p className="mt-1">{formData.lastName}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Email</p><p className="mt-1">{formData.email}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Account Type</p><p className="mt-1 capitalize">{role}</p></div>
          </div>
        </div>
      </div>
      
      {role === 'lawyer' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="text-lg font-medium">Lawyer Information</h3></div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm font-medium text-gray-500">Bar ID/License Number</p><p className="mt-1">{formData.barId}</p></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Specializations</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {formData.specializations?.map((spec) => (
                    <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-900" disabled={isLoading}>Back</button>
        <button type="submit" disabled={isLoading} className={`btn btn-primary py-2 px-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Creating Account...
            </div>
          ) : ( 'Create Account' )}
        </button>
      </div>
    </div>
  )
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const currentSchema = selectedRole === 'lawyer' ? lawyerSchema : clientSchema

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(currentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      barId: '',
      specializations: [],
    }
  })

  useEffect(() => {
    if (selectedRole === 'client') {
      methods.resetField('barId')
      methods.resetField('specializations')
    }
  }, [selectedRole, methods])

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleFinalSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    console.log("Submitting Final Form Data:", data)
    
    if (!selectedRole) {
      setServerError("Please select a role first.")
      setStep(1)
      setIsLoading(false)
      return
    }

    try {
      const name = `${data.firstName} ${data.lastName}`
      const createdAccount = await account.create('unique()', data.email, data.password, name)
      const userId = createdAccount.$id
      
      console.log('Appwrite account created:', userId)

      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
      const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID

      if (!DATABASE_ID || !PROFILE_COLLECTION_ID) {
        throw new Error("Appwrite Database/Collection IDs not configured in environment variables (VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_PROFILE_COLLECTION_ID)")
      }

      const profileData = {
        userId: userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: selectedRole,
        ...(selectedRole === 'lawyer' && {
          barId: data.barId,
          specializations: data.specializations
        }),
      }

      await databases.createDocument(
        DATABASE_ID,
        PROFILE_COLLECTION_ID,
        userId,
        profileData
      )
      console.log('User profile created in database.')

      navigate('/login?signup=success')

    } catch (error) {
      console.error('Signup Process Failed:', error)
      if (error instanceof AppwriteException) {
        if (error.code === 409) {
          setServerError('An account with this email already exists. Please try logging in.')
          methods.resetField('password')
          setStep(2)
        } else {
          setServerError(error.message || 'An error occurred during signup.')
        }
      } else {
        setServerError('An unexpected error occurred. Please try again.')
      }
      setStep(4)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    const finalStepNumber = selectedRole === 'lawyer' ? 4 : 3
    switch (step) {
      case 1:
        return <RoleSelectionStep selectedRole={selectedRole} setSelectedRole={setSelectedRole} nextStep={nextStep} />
      case 2:
        return <BasicInfoStep nextStep={nextStep} prevStep={prevStep} />
      case 3:
        if (selectedRole === 'lawyer') {
          return <LawyerDetailsStep nextStep={nextStep} prevStep={prevStep} />
        } else {
          return <ConfirmationStep role={selectedRole} prevStep={prevStep} isLoading={isLoading} />
        }
      case 4:
        return <ConfirmationStep role={selectedRole} prevStep={prevStep} isLoading={isLoading} />
      default:
        return <RoleSelectionStep selectedRole={selectedRole} setSelectedRole={setSelectedRole} nextStep={nextStep} />
    }
  }

  const finalStepNumber = selectedRole === 'lawyer' ? 4 : 3

  return (
    <div className="max-w-md mx-auto p-4 md:p-8">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFinalSubmit)}>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500' }`}>
                    {stepNumber}
                  </div>
                  <div className="text-xs mt-1 text-gray-500 text-center">
                    {stepNumber === 1 && 'Role'}
                    {stepNumber === 2 && 'Info'}
                    {stepNumber === 3 && (selectedRole === 'lawyer' ? 'Details' : 'Confirm')}
                    {stepNumber === 4 && 'Confirm'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-1">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
              <div className={`absolute left-0 top-1/2 h-0.5 bg-primary transition-all duration-300`} style={{ width: `${((step > finalStepNumber ? finalStepNumber : step) - 1) / (finalStepNumber - 1) * 100}%` }}></div>
            </div>
          </div>

          {serverError && step === finalStepNumber && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Signup Failed: </strong>
              <span className="block sm:inline">{serverError}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default SignUpPage 