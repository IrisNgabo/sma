import React, { useState, useEffect } from 'react';
import { FiShield, FiCheck, FiX, FiRefreshCw, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { deviceAPI } from '../services/api';

const DeviceVerification = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(new Set());
  const [selectedDevices, setSelectedDevices] = useState(new Set());
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUnverifiedDevices();
    fetchStats();
  }, []);

  const fetchUnverifiedDevices = async () => {
    try {
      setLoading(true);
      const response = await deviceAPI.getUnverified();
      setDevices(response.data.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to fetch unverified devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await deviceAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleVerifyDevice = async (userId) => {
    try {
      setVerifying(prev => new Set([...prev, userId]));
      await deviceAPI.verifyDevice(userId);
      
      // Remove device from list
      setDevices(prev => prev.filter(device => device.id !== userId));
      setSelectedDevices(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      
      toast.success('Device verified successfully');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error verifying device:', error);
      toast.error('Failed to verify device');
    } finally {
      setVerifying(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleBatchVerify = async () => {
    if (selectedDevices.size === 0) {
      toast.warning('Please select devices to verify');
      return;
    }

    try {
      setVerifying(prev => new Set([...prev, ...selectedDevices]));
      await deviceAPI.verifyBatch(Array.from(selectedDevices));
      
      // Remove verified devices from list
      setDevices(prev => prev.filter(device => !selectedDevices.has(device.id)));
      setSelectedDevices(new Set());
      
      toast.success(`${selectedDevices.size} devices verified successfully`);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error batch verifying devices:', error);
      toast.error('Failed to verify devices');
    } finally {
      setVerifying(new Set());
    }
  };

  const handleSelectDevice = (deviceId) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDevices.size === devices.length) {
      setSelectedDevices(new Set());
    } else {
      setSelectedDevices(new Set(devices.map(device => device.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Verification</h1>
          <p className="text-gray-600">Review and verify customer devices</p>
        </div>
        <button
          onClick={fetchUnverifiedDevices}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiRefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiShield className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Devices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiCheck className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiX className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Unverified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unverified}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiCalendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingToday}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Actions */}
      {devices.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDevices.size === devices.length && devices.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Select All ({selectedDevices.size} selected)
              </label>
            </div>
            {selectedDevices.size > 0 && (
              <button
                onClick={handleBatchVerify}
                disabled={verifying.size > 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <FiCheck className="h-4 w-4 mr-2" />
                Verify Selected ({selectedDevices.size})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Devices List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Unverified Devices ({devices.length})
          </h3>
          
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <FiShield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No unverified devices found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDevices.has(device.id)}
                        onChange={() => handleSelectDevice(device.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {device.name}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{device.email}</span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Device ID: {device.deviceId}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Registered: {new Date(device.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVerifyDevice(device.id)}
                        disabled={verifying.has(device.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {verifying.has(device.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <FiCheck className="h-4 w-4 mr-2" />
                        )}
                        {verifying.has(device.id) ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceVerification;
