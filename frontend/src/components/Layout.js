import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import {
  FiHome,
  FiUsers,
  FiShield,
  FiBarChart,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Layout = () => {
  // Sidebar and collapse states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth context and navigation
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar navigation links
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Device Verification', href: '/devices', icon: FiShield },
    { name: 'Customer Management', href: '/customers', icon: FiUsers },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart },
  ];

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Highlight the active route
  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* ===================== SIDEBAR ===================== */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar header (logo + collapse button) */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {/* Logo and app title */}
          {!sidebarCollapsed && (
            <div className="flex items-center min-w-0">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FiShield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  Savings MA
                </h1>
                <p className="text-sm text-gray-500 truncate">Admin Panel</p>
              </div>
            </div>
          )}

          {/* Collapsed sidebar icon */}
          {sidebarCollapsed && (
            <div className="flex items-center justify-center w-full">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiShield className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          {/* Sidebar toggle controls */}
          <div className="flex items-center space-x-2">
            {/* Collapse button (desktop only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <FiChevronRight className="h-5 w-5" />
              ) : (
                <FiChevronLeft className="h-5 w-5" />
              )}
            </button>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Sidebar navigation links */}
        <nav className="mt-5 px-2 pb-24">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center ${
                    sidebarCollapsed ? 'justify-center px-2' : 'px-2'
                  } py-3 text-sm font-medium rounded-lg transition-all ${
                    isCurrentPath(item.href)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      sidebarCollapsed ? '' : 'mr-3'
                    } ${
                      isCurrentPath(item.href)
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                </a>
              );
            })}
          </div>
        </nav>

        {/* ===================== USER SECTION ===================== */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t border-gray-200 ${
            sidebarCollapsed ? 'p-2' : 'p-4'
          }`}
        >
          {/* Compact user layout when collapsed */}
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            // Full user profile view
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <FiUser className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {admin?.role || 'Administrator'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== MOBILE SIDEBAR OVERLAY ===================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <FiMenu className="h-6 w-6" />
              </button>

              {/* Current page title */}
              <h2 className="text-xl font-bold text-gray-900">
                {navigation.find(item => isCurrentPath(item.href))?.name || 'Dashboard'}
              </h2>
            </div>

            {/* Admin info (top-right) */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {admin?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {admin?.role || 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Outlet renders the current page's component */}
        <main className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
