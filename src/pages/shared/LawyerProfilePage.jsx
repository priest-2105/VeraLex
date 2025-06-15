import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { databases } from '../../lib/appwrite'
import { Query } from 'appwrite'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
const LAWYER_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_LAWYER_DETAILS_COLLECTION_ID

const LawyerProfilePage = () => {
  const { lawyerId } = useParams()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('about')
  const [showApointCaseModal, setShowApointCaseModal] = useState(false)
  const [pendingCases, setPendingCases] = useState([])
  
  useEffect(() => {
    const fetchLawyerData = async () => {
      setLoading(true)
      setError('')
      
      try {
        // 1. Get profile data
        const profileResponse = await databases.listDocuments(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          [
            Query.equal('userId', lawyerId),
            Query.equal('role', 'lawyer'),
            Query.limit(1)
          ]
        )

        if (profileResponse.documents.length === 0) {
          throw new Error('Lawyer profile not found')
        }

        const profile = profileResponse.documents[0]
        console.log('Profile data:', profile)

        // 2. Get lawyer details
        const lawyerDetailsResponse = await databases.listDocuments(
          DATABASE_ID,
          LAWYER_DETAILS_COLLECTION_ID,
          [
            Query.equal('userId', lawyerId),
            Query.limit(1)
          ]
        )

        const details = lawyerDetailsResponse.documents[0]
        console.log('Lawyer details:', details)

        // 3. Combine the data, using fields from appropriate collections
        setLawyer({
          // Profile data (from profiles collection)
          id: profile.$id,
          userId: profile.userId,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
          phone: profile.phone,
          address: profile.address,
          profileImage: profile.profileImage,
          bio: profile.bio,

          // Lawyer details data (from lawyer_details collection)
          barId: details?.barId || '',
          specializations: Array.isArray(details?.specializations) ? details.specializations : [],
          isVerified: details?.isVerified || false,
          isActive: details?.isActive || false,
          rating: details?.rating || 0,
          reviewCount: details?.reviewCount || 0,
          yearsOfExperience: details?.yearsOfExperience || 0,
          location: details?.location || '',
          hourlyRate: details?.hourlyRate || 0,
          caseCount: details?.caseCount || 0,
          featured: details?.featured || false,

          // Computed fields
          name: `${profile.firstName} ${profile.lastName}`,
          contactInfo: {
            email: profile.email,
            phone: profile.phone || details?.phone || '',
            office: profile.address || ''
          }
        })

      } catch (error) {
        console.error('Error fetching lawyer data:', error)
        setError(error.message || 'Failed to load lawyer profile')
      } finally {
        setLoading(false)
      }
    }

    fetchLawyerData()
  }, [lawyerId])
  
  // Mock data for pending cases
  useEffect(() => {
    // Simulate API call to get client's pending cases
    setTimeout(() => {
      setPendingCases([
        {
          id: 'case-001',
          title: 'Contract Dispute with Tech Vendor',
          createdAt: '2023-06-10',
          status: 'pending'
        },
        {
          id: 'case-002',
          title: 'Intellectual Property Infringement',
          createdAt: '2023-06-15',
          status: 'pending'
        },
        {
          id: 'case-003',
          title: 'Employment Agreement Review',
          createdAt: '2023-06-20',
          status: 'pending'
        }
      ])
    }, 1200)
  }, [])

  const handleAppointCase = (caseId) => {
    // In a real app, make API call to appoint lawyer to case
    console.log(`Appointing lawyer ${lawyerId} to case ${caseId}`)
    // Close modal after appointment
    setShowApointCaseModal(false)
    // Show success message or redirect
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-gray-700">Error</h2>
        <p className="mt-2 text-gray-500">{error}</p>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!lawyer) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-gray-700">Lawyer not found</h2>
        <p className="mt-2 text-gray-500">The lawyer profile you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Profile Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-secondary to-secondary/80 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img 
                src={lawyer?.profileImage || '/default-avatar.png'} 
                alt={lawyer?.name} 
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {lawyer?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">{lawyer?.name}</h1>
              
              {lawyer?.specializations && Array.isArray(lawyer.specializations) && lawyer.specializations.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  {lawyer.specializations.map((specialization, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                      {specialization}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer?.yearsOfExperience || 0} years</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Experience</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{lawyer?.rating || 0} ({lawyer?.reviewCount || 0})</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer?.caseCount || 0} cases</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Case Count</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer?.location || 'Location not specified'}</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Location</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'about' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About & Experience
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'practice' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Practice Areas
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'cases' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Case Highlights
            </button>
          </nav>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Tab Content */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">About {lawyer?.name}</h2>
              {lawyer?.bio ? (
                <p className="text-gray-700 mb-6 leading-relaxed">{lawyer.bio}</p>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No bio available yet.</p>
                </div>
              )}
              
              {/* Professional Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-3">Professional Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Years of Experience</p>
                    <p className="font-medium">{lawyer?.yearsOfExperience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cases Handled</p>
                    <p className="font-medium">{lawyer?.caseCount || 0} cases</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bar ID</p>
                    <p className="font-medium">{lawyer?.barId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hourly Rate</p>
                    <p className="font-medium">${lawyer?.hourlyRate || 0}/hr</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{lawyer?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{lawyer?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{lawyer?.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Office Address</p>
                    <p className="font-medium">{lawyer?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'practice' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Practice Areas</h2>
              
              {lawyer?.specializations && Array.isArray(lawyer.specializations) && lawyer.specializations.length > 0 ? (
                <>
                  <p className="text-gray-700 mb-6">
                    {lawyer.name} specializes in the following areas of law:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {lawyer.specializations.map((specialization, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-gray-800">{specialization}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No specializations listed yet.</p>
                </div>
              )}

              {/* Additional lawyer details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Professional Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Bar ID:</span> {lawyer?.barId || 'Not provided'}</p>
                    <p><span className="text-gray-600">Years of Experience:</span> {lawyer?.yearsOfExperience || 0}</p>
                    <p><span className="text-gray-600">Case Count:</span> {lawyer?.caseCount || 0}</p>
                    <p><span className="text-gray-600">Hourly Rate:</span> ${lawyer?.hourlyRate || 0}/hr</p>
                    <p><span className="text-gray-600">Location:</span> {lawyer?.location || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Verification Status</h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="text-gray-600 mr-2">Verified:</span>
                      {lawyer?.isVerified ? (
                        <span className="text-green-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-500">Not verified</span>
                      )}
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-600 mr-2">Status:</span>
                      {lawyer?.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                    <p><span className="text-gray-600">Rating:</span> {lawyer?.rating || 0} ({lawyer?.reviewCount || 0} reviews)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Client Reviews</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800 mr-2">{lawyer?.rating || 0}</span>
                  <StarRating rating={lawyer?.rating || 0} />
                  <span className="ml-2 text-gray-500">({lawyer?.reviewCount || 0})</span>
                </div>
              </div>
              
              {lawyer?.reviewCount > 0 ? (
                <div className="space-y-6">
                  {/* Reviews will be implemented later */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500">Reviews feature coming soon!</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-gray-500">No reviews yet.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'cases' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Case Highlights</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Case highlights feature coming soon!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Contact Info and CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{lawyer?.email}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{lawyer?.phone}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Office</p>
                  <p className="text-gray-800">{lawyer?.address}</p>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20">
            <h2 className="text-lg font-semibold mb-2">Have Questions?</h2>
            <p className="text-gray-700 mb-4">
              Contact our support team for help finding the right lawyer for your case.
            </p>
            <button className="w-full border border-secondary text-secondary hover:bg-secondary hover:text-white py-2 rounded-lg font-medium transition-colors">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerProfilePage 