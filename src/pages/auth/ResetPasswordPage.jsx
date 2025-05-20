import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { account } from '../../lib/appwrite';
import Alert from '../../components/common/Alert';
import { AppwriteException } from 'appwrite';

// Zod schema for password validation
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract secrets from URL
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check if secrets are present
  useEffect(() => {
    if (!userId || !secret) {
      setServerMessage({ type: 'error', text: 'Invalid or expired reset link.' });
      // Optionally redirect after a delay
      // setTimeout(() => navigate('/auth/forgot-password'), 3000);
    }
  }, [userId, secret, navigate]);

  const onSubmit = async (data) => {
    setServerMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!userId || !secret) {
      setServerMessage({ type: 'error', text: 'Invalid or expired reset link.' });
      setIsLoading(false);
      return;
    }

    try {
      await account.updateRecovery(userId, secret, data.password, data.confirmPassword);
      setServerMessage({ type: 'success', text: 'Password successfully reset! You can now sign in.' });
      reset();
       // Redirect to login after a short delay
      setTimeout(() => navigate('/auth/signin'), 2000);
      
    } catch (error) {
      console.error('Password reset failed:', error);
      let errorMsg = 'Failed to reset password. The link may be invalid or expired.';
      if (error instanceof AppwriteException) {
          errorMsg = error.message || errorMsg;
      }
      setServerMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
        <p className="text-gray-600 mt-2">Enter your new password below</p>
      </div>

      {/* Display Server/Error Messages */} 
      {serverMessage.text && (
         <Alert 
           type={serverMessage.type} 
           message={serverMessage.text} 
           onClose={() => setServerMessage({ type: '', text: '' })} 
         />
       )}
      
      {/* Display Validation Errors */}
      {(errors.password || errors.confirmPassword) && (
         <Alert type="error" message={errors.password?.message || errors.confirmPassword?.message} />
       )}

      {/* Show form only if link seems valid */}
      {userId && secret && !serverMessage.text.includes('successfully reset') && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              required
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              required
              className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {/* Link to Sign In */} 
      <div className="mt-8 text-center">
         <p className="text-gray-600">
           <Link to="/auth/signin" className="text-primary font-medium hover:underline">
             Back to Sign In
           </Link>
         </p>
       </div>
    </motion.div>
  );
};

export default ResetPasswordPage; 