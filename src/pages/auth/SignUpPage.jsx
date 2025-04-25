import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Step components for multi-step form
const RoleSelectionStep = ({ 
  selectedRole, 
  setSelectedRole, 
  nextStep 
}: { 
  selectedRole: string | null; 
  setSelectedRole: (role: string) => void; 
  nextStep: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Join VeraLex</h1>
        <p className="text-gray-600 mt-2">Select your role to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setSelectedRole('client')}
          className={`border-2 rounded-xl p-6 text-left transition-all ${
            selectedRole === 'client'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              selectedRole === 'client' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-900">I'm a Client</h3>
              <p className="text-gray-500 text-sm mt-1">Looking for legal representation</p>
              
              <ul className="mt-3 space-y-1">
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Post legal cases
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Review lawyer applications
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Manage your legal cases
                </li>
              </ul>
            </div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => setSelectedRole('lawyer')}
          className={`border-2 rounded-xl p-6 text-left transition-all ${
            selectedRole === 'lawyer'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              selectedRole === 'lawyer' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-900">I'm a Lawyer</h3>
              <p className="text-gray-500 text-sm mt-1">Looking for clients</p>
              
              <ul className="mt-3 space-y-1">
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Browse available cases
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply to cases
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Get reviews & build reputation
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
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
}: { 
  formData: { firstName: string; lastName: string; email: string; password: string; };
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
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
}: { 
  formData: { barId: string; specializations: string[]; };
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [error, setError] = useState('')
  const specializations = [
    'Criminal Defense', 'Family Law', 'Corporate Law', 'Intellectual Property',
    'Immigration Law', 'Personal Injury', 'Tax Law', 'Employment Law',
    'Environmental Law', 'Real Estate Law'
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
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
  
  const toggleSpecialization = (specialization: string) => {
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
}: { 
  formData: { caseTypes: string[]; location: string; };
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [error, setError] = useState('')
  const caseTypes = [
    'Criminal', 'Civil Litigation', 'Family', 'Corporate', 
    'Intellectual Property', 'Immigration', 'Personal Injury', 
    'Tax', 'Employment', 'Real Estate'
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
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
  
  const toggleCaseType = (caseType: string) => {
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
}: { 
  formData: any;
  role: string | null;
  prevStep: () => void;
  handleSubmit: () => void;
  isLoading: boolean;
}) => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Almost Done!</h1>
        <p className="text-gray-600 mt-2">Please review your information</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Account Information</h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{formData.firstName} {formData.lastName}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{formData.email}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Account Type</p>
            <p className="mt-1 capitalize">{role}</p>
          </div>
          
          {role === 'lawyer' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">Bar Association ID</p>
                <p className="mt-1">{formData.barId}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Specializations</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {formData.specializations.map((spec: string) => (
                    <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {role === 'client' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1">{formData.location}</p>
              </div>
              
              {formData.caseTypes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Interested Case Types</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.caseTypes.map((type: string) => (
                      <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
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
  const [role, setRole] = useState<string | null>(null)
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