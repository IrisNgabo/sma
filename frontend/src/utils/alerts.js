/**
 * Alert System
 * Handle user-friendly popups and confirmations
 */

import { toast } from 'react-toastify';

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 * @param {object} options - Additional options
 */
export const showConfirmation = (title, message, onConfirm, onCancel = null, options = {}) => {
  const {
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    autoClose = false
  } = options;

  // Create custom toast with confirmation buttons
  const toastId = toast(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={() => {
            toast.dismiss(toastId);
            if (onCancel) onCancel();
          }}
        >
          {cancelText}
        </button>
        <button
          className={`px-4 py-2 text-white rounded hover:opacity-90 transition-colors ${
            type === 'danger' ? 'bg-red-600' : 'bg-blue-600'
          }`}
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>,
    {
      position: 'top-center',
      autoClose: autoClose,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      toastId: `confirmation-${Date.now()}`
    }
  );
};

/**
 * Show delete confirmation
 * @param {string} itemName - Name of item to delete
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 */
export const showDeleteConfirmation = (itemName, onConfirm, onCancel = null) => {
  showConfirmation(
    'Delete Confirmation',
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    onConfirm,
    onCancel,
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }
  );
};

/**
 * Show bulk action confirmation
 * @param {string} action - Action to perform
 * @param {number} count - Number of items
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 */
export const showBulkActionConfirmation = (action, count, onConfirm, onCancel = null) => {
  showConfirmation(
    'Bulk Action Confirmation',
    `Are you sure you want to ${action} ${count} items?`,
    onConfirm,
    onCancel,
    {
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancel',
      type: 'warning'
    }
  );
};

/**
 * Show device verification confirmation
 * @param {number} count - Number of devices
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 */
export const showDeviceVerificationConfirmation = (count, onConfirm, onCancel = null) => {
  showConfirmation(
    'Verify Devices',
    `Are you sure you want to verify ${count} device${count > 1 ? 's' : ''}?`,
    onConfirm,
    onCancel,
    {
      confirmText: 'Verify',
      cancelText: 'Cancel',
      type: 'info'
    }
  );
};

/**
 * Show logout confirmation
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 */
export const showLogoutConfirmation = (onConfirm, onCancel = null) => {
  showConfirmation(
    'Logout Confirmation',
    'Are you sure you want to logout?',
    onConfirm,
    onCancel,
    {
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning'
    }
  );
};

/**
 * Show data export confirmation
 * @param {string} format - Export format
 * @param {number} recordCount - Number of records
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 */
export const showExportConfirmation = (format, recordCount, onConfirm, onCancel = null) => {
  showConfirmation(
    'Export Data',
    `Export ${recordCount} records as ${format.toUpperCase()}?`,
    onConfirm,
    onCancel,
    {
      confirmText: 'Export',
      cancelText: 'Cancel',
      type: 'info'
    }
  );
};

/**
 * Show session timeout warning
 * @param {number} minutes - Minutes until timeout
 * @param {Function} onExtend - Extend session callback
 * @param {Function} onLogout - Logout callback
 */
export const showSessionTimeoutWarning = (minutes, onExtend, onLogout) => {
  const toastId = toast(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 text-yellow-600">Session Timeout Warning</h3>
      <p className="text-gray-600 mb-4">
        Your session will expire in {minutes} minute{minutes > 1 ? 's' : ''}. 
        Would you like to extend your session?
      </p>
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={() => {
            toast.dismiss(toastId);
            onLogout();
          }}
        >
          Logout
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => {
            toast.dismiss(toastId);
            onExtend();
          }}
        >
          Extend Session
        </button>
      </div>
    </div>,
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      toastId: `session-timeout-${Date.now()}`
    }
  );
};

/**
 * Show permission denied alert
 * @param {string} action - Action that was denied
 */
export const showPermissionDenied = (action = 'this action') => {
  toast.error(
    <div className="p-2">
      <h4 className="font-semibold">Permission Denied</h4>
      <p>You do not have permission to perform {action}.</p>
    </div>,
    {
      position: 'top-center',
      autoClose: 5000,
      toastId: 'permission-denied'
    }
  );
};

/**
 * Show maintenance mode alert
 * @param {string} message - Maintenance message
 */
export const showMaintenanceMode = (message = 'The system is currently under maintenance. Please try again later.') => {
  toast.warning(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">System Maintenance</h3>
      <p className="text-gray-600">{message}</p>
    </div>,
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      toastId: 'maintenance-mode'
    }
  );
};

/**
 * Show feature coming soon alert
 * @param {string} feature - Feature name
 */
export const showComingSoon = (feature = 'This feature') => {
  toast.info(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
      <p className="text-gray-600">{feature} will be available in a future update.</p>
    </div>,
    {
      position: 'top-center',
      autoClose: 5000,
      toastId: 'coming-soon'
    }
  );
};

/**
 * Show unsaved changes warning
 * @param {Function} onSave - Save callback
 * @param {Function} onDiscard - Discard callback
 * @param {Function} onCancel - Cancel callback
 */
export const showUnsavedChangesWarning = (onSave, onDiscard, onCancel) => {
  showConfirmation(
    'Unsaved Changes',
    'You have unsaved changes. What would you like to do?',
    onSave,
    onCancel,
    {
      confirmText: 'Save',
      cancelText: 'Discard',
      type: 'warning'
    }
  );
};

/**
 * Show network error alert
 * @param {Function} onRetry - Retry callback
 */
export const showNetworkErrorAlert = (onRetry) => {
  const toastId = toast.error(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">Network Error</h3>
      <p className="text-gray-600 mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={() => toast.dismiss(toastId)}
        >
          Dismiss
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => {
            toast.dismiss(toastId);
            onRetry();
          }}
        >
          Retry
        </button>
      </div>
    </div>,
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      toastId: 'network-error'
    }
  );
};

/**
 * Show data validation errors
 * @param {Array} errors - Array of validation errors
 */
export const showValidationErrors = (errors) => {
  const toastId = toast.error(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">Validation Errors</h3>
      <ul className="text-gray-600 list-disc list-inside">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>,
    {
      position: 'top-center',
      autoClose: 7000,
      toastId: 'validation-errors'
    }
  );
};

/**
 * Show success alert with action
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {string} actionText - Action button text
 * @param {Function} onAction - Action callback
 */
export const showSuccessAlert = (title, message, actionText, onAction) => {
  const toastId = toast.success(
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={() => toast.dismiss(toastId)}
        >
          Close
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => {
            toast.dismiss(toastId);
            onAction();
          }}
        >
          {actionText}
        </button>
      </div>
    </div>,
    {
      position: 'top-center',
      autoClose: 5000,
      toastId: 'success-alert'
    }
  );
};

/**
 * Dismiss all alerts
 */
export const dismissAllAlerts = () => {
  toast.dismiss();
};
