import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { databases } from '../../lib/appwrite'
import {  Query } from 'appwrite'
import LoadingSpinner from '../../components/common/LoadingSpinner'


// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID

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
  const currentUser = useSelector(selectCurrentUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingCases: 0,
    closedCases: 0
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.$id) {
        setError('Please log in to view your dashboard')
        setLoading(false)
        return
      }

      try {
        // Fetch all cases for the current user
        const casesResponse = await databases.listDocuments(
          DATABASE_ID,
          CASES_COLLECTION_ID,
          [
            Query.equal('userId', currentUser.$id),
            Query.orderDesc('createdAt'),
            Query.limit(3) // Only get 3 most recent cases
          ]
        )

        const casesData = casesResponse.documents

        // Calculate statistics based on case status
        const activeCases = casesData.filter(caseItem => 
          caseItem.status === 'active'
        ).length

        const pendingCases = casesData.filter(caseItem => 
          caseItem.status === 'pending'
        ).length

        const closedCases = casesData.filter(caseItem => 
          caseItem.status === 'closed'
        ).length

        setCases(casesData) // No need to slice since we're already limiting to 3
        setStats({
          activeCases,
          pendingCases,
          closedCases
        })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        {!currentUser && (
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        )}
      </div>
    )
  }

  const dashboardStats = [
    { 
      title: 'Active Cases', 
      value: stats.activeCases, 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Pending Cases', 
      value: stats.pendingCases, 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Closed Cases', 
      value: stats.closedCases, 
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 
      color: 'bg-green-500' 
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your legal matters</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
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

        {cases.length === 0 ? (
          <div className="card bg-white text-center py-8">
            <div className="text-gray-500 mb-4">You haven't created any cases yet</div>
            <Link to="/client/create-case" className="btn btn-primary">
              Create Your First Case
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cases.map((caseItem, index) => (
              <motion.div
                key={caseItem.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card bg-white"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    {getStatusBadge(caseItem.status || 'pending')}
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(caseItem.createdAt)}
                    </span>
                  </div>
                  <Link 
                    to={`/client/case/${caseItem.$id}`} 
                    className="text-lg font-medium text-gray-900 hover:text-primary mb-2 block"
                  >
                    {caseItem.title}
                  </Link>
                  <div className="text-sm text-gray-500 mb-2">{caseItem.caseType}</div>
                  <div className="text-sm text-gray-500 mb-4">
                    Budget: ${caseItem.budget?.toLocaleString() || 'Not specified'}
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">
                        {caseItem.role === 'client' ? 'Client Case' : 'Lawyer Case'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {formatDate(caseItem.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage 