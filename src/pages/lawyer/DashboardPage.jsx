import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data for the dashboard
const mockStats = [
  { title: 'Active Clients', value: 5, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'bg-blue-500' },
  { title: 'Open Applications', value: 8, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-yellow-500' },
  { title: 'Completed Cases', value: 12, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-green-500' },
]

const mockCases = [
  { 
    id: 'case-1', 
    title: 'Contract Dispute with Software Vendor', 
    status: 'in_progress', 
    clientName: 'John Smith',
    clientPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: '2023-05-15',
    type: 'Corporate Law'
  },
  { 
    id: 'case-2', 
    title: 'Intellectual Property Infringement', 
    status: 'in_progress', 
    clientName: 'Emma Wilson',
    clientPhoto: 'https://randomuser.me/api/portraits/women/28.jpg',
    createdAt: '2023-06-02',
    type: 'Intellectual Property'
  },
  { 
    id: 'case-3', 
    title: 'Employment Contract Review', 
    status: 'pending_approval', 
    clientName: 'David Chen',
    clientPhoto: 'https://randomuser.me/api/portraits/men/42.jpg',
    createdAt: '2023-06-20',
    type: 'Employment Law'
  },
]

const mockAvailableCases = [
  {
    id: 'available-1',
    title: 'Trademark Registration Assistance',
    type: 'Intellectual Property',
    budget: '$2,000 - $3,500',
    postedAt: '2023-07-01',
    applicants: 3
  },
  {
    id: 'available-2',
    title: 'Workplace Discrimination Lawsuit',
    type: 'Employment Law',
    budget: '$5,000 - $8,000',
    postedAt: '2023-06-28',
    applicants: 7
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
    case 'pending_approval':
      return <span className="badge bg-yellow-100 text-yellow-800">Pending Approval</span>
    case 'completed':
      return <span className="badge bg-green-100 text-green-800">Completed</span>
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>
  }
}

const DashboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your cases and clients</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mockStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card bg-white flex items-center"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mr-4 text-white`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">{stat.title}</div>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/lawyer/available-cases" className="card bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Find New Cases</div>
                <div className="text-sm text-gray-500">Browse available legal matters</div>
              </div>
            </div>
          </Link>

          <Link to="/lawyer/my-applications" className="card bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">My Applications</div>
                <div className="text-sm text-gray-500">Track your case applications</div>
              </div>
            </div>
          </Link>

          <Link to="/lawyer/my-clients" className="card bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">My Clients</div>
                <div className="text-sm text-gray-500">Manage your client relationships</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active Cases */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Cases</h2>
            <Link to="/lawyer/my-clients" className="text-primary hover:underline text-sm font-medium">
              View All Cases
            </Link>
          </div>

          <div className="space-y-4">
            {mockCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      {getStatusBadge(caseItem.status)}
                      <span className="text-xs text-gray-500 ml-2">Since {formatDate(caseItem.createdAt)}</span>
                    </div>
                    <Link to={`/lawyer/case/${caseItem.id}`} className="text-lg font-medium text-gray-900 hover:text-primary mb-1 block">
                      {caseItem.title}
                    </Link>
                    <div className="text-sm text-gray-500">{caseItem.type}</div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <img 
                        src={caseItem.clientPhoto} 
                        alt={caseItem.clientName} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium">{caseItem.clientName}</div>
                        <div className="text-xs text-gray-500">Client</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Available Cases */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Opportunities</h2>
            <Link to="/lawyer/available-cases" className="text-primary hover:underline text-sm font-medium">
              View All Available Cases
            </Link>
          </div>

          <div className="space-y-4">
            {mockAvailableCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card bg-white"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <span className="badge bg-green-100 text-green-800">New Case</span>
                    <span className="text-xs text-gray-500 ml-2">Posted {formatDate(caseItem.postedAt)}</span>
                  </div>
                  <Link to={`/lawyer/available-cases`} className="text-lg font-medium text-gray-900 hover:text-primary mb-1 block">
                    {caseItem.title}
                  </Link>
                  <div className="flex flex-wrap items-center mt-2">
                    <div className="text-sm text-gray-600 mr-4">{caseItem.type}</div>
                    <div className="text-sm font-medium">{caseItem.budget}</div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-500">{caseItem.applicants} lawyers applied</div>
                    <Link to={`/lawyer/available-cases`} className="btn btn-primary text-sm py-1 px-4">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 