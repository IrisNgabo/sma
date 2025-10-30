
import React, { useState, useEffect } from 'react';
import { FiBarChart3, FiTrendingUp, FiTrendingDown, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsAPI } from '../services/api';
import { formatCurrency } from '../utils/format';


/**
 * Analytics Dashboard
 *
 * Displays financial metrics, charts, and customer insights.
 * Fetches data from the backend using `analyticsAPI` and updates
 * dynamically based on selected time periods (day, week, month, year).
 */

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchTrends();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard({ period });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const now = new Date();
      // Last 7 days for daily trends
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const response = await analyticsAPI.getTransactions({
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10)
      });

      const depositsMap = new Map(response.data.data.depositsByDay.map(d => [d.date, Number(d.total)]));
      const withdrawalsMap = new Map(response.data.data.withdrawalsByDay.map(d => [d.date, Number(d.total)]));

      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        data.push({
          name: days[d.getDay()],
          deposits: depositsMap.get(key) || 0,
          withdrawals: withdrawalsMap.get(key) || 0
        });
      }
      setTrends(data);
    } catch (e) {
      console.error('Error fetching trends:', e);
      setTrends([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <FiCalendar className="h-5 w-5 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiDollarSign className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Deposits
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(analytics?.totalDeposits)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiTrendingDown className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Withdrawals
                </dt>
                <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics?.totalWithdrawals)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiTrendingUp className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Net Balance
                </dt>
                <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics?.netBalance)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Customers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics?.activeCustomers || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trends */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="deposits" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="withdrawals" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Distribution */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Verified', value: analytics?.activeCustomers || 0, color: '#10B981' },
                    { name: 'Unverified', value: analytics?.pendingVerifications || 0, color: '#F59E0B' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Verified', value: analytics?.activeCustomers || 0, color: '#10B981' },
                    { name: 'Unverified', value: analytics?.pendingVerifications || 0, color: '#F59E0B' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {analytics?.recentTransactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {analytics?.topCustomers?.slice(0, 5).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(customer.balance)}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No customer data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {analytics?.transactionsCount || 0}
            </div>
            <div className="text-sm text-gray-500">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.averageTransactionAmount)}</div>
            <div className="text-sm text-gray-500">Average Transaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {analytics?.pendingVerifications || 0}
            </div>
            <div className="text-sm text-gray-500">Pending Verifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
