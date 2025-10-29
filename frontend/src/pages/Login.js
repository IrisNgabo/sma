import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiTrendingUp, FiUsers, FiBarChart } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex items-center justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <FiShield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-white">Credit Jambo</h1>
              <p className="text-blue-200 text-sm">Savings Management</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Savings<br />Management App
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Empower your savings journey with intelligent management tools.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-white">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Customer Management</p>
                <p className="text-blue-200 text-sm">Comprehensive user database</p>
              </div>
            </div>
            
            <div className="flex items-center text-white">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                <FiShield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Device Verification</p>
                <p className="text-blue-200 text-sm">Secure access control</p>
              </div>
            </div>
            
            <div className="flex items-center text-white">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                <FiBarChart className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Analytics & Insights</p>
                <p className="text-blue-200 text-sm">Data-driven decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <FiShield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Credit Jambo</h1>
            <p className="text-gray-500">Savings Management</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your admin account to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Default credentials: admin@creditjambo.com / admin123
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
