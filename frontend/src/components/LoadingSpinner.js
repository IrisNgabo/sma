import React from 'react';
import { FiLoader } from 'react-icons/fi';

/**
 * A simple loading spinner component.
 * Can be used inline or as a full-screen overlay.
 * 
 * Props:
 * - size: Spinner size (sm | md | lg | xl)
 * - text: Optional loading text
 * - fullScreen: Displays spinner over entire screen if true
 */
const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  // Define size variations for different spinner sizes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Spinner with optional text (reusable both inline and full screen)
  const content = (
    <div className="flex flex-col items-center justify-center">
      <FiLoader className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  // If fullScreen is true, overlay it across the whole page
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  // Default: just render inline spinner content
  return content;
};

export default LoadingSpinner;
