import { Link } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FaEnvelopeOpenText className="h-16 w-16 mx-auto text-primary mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please click the link 
          in the email to activate your account.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
        <Link 
          to="/login"
          className="btn btn-primary w-full"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmailPage; 