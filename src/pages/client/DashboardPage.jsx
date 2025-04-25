import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data for the dashboard
const mockStats = [
  { title: 'Active Cases', value: 3, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-blue-500' },
  { title: 'Pending Applications', value: 7, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-yellow-500' },
  { title: 'Closed Cases', value: 2, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-500' },
]

const mockCases = [
  { 
    id: 'case-1', 
    title: 'Contract Dispute with Software Vendor', 
    status: 'in_progress', 
    createdAt: '2023-05-15', 
    lawyerName: 'Sarah Johnson',
    lawyerPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'Corporate Law'
  },
  { 
    id: 'case-2', 
    title: 'Intellectual Property Infringement', 
    status: 'in_progress', 
    createdAt: '2023-06-02', 
    lawyerName: 'Michael Chen',
    lawyerPhoto: 'https://randomuser.me/api/portraits/men/22.jpg',
    type: 'Intellectual Property'
  },
  { 
    id: 'case-3', 
    title: 'Employment Contract Review', 
    status: 'pending', 
    createdAt: '2023-06-20', 
    lawyerName: null,
    lawyerPhoto: null,
    type: 'Employment Law',
    applications: 3
  },
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

const DashboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your legal matters</p>
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
          <Link to="/client/create-case" className="card bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Create New Case</div>
                <div className="text-sm text-gray-500">Post a new legal matter</div>
              </div>
            </div>
          </Link>

          <Link to="/client/find-lawyer" className="card bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Find a Lawyer</div>
                <div className="text-sm text-gray-500">Browse lawyer profiles</div>
              </div>
            </div>
          </Link>

          <Link to="/client/my-cases" className="card bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-medium">View All Cases</div>
                <div className="text-sm text-gray-500">Manage your existing cases</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Cases */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Cases</h2>
          <Link to="/client/my-cases" className="text-primary hover:underline text-sm font-medium">
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
                    <span className="text-xs text-gray-500 ml-2">Created {formatDate(caseItem.createdAt)}</span>
                  </div>
                  <Link to={`/client/case/${caseItem.id}`} className="text-lg font-medium text-gray-900 hover:text-primary mb-1 block">
                    {caseItem.title}
                  </Link>
                  <div className="text-sm text-gray-500">{caseItem.type}</div>
                </div>

                <div>
                  {caseItem.lawyerName ? (
                    <div className="flex items-center">
                      <img 
                        src={caseItem.lawyerPhoto} 
                        alt={caseItem.lawyerName} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium">{caseItem.lawyerName}</div>
                        <div className="text-xs text-gray-500">Assigned Lawyer</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-gray-700">{caseItem.applications} Applications</div>
                      <Link 
                        to={`/client/case/${caseItem.id}`} 
                        className="text-xs text-primary hover:underline"
                      >
                        Review Applications
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 