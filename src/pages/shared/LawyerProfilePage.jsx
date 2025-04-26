import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const LawyerProfilePage = () => {
  const { lawyerId } = useParams()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  
  // Mock data - in a real app, fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLawyer({
        id: lawyerId,
        name: 'John Smith, Esq.',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        specializations: ['Family Law', 'Civil Litigation', 'Contract Law'],
        experience: '12 years',
        rating: 4.8,
        reviewCount: 56,
        education: [
          { degree: 'Juris Doctor', institution: 'Harvard Law School', year: '2011' },
          { degree: 'Bachelor of Arts, Political Science', institution: 'Yale University', year: '2008' }
        ],
        barAssociations: ['New York State Bar Association', 'American Bar Association'],
        about: 'John Smith is a highly experienced attorney specializing in family law and civil litigation. With over 12 years of experience, he has successfully represented clients in complex divorce proceedings, child custody disputes, and contract negotiations. John is known for his compassionate approach and dedication to achieving favorable outcomes for his clients.',
        contactInfo: {
          email: 'john.smith@legalfirm.com',
          phone: '(555) 123-4567',
          office: '123 Legal Street, Suite 400, New York, NY 10001'
        },
        caseWinRate: '92%',
        languages: ['English', 'Spanish', 'French'],
        consultationFee: '$150 per hour',
        practiceFocus: [
          { area: 'Divorce & Separation', percentage: 40 },
          { area: 'Child Custody', percentage: 30 },
          { area: 'Contract Disputes', percentage: 20 },
          { area: 'Civil Litigation', percentage: 10 }
        ],
        testimonials: [
          { 
            id: 1, 
            client: 'Sarah Thompson', 
            text: 'John helped me navigate through my difficult divorce case with compassion and expertise. He was always available to answer my questions and fought for my rights every step of the way.',
            rating: 5,
            date: 'January 2023'
          },
          { 
            id: 2, 
            client: 'Michael Rodriguez', 
            text: "I hired John for a complex contract dispute and couldn't be happier with the results. His attention to detail and strategic approach led to a favorable settlement.",
            rating: 5,
            date: 'March 2023'
          },
          { 
            id: 3, 
            client: 'Jennifer Wu', 
            text: 'Attorney Smith handled my child custody case with professionalism and genuine care. He made a stressful situation much easier to deal with.',
            rating: 4,
            date: 'May 2023'
          }
        ],
        caseHighlights: [
          {
            id: 1,
            title: 'Major Divorce Settlement',
            description: 'Successfully negotiated a favorable settlement in a high-asset divorce case, securing equitable distribution of property and appropriate support arrangements.'
          },
          {
            id: 2,
            title: 'Precedent-Setting Contract Case',
            description: 'Won a significant contract dispute for a small business owner against a much larger corporation, establishing an important precedent for similar future cases.'
          },
          {
            id: 3,
            title: 'Complex Child Custody Resolution',
            description: 'Resolved a multi-state child custody dispute with international implications, ensuring the childs best interests were protected.'
          }
        ],
        availability: {
          nextAvailable: '3 days',
          consultationTypes: ['In-person', 'Video call', 'Phone call']
        }
      })
      setLoading(false)
    }, 800)
  }, [lawyerId])
  
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
                src={lawyer.profileImage} 
                alt={lawyer.name} 
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">{lawyer.name}</h1>
              
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                {lawyer.specializations.map((specialization, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                    {specialization}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer.experience}</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Experience</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{lawyer.rating} ({lawyer.reviewCount})</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer.caseWinRate}</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Success Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-3.35-4.419 3.35A1 1 0 014 16V4zm3.707 4.707a1 1 0 00-1.414-1.414L5 8.586 3.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{lawyer.availability.nextAvailable}</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80">Available In</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-col gap-3">
              <div className="bg-white text-secondary font-medium py-2 px-4 rounded-lg text-center">
                {lawyer.consultationFee}
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Schedule Consultation
              </button>
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
              onClick={() => setActiveTab('education')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'education' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Education & Credentials
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
              <h2 className="text-xl font-semibold mb-4">About {lawyer.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{lawyer.about}</p>
              
              <h3 className="text-lg font-medium mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {lawyer.languages.map((language, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                    {language}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-medium mb-3">Consultation Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {lawyer.availability.consultationTypes.map((type, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'practice' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Practice Focus</h2>
              <p className="text-gray-700 mb-6">
                {lawyer.name} specializes in the following areas of law:
              </p>
              
              <div className="space-y-4 mb-6">
                {lawyer.practiceFocus.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{area.area}</span>
                      <span className="text-gray-500">{area.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-700">
                With a strong background in family law and civil litigation, {lawyer.name} has successfully represented clients in various legal matters, providing expert advice and representation.
              </p>
            </div>
          )}
          
          {activeTab === 'education' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-6 mb-8">
                {lawyer.education.map((edu, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-gray-500 text-sm">Graduated: {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Bar Admissions & Associations</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {lawyer.barAssociations.map((association, index) => (
                  <li key={index}>{association}</li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Client Reviews</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800 mr-2">{lawyer.rating}</span>
                  <StarRating rating={lawyer.rating} />
                  <span className="ml-2 text-gray-500">({lawyer.reviewCount})</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {lawyer.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">{testimonial.client}</h3>
                        <p className="text-gray-500 text-sm">{testimonial.date}</p>
                      </div>
                      <StarRating rating={testimonial.rating} />
                    </div>
                    <p className="text-gray-700">{testimonial.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'cases' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Notable Case Highlights</h2>
              
              <div className="space-y-6">
                {lawyer.caseHighlights.map((caseItem) => (
                  <div key={caseItem.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{caseItem.title}</h3>
                    <p className="text-gray-700">{caseItem.description}</p>
                  </div>
                ))}
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
                  <p className="text-gray-800">{lawyer.contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{lawyer.contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Office</p>
                  <p className="text-gray-800">{lawyer.contactInfo.office}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-4">
              Schedule a consultation with {lawyer.name} to discuss your legal needs.
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Consultation Fee</span>
                <span className="text-primary font-bold">{lawyer.consultationFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Next Available</span>
                <span className="text-green-600">{lawyer.availability.nextAvailable}</span>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors">
              Schedule Consultation
            </button>
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