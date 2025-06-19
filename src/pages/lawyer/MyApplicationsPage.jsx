import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { databases } from '../../appwrite/appwrite'
import { useAuth } from '../../context/AuthContext'
import { ID, Query } from 'appwrite'

// Constants
const CASES_COLLECTION_ID = 'cases'
const CASE_DETAILS_COLLECTION_ID = 'caseDetails'

// Helper function to format date
const formatDate = (dateString) => {
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
  const [activeFilter, setActiveFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser?.$id) return

      try {
        setLoading(true)
        setError(null)

        // Fetch all case details where the current lawyer has applied
        const response = await databases.listDocuments(
          CASE_DETAILS_COLLECTION_ID,
          [
            Query.search('applications', currentUser.$id),
            Query.limit(100)
          ]
        )

        // Process the applications
        const processedApplications = await Promise.all(
          response.documents.map(async (caseDetail) => {
            // Get the corresponding case data
            const caseData = await databases.getDocument(
              CASES_COLLECTION_ID,
              caseDetail.caseId
            )

            // Find this lawyer's application
            const lawyerApplication = caseDetail.applications
              .map(app => typeof app === 'string' ? JSON.parse(app) : app)
              .find(app => app.lawyerId === currentUser.$id)

            return {
              id: `${caseDetail.caseId}-${currentUser.$id}`,
              caseId: caseDetail.caseId,
              caseTitle: caseData.title,
              clientName: caseData.clientName,
              clientPhoto: caseData.clientPhoto || 'https://randomuser.me/api/portraits/lego/1.jpg',
              appliedAt: lawyerApplication?.submittedAt || caseDetail.lastUpdated,
              status: lawyerApplication?.status || 'pending',
              cover: lawyerApplication?.message || '',
              caseType: caseData.caseType,
              caseStatus: caseData.status
            }
          })
        )

        setApplications(processedApplications)
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to load applications. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [currentUser?.$id])

  // Filter applications based on selected status
  const filteredApplications = activeFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeFilter)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      {/* Status Filter Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeFilter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('all')}
        >
          All Applications
        </button>
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeFilter === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeFilter === 'in_review' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('in_review')}
        >
          In Review
        </button>
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeFilter === 'accepted' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`py-2 px-4 font-medium text-sm ${activeFilter === 'rejected' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application, index) => (
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
                      <button className="btn btn-outline text-sm py-1 px-4">
                        Edit Application
                      </button>
                    )}
                    {application.status === 'accepted' && (
                      <button 
                        onClick={() => window.location.href = `/lawyer/cases/${application.caseId}`}
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