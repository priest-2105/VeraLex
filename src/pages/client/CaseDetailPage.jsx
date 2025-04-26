import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data for a case
const mockCase = {
  id: 'case-123',
  title: 'Contract Dispute with Software Vendor',
  description: 'We entered into a software development agreement with TechCorp in January 2023. They have failed to deliver key features specified in our contract and missed multiple deadlines. We need legal representation to review our options for terminating the contract and potentially seeking damages for delays and incomplete work.',
  status: 'in_progress',
  type: 'Corporate Law',
  role: 'plaintiff',
  budget: 5000,
  createdAt: '2023-05-15',
  updatedAt: '2023-06-10',
  deadline: '2023-08-30',
  documents: [
    { name: 'Original_Contract.pdf', size: '2.4 MB', uploadedAt: '2023-05-15' },
    { name: 'Email_Correspondence.zip', size: '1.8 MB', uploadedAt: '2023-05-15' },
    { name: 'Development_Timeline.xlsx', size: '0.5 MB', uploadedAt: '2023-05-20' }
  ],
  lawyer: {
    id: 'lawyer-1',
    name: 'Sarah Johnson',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    specializations: ['Corporate Law', 'Contract Law'],
    rating: 4.8,
    reviewCount: 124,
    yearsOfExperience: 12,
    location: 'New York, NY',
    email: 'sarah.johnson@example.com',
    phone: '(212) 555-1234',
    assignedAt: '2023-05-20'
  },
  timeline: [
    { date: '2023-05-15', action: 'Case created', actor: 'Client' },
    { date: '2023-05-18', action: 'Lawyer application received', actor: 'Sarah Johnson' },
    { date: '2023-05-20', action: 'Lawyer assigned to case', actor: 'Client' },
    { date: '2023-05-22', action: 'Initial consultation scheduled', actor: 'Sarah Johnson' },
    { date: '2023-05-25', action: 'Initial consultation completed', actor: 'Sarah Johnson' },
    { date: '2023-06-01', action: 'Cease and desist letter drafted', actor: 'Sarah Johnson' },
    { date: '2023-06-05', action: 'Cease and desist letter approved', actor: 'Client' },
    { date: '2023-06-08', action: 'Cease and desist letter sent to TechCorp', actor: 'Sarah Johnson' },
    { date: '2023-06-10', action: 'Response received from TechCorp', actor: 'Sarah Johnson' },
  ],
  messages: [
    { id: 1, sender: 'lawyer', text: 'Hello! I\'ve reviewed the documents you provided. We have a strong case based on the contract terms.', timestamp: '2023-05-21T14:30:00' },
    { id: 2, sender: 'client', text: 'Thank you for taking a look. What do you think our next steps should be?', timestamp: '2023-05-21T15:45:00' },
    { id: 3, sender: 'lawyer', text: 'I recommend we start with a formal cease and desist letter outlining the contract breaches. This often leads to negotiation without going to court.', timestamp: '2023-05-22T09:15:00' },
    { id: 4, sender: 'client', text: 'That sounds like a good approach. How long will it take to prepare the letter?', timestamp: '2023-05-22T10:30:00' },
    { id: 5, sender: 'lawyer', text: 'I can have a draft ready for your review by June 1st. Once you approve, we can send it immediately.', timestamp: '2023-05-22T11:05:00' },
    { id: 6, sender: 'client', text: 'Perfect. Please proceed with drafting the letter.', timestamp: '2023-05-22T13:20:00' },
  ]
}

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

const CaseDetailPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [caseData, setCaseData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  // Simulate loading case data
  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCaseData(mockCase)
      } catch (error) {
        console.error('Error fetching case data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseData()
  }, [id])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    // Add new message to the list
    const newMsg = {
      id: caseData.messages.length + 1,
      sender: 'client',
      text: newMessage,
      timestamp: new Date().toISOString()
    }
    
    setCaseData(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }))
    
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
            <button className="btn btn-outline">
              Edit Case
            </button>
            {caseData.status === 'in_progress' && (
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
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'documents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'messages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages
              <span className="ml-2 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
                {caseData.messages.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Case Details */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Case Details</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-800 whitespace-pre-line">{caseData.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                    <div>{getStatusBadge(caseData.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Case Type</h3>
                    <p>{caseData.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Your Role</h3>
                    <p className="capitalize">{caseData.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Budget</h3>
                    <p>${caseData.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created On</h3>
                    <p>{formatDate(caseData.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Deadline</h3>
                    <p>{formatDate(caseData.deadline)}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {caseData.timeline.slice(-3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-4 w-4 rounded-full bg-primary mt-1 mr-3"></div>
                          <div>
                            <p className="text-sm text-gray-800">{item.action}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.date)} by {item.actor}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setActiveTab('timeline')}
                      className="text-primary hover:underline text-sm mt-3"
                    >
                      View full timeline
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Lawyer Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Assigned Lawyer</h2>
                {caseData.lawyer ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start">
                        <img 
                          src={caseData.lawyer.photo} 
                          alt={caseData.lawyer.name} 
                          className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{caseData.lawyer.name}</h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="ml-1 text-sm font-medium">{caseData.lawyer.rating}</span>
                            </div>
                            <span className="mx-2 text-xs text-gray-500">|</span>
                            <span className="text-xs text-gray-500">{caseData.lawyer.reviewCount} reviews</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">{caseData.lawyer.location}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {caseData.lawyer.specializations.map((spec) => (
                            <span key={spec} className="badge bg-primary/10 text-primary px-2 py-1 text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          {caseData.lawyer.yearsOfExperience} years of experience
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Assigned on {formatDate(caseData.lawyer.assignedAt)}
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${caseData.lawyer.email}`} className="text-primary hover:underline">
                              {caseData.lawyer.email}
                            </a>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${caseData.lawyer.phone}`} className="text-primary hover:underline">
                              {caseData.lawyer.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setActiveTab('messages')} 
                          className="w-full btn btn-sm btn-primary"
                        >
                          Send Message
                        </button>
                        <Link to={`/client/lawyer/${caseData.lawyer.id}`} className="w-full btn btn-sm btn-outline">
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    <p className="text-sm font-medium">No lawyer assigned yet</p>
                    <p className="text-xs mt-1">
                      You will be notified when lawyers apply to your case.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
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
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Messages</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Messages List */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                  {caseData.messages.length > 0 ? (
                    caseData.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-lg p-3 ${
                            message.sender === 'client' 
                              ? 'bg-primary/10 text-gray-900' 
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm">{message.text}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="input flex-grow mr-2"
                      placeholder="Type your message..."
                    />
                    <button 
                      type="submit"
                      className="btn btn-primary flex-shrink-0"
                      disabled={!newMessage.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Case Timeline</h2>
              
              <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary before:to-gray-200">
                {caseData.timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-0 -translate-x-full transform -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                        <h3 className="text-base font-medium text-gray-900">{item.action}</h3>
                        <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
                      </div>
                      <p className="text-sm text-gray-600">By {item.actor}</p>
                    </div>
                  </div>
                ))}
                
                {/* Starting point */}
                <div className="relative">
                  <div className="absolute left-0 -translate-x-full transform -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                      <h3 className="text-base font-medium text-gray-900">Case Created</h3>
                      <time className="text-xs text-gray-500">{formatDate(caseData.createdAt)}</time>
                    </div>
                    <p className="text-sm text-gray-600">Case was created and posted to the marketplace</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaseDetailPage 