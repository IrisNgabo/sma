import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { setToken, getToken, removeToken, isTokenExpired } from "../utils";

// Initial state

const initialState = {
  isAuthenticated: false, // whether admin is logged in
  admin: null, // admin user data
  loading: true, // loading state for auth
  error: null, // error messages
};

// Action types

const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer function

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, loading: true, error: null };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create Auth Context

const AuthContext = createContext();

// Auth Provider Component

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      verifyToken(); // verify token with server
    } else {
      // Token expired or missing
      if (token) removeToken();
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Verify token with server

  const verifyToken = async () => {
    try {
      const response = await api.get("/admin/profile");
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      // Invalid token
      removeToken();
      delete api.defaults.headers.common["Authorization"];
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Login function

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await api.post("/admin/login", credentials);
      const { data } = response.data;

      // Store token in localStorage
      setToken(data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data });
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function

  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      delete api.defaults.headers.common["Authorization"];
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.info("Logged out successfully");
    }
  };

  // Clear error function

  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

  // Context value

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
