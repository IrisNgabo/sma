/**
 * Notification System
 * Handles toast notifications and push notifications
 */

import { toast } from 'react-toastify';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Default toast configuration
const defaultToastConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Show success notification
 * @param {string} message - Success message
 * @param {object} options - Toast options
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    ...defaultToastConfig,
    ...options,
    toastId: `success-${Date.now()}`
  });
};

/**
 * Show error notification
 * @param {string} message - Error message
 * @param {object} options - Toast options
 */
export const showError = (message, options = {}) => {
  toast.error(message, {
    ...defaultToastConfig,
    autoClose: 7000,
    ...options,
    toastId: `error-${Date.now()}`
  });
};

/**
 * Show warning notification
 * @param {string} message - Warning message
 * @param {object} options - Toast options
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    ...defaultToastConfig,
    ...options,
    toastId: `warning-${Date.now()}`
  });
};

/**
 * Show info notification
 * @param {string} message - Info message
 * @param {object} options - Toast options
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    ...defaultToastConfig,
    ...options,
    toastId: `info-${Date.now()}`
  });
};

/**
 * Show loading notification
 * @param {string} message - Loading message
 * @param {object} options - Toast options
 * @returns {string} Toast ID for dismissing
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...defaultToastConfig,
    autoClose: false,
    closeOnClick: false,
    ...options,
    toastId: `loading-${Date.now()}`
  });
};

/**
 * Update loading notification
 * @param {string} toastId - Toast ID
 * @param {string} message - New message
 * @param {string} type - New type (success, error, etc.)
 */
export const updateLoading = (toastId, message, type = NOTIFICATION_TYPES.SUCCESS) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 5000,
    closeOnClick: true,
  });
};

/**
 * Dismiss notification
 * @param {string} toastId - Toast ID
 */
export const dismissNotification = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all notifications
 */
export const dismissAll = () => {
  toast.dismiss();
};

/**
 * Show promise notification
 * @param {Promise} promise - Promise to handle
 * @param {object} messages - Messages for different states
 * @param {object} options - Toast options
 */
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(promise, {
    pending: messages.pending || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong!',
    ...options
  });
};

/**
 * Show authentication success
 * @param {string} name - User name
 */
export const showAuthSuccess = (name) => {
  showSuccess(`Welcome back, ${name}!`);
};

/**
 * Show authentication error
 * @param {string} message - Error message
 */
export const showAuthError = (message) => {
  showError(`Authentication failed: ${message}`);
};

/**
 * Show device verification success
 * @param {number} count - Number of devices verified
 */
export const showDeviceVerificationSuccess = (count = 1) => {
  const message = count === 1 
    ? 'Device verified successfully!' 
    : `${count} devices verified successfully!`;
  showSuccess(message);
};

/**
 * Show device verification error
 * @param {string} message - Error message
 */
export const showDeviceVerificationError = (message) => {
  showError(`Device verification failed: ${message}`);
};

/**
 * Show customer update success
 * @param {string} action - Action performed
 */
export const showCustomerUpdateSuccess = (action) => {
  showSuccess(`Customer ${action} successfully!`);
};

/**
 * Show customer update error
 * @param {string} message - Error message
 */
export const showCustomerUpdateError = (message) => {
  showError(`Customer update failed: ${message}`);
};

/**
 * Show network error
 */
export const showNetworkError = () => {
  showError('Network error. Please check your connection and try again.');
};

/**
 * Show server error
 * @param {string} message - Error message
 */
export const showServerError = (message) => {
  showError(`Server error: ${message}`);
};

/**
 * Show validation error
 * @param {string} message - Validation message
 */
export const showValidationError = (message) => {
  showWarning(`Validation error: ${message}`);
};

/**
 * Show session expired
 */
export const showSessionExpired = () => {
  showWarning('Your session has expired. Please log in again.');
};

/**
 * Show data export success
 * @param {string} format - Export format
 */
export const showExportSuccess = (format) => {
  showSuccess(`Data exported successfully as ${format.toUpperCase()}!`);
};

/**
 * Show data export error
 * @param {string} message - Error message
 */
export const showExportError = (message) => {
  showError(`Export failed: ${message}`);
};

/**
 * Show bulk action success
 * @param {string} action - Action performed
 * @param {number} count - Number of items
 */
export const showBulkActionSuccess = (action, count) => {
  showSuccess(`${action} completed for ${count} items!`);
};

/**
 * Show bulk action error
 * @param {string} action - Action attempted
 * @param {string} message - Error message
 */
export const showBulkActionError = (action, message) => {
  showError(`Bulk ${action} failed: ${message}`);
};

/**
 * Show progress notification
 * @param {string} message - Progress message
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} Toast ID
 */
export const showProgress = (message, progress = 0) => {
  return toast.info(`${message} (${progress}%)`, {
    ...defaultToastConfig,
    autoClose: false,
    closeOnClick: false,
    progress: progress / 100,
    toastId: `progress-${Date.now()}`
  });
};

/**
 * Update progress notification
 * @param {string} toastId - Toast ID
 * @param {string} message - Progress message
 * @param {number} progress - Progress percentage (0-100)
 */
export const updateProgress = (toastId, message, progress) => {
  toast.update(toastId, {
    render: `${message} (${progress}%)`,
    progress: progress / 100,
    autoClose: progress >= 100 ? 3000 : false
  });
};
