import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { databases } from '../../lib/appwrite'
import { Query } from 'appwrite'
import Alert from '../../components/common/Alert'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID

// Available specializations for filter
const specializations = [
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

const FindLawyerPage = () => {
  const [search, setSearch] = useState('')
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [experienceFilter, setExperienceFilter] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('grid')
  const [lawyers, setLawyers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch lawyers from Appwrite
  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true)
      setError('')
      
      try {
        // Query only users with role 'lawyer'
        const response = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [
            Query.equal('role', 'lawyer'),
            Query.limit(100) 
          ]
        )

        // Transform the data to match our UI needs
        const transformedLawyers = response.documents.map(lawyer => ({
          id: lawyer.$id,
          name: `${lawyer.firstName} ${lawyer.lastName}`,
          photo: lawyer.profileImage || null,
          specializations: lawyer.specializations || [],
          rating: lawyer.rating || 0,
          reviewCount: lawyer.reviewCount || 0,
          yearsOfExperience: lawyer.yearsOfExperience || 0,
          location: lawyer.location || 'Location not specified',
          hourlyRate: lawyer.hourlyRate || 0,
          caseCount: lawyer.caseCount || 0,
          bio: lawyer.bio || '',
          featured: lawyer.featured || false,
          email: lawyer.email,
          phone: lawyer.phone,
          barId: lawyer.barId,
          isVerified: lawyer.isVerified || false
        }))

        setLawyers(transformedLawyers)
      } catch (error) {
        console.error('Error fetching lawyers:', error)
        setError('Failed to load lawyers. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLawyers()
  }, [])

  // Toggle specialization in filter
  const toggleSpecialization = (specialization) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specialization)) {
        return prev.filter(s => s !== specialization)
      } else {
        return [...prev, specialization]
      }
    })
  }

  // Filter lawyers based on selected filters
  const filteredLawyers = lawyers.filter(lawyer => {
    // Filter by search
    if (search && !lawyer.name.toLowerCase().includes(search.toLowerCase()) && 
        !lawyer.specializations.some(s => s.toLowerCase().includes(search.toLowerCase())) &&
        !lawyer.location.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    // Filter by specializations
    if (selectedSpecializations.length > 0 && 
        !lawyer.specializations.some(s => selectedSpecializations.includes(s))) {
      return false
    }
    
    // Filter by rating
    if (ratingFilter > 0 && lawyer.rating < ratingFilter) {
      return false
    }
    
    // Filter by experience
    if (experienceFilter > 0 && lawyer.yearsOfExperience < experienceFilter) {
      return false
    }
    
    return true
  })

  // Sort lawyers based on selected sort option
  const sortedLawyers = [...filteredLawyers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return b.yearsOfExperience - a.yearsOfExperience
      case 'caseCount':
        return b.caseCount - a.caseCount
      case 'hourlyRate_asc':
        return a.hourlyRate - b.hourlyRate
      case 'hourlyRate_desc':
        return b.hourlyRate - a.hourlyRate
      default:
        return 0
    }
  })

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
        <h1 className="text-2xl font-bold text-gray-900">Find a Lawyer</h1>
        <p className="text-gray-600 mt-1">Browse our database of verified legal professionals</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
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
                  placeholder="Name, specialty, location..."
                />
              </div>
            </div>
            
            {/* Specializations */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                {specializations.map((specialization) => (
                  <div key={specialization} className="flex items-center">
                    <input
                      id={`specialization-${specialization}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={selectedSpecializations.includes(specialization)}
                      onChange={() => toggleSpecialization(specialization)}
                    />
                    <label
                      htmlFor={`specialization-${specialization}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {specialization}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-10 text-sm text-gray-700">{ratingFilter > 0 ? ratingFilter : 'Any'}</span>
              </div>
            </div>
            
            {/* Experience Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Experience (Years)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-10 text-sm text-gray-700">{experienceFilter > 0 ? experienceFilter : 'Any'}</span>
              </div>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearch('')
                setSelectedSpecializations([])
                setRatingFilter(0)
                setExperienceFilter(0)
              }}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Reset All Filters
            </button>
          </div>
        </div>
        
        {/* Lawyers List */}
        <div className="lg:col-span-3">
          {/* Sort and View Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-3 sm:mb-0 w-full sm:w-auto">
              <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 mr-2">
                Sort By:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
                <option value="caseCount">Most Cases</option>
                <option value="hourlyRate_asc">Hourly Rate: Low to High</option>
                <option value="hourlyRate_desc">Hourly Rate: High to Low</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">
                {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''} found
              </span>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'} 
                    rounded-l-md focus:outline-none`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'} 
                    rounded-r-md focus:outline-none`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Lawyers Display */}
          {filteredLawyers.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedLawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden ${lawyer.featured ? 'border-2 border-primary' : ''}`}
                  >
                    {lawyer.featured && (
                      <div className="bg-primary text-white text-center py-1 text-xs font-medium">
                        FEATURED
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start">
                        <img 
                          src={lawyer.photo} 
                          alt={lawyer.name} 
                          className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="ml-1 text-sm font-medium">{lawyer.rating}</span>
                            </div>
                            <span className="mx-2 text-sm text-gray-500">|</span>
                            <span className="text-sm text-gray-500">{lawyer.reviewCount} reviews</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">{lawyer.location}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {lawyer.specializations.map((spec) => (
                            <span key={spec} className="badge bg-primary/10 text-primary px-2 py-1 text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-600">{lawyer.yearsOfExperience} years experience</span>
                          <span className="font-medium">${lawyer.hourlyRate}/hr</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lawyer.bio}</p>
                        <Link to={`/client/lawyer/${lawyer.id}`} className="btn btn-sm btn-primary w-full">
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedLawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden ${lawyer.featured ? 'border-l-4 border-primary' : ''}`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex items-start mb-4 md:mb-0 md:mr-6">
                          <img 
                            src={lawyer.photo} 
                            alt={lawyer.name} 
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                              {lawyer.featured && (
                                <span className="ml-2 badge bg-primary/10 text-primary px-2 py-1 text-xs">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="ml-1 text-sm font-medium">{lawyer.rating}</span>
                              </div>
                              <span className="mx-2 text-sm text-gray-500">|</span>
                              <span className="text-sm text-gray-500">{lawyer.reviewCount} reviews</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{lawyer.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {lawyer.specializations.map((spec) => (
                              <span key={spec} className="badge bg-primary/10 text-primary px-2 py-1 text-xs">
                                {spec}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{lawyer.bio}</p>
                          <div className="flex flex-wrap justify-between items-center text-sm">
                            <div className="flex space-x-4 mb-2 md:mb-0">
                              <span className="text-gray-600">{lawyer.yearsOfExperience} years experience</span>
                              <span className="text-gray-600">{lawyer.caseCount} cases</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">${lawyer.hourlyRate}/hr</span>
                              <Link to={`/client/lawyer/${lawyer.id}`} className="btn btn-sm btn-primary">
                                View Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setSelectedSpecializations([])
                  setRatingFilter(0)
                  setExperienceFilter(0)
                }}
                className="btn btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindLawyerPage 