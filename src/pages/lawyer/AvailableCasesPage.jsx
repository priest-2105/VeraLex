import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { databases } from '../../lib/appwrite'
import { Query, ID } from 'appwrite'
import { selectCurrentUser } from '../../store/authSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID

// Case types for filtering
const caseTypes = [
  'All Types',
  'Corporate Law',
  'Intellectual Property',
  'Employment Law',
  'Technology Law',
  'Contract Law',
  'Family Law',
  'Real Estate Law',
  'Immigration Law',
  'Criminal Defense',
  'Tax Law'
]

// Available roles for filtering
const availableRoles = ['All Roles', 'Plaintiff', 'Defendant']

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const AvailableCasesPage = () => {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [casesWithStatus, setCasesWithStatus] = useState([])
  const [selectedType, setSelectedType] = useState('All Types')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('recent') // 'recent' or 'oldest'
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationModal, setApplicationModal] = useState({ isOpen: false, caseId: null })
  const [applicationMessage, setApplicationMessage] = useState('')
  const currentUser = useSelector(selectCurrentUser)

  // Fetch available cases
  useEffect(() => {
    const fetchCases = async () => {
      if (!currentUser?.$id) {
        setError('You must be logged in to view available cases')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // Fetch active cases
        const activeCasesResponse = await databases.listDocuments(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          [
            Query.equal('status', 'pending'),
            Query.orderDesc('createdAt')
          ]
        )

        const mappedCases = activeCasesResponse.documents.map(caseDoc => ({
          id: caseDoc.$id,
          title: caseDoc.title,
          description: caseDoc.description,
          type: caseDoc.caseType,
          budget: caseDoc.budget,
          role: caseDoc.role,
          status: caseDoc.status,
          postedAt: caseDoc.createdAt,
          updatedAt: caseDoc.updatedAt,
          userId: caseDoc.userId
        }))

        setCases(mappedCases)

        // Fetch case details for each case to check if the current user has applied
        const detailsResponses = await Promise.all(
          mappedCases.map(c =>
            databases.listDocuments(
              DATABASE_ID,
              CASE_DETAILS_COLLECTION_ID,
              [Query.equal('caseId', c.id)]
            ).then(res => res.documents[0] || null)
          )
        )

        // Add hasApplied property
        const casesWithStatus = mappedCases.map((c, idx) => {
          const details = detailsResponses[idx]
          let hasApplied = false
          if (details && details.applications) {
            hasApplied = details.applications.some(app => {
              const parsedApp = typeof app === 'string' ? JSON.parse(app) : app
              return parsedApp.lawyerId === currentUser.$id
            })
          }
          return { ...c, hasApplied }
        })
        setCasesWithStatus(casesWithStatus)
      } catch (error) {
        setError('Failed to load available cases. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [currentUser?.$id])

  // Function to fetch case details when viewing a specific case
  const fetchCaseDetails = async (caseId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        [Query.equal('caseId', caseId)]
      )

      if (response.documents.length > 0) {
        return response.documents[0]
      }
      return null
    } catch (error) {
      console.error('Error fetching case details:', error)
      return null
    }
  }

  // Function to handle application submission
  const handleApply = async (caseId) => {
    if (!currentUser?.$id) {
      setError('You must be logged in to apply for cases')
      return
    }

    if (!applicationMessage.trim()) {
      setError('Please provide a cover letter for your application')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // First, get the case details
      const caseDetailsResponse = await databases.listDocuments(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        [Query.equal('caseId', caseId)]
      )

      const currentTime = new Date().toISOString()
      const applicationData = {
        lawyerId: currentUser.$id,
        message: applicationMessage,
        submittedAt: currentTime,
        status: 'pending'
      }

      if (caseDetailsResponse.documents.length > 0) {
        // Update existing case details
        const existingDetails = caseDetailsResponse.documents[0]
        const existingApplications = existingDetails.applications || []
        
        // Check if lawyer has already applied
        const hasApplied = existingApplications.some(app => {
          const parsedApp = typeof app === 'string' ? JSON.parse(app) : app
          return parsedApp.lawyerId === currentUser.$id
        })

        if (hasApplied) {
          setError('You have already applied to this case')
          setIsSubmitting(false)
          return
        }

        // Add new application
        const updatedApplications = [...existingApplications, JSON.stringify(applicationData)]
        
        await databases.updateDocument(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          existingDetails.$id,
          {
            applications: updatedApplications,
            lastUpdated: currentTime
          }
        )
      } else {
        // Create new case details
        await databases.createDocument(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          ID.unique(),
          {
            caseId,
            applications: [JSON.stringify(applicationData)],
            lastUpdated: currentTime
          }
        )
      }

      // Create notification for the client
      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: cases.find(c => c.id === caseId)?.userId,
          type: 'new_application',
          title: 'New Case Application',
          message: `A lawyer has applied to your case "${cases.find(c => c.id === caseId)?.title}"`,
          caseId,
          lawyerId: currentUser.$id,
          read: false,
          createdAt: currentTime
        }
      )

      // Create notification for the lawyer
      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: currentUser.$id,
          type: 'application_submitted',
          title: 'Application Submitted',
          message: `Your application for "${cases.find(c => c.id === caseId)?.title}" has been submitted successfully`,
          caseId,
          read: false,
          createdAt: currentTime
        }
      )

      // Close modal and reset form
      setApplicationModal({ isOpen: false, caseId: null })
      setApplicationMessage('')
      
      // Navigate to my applications page
      navigate('/lawyer/applications')
    } catch (err) {
      console.error('Error submitting application:', err)
      setError('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter cases based on all criteria
  const filteredCases = casesWithStatus.filter(caseItem => {
    const matchesType = selectedType === 'All Types' || caseItem.type === selectedType
    const matchesRole = selectedRole === 'All Roles' || caseItem.role === selectedRole
    const matchesSearch = 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBudget = 
      (!budgetRange.min || caseItem.budget >= Number(budgetRange.min)) &&
      (!budgetRange.max || caseItem.budget <= Number(budgetRange.max))
    
    return matchesType && matchesRole && matchesSearch && matchesBudget
  }).sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.postedAt)
    const dateB = new Date(b.postedAt)
    return sortBy === 'recent' ? dateB - dateA : dateA - dateB
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Cases</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Cases</h1>
        <p className="text-gray-600 mt-1">Browse and apply for open legal matters</p>
      </div>

      {/* Search and Filters */}
      <div className="card bg-white mb-8 p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Case Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select py-2 rounded-md px-2 select-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="All Types">All Types</option>
              {caseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="select  py-2 rounded-md px-2  select-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Min Budget"
                value={budgetRange.min}
                onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                className="input input-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                min="0"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Budget"
                value={budgetRange.max}
                onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                className="input input-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                min="0"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select  py-2 rounded-md px-2  select-bordered w-full border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSelectedType('All Types')
                setSelectedRole('All Roles')
                setSearchQuery('')
                setBudgetRange({ min: '', max: '' })
                setSortBy('recent')
              }}
              className="btn btn-outline w-full border border-gray-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">Showing {filteredCases.length} available cases</p>
      </div>

      {/* Debug information - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Debug Info:</h3>
          <p>Total cases: {cases.length}</p>
          <p>Filtered cases: {filteredCases.length}</p>
          <p>Selected type: {selectedType}</p>
          <p>Search query: {searchQuery}</p>
        </div>
      )} */}

      {/* Application Modal */}
      {applicationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Apply to Case</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter
              </label>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="Explain why you're the best fit for this case..."
                className="textarea textarea-bordered w-full h-32 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setApplicationModal({ isOpen: false, caseId: null })
                  setApplicationMessage('')
                  setError('')
                }}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(applicationModal.caseId)}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case List */}
      <div className="space-y-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card bg-white"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <span className={`badge ${
                      caseItem.status === 'active' ? 'bg-green-100 text-green-800' :
                      caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">Posted {formatDate(caseItem.postedAt)}</span>
                    {caseItem.hasApplied && (
                      <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Applied</span>
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{caseItem.title}</h3>
                  <p className="text-gray-600 mb-4">{caseItem.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Case Type</div>
                      <div className="font-medium">{caseItem.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Budget</div>
                      <div className="font-medium">${caseItem.budget.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Role</div>
                      <div className="font-medium capitalize">{caseItem.role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Last Updated</div>
                      <div className="font-medium">{formatDate(caseItem.updatedAt)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between md:w-40">
                  <Link 
                    to={`/lawyer/case/${caseItem.id}`} 
                    className="btn btn-primary w-full mb-2 text-center"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => {
                      if (!caseItem.hasApplied && caseItem.status === 'pending') {
                        setApplicationModal({ isOpen: true, caseId: caseItem.id })
                      }
                    }}
                    className="btn btn-outline w-full"
                    disabled={caseItem.status !== 'pending' || caseItem.hasApplied}
                  >
                    {caseItem.hasApplied
                      ? 'Applied'
                      : (caseItem.status === 'pending' ? 'Apply Now' : 'Not Accepting Applications')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableCasesPage 