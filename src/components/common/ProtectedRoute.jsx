import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentUser, selectAuthStatus } from '../../store/authSlice';
import LoadingSpinner from './LoadingSpinner'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector(selectCurrentUser);
  const authStatus = useSelector(selectAuthStatus);
  const location = useLocation();

  // Still checking the session?
  if (authStatus === 'loading' || authStatus === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // User not logged in?
  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  // Access role from the nested profile object in Redux state
  const userRole = currentUser?.profile?.role; 
  
  if (!userRole) {
      // Handle case where profile or role might be missing (shouldn't happen if login is correct)
      console.error("User role not found in Redux state for protected route.", currentUser);
      return <Navigate to="/auth/signin" state={{ from: location }} replace />; // Redirect to login if role is missing
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User is logged in but doesn't have the right role
    console.warn(`User with role '${userRole}' tried to access restricted route ${location.pathname}. Allowed: ${allowedRoles.join(', ')}`);
    // Redirect to their own dashboard or a generic unauthorized page
    return <Navigate to={`/${userRole}/dashboard`} replace />; 
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute; 