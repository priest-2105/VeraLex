import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { databases, storage } from '../../lib/appwrite'
import { ID, Query } from 'appwrite'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import Alert from '../../components/common/Alert'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import LogoutConfirmationModal from '../../components/common/LogoutConfirmationModal'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID
const CASE_DOCUMENTS_BUCKET_ID = import.meta.env.VITE_APPWRITE_CASE_DOCUMENTS_BUCKET_ID
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
const LAWYER_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LAWYER_DETAILS_COLLECTION_ID

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

// Helper to send notification to a user
const sendNotification = async (userId, notification) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    let notificationDoc = response.documents[0];
    if (notificationDoc) {
      // Update existing document
      const updatedNotifications = [...notificationDoc.notifications, JSON.stringify(notification)];
      await databases.updateDocument(
        DATABASE_ID,
        import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
        notificationDoc.$id,
        {
          notifications: updatedNotifications,
          unreadCount: (notificationDoc.unreadCount || 0) + 1,
          lastUpdated: new Date().toISOString()
        }
      );
    } else {
      // Create new document if not exists
      await databases.createDocument(
        DATABASE_ID,
        import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          notifications: [JSON.stringify(notification)],
          unreadCount: 1,
          lastUpdated: new Date().toISOString()
        }
      );
    }
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

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
  const [applicants, setApplicants] = useState([])
  const [applicantsLoading, setApplicantsLoading] = useState(false)
  const [applicantsError, setApplicantsError] = useState('')
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', lawyer: null })
  const [actionLoading, setActionLoading] = useState(false)
  const [parsedApplications, setParsedApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [applicationsError, setApplicationsError] = useState('')
  const [confirmAppModal, setConfirmAppModal] = useState({ open: false, type: '', lawyer: null })
  const [actionAppLoading, setActionAppLoading] = useState(false)

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

  // Fetch applicants when lawyerRequests changes
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!caseDetails?.lawyerRequests?.length) {
        setApplicants([])
        return
      }
      setApplicantsLoading(true)
      setApplicantsError('')
      try {
        // Fetch all profiles and details in parallel
        const profilePromises = caseDetails.lawyerRequests.map(userId =>
          databases.listDocuments(
            DATABASE_ID,
            PROFILE_COLLECTION_ID,
            [Query.equal('userId', userId), Query.equal('role', 'lawyer'), Query.limit(1)]
          )
        )
        const detailsPromises = caseDetails.lawyerRequests.map(userId =>
          databases.listDocuments(
            DATABASE_ID,
            LAWYER_DETAILS_COLLECTION_ID,
            [Query.equal('userId', userId), Query.limit(1)]
          )
        )
        const profilesResults = await Promise.all(profilePromises)
        const detailsResults = await Promise.all(detailsPromises)
        const applicantsData = caseDetails.lawyerRequests.map((userId, idx) => {
          const profile = profilesResults[idx].documents[0]
          const details = detailsResults[idx].documents[0]
          return {
            userId,
            id: profile?.$id || userId,
            name: profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown',
            email: profile?.email || '',
            phone: details?.phone || profile?.phone || '',
            profileImage: details?.profileImage || profile?.profileImage || '',
            specializations: details?.specializations || [],
            rating: details?.rating || 0,
            reviewCount: details?.reviewCount || 0,
            yearsOfExperience: details?.yearsOfExperience || 0,
            location: details?.location || '',
            bio: details?.bio || profile?.bio || '',
            barId: details?.barId || '',
            isVerified: details?.isVerified || false,
          }
        })
        setApplicants(applicantsData)
      } catch (err) {
        setApplicantsError('Failed to load applicants. Please try again.')
      } finally {
        setApplicantsLoading(false)
      }
    }
    fetchApplicants()
  }, [caseDetails?.lawyerRequests])

  // Fetch and parse applications when caseDetails.applications changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (!caseDetails?.applications?.length) {
        setParsedApplications([])
        return
      }
      setApplicationsLoading(true)
      setApplicationsError('')
      try {
        // Parse each application and fetch lawyer info
        const appObjs = caseDetails.applications.map(appStr => JSON.parse(appStr))
        const profilePromises = appObjs.map(app =>
          databases.listDocuments(
            DATABASE_ID,
            PROFILE_COLLECTION_ID,
            [Query.equal('userId', app.lawyerId), Query.equal('role', 'lawyer'), Query.limit(1)]
          )
        )
        const detailsPromises = appObjs.map(app =>
          databases.listDocuments(
            DATABASE_ID,
            LAWYER_DETAILS_COLLECTION_ID,
            [Query.equal('userId', app.lawyerId), Query.limit(1)]
          )
        )
        const profiles = await Promise.all(profilePromises)
        const details = await Promise.all(detailsPromises)
        const combined = appObjs.map((app, idx) => ({
          ...app,
          profile: profiles[idx].documents[0],
          details: details[idx].documents[0],
        }))
        setParsedApplications(combined)
      } catch (err) {
        setApplicationsError('Failed to load applications. Please try again.')
      } finally {
        setApplicationsLoading(false)
      }
    }
    fetchApplications()
  }, [caseDetails?.applications])

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
    try {
      // Add lawyer to requests array
      const updatedRequests = [...(caseDetails.lawyerRequests || []), currentUser.$id]
      
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerRequests: updatedRequests,
          lastUpdated: new Date().toISOString()
        }
      )

      // Add timeline event
      await addTimelineEvent(`Lawyer ${currentUser.$id} requested to join the case`)

      // Update local state
      setCaseDetails(prev => ({
        ...prev,
        lawyerRequests: updatedRequests,
        lastUpdated: new Date().toISOString()
      }))

      // Close modal
    setIsApplyModalOpen(false)
    setApplicationMessage('')
    } catch (error) {
      console.error('Error submitting application:', error)
      setError('Failed to submit application')
    }
  }

  const handleAcceptLawyer = async (lawyer) => {
    setActionLoading(true)
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerAssigned: lawyer.userId,
          lawyerRequests: [],
          lastUpdated: new Date().toISOString(),
        }
      )
      await addTimelineEvent(`Lawyer ${lawyer.name} (${lawyer.userId}) was assigned to the case`)
      setCaseDetails(prev => ({ ...prev, lawyerAssigned: lawyer.userId, lawyerRequests: [] }))
      setApplicants([])
      setConfirmModal({ open: false, type: '', lawyer: null })

      // Fetch client userId from cases collection
      const caseDoc = await databases.getDocument(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        caseData.$id
      )
      const clientUserId = caseDoc.userId
      // Notify client
      await sendNotification(clientUserId, {
        id: ID.unique(),
        type: 'lawyer_assigned',
        message: `Lawyer ${lawyer.name} has been assigned to your case.`,
        caseId: caseData.$id,
        timestamp: new Date().toISOString(),
        read: false,
        url: `/client/case/${caseData.$id}`
      })
      // Notify lawyer
      await sendNotification(lawyer.userId, {
        id: ID.unique(),
        type: 'lawyer_assigned',
        message: `You have been assigned to a new case.`,
        caseId: caseData.$id,
        timestamp: new Date().toISOString(),
        read: false,
        url: `/lawyer/my-cases`
      })
    } catch (err) {
      setApplicantsError('Failed to accept lawyer. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectLawyer = async (lawyer) => {
    setActionLoading(true)
    try {
      const updatedRequests = (caseDetails.lawyerRequests || []).filter(id => id !== lawyer.userId)
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerRequests: updatedRequests,
          lastUpdated: new Date().toISOString(),
        }
      )
      await addTimelineEvent(`Lawyer ${lawyer.name} (${lawyer.userId}) was rejected for the case`)
      setCaseDetails(prev => ({ ...prev, lawyerRequests: updatedRequests }))
      setApplicants(prev => prev.filter(a => a.userId !== lawyer.userId))
      setConfirmModal({ open: false, type: '', lawyer: null })
    } catch (err) {
      setApplicantsError('Failed to reject lawyer. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAcceptApplication = async (app) => {
    setActionAppLoading(true)
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerAssigned: app.lawyerId,
          lawyerRequests: [],
          lastUpdated: new Date().toISOString(),
        }
      )
      await addTimelineEvent(`Lawyer ${app.profile ? app.profile.firstName + ' ' + app.profile.lastName : app.lawyerId} was assigned to the case`)
      setCaseDetails(prev => ({ ...prev, lawyerAssigned: app.lawyerId, lawyerRequests: [] }))
      setConfirmAppModal({ open: false, type: '', lawyer: null })

      // Fetch client userId from cases collection
      const caseDoc = await databases.getDocument(
        DATABASE_ID,
        CASES_COLLECTION_ID,
        caseData.$id
      )
      const clientUserId = caseDoc.userId
      // Notify client
      await sendNotification(clientUserId, {
        id: ID.unique(),
        type: 'lawyer_assigned',
        message: `Lawyer ${app.profile ? app.profile.firstName + ' ' + app.profile.lastName : app.lawyerId} has been assigned to your case.`,
        caseId: caseData.$id,
        timestamp: new Date().toISOString(),
        read: false,
        url: `/client/case/${caseData.$id}`
      })
      // Notify lawyer
      await sendNotification(app.lawyerId, {
        id: ID.unique(),
        type: 'lawyer_assigned',
        message: `You have been assigned to a new case.`,
        caseId: caseData.$id,
        timestamp: new Date().toISOString(),
        read: false,
        url: `/lawyer/my-cases`
      })
    } catch (err) {
      setApplicationsError('Failed to accept lawyer. Please try again.')
    } finally {
      setActionAppLoading(false)
    }
  }

  const handleRejectApplication = async (app) => {
    setActionAppLoading(true)
    try {
      const updatedRequests = (caseDetails.lawyerRequests || []).filter(id => id !== app.lawyerId)
      await databases.updateDocument(
        DATABASE_ID,
        CASE_DETAILS_COLLECTION_ID,
        caseDetails.$id,
        {
          lawyerRequests: updatedRequests,
          lastUpdated: new Date().toISOString(),
        }
      )
      await addTimelineEvent(`Lawyer ${app.profile ? app.profile.firstName + ' ' + app.profile.lastName : app.lawyerId} was rejected for the case`)
      setCaseDetails(prev => ({ ...prev, lawyerRequests: updatedRequests }))
      setParsedApplications(prev => prev.filter(a => a.lawyerId !== app.lawyerId))
      setConfirmAppModal({ open: false, type: '', lawyer: null })
    } catch (err) {
      setApplicationsError('Failed to reject lawyer. Please try again.')
    } finally {
      setActionAppLoading(false)
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
    if (applicantsLoading) {
      return <div className="flex justify-center py-10"><LoadingSpinner /></div>
    }
    if (applicantsError) {
      return <div className="text-center py-10 text-red-600">{applicantsError}</div>
    }
    if (!applicants.length) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No lawyer requests yet</p>
        </div>
      )
    }
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-semibold mb-4">Lawyer Applicants</h2>
        <div className="space-y-6">
          {applicants.map((lawyer) => (
            <div key={lawyer.userId} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img src={lawyer.profileImage || '/default-avatar.png'} alt={lawyer.name} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                  <p className="text-gray-600 text-sm">{lawyer.email}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lawyer.specializations.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">{spec}</span>
                    ))}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>Rating: {lawyer.rating} ({lawyer.reviewCount} reviews)</span>
                    <span className="mx-2">|</span>
                    <span>{lawyer.yearsOfExperience} yrs exp</span>
                    {lawyer.location && <><span className="mx-2">|</span><span>{lawyer.location}</span></>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                <button
                  className="btn btn-primary"
                  onClick={() => setConfirmModal({ open: true, type: 'accept', lawyer })}
                  disabled={actionLoading}
                >
                  Accept
                </button>
                <button
                  className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setConfirmModal({ open: true, type: 'reject', lawyer })}
                  disabled={actionLoading}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Confirmation Modal */}
        <LogoutConfirmationModal
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, type: '', lawyer: null })}
          onConfirm={() => {
            if (confirmModal.type === 'accept') handleAcceptLawyer(confirmModal.lawyer)
            else if (confirmModal.type === 'reject') handleRejectLawyer(confirmModal.lawyer)
          }}
          isLoading={actionLoading}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {confirmModal.type === 'accept' ? 'Accept Lawyer?' : 'Reject Lawyer?'}
          </h2>
          <p className="text-gray-600 mb-6">
            {confirmModal.type === 'accept'
              ? `Are you sure you want to accept ${confirmModal.lawyer?.name} for this case?`
              : `Are you sure you want to reject ${confirmModal.lawyer?.name}?`}
          </p>
        </LogoutConfirmationModal>
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

  // In the tab navigation, add the Applications tab
  const renderApplicationsTab = () => {
    if (applicationsLoading) return <div className="flex justify-center py-10"><LoadingSpinner /></div>
    if (applicationsError) return <div className="text-center py-10 text-red-600">{applicationsError}</div>
    if (!parsedApplications.length) return <div className="text-center py-10 text-gray-500">No applications yet.</div>
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-semibold mb-4">Lawyer Applications</h2>
        <div className="space-y-6">
          {parsedApplications.map((app, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img src={app.profile?.profileImage || app.details?.profileImage || '/default-avatar.png'} alt={app.profile ? `${app.profile.firstName} ${app.profile.lastName}` : app.lawyerId} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{app.profile ? `${app.profile.firstName} ${app.profile.lastName}` : app.lawyerId}</h3>
                  <p className="text-gray-600 text-sm">{app.profile?.email || app.details?.email}</p>
                  {app.details?.isVerified && <span className="inline-block text-xs text-green-600 ml-1">Verified</span>}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(app.details?.specializations) && app.details.specializations.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">{spec}</span>
                    ))}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>Rating: {app.details?.rating || 0} ({app.details?.reviewCount || 0} reviews)</span>
                    <span className="mx-2">|</span>
                    <span>{app.details?.yearsOfExperience || 0} yrs exp</span>
                    {app.details?.location && <><span className="mx-2">|</span><span>{app.details.location}</span></>}
                    {app.details?.hourlyRate && <><span className="mx-2">|</span><span>${app.details.hourlyRate}/hr</span></>}
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-0 md:ml-6">
                <div className="mb-2"><b>Cover Letter:</b> {app.coverLetter || app.message}</div>
                <div className="mb-2"><b>Experience:</b> {app.details?.yearsOfExperience || 0} years</div>
                <div className="mb-2"><b>Applied On:</b> {formatDate(app.appliedAt || app.submittedAt)}</div>
                {/* {currentUser.role === 'client' && !caseDetails.lawyerAssigned && ( */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => setConfirmAppModal({ open: true, type: 'accept', lawyer: app })}
                      disabled={actionAppLoading}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setConfirmAppModal({ open: true, type: 'reject', lawyer: app })}
                      disabled={actionAppLoading}
                    >
                      Reject
                    </button>
                  </div>
                {/* )} */}
              </div>
            </div>
          ))}
        </div>
        {/* Confirmation Modal */}
        <LogoutConfirmationModal
          isOpen={confirmAppModal.open}
          onClose={() => setConfirmAppModal({ open: false, type: '', lawyer: null })}
          onConfirm={() => {
            if (confirmAppModal.type === 'accept') handleAcceptApplication(confirmAppModal.lawyer)
            else if (confirmAppModal.type === 'reject') handleRejectApplication(confirmAppModal.lawyer)
          }}
          isLoading={actionAppLoading}
          title={confirmAppModal.type === 'accept' ? 'Accept Lawyer?' : 'Reject Lawyer?'}
          confirmText={confirmAppModal.type === 'accept' ? 'Accept' : 'Reject'}
        >
          <p className="text-gray-600 mb-6">
            {confirmAppModal.type === 'accept'
              ? `Are you sure you want to accept ${confirmAppModal.lawyer?.profile ? confirmAppModal.lawyer.profile.firstName + ' ' + confirmAppModal.lawyer.profile.lastName : confirmAppModal.lawyer?.lawyerId} for this case?`
              : `Are you sure you want to reject ${confirmAppModal.lawyer?.profile ? confirmAppModal.lawyer.profile.firstName + ' ' + confirmAppModal.lawyer.profile.lastName : confirmAppModal.lawyer?.lawyerId}?`}
          </p>
        </LogoutConfirmationModal>
      </motion.div>
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
            {currentUser.role === 'lawyer' && !caseData.lawyer && (
              <button 
                onClick={() => setIsApplyModalOpen(true)} 
                className="btn btn-primary"
              >
                Apply to Case
              </button>
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

      {/* Tabs Navigation */}
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
            {currentUser.role === 'client' && !caseData.lawyer && (
              <button
                onClick={() => setActiveTab('applicants')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'applicants'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applicants ({caseData.lawyerApplicants?.length || 0})
              </button>
            )}
            {/* Only show Applications tab if no lawyer is assigned */}
            {!caseDetails?.lawyerAssigned && (
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === 'applications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({parsedApplications.length || 0})
              </button>
            )}
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center ${
                activeTab === 'documents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents ({caseData.documents.length})
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
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Case Details</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{caseData.description}</p>
            {/* --- MOVE ASSIGNED LAWYER CARD TO BOTTOM --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Key Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Type:</strong> {caseData.type}</li>
                  <li><strong>Role:</strong> <span className="capitalize">{caseData.role}</span></li>
                  <li><strong>Budget:</strong> ${caseData.budget.toLocaleString()}</li>
                  <li><strong>Deadline:</strong> {caseData.deadline ? formatDate(caseData.deadline) : 'N/A'}</li>
                  <li><strong>Last Updated:</strong> {formatDate(caseData.updatedAt)}</li>
                </ul>
              </div>

              {/* Conditionally render Assigned Lawyer section (legacy) */}
              {caseData.lawyer && (currentUser.role === 'client' || currentUser.id === caseData.lawyer.id) && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Assigned Lawyer</h3>
                  <div className="flex items-center">
                    <img src={caseData.lawyer.photo} alt={caseData.lawyer.name} className="w-16 h-16 rounded-full mr-4"/>
                    <div>
                      <Link to={`/lawyer/${caseData.lawyer.id}`} className="font-semibold text-primary hover:underline">
                        {caseData.lawyer.name}
                      </Link>
                      <div className="text-sm text-gray-500">{caseData.lawyer.specializations.join(', ')}</div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium">{caseData.lawyer.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({caseData.lawyer.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* If no lawyer assigned and user is client, show a message */}
              {!caseData.lawyer && currentUser.role === 'client' && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Assigned Lawyer</h3>
                  <p className="text-gray-600 italic">
                    No lawyer has been assigned yet. View applicants to select representation.
                  </p>
                </div>
              )}
              {/* If lawyer is viewing and not assigned, show nothing */}
              {!caseData.lawyer && currentUser.role === 'lawyer' && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Assigned Lawyer</h3>
                  <p className="text-gray-600 italic">
                    A lawyer has not been assigned to this case yet.
                  </p>
                </div>
              )}
            </div>
            {/* --- ASSIGNED LAWYER CARD AT BOTTOM --- */}
            {renderAssignedLawyerCard()}
          </motion.div>
        )}

        {/* Conditionally render Applicants content */}
        {activeTab === 'applicants' && currentUser.role === 'client' && !caseData.lawyer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-semibold mb-4">Lawyer Applicants</h2>
            <p className="text-gray-700 mb-6">
              The following lawyers have applied to handle your case. Review their profiles and proposals to select the best match for your legal needs.
            </p>
            
            <div className="space-y-6">
              {caseData.lawyerApplicants.map((lawyer) => (
                <motion.div 
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={lawyer.photo} 
                          alt={lawyer.name} 
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                            <p className="text-gray-600">{lawyer.location}</p>
                            
                            <div className="flex items-center mt-1 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-4 w-4 ${i < Math.floor(lawyer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1 text-sm text-gray-600">{lawyer.rating}</span>
                              <span className="mx-1.5 text-gray-500">·</span>
                              <span className="text-sm text-gray-600">{lawyer.reviewCount} reviews</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {lawyer.specializations.map((spec, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                  {spec}
                                </span>
                              ))}
                            </div>
                            
                            <div className="text-sm text-gray-700 mb-4">
                              <p className="mb-2">{lawyer.coverLetter}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">Experience</span>
                                <p className="text-gray-900">{lawyer.yearsOfExperience} years</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Applied On</span>
                                <p className="text-gray-900">{formatDate(lawyer.appliedAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <Link 
                            to={`/client/lawyer/${lawyer.id}`} 
                            className="btn btn-sm btn-outline"
                          >
                            View Full Profile
                          </Link>
                          <button 
                            onClick={() => handleAppointLawyer(lawyer.id)}
                            className="btn btn-sm btn-primary"
                          >
                            Appoint Lawyer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'applications' && renderApplicationsTab()}

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

        {activeTab === 'timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-semibold mb-6">Case Timeline</h2>
            {renderTimeline()}
          </motion.div>
        )}

        {activeTab === 'messages' && renderMessagesTab()}
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