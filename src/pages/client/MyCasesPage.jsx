import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data for cases
const mockCases = [
  { 
    id: 'case-1', 
    title: 'Contract Dispute with Software Vendor', 
    status: 'in_progress', 
    createdAt: '2023-05-15', 
    updatedAt: '2023-06-10',
    lawyerName: 'Sarah Johnson',
    lawyerPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'Corporate Law',
    budget: 5000
  },
  { 
    id: 'case-2', 
    title: 'Intellectual Property Infringement', 
    status: 'in_progress', 
    createdAt: '2023-06-02', 
    updatedAt: '2023-06-15',
    lawyerName: 'Michael Chen',
    lawyerPhoto: 'https://randomuser.me/api/portraits/men/22.jpg',
    type: 'Intellectual Property',
    budget: 7500
  },
  { 
    id: 'case-3', 
    title: 'Employment Contract Review', 
    status: 'pending', 
    createdAt: '2023-06-20', 
    updatedAt: '2023-06-20',
    lawyerName: null,
    lawyerPhoto: null,
    type: 'Employment Law',
    budget: 1200,
    applications: 3
  },
  { 
    id: 'case-4', 
    title: 'Real Estate Purchase Agreement', 
    status: 'closed', 
    createdAt: '2023-04-10', 
    updatedAt: '2023-05-30',
    lawyerName: 'Jennifer Williams',
    lawyerPhoto: 'https://randomuser.me/api/portraits/women/67.jpg',
    type: 'Real Estate',
    budget: 3000
  },
  { 
    id: 'case-5', 
    title: 'Personal Injury Claim', 
    status: 'pending', 
    createdAt: '2023-06-18', 
    updatedAt: '2023-06-18',
    lawyerName: null,
    lawyerPhoto: null,
    type: 'Personal Injury',
    budget: 8000,
    applications: 1
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

const MyCasesPage = () => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  // Filter cases based on selected filter and search
  const filteredCases = mockCases.filter(caseItem => {
    // Filter by status
    if (filter !== 'all' && caseItem.status !== filter) {
      return false
    }
    
    // Filter by search term
    if (search) {
      return (
        caseItem.title.toLowerCase().includes(search.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return true
  })

  // Sort cases based on selected sort option
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'date_desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      case 'budget_asc':
        return a.budget - b.budget
      case 'budget_desc':
        return b.budget - a.budget
      default:
        return 0
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        <p className="text-gray-600 mt-1">Manage and track all your legal cases</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Cases
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
                placeholder="Search by title or type..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Cases</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="filed">Filed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
              <option value="budget_desc">Budget (High to Low)</option>
              <option value="budget_asc">Budget (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {sortedCases.length > 0 ? (
          sortedCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      {getStatusBadge(caseItem.status)}
                      <span className="text-xs text-gray-500 ml-2">Created {formatDate(caseItem.createdAt)}</span>
                    </div>
                    <Link to={`/client/case/${caseItem.id}`} className="text-lg font-medium text-gray-900 hover:text-primary mb-1 block">
                      {caseItem.title}
                    </Link>
                    <div className="text-sm text-gray-500 mb-2">{caseItem.type}</div>
                    <div className="text-sm font-medium">Budget: ${caseItem.budget.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center">
                    {caseItem.lawyerName ? (
                      <div className="flex items-center mr-4">
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
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-700">{caseItem.applications || 0} Applications</div>
                        {caseItem.applications > 0 && (
                          <Link 
                            to={`/client/case/${caseItem.id}`} 
                            className="text-xs text-primary hover:underline"
                          >
                            Review Applications
                          </Link>
                        )}
                      </div>
                    )}

                    <Link 
                      to={`/client/case/${caseItem.id}`} 
                      className="btn btn-sm btn-outline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t text-sm">
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-500">Last updated: {formatDate(caseItem.updatedAt)}</span>
                  </div>
                  {caseItem.status === 'pending' && !caseItem.lawyerName && (
                    <span className="text-blue-600">Awaiting lawyer assignment</span>
                  )}
                  {caseItem.status === 'in_progress' && (
                    <span className="text-green-600">Active case</span>
                  )}
                  {caseItem.status === 'closed' && (
                    <span className="text-gray-600">Case completed</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600 mb-6">
              {search ? 'No cases match your search criteria.' : 'You have no cases matching the selected filter.'}
            </p>
            <Link to="/client/create-case" className="btn btn-primary">
              Create a New Case
            </Link>
          </div>
        )}
      </div>

      {/* Create New Case Button (Only shown when there are cases) */}
      {sortedCases.length > 0 && (
        <div className="mt-8 text-center">
          <Link to="/client/create-case" className="btn btn-primary">
            Create a New Case
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyCasesPage 