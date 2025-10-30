import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

/**
 * Reusable Notification component
 * Displays success, error, warning, or info messages with appropriate colors and icons.
 * 
 * Props:
 * - type: one of 'success' | 'error' | 'warning' | 'info'
 * - title: optional heading text
 * - message: main notification text
 * - onClose: optional function to dismiss the alert
 * - show: controls visibility (default: true)
 */
const Notification = ({ type = 'info', title, message, onClose, show = true }) => {
  // Don’t render anything if the notification should be hidden
  if (!show) return null;

  // Icon mapping based on notification type
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertTriangle,
    info: FiInfo
  };

  // Background and text color classes for each notification type
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  // Icon color for each type
  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-md border p-4 ${colors[type]}`}>
      <div className="flex">
        {/* Icon section */}
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[type]}`} />
        </div>

        {/* Text section */}
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          {message && (
            <div className="mt-1 text-sm">
              {message}
            </div>
          )}
        </div>

        {/* Optional close button */}
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <span className="sr-only">Dismiss</span>
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
