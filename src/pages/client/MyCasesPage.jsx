import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { databases, account } from '../../lib/appwrite'
import { Query } from 'appwrite'
import Alert from '../../components/common/Alert'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID

// Available case types for filter
const caseTypes = [
  'Corporate Law',
  'Contract Law',
  'Intellectual Property',
  'Technology Law',
  'Real Estate',
  'Property Law',
  'Family Law',
  'Divorce',
  'Employment Law',
  'Labor Relations',
  'Criminal Defense',
  'Civil Rights',
  'Personal Injury',
  'Medical Malpractice',
  'Tax Law',
  'Immigration',
  'Environmental Law',
  'Bankruptcy'
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
  const currentUser = useSelector(selectCurrentUser) // Get current user from Redux store
  const [cases, setCases] = useState([])
  const [caseDetails, setCaseDetails] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [sortBy, setSortBy] = useState('date_desc')

  // Fetch cases and their details from Appwrite
  useEffect(() => {
    const fetchCasesAndDetails = async () => {
      if (!currentUser?.$id) {
        setError('Please log in to view your cases')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')
      
      try {
        // 1. Fetch cases owned by the current user
        const casesResponse = await databases.listDocuments(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          [
            Query.equal('userId', currentUser.$id), // Use the current user's ID from Redux
            Query.limit(100)
          ]
        )

        console.log('=== Cases Collection Info ===')
        console.log('Current User ID:', currentUser.$id)
        console.log('Collection ID:', CASES_COLLECTION_ID)
        console.log('Total Cases:', casesResponse.total)
        console.log('Cases:', casesResponse.documents)

        // 2. Fetch case details for all cases
        const caseIds = casesResponse.documents.map(caseItem => caseItem.$id)
        const detailsPromises = caseIds.map(caseId => 
          databases.listDocuments(
            DATABASE_ID,
            CASE_DETAILS_COLLECTION_ID,
            [
              Query.equal('caseId', caseId), // Use the document ID as caseId
              Query.limit(1)
            ]
          )
        )

        const detailsResponses = await Promise.all(detailsPromises)
        
        // Create a map of caseId to details
        const detailsMap = {}
        detailsResponses.forEach((response, index) => {
          const caseId = caseIds[index]
          if (response.documents.length > 0) {
            // Store the details with the case's document ID as the key
            detailsMap[caseId] = response.documents[0]
          }
        })

        console.log('=== Case Details Collection Info ===')
        console.log('Collection ID:', CASE_DETAILS_COLLECTION_ID)
        console.log('Case Details Map:', detailsMap)

        setCases(casesResponse.documents)
        setCaseDetails(detailsMap)
      } catch (error) {
        console.error('Error fetching cases and details:', error)
        if (error.code === 401) {
          setError('Please log in to view your cases')
        } else {
          setError('Failed to load cases. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCasesAndDetails()
  }, [currentUser]) // Add currentUser as a dependency

  // Toggle case type in filter
  const toggleCaseType = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  // Filter cases based on selected filters
  const filteredCases = cases.filter(caseItem => {
    // Filter by status
    if (filter !== 'all' && caseItem.status !== filter) {
      return false
    }
    
    // Filter by case type
    if (selectedTypes.length > 0 && !selectedTypes.includes(caseItem.caseType)) {
      return false
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        caseItem.title.toLowerCase().includes(searchLower) ||
        caseItem.caseType.toLowerCase().includes(searchLower) ||
        (caseItem.description && caseItem.description.toLowerCase().includes(searchLower))
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
        return (parseFloat(a.budget) || 0) - (parseFloat(b.budget) || 0)
      case 'budget_desc':
        return (parseFloat(b.budget) || 0) - (parseFloat(a.budget) || 0)
      default:
        return 0
    }
  })

  // Helper function to get case status with details
  const getCaseStatus = (caseItem) => {
    const details = caseDetails[caseItem.$id]
    
    if (caseItem.status === 'closed') {
      return {
        badge: getStatusBadge('closed'),
        message: 'Case completed'
      }
    }
    
    if (details?.lawyerAssigned) {
      return {
        badge: getStatusBadge('in_progress'),
        message: 'Active case'
      }
    }
    
    if (details?.applications?.length > 0) {
      return {
        badge: getStatusBadge('pending'),
        message: `${details.applications.length} lawyer${details.applications.length === 1 ? '' : 's'} applied`
      }
    }
    
    return {
      badge: getStatusBadge('pending'),
      message: 'Awaiting lawyer assignment'
    }
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
      <div className="bg-white rounded-lg shadow-md p-8">
        <Alert 
          type="error" 
          message={error} 
          className="mb-6"
        />
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
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        <p className="text-gray-600 mt-1">Manage and track all your legal cases</p>
      </div>

      {!currentUser?.$id ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Alert 
            type="error" 
            message="Please log in to view your cases" 
            className="mb-6"
          />
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search Input */}
              <div className="lg:col-span-1">
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
              <div className="lg:col-span-1">
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
              <div className="lg:col-span-1">
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

              {/* Reset Filters */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setFilter('all')
                    setSelectedTypes([])
                    setSortBy('date_desc')
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            {/* Case Types Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Types
              </label>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1 bg-gray-50 p-4 rounded-lg">
                {caseTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={`type-${type}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleCaseType(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {sortedCases.length > 0 ? (
              sortedCases.map((caseItem, index) => {
                const details = caseDetails[caseItem.$id]
                const status = getCaseStatus(caseItem)
                
                return (
                  <motion.div
                    key={caseItem.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            {status.badge}
                            <span className="text-xs text-gray-500 ml-2">Created {formatDate(caseItem.createdAt)}</span>
                          </div>
                          <Link to={`/client/case/${caseItem.$id}`} className="text-lg font-medium text-gray-900 hover:text-primary mb-1 block">
                            {caseItem.title}
                          </Link>
                          <div className="text-sm text-gray-500 mb-2">{caseItem.caseType}</div>
                          <div className="text-sm font-medium">Budget: ${parseFloat(caseItem.budget).toLocaleString()}</div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {details?.lawyerAssigned ? (
                            <div className="flex items-center mr-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Lawyer Assigned</div>
                                <Link 
                                  to={`/client/lawyer/${details.lawyerAssigned}`}
                                  className="text-xs text-primary hover:underline"
                                >
                                  View Lawyer Profile
                                </Link>
                              </div>
                            </div>
                          ) : details?.applications?.length > 0 ? (
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-700">
                                {details.applications.length} Application{details.applications.length === 1 ? '' : 's'}
                              </div>
                              <Link 
                                to={`/client/case/${caseItem.$id}`} 
                                className="text-xs text-primary hover:underline"
                              >
                                Review Applications
                              </Link>
                            </div>
                          ) : null}

                          <Link 
                            to={`/client/case/${caseItem.$id}`} 
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
                          <span className="text-gray-500">Last updated: {formatDate(details?.lastUpdated || caseItem.updatedAt)}</span>
                        </div>
                        <span className={status.message.includes('completed') ? 'text-gray-600' : 
                                       status.message.includes('Active') ? 'text-green-600' : 
                                       'text-blue-600'}>
                          {status.message}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
                <p className="text-gray-600 mb-6">
                  {search || selectedTypes.length > 0 || filter !== 'all' 
                    ? 'No cases match your search criteria.' 
                    : 'You have no cases yet.'}
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
        </>
      )}
    </div>
  )
}

export default MyCasesPage 