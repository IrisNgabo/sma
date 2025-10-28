const { User, Transaction } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     AnalyticsData:
 *       type: object
 *       properties:
 *         totalDeposits:
 *           type: number
 *         totalWithdrawals:
 *           type: number
 *         netBalance:
 *           type: number
 *         activeCustomers:
 *           type: integer
 *         pendingVerifications:
 *           type: integer
 *         transactionsToday:
 *           type: integer
 *         transactionsThisMonth:
 *           type: integer
 *         averageTransactionAmount:
 *           type: number
 *         topCustomers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *         recentTransactions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               customerName:
 *                 type: string
 *               createdAt:
 *                 type: string
 */

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, year]
 *           default: month
 *         description: Analytics period
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AnalyticsData'
 */
const getDashboardAnalytics = async (req, res) => {
  try {
    const period = req.query.period || 'month';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get basic statistics
    const [
      totalDeposits,
      totalWithdrawals,
      activeCustomers,
      pendingVerifications,
      transactionsCount,
      averageTransactionAmount
    ] = await Promise.all([
      Transaction.sum('amount', {
        where: {
          type: 'deposit',
          status: 'completed',
          createdAt: { [Op.gte]: startDate }
        }
      }),
      Transaction.sum('amount', {
        where: {
          type: 'withdrawal',
          status: 'completed',
          createdAt: { [Op.gte]: startDate }
        }
      }),
      User.count({
        where: {
          isActive: true,
          lastLogin: { [Op.gte]: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      User.count({
        where: { isVerified: false, isActive: true }
      }),
      Transaction.count({
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: startDate }
        }
      }),
      Transaction.findAll({
        attributes: [
          [require('sequelize').fn('AVG', require('sequelize').col('amount')), 'avgAmount']
        ],
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: startDate }
        },
        raw: true
      })
    ]);

    // Get top customers by balance
    const topCustomers = await User.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'balance'],
      order: [['balance', 'DESC']],
      limit: 5
    });

    // Get recent transactions
    const recentTransactions = await Transaction.findAll({
      where: { status: 'completed' },
      attributes: ['id', 'type', 'amount', 'createdAt'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const netBalance = (totalDeposits || 0) - (totalWithdrawals || 0);
    const avgAmount = averageTransactionAmount[0]?.avgAmount || 0;

    res.status(200).json({
      success: true,
      message: 'Dashboard analytics retrieved successfully',
      data: {
        totalDeposits: totalDeposits || 0,
        totalWithdrawals: totalWithdrawals || 0,
        netBalance,
        activeCustomers,
        pendingVerifications,
        transactionsCount,
        averageTransactionAmount: parseFloat(avgAmount) || 0,
        topCustomers,
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          customerName: t.user?.name || 'Unknown',
          createdAt: t.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /analytics/transactions:
 *   get:
 *     summary: Get transaction analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics
 *     responses:
 *       200:
 *         description: Transaction analytics retrieved successfully
 */
const getTransactionAnalytics = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const [
      totalTransactions,
      completedTransactions,
      failedTransactions,
      pendingTransactions,
      depositsByDay,
      withdrawalsByDay
    ] = await Promise.all([
      Transaction.count({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      }),
      Transaction.count({
        where: {
          status: 'completed',
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      }),
      Transaction.count({
        where: {
          status: 'failed',
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      }),
      Transaction.count({
        where: {
          status: 'pending',
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      }),
      Transaction.findAll({
        attributes: [
          [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
          [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
        ],
        where: {
          type: 'deposit',
          status: 'completed',
          createdAt: { [Op.between]: [startDate, endDate] }
        },
        group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
        order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']],
        raw: true
      }),
      Transaction.findAll({
        attributes: [
          [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
          [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
        ],
        where: {
          type: 'withdrawal',
          status: 'completed',
          createdAt: { [Op.between]: [startDate, endDate] }
        },
        group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
        order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']],
        raw: true
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Transaction analytics retrieved successfully',
      data: {
        totalTransactions,
        completedTransactions,
        failedTransactions,
        pendingTransactions,
        depositsByDay,
        withdrawalsByDay
      }
    });
  } catch (error) {
    console.error('Get transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /analytics/customers:
 *   get:
 *     summary: Get customer analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer analytics retrieved successfully
 */
const getCustomerAnalytics = async (req, res) => {
  try {
    const [
      totalCustomers,
      verifiedCustomers,
      unverifiedCustomers,
      newCustomersThisMonth,
      activeCustomersThisMonth,
      customersByBalance
    ] = await Promise.all([
      User.count({ where: { isActive: true } }),
      User.count({ where: { isVerified: true, isActive: true } }),
      User.count({ where: { isVerified: false, isActive: true } }),
      User.count({
        where: {
          isActive: true,
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      User.count({
        where: {
          isActive: true,
          lastLogin: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      User.findAll({
        attributes: [
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          [require('sequelize').literal(`
            CASE 
              WHEN balance > 1000 THEN 1
              WHEN balance > 500 THEN 2
              WHEN balance > 100 THEN 3
              ELSE 4
            END
          `), 'balanceRange']
        ],
        where: { isActive: true },
        group: ['balanceRange'],
        raw: true
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Customer analytics retrieved successfully',
      data: {
        totalCustomers,
        verifiedCustomers,
        unverifiedCustomers,
        newCustomersThisMonth,
        activeCustomersThisMonth,
        customersByBalance
      }
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getTransactionAnalytics,
  getCustomerAnalytics
};
