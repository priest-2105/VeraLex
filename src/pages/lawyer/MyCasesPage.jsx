import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    case 'pending':
      return <span className="badge bg-yellow-100 text-yellow-800">Pending</span>;
    case 'filed':
      return <span className="badge bg-purple-100 text-purple-800">Filed</span>;
    case 'closed':
      return <span className="badge bg-green-100 text-green-800">Closed</span>;
    default:
      return <span className="badge bg-gray-100 text-gray-800">Unknown</span>;
  }
};

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASES_COLLECTION_ID;
const CASE_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CASE_DETAILS_COLLECTION_ID;
const CLIENT_DETAILS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;
const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;

const LawyerMyCasesPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [assignedCases, setAssignedCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignedCases = async () => {
      setIsLoading(true);
      setError('');
      try {
        // 1. Get all case details where lawyerAssigned == currentUser.$id
        const detailsRes = await databases.listDocuments(
          DATABASE_ID,
          CASE_DETAILS_COLLECTION_ID,
          [Query.equal('lawyerAssigned', currentUser.$id)]
        );
        if (!detailsRes.documents.length) {
          setAssignedCases([]);
          setIsLoading(false);
          return;
        }
        // 2. For each, fetch the main case document and client profile
        const casePromises = detailsRes.documents.map(async (detailsDoc) => {
          try {
            const caseDoc = await databases.getDocument(
              DATABASE_ID,
              CASES_COLLECTION_ID,
              detailsDoc.caseId
            );
            // Fetch client profile (for name/email) using a query
            let clientName = 'Unknown';
            let clientEmail = '';
            try {
              const profileRes = await databases.listDocuments(
                DATABASE_ID,
                PROFILE_COLLECTION_ID,
                [
                  Query.equal('userId', caseDoc.userId),
                  Query.equal('role', 'client'),
                  Query.limit(1)
                ]
              );
              if (profileRes.documents.length > 0) {
                const clientProfile = profileRes.documents[0];
                clientName = `${clientProfile.firstName || ''} ${clientProfile.lastName || ''}`.trim() || 'Unknown';
                clientEmail = clientProfile.email || '';
              }
            } catch (err) {
              console.error(`Failed to fetch profile for user ${caseDoc.userId}:`, err);
            }

            return {
              id: detailsDoc.caseId,
              title: caseDoc.title,
              clientName,
              clientEmail,
              status: caseDoc.status,
              type: caseDoc.caseType,
              assignedAt: detailsDoc.lawyerAssignedAt || detailsDoc.$createdAt,
              lastActivity: detailsDoc.lastUpdated || caseDoc.updatedAt || caseDoc.createdAt,
            };
          } catch (err) {
            return null;
          }
        });
        const cases = (await Promise.all(casePromises)).filter(Boolean);
        setAssignedCases(cases);
      } catch (err) {
        setError('Failed to load assigned cases.');
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.$id) {
      fetchAssignedCases();
    }
  }, [currentUser?.$id]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        <p className="text-gray-600 mt-1">Cases you are currently assigned to</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><LoadingSpinner /></div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-6">
          {assignedCases.length > 0 ? (
            assignedCases.map((caseItem, index) => (
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
                        {/* {caseItem.clientEmail && <div className="text-xs text-gray-500">{caseItem.clientEmail}</div>} */}
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
      )}
    </div>
  );
};

export default LawyerMyCasesPage; 