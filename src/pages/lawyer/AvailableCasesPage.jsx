import { useState } from 'react'
import { motion } from 'framer-motion'

// Mock data for available cases
const mockCases = [
  {
    id: 'case-1',
    title: 'International Trademark Registration Assistance',
    description: 'We need assistance registering our trademark in multiple international jurisdictions, including EU, UK, and Asia. Looking for a lawyer with experience in international IP law.',
    type: 'Intellectual Property',
    budget: '$2,500 - $4,000',
    location: 'Remote',
    postedAt: '2023-07-01',
    applicants: 3,
    clientName: 'TechSolutions Inc.',
    clientRating: 4.8,
    clientReviews: 12
  },
  {
    id: 'case-2',
    title: 'Employment Contract Review for Tech Startup',
    description: 'Our startup is hiring key executives and needs comprehensive employment contracts reviewed. We have 5 contracts that need review and possible modification.',
    type: 'Employment Law',
    budget: '$1,500 - $2,500',
    location: 'Remote',
    postedAt: '2023-06-29',
    applicants: 7,
    clientName: 'InnovateTech',
    clientRating: 4.5,
    clientReviews: 8
  },
  {
    id: 'case-3',
    title: 'Workplace Discrimination Lawsuit',
    description: 'Representing an employee in a workplace discrimination case against a large corporation. Need experienced employment lawyer with litigation experience.',
    type: 'Employment Law',
    budget: '$5,000 - $8,000',
    location: 'New York, NY',
    postedAt: '2023-06-28',
    applicants: 10,
    clientName: 'Individual Client',
    clientRating: 5.0,
    clientReviews: 2
  },
  {
    id: 'case-4',
    title: 'Software License Agreement Review',
    description: 'Need a lawyer to review and negotiate SaaS license agreements with enterprise clients. Looking for someone with software licensing expertise.',
    type: 'Technology Law',
    budget: '$2,000 - $3,000',
    location: 'Remote',
    postedAt: '2023-06-27',
    applicants: 5,
    clientName: 'CloudSoft Systems',
    clientRating: 4.2,
    clientReviews: 15
  },
  {
    id: 'case-5',
    title: 'Corporate Restructuring Assistance',
    description: 'Our company is undergoing restructuring and needs legal guidance on corporate structure, tax implications, and employee transitions.',
    type: 'Corporate Law',
    budget: '$10,000 - $15,000',
    location: 'Chicago, IL',
    postedAt: '2023-06-25',
    applicants: 8,
    clientName: 'Midwest Manufacturing',
    clientRating: 4.7,
    clientReviews: 9
  },
  {
    id: 'case-6',
    title: 'Patent Infringement Case',
    description: 'We believe a competitor is infringing on our patented technology. Need a lawyer to investigate and potentially file a patent infringement lawsuit.',
    type: 'Intellectual Property',
    budget: '$7,500 - $12,000',
    location: 'San Francisco, CA',
    postedAt: '2023-06-22',
    applicants: 12,
    clientName: 'InnovateX',
    clientRating: 4.9,
    clientReviews: 17
  }
]

// Filter categories
const caseTypes = [
  'All Types',
  'Corporate Law',
  'Intellectual Property',
  'Employment Law',
  'Technology Law',
  'Contract Law',
  'Family Law',
  'Real Estate Law',
  'Immigration Law',
  'Criminal Defense',
  'Tax Law'
]

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const AvailableCasesPage = () => {
  const [selectedType, setSelectedType] = useState('All Types')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter cases based on selected type and search query
  const filteredCases = mockCases.filter(caseItem => {
    const matchesType = selectedType === 'All Types' || caseItem.type === selectedType
    const matchesSearch = 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesSearch
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Cases</h1>
        <p className="text-gray-600 mt-1">Browse and apply for open legal matters</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              className="input"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:w-1/3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
            <select
              id="type"
              className="input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {caseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="md:self-end">
            <button className="btn btn-primary w-full md:w-auto">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Showing {filteredCases.length} available cases</p>
        <div className="flex gap-2">
          <button className="p-2 border rounded bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="p-2 border rounded bg-primary text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card bg-white"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <span className="badge bg-green-100 text-green-800">New Case</span>
                    <span className="text-xs text-gray-500 ml-2">Posted {formatDate(caseItem.postedAt)}</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{caseItem.title}</h3>
                  <p className="text-gray-600 mb-4">{caseItem.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Case Type</div>
                      <div className="font-medium">{caseItem.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Budget</div>
                      <div className="font-medium">{caseItem.budget}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-medium">{caseItem.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Applicants</div>
                      <div className="font-medium">{caseItem.applicants} lawyers</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-sm mr-4">
                      <span className="text-gray-600">Posted by:</span> <span className="font-medium">{caseItem.clientName}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{caseItem.clientRating}</span>
                      <span className="ml-1 text-sm text-gray-500">({caseItem.clientReviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between md:w-40">
                  <button className="btn btn-primary w-full mb-2">Apply Now</button>
                  <button className="btn btn-outline w-full">Save</button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableCasesPage 