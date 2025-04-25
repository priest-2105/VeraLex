import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'


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
            <p className="text-gray-600">I need to connect with a lawyer for legal services</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Lawyer</h3>
            <p className="text-gray-600">I am a legal professional looking to offer services</p>
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

const BasicInfoStep = ({ 
  formData, 
  setFormData, 
  nextStep, 
  prevStep 
}) => {
  const [error, setError] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    
    // Clear error and proceed
    setError('')
    nextStep()
  }
  
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Basic Information</h1>
        <p className="text-gray-600 mt-2">Tell us a bit about yourself</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="input"
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
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="input"
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary py-2 px-6"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

const LawyerDetailsStep = ({ 
  formData, 
  setFormData, 
  nextStep, 
  prevStep 
}) => {
  const [error, setError] = useState('')
  const specializations = [
    'Criminal Defense', 'Family Law', 'Corporate Law', 'Intellectual Property',
    'Immigration Law', 'Personal Injury', 'Tax Law', 'Employment Law',
    'Environmental Law', 'Real Estate Law'
  ]
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.barId) {
      setError('Bar Association ID is required')
      return
    }
    
    if (formData.specializations.length === 0) {
      setError('Please select at least one specialization')
      return
    }
    
    // Clear error and proceed
    setError('')
    nextStep()
  }
  
  const toggleSpecialization = (specialization) => {
    if (formData.specializations.includes(specialization)) {
      setFormData({
        ...formData,
        specializations: formData.specializations.filter(item => item !== specialization)
      })
    } else {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, specialization]
      })
    }
  }
  
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lawyer Details</h1>
        <p className="text-gray-600 mt-2">Tell us about your legal practice</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="barId" className="block text-sm font-medium text-gray-700 mb-1">
            Bar Association ID
          </label>
          <input
            id="barId"
            type="text"
            value={formData.barId}
            onChange={(e) => setFormData({ ...formData, barId: e.target.value })}
            className="input"
            placeholder="e.g. 123456-NY"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your ID will be verified before you can apply to cases
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specializations
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select all that apply to your practice
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {specializations.map((specialization) => (
              <div key={specialization} className="flex items-center">
                <input
                  id={`specialization-${specialization}`}
                  type="checkbox"
                  checked={formData.specializations.includes(specialization)}
                  onChange={() => toggleSpecialization(specialization)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor={`specialization-${specialization}`} className="ml-2 block text-sm text-gray-700">
                  {specialization}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary py-2 px-6"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

const ClientPreferencesStep = ({ 
  formData, 
  setFormData, 
  nextStep, 
  prevStep 
}) => {
  const [error, setError] = useState('')
  const caseTypes = [
    'Criminal', 'Civil Litigation', 'Family', 'Corporate', 
    'Intellectual Property', 'Immigration', 'Personal Injury', 
    'Tax', 'Employment', 'Real Estate'
  ]
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.location) {
      setError('Location is required')
      return
    }
    
    // Clear error and proceed
    setError('')
    nextStep()
  }
  
  const toggleCaseType = (caseType) => {
    if (formData.caseTypes.includes(caseType)) {
      setFormData({
        ...formData,
        caseTypes: formData.caseTypes.filter(item => item !== caseType)
      })
    } else {
      setFormData({
        ...formData,
        caseTypes: [...formData.caseTypes, caseType]
      })
    }
  }
  
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Preferences</h1>
        <p className="text-gray-600 mt-2">Help us match you with the right lawyers</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Your Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="input"
            placeholder="City, State"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Types You're Interested In
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select all that might apply (optional)
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {caseTypes.map((caseType) => (
              <div key={caseType} className="flex items-center">
                <input
                  id={`caseType-${caseType}`}
                  type="checkbox"
                  checked={formData.caseTypes.includes(caseType)}
                  onChange={() => toggleCaseType(caseType)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor={`caseType-${caseType}`} className="ml-2 block text-sm text-gray-700">
                  {caseType}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary py-2 px-6"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

const ConfirmationStep = ({ 
  formData, 
  role, 
  prevStep, 
  handleSubmit, 
  isLoading 
}) => {
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
            <div>
              <p className="text-sm font-medium text-gray-500">First Name</p>
              <p className="mt-1">{formData.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Name</p>
              <p className="mt-1">{formData.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Type</p>
              <p className="mt-1 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </div>
      
      {role === 'lawyer' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium">Lawyer Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Bar ID/License Number</p>
                <p className="mt-1">{formData.barId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Specializations</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {formData.specializations.map((spec) => (
                    <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {role === 'client' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium">Client Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1">{formData.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Interested Case Types</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {formData.caseTypes.map((type) => (
                    <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`btn btn-primary py-2 px-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </div>
  )
}

const SignUpPage = () => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  // Form state for basic info (shared between client and lawyer)
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  
  // Form state for lawyer-specific details
  const [lawyerDetails, setLawyerDetails] = useState({
    barId: '',
    specializations: []
  })
  
  // Form state for client-specific preferences
  const [clientPreferences, setClientPreferences] = useState({
    location: '',
    caseTypes: []
  })
  
  const nextStep = () => {
    setStep(step + 1)
  }
  
  const prevStep = () => {
    setStep(step - 1)
  }
  
  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Here you would implement actual registration logic
      // For now we'll just simulate a successful registration after a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demonstration, we'll redirect based on role
      if (role === 'lawyer') {
        navigate('/lawyer/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Combine all form data for the confirmation step
  const allFormData = {
    ...basicInfo,
    ...(role === 'lawyer' ? lawyerDetails : {}),
    ...(role === 'client' ? clientPreferences : {})
  }
  
  return (
    <div className="max-w-md mx-auto">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {stepNumber === 1 && 'Role'}
                {stepNumber === 2 && 'Info'}
                {stepNumber === 3 && 'Details'}
                {stepNumber === 4 && 'Confirm'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex justify-between mt-1">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200"></div>
          <div className={`absolute left-0 top-1/2 h-0.5 bg-primary transition-all duration-300`} style={{ width: `${(step - 1) * 33.33}%` }}></div>
        </div>
      </div>
      
      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <RoleSelectionStep
              selectedRole={role}
              setSelectedRole={setRole}
              nextStep={nextStep}
            />
          )}
          
          {step === 2 && (
            <BasicInfoStep
              formData={basicInfo}
              setFormData={setBasicInfo}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {step === 3 && role === 'lawyer' && (
            <LawyerDetailsStep
              formData={lawyerDetails}
              setFormData={setLawyerDetails}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {step === 3 && role === 'client' && (
            <ClientPreferencesStep
              formData={clientPreferences}
              setFormData={setClientPreferences}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {step === 4 && (
            <ConfirmationStep
              formData={allFormData}
              role={role}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Already have an account */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default SignUpPage 