import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { databases, storage } from '../../lib/appwrite'
import { ID, Query } from 'appwrite'
import { selectCurrentUser } from '../../store/authSlice'
import Alert from '../../components/common/Alert'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID
const CASE_DOCUMENTS_BUCKET_ID = import.meta.env.VITE_APPWRITE_CASE_DOCUMENTS_BUCKET_ID
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID

const CreateCasePage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: '',
    role: '',
    budget: '',
    documents: [],
    deadline: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documents: [...e.target.files] }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setIsLoading(true)
    
    try {
      if (!currentUser?.$id) {
        throw new Error('You must be logged in to create a case')
      }

      const now = new Date().toISOString()

      // 1. Upload documents if any
      const uploadedDocumentIds = []
      if (formData.documents.length > 0) {
        for (const file of formData.documents) {
          const fileId = ID.unique()
          await storage.createFile(
            CASE_DOCUMENTS_BUCKET_ID,
            fileId,
            file
          )
          uploadedDocumentIds.push(fileId)
        }
      }

      // 2. Create main case document
      const caseData = {
        userId: currentUser.$id,
        title: formData.title,
        description: formData.description,
        caseType: formData.caseType,
        role: formData.role,
        budget: parseFloat(formData.budget),
        status: 'pending',
        createdAt: now,
        updatedAt: now
      }

      const createdCase = await databases.createDocument(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        ID.unique(),
        caseData
      )

      // Create initial timeline event
      const initialTimelineEvent = JSON.stringify({
        id: ID.unique(),
        action: 'Case created',
        actor: currentUser.$id,
        actorRole: 'client',
        timestamp: now
      })

      // 3. Create case details document
      const caseDetailsData = {
        caseId: createdCase.$id,
        deadline: formData.deadline,
        documents: uploadedDocumentIds,
        lawyerId: null,
        lawyerAssigned: null,
        lawyerRequests: [],
        applications: [],
        notes: '',
        lastUpdated: now,
        timeline: [initialTimelineEvent],
        messages: []
      }

      await databases.createDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        ID.unique(),
        caseDetailsData
      )

      // 4. Create or update notification document
      const newNotification = JSON.stringify({
        id: ID.unique(),
        type: 'case_created',
        message: `Your case "${formData.title}" has been created successfully`,
        caseId: createdCase.$id,
        timestamp: now,
        read: false,
        url: `/client/case/${createdCase.$id}`
      })

      // Check if user already has a notification document
      const existingNotifications = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      )

      if (existingNotifications.documents.length > 0) {
        // Update existing notification document
        const notificationDoc = existingNotifications.documents[0]
        const currentNotifications = notificationDoc.notifications || []
        
        await databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          notificationDoc.$id,
          {
            notifications: [...currentNotifications, newNotification],
            unreadCount: (notificationDoc.unreadCount || 0) + 1,
            lastUpdated: now
          }
        )
      } else {
        // Create new notification document
        await databases.createDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            userId: currentUser.$id,
            notifications: [newNotification],
            unreadCount: 1,
            lastUpdated: now,
            lastRead: null
          }
        )
      }

      // 5. Redirect to the case detail page
      navigate(`/client/case/${createdCase.$id}`)
    } catch (error) {
      console.error('Error creating case:', error)
      setServerError(error.message || 'Failed to create case. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Case type options
  const caseTypes = [
    'Corporate Law',
    'Criminal Defense',
    'Family Law',
    'Immigration',
    'Intellectual Property',
    'Personal Injury',
    'Real Estate',
    'Tax Law',
    'Employment Law',
    'Other'
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Case</h1>
      
      {/* Server Error Alert */}
      {serverError && (
        <Alert 
          type="error" 
          message={serverError} 
          onClose={() => setServerError('')} 
          className="mb-6"
        />
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white mb-2 ${
                  step >= item ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                {item}
              </div>
              <div className="text-sm text-gray-600">
                {item === 1 ? 'Basic Info' : item === 2 ? 'Details' : 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-4 mb-8 relative">
          <div 
            className="absolute h-1 bg-primary transition-all" 
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Basic Case Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Contract Dispute with Service Provider"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Type
                </label>
                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a case type</option>
                  {caseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-md p-4 cursor-pointer hover:border-primary ${
                      formData.role === 'plaintiff' ? 'border-primary bg-primary/5' : 'border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'plaintiff' }))}
                  >
                    <div className="font-medium mb-1">Plaintiff</div>
                    <div className="text-sm text-gray-600">I'm initiating a legal action</div>
                  </div>
                  <div 
                    className={`border rounded-md p-4 cursor-pointer hover:border-primary ${
                      formData.role === 'defendant' ? 'border-primary bg-primary/5' : 'border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'defendant' }))}
                  >
                    <div className="font-medium mb-1">Defendant</div>
                    <div className="text-sm text-gray-600">I'm responding to a legal action</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.title || !formData.caseType || !formData.role}
                  className={`btn btn-primary ${
                    !formData.title || !formData.caseType || !formData.role ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Step 2: Case Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Case Details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Provide details about your case..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your budget"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer text-primary hover:text-primary/80"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-10 w-10 mx-auto text-gray-400 mb-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop files
                    </span>
                  </label>
                  {formData.documents.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm font-medium mb-2">{formData.documents.length} file(s) selected:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {Array.from(formData.documents).map((file, index) => (
                          <li key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.description || !formData.budget || !formData.deadline}
                  className={`btn btn-primary ${
                    !formData.description || !formData.budget || !formData.deadline ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Review Your Case</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Case Title</h3>
                  <p className="mt-1">{formData.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Case Type</h3>
                  <p className="mt-1">{formData.caseType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Your Role</h3>
                  <p className="mt-1 capitalize">{formData.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p className="mt-1">${formData.budget}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                  <p className="mt-1">{new Date(formData.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Documents</h3>
                  <p className="mt-1">{formData.documents.length} file(s)</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Case Description</h3>
                <p className="mt-1 text-gray-800 whitespace-pre-line">{formData.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-6">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong>What happens next?</strong>
                      <p className="mt-1">
                        Your case will be posted to our marketplace. Qualified lawyers will be able to
                        view your case details and submit applications to represent you. You'll be notified
                        when you receive applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`btn btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Case...
                    </div>
                  ) : (
                    'Submit Case'
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CreateCasePage 