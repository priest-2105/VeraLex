import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { databases } from '../../lib/appwrite'
import { Query } from 'appwrite'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Constants
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const LawyerMyClientsPage = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser?.$id) return

      setIsLoading(true)
      setError('')
      
      try {
        // 1. Get all case details where lawyerAssigned == currentUser.$id
        const caseDetailsRes = await databases.listDocuments(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          [Query.equal('lawyerAssigned', currentUser.$id)]
        )

        if (!caseDetailsRes.documents.length) {
          setClients([])
          setIsLoading(false)
          return
        }

        // 2. Get all the case documents for these case details
        const casePromises = caseDetailsRes.documents.map(async (caseDetail) => {
          try {
            const caseDoc = await databases.getDocument(
              DATABASE_ID,
              CASES_COLLECTION_ID,
              caseDetail.caseId
            )
            return {
              caseId: caseDetail.caseId,
              userId: caseDoc.userId,
              caseTitle: caseDoc.title,
              caseType: caseDoc.caseType,
              caseStatus: caseDoc.status,
              assignedAt: caseDetail.lawyerAssignedAt || caseDetail.$createdAt,
              lastActivity: caseDetail.lastUpdated || caseDoc.updatedAt || caseDoc.createdAt,
            }
          } catch (err) {
            console.error(`Failed to fetch case ${caseDetail.caseId}:`, err)
            return null
          }
        })

        const cases = (await Promise.all(casePromises)).filter(Boolean)

        // 3. Get unique client IDs and fetch their profiles
        const uniqueClientIds = [...new Set(cases.map(c => c.userId))]
        
        const clientPromises = uniqueClientIds.map(async (clientId) => {
          try {
            const profileRes = await databases.listDocuments(
              DATABASE_ID,
              PROFILE_COLLECTION_ID,
              [
                Query.equal('userId', clientId),
                Query.equal('role', 'client'),
                Query.limit(1)
              ]
            )

            if (profileRes.documents.length > 0) {
              const clientProfile = profileRes.documents[0]
              
              // Get all cases for this client
              const clientCases = cases.filter(c => c.userId === clientId)
              
              return {
                id: clientId,
                name: `${clientProfile.firstName || ''} ${clientProfile.lastName || ''}`.trim() || 'Unknown',
                email: clientProfile.email,
                phone: clientProfile.phone || 'N/A',
                profileImage: clientProfile.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
                bio: clientProfile.bio || '',
                address: clientProfile.address || 'N/A',
                totalCases: clientCases.length,
                activeCases: clientCases.filter(c => c.caseStatus !== 'closed').length,
                lastActivity: clientCases.length > 0 
                  ? Math.max(...clientCases.map(c => new Date(c.lastActivity).getTime()))
                  : null,
                cases: clientCases
              }
            }
            return null
          } catch (err) {
            console.error(`Failed to fetch profile for client ${clientId}:`, err)
            return null
          }
        })

        const clientData = (await Promise.all(clientPromises)).filter(Boolean)
        setClients(clientData)

      } catch (err) {
        console.error('Error fetching clients:', err)
        setError('Failed to load clients. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [currentUser?.$id])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <p className="text-gray-600 mt-1">Clients you are currently representing</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-red-600">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card bg-white"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center md:w-20">
                    <img 
                      src={client.profileImage} 
                      alt={client.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">{client.name}</h3>
                        <p className="text-gray-600">{client.email}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary">{client.totalCases}</div>
                          <div className="text-xs text-gray-500">Total Cases</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{client.activeCases}</div>
                          <div className="text-xs text-gray-500">Active Cases</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="font-medium">{client.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Address</div>
                        <div className="font-medium">{client.address}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Last Activity</div>
                        <div className="font-medium">{formatDate(client.lastActivity)}</div>
                      </div>
                    </div>
                    
                    {client.bio && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Bio</div>
                        <p className="text-gray-700 text-sm">{client.bio}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {client.cases.slice(0, 3).map((caseItem) => (
                        <span 
                          key={caseItem.caseId}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            caseItem.caseStatus === 'closed' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {caseItem.caseTitle}
                        </span>
                      ))}
                      {client.cases.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{client.cases.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center md:w-40">
                    <button 
                      onClick={() => window.location.href = `/lawyer/clients/${client.id}`}
                      className="btn btn-primary w-full text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Clients Found</h3>
              <p className="text-gray-600">You are not currently representing any clients.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LawyerMyClientsPage 