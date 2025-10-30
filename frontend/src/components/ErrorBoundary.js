import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Track whether an error occurred and store the error details
    this.state = { hasError: false, error: null };
  }

  // Update state when an error is thrown by any child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details for debugging (could also send to an error tracking service)
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // Reset state to allow retrying the UI after an error
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    // Show fallback UI when an error has occurred
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            {/* Error icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            {/* Error message and retry button */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                We're sorry, but something unexpected happened. Please try again.
              </p>
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiRefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Otherwise, render child components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
