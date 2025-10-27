/**
 * JWT Token Management
 * Handles JWT tokens in memory and localStorage
 */

// Token storage keys
const TOKEN_KEY = 'credit_jambo_auth_token';
const REFRESH_TOKEN_KEY = 'credit_jambo_refresh_token';

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token
 * @param {string} refreshToken - Refresh token (optional)
 */
export const setToken = (token, refreshToken = null) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Check if token exists
 * @returns {boolean} True if token exists
 */
export const hasToken = () => {
  return getToken() !== null;
};

/**
 * Decode JWT token payload (without verification)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
export const getTokenExpiration = (token) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return null;
    
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Get time until token expires (in minutes)
 * @param {string} token - JWT token
 * @returns {number} Minutes until expiration
 */
export const getTimeUntilExpiration = (token) => {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) return 0;
    
    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  } catch (error) {
    console.error('Error calculating time until expiration:', error);
    return 0;
  }
};

/**
 * Check if token needs refresh (expires within 5 minutes)
 * @param {string} token - JWT token
 * @returns {boolean} True if token needs refresh
 */
export const needsRefresh = (token) => {
  return getTimeUntilExpiration(token) <= 5;
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|null} User ID or null
 */
export const getUserIdFromToken = (token) => {
  try {
    const payload = decodeToken(token);
    return payload?.id || payload?.userId || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} User role or null
 */
export const getUserRoleFromToken = (token) => {
  try {
    const payload = decodeToken(token);
    return payload?.role || null;
  } catch (error) {
    console.error('Error getting user role from token:', error);
    return null;
  }
};

/**
 * Validate token format
 * @param {string} token - JWT token
 * @returns {boolean} True if token format is valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  removeToken();
};

/**
 * Get token info (for debugging)
 * @param {string} token - JWT token
 * @returns {object} Token information
 */
export const getTokenInfo = (token) => {
  const payload = decodeToken(token);
  const expiration = getTokenExpiration(token);
  const timeUntilExpiration = getTimeUntilExpiration(token);
  
  return {
    isValid: isValidTokenFormat(token) && !isTokenExpired(token),
    isExpired: isTokenExpired(token),
    needsRefresh: needsRefresh(token),
    expiration,
    timeUntilExpiration,
    userId: getUserIdFromToken(token),
    role: getUserRoleFromToken(token),
    payload
  };
};
