import { useState } from 'react'
import { motion } from 'framer-motion'

// Mock data for applications
const mockApplications = [
  {
    id: 'app-1',
    caseId: 'case-1',
    caseTitle: 'International Trademark Registration Assistance',
    clientName: 'TechSolutions Inc.',
    clientPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    appliedAt: '2023-07-02',
    status: 'pending',
    proposedFee: '$3,500',
    estimatedTime: '3 weeks',
    cover: 'I have extensive experience with international trademark registrations across multiple jurisdictions including the EU, UK, and several Asian countries. Ive successfully handled similar cases for technology companies and can ensure a smooth process for your trademark registration needs.'
  },
  {
    id: 'app-2',
    caseId: 'case-2',
    caseTitle: 'Employment Contract Review for Tech Startup',
    clientName: 'InnovateTech',
    clientPhoto: 'https://randomuser.me/api/portraits/women/28.jpg',
    appliedAt: '2023-06-30',
    status: 'in_review',
    proposedFee: '$2,000',
    estimatedTime: '1 week',
    cover: 'With my background in employment law specifically for technology companies, I can provide comprehensive review of your executive employment contracts. I understand the unique needs of startups and can help ensure your contracts are both protective and attractive to potential executives.'
  },
  {
    id: 'app-3',
    caseId: 'case-3',
    caseTitle: 'Corporate Restructuring Assistance',
    clientName: 'Midwest Manufacturing',
    clientPhoto: 'https://randomuser.me/api/portraits/men/42.jpg',
    appliedAt: '2023-06-27',
    status: 'rejected',
    proposedFee: '$12,000',
    estimatedTime: '2 months',
    cover: 'I have handled corporate restructuring for manufacturing companies of similar size and can provide comprehensive legal guidance on structure, tax implications, and employee transitions. My experience includes working with companies undergoing similar transformations in the Midwest region.'
  },
  {
    id: 'app-4',
    caseId: 'case-4',
    caseTitle: 'Software License Agreement Review',
    clientName: 'CloudSoft Systems',
    clientPhoto: 'https://randomuser.me/api/portraits/women/56.jpg',
    appliedAt: '2023-06-29',
    status: 'accepted',
    proposedFee: '$2,500',
    estimatedTime: '10 days',
    cover: 'As a lawyer specializing in software licensing, I have negotiated hundreds of SaaS agreements for enterprise clients. I understand both the technical and legal aspects of these agreements and can ensure your interests are protected while maintaining positive client relationships.'
  }
]

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
  
  // Filter applications based on selected status
  const filteredApplications = activeFilter === 'all' 
    ? mockApplications 
    : mockApplications.filter(app => app.status === activeFilter)

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Proposed Fee</div>
                    <div className="font-medium">{application.proposedFee}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Estimated Time</div>
                    <div className="font-medium">{application.estimatedTime}</div>
                  </div>
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
                      <button className="btn btn-primary text-sm py-1 px-4">
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
            <button className="btn btn-primary">Browse Available Cases</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplicationsPage 