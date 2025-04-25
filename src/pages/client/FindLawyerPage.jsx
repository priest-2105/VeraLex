import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Mock data for lawyers
const mockLawyers = [
  {
    id: 'lawyer-1',
    name: 'Sarah Johnson',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    specializations: ['Corporate Law', 'Contract Law'],
    rating: 4.8,
    reviewCount: 124,
    yearsOfExperience: 12,
    location: 'New York, NY',
    hourlyRate: 250,
    caseCount: 156,
    bio: 'Former corporate counsel with extensive experience in contract negotiation and corporate governance.',
    featured: true
  },
  {
    id: 'lawyer-2',
    name: 'Michael Chen',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg',
    specializations: ['Intellectual Property', 'Technology Law'],
    rating: 4.9,
    reviewCount: 87,
    yearsOfExperience: 8,
    location: 'San Francisco, CA',
    hourlyRate: 275,
    caseCount: 93,
    bio: 'Patent attorney with a background in software engineering, specializing in tech startups and IP protection.'
  },
  {
    id: 'lawyer-3',
    name: 'Jennifer Williams',
    photo: 'https://randomuser.me/api/portraits/women/67.jpg',
    specializations: ['Real Estate', 'Property Law'],
    rating: 4.6,
    reviewCount: 152,
    yearsOfExperience: 15,
    location: 'Chicago, IL',
    hourlyRate: 225,
    caseCount: 247,
    bio: 'Experienced in all aspects of real estate law including transactions, disputes, and development projects.'
  },
  {
    id: 'lawyer-4',
    name: 'David Rodriguez',
    photo: 'https://randomuser.me/api/portraits/men/54.jpg',
    specializations: ['Family Law', 'Divorce'],
    rating: 4.7,
    reviewCount: 178,
    yearsOfExperience: 20,
    location: 'Miami, FL',
    hourlyRate: 200,
    caseCount: 312,
    bio: 'Compassionate family lawyer dedicated to achieving the best outcomes for families during difficult transitions.'
  },
  {
    id: 'lawyer-5',
    name: 'Emily Patel',
    photo: 'https://randomuser.me/api/portraits/women/47.jpg',
    specializations: ['Employment Law', 'Labor Relations'],
    rating: 4.9,
    reviewCount: 64,
    yearsOfExperience: 7,
    location: 'Boston, MA',
    hourlyRate: 235,
    caseCount: 89,
    bio: 'Former HR director turned employment attorney, with expertise in workplace disputes and policy compliance.',
    featured: true
  },
  {
    id: 'lawyer-6',
    name: 'James Wilson',
    photo: 'https://randomuser.me/api/portraits/men/39.jpg',
    specializations: ['Criminal Defense', 'Civil Rights'],
    rating: 4.5,
    reviewCount: 203,
    yearsOfExperience: 18,
    location: 'Los Angeles, CA',
    hourlyRate: 260,
    caseCount: 278,
    bio: 'Passionate advocate for justice with extensive trial experience in both state and federal courts.'
  }
]

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
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

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
  const filteredLawyers = mockLawyers.filter(lawyer => {
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
                        <Link to={`/lawyer/${lawyer.id}`} className="btn btn-sm btn-primary w-full">
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
                              <Link to={`/lawyer/${lawyer.id}`} className="btn btn-sm btn-primary">
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