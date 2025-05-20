import React from 'react';

// Simple placeholder spinner - replace with custom animation later
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading..."
      >
         <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner; 