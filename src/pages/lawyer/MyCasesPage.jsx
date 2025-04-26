import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for assigned cases (lawyer is already appointed)
const mockAssignedCases = [
  {
    id: 'case-456',
    title: 'Commercial Lease Agreement Review',
    clientName: 'Retail Group LLC',
    status: 'in_progress',
    type: 'Real Estate Law',
    assignedAt: '2023-07-10',
    lastActivity: '2023-07-15',
  },
  {
    id: 'case-789',
    title: 'Business Formation Consultation',
    clientName: 'Startup Innovations',
    status: 'in_progress',
    type: 'Corporate Law',
    assignedAt: '2023-07-05',
    lastActivity: '2023-07-12',
  },
  {
    id: 'case-101',
    title: 'Patent Application Filing',
    clientName: 'BioTech Research',
    status: 'filed', // Example of a different status
    type: 'Intellectual Property',
    assignedAt: '2023-06-20',
    lastActivity: '2023-07-14',
  },
];

// Helper function to format date (can be moved to a utils file later)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get status badge (can be moved to a utils file later)
const getStatusBadge = (status) => {
  switch (status) {
    case 'in_progress':
      return <span className="badge bg-blue-100 text-blue-800">In Progress</span>;
    case 'pending': // Should ideally not appear here, but handled just in case
      return <span className="badge bg-yellow-100 text-yellow-800">Pending</span>;
    case 'filed':
      return <span className="badge bg-purple-100 text-purple-800">Filed</span>;
    case 'closed':
      return <span className="badge bg-green-100 text-green-800">Closed</span>;
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>;
  }
};


const LawyerMyCasesPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        <p className="text-gray-600 mt-1">Cases you are currently assigned to</p>
      </div>

      {/* Case List */}
      <div className="space-y-6">
        {mockAssignedCases.length > 0 ? (
          mockAssignedCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card bg-white"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    {getStatusBadge(caseItem.status)}
                    <span className="text-xs text-gray-500">Assigned: {formatDate(caseItem.assignedAt)}</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{caseItem.title}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Client</div>
                      <div className="font-medium text-primary">{caseItem.clientName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Case Type</div>
                      <div className="font-medium">{caseItem.type}</div>
                    </div>
                     <div>
                      <div className="text-xs text-gray-500">Last Activity</div>
                      <div className="font-medium">{formatDate(caseItem.lastActivity)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center md:w-40">
                  <Link 
                    to={`/lawyer/case/${caseItem.id}`} 
                    className="btn btn-primary w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Assigned Cases</h3>
            <p className="text-gray-600">You are not currently assigned to any active cases.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerMyCasesPage; 