import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Mock data for clients and their cases
const mockClients = [
  {
    id: 'client-1',
    name: 'John Smith',
    company: 'Smith Enterprises',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    since: '2023-03-15',
    activeCases: 2,
    completedCases: 1,
    totalBilled: '$7,500',
    cases: [
      {
        id: 'case-1',
        title: 'Contract Dispute with Software Vendor',
        status: 'in_progress',
        startDate: '2023-05-15',
        type: 'Corporate Law',
        nextTask: 'Prepare mediation brief',
        nextTaskDue: '2023-07-10'
      },
      {
        id: 'case-2',
        title: 'Employee Stock Option Agreement',
        status: 'in_progress',
        startDate: '2023-06-05',
        type: 'Employment Law',
        nextTask: 'Review draft agreement',
        nextTaskDue: '2023-07-05'
      },
      {
        id: 'case-3',
        title: 'Terms of Service Update',
        status: 'completed',
        startDate: '2023-02-10',
        endDate: '2023-03-20',
        type: 'Technology Law'
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Emma Wilson',
    company: 'Wilson Creative',
    email: 'emma.wilson@example.com',
    phone: '(555) 987-6543',
    photo: 'https://randomuser.me/api/portraits/women/28.jpg',
    since: '2023-04-10',
    activeCases: 1,
    completedCases: 2,
    totalBilled: '$9,200',
    cases: [
      {
        id: 'case-4',
        title: 'Intellectual Property Infringement',
        status: 'in_progress',
        startDate: '2023-06-02',
        type: 'Intellectual Property',
        nextTask: 'Draft cease and desist letter',
        nextTaskDue: '2023-07-08'
      },
      {
        id: 'case-5',
        title: 'Trademark Registration',
        status: 'completed',
        startDate: '2023-04-15',
        endDate: '2023-05-25',
        type: 'Intellectual Property'
      },
      {
        id: 'case-6',
        title: 'Privacy Policy Update',
        status: 'completed',
        startDate: '2023-04-20',
        endDate: '2023-05-10',
        type: 'Technology Law'
      }
    ]
  },
  {
    id: 'client-3',
    name: 'David Chen',
    company: 'TechStart Inc.',
    email: 'david.chen@example.com',
    phone: '(555) 456-7890',
    photo: 'https://randomuser.me/api/portraits/men/42.jpg',
    since: '2023-05-20',
    activeCases: 2,
    completedCases: 0,
    totalBilled: '$4,300',
    cases: [
      {
        id: 'case-7',
        title: 'Seed Round Investment Agreement',
        status: 'in_progress',
        startDate: '2023-06-01',
        type: 'Corporate Law',
        nextTask: 'Investor due diligence',
        nextTaskDue: '2023-07-15'
      },
      {
        id: 'case-8',
        title: 'Employment Contract Review',
        status: 'in_progress',
        startDate: '2023-06-20',
        type: 'Employment Law',
        nextTask: 'Draft revised contracts',
        nextTaskDue: '2023-07-12'
      }
    ]
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
    case 'in_progress':
      return <span className="badge bg-blue-100 text-blue-800">In Progress</span>
    case 'completed':
      return <span className="badge bg-green-100 text-green-800">Completed</span>
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>
  }
}

const MyClientsPage = () => {
  const [expandedClient, setExpandedClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter clients based on search query
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cases.some(caseItem => 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )
  
  // Toggle expanded client
  const toggleClient = (clientId) => {
    if (expandedClient === clientId) {
      setExpandedClient(null)
    } else {
      setExpandedClient(clientId)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <p className="text-gray-600 mt-1">Manage your client relationships and cases</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search clients or cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card bg-white overflow-hidden"
            >
              {/* Client Summary */}
              <div className="flex flex-col md:flex-row md:items-center justify-between cursor-pointer" onClick={() => toggleClient(client.id)}>
                <div className="flex items-center mb-4 md:mb-0">
                  <img 
                    src={client.photo} 
                    alt={client.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{client.name}</h3>
                    <div className="text-sm text-gray-600">{client.company}</div>
                    <div className="text-xs text-gray-500">Client since {formatDate(client.since)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{client.activeCases}</div>
                    <div className="text-xs text-gray-500">Active Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{client.completedCases}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{client.totalBilled}</div>
                    <div className="text-xs text-gray-500">Total Billed</div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedClient === client.id ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Client Details - Expanded View */}
              {expandedClient === client.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{client.company}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button className="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button className="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </button>
                      <button className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Case
                      </button>
                    </div>
                  </div>
                  
                  {/* Client Cases */}
                  <h4 className="text-lg font-medium mb-4">Client Cases</h4>
                  <div className="space-y-4 mb-4">
                    {client.cases.map(caseItem => (
                      <div 
                        key={caseItem.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-3 md:mb-0">
                            <div className="flex items-center mb-1">
                              {getStatusBadge(caseItem.status)}
                              <span className="text-xs text-gray-500 ml-2">
                                Started {formatDate(caseItem.startDate)}
                                {caseItem.endDate && ` • Completed ${formatDate(caseItem.endDate)}`}
                              </span>
                            </div>
                            <Link to={`/lawyer/case/${caseItem.id}`} className="text-lg font-medium text-gray-900 hover:text-primary">
                              {caseItem.title}
                            </Link>
                            <div className="text-sm text-gray-600">{caseItem.type}</div>
                          </div>
                          
                          {caseItem.status === 'in_progress' && (
                            <div>
                              <div className="text-sm font-medium">Next: {caseItem.nextTask}</div>
                              <div className="text-xs text-gray-500">Due by {formatDate(caseItem.nextTaskDue)}</div>
                            </div>
                          )}
                          
                          <div className="mt-3 md:mt-0">
                            <Link to={`/lawyer/case/${caseItem.id}`} className="btn btn-outline text-sm py-1 px-4">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">You don't have any clients yet or your search didn't match any clients.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyClientsPage 