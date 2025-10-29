/**
 * Data Formatting Utilities
 * Format dates, amounts, and other data for display
 */

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'RWF', locale = 'en-RW') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'RWF 0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format numbers with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    datetime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    },
    dateonly: { year: 'numeric', month: '2-digit', day: '2-digit' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(dateObj);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date, 'short');
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format status with styling
 * @param {string} status - Status string
 * @returns {object} Status object with text and styling
 */
export const formatStatus = (status) => {
  const statusMap = {
    active: { 
      text: 'Active', 
      color: 'text-green-600 bg-green-100',
      icon: '✓'
    },
    inactive: { 
      text: 'Inactive', 
      color: 'text-gray-600 bg-gray-100',
      icon: '○'
    },
    pending: { 
      text: 'Pending', 
      color: 'text-yellow-600 bg-yellow-100',
      icon: '⏳'
    },
    verified: { 
      text: 'Verified', 
      color: 'text-green-600 bg-green-100',
      icon: '✓'
    },
    unverified: { 
      text: 'Unverified', 
      color: 'text-red-600 bg-red-100',
      icon: '✗'
    },
    completed: { 
      text: 'Completed', 
      color: 'text-green-600 bg-green-100',
      icon: '✓'
    },
    failed: { 
      text: 'Failed', 
      color: 'text-red-600 bg-red-100',
      icon: '✗'
    },
    processing: { 
      text: 'Processing', 
      color: 'text-blue-600 bg-blue-100',
      icon: '⏳'
    },
    cancelled: { 
      text: 'Cancelled', 
      color: 'text-gray-600 bg-gray-100',
      icon: '○'
    }
  };
  
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  return statusMap[normalizedStatus] || { 
    text: capitalizeWords(status), 
    color: 'text-gray-600 bg-gray-100',
    icon: '?'
  };
};

/**
 * Format transaction type
 * @param {string} type - Transaction type
 * @returns {object} Formatted transaction type
 */
export const formatTransactionType = (type) => {
  const typeMap = {
    deposit: { 
      text: 'Deposit', 
      color: 'text-green-600 bg-green-100',
      icon: '↗'
    },
    withdrawal: { 
      text: 'Withdrawal', 
      color: 'text-red-600 bg-red-100',
      icon: '↘'
    },
    transfer: { 
      text: 'Transfer', 
      color: 'text-blue-600 bg-blue-100',
      icon: '↔'
    },
    fee: { 
      text: 'Fee', 
      color: 'text-orange-600 bg-orange-100',
      icon: '💰'
    },
    bonus: { 
      text: 'Bonus', 
      color: 'text-purple-600 bg-purple-100',
      icon: '🎁'
    }
  };
  
  const normalizedType = type?.toLowerCase() || 'unknown';
  return typeMap[normalizedType] || { 
    text: capitalizeWords(type), 
    color: 'text-gray-600 bg-gray-100',
    icon: '?'
  };
};

/**
 * Format user role
 * @param {string} role - User role
 * @returns {object} Formatted role
 */
export const formatRole = (role) => {
  const roleMap = {
    super_admin: { 
      text: 'Super Admin', 
      color: 'text-red-600 bg-red-100',
      icon: '👑'
    },
    admin: { 
      text: 'Admin', 
      color: 'text-blue-600 bg-blue-100',
      icon: '👤'
    },
    moderator: { 
      text: 'Moderator', 
      color: 'text-green-600 bg-green-100',
      icon: '👥'
    }
  };
  
  const normalizedRole = role?.toLowerCase() || 'unknown';
  return roleMap[normalizedRole] || { 
    text: capitalizeWords(role), 
    color: 'text-gray-600 bg-gray-100',
    icon: '?'
  };
};

/**
 * Format device status
 * @param {string} status - Device status
 * @returns {object} Formatted device status
 */
export const formatDeviceStatus = (status) => {
  const statusMap = {
    verified: { 
      text: 'Verified', 
      color: 'text-green-600 bg-green-100',
      icon: '✓'
    },
    unverified: { 
      text: 'Unverified', 
      color: 'text-red-600 bg-red-100',
      icon: '✗'
    },
    pending: { 
      text: 'Pending', 
      color: 'text-yellow-600 bg-yellow-100',
      icon: '⏳'
    },
    rejected: { 
      text: 'Rejected', 
      color: 'text-gray-600 bg-gray-100',
      icon: '✗'
    }
  };
  
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  return statusMap[normalizedStatus] || { 
    text: capitalizeWords(status), 
    color: 'text-gray-600 bg-gray-100',
    icon: '?'
  };
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format balance with currency
 * @param {number} balance - Balance amount
 * @param {string} currency - Currency code
 * @returns {string} Formatted balance
 */
export const formatBalance = (balance, currency = 'USD') => {
  return formatCurrency(balance, currency);
};

/**
 * Format transaction amount
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type
 * @returns {string} Formatted amount with sign
 */
export const formatTransactionAmount = (amount, type) => {
  const formattedAmount = formatCurrency(Math.abs(amount));
  
  if (type === 'deposit' || type === 'bonus') {
    return `+${formattedAmount}`;
  } else if (type === 'withdrawal' || type === 'fee') {
    return `-${formattedAmount}`;
  }
  
  return formattedAmount;
};

/**
 * Format device ID to a short, readable form
 * e.g., ab12cd...9f30
 * @param {string} deviceId
 * @param {number} startLen
 * @param {number} endLen
 * @returns {string}
 */
export const formatDeviceIdShort = (deviceId, startLen = 6, endLen = 4) => {
  if (!deviceId || deviceId.length <= startLen + endLen + 3) return deviceId || '';
  return `${deviceId.slice(0, startLen)}...${deviceId.slice(-endLen)}`;
};

/**
 * Format ID with prefix
 * @param {string} id - ID string
 * @param {string} prefix - Prefix to add
 * @returns {string} Formatted ID
 */
export const formatId = (id, prefix = 'ID') => {
  if (!id) return '';
  return `${prefix}-${id}`;
};

/**
 * Format duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

/**
 * Format count with proper pluralization
 * @param {number} count - Count number
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional)
 * @returns {string} Formatted count
 */
export const formatCount = (count, singular, plural = null) => {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? `1 ${singular}` : `${count} ${pluralForm}`;
};
