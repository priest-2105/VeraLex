import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { databases, storage } from '../../lib/appwrite'
import { ID, Query } from 'appwrite'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import Alert from '../../components/common/Alert'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID
const CASE_DOCUMENTS_BUCKET_ID = import.meta.env.VITE_APPWRITE_CASE_DOCUMENTS_BUCKET_ID
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' | ' + 
         date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'in_progress':
      return <span className="badge bg-blue-100 text-blue-800">In Progress</span>
    case 'pending':
      return <span className="badge bg-yellow-100 text-yellow-800">Pending</span>
    case 'filed':
      return <span className="badge bg-purple-100 text-purple-800">Filed</span>
    case 'closed':
      return <span className="badge bg-green-100 text-green-800">Closed</span>
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>
  }
}

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const CaseDetailPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [caseData, setCaseData] = useState(null)
  const [caseDetails, setCaseDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [documents, setDocuments] = useState([])
  const [assignedLawyer, setAssignedLawyer] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)

  const currentUser = useSelector(selectCurrentUser)

  // Fetch case data from Appwrite
  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true)
      setError('')
      
      try {
        // 1. Fetch main case document
        const mainCase = await databases.getDocument(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          id
        )

        // 2. Fetch case details document
        const detailsQuery = await databases.listDocuments(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          [
            Query.equal('caseId', id)
          ]
        )

        const caseDetailsDoc = detailsQuery.documents[0]

        // 3. If there's an assigned lawyer, fetch their details
        if (caseDetailsDoc?.lawyerAssigned) {
          try {
            const lawyerDoc = await databases.getDocument(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              caseDetailsDoc.lawyerAssigned
            )
            setAssignedLawyer(lawyerDoc)
          } catch (error) {
            console.error('Error fetching lawyer details:', error)
            // Don't set error state here, just log it
          }
        }

        // 4. Fetch document metadata if there are any documents
        let documentMetadata = []
        if (caseDetailsDoc?.documents?.length > 0) {
          const filePromises = caseDetailsDoc.documents.map(async (fileId) => {
            try {
              const file = await storage.getFile(CASE_DOCUMENTS_BUCKET_ID, fileId)
              const fileUrl = storage.getFileView(CASE_DOCUMENTS_BUCKET_ID, fileId)
              return {
                id: fileId,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.mimeType,
                url: fileUrl,
                uploadedAt: file.$createdAt
              }
            } catch (error) {
              console.error(`Error fetching file ${fileId}:`, error)
              return null
            }
          })
          
          documentMetadata = (await Promise.all(filePromises)).filter(Boolean)
        }

        // 5. Combine the data
        setCaseData({
          ...mainCase,
          documents: documentMetadata,
          deadline: caseDetailsDoc?.deadline,
          lawyerId: caseDetailsDoc?.lawyerId,
          lawyerAssigned: caseDetailsDoc?.lawyerAssigned,
          applications: caseDetailsDoc?.applications || [],
          notes: caseDetailsDoc?.notes || '',
          lastUpdated: caseDetailsDoc?.lastUpdated
        })
        
        setCaseDetails(caseDetailsDoc)
        setDocuments(documentMetadata)

      } catch (error) {
        console.error('Error fetching case data:', error)
        setError(error.message || 'Failed to load case data')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
    fetchCaseData()
    }
  }, [id])

  // Add a new function to check application status
  const checkApplicationStatus = () => {
    if (!caseDetails || !currentUser?.$id) return false

    // Check both lawyerRequests array and applications array
    const hasRequested = caseDetails.lawyerRequests?.includes(currentUser.$id)
    const hasApplication = caseDetails.applications?.some(app => {
      const parsedApp = typeof app === 'string' ? JSON.parse(app) : app
      return parsedApp.lawyerId === currentUser.$id
    })

    // Lawyer is considered to have applied if they appear in either array
    return hasRequested || hasApplication
  }

  // Update the useEffect to use the new check
  useEffect(() => {
    if (caseDetails && currentUser?.$id) {
      const hasAppliedToCase = checkApplicationStatus()
      setHasApplied(hasAppliedToCase)
      console.log('Application status:', {
        hasApplied: hasAppliedToCase,
        lawyerId: currentUser.$id,
        lawyerRequests: caseDetails.lawyerRequests,
        applications: caseDetails.applications
      })
    }
  }, [caseDetails, currentUser])

  // Check if lawyer is assigned to the case
  const isAssignedLawyer = caseDetails?.lawyerAssigned === currentUser?.$id

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    try {
      const messageData = JSON.stringify({
        id: ID.unique(),
        text: newMessage.trim(),
        senderId: currentUser.$id,
        senderRole: currentUser.role,
      timestamp: new Date().toISOString()
      })

      // Update case details with new message
      const updatedMessages = [...(caseDetails.messages || []), messageData]
      
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          messages: updatedMessages,
          lastUpdated: new Date().toISOString()
        }
      )

      // Update local state
      setCaseDetails(prev => ({
      ...prev,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString()
    }))
    
    setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message')
    }
  }

  const addTimelineEvent = async (action) => {
    try {
      const timelineEvent = JSON.stringify({
        id: ID.unique(),
        action,
        actor: currentUser.$id,
        actorRole: currentUser.role,
        timestamp: new Date().toISOString()
      })

      const updatedTimeline = [...(caseDetails.timeline || []), timelineEvent]
      
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          timeline: updatedTimeline,
          lastUpdated: new Date().toISOString()
        }
      )

      setCaseDetails(prev => ({
        ...prev,
        timeline: updatedTimeline,
        lastUpdated: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error adding timeline event:', error)
      setError('Failed to update timeline')
    }
  }

  // Update the messages display in the JSX
  const renderMessages = () => {
    if (!caseDetails?.messages?.length) {
      return (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">No messages yet</p>
        </div>
      )
    }

    return caseDetails.messages.map((messageStr, index) => {
      const message = JSON.parse(messageStr)
      const isCurrentUser = message.senderId === currentUser.$id
      
      return (
        <div 
          key={message.id} 
          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[75%] rounded-lg p-3 ${
              isCurrentUser 
                ? 'bg-primary/10 text-gray-900' 
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className="text-sm">{message.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatTimestamp(message.timestamp)}
              <span className="ml-2 capitalize">{message.senderRole}</span>
            </div>
          </div>
        </div>
      )
    })
  }

  // Update the timeline display in the JSX
  const renderTimeline = () => {
    if (!caseDetails?.timeline?.length) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No timeline events yet</p>
        </div>
      )
    }

    return (
      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary before:to-gray-200">
        {caseDetails.timeline.map((eventStr, index) => {
          const event = JSON.parse(eventStr)
          return (
            <div key={event.id} className="relative">
              <div className="absolute left-0 -translate-x-full transform -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <h3 className="text-base font-medium text-gray-900">{event.action}</h3>
                  <time className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</time>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  By {event.actorRole}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const handleAppointLawyer = async (lawyerId) => {
    try {
      // Update case details with assigned lawyer
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerAssigned: lawyerId,
          lawyerRequests: caseDetails.lawyerRequests.filter(id => id !== lawyerId),
          lastUpdated: new Date().toISOString()
        }
      )

      // Add timeline event
      await addTimelineEvent(`Lawyer ${lawyerId} was assigned to the case`)

      // Update local state
      setCaseDetails(prev => ({
        ...prev,
        lawyerAssigned: lawyerId,
        lawyerRequests: prev.lawyerRequests.filter(id => id !== lawyerId),
        lastUpdated: new Date().toISOString()
      }))

      // Update case status
      await databases.updateDocument(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        id,
        {
          status: 'in_progress',
          updatedAt: new Date().toISOString()
        }
      )

      // Update local case data
      setCaseData(prev => ({
        ...prev,
        status: 'in_progress',
        updatedAt: new Date().toISOString()
      }))
    
    // Switch to overview tab
    setActiveTab('overview')
    } catch (error) {
      console.error('Error appointing lawyer:', error)
      setError('Failed to appoint lawyer')
    }
  }

  const handleApplySubmit = async () => {
    if (!applicationMessage.trim()) {
      setError('Please provide a cover letter')
      return
    }

    try {
      const currentTime = new Date().toISOString()
      
      // 1. Update case details with lawyer's application
      const updatedRequests = [...(caseDetails?.lawyerRequests || []), currentUser.$id]
      
      // Create application object and stringify it
      const applicationData = {
        lawyerId: currentUser.$id,
        message: applicationMessage.trim(),
        submittedAt: currentTime,
        status: 'pending'
      }
      
      const updatedApplications = [...(caseDetails?.applications || []), JSON.stringify(applicationData)]

      // If case details don't exist, create them
      if (!caseDetails) {
        const newCaseDetails = await databases.createDocument(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          ID.unique(),
          {
            caseId: id,
            lawyerRequests: updatedRequests,
            applications: updatedApplications,
            lastUpdated: currentTime,
            createdAt: currentTime
          }
        )
        setCaseDetails(newCaseDetails)
      } else {
        // Update existing case details
        await databases.updateDocument(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          caseDetails.$id,
          {
            lawyerRequests: updatedRequests,
            applications: updatedApplications,
            lastUpdated: currentTime
          }
        )
      }

      // 2. Create or update lawyer's notification document
      const lawyerNotificationData = {
        userId: currentUser.$id,
        type: 'application_submitted',
        title: 'Application Submitted',
        message: `Your application for case "${caseData.title}" has been submitted successfully.`,
        caseId: id,
        read: false,
        createdAt: currentTime
      }

      // Check if lawyer has existing notifications
      const lawyerNotifications = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      )

      if (lawyerNotifications.documents.length > 0) {
        // Update existing notification document
        await databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          lawyerNotifications.documents[0].$id,
          {
            notifications: [...lawyerNotifications.documents[0].notifications, lawyerNotificationData],
            lastUpdated: currentTime
          }
        )
      } else {
        // Create new notification document for lawyer
        await databases.createDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            userId: currentUser.$id,
            notifications: [lawyerNotificationData],
            createdAt: currentTime,
            lastUpdated: currentTime
          }
        )
      }

      // 3. Create or update client's notification document
      const clientNotificationData = {
        userId: caseData.userId,
        type: 'new_application',
        title: 'New Case Application',
        message: `A new lawyer has applied to your case "${caseData.title}".`,
        caseId: id,
        lawyerId: currentUser.$id,
        read: false,
        createdAt: currentTime
      }

      // Check if client has existing notifications
      const clientNotifications = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [Query.equal('userId', caseData.userId)]
      )

      if (clientNotifications.documents.length > 0) {
        // Update existing notification document
        await databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          clientNotifications.documents[0].$id,
          {
            notifications: [...clientNotifications.documents[0].notifications, clientNotificationData],
            lastUpdated: currentTime
          }
        )
      } else {
        // Create new notification document for client
        await databases.createDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          ID.unique(),
          {
            userId: caseData.userId,
            notifications: [clientNotificationData],
            createdAt: currentTime,
            lastUpdated: currentTime
          }
        )
      }

      // Update local state with parsed applications for display
      setCaseDetails(prev => ({
        ...prev,
        lawyerRequests: updatedRequests,
        applications: updatedApplications.map(app => JSON.parse(app)),
        lastUpdated: currentTime
      }))

      setHasApplied(true)
      setIsApplyModalOpen(false)
      setApplicationMessage('')
    } catch (error) {
      console.error('Error submitting application:', error)
      setError('Failed to submit application')
    }
  }

  // Update getApplicationStatus to be more robust
  const getApplicationStatus = () => {
    if (!caseDetails?.applications || !currentUser?.$id) return null
    
    // Find the most recent application for this lawyer
    const lawyerApplications = caseDetails.applications
      .map(app => typeof app === 'string' ? JSON.parse(app) : app)
      .filter(app => app.lawyerId === currentUser.$id)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

    return lawyerApplications[0] || null
  }

  // Update renderApplicationStatus to show more detailed status
  const renderApplicationStatus = () => {
    const application = getApplicationStatus()
    const isApplied = checkApplicationStatus()
    
    if (isAssignedLawyer) {
      return (
        <div className="space-y-3">
          <div className="flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">You are assigned to this case</span>
          </div>
          <p className="text-sm text-gray-600">
            You have been assigned to this case. You can now access all case details and communicate with the client.
          </p>
        </div>
      )
    } else if (isApplied) {
      return (
        <div className="space-y-3">
          <div className="flex items-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Application Submitted</span>
          </div>
          <p className="text-sm text-gray-600">
            Your application has been submitted and is under review. The client will be notified of your interest.
          </p>
          {application && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Your Cover Letter</h4>
              <p className="text-sm text-blue-700">
                {application.message}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Submitted on {formatDate(application.submittedAt)}
              </p>
              {application.status && (
                <p className="text-xs text-blue-600 mt-1">
                  Status: <span className="capitalize">{application.status}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div className="space-y-3">
          <p className="text-gray-600">
            {caseData?.status === 'pending' 
              ? "This case is open for applications. Click 'Apply to Case' to submit your application."
              : "This case is not currently accepting applications."}
          </p>
          {caseData?.status === 'pending' && (
            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="btn btn-primary w-full"
            >
              Apply Now
            </button>
          )}
        </div>
      )
    }
  }

  // Update the messages tab to show disabled state when no lawyer is assigned
  const renderMessagesTab = () => {
    const isLawyerAssigned = Boolean(caseDetails?.lawyerAssigned)
    
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        {!isLawyerAssigned ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Messages Unavailable</h3>
            <p className="text-yellow-700">
              Messages will be available once a lawyer is assigned to your case.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {renderMessages()}
            </div>
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input flex-grow mr-2"
                  placeholder="Type your message..."
                  disabled={!isLawyerAssigned}
                />
                <button 
                  type="submit"
                  className="btn btn-primary flex-shrink-0"
                  disabled={!newMessage.trim() || !isLawyerAssigned}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // Update the applicants tab to show lawyer requests
  const renderApplicantsTab = () => {
    if (!caseDetails?.lawyerRequests?.length) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No lawyer requests yet</p>
        </div>
      )
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-semibold mb-4">Lawyer Requests</h2>
        <div className="space-y-6">
          {caseDetails.lawyerRequests.map((lawyerId) => (
            <div key={lawyerId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Lawyer ID: {lawyerId}</h3>
                  {/* Here you would typically fetch and display more lawyer details */}
                </div>
                <button 
                  onClick={() => handleAppointLawyer(lawyerId)}
                  className="btn btn-primary"
                >
                  Appoint Lawyer
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Add a new component to render the assigned lawyer card
  const renderAssignedLawyerCard = () => {
    if (!caseDetails?.lawyerAssigned || !assignedLawyer) {
      return null
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Assigned Lawyer</h3>
        <div className="flex items-start space-x-4">
          {assignedLawyer.profileImage ? (
            <img 
              src={assignedLawyer.profileImage} 
              alt={`${assignedLawyer.firstName} ${assignedLawyer.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {assignedLawyer.firstName?.[0]}{assignedLawyer.lastName?.[0]}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {assignedLawyer.firstName} {assignedLawyer.lastName}
                </h4>
                <p className="text-sm text-gray-600">{assignedLawyer.email}</p>
                {assignedLawyer.phone && (
                  <p className="text-sm text-gray-600">{assignedLawyer.phone}</p>
                )}
              </div>
              {currentUser.role === 'client' && (
                <button 
                  onClick={() => {/* TODO: Implement remove lawyer functionality */}}
                  className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                >
                  Remove Lawyer
                </button>
              )}
            </div>
            {assignedLawyer.bio && (
              <p className="mt-2 text-sm text-gray-600">{assignedLawyer.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {assignedLawyer.specializations?.map((spec, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Alert 
          type="error" 
          message={error} 
          className="mb-6"
        />
        <Link to="/client/my-cases" className="btn btn-primary">
          View All Cases
        </Link>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Case Not Found</h3>
        <p className="text-gray-600 mb-6">
          The case you're looking for doesn't exist or you may not have permission to view it.
        </p>
        <Link to="/client/my-cases" className="btn btn-primary">
          View All Cases
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Case Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              {getStatusBadge(caseData.status)}
              <span className="text-xs text-gray-500 ml-2">Created on {formatDate(caseData.createdAt)}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <span className="mr-3">{caseData.type}</span>
              <span className="mr-3">•</span>
              <span className="capitalize">{caseData.role}</span>
              <span className="mr-3">•</span>
              <span>Budget: ${caseData.budget.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            {caseData.status === 'pending' && !hasApplied && (
              <button 
                onClick={() => setIsApplyModalOpen(true)} 
                className="btn btn-primary"
              >
                Apply to Case
              </button>
            )}
            {hasApplied && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Submitted
              </div>
            )}
            {currentUser.role === 'client' && (
              <button className="btn btn-outline">
                Edit Case
              </button>
            )}
            {caseData.status === 'in_progress' && currentUser.role === 'client' && (
              <button className="btn btn-primary">
                Close Case
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Conditional based on assignment */}
      {isAssignedLawyer ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'documents'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'messages'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'timeline'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timeline
              </button>
            </nav>
          </div>
        </div>
      ) : (
        // Show only overview tab for unassigned lawyers
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b">
            <nav className="-mb-px flex">
              <button
                className="flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center border-primary text-primary"
              >
                Overview
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case Description */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium mb-3">Case Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{caseData?.description}</p>
              </div>

              {/* Key Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Case Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Case Type</span>
                    <span className="font-medium">{caseData?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium capitalize">{caseData?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">${caseData?.budget?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium">{getStatusBadge(caseData?.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted Date</span>
                    <span className="font-medium">{formatDate(caseData?.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">{formatDate(caseData?.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h3 className="text-lg font-medium mb-3">Application Status</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {renderApplicationStatus()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Only show other tabs if lawyer is assigned */}
        {isAssignedLawyer && (
          <>
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Case Documents</h2>
                  <button className="btn btn-sm btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload Document
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="min-w-full divide-y divide-gray-200">
                    <div className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12">
                      <div className="col-span-7">Name</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-2">Uploaded</div>
                      <div className="col-span-1"></div>
                    </div>
                    <div className="bg-white divide-y divide-gray-200">
                      {caseData.documents.length > 0 ? (
                        caseData.documents.map((doc, index) => (
                          <div key={index} className="px-6 py-4 text-sm text-gray-900 grid grid-cols-12 items-center">
                            <div className="col-span-7 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-medium">{doc.name}</span>
                            </div>
                            <div className="col-span-2 text-gray-500">{doc.size}</div>
                            <div className="col-span-2 text-gray-500">{formatDate(doc.uploadedAt)}</div>
                            <div className="col-span-1 flex justify-end space-x-2">
                              <button 
                                className="text-primary hover:text-primary-dark"
                                title="Download"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-10 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-500 mb-2">No documents uploaded yet</p>
                          <button className="btn btn-sm btn-primary">
                            Upload Document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'timeline' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-lg font-semibold mb-6">Case Timeline</h2>
                {renderTimeline()}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Apply to Case Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Apply to Case: {caseData.title}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleApplySubmit(); }}>
              <div className="mb-4">
                <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message / Cover Letter
                </label>
                <textarea
                  id="applicationMessage"
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Explain why you're a good fit for this case..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsApplyModalOpen(false)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaseDetailPage 