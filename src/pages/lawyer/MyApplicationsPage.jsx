import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { databases } from '../../lib/appwrite'
import { Query } from 'appwrite'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Constants
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return <span className="badge bg-yellow-100 text-yellow-800">Pending</span>
    case 'in_review':
      return <span className="badge bg-blue-100 text-blue-800">In Review</span>
    case 'accepted':
      return <span className="badge bg-green-100 text-green-800">Accepted</span>
    case 'rejected':
      return <span className="badge bg-red-100 text-red-800">Rejected</span>
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>
  }
}

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser?.$id) return

      try {
        setLoading(true)
        setError(null)

        // Fetch all case details where the current lawyer has applied
        // We need to find cases where the lawyer's ID is in the lawyerRequests field
        const response = await databases.listDocuments(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          [
            Query.search('lawyerRequests', currentUser.$id),
            Query.limit(100)
          ]
        )

        // Process the applications
        const processedApplications = await Promise.all(
          response.documents.map(async (caseDetail) => {
            try {
              // Get the corresponding case data
              const caseData = await databases.getDocument(
                DATABASE_ID,
                CASES_COLLECTION_ID,
                caseDetail.caseId
              )

              // Find this lawyer's application in the lawyerRequests array
              const lawyerRequests = caseDetail.lawyerRequests || []
              let lawyerApplication = null
              
              // Safely parse the lawyerRequests array
              try {
                const parsedRequests = lawyerRequests.map(item => {
                  if (typeof item === 'string') {
                    try {
                      return JSON.parse(item)
                    } catch (parseError) {
                      console.warn('Failed to parse lawyer request item:', item, parseError)
                      return null
                    }
                  }
                  return item
                }).filter(Boolean)
                
                lawyerApplication = parsedRequests.find(app => app.lawyerId === currentUser.$id)
              } catch (parseError) {
                console.warn('Failed to parse lawyerRequests for case:', caseDetail.caseId, parseError)
              }

              // Fetch client profile for name and photo
              let clientName = 'Unknown'
              let clientPhoto = 'https://randomuser.me/api/portraits/lego/1.jpg'
              try {
                const profileRes = await databases.listDocuments(
                  DATABASE_ID,
                  PROFILE_COLLECTION_ID,
                  [
                    Query.equal('userId', caseData.userId),
                    Query.equal('role', 'client'),
                    Query.limit(1)
                  ]
                )
                if (profileRes.documents.length > 0) {
                  const clientProfile = profileRes.documents[0]
                  clientName = `${clientProfile.firstName || ''} ${clientProfile.lastName || ''}`.trim() || 'Unknown'
                  clientPhoto = clientProfile.profileImage || clientPhoto
                }
              } catch (err) {
                console.error(`Failed to fetch profile for user ${caseData.userId}:`, err)
              }

              return {
                id: `${caseDetail.caseId}-${currentUser.$id}`,
                caseId: caseDetail.caseId,
                caseTitle: caseData.title,
                clientName,
                clientPhoto,
                appliedAt: lawyerApplication?.submittedAt || caseDetail.lastUpdated || caseDetail.$createdAt,
                status: lawyerApplication?.status || 'pending',
                cover: lawyerApplication?.message || '',
                caseType: caseData.caseType,
                caseStatus: caseData.status
              }
            } catch (err) {
              console.error(`Error processing case ${caseDetail.caseId}:`, err)
              return null
            }
          })
        )

        // Filter out any null results from failed processing
        const validApplications = processedApplications.filter(Boolean)
        setApplications(validApplications)
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to load applications. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [currentUser?.$id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track and manage your case applications</p>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card bg-white"
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      {getStatusBadge(application.status)}
                      <span className="text-xs text-gray-500 ml-2">Applied on {formatDate(application.appliedAt)}</span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{application.caseTitle}</h3>
                    <div className="text-sm text-gray-600">
                      Case Type: {application.caseType} • Status: {application.caseStatus}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img 
                      src={application.clientPhoto} 
                      alt={application.clientName} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium">{application.clientName}</div>
                      <div className="text-xs text-gray-500">Client</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Your Application</div>
                  <p className="text-gray-600 text-sm">{application.cover}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  {application.status === 'accepted' ? (
                    <div className="text-green-600 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Congratulations! Your application was accepted.
                    </div>
                  ) : application.status === 'rejected' ? (
                    <div className="text-red-600 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your application was not selected for this case.
                    </div>
                  ) : (
                    <div className="text-blue-600 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Awaiting client response. We'll notify you of any updates.
                    </div>
                  )}
                  
                  <div>
                    {application.status === 'pending' && (
                      <button 
                        onClick={() => window.location.href = `/lawyer/case/${application.caseId}`}
                        className="btn btn-outline text-sm py-1 px-4"
                      >
                        View Application
                      </button>
                    )}
                    {application.status === 'accepted' && (
                      <button 
                        onClick={() => window.location.href = `/lawyer/case/${application.caseId}`}
                        className="btn btn-primary text-sm py-1 px-4"
                      >
                        View Case Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">You haven't applied to any cases yet.</p>
            <button 
              onClick={() => window.location.href = '/lawyer/cases'}
              className="btn btn-primary"
            >
              Browse Available Cases
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplicationsPage 